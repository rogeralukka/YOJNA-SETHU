import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../utils/response';
import { logger } from '../config/logger';
import { config } from '../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.code, err.details);
  }

  // Handle SyntaxError or Multer errors or Prisma errors gracefully
  if (err.name === 'SyntaxError') {
    return ApiResponse.error(res, 'Malformed JSON payload', 400, 'BAD_REQUEST');
  }

  const message = config.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return ApiResponse.error(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
