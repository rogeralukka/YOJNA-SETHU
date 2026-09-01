import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/scheme.service';
import { SchemeSearchService } from '../services/scheme-search.service';
import { ApiResponse } from '../utils/response';

export class SchemeController {
  /**
   * GET /api/v1/schemes - Public filtered scheme listing with pagination
   */
  public static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SchemeService.querySchemes(req.query as any);
      return ApiResponse.paginated(res, result.schemes, result.pagination, 'Schemes retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/schemes/search - Search schemes
   */
  public static async searchSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SchemeSearchService.searchSchemes(req.query as any);
      return ApiResponse.paginated(res, result.schemes, result.pagination, 'Search results retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/schemes/:schemeId - Single scheme details
   */
  public static async getSchemeById(req: Request, res: Response, next: NextFunction) {
    try {
      const language = req.query.language as string | undefined;
      const scheme = await SchemeService.getSchemeById(req.params.schemeId, language);
      return ApiResponse.success(res, scheme, 'Scheme details retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/schemes/:schemeId/eligibility-rules - Public structured eligibility rules
   */
  public static async getEligibilityRules(req: Request, res: Response, next: NextFunction) {
    try {
      const eligibility = await SchemeService.getInternalEligibilityRules(req.params.schemeId);
      return ApiResponse.success(res, eligibility, 'Eligibility rules retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/schemes/:schemeId/documents - Scheme document requirements
   */
  public static async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await SchemeService.getSchemeDocuments(req.params.schemeId);
      return ApiResponse.success(res, documents, 'Document requirements retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/schemes/:schemeId/additional-fields - Scheme custom/additional fields
   */
  public static async getAdditionalFields(req: Request, res: Response, next: NextFunction) {
    try {
      const fields = await SchemeService.getSchemeAdditionalFields(req.params.schemeId);
      return ApiResponse.success(res, fields, 'Additional fields retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/internal/schemes/:schemeId/eligibility - Internal Service Contract Endpoint
   */
  public static async getInternalEligibility(req: Request, res: Response, next: NextFunction) {
    try {
      const eligibility = await SchemeService.getInternalEligibilityRules(req.params.schemeId);
      return ApiResponse.success(res, eligibility, 'Internal scheme eligibility contract payload');
    } catch (err) {
      next(err);
    }
  }
}
