import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/response';

const prisma = new PrismaClient();

export class StateController {
  public static async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const states = await prisma.state.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return ApiResponse.success(res, states, 'States retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}
