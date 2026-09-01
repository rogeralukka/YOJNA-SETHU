import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';
import { CategoryController } from '../controllers/category.controller';
import { DepartmentController } from '../controllers/department.controller';
import { StateController } from '../controllers/state.controller';
import { validate } from '../middleware/validate';
import { schemeQuerySchema } from '../schemas/scheme.schema';
import { searchRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @openapi
 * /schemes:
 *   get:
 *     summary: Retrieve public list of active government schemes
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: schemeType
 *         schema:
 *           type: string
 *           enum: [PERSONAL, BUSINESS, BOTH]
 *     responses:
 *       200:
 *         description: List of schemes with pagination
 */
router.get('/', validate(schemeQuerySchema), SchemeController.getSchemes);

/**
 * @openapi
 * /schemes/search:
 *   get:
 *     summary: Search government schemes by keyword across name, description, category, and department
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchRateLimiter, validate(schemeQuerySchema), SchemeController.searchSchemes);

/**
 * @openapi
 * /schemes/categories:
 *   get:
 *     summary: List all active scheme categories
 *     tags: [Scheme Metadata]
 *     responses:
 *       200:
 *         description: Categories list
 */
router.get('/categories', CategoryController.getCategories);

/**
 * @openapi
 * /schemes/departments:
 *   get:
 *     summary: List all active departments/ministries
 *     tags: [Scheme Metadata]
 *     responses:
 *       200:
 *         description: Departments list
 */
router.get('/departments', DepartmentController.getDepartments);

/**
 * @openapi
 * /schemes/states:
 *   get:
 *     summary: List all active Indian states and ALL_INDIA
 *     tags: [Scheme Metadata]
 *     responses:
 *       200:
 *         description: States list
 */
router.get('/states', StateController.getStates);

/**
 * @openapi
 * /schemes/{schemeId}:
 *   get:
 *     summary: Get detailed information for a single scheme by ID or human-readable schemeId (e.g., SCH_000001)
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scheme details
 *       404:
 *         description: Scheme not found
 */
router.get('/:schemeId', SchemeController.getSchemeById);

/**
 * @openapi
 * /schemes/{schemeId}/eligibility-rules:
 *   get:
 *     summary: Get structured eligibility rules for a scheme
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eligibility rules
 */
router.get('/:schemeId/eligibility-rules', SchemeController.getEligibilityRules);

/**
 * @openapi
 * /schemes/{schemeId}/documents:
 *   get:
 *     summary: Get document requirements for a scheme
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document requirements
 */
router.get('/:schemeId/documents', SchemeController.getDocuments);

/**
 * @openapi
 * /schemes/{schemeId}/additional-fields:
 *   get:
 *     summary: Get additional scheme-specific custom input fields
 *     tags: [Public Schemes]
 *     parameters:
 *       - in: path
 *         name: schemeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Additional fields list
 */
router.get('/:schemeId/additional-fields', SchemeController.getAdditionalFields);

export default router;
