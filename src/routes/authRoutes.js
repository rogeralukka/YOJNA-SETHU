import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  getMe,
  sendOtp,
  verifyOtp
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/send-otp', authRateLimiter, sendOtp);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.post('/admin-login', authRateLimiter, adminLogin);
router.get('/me', authenticate, getMe);

export default router;
