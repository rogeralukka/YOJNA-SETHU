import { Router } from 'express';
import { AdminSchemeController } from '../controllers/admin-scheme.controller';
import { requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSchemeSchema, updateSchemeSchema, schemeQuerySchema } from '../schemas/scheme.schema';
import { adminRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Admin List Schemes (Read-only for ADMIN and SUPER_ADMIN)
router.get('/', requireAdmin, validate(schemeQuerySchema), AdminSchemeController.getAdminSchemes);

// Get Version History for audit
router.get('/:schemeId/versions', requireAdmin, AdminSchemeController.getVersions);

// Create New Scheme (SUPER_ADMIN only)
router.post('/', adminRateLimiter, requireSuperAdmin, validate(createSchemeSchema), AdminSchemeController.createScheme);

// Import Schemes from External Government Providers (SUPER_ADMIN only)
router.post('/import', adminRateLimiter, requireSuperAdmin, AdminSchemeController.importSchemes);

// Update Scheme (SUPER_ADMIN only)
router.patch('/:schemeId', adminRateLimiter, requireSuperAdmin, validate(updateSchemeSchema), AdminSchemeController.updateScheme);

// Soft Delete Scheme (SUPER_ADMIN only)
router.delete('/:schemeId', adminRateLimiter, requireSuperAdmin, AdminSchemeController.deleteScheme);

// Publish Scheme (SUPER_ADMIN only)
router.post('/:schemeId/publish', adminRateLimiter, requireSuperAdmin, AdminSchemeController.publishScheme);

// Archive Scheme explicitly (SUPER_ADMIN only)
router.post('/:schemeId/archive', adminRateLimiter, requireSuperAdmin, AdminSchemeController.archiveScheme);

// Verify Scheme Official Source (SUPER_ADMIN only)
router.post('/:schemeId/verify', adminRateLimiter, requireSuperAdmin, AdminSchemeController.verifyScheme);

export default router;
