import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export const documentController = {
  async listByCandidateId(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidateId } = req.params;

      const documents = await prisma.document.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      next(error);
    }
  },

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const { candidateId, type } = req.body;

      const document = await prisma.document.create({
        data: {
          candidateId,
          type,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          status: 'SUBMITTED',
          uploadedAt: new Date()
        }
      });

      res.status(201).json({
        success: true,
        data: document
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.document.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
