import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';
import { authRateLimiter } from '../middleware/rateLimiter';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
