import { Router } from 'express';
import {
  applySchemes,
  getMyApplications,
  getApplicationById,
  exportMyApplicationsCSV
} from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/apply', applySchemes);
router.get('/my', getMyApplications);
router.get('/my/export-csv', exportMyApplicationsCSV);
router.get('/:id', getApplicationById);

export default router;
