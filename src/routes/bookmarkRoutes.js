import { Router } from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getBookmarks);
router.post('/toggle/:schemeId', toggleBookmark);

export default router;
