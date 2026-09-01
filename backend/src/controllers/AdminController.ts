import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/ApplicationService';
import { AdminAnalyticsService } from '../services/AdminAnalyticsService';
import { ApiResponse } from '../utils/response';

export class AdminController {
  static async listApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.adminListApplications(req.query as any);
      return ApiResponse.success(res, result, 'Admin applications list retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async approveApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { comment } = req.body;
      const updated = await ApplicationService.approveApplication(
        req.params.applicationId,
        req.user!.id,
        comment,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, updated, 'Application approved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async rejectApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { comment } = req.body;
      const updated = await ApplicationService.rejectApplication(
        req.params.applicationId,
        req.user!.id,
        comment,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, updated, 'Application rejected successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await AdminAnalyticsService.getAnalytics();
      return ApiResponse.success(res, analytics, 'Admin analytics retrieved');
    } catch (err) {
      next(err);
    }
  }
}
