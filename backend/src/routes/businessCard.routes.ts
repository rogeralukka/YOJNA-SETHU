import { Router } from 'express';
import { BusinessCardController } from '../controllers/BusinessCardController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBusinessCardSchema, updateBusinessCardSchema } from '../schemas/businessCard.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createBusinessCardSchema), BusinessCardController.create);
router.get('/', BusinessCardController.list);
router.get('/:cardId', BusinessCardController.getById);
router.patch('/:cardId', validate(updateBusinessCardSchema), BusinessCardController.update);
router.delete('/:cardId', BusinessCardController.delete);

export default router;
