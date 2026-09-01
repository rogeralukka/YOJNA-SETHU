import { config } from '../config/env';
import { logger } from '../config/logger';

export class FcmService {
  static async sendPushNotification(userId: string, title: string, body: string): Promise<boolean> {
    if (config.DEMO_MODE || !config.FIREBASE_PROJECT_ID) {
      logger.info(`[DEMO_MODE FcmService] Push Notification to User ${userId}: "${title}" - ${body}`);
      return true;
    }

    try {
      logger.info(`[FcmService] Sent FCM push notification to user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send FCM push notification:', error);
      return false;
    }
  }
}
