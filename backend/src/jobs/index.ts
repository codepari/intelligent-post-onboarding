import cron from 'node-cron';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import { aiService } from '../services/ai.service';
import { differenceInDays } from 'date-fns';

export const initializeJobs = () => {
  logger.info('Initializing scheduled jobs...');

  // Job 1: Update risk scores daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running daily risk score update job');
    try {
      const candidates = await prisma.candidate.findMany({
        where: {
          isActive: true,
          joiningDate: { gte: new Date() }
        },
        include: {
          communications: {
            orderBy: { sentAt: 'desc' },
            take: 20
          },
          documents: true,
          escalations: true
        }
      });

      for (const candidate of candidates) {
        const riskAssessment = await aiService.predictRenegeRisk(candidate);

        await prisma.candidate.update({
          where: { id: candidate.id },
          data: {
            riskScore: riskAssessment.riskScore,
            riskLevel: riskAssessment.riskLevel
          }
        });

        // Store AI insight
        await prisma.aIInsight.create({
          data: {
            candidateId: candidate.id,
            insightType: 'RENEGE_RISK',
            score: riskAssessment.riskScore,
            confidence: riskAssessment.confidence,
            details: riskAssessment,
            recommendations: riskAssessment.recommendations.join('\n')
          }
        });
      }

      logger.info(`Updated risk scores for ${candidates.length} candidates`);
    } catch (error) {
      logger.error('Error in risk score update job:', error);
    }
  });

  // Job 2: Check for overdue communications every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Checking for overdue communications');
    try {
      const candidates = await prisma.candidate.findMany({
        where: {
          isActive: true,
          joiningDate: { gte: new Date() }
        },
        include: {
          taOwner: true
        }
      });

      for (const candidate of candidates) {
        if (candidate.lastContactDate) {
          const daysSinceContact = differenceInDays(new Date(), candidate.lastContactDate);

          if (daysSinceContact >= 7) {
            // Create escalation
            await prisma.escalation.create({
              data: {
                candidateId: candidate.id,
                reason: 'No contact for 7+ days',
                description: `Candidate ${candidate.firstName} ${candidate.lastName} has not been contacted in ${daysSinceContact} days`,
                severity: daysSinceContact >= 10 ? 'HIGH' : 'MEDIUM',
                escalatedById: candidate.taOwnerId || '',
                status: 'OPEN'
              }
            });

            logger.warn(`Created escalation for candidate ${candidate.id} due to ${daysSinceContact} days of no contact`);
          }
        }
      }
    } catch (error) {
      logger.error('Error in overdue communications check:', error);
    }
  });

  // Job 3: Send joining reminders
  cron.schedule('0 9 * * *', async () => {
    logger.info('Sending joining reminders');
    try {
      // T-7 days reminders
      const t7Candidates = await prisma.candidate.findMany({
        where: {
          isActive: true,
          joiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      logger.info(`Found ${t7Candidates.length} candidates joining in 7 days`);

      // T-1 day reminders
      const t1Candidates = await prisma.candidate.findMany({
        where: {
          isActive: true,
          joiningDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        }
      });

      logger.info(`Found ${t1Candidates.length} candidates joining tomorrow`);

      // Actual reminder sending would be implemented here
    } catch (error) {
      logger.error('Error in joining reminders job:', error);
    }
  });

  logger.info('Scheduled jobs initialized successfully');
};
