import { Router } from 'express';
import authRoutes from './auth.routes';
import candidateRoutes from './candidate.routes';
import communicationRoutes from './communication.routes';
import documentRoutes from './document.routes';
import analyticsRoutes from './analytics.routes';
import templateRoutes from './template.routes';
import followUpRoutes from './followUp.routes';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/candidates', authenticate, candidateRoutes);
router.use('/communications', authenticate, communicationRoutes);
router.use('/documents', authenticate, documentRoutes);
router.use('/analytics', authenticate, analyticsRoutes);
router.use('/templates', authenticate, templateRoutes);
router.use('/follow-ups', authenticate, followUpRoutes);

export default router;
