import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export const templateController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, category, region } = req.query;

      const where: any = { isActive: true };
      if (type) where.type = type;
      if (category) where.category = category;
      if (region) where.region = region;

      const templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await prisma.template.create({
        data: {
          ...req.body,
          createdById: req.user?.userId
        }
      });

      res.status(201).json({
        success: true,
        data: template
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        throw new AppError('Template not found', 404);
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const template = await prisma.template.update({
        where: { id },
        data: req.body
      });

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      next(error);
    }
  },

  async preview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const template = await prisma.template.findUnique({
        where: { id }
      });

      if (!template) {
        throw new AppError('Template not found', 404);
      }

      // Replace variables in template
      let preview = template.body;
      Object.keys(data).forEach(key => {
        preview = preview.replace(new RegExp(`{${key}}`, 'g'), data[key]);
      });

      res.json({
        success: true,
        data: {
          subject: template.subject,
          body: preview
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
