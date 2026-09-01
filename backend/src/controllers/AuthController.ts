import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body, req.ip, req.headers['user-agent']);
      return ApiResponse.success(res, result, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body, req.ip, req.headers['user-agent']);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshTokens(refreshToken, req.ip, req.headers['user-agent']);
      return ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?.id;
      await AuthService.logout(refreshToken, userId, req.ip, req.headers['user-agent']);
      return ApiResponse.success(res, null, 'Logout successful');
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      return ApiResponse.success(res, user, 'User profile fetched successfully');
    } catch (err) {
      next(err);
    }
  }
}
