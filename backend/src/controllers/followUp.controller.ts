import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { googleService } from '../services/google.service';
import { AppError } from '../middleware/errorHandler';

export const followUpController = {
  /**
   * Schedule follow-ups for a candidate (called when candidate is created or reaches final stage)
   */
  async scheduleFollowUps(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          hmOwner: { select: { email: true } },
          taOwner: { select: { email: true } },
        },
      });

      if (!candidate) {
        throw new AppError('Candidate not found', 404);
      }

      if (!candidate.joiningDate) {
        throw new AppError('Candidate must have a joining date', 400);
      }

      const candidateName = `${candidate.firstName} ${candidate.lastName}`;

      // Schedule calendar events
      await googleService.scheduleFollowUpCalendars({
        candidateId: candidate.id,
        candidateName,
        joiningDate: candidate.joiningDate,
        hmEmail: candidate.hmOwner?.email,
        taEmail: candidate.taOwner?.email,
      });

      // Add tracking records to Google Sheet
      await googleService.addFollowUpRecords(
        candidateName,
        candidate.joiningDate,
        candidate.hmOwner?.email,
        candidate.taOwner?.email
      );

      res.json({
        success: true,
        message: 'Follow-ups scheduled successfully',
        data: {
          candidateName,
          intervals: [10, 15, 20],
          joiningDate: candidate.joiningDate,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all pending follow-ups from Google Sheet
   */
  async getPendingFollowUps(req: Request, res: Response, next: NextFunction) {
    try {
      const followUps = await googleService.getPendingFollowUps();

      res.json({
        success: true,
        data: followUps,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark a follow-up as completed
   */
  async completeFollowUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidateName, followUpDate, assignedTo, notes } = req.body;

      if (!candidateName || !followUpDate || !assignedTo) {
        throw new AppError('Missing required fields', 400);
      }

      await googleService.updateFollowUpStatus(
        candidateName,
        followUpDate,
        assignedTo,
        'Completed',
        notes || ''
      );

      res.json({
        success: true,
        message: 'Follow-up marked as completed',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tracking sheet URL
   */
  async getTrackingSheetUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const sheetId = await googleService.getOrCreateTrackingSheet();

      const url = sheetId
        ? `https://docs.google.com/spreadsheets/d/${sheetId}`
        : null;

      res.json({
        success: true,
        data: {
          sheetId,
          url,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
