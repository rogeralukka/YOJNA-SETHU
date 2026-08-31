import webpush from 'web-push';

class PushNotificationService {
  constructor() {
    this.subscriptions = new Map(); // userId -> Set of subscription objects
    this.initVAPID();
  }

  initVAPID() {
    let publicKey = process.env.VAPID_PUBLIC_KEY;
    let privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@gov.in';

    if (!publicKey || !privateKey) {
      // Auto-generate VAPID keys for development
      const generated = webpush.generateVAPIDKeys();
      publicKey = generated.publicKey;
      privateKey = generated.privateKey;
      console.log('[PushService] Generated ephemeral VAPID keys for development.');
    }

    this.publicKey = publicKey;
    this.privateKey = privateKey;

    try {
      webpush.setVapidDetails(subject, this.publicKey, this.privateKey);
      console.log('[PushService] Web Push VAPID initialized successfully.');
    } catch (err) {
      console.error('[PushService] VAPID initialization error:', err.message);
    }
  }

  getPublicKey() {
    return this.publicKey;
  }

  addSubscription(userId, subscription) {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }
    this.subscriptions.get(userId).add(JSON.stringify(subscription));
    console.log(`[PushService] Registered Web Push subscription for user: ${userId}`);
    return { success: true, message: 'Subscription registered.' };
  }

  async sendPushNotification(userId, payload) {
    const userSubs = this.subscriptions.get(userId);
    if (!userSubs || userSubs.size === 0) {
      console.log(`[PushService:FallbackLog] Push Notification for ${userId}: "${payload.title} - ${payload.body}"`);
      return { success: true, deliveredCount: 0, mocked: true };
    }

    const jsonPayload = JSON.stringify({
      title: payload.title || 'Government Scheme Update',
      body: payload.body || payload.message || '',
      icon: payload.icon || '/assets/logo.png',
      badge: '/assets/badge.png',
      data: payload.data || {}
    });

    let deliveredCount = 0;

    for (const subStr of userSubs) {
      try {
        const subscription = JSON.parse(subStr);
        await webpush.sendNotification(subscription, jsonPayload);
        deliveredCount++;
      } catch (error) {
        console.error(`[PushService] Failed to send push to client (status ${error.statusCode}):`, error.message);
        if (error.statusCode === 410 || error.statusCode === 404) {
          userSubs.delete(subStr); // Stale subscription expired
        }
      }
    }

    console.log(`[PushService] Delivered ${deliveredCount} push notifications to user: ${userId}`);
    return { success: true, deliveredCount };
  }

  async broadcastPushNotification(payload) {
    let totalDelivered = 0;
    for (const userId of this.subscriptions.keys()) {
      const res = await this.sendPushNotification(userId, payload);
      totalDelivered += res.deliveredCount || 0;
    }
    return { success: true, totalDelivered };
  }
}

export const pushNotificationService = new PushNotificationService();
