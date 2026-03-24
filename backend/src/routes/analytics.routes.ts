import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', analyticsController.getDashboard);
router.get('/offer-acceptance', analyticsController.getOfferAcceptance);
router.get('/conversion', analyticsController.getConversion);
router.get('/stage-distribution', analyticsController.getStageDistribution);

export default router;
