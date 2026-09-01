import { SchemeRepository } from '../repositories/scheme.repository';
import { SchemeQueryParams } from '../types/scheme.types';
import { formatSchemeDto } from '../dto/scheme.dto';
import { SchemeNotFoundError, ValidationError } from '../utils/errors';
import { SchemeValidationService } from './scheme-validation.service';
import { VerificationStatus, SchemeStatus } from '@prisma/client';

export class SchemeService {
  /**
   * Query schemes with filters & pagination for public consumption
   */
  public static async querySchemes(params: SchemeQueryParams) {
    const result = await SchemeRepository.findMany(params);
    return {
      schemes: result.schemes.map((s) => formatSchemeDto(s, params.language)),
      pagination: result.pagination,
    };
  }

  /**
   * Get single scheme by ID or human-readable schemeId
   */
  public static async getSchemeById(idOrSchemeId: string, language?: string) {
    const scheme = await SchemeRepository.findByIdOrSchemeId(idOrSchemeId);
    if (!scheme) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return formatSchemeDto(scheme, language);
  }

  /**
   * Internal Eligibility Service Contract (Section 35)
   * GET /api/v1/internal/schemes/:schemeId/eligibility
   */
  public static async getInternalEligibilityRules(idOrSchemeId: string) {
    const scheme = await SchemeRepository.findByIdOrSchemeId(idOrSchemeId);
    if (!scheme) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }

    return {
      schemeId: scheme.schemeId,
      name: scheme.name,
      schemeType: scheme.schemeType,
      isBusinessScheme: scheme.isBusinessScheme,
      eligibilityRules: {
        minAge: scheme.minAge,
        maxAge: scheme.maxAge,
        minIncome: scheme.minIncome,
        maxIncome: scheme.maxIncome,
        applicableStates: scheme.states.map((s) => s.state.code),
        eligibleCategories: scheme.eligibilityCategories.map((c) => c.category.code),
        rulesJson: scheme.rulesJson,
        description: scheme.eligibilityDescription,
      },
    };
  }

  /**
   * Get required documents for a scheme
   */
  public static async getSchemeDocuments(idOrSchemeId: string) {
    const scheme = await SchemeRepository.findByIdOrSchemeId(idOrSchemeId);
    if (!scheme) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return scheme.documentRequirements;
  }

  /**
   * Get additional fields for a scheme
   */
  public static async getSchemeAdditionalFields(idOrSchemeId: string) {
    const scheme = await SchemeRepository.findByIdOrSchemeId(idOrSchemeId);
    if (!scheme) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return scheme.additionalFields;
  }

  /**
   * Create a new scheme (Admin)
   */
  public static async createScheme(data: any, actorUserId?: string) {
    SchemeValidationService.validateSourceUrl(data.sourceUrl);
    SchemeValidationService.validateRanges(data.minAge, data.maxAge, data.minIncome, data.maxIncome);

    // Auto verification status if official domain
    let verificationStatus = data.verificationStatus || VerificationStatus.UNVERIFIED;
    if (data.sourceUrl && SchemeValidationService.isOfficialGovernmentDomain(data.sourceUrl)) {
      verificationStatus = VerificationStatus.VERIFIED;
    }

    const created = await SchemeRepository.create({
      ...data,
      verificationStatus,
      actorUserId,
    });

    return formatSchemeDto(created);
  }

  /**
   * Update an existing scheme (Admin)
   */
  public static async updateScheme(idOrSchemeId: string, data: any, actorUserId?: string) {
    if (data.sourceUrl) {
      SchemeValidationService.validateSourceUrl(data.sourceUrl);
    }
    SchemeValidationService.validateRanges(data.minAge, data.maxAge, data.minIncome, data.maxIncome);

    const updated = await SchemeRepository.update(idOrSchemeId, data, actorUserId);
    if (!updated) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return formatSchemeDto(updated);
  }

  /**
   * Soft delete (Archive) a scheme (Admin)
   */
  public static async archiveScheme(idOrSchemeId: string, actorUserId?: string) {
    const archived = await SchemeRepository.softDelete(idOrSchemeId, actorUserId);
    if (!archived) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return formatSchemeDto(archived);
  }

  /**
   * Publish a scheme (Admin)
   */
  public static async publishScheme(idOrSchemeId: string, actorUserId?: string) {
    const published = await SchemeRepository.publish(idOrSchemeId, actorUserId);
    if (!published) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return formatSchemeDto(published);
  }

  /**
   * Verify scheme source (Admin)
   */
  public static async verifyScheme(idOrSchemeId: string, actorUserId?: string) {
    const verified = await SchemeRepository.verify(idOrSchemeId, VerificationStatus.VERIFIED, actorUserId);
    if (!verified) {
      throw new SchemeNotFoundError(`Scheme with ID ${idOrSchemeId} not found`);
    }
    return formatSchemeDto(verified);
  }
}
