import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);

export default router;
