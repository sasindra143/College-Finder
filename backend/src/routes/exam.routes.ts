import { Router } from 'express';
import * as examController from '../controllers/exam.controller';

const router = Router();

// GET /api/exams - List all exams
router.get('/', examController.getExams);

// GET /api/exams/:slug - Get single exam detail
router.get('/:slug', examController.getExamBySlug);

// POST /api/exams/seed - Seed default exams
router.post('/seed', examController.seedExams);

export { router as examRoutes };
