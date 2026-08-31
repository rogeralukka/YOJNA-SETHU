import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  streamNotifications,
  getPushPublicKey,
  subscribePush,
  sendTestPush
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.get('/stream', streamNotifications);
router.get('/push/public-key', getPushPublicKey);
router.post('/push/subscribe', subscribePush);
router.post('/push/test', sendTestPush);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
