import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import businessCardRoutes from './businessCard.routes';
import schemeRoutes from './scheme.routes';
import adminSchemeRoutes from './admin-scheme.routes';
import internalSchemeRoutes from './internal-scheme.routes';
import applicationRoutes from './application.routes';
import bookmarkRoutes from './bookmark.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import documentRoutes from './document.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/business-cards', businessCardRoutes);
router.use('/schemes', schemeRoutes);
router.use('/admin/schemes', adminSchemeRoutes);
router.use('/admin', adminRoutes);
router.use('/internal', internalSchemeRoutes);
router.use('/applications', applicationRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/notifications', notificationRoutes);
router.use('/documents', documentRoutes);

export default router;
