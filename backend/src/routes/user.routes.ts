import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas/user.schema';

const router = Router();

router.use(requireAuth);

router.get('/me', UserController.getMe);
router.patch('/me', validate(updateProfileSchema), UserController.updateMe);
router.patch('/me/profile', validate(updateProfileSchema), UserController.updateMe);

export default router;
