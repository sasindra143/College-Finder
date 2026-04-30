import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MASTER_EXAMS = [
  {
    name: 'JEE Main 2025',
    slug: 'jee-main-2025',
    category: 'Engineering',
    description: 'Joint Entrance Examination (Main) for admission to NITs, IIITs and other CFTIs.',
    content: '<h2>JEE Main 2025</h2><p>NTA conducts JEE Main in two sessions. Top 2.5 lakh candidates qualify for JEE Advanced.</p>',
    eligibility: '12th pass with Physics and Math.',
    dates: [
      { event: 'Session 1 Registration', date: 'November 2024' },
      { event: 'Session 1 Exam', date: 'January 2025' }
    ]
  },
  {
    name: 'NEET UG 2025',
    slug: 'neet-ug-2025',
    category: 'Medical',
    description: 'National Eligibility cum Entrance Test for MBBS and BDS admissions in India.',
    content: '<h2>NEET UG 2025</h2><p>Single entrance exam for all medical colleges in India, including AIIMS and JIPMER.</p>',
    eligibility: '17 years of age, 12th with PCB.',
    dates: [
      { event: 'Notification', date: 'February 2025' },
      { event: 'Exam Date', date: 'May 5, 2025' }
    ]
  },
  {
    name: 'GATE 2025',
    slug: 'gate-2025',
    category: 'Engineering',
    description: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU jobs.',
    content: '<h2>GATE 2025</h2><p>Jointly conducted by IISc and IITs. Valid for 3 years.</p>',
    eligibility: 'Bachelor degree in Engineering/Science.',
    dates: [
      { event: 'Registration', date: 'August 2024' },
      { event: 'Exam Date', date: 'February 2025' }
    ]
  },
  {
    name: 'CAT 2024',
    slug: 'cat-2024',
    category: 'Management',
    description: 'Common Admission Test for MBA admissions in IIMs and other top B-schools.',
    content: '<h2>CAT 2024</h2><p>Conducted by IIMs on a rotational basis. Computer-based test.</p>',
    eligibility: 'Bachelor degree with 50%.',
    dates: [
      { event: 'Registration', date: 'August 2024' },
      { event: 'Exam Date', date: 'November 24, 2024' }
    ]
  }
];

async function main() {
  console.log('🌱 Seeding comprehensive Exams dataset...');

  await prisma.examDate.deleteMany();
  await prisma.exam.deleteMany();

  for (const e of MASTER_EXAMS) {
    await prisma.exam.create({
      data: {
        name: e.name,
        slug: e.slug,
        category: e.category,
        description: e.description,
        content: e.content,
        eligibility: e.eligibility,
        dates: {
          create: e.dates
        }
      }
    });
    console.log(`✅ Seeded Exam: ${e.name}`);
  }

  console.log('🎉 Exam seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
