import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface AuditParams {
  actorUserId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
}

export class AuditService {
  static async log(params: AuditParams): Promise<void> {
    try {
      const sanitizedMetadata = params.metadata
        ? this.sanitizeMetadata(params.metadata)
        : null;

      await prisma.auditLog.create({
        data: {
          actorUserId: params.actorUserId || null,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId || null,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          metadata: sanitizedMetadata || undefined,
        },
      });
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      // We catch error so audit failure doesn't crash primary user flows
    }
  }

  private static sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sensitiveKeys = [
      'password',
      'passwordHash',
      'accessToken',
      'refreshToken',
      'token',
      'aadhaarNumber',
      'bankAccountNumber',
      'secret',
    ];

    const clean: Record<string, any> = {};

    for (const [key, value] of Object.entries(metadata)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        clean[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        clean[key] = this.sanitizeMetadata(value);
      } else {
        clean[key] = value;
      }
    }

    return clean;
  }
}
