import { Router } from 'express';
import { candidateController } from '../controllers/candidate.controller';
import { authorize } from '../middleware/auth';

const router = Router();

router.get('/', candidateController.list);
router.get('/export/csv', candidateController.exportCSV);
router.post('/', authorize('TA', 'ADMIN'), candidateController.create);
router.get('/:id', candidateController.getById);
router.patch('/:id', authorize('TA', 'HM', 'ADMIN'), candidateController.update);
router.delete('/:id', authorize('ADMIN'), candidateController.delete);
router.get('/:id/timeline', candidateController.getTimeline);
router.get('/:id/risk', candidateController.getRiskAssessment);
router.post('/:id/advance-stage', authorize('TA', 'ADMIN'), candidateController.advanceStage);

export default router;
