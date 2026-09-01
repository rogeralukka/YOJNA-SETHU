import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createApplicationSchema, bulkApplicationSchema } from '../schemas/application.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createApplicationSchema), ApplicationController.submitSingle);
router.post('/bulk', validate(bulkApplicationSchema), ApplicationController.submitBulk);
router.get('/', ApplicationController.listUserApplications);
router.get('/:applicationId', ApplicationController.getById);

export default router;
