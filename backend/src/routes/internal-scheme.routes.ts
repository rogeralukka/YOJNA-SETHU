import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Service-to-service internal scheme eligibility contract endpoint
router.get('/schemes/:schemeId/eligibility', requireAuth, SchemeController.getInternalEligibility);

export default router;
