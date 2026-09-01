import { Router } from 'express';
import {
  getShareableEligibility,
  downloadEligibilityPDF,
  getPublicEligibilitySummary
} from '../controllers/eligibilityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public shared view
router.get('/public/:userId', getPublicEligibilitySummary);

// Authenticated user sharing & PDF download
router.get('/share', authenticate, getShareableEligibility);
router.get('/download-pdf', authenticate, downloadEligibilityPDF);

export default router;
