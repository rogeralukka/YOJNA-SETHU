import { NotificationType, Scheme } from '@prisma/client';
import { prisma } from '../config/database';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { FcmService } from '../integrations/FcmService';
import { logger } from '../config/logger';

export class NotificationService {
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError("Unauthorized access to another user's notification");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });

    // Optionally dispatch push notification via Firebase FCM integration
    try {
      await FcmService.sendPushNotification(userId, title, message);
    } catch (e) {
      logger.warn('FCM push notification dispatch failed/skipped:', e);
    }

    return notification;
  }

  static async notifyAllUsersNewScheme(scheme: Scheme) {
    const users = await prisma.user.findMany({
      where: { role: 'USER', isActive: true },
      select: { id: true },
    });

    const deptName = (scheme as any).department?.name || 'Government Department';

    const notificationsData = users.map((u) => ({
      userId: u.id,
      type: NotificationType.SCHEME_ADDED,
      title: `New Scheme Launched: ${scheme.name}`,
      message: `A new government scheme "${scheme.name}" under ${deptName} is now open for applications. Check your eligibility now!`,
    }));

    if (notificationsData.length > 0) {
      await prisma.notification.createMany({
        data: notificationsData,
      });
    }
  }
}
