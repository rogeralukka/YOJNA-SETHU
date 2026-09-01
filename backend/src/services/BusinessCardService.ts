import { prisma } from '../config/database';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { sanitizeText } from '../utils/security';
import { AuditService } from './AuditService';

export class BusinessCardService {
  static async create(userId: string, data: any, ipAddress?: string, userAgent?: string) {
    const sanitizedData = {
      ...data,
      userId,
      businessName: sanitizeText(data.businessName),
      businessType: sanitizeText(data.businessType),
      address: sanitizeText(data.address),
      industryCategory: sanitizeText(data.industryCategory),
    };

    const card = await prisma.businessCard.create({
      data: sanitizedData,
    });

    await AuditService.log({
      actorUserId: userId,
      action: 'BUSINESS_CARD_CREATED',
      resourceType: 'BusinessCard',
      resourceId: card.id,
      ipAddress,
      userAgent,
    });

    return card;
  }

  static async listUserCards(userId: string) {
    return prisma.businessCard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(cardId: string, userId: string) {
    const card = await prisma.businessCard.findFirst({
      where: {
        OR: [{ id: cardId }, { cardId }],
      },
    });

    if (!card) {
      throw new NotFoundError('Business card not found');
    }

    // IDOR Protection Check!
    if (card.userId !== userId) {
      throw new ForbiddenError("Unauthorized access: You do not own this business card");
    }

    return card;
  }

  static async update(cardId: string, userId: string, data: any, ipAddress?: string, userAgent?: string) {
    const existing = await this.getById(cardId, userId); // Strictly verifies ownership

    const sanitizedData: any = { ...data };
    if (data.businessName) sanitizedData.businessName = sanitizeText(data.businessName);
    if (data.address) sanitizedData.address = sanitizeText(data.address);

    const updated = await prisma.businessCard.update({
      where: { id: existing.id },
      data: sanitizedData,
    });

    await AuditService.log({
      actorUserId: userId,
      action: 'BUSINESS_CARD_UPDATED',
      resourceType: 'BusinessCard',
      resourceId: updated.id,
      ipAddress,
      userAgent,
    });

    return updated;
  }

  static async delete(cardId: string, userId: string, ipAddress?: string, userAgent?: string) {
    const existing = await this.getById(cardId, userId); // Strictly verifies ownership

    await prisma.businessCard.delete({
      where: { id: existing.id },
    });

    await AuditService.log({
      actorUserId: userId,
      action: 'BUSINESS_CARD_DELETED',
      resourceType: 'BusinessCard',
      resourceId: existing.id,
      ipAddress,
      userAgent,
    });
  }
}
