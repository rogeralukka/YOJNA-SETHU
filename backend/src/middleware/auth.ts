import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken, TokenPayload } from '../utils/security';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new ForbiddenError(
          `Action requires one of the following roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
}

// Integration hooks for main backend RBAC
export const requireAdmin = [requireAuth, requireRole(Role.ADMIN, Role.SUPER_ADMIN)];
export const requireSuperAdmin = [requireAuth, requireRole(Role.SUPER_ADMIN)];
