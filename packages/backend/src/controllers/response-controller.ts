import { Request, Response, NextFunction } from 'express';
import { responseService } from '../services/response-service';
import type { AuthenticatedRequest } from '../middleware/auth';

export class ResponseController {
  async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const response = await responseService.submit({
        surveyId: req.params.surveyId,
        answers: req.body.answers,
        respondentId: req.userId,
        respondentHash: req.body.respondentHash,
      });
      res.status(201).json({ success: true, data: response });
    } catch (err) { next(err); }
  }

  async getBySurvey(req: Request, res: Response, next: NextFunction) {
    try {
      const responses = await responseService.getBySurvey(req.params.surveyId);
      res.json({ success: true, data: responses });
    } catch (err) { next(err); }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await responseService.getAnalytics(req.params.surveyId);
      res.json({ success: true, data: analytics });
    } catch (err) { next(err); }
  }
}

export const responseController = new ResponseController();
