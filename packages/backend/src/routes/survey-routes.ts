import { Router } from 'express';
import { surveyController } from '../controllers/survey-controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, surveyController.create.bind(surveyController));
router.get('/', surveyController.list.bind(surveyController));
router.get('/:id', surveyController.getById.bind(surveyController));
router.put('/:id', authenticate, surveyController.update.bind(surveyController));
router.post('/:id/publish', authenticate, surveyController.publish.bind(surveyController));
router.post('/:id/close', authenticate, surveyController.close.bind(surveyController));
router.delete('/:id', authenticate, surveyController.delete.bind(surveyController));

export default router;
