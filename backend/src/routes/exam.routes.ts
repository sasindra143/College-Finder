import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/exams - List all exams
router.get('/', async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      include: { dates: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
});

// GET /api/exams/:slug - Get single exam detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const exam = await prisma.exam.findUnique({
      where: { slug },
      include: { dates: { orderBy: { createdAt: 'asc' } } }
    });
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
});

export { router as examRoutes };
