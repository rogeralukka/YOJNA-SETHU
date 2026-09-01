import { prisma } from '../db/prisma.js';
import { evaluatePersonalEligibility, evaluateBusinessEligibility } from '../services/eligibilityEngine.js';
import { notifyEligibleUsersForNewScheme, notifyApplicantsForUpdatedScheme } from '../services/notificationService.js';
import { logAudit } from '../services/auditService.js';
import { cacheService } from '../services/cacheService.js';
import { parseJsonSafe, stringifyJsonSafe, isNewScheme, isUrgentDeadline } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getSchemes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      entity = 'all', // 'all' | 'personal' | 'business'
      sortBy = 'latest', // 'latest' | 'deadline'
      businessId,
      eligibleOnly = 'false',
      limit = 50,
      page = 1
    } = req.query;

    const whereClause = {
      isActive: true
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { department: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (entity === 'personal') {
      whereClause.isBusinessScheme = false;
    } else if (entity === 'business') {
      whereClause.isBusinessScheme = true;
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'deadline') {
      orderBy = { deadline: 'asc' };
    } else if (sortBy === 'latest') {
      orderBy = { createdAt: 'desc' };
    }

    const schemes = await prisma.scheme.findMany({
      where: whereClause,
      orderBy,
      take: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    // Check user bookmarks if authenticated
    let userBookmarks = new Set();
    let selectedBusiness = null;

    if (req.user) {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: req.user.id },
        select: { schemeId: true }
      });
      userBookmarks = new Set(bookmarks.map(b => b.schemeId));

      if (businessId && businessId !== 'you') {
        selectedBusiness = await prisma.businessCard.findFirst({
          where: { id: businessId, userId: req.user.id }
        });
      }
    }

    // Enrich schemes with dynamic attributes
    let totalEligibleCount = 0;
    const enrichedSchemes = schemes.map(scheme => {
      const parsedStates = parseJsonSafe(scheme.states, ['All']);
      const parsedCategories = parseJsonSafe(scheme.categories, ['All']);
      const parsedBusinessTypes = parseJsonSafe(scheme.businessTypes, ['All']);
      const parsedDocsRequired = parseJsonSafe(scheme.documentsRequired, []);

      let eligibilityResult = { isEligible: false, reasons: [], matchedCriteria: [] };

      if (req.user) {
        if (selectedBusiness) {
          eligibilityResult = evaluateBusinessEligibility(selectedBusiness, scheme);
        } else {
          eligibilityResult = evaluatePersonalEligibility(req.user, scheme);
        }
      }

      if (eligibilityResult.isEligible) {
        totalEligibleCount += 1;
      }

      return {
        ...scheme,
        states: parsedStates,
        categories: parsedCategories,
        businessTypes: parsedBusinessTypes,
        documentsRequired: parsedDocsRequired,
        isNew: isNewScheme(scheme.createdAt),
        isUrgent: isUrgentDeadline(scheme.deadline),
        isBookmarked: userBookmarks.has(scheme.id),
        isEligible: eligibilityResult.isEligible,
        eligibilityReasons: eligibilityResult.reasons,
        matchedCriteria: eligibilityResult.matchedCriteria,
        totalApplicants: scheme._count.applications
      };
    });

    let finalSchemes = enrichedSchemes;
    if (eligibleOnly === 'true') {
      finalSchemes = finalSchemes.filter(s => s.isEligible);
    }

    return sendSuccess(res, {
      schemes: finalSchemes,
      total: finalSchemes.length,
      eligibleCount: totalEligibleCount,
      entitySelected: selectedBusiness ? selectedBusiness.name : 'You',
      greetingMessage: req.user
        ? `Hello, ${req.user.fullName}! You are eligible for ${totalEligibleCount} scheme${totalEligibleCount === 1 ? '' : 's'}.`
        : 'Welcome! Explore government schemes tailored for you.'
    }, 'Schemes fetched successfully.');
  } catch (error) {
    next(error);
  }
};

export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { businessId } = req.query;

    const scheme = await prisma.scheme.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!scheme) {
      return sendError(res, 'Scheme not found.', 404);
    }

    let isBookmarked = false;
    let eligibilityResult = { isEligible: false, reasons: [], matchedCriteria: [] };

    if (req.user) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_schemeId: {
            userId: req.user.id,
            schemeId: scheme.id
          }
        }
      });
      isBookmarked = !!bookmark;

      if (businessId && businessId !== 'you') {
        const business = await prisma.businessCard.findFirst({
          where: { id: businessId, userId: req.user.id }
        });
        eligibilityResult = evaluateBusinessEligibility(business, scheme);
      } else {
        eligibilityResult = evaluatePersonalEligibility(req.user, scheme);
      }
    }

    const enrichedScheme = {
      ...scheme,
      states: parseJsonSafe(scheme.states, ['All']),
      categories: parseJsonSafe(scheme.categories, ['All']),
      businessTypes: parseJsonSafe(scheme.businessTypes, ['All']),
      documentsRequired: parseJsonSafe(scheme.documentsRequired, []),
      isNew: isNewScheme(scheme.createdAt),
      isUrgent: isUrgentDeadline(scheme.deadline),
      isBookmarked,
      isEligible: eligibilityResult.isEligible,
      eligibilityReasons: eligibilityResult.reasons,
      matchedCriteria: eligibilityResult.matchedCriteria,
      totalApplicants: scheme._count.applications
    };

    return sendSuccess(res, enrichedScheme, 'Scheme details retrieved.');
  } catch (error) {
    next(error);
  }
};

export const createScheme = async (req, res, next) => {
  try {
    const {
      name,
      department,
      category,
      description,
      minAge,
      maxAge,
      states,
      categories,
      maxIncome,
      targetGender,
      businessTypes,
      isBusinessScheme,
      deadline,
      documentsRequired,
      benefits,
      officialUrl
    } = req.body;

    if (!name || !department || !category || !description) {
      return sendError(res, 'Name, department, category, and description are required.', 400);
    }

    const newScheme = await prisma.scheme.create({
      data: {
        name: name.trim(),
        department: department.trim(),
        category: category.trim(),
        description: description.trim(),
        minAge: minAge !== undefined && minAge !== '' ? parseInt(minAge, 10) : 0,
        maxAge: maxAge !== undefined && maxAge !== '' ? parseInt(maxAge, 10) : 100,
        states: stringifyJsonSafe(states || ['All']),
        categories: stringifyJsonSafe(categories || ['All']),
        maxIncome: maxIncome !== undefined && maxIncome !== '' ? parseFloat(maxIncome) : null,
        targetGender: targetGender || 'All',
        businessTypes: stringifyJsonSafe(businessTypes || ['All']),
        isBusinessScheme: Boolean(isBusinessScheme),
        deadline: deadline ? new Date(deadline) : null,
        documentsRequired: stringifyJsonSafe(documentsRequired || []),
        benefits: benefits || null,
        officialUrl: officialUrl || null,
        isActive: true
      }
    });

    // Invalidate caches
    await cacheService.del('schemes:categories');
    await cacheService.del('admin:dashboard:stats');

    // Log audit event
    await logAudit(req, {
      userId: req.user.id,
      action: 'SCHEME_CREATED',
      details: { schemeId: newScheme.id, name: newScheme.name, department: newScheme.department }
    });

    // Notify all eligible users in background
    notifyEligibleUsersForNewScheme(newScheme).catch(err => console.error(err));

    return sendSuccess(res, newScheme, 'Scheme created successfully and eligible users notified.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      department,
      category,
      description,
      minAge,
      maxAge,
      states,
      categories,
      maxIncome,
      targetGender,
      businessTypes,
      isBusinessScheme,
      deadline,
      documentsRequired,
      benefits,
      officialUrl,
      isActive
    } = req.body;

    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name.trim();
    if (department !== undefined) dataToUpdate.department = department.trim();
    if (category !== undefined) dataToUpdate.category = category.trim();
    if (description !== undefined) dataToUpdate.description = description.trim();
    if (minAge !== undefined) dataToUpdate.minAge = minAge ? parseInt(minAge, 10) : 0;
    if (maxAge !== undefined) dataToUpdate.maxAge = maxAge ? parseInt(maxAge, 10) : 100;
    if (states !== undefined) dataToUpdate.states = stringifyJsonSafe(states);
    if (categories !== undefined) dataToUpdate.categories = stringifyJsonSafe(categories);
    if (maxIncome !== undefined) dataToUpdate.maxIncome = maxIncome ? parseFloat(maxIncome) : null;
    if (targetGender !== undefined) dataToUpdate.targetGender = targetGender;
    if (businessTypes !== undefined) dataToUpdate.businessTypes = stringifyJsonSafe(businessTypes);
    if (isBusinessScheme !== undefined) dataToUpdate.isBusinessScheme = Boolean(isBusinessScheme);
    if (deadline !== undefined) dataToUpdate.deadline = deadline ? new Date(deadline) : null;
    if (documentsRequired !== undefined) dataToUpdate.documentsRequired = stringifyJsonSafe(documentsRequired);
    if (benefits !== undefined) dataToUpdate.benefits = benefits;
    if (officialUrl !== undefined) dataToUpdate.officialUrl = officialUrl;
    if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

    const updatedScheme = await prisma.scheme.update({
      where: { id },
      data: dataToUpdate
    });

    // Invalidate caches
    await cacheService.del('schemes:categories');
    await cacheService.del('admin:dashboard:stats');

    // Log audit event
    await logAudit(req, {
      userId: req.user.id,
      action: 'SCHEME_UPDATED',
      details: { schemeId: id, name: updatedScheme.name }
    });

    // Notify all existing applicants of updates
    notifyApplicantsForUpdatedScheme(id, updatedScheme.name).catch(err => console.error(err));

    return sendSuccess(res, updatedScheme, 'Scheme updated successfully and applicants notified.');
  } catch (error) {
    next(error);
  }
};

export const deleteScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scheme = await prisma.scheme.findUnique({ where: { id } });

    await prisma.scheme.delete({
      where: { id }
    });

    // Invalidate caches
    await cacheService.del('schemes:categories');
    await cacheService.del('admin:dashboard:stats');

    // Log audit event
    await logAudit(req, {
      userId: req.user.id,
      action: 'SCHEME_DELETED',
      details: { schemeId: id, name: scheme?.name || 'Unknown' }
    });

    return sendSuccess(res, null, 'Scheme deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const getSchemeCategories = async (req, res, next) => {
  try {
    const cacheKey = 'schemes:categories';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return sendSuccess(res, cached, 'Scheme categories fetched from cache.');
    }

    const categories = await prisma.scheme.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { isActive: true }
    });

    const formatted = categories.map(c => ({
      name: c.category,
      count: c._count.id
    }));

    await cacheService.set(cacheKey, formatted, 300);

    return sendSuccess(res, formatted, 'Scheme categories fetched.');
  } catch (error) {
    next(error);
  }
};
