import { prisma } from '../db/prisma.js';
import { evaluateBusinessEligibility } from '../services/eligibilityEngine.js';
import { parseJsonSafe, isNewScheme, isUrgentDeadline } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getBusinesses = async (req, res, next) => {
  try {
    const businesses = await prisma.businessCard.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, businesses, 'Business cards retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const business = await prisma.businessCard.findFirst({
      where: { id, userId: req.user.id },
      include: {
        applications: {
          include: { scheme: true },
          orderBy: { appliedAt: 'desc' }
        }
      }
    });

    if (!business) {
      return sendError(res, 'Business card not found or access denied.', 404);
    }

    return sendSuccess(res, business, 'Business details retrieved.');
  } catch (error) {
    next(error);
  }
};

export const createBusiness = async (req, res, next) => {
  try {
    const {
      name,
      type,
      gstNumber,
      panNumber,
      address,
      phone,
      email,
      turnover,
      employeeCount,
      industryCategory,
      yearsInOperation,
      udyamNumber
    } = req.body;

    if (!name || !type || !address || !phone || !email || !turnover || !employeeCount || !industryCategory || !yearsInOperation) {
      return sendError(res, 'Please provide all required business profile details.', 400);
    }

    const business = await prisma.businessCard.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        type: type.trim(),
        gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : null,
        panNumber: panNumber ? panNumber.trim().toUpperCase() : null,
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        turnover,
        employeeCount,
        industryCategory,
        yearsInOperation,
        udyamNumber: udyamNumber ? udyamNumber.trim().toUpperCase() : null
      }
    });

    return sendSuccess(res, business, 'Business card created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      gstNumber,
      panNumber,
      address,
      phone,
      email,
      turnover,
      employeeCount,
      industryCategory,
      yearsInOperation,
      udyamNumber
    } = req.body;

    const existing = await prisma.businessCard.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return sendError(res, 'Business card not found or unauthorized.', 404);
    }

    const updated = await prisma.businessCard.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(type !== undefined && { type: type.trim() }),
        ...(gstNumber !== undefined && { gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : null }),
        ...(panNumber !== undefined && { panNumber: panNumber ? panNumber.trim().toUpperCase() : null }),
        ...(address !== undefined && { address: address.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(turnover !== undefined && { turnover }),
        ...(employeeCount !== undefined && { employeeCount }),
        ...(industryCategory !== undefined && { industryCategory }),
        ...(yearsInOperation !== undefined && { yearsInOperation }),
        ...(udyamNumber !== undefined && { udyamNumber: udyamNumber ? udyamNumber.trim().toUpperCase() : null })
      }
    });

    return sendSuccess(res, updated, 'Business card updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.businessCard.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return sendError(res, 'Business card not found or unauthorized.', 404);
    }

    await prisma.businessCard.delete({
      where: { id }
    });

    return sendSuccess(res, null, 'Business card deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const checkBusinessEligibility = async (req, res, next) => {
  try {
    const { id } = req.params;

    const business = await prisma.businessCard.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!business) {
      return sendError(res, 'Business card not found.', 404);
    }

    const schemes = await prisma.scheme.findMany({
      where: {
        isActive: true,
        isBusinessScheme: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const eligibleSchemes = [];
    const inEligibleSchemes = [];

    schemes.forEach(scheme => {
      const evaluation = evaluateBusinessEligibility(business, scheme);
      const parsedScheme = {
        ...scheme,
        states: parseJsonSafe(scheme.states, ['All']),
        categories: parseJsonSafe(scheme.categories, ['All']),
        businessTypes: parseJsonSafe(scheme.businessTypes, ['All']),
        documentsRequired: parseJsonSafe(scheme.documentsRequired, []),
        isNew: isNewScheme(scheme.createdAt),
        isUrgent: isUrgentDeadline(scheme.deadline),
        isEligible: evaluation.isEligible,
        eligibilityReasons: evaluation.reasons,
        matchedCriteria: evaluation.matchedCriteria
      };

      if (evaluation.isEligible) {
        eligibleSchemes.push(parsedScheme);
      } else {
        inEligibleSchemes.push(parsedScheme);
      }
    });

    return sendSuccess(res, {
      business,
      totalBusinessSchemes: schemes.length,
      eligibleCount: eligibleSchemes.length,
      eligibleSchemes,
      inEligibleSchemes
    }, `Found ${eligibleSchemes.length} eligible schemes for ${business.name}.`);
  } catch (error) {
    next(error);
  }
};
