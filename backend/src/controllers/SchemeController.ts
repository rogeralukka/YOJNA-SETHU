import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/SchemeService';
import { ApiResponse } from '../utils/response';

export class SchemeController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SchemeService.querySchemes(req.query as any);
      return ApiResponse.success(res, result, 'Schemes retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.getSchemeById(req.params.schemeId);
      return ApiResponse.success(res, scheme, 'Scheme details retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getEligibleSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const businessCardId = req.query.businessCardId as string | undefined;
      const result = await SchemeService.getEligibleSchemesForUser(req.user!.id, businessCardId);
      return ApiResponse.success(res, result, 'Eligible schemes calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.createScheme(
        req.body,
        req.user!.id,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, scheme, 'Scheme created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.updateScheme(
        req.params.schemeId,
        req.body,
        req.user!.id,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, scheme, 'Scheme updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.deleteScheme(
        req.params.schemeId,
        req.user!.id,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, scheme, 'Scheme deactivated successfully');
    } catch (err) {
      next(err);
    }
  }
}
