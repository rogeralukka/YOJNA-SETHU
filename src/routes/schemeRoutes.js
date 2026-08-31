import { Router } from 'express';
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getSchemeCategories
} from '../controllers/schemeController.js';
import { authenticate, optionalAuthenticate, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Public / Semi-Public Routes
router.get('/', optionalAuthenticate, getSchemes);
router.get('/categories', getSchemeCategories);
router.get('/:id', optionalAuthenticate, getSchemeById);

// Super Admin Only Management Routes (Pages 11 & 12)
router.post('/', authenticate, requireSuperAdmin, createScheme);
router.put('/:id', authenticate, requireSuperAdmin, updateScheme);
router.delete('/:id', authenticate, requireSuperAdmin, deleteScheme);

export default router;
