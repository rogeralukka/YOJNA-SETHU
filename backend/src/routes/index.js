import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import documentRoutes from './documentRoutes.js';
import schemeRoutes from './schemeRoutes.js';
import businessRoutes from './businessRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import bookmarkRoutes from './bookmarkRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import eligibilityRoutes from './eligibilityRoutes.js';
import adminRoutes from './adminRoutes.js';
import digilockerRoutes from './digilockerRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/documents', documentRoutes);
router.use('/schemes', schemeRoutes);
router.use('/business', businessRoutes);
router.use('/applications', applicationRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/notifications', notificationRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/admin', adminRoutes);
router.use('/digilocker', digilockerRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Government Scheme Portal Backend API is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

export default router;
