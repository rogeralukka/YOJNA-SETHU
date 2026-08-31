import { prisma } from '../db/prisma.js';

export const logAudit = async (req, { userId = null, action, details = null }) => {
  try {
    const ipAddress = req ? (req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1') : 'internal';
    const userAgent = req ? req.headers['user-agent'] || 'unknown' : 'internal';

    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress: String(ipAddress),
        userAgent: String(userAgent)
      }
    });
  } catch (error) {
    console.error('Audit log write error:', error);
    return null;
  }
};
