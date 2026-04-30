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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow everything for convenience
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
