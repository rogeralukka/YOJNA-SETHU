import { EntityType, ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError, ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';
import { EligibilityService } from './EligibilityService';
import { AuditService } from './AuditService';
import { NotificationService } from './NotificationService';

export interface SubmitApplicationInput {
  schemeIds: string[];
  businessCardId?: string | null;
  additionalDetails?: Record<string, any>;
}

export class ApplicationService {
  static async submitBulkApplication(
    userId: string,
    input: SubmitApplicationInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const { schemeIds, businessCardId, additionalDetails } = input;

    if (!schemeIds || schemeIds.length === 0) {
      throw new ValidationError('At least one scheme ID must be provided');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 1. Verify business card ownership if provided
    let businessCard = null;
    if (businessCardId) {
      businessCard = await prisma.businessCard.findFirst({
        where: { id: businessCardId },
      });
      if (!businessCard) {
        throw new NotFoundError('Specified business card not found');
      }
      if (businessCard.userId !== userId) {
        throw new ForbiddenError('Unauthorized: You do not own the specified business card');
      }
    }

    // 2. Fetch and validate schemes
    const schemes = await prisma.scheme.findMany({
      where: {
        OR: [{ id: { in: schemeIds } }, { schemeId: { in: schemeIds } }],
      },
    });

    if (schemes.length !== schemeIds.length) {
      throw new NotFoundError('One or more requested schemes do not exist');
    }

    const now = new Date();
    for (const scheme of schemes) {
      // 3. Verify scheme is active
      if (!scheme.isActive) {
        throw new AppError(`Scheme ${scheme.name} is currently inactive`, 400, 'SCHEME_INACTIVE');
      }

      // 4. Verify scheme deadline
      if (scheme.deadline && scheme.deadline < now) {
        throw new AppError(
          `Application failed: The deadline for ${scheme.name} has passed`,
          400,
          'SCHEME_DEADLINE_PASSED'
        );
      }

      // 5. Verify eligibility server-side
      const evaluation = EligibilityService.evaluate(
        user,
        scheme.rulesJson || { minAge: scheme.minAge, maxAge: scheme.maxAge, maxIncome: scheme.maxIncome },
        (scheme as any).documentRequirements || [],
        scheme.isBusinessScheme,
        businessCard
      );

      if (!evaluation.eligible) {
        throw new AppError(
          `Ineligible for ${scheme.name}: ${evaluation.reasons.join(', ')}`,
          400,
          'NOT_ELIGIBLE',
          { missingRequirements: evaluation.missingRequirements }
        );
      }
    }

    // 6. Check for duplicate active (PENDING) applications
    const existingApplications = await prisma.application.findMany({
      where: {
        userId,
        status: ApplicationStatus.PENDING,
      },
    });

    for (const existingApp of existingApplications) {
      const existingSchemeIds = Array.isArray(existingApp.schemeIds)
        ? (existingApp.schemeIds as string[])
        : [];
      const hasOverlap = schemeIds.some((id) => existingSchemeIds.includes(id));
      if (hasOverlap) {
        throw new ConflictError(
          'DUPLICATE_APPLICATION: You already have a pending application for one or more of these schemes'
        );
      }
    }

    const isAnyBusinessScheme = schemes.some((s) => s.isBusinessScheme);
    const entityType = isAnyBusinessScheme ? EntityType.BUSINESS : EntityType.PERSONAL;

    // 7. Transactional creation
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          userId,
          businessCardId: businessCardId || null,
          schemeIds,
          entityType,
          status: ApplicationStatus.PENDING,
          additionalDetails: additionalDetails || undefined,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          type: 'APPLICATION_SUBMITTED',
          title: 'Application Submitted Successfully',
          message: `Your application (ID: ${application.applicationId}) for ${schemes.length} scheme(s) has been submitted for review.`,
        },
      });

      return application;
    });

    await AuditService.log({
      actorUserId: userId,
      action: 'APPLICATION_SUBMITTED',
      resourceType: 'Application',
      resourceId: result.id,
      ipAddress,
      userAgent,
      metadata: { schemeIds, entityType },
    });

    return result;
  }

  static async getUserApplications(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        businessCard: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  static async getApplicationById(applicationId: string, authenticatedUserId: string, isStaff: boolean) {
    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id: applicationId }, { applicationId }],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, state: true, category: true },
        },
        businessCard: true,
      },
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (!isStaff && application.userId !== authenticatedUserId) {
      throw new ForbiddenError('Unauthorized: You do not have access to view this application');
    }

    return application;
  }

  static async adminListApplications(options: {
    status?: ApplicationStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, search, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { applicationId: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, state: true, category: true },
          },
          businessCard: true,
        },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async approveApplication(
    applicationId: string,
    adminUserId: string,
    comment?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const app = await prisma.application.findFirst({
      where: { OR: [{ id: applicationId }, { applicationId }] },
    });

    if (!app) {
      throw new NotFoundError('Application not found');
    }

    if (app.status !== ApplicationStatus.PENDING) {
      throw new AppError(`Cannot approve application with status ${app.status}`, 400, 'INVALID_STATUS');
    }

    const now = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      const approvedApp = await tx.application.update({
        where: { id: app.id },
        data: {
          status: ApplicationStatus.APPROVED,
          adminComment: comment || null,
          approvedAt: now,
        },
      });

      await tx.notification.create({
        data: {
          userId: app.userId,
          type: 'APPLICATION_APPROVED',
          title: 'Application Approved!',
          message: `Your application ${app.applicationId} has been approved by the admin. ${comment ? `Remark: ${comment}` : ''}`,
        },
      });

      return approvedApp;
    });

    await AuditService.log({
      actorUserId: adminUserId,
      action: 'APPLICATION_APPROVED',
      resourceType: 'Application',
      resourceId: updated.id,
      ipAddress,
      userAgent,
      metadata: { adminComment: comment },
    });

    return updated;
  }

  static async rejectApplication(
    applicationId: string,
    adminUserId: string,
    comment: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    if (!comment || comment.trim().length === 0) {
      throw new ValidationError('A mandatory rejection comment/reason must be provided when rejecting an application');
    }

    const app = await prisma.application.findFirst({
      where: { OR: [{ id: applicationId }, { applicationId }] },
    });

    if (!app) {
      throw new NotFoundError('Application not found');
    }

    if (app.status !== ApplicationStatus.PENDING) {
      throw new AppError(`Cannot reject application with status ${app.status}`, 400, 'INVALID_STATUS');
    }

    const now = new Date();

    const updated = await prisma.$transaction(async (tx) => {
      const rejectedApp = await tx.application.update({
        where: { id: app.id },
        data: {
          status: ApplicationStatus.REJECTED,
          adminComment: comment.trim(),
          rejectedAt: now,
        },
      });

      await tx.notification.create({
        data: {
          userId: app.userId,
          type: 'APPLICATION_REJECTED',
          title: 'Application Rejected',
          message: `Your application ${app.applicationId} was not approved. Reason: ${comment.trim()}`,
        },
      });

      return rejectedApp;
    });

    await AuditService.log({
      actorUserId: adminUserId,
      action: 'APPLICATION_REJECTED',
      resourceType: 'Application',
      resourceId: updated.id,
      ipAddress,
      userAgent,
      metadata: { adminComment: comment },
    });

    return updated;
  }
}
