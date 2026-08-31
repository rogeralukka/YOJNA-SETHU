import { prisma } from '../db/prisma.js';
import { notifyApplicationSubmitted } from '../services/notificationService.js';
import { emailService } from '../services/emailService.js';
import { parseJsonSafe, stringifyJsonSafe } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const applySchemes = async (req, res, next) => {
  try {
    const { schemeIds, entity = 'personal', businessCardId, additionalFields = {} } = req.body;

    if (!schemeIds || !Array.isArray(schemeIds) || schemeIds.length === 0) {
      return sendError(res, 'Please select at least one scheme to apply.', 400);
    }

    // Validate businessCardId if applying as business
    let businessCard = null;
    if (entity === 'business') {
      if (!businessCardId) {
        return sendError(res, 'Business selection is required for business scheme applications.', 400);
      }
      businessCard = await prisma.businessCard.findFirst({
        where: { id: businessCardId, userId: req.user.id }
      });
      if (!businessCard) {
        return sendError(res, 'Selected business profile not found or unauthorized.', 404);
      }
    }

    // Fetch user details with bank info and documents
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        documents: true
      }
    });

    // Fetch schemes to apply for
    const schemes = await prisma.scheme.findMany({
      where: {
        id: { in: schemeIds },
        isActive: true
      }
    });

    if (schemes.length === 0) {
      return sendError(res, 'No valid or active schemes found for the provided IDs.', 404);
    }

    // Check if user already applied to any of these schemes under the same entity
    const existingApplications = await prisma.application.findMany({
      where: {
        userId: req.user.id,
        schemeId: { in: schemeIds },
        entity,
        ...(entity === 'business' ? { businessCardId } : {})
      },
      include: { scheme: true }
    });

    if (existingApplications.length > 0) {
      const alreadyAppliedNames = existingApplications.map(a => a.scheme.name).join(', ');
      return sendError(
        res,
        `You have already submitted an application for: ${alreadyAppliedNames}`,
        400,
        { existingApplicationIds: existingApplications.map(a => a.id) }
      );
    }

    // Build snapshot payload
    const snapshot = {
      applicant: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        category: user.category,
        state: user.state,
        annualIncome: user.annualIncome,
        age: user.age,
        gender: user.gender
      },
      bankDetails: {
        accountHolderName: user.accountHolderName,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        bankName: user.bankName
      },
      business: businessCard ? {
        id: businessCard.id,
        name: businessCard.name,
        type: businessCard.type,
        gstNumber: businessCard.gstNumber,
        panNumber: businessCard.panNumber,
        address: businessCard.address,
        phone: businessCard.phone,
        email: businessCard.email,
        turnover: businessCard.turnover,
        employeeCount: businessCard.employeeCount,
        industryCategory: businessCard.industryCategory,
        yearsInOperation: businessCard.yearsInOperation,
        udyamNumber: businessCard.udyamNumber
      } : null,
      documents: user.documents.map(d => ({
        id: d.id,
        docType: d.docType,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        mimeType: d.mimeType,
        uploadedAt: d.uploadedAt
      })),
      additionalFields
    };

    const createdApplications = [];

    for (const scheme of schemes) {
      const application = await prisma.application.create({
        data: {
          userId: user.id,
          schemeId: scheme.id,
          entity,
          businessCardId: entity === 'business' ? businessCardId : null,
          status: 'pending',
          snapshotData: stringifyJsonSafe(snapshot)
        },
        include: {
          scheme: true,
          businessCard: true
        }
      });

      // Dispatch in-app notification & transactional email receipt
      notifyApplicationSubmitted(user.id, application.id, scheme.name).catch(e => console.error(e));
      emailService.sendApplicationSubmittedEmail(user, scheme.name, application.id).catch(e => console.error(e));

      createdApplications.push(application);
    }

    return sendSuccess(
      res,
      createdApplications,
      `Successfully submitted ${createdApplications.length} application(s).`,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const {
      search,
      entity = 'all', // 'all' | 'personal' | 'business'
      status = 'all', // 'all' | 'pending' | 'approved' | 'rejected'
      sortBy = 'latest' // 'latest' | 'status'
    } = req.query;

    const whereClause = {
      userId: req.user.id
    };

    if (entity !== 'all') {
      whereClause.entity = entity;
    }

    if (status !== 'all') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.scheme = {
        name: { contains: search }
      };
    }

    let orderBy = { appliedAt: 'desc' };
    if (sortBy === 'status') {
      orderBy = { status: 'asc' };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        scheme: {
          select: {
            id: true,
            name: true,
            department: true,
            category: true,
            deadline: true,
            isBusinessScheme: true
          }
        },
        businessCard: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy
    });

    const formatted = applications.map(app => ({
      id: app.id,
      schemeId: app.schemeId,
      schemeName: app.scheme.name,
      department: app.scheme.department,
      category: app.scheme.category,
      entity: app.entity === 'personal' ? 'You' : (app.businessCard?.name || 'Business'),
      entityType: app.entity,
      status: app.status,
      adminComment: app.status === 'rejected' ? app.adminComment : null,
      appliedOn: app.appliedAt,
      lastUpdated: app.updatedAt
    }));

    return sendSuccess(res, formatted, 'Applications retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        scheme: true,
        businessCard: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true,
            category: true,
            state: true,
            annualIncome: true,
            age: true,
            gender: true
          }
        }
      }
    });

    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }

    // Access check: User must own the application or be admin/super_admin
    if (req.user.role === 'user' && application.userId !== req.user.id) {
      return sendError(res, 'Unauthorized access to application details.', 403);
    }

    const parsedSnapshot = parseJsonSafe(application.snapshotData, {});

    const timeline = [
      {
        title: 'Application Submitted',
        date: application.appliedAt,
        status: 'completed',
        description: 'Your application was recorded in the system.'
      },
      {
        title: 'Under Review',
        date: application.updatedAt,
        status: application.status === 'pending' ? 'in_progress' : 'completed',
        description: 'Administrative verification of submitted documents and criteria.'
      }
    ];

    if (application.status === 'approved') {
      timeline.push({
        title: 'Application Approved 🎉',
        date: application.updatedAt,
        status: 'completed',
        description: 'Sanction order approved by department.'
      });
    } else if (application.status === 'rejected') {
      timeline.push({
        title: 'Application Rejected',
        date: application.updatedAt,
        status: 'rejected',
        description: application.adminComment || 'Did not meet requirements.'
      });
    }

    return sendSuccess(res, {
      ...application,
      scheme: {
        ...application.scheme,
        states: parseJsonSafe(application.scheme.states, ['All']),
        categories: parseJsonSafe(application.scheme.categories, ['All']),
        businessTypes: parseJsonSafe(application.scheme.businessTypes, ['All']),
        documentsRequired: parseJsonSafe(application.scheme.documentsRequired, [])
      },
      snapshotData: parsedSnapshot,
      timeline
    }, 'Application details retrieved.');
  } catch (error) {
    next(error);
  }
};

export const exportMyApplicationsCSV = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        scheme: true,
        businessCard: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    const headers = [
      'Application ID',
      'Scheme Name',
      'Department',
      'Category',
      'Entity',
      'Status',
      'Admin Remarks',
      'Applied Date'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = applications.map(app => [
      escapeCsv(app.id),
      escapeCsv(app.scheme?.name),
      escapeCsv(app.scheme?.department),
      escapeCsv(app.scheme?.category),
      escapeCsv(app.entity === 'personal' ? 'Personal' : (app.businessCard?.name || 'Business')),
      escapeCsv(app.status.toUpperCase()),
      escapeCsv(app.adminComment || 'None'),
      escapeCsv(new Date(app.appliedAt).toISOString())
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=my-applications-${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    next(error);
  }
};
