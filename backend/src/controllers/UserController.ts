import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse } from '../utils/response';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await UserService.getProfile(req.user!.id);
      return ApiResponse.success(res, profile, 'User profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
