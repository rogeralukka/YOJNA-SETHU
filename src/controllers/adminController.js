import { prisma } from '../db/prisma.js';
import { notifyApplicationStatusChange } from '../services/notificationService.js';
import { logAudit } from '../services/auditService.js';
import { emailService } from '../services/emailService.js';
import { backupService } from '../services/backupService.js';
import { cacheService } from '../services/cacheService.js';
import { parseJsonSafe } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const cacheKey = 'admin:dashboard:stats';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return sendSuccess(res, cached, 'Admin dashboard metrics retrieved from cache.');
    }

    const [
      totalUsers,
      totalBusinesses,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.businessCard.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'pending' } }),
      prisma.application.count({ where: { status: 'approved' } }),
      prisma.application.count({ where: { status: 'rejected' } })
    ]);

    // Applications by Scheme Category (Pie Chart)
    const applicationsByCategoryRaw = await prisma.application.findMany({
      select: {
        scheme: {
          select: { category: true }
        }
      }
    });

    const categoryMap = {};
    applicationsByCategoryRaw.forEach(app => {
      const cat = app.scheme?.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const applicationsByCategory = Object.keys(categoryMap).map(category => ({
      category,
      count: categoryMap[category],
      percentage: totalApplications > 0 ? Math.round((categoryMap[category] / totalApplications) * 100) : 0
    }));

    // Top 5 Most Applied Schemes (Bar Chart)
    const topSchemesRaw = await prisma.scheme.findMany({
      select: {
        id: true,
        name: true,
        department: true,
        category: true,
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        applications: {
          _count: 'desc'
        }
      },
      take: 5
    });

    const top5Schemes = topSchemesRaw.map(s => ({
      schemeId: s.id,
      schemeName: s.name,
      department: s.department,
      category: s.category,
      applicationCount: s._count.applications
    }));

    // Applications Trend (Monthly Timeline / Line Chart)
    const allApplications = await prisma.application.findMany({
      select: { appliedAt: true, status: true },
      orderBy: { appliedAt: 'asc' }
    });

    const trendMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    allApplications.forEach(app => {
      const date = new Date(app.appliedAt);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (!trendMap[monthYear]) {
        trendMap[monthYear] = { month: monthYear, total: 0, approved: 0, rejected: 0, pending: 0 };
      }
      trendMap[monthYear].total += 1;
      trendMap[monthYear][app.status] = (trendMap[monthYear][app.status] || 0) + 1;
    });

    const applicationsTrend = Object.values(trendMap);

    const responseData = {
      stats: {
        totalUsers,
        totalBusinesses,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications
      },
      charts: {
        applicationsByCategory,
        top5Schemes,
        applicationsTrend
      },
      adminRole: req.user.role,
      canManageSchemes: req.user.role === 'super_admin'
    };

    // Cache for 60 seconds
    await cacheService.set(cacheKey, responseData, 60);

    return sendSuccess(res, responseData, 'Admin dashboard metrics retrieved.');
  } catch (error) {
    next(error);
  }
};

export const getAdminApplications = async (req, res, next) => {
  try {
    const {
      search,
      status = 'all',
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (startDate || endDate) {
      whereClause.appliedAt = {};
      if (startDate) whereClause.appliedAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.appliedAt.lte = end;
      }
    }

    if (search) {
      whereClause.OR = [
        { scheme: { name: { contains: search } } },
        { user: { fullName: { contains: search } } },
        { user: { email: { contains: search } } },
        { businessCard: { name: { contains: search } } }
      ];
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true
          }
        },
        scheme: {
          select: {
            id: true,
            name: true,
            department: true,
            category: true
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
      orderBy: { appliedAt: 'desc' },
      take: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
    });

    const totalCount = await prisma.application.count({ where: whereClause });

    const formatted = applications.map(app => ({
      applicationId: app.id,
      userName: app.user?.fullName || 'N/A',
      userEmail: app.user?.email,
      userMobile: app.user?.mobile,
      schemeName: app.scheme?.name || 'N/A',
      department: app.scheme?.department,
      entity: app.entity === 'personal' ? 'You' : (app.businessCard?.name || 'Business'),
      entityType: app.entity,
      status: app.status,
      appliedOn: app.appliedAt,
      lastUpdated: app.updatedAt,
      adminComment: app.adminComment
    }));

    return sendSuccess(res, {
      applications: formatted,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(totalCount / parseInt(limit, 10))
      }
    }, 'Applications retrieved successfully for admin review.');
  } catch (error) {
    next(error);
  }
};

export const getApplicationReviewDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
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
            gender: true,
            accountHolderName: true,
            accountNumber: true,
            ifscCode: true,
            bankName: true,
            documents: true
          }
        },
        scheme: true,
        businessCard: true
      }
    });

    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }

    const snapshot = parseJsonSafe(application.snapshotData, {});

    return sendSuccess(res, {
      applicationId: application.id,
      status: application.status,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt,
      adminComment: application.adminComment,
      entity: application.entity,
      scheme: {
        id: application.scheme.id,
        name: application.scheme.name,
        department: application.scheme.department,
        category: application.scheme.category,
        description: application.scheme.description,
        minAge: application.scheme.minAge,
        maxAge: application.scheme.maxAge,
        states: parseJsonSafe(application.scheme.states, ['All']),
        categories: parseJsonSafe(application.scheme.categories, ['All']),
        maxIncome: application.scheme.maxIncome,
        businessTypes: parseJsonSafe(application.scheme.businessTypes, ['All']),
        documentsRequired: parseJsonSafe(application.scheme.documentsRequired, [])
      },
      applicantUser: application.user,
      businessDetails: application.businessCard,
      bankDetails: {
        accountHolderName: application.user?.accountHolderName,
        accountNumber: application.user?.accountNumber,
        ifscCode: application.user?.ifscCode,
        bankName: application.user?.bankName
      },
      documents: application.user?.documents || [],
      snapshotData: snapshot
    }, 'Application review detail retrieved.');
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return sendError(res, 'Status must be either "approved" or "rejected".', 400);
    }

    if (status === 'rejected' && (!adminComment || adminComment.trim() === '')) {
      return sendError(res, 'An admin comment/reason is required when rejecting an application.', 400);
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        scheme: true,
        user: true
      }
    });

    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status,
        adminComment: status === 'rejected' ? adminComment.trim() : null
      }
    });

    // Invalidate dashboard cache
    await cacheService.del('admin:dashboard:stats');

    // Notify user of decision via in-app notification, SSE, Web Push & transactional email
    notifyApplicationStatusChange(
      application.userId,
      application.id,
      application.scheme.name,
      status,
      adminComment
    ).catch(e => console.error(e));

    if (application.user) {
      emailService.sendApplicationDecisionEmail(
        application.user,
        application.scheme.name,
        status,
        adminComment
      ).catch(e => console.error(e));
    }

    // Record audit log
    await logAudit(req, {
      userId: req.user.id,
      action: status === 'approved' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
      details: {
        applicationId: application.id,
        schemeName: application.scheme.name,
        applicantEmail: application.user.email,
        adminComment: adminComment || null
      }
    });

    return sendSuccess(res, updated, `Application status updated to ${status.toUpperCase()} and applicant notified.`);
  } catch (error) {
    next(error);
  }
};

export const exportAdminApplicationsCSV = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        scheme: true,
        businessCard: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    const headers = [
      'Application ID',
      'Applicant Name',
      'Applicant Email',
      'Mobile',
      'State',
      'Category',
      'Scheme Name',
      'Department',
      'Scheme Category',
      'Entity Applied',
      'Business Name',
      'Status',
      'Admin Remarks',
      'Applied Date',
      'Last Updated'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = applications.map(app => [
      escapeCsv(app.id),
      escapeCsv(app.user?.fullName),
      escapeCsv(app.user?.email),
      escapeCsv(app.user?.mobile),
      escapeCsv(app.user?.state),
      escapeCsv(app.user?.category),
      escapeCsv(app.scheme?.name),
      escapeCsv(app.scheme?.department),
      escapeCsv(app.scheme?.category),
      escapeCsv(app.entity),
      escapeCsv(app.businessCard?.name || 'N/A'),
      escapeCsv(app.status.toUpperCase()),
      escapeCsv(app.adminComment || 'None'),
      escapeCsv(new Date(app.appliedAt).toISOString()),
      escapeCsv(new Date(app.updatedAt).toISOString())
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=applications-export-${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { limit = 100, page = 1 } = req.query;

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
    });

    const total = await prisma.auditLog.count();

    return sendSuccess(res, {
      logs,
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    }, 'Audit logs retrieved.');
  } catch (error) {
    next(error);
  }
};

export const triggerDatabaseBackup = async (req, res, next) => {
  try {
    const backupResult = await backupService.createBackup();
    await logAudit(req, {
      userId: req.user.id,
      action: 'DATABASE_BACKUP_TRIGGERED',
      details: backupResult
    });
    return sendSuccess(res, backupResult, 'Database backup created successfully.');
  } catch (error) {
    next(error);
  }
};

export const listDatabaseBackups = async (req, res, next) => {
  try {
    const backups = await backupService.listBackups();
    return sendSuccess(res, { backups, total: backups.length }, 'Database backups list retrieved.');
  } catch (error) {
    next(error);
  }
};
