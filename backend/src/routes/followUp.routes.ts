import { Router } from 'express';
import { followUpController } from '../controllers/followUp.controller';
import { authorize } from '../middleware/auth';

const router = Router();

// Schedule follow-ups for a candidate
router.post(
  '/candidates/:id/schedule',
  authorize('TA', 'HM', 'ADMIN'),
  followUpController.scheduleFollowUps
);

// Get all pending follow-ups
router.get(
  '/pending',
  authorize('TA', 'HM', 'HR', 'ADMIN'),
  followUpController.getPendingFollowUps
);

// Mark follow-up as completed
router.post(
  '/complete',
  authorize('TA', 'HM', 'HR', 'ADMIN'),
  followUpController.completeFollowUp
);

// Get tracking sheet URL
router.get(
  '/tracking-sheet',
  authorize('TA', 'HM', 'HR', 'ADMIN'),
  followUpController.getTrackingSheetUrl
);

export default router;
