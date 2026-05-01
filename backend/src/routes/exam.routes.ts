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

// POST /api/exams/seed - Seed default exams
router.post('/seed', async (req, res, next) => {
  try {
    const exams = [
      {
        name: 'JEE Main 2025',
        slug: 'jee-main-2025',
        category: 'Engineering',
        description: 'Joint Entrance Examination (Main) is a national level entrance exam conducted by NTA for admission to B.Tech/B.Arch courses.',
        content: '<p>JEE Main 2025 will be conducted in two sessions: January and April.</p>',
        eligibility: 'Candidates must have passed 10+2 or equivalent examinations with Physics, Mathematics, and one of the subjects from Chemistry/Biology/Biotechnology/Technical Vocational Subject.',
        syllabus: 'Physics, Chemistry, and Mathematics of Class 11 and 12.',
        dates: {
          create: [
            { event: 'Registration Start (Session 1)', date: 'November 2024' },
            { event: 'Exam Date (Session 1)', date: 'January 2025' }
          ]
        }
      },
      {
        name: 'NEET 2025',
        slug: 'neet-2025',
        category: 'Medical',
        description: 'National Eligibility cum Entrance Test is for admission to MBBS/BDS courses across India.',
        content: '<p>NEET is the only medical entrance exam in India.</p>',
        eligibility: 'Must have passed 10+2 with Physics, Chemistry, Biology/Biotechnology.',
        syllabus: 'Physics, Chemistry, and Biology (Botany & Zoology) of Class 11 and 12.',
        dates: {
          create: [
            { event: 'Registration Start', date: 'February 2025' },
            { event: 'Exam Date', date: 'May 2025' }
          ]
        }
      }
    ];

    for (const ex of exams) {
      await prisma.exam.upsert({
        where: { slug: ex.slug },
        update: {},
        create: ex
      });
    }

    res.json({ success: true, message: 'Exams seeded successfully' });
  } catch (err) {
    next(err);
  }
});

export { router as examRoutes };
