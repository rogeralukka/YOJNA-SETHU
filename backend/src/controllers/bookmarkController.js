import { prisma } from '../db/prisma.js';
import { evaluatePersonalEligibility } from '../services/eligibilityEngine.js';
import { parseJsonSafe, isNewScheme, isUrgentDeadline } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const toggleBookmark = async (req, res, next) => {
  try {
    const { schemeId } = req.params;

    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId }
    });

    if (!scheme) {
      return sendError(res, 'Scheme not found.', 404);
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_schemeId: {
          userId: req.user.id,
          schemeId
        }
      }
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id }
      });
      return sendSuccess(res, { isBookmarked: false }, 'Scheme removed from bookmarks.');
    } else {
      await prisma.bookmark.create({
        data: {
          userId: req.user.id,
          schemeId
        }
      });
      return sendSuccess(res, { isBookmarked: true }, 'Scheme bookmarked successfully.');
    }
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        scheme: {
          include: {
            _count: {
              select: { applications: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const enrichedSchemes = bookmarks.map(b => {
      const scheme = b.scheme;
      const parsedStates = parseJsonSafe(scheme.states, ['All']);
      const parsedCategories = parseJsonSafe(scheme.categories, ['All']);
      const parsedBusinessTypes = parseJsonSafe(scheme.businessTypes, ['All']);
      const parsedDocs = parseJsonSafe(scheme.documentsRequired, []);

      const eligibility = evaluatePersonalEligibility(user, scheme);

      return {
        ...scheme,
        states: parsedStates,
        categories: parsedCategories,
        businessTypes: parsedBusinessTypes,
        documentsRequired: parsedDocs,
        isNew: isNewScheme(scheme.createdAt),
        isUrgent: isUrgentDeadline(scheme.deadline),
        isBookmarked: true,
        isEligible: eligibility.isEligible,
        eligibilityReasons: eligibility.reasons,
        matchedCriteria: eligibility.matchedCriteria,
        totalApplicants: scheme._count.applications,
        bookmarkedAt: b.createdAt
      };
    });

    return sendSuccess(res, enrichedSchemes, 'Bookmarked schemes retrieved successfully.');
  } catch (error) {
    next(error);
  }
};
