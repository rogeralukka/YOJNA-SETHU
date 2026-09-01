import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';
import { ApiResponse } from '../utils/response';

export class NotificationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user!.id);
      return ApiResponse.success(res, notifications, 'Notifications retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await NotificationService.markAsRead(req.params.id, req.user!.id);
      return ApiResponse.success(res, updated, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return ApiResponse.success(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
}
