import { Router } from 'express';
import {
  getAuthUrl,
  handleCallback,
  getIssuedDocuments,
  importDocument
} from '../controllers/digilockerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/auth-url', getAuthUrl);
router.post('/callback', handleCallback);
router.get('/issued-files', getIssuedDocuments);
router.post('/import', importDocument);

export default router;
