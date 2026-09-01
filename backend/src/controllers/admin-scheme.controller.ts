import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/scheme.service';
import { SchemeVersionService } from '../services/scheme-version.service';
import { SchemeImportService } from '../services/scheme-import.service';
import { MySchemeProvider } from '../integrations/myscheme/myscheme.provider';
import { ApiSetuProvider } from '../integrations/apisetu/apisetu.provider';
import { DataGovProvider } from '../integrations/datagov/datagov.provider';
import { ApiResponse } from '../utils/response';
import { SchemeStatus } from '@prisma/client';

export class AdminSchemeController {
  /**
   * GET /api/v1/admin/schemes - Admin listing with all statuses (Draft, Active, Inactive, Expired, Archived)
   */
  public static async getAdminSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      // Allows optional status override or defaults to querying all schemes
      const statusParam = req.query.status as SchemeStatus | undefined;
      const params = {
        ...req.query,
        ...(statusParam ? { status: statusParam } : {}),
      };
      const result = await SchemeService.querySchemes(params as any);
      return ApiResponse.paginated(res, result.schemes, result.pagination, 'Admin schemes retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/schemes - Create scheme (Super Admin)
   */
  public static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const created = await SchemeService.createScheme(req.body, actorUserId);
      return ApiResponse.created(res, created, 'Scheme created successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/schemes/:schemeId - Update scheme (Super Admin)
   */
  public static async updateScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const updated = await SchemeService.updateScheme(req.params.schemeId, req.body, actorUserId);
      return ApiResponse.success(res, updated, 'Scheme updated successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/admin/schemes/:schemeId - Soft delete / archive scheme (Super Admin)
   */
  public static async deleteScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const archived = await SchemeService.archiveScheme(req.params.schemeId, actorUserId);
      return ApiResponse.success(res, archived, 'Scheme archived successfully (soft deleted)');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/schemes/:schemeId/publish - Publish scheme (Super Admin)
   */
  public static async publishScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const published = await SchemeService.publishScheme(req.params.schemeId, actorUserId);
      return ApiResponse.success(res, published, 'Scheme published successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/schemes/:schemeId/archive - Archive scheme explicitly (Super Admin)
   */
  public static async archiveScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const archived = await SchemeService.archiveScheme(req.params.schemeId, actorUserId);
      return ApiResponse.success(res, archived, 'Scheme archived successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/schemes/:schemeId/verify - Mark source as verified (Super Admin)
   */
  public static async verifyScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const actorUserId = req.user?.id;
      const verified = await SchemeService.verifyScheme(req.params.schemeId, actorUserId);
      return ApiResponse.success(res, verified, 'Scheme verified successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/schemes/:schemeId/versions - View historical version snapshots
   */
  public static async getVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const versions = await SchemeVersionService.getSchemeVersions(req.params.schemeId);
      return ApiResponse.success(res, versions, 'Scheme version history retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/schemes/import - Import schemes from external provider
   */
  public static async importSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const providerName = (req.body.provider || 'myscheme').toLowerCase();
      let provider;

      if (providerName === 'apisetu') {
        provider = new ApiSetuProvider();
      } else if (providerName === 'datagov') {
        provider = new DataGovProvider();
      } else {
        provider = new MySchemeProvider();
      }

      const result = await SchemeImportService.importFromProvider(provider, req.body.query);
      return ApiResponse.success(res, result, `External schemes import from ${provider.providerName} executed`);
    } catch (err) {
      next(err);
    }
  }
}
