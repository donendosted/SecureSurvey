import { Request, Response, NextFunction } from 'express';
import { surveyService } from '../services/survey-service';
import type { AuthenticatedRequest } from '../middleware/auth';

export class SurveyController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const survey = await surveyService.create(req.body, req.userId!);
      res.status(201).json({ success: true, data: survey });
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const survey = await surveyService.getById(req.params.id);
      res.json({ success: true, data: survey });
    } catch (err) { next(err); }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const survey = await surveyService.update(req.params.id, req.body, req.userId!);
      res.json({ success: true, data: survey });
    } catch (err) { next(err); }
  }

  async publish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const survey = await surveyService.publish(req.params.id, req.userId!);
      res.json({ success: true, data: survey });
    } catch (err) { next(err); }
  }

  async close(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const survey = await surveyService.close(req.params.id, req.userId!);
      res.json({ success: true, data: survey });
    } catch (err) { next(err); }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await surveyService.list({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as any,
        search: search as string,
      });
      res.json({
        success: true,
        data: {
          items: result.items,
          pagination: {
            page: parseInt(page as string) || 1,
            limit: parseInt(limit as string) || 20,
            total: result.total,
            totalPages: Math.ceil(result.total / (parseInt(limit as string) || 20)),
            hasNext: (parseInt(page as string) || 1) * (parseInt(limit as string) || 20) < result.total,
            hasPrev: (parseInt(page as string) || 1) > 1,
          },
        },
      });
    } catch (err) { next(err); }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await surveyService.delete(req.params.id, req.userId!);
      res.json({ success: true, data: null });
    } catch (err) { next(err); }
  }
}

export const surveyController = new SurveyController();
