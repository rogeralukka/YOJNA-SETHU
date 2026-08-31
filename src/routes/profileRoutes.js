import { Router } from 'express';
import { getProfile, updateProfile, getProfileCompletion, changePassword } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/completion', getProfileCompletion);
router.post('/change-password', changePassword);

export default router;
