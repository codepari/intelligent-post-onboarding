import { Router } from 'express';
import { communicationController } from '../controllers/communication.controller';

const router = Router();

router.get('/', communicationController.list);
router.post('/', communicationController.create);
router.post('/send-email', communicationController.sendEmail);
router.get('/upcoming', communicationController.getUpcoming);

export default router;
