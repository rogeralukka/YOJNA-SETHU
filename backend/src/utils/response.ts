import { Response } from 'express';
import { PaginationMeta } from '../types/scheme.types';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = 200
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T,
    pagination: PaginationMeta,
    message: string = 'List retrieved successfully'
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      pagination,
    };
    return res.status(200).json(payload);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    code: string = 'BAD_REQUEST',
    details?: any
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    };
    return res.status(statusCode).json(payload);
  }
}
