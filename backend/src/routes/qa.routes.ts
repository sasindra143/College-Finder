import { Router } from 'express';
import { getQuestions, getQuestion, askQuestion, answerQuestion } from '../controllers/qa.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/', authenticate, askQuestion);
router.post('/:id/answers', authenticate, answerQuestion);

export default router;
