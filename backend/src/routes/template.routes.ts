import { Router } from 'express';
import { templateController } from '../controllers/template.controller';
import { authorize } from '../middleware/auth';

const router = Router();

router.get('/', templateController.list);
router.post('/', authorize('ADMIN'), templateController.create);
router.get('/:id', templateController.getById);
router.patch('/:id', authorize('ADMIN'), templateController.update);
router.post('/:id/preview', templateController.preview);

export default router;
