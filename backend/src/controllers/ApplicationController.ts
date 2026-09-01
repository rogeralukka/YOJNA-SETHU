import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/ApplicationService';
import { ApiResponse } from '../utils/response';

export class ApplicationController {
  static async submitSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const { schemeId, businessCardId, additionalDetails } = req.body;
      const result = await ApplicationService.submitBulkApplication(
        req.user!.id,
        { schemeIds: [schemeId], businessCardId, additionalDetails },
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, result, 'Application submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async submitBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.submitBulkApplication(
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, result, 'Bulk applications submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async listUserApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const apps = await ApplicationService.getUserApplications(req.user!.id);
      return ApiResponse.success(res, apps, 'Applications retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const isStaff = req.user!.role === 'ADMIN' || req.user!.role === 'SUPER_ADMIN';
      const app = await ApplicationService.getApplicationById(
        req.params.applicationId,
        req.user!.id,
        isStaff
      );
      return ApiResponse.success(res, app, 'Application details retrieved');
    } catch (err) {
      next(err);
    }
  }
}
