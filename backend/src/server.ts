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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Dynamically allow the requesting origin
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
  console.log(`🚀 Server running on port ${PORT}`);
  
  try {
    const collegeCount = await prisma.college.count();
    console.log(`📊 Database has ${collegeCount} colleges.`);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
});

export default app;
