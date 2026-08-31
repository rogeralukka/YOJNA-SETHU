import { Router } from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  checkBusinessEligibility
} from '../controllers/businessController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getBusinesses);
router.post('/', createBusiness);
router.get('/:id', getBusinessById);
router.put('/:id', updateBusiness);
router.delete('/:id', deleteBusiness);
router.get('/:id/eligibility', checkBusinessEligibility);

export default router;
