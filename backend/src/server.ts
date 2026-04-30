import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { collegeRoutes } from './routes/college.routes';
import { examRoutes } from './routes/exam.routes';
import { authRoutes } from './routes/auth.routes';
import { savedRoutes } from './routes/saved.routes';
import qaRoutes from './routes/qa.routes';
import { errorHandler } from './middleware/error.middleware';
import passport from './lib/passport';
import { prisma } from './lib/prisma';
import { MASTER_COLLEGES } from '../prisma/seed_data'; // We'll create this file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://college-discovery-application.netlify.app',
  'https://career-campus.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/', (_req, res) => {
  res.send('CareerCampus API Running 🚀');
});

// Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/qa', qaRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Auto-seed if database is empty
  try {
    const collegeCount = await prisma.college.count();
    if (collegeCount === 0) {
      console.log('📭 Database is empty. Seeding initial data...');
      for (const c of MASTER_COLLEGES) {
        await prisma.college.upsert({
          where: { slug: c.slug },
          update: {},
          create: {
            ...c,
            location: `${c.city}, ${c.state}`,
            imageUrl: `https://images.unsplash.com/photo-1562774053-701939374585?w=800`,
            courses: {
              create: [
                { name: (c.degrees[0] || 'Bachelor') + ' Course', duration: '3-4 Years', fees: c.fees, seats: 120, eligibility: '12th Grade' }
              ]
            }
          }
        });
      }
      console.log('✅ Auto-seeding complete!');
    } else {
      console.log(`📊 Database has ${collegeCount} colleges.`);
    }
  } catch (err) {
    console.error('❌ Auto-seeding failed:', err);
  }
});

export default app;
