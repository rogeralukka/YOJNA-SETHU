import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', BookmarkController.listBookmarks);
router.post('/:schemeId', BookmarkController.addBookmark);
router.delete('/:schemeId', BookmarkController.removeBookmark);

export default router;
