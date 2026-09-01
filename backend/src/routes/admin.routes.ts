import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { approveApplicationSchema, rejectApplicationSchema } from '../schemas/application.schema';

const router = Router();

router.use(requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/applications', AdminController.listApplications);
router.patch('/applications/:applicationId/approve', validate(approveApplicationSchema), AdminController.approveApplication);
router.patch('/applications/:applicationId/reject', validate(rejectApplicationSchema), AdminController.rejectApplication);
router.get('/analytics', AdminController.getAnalytics);

export default router;
