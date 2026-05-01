import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./lib/passport";
import { prisma } from "./lib/prisma";

// Routes
import { collegeRoutes } from "./routes/college.routes";
import { examRoutes } from "./routes/exam.routes";
import { authRoutes } from "./routes/auth.routes";
import { savedRoutes } from "./routes/saved.routes";
import qaRoutes from "./routes/qa.routes";

// Middleware
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// ✅ FIX: Always use correct port (Render provides PORT)
const PORT = Number(process.env.PORT) || 5000;

// ========================
// ✅ CORS FIX (IMPORTANT)
// ========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL, // production frontend
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps / Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================
// Middlewares
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ========================
// Health Check
// ========================
app.get("/", (_req, res) => {
  res.send("🚀 CareerCampus API Running");
});

// ========================
// Routes
// ========================
app.use("/api/colleges", collegeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/qa", qaRoutes);

// ========================
// 404 Handler
// ========================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

// ========================
// Start Server
// ========================
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    const collegeCount = await prisma.college.count();
    console.log(`📊 Database has ${collegeCount} colleges`);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
});

export default app;