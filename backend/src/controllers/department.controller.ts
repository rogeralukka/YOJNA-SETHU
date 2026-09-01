import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export class DepartmentController {
  public static async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await prisma.department.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return ApiResponse.success(res, departments, 'Departments retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}
