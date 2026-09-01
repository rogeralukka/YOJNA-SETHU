import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { EligibilityService } from './EligibilityService';
import { AuditService } from './AuditService';
import { NotificationService } from './NotificationService';
import { SchemeRepository } from '../repositories/scheme.repository';
import { SchemeService as RefactoredSchemeService } from './scheme.service';

export interface SchemeQueryOptions {
  category?: string;
  state?: string;
  age?: number;
  income?: number;
  isBusinessScheme?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class SchemeService {
  static async createScheme(data: any, actorUserId: string, ipAddress?: string, userAgent?: string) {
    const formatted = await RefactoredSchemeService.createScheme(data, actorUserId);

    await AuditService.log({
      actorUserId,
      action: 'SCHEME_CREATED',
      resourceType: 'Scheme',
      resourceId: formatted.id,
      ipAddress,
      userAgent,
      metadata: { schemeId: formatted.schemeId, name: formatted.name },
    });

    return formatted;
  }

  static async updateScheme(schemeIdStr: string, data: any, actorUserId: string, ipAddress?: string, userAgent?: string) {
    const updated = await RefactoredSchemeService.updateScheme(schemeIdStr, data, actorUserId);

    await AuditService.log({
      actorUserId,
      action: 'SCHEME_UPDATED',
      resourceType: 'Scheme',
      resourceId: updated.id,
      ipAddress,
      userAgent,
    });

    return updated;
  }

  static async deleteScheme(schemeIdStr: string, actorUserId: string, ipAddress?: string, userAgent?: string) {
    const archived = await RefactoredSchemeService.archiveScheme(schemeIdStr, actorUserId);

    await AuditService.log({
      actorUserId,
      action: 'SCHEME_DEACTIVATED',
      resourceType: 'Scheme',
      resourceId: archived.id,
      ipAddress,
      userAgent,
    });

    return archived;
  }

  static async getSchemeById(schemeIdStr: string) {
    return RefactoredSchemeService.getSchemeById(schemeIdStr);
  }

  static async querySchemes(options: SchemeQueryOptions) {
    return RefactoredSchemeService.querySchemes({
      category: options.category,
      state: options.state,
      income: options.income,
      q: options.search,
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy as any,
      sortOrder: options.sortOrder,
    });
  }

  static async getEligibleSchemesForUser(userId: string, businessCardId?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let businessCard = null;
    if (businessCardId) {
      businessCard = await prisma.businessCard.findFirst({
        where: { id: businessCardId, userId },
      });
    }

    const allSchemesResult = await SchemeRepository.findMany({ limit: 100, deadline: 'active' });

    const evaluatedSchemes = allSchemesResult.schemes.map((scheme) => {
      const evaluation = EligibilityService.evaluate(
        user,
        scheme.rulesJson || { minAge: scheme.minAge, maxAge: scheme.maxAge, maxIncome: scheme.maxIncome },
        scheme.documentRequirements || [],
        scheme.isBusinessScheme,
        businessCard
      );

      return {
        scheme,
        eligibility: evaluation,
      };
    });

    return evaluatedSchemes;
  }
}
