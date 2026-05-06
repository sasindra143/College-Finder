import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

/**
 * List all exams
 */
export const getExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let exams = await prisma.exam.findMany({
      include: { dates: true },
      orderBy: { updatedAt: 'desc' }
    });

    // AUTO-SEED: If no exams exist, seed them automatically and re-fetch
    if (exams.length === 0) {
      console.log('🚀 No exams found. Auto-seeding...');
      await performSeed();
      exams = await prisma.exam.findMany({
        include: { dates: true },
        orderBy: { updatedAt: 'desc' }
      });
    }

    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single exam by slug
 */
export const getExamBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    let exam = await prisma.exam.findUnique({
      where: { slug },
      include: { dates: { orderBy: { createdAt: 'asc' } } }
    });
    
    // AUTO-SEED: If specific exam not found, ensure defaults are seeded
    if (!exam) {
      console.log(`🚀 Exam '${slug}' not found. Ensuring default exams are seeded...`);
      await performSeed();
      exam = await prisma.exam.findUnique({
        where: { slug },
        include: { dates: { orderBy: { createdAt: 'asc' } } }
      });
    }

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper: Seeding Logic
 */
async function performSeed() {
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
      name: 'NEET UG 2025',
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
    },
    {
      name: 'CAT 2025',
      slug: 'cat-2025',
      category: 'Management',
      description: 'Common Admission Test is a premier management entrance exam for admission to IIMs and other top B-schools.',
      content: '<p>CAT is a computer-based test conducted by IIMs.</p>',
      eligibility: 'Bachelor\'s Degree with at least 50% marks or equivalent CGPA.',
      syllabus: 'VARC, DILR, and Quantitative Aptitude.',
      dates: {
        create: [
          { event: 'Registration Start', date: 'August 2025' },
          { event: 'Exam Date', date: 'November 2025' }
        ]
      }
    },
    {
      name: 'CLAT 2025',
      slug: 'clat-2025',
      category: 'Law',
      description: 'Common Law Admission Test is for admission to 22 National Law Universities (NLUs) in India.',
      content: '<p>CLAT is a national level entrance exam for UG and PG law courses.',
      eligibility: '10+2 or equivalent with 45% marks (40% for SC/ST).',
      syllabus: 'English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.',
      dates: {
        create: [
          { event: 'Registration Start', date: 'July 2024' },
          { event: 'Exam Date', date: 'December 2024' }
        ]
      }
    },
    {
      name: 'GATE 2025',
      slug: 'gate-2025',
      category: 'Engineering',
      description: 'Graduate Aptitude Test in Engineering is for admission to Master\'s programs and recruitment in PSUs.',
      content: '<p>GATE is conducted jointly by IISc and seven IITs.',
      eligibility: 'A candidate who is currently studying in the 3rd or higher years of any undergraduate degree program.',
      syllabus: 'General Aptitude and Candidate\'s chosen subject.',
      dates: {
        create: [
          { event: 'Registration Start', date: 'August 2024' },
          { event: 'Exam Date', date: 'February 2025' }
        ]
      }
    },
    {
      name: 'BITSAT 2025',
      slug: 'bitsat-2025',
      category: 'Engineering',
      description: 'Birla Institute of Technology and Science Admission Test is for admission to BITS campuses.',
      content: '<p>BITSAT is a computer-based online test for admission to Integrated First Degree programs of BITS Pilani, Goa, and Hyderabad.',
      eligibility: '12th pass with Physics, Chemistry, and Mathematics/Biology with minimum 75% marks.',
      syllabus: 'Physics, Chemistry, English Proficiency, Logical Reasoning, and Mathematics/Biology.',
      dates: {
        create: [
          { event: 'Registration Start', date: 'January 2025' },
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
}

/**
 * Seed default exams (Public Route)
 */
export const seedExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await performSeed();
    res.json({ success: true, message: 'Exams seeded successfully' });
  } catch (err) {
    next(err);
  }
};
