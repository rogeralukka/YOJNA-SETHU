export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid request payload', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class SchemeNotFoundError extends AppError {
  constructor(message: string = 'Government scheme not found') {
    super(message, 404, 'SCHEME_NOT_FOUND');
  }
}

export class InvalidSchemeError extends AppError {
  constructor(message: string = 'Invalid scheme parameters') {
    super(message, 400, 'INVALID_SCHEME');
  }
}

export class InvalidSourceError extends AppError {
  constructor(message: string = 'Invalid or insecure official source URL') {
    super(message, 400, 'INVALID_SOURCE');
  }
}

export class DuplicateSchemeError extends AppError {
  constructor(message: string = 'Scheme with specified schemeId or slug already exists') {
    super(message, 409, 'DUPLICATE_SCHEME');
  }
}

export class SchemeArchivedError extends AppError {
  constructor(message: string = 'The requested scheme has been archived and is no longer available') {
    super(message, 400, 'SCHEME_ARCHIVED');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}
