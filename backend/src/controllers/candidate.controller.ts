import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { candidateService } from '../services/candidate.service';
import { aiService } from '../services/ai.service';

export const candidateController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        stage,
        riskLevel,
        region,
        taOwnerId,
        search,
        page = '1',
        limit = '20'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {
        isActive: true
      };

      if (stage) where.currentStageId = stage;
      if (riskLevel) where.riskLevel = riskLevel;
      if (region) where.region = region;
      if (taOwnerId) where.taOwnerId = taOwnerId;
      if (search) {
        where.OR = [
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
          { email: { contains: search as string } }
        ];
      }

      const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
          where,
          include: {
            currentStage: true,
            taOwner: { select: { id: true, firstName: true, lastName: true } },
            hmOwner: { select: { id: true, firstName: true, lastName: true } },
            hrOwner: { select: { id: true, firstName: true, lastName: true } }
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          orderBy: { joiningDate: 'asc' }
        }),
        prisma.candidate.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          candidates,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async exportCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const { Parser } = require('json2csv');
      const { stage, riskLevel, region, taOwnerId, search } = req.query;

      const where: any = { isActive: true };
      if (stage) where.currentStageId = stage;
      if (riskLevel) where.riskLevel = riskLevel;
      if (region) where.region = region;
      if (taOwnerId) where.taOwnerId = taOwnerId;
      if (search) {
        where.OR = [
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
          { email: { contains: search as string } }
        ];
      }

      const candidates = await prisma.candidate.findMany({
        where,
        include: {
          currentStage: true,
          taOwner: { select: { firstName: true, lastName: true } },
          hmOwner: { select: { firstName: true, lastName: true } },
          hrOwner: { select: { firstName: true, lastName: true } }
        },
        orderBy: { joiningDate: 'asc' }
      });

      const csvData = candidates.map(candidate => ({
        'First Name': candidate.firstName,
        'Last Name': candidate.lastName,
        'Email': candidate.email,
        'Phone': candidate.phone || '',
        'Job Title': candidate.jobTitle,
        'Compensation': candidate.compensation || '',
        'Currency': candidate.currency,
        'Joining Date': candidate.joiningDate,
        'Offer Date': candidate.offerDate,
        'Location': candidate.location || '',
        'Region': candidate.region,
        'Current Stage': candidate.currentStage?.name || '',
        'Offer Status': candidate.offerStatus,
        'Risk Level': candidate.riskLevel,
        'Risk Score': candidate.riskScore,
        'TA Owner': candidate.taOwner ? `${candidate.taOwner.firstName} ${candidate.taOwner.lastName}` : '',
        'Hiring Manager': candidate.hmOwner ? `${candidate.hmOwner.firstName} ${candidate.hmOwner.lastName}` : '',
        'HR Owner': candidate.hrOwner ? `${candidate.hrOwner.firstName} ${candidate.hrOwner.lastName}` : ''
      }));

      const parser = new Parser({});
      const csv = parser.parse(csvData);

      const filename = `candidates-${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateData = req.body;

      const firstStage = await prisma.stage.findFirst({
        orderBy: { orderIndex: 'asc' }
      });

      const candidate = await prisma.candidate.create({
        data: {
          ...candidateData,
          currentStageId: firstStage?.id,
          offerStatus: 'PENDING',
          riskLevel: 'LOW',
          riskScore: 0
        },
        include: {
          currentStage: true,
          taOwner: { select: { id: true, firstName: true, lastName: true } },
          hmOwner: { select: { id: true, firstName: true, lastName: true } },
          hrOwner: { select: { id: true, firstName: true, lastName: true } }
        }
      });

      res.status(201).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          currentStage: true,
          taOwner: { select: { id: true, firstName: true, lastName: true, email: true } },
          hmOwner: { select: { id: true, firstName: true, lastName: true, email: true } },
          hrOwner: { select: { id: true, firstName: true, lastName: true, email: true } },
          communications: {
            orderBy: { sentAt: 'desc' },
            take: 10
          },
          documents: true,
          bgvRecords: true,
          escalations: {
            where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
          }
        }
      });

      if (!candidate) {
        throw new AppError('Candidate not found', 404);
      }

      res.json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const candidate = await prisma.candidate.update({
        where: { id },
        data: updates,
        include: {
          currentStage: true,
          taOwner: { select: { id: true, firstName: true, lastName: true } }
        }
      });

      res.json({
        success: true,
        data: candidate
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.candidate.update({
        where: { id },
        data: { isActive: false }
      });

      res.json({
        success: true,
        message: 'Candidate deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const timeline = await candidateService.getTimeline(id);

      res.json({
        success: true,
        data: timeline
      });
    } catch (error) {
      next(error);
    }
  },

  async getRiskAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          communications: {
            orderBy: { sentAt: 'desc' },
            take: 20
          },
          documents: true,
          escalations: true
        }
      });

      if (!candidate) {
        throw new AppError('Candidate not found', 404);
      }

      const riskAssessment = await aiService.predictRenegeRisk(candidate);

      await prisma.candidate.update({
        where: { id },
        data: {
          riskScore: riskAssessment.riskScore,
          riskLevel: riskAssessment.riskLevel
        }
      });

      res.json({
        success: true,
        data: riskAssessment
      });
    } catch (error) {
      next(error);
    }
  },

  async advanceStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: { currentStage: true }
      });

      if (!candidate) {
        throw new AppError('Candidate not found', 404);
      }

      const nextStage = await prisma.stage.findFirst({
        where: {
          orderIndex: { gt: candidate.currentStage?.orderIndex || 0 }
        },
        orderBy: { orderIndex: 'asc' }
      });

      if (!nextStage) {
        throw new AppError('Already at final stage', 400);
      }

      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: { currentStageId: nextStage.id },
        include: {
          currentStage: true,
          taOwner: { select: { id: true, firstName: true, lastName: true } }
        }
      });

      res.json({
        success: true,
        data: updatedCandidate
      });
    } catch (error) {
      next(error);
    }
  }
};
