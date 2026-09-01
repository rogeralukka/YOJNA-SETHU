import { Request, Response, NextFunction } from 'express';
import { BusinessCardService } from '../services/BusinessCardService';
import { ApiResponse } from '../utils/response';

export class BusinessCardController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await BusinessCardService.create(
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, card, 'Business card created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await BusinessCardService.listUserCards(req.user!.id);
      return ApiResponse.success(res, cards, 'User business cards retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const card = await BusinessCardService.getById(req.params.cardId, req.user!.id);
      return ApiResponse.success(res, card, 'Business card details retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await BusinessCardService.update(
        req.params.cardId,
        req.user!.id,
        req.body,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, updated, 'Business card updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BusinessCardService.delete(
        req.params.cardId,
        req.user!.id,
        req.ip,
        req.headers['user-agent']
      );
      return ApiResponse.success(res, null, 'Business card deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}
