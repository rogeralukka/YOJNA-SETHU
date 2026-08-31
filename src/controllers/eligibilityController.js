import { prisma } from '../db/prisma.js';
import { evaluatePersonalEligibility, evaluateBusinessEligibility } from '../services/eligibilityEngine.js';
import { generateEligibilityPDF } from '../services/pdfService.js';
import { parseJsonSafe } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getShareableEligibility = async (req, res, next) => {
  try {
    const { businessId } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    let selectedBusiness = null;
    if (businessId && businessId !== 'you') {
      selectedBusiness = await prisma.businessCard.findFirst({
        where: { id: businessId, userId: req.user.id }
      });
    }

    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    const eligibleSchemes = [];

    schemes.forEach(scheme => {
      let evaluation;
      if (selectedBusiness) {
        evaluation = evaluateBusinessEligibility(selectedBusiness, scheme);
      } else {
        evaluation = evaluatePersonalEligibility(user, scheme);
      }

      if (evaluation.isEligible) {
        eligibleSchemes.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          category: scheme.category,
          deadline: scheme.deadline,
          benefits: scheme.benefits,
          matchedCriteria: evaluation.matchedCriteria
        });
      }
    });

    const sharePayload = {
      user: {
        id: user.id,
        fullName: user.fullName,
        state: user.state,
        category: user.category,
        age: user.age
      },
      business: selectedBusiness ? {
        id: selectedBusiness.id,
        name: selectedBusiness.name,
        type: selectedBusiness.type,
        industryCategory: selectedBusiness.industryCategory
      } : null,
      eligibleSchemes,
      totalEligible: eligibleSchemes.length,
      shareableUrl: `${req.protocol}://${req.get('host')}/api/eligibility/public/${user.id}${selectedBusiness ? `?businessId=${selectedBusiness.id}` : ''}`,
      generatedAt: new Date()
    };

    return sendSuccess(res, sharePayload, 'Shareable eligibility summary generated.');
  } catch (error) {
    next(error);
  }
};

export const downloadEligibilityPDF = async (req, res, next) => {
  try {
    const { businessId } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    let selectedBusiness = null;
    if (businessId && businessId !== 'you') {
      selectedBusiness = await prisma.businessCard.findFirst({
        where: { id: businessId, userId: req.user.id }
      });
    }

    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    const eligibleSchemes = [];

    schemes.forEach(scheme => {
      let evaluation;
      if (selectedBusiness) {
        evaluation = evaluateBusinessEligibility(selectedBusiness, scheme);
      } else {
        evaluation = evaluatePersonalEligibility(user, scheme);
      }

      if (evaluation.isEligible) {
        eligibleSchemes.push({
          id: scheme.id,
          name: scheme.name,
          department: scheme.department,
          category: scheme.category,
          deadline: scheme.deadline,
          benefits: scheme.benefits
        });
      }
    });

    const pdfBuffer = await generateEligibilityPDF({
      user,
      business: selectedBusiness,
      eligibleSchemes,
      generatedAt: new Date()
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=eligibility-report-${user.fullName.replace(/\s+/g, '_')}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const getPublicEligibilitySummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { businessId } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        state: true,
        category: true,
        age: true
      }
    });

    if (!user) {
      return sendError(res, 'User record not found.', 404);
    }

    let business = null;
    if (businessId) {
      business = await prisma.businessCard.findFirst({
        where: { id: businessId, userId },
        select: {
          name: true,
          type: true,
          industryCategory: true
        }
      });
    }

    const schemes = await prisma.scheme.findMany({
      where: { isActive: true }
    });

    const eligibleSchemes = [];
    schemes.forEach(scheme => {
      const evaluation = business
        ? evaluateBusinessEligibility(business, scheme)
        : evaluatePersonalEligibility(user, scheme);

      if (evaluation.isEligible) {
        eligibleSchemes.push({
          name: scheme.name,
          department: scheme.department,
          category: scheme.category,
          deadline: scheme.deadline
        });
      }
    });

    return sendSuccess(res, {
      applicant: {
        name: user.fullName,
        state: user.state,
        category: user.category
      },
      business: business ? { name: business.name, type: business.type } : null,
      totalEligible: eligibleSchemes.length,
      schemes: eligibleSchemes
    }, 'Public eligibility summary retrieved.');
  } catch (error) {
    next(error);
  }
};
