import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { sanitizeText } from '../utils/security';
import { AuditService } from './AuditService';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        age: true,
        state: true,
        category: true,
        annualIncome: true,
        profileComplete: true,
        profilePictureUrl: true,
        aadhaarLast4: true,
        aadhaarVerified: true,
        panLast4: true,
        panVerified: true,
        bankName: true,
        bankAccountLast4: true,
        bankIfsc: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return user;
  }

  static async updateProfile(userId: string, data: any, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // Sanitize string inputs
    const sanitizedData: any = { ...data };
    if (data.name) sanitizedData.name = sanitizeText(data.name);
    if (data.state) sanitizedData.state = sanitizeText(data.state);
    if (data.bankName) sanitizedData.bankName = sanitizeText(data.bankName);

    // Re-evaluate profile completeness
    const mergedAge = sanitizedData.age !== undefined ? sanitizedData.age : existing.age;
    const mergedState = sanitizedData.state !== undefined ? sanitizedData.state : existing.state;
    const mergedCategory = sanitizedData.category !== undefined ? sanitizedData.category : existing.category;
    const mergedIncome = sanitizedData.annualIncome !== undefined ? sanitizedData.annualIncome : existing.annualIncome;

    const isComplete = Boolean(
      mergedAge !== null &&
        mergedAge !== undefined &&
        mergedState &&
        mergedCategory &&
        mergedIncome !== null &&
        mergedIncome !== undefined
    );

    sanitizedData.profileComplete = isComplete;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: sanitizedData,
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        age: true,
        state: true,
        category: true,
        annualIncome: true,
        profileComplete: true,
        profilePictureUrl: true,
        aadhaarLast4: true,
        aadhaarVerified: true,
        panLast4: true,
        panVerified: true,
        bankName: true,
        bankAccountLast4: true,
        bankIfsc: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        isActive: true,
      },
    });

    await AuditService.log({
      actorUserId: userId,
      action: 'PROFILE_UPDATED',
      resourceType: 'User',
      resourceId: userId,
      ipAddress,
      userAgent,
    });

    return updatedUser;
  }
}
