import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { differenceInDays } from 'date-fns';

export const analyticsController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalCandidates,
        candidatesByStage,
        candidatesByRisk,
        upcomingJoinings,
        atRiskCandidates
      ] = await Promise.all([
        prisma.candidate.count({ where: { isActive: true } }),
        prisma.candidate.groupBy({
          by: ['currentStageId'],
          _count: true,
          where: { isActive: true }
        }),
        prisma.candidate.groupBy({
          by: ['riskLevel'],
          _count: true,
          where: { isActive: true }
        }),
        prisma.candidate.count({
          where: {
            isActive: true,
            joiningDate: {
              gte: new Date().toISOString().split('T')[0],
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          }
        }),
        prisma.candidate.count({
          where: {
            isActive: true,
            riskLevel: { in: ['HIGH', 'CRITICAL'] }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalCandidates,
          candidatesByStage,
          candidatesByRisk,
          upcomingJoinings,
          atRiskCandidates
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getOfferAcceptance(req: Request, res: Response, next: NextFunction) {
    try {
      const [total, accepted] = await Promise.all([
        prisma.candidate.count(),
        prisma.candidate.count({ where: { offerStatus: 'ACCEPTED' } })
      ]);

      const rate = total > 0 ? (accepted / total) * 100 : 0;

      res.json({
        success: true,
        data: {
          total,
          accepted,
          rate: rate.toFixed(2)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getConversion(req: Request, res: Response, next: NextFunction) {
    try {
      const accepted = await prisma.candidate.count({
        where: { offerStatus: 'ACCEPTED' }
      });

      // Candidates who actually joined (reached final stage or joined)
      const stages = await prisma.stage.findMany({ orderBy: { orderIndex: 'desc' } });
      const finalStage = stages[0];

      const joined = await prisma.candidate.count({
        where: {
          offerStatus: 'ACCEPTED',
          currentStageId: finalStage?.id
        }
      });

      const rate = accepted > 0 ? (joined / accepted) * 100 : 0;

      res.json({
        success: true,
        data: {
          accepted,
          joined,
          rate: rate.toFixed(2)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getStageDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const distribution = await prisma.candidate.groupBy({
        by: ['currentStageId'],
        _count: true,
        where: { isActive: true }
      });

      const stages = await prisma.stage.findMany();

      const data = distribution.map(d => {
        const stage = stages.find(s => s.id === d.currentStageId);
        return {
          stage: stage?.name || 'Unknown',
          count: d._count
        };
      });

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
};
