import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export class CategoryController {
  public static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.schemeCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return ApiResponse.success(res, categories, 'Scheme categories retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}
