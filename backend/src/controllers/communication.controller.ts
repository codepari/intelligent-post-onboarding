import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const communicationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidateId, type, status } = req.query;

      const where: any = {};
      if (candidateId) where.candidateId = candidateId;
      if (type) where.type = type;
      if (status) where.status = status;

      const communications = await prisma.communication.findMany({
        where,
        include: {
          candidate: { select: { firstName: true, lastName: true } },
          sentBy: { select: { firstName: true, lastName: true } }
        },
        orderBy: { sentAt: 'desc' },
        take: 50
      });

      res.json({
        success: true,
        data: communications
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const communication = await prisma.communication.create({
        data: req.body
      });

      res.status(201).json({
        success: true,
        data: communication
      });
    } catch (error) {
      next(error);
    }
  },

  async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      // Email sending logic would go here
      res.json({
        success: true,
        message: 'Email sent successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getUpcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const upcoming = await prisma.communication.findMany({
        where: {
          status: 'SCHEDULED',
          sentAt: { gte: new Date() }
        },
        include: {
          candidate: { select: { firstName: true, lastName: true } }
        },
        orderBy: { sentAt: 'asc' }
      });

      res.json({
        success: true,
        data: upcoming
      });
    } catch (error) {
      next(error);
    }
  }
};
