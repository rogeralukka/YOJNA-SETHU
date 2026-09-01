import { prisma } from '../config/database';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/security';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errors';
import { AuditService } from './AuditService';

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  age?: number;
  state?: string;
  category?: string;
  annualIncome?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  static async register(input: RegisterInput, ipAddress?: string, userAgent?: string) {
    const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingEmail) {
      throw new ConflictError('User with this email already exists');
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (existingPhone) {
      throw new ConflictError('User with this phone number already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const isProfileComplete = Boolean(
      input.age !== undefined && input.state && input.category && input.annualIncome !== undefined
    );

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        age: input.age,
        state: input.state,
        category: input.category,
        annualIncome: input.annualIncome,
        profileComplete: isProfileComplete,
      },
    });

    await AuditService.log({
      actorUserId: user.id,
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user.id,
      ipAddress,
      userAgent,
    });

    const tokenPayload = { id: user.id, userId: user.userId, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  }

  static async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !user.isActive) {
      await AuditService.log({
        action: 'LOGIN_FAILED',
        resourceType: 'User',
        ipAddress,
        userAgent,
        metadata: { email: input.email, reason: 'User not found or inactive' },
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await verifyPassword(input.password, user.passwordHash);
    if (!isMatch) {
      await AuditService.log({
        actorUserId: user.id,
        action: 'LOGIN_FAILED',
        resourceType: 'User',
        resourceId: user.id,
        ipAddress,
        userAgent,
        metadata: { reason: 'Incorrect password' },
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokenPayload = { id: user.id, userId: user.userId, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    await AuditService.log({
      actorUserId: user.id,
      action: 'LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user.id,
      ipAddress,
      userAgent,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  }

  static async refreshTokens(refreshTokenStr: string, ipAddress?: string, userAgent?: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenStr);
    } catch (e) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenStr },
      include: { user: true },
    });

    if (!savedToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    // REUSE DETECTION: If token is already revoked, someone is reusing an old token!
    // SECURITY ACTION: Revoke all tokens for this user immediately!
    if (savedToken.isRevoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: savedToken.userId },
        data: { isRevoked: true },
      });

      await AuditService.log({
        actorUserId: savedToken.userId,
        action: 'REFRESH_TOKEN_REUSE_DETECTED',
        resourceType: 'RefreshToken',
        resourceId: savedToken.id,
        ipAddress,
        userAgent,
        metadata: { warning: 'All user refresh tokens revoked due to reuse detection' },
      });

      throw new UnauthorizedError('Token reuse detected. All sessions revoked for security.');
    }

    if (savedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    // Issue new pair & rotate token
    const newPayload = {
      id: savedToken.user.id,
      userId: savedToken.user.userId,
      email: savedToken.user.email,
      role: savedToken.user.role,
    };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Transactionally revoke current token and create replacement
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { isRevoked: true, replacedByToken: newRefreshToken },
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: savedToken.userId,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshTokenStr?: string, userId?: string, ipAddress?: string, userAgent?: string) {
    if (refreshTokenStr) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenStr },
        data: { isRevoked: true },
      });
    }

    if (userId) {
      await AuditService.log({
        actorUserId: userId,
        action: 'LOGOUT',
        resourceType: 'User',
        resourceId: userId,
        ipAddress,
        userAgent,
      });
    }
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        businessCards: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
