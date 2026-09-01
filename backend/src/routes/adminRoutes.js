import { Router } from 'express';
import {
  getDashboardStats,
  getAdminApplications,
  getApplicationReviewDetail,
  updateApplicationStatus,
  exportAdminApplicationsCSV,
  getAuditLogs,
  triggerDatabaseBackup,
  listDatabaseBackups
} from '../controllers/adminController.js';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/applications', getAdminApplications);
router.get('/applications/export-csv', exportAdminApplicationsCSV);
router.get('/applications/:id/review', getApplicationReviewDetail);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/audit-logs', getAuditLogs);

// Backup endpoints (Super Admin only)
router.post('/backup/trigger', requireSuperAdmin, triggerDatabaseBackup);
router.get('/backup/list', requireSuperAdmin, listDatabaseBackups);

export default router;
