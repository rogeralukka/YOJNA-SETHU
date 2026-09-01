import { prisma } from '../db/prisma.js';
import { sseService } from '../services/sseService.js';
import { pushNotificationService } from '../services/pushNotificationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false }
    });

    return sendSuccess(res, {
      notifications,
      unreadCount,
      totalCount: notifications.length
    }, 'Notifications retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!notification) {
      return sendError(res, 'Notification not found.', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return sendSuccess(res, updated, 'Notification marked as read.');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    });

    return sendSuccess(res, null, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.notification.deleteMany({
      where: { id, userId: req.user.id }
    });

    return sendSuccess(res, null, 'Notification deleted.');
  } catch (error) {
    next(error);
  }
};

/**
 * Server-Sent Events (SSE) live notification stream
 */
export const streamNotifications = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send connected handshake message
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Live notification stream established.' })}\n\n`);

  const closeHandler = sseService.addClient(req.user.id, res);

  req.on('close', () => {
    if (closeHandler) closeHandler();
  });
};

/**
 * Web Push: Get VAPID Public Key
 */
export const getPushPublicKey = (req, res) => {
  const publicKey = pushNotificationService.getPublicKey();
  return sendSuccess(res, { publicKey }, 'Web Push VAPID public key retrieved.');
};

/**
 * Web Push: Register Client Device Subscription
 */
export const subscribePush = (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return sendError(res, 'Subscription object is required.', 400);
  }
  const result = pushNotificationService.addSubscription(req.user.id, subscription);
  return sendSuccess(res, result, 'Subscribed to Web Push notifications successfully.');
};

/**
 * Web Push: Send Test Alert
 */
export const sendTestPush = async (req, res, next) => {
  try {
    const { title = 'Government Scheme Portal', message = 'This is a test notification.' } = req.body;
    const result = await pushNotificationService.sendPushNotification(req.user.id, {
      title,
      body: message
    });
    return sendSuccess(res, result, 'Test push notification dispatched.');
  } catch (error) {
    next(error);
  }
};
