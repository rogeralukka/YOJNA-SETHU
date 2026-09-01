import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { requireAuth } from '../middleware/auth';
import { documentUpload } from '../middleware/upload';

const router = Router();

router.use(requireAuth);

router.post('/upload', documentUpload.single('document'), DocumentController.uploadDocument);
router.get('/signed-view/:objectName', DocumentController.getSignedDocumentView);

export default router;
