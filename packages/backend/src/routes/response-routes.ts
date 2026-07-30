import { Router } from 'express';
import { responseController } from '../controllers/response-controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/:surveyId/responses', optionalAuth, responseController.submit.bind(responseController));
router.get('/:surveyId/responses', authenticate, responseController.getBySurvey.bind(responseController));
router.get('/:surveyId/analytics', responseController.getAnalytics.bind(responseController));

export default router;
