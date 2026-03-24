import { Router } from 'express';
import { documentController } from '../controllers/document.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/candidate/:candidateId', documentController.listByCandidateId);
router.post('/upload', upload.single('file'), documentController.upload);
router.delete('/:id', documentController.delete);

export default router;
