const express = require('express');
const cors = require('cors');

const app = express();

/* ✅ ALLOW BOTH DOMAINS (VERY IMPORTANT) */
const allowedOrigins = [
  "http://localhost:3000",
  "https://career-campus.netlify.app",   // correct spelling
  "https://carrer-campus.netlify.app"    // your current live URL (wrong spelling but needed)
];

/* ✅ CORS CONFIG */
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

/* ✅ HANDLE PREFLIGHT REQUESTS */
app.options('*', cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ TEST ROUTE */
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

/* 👉 YOUR REAL ROUTES (UNCOMMENT WHEN READY) */
// const collegeRoutes = require('./routes/collegeRoutes');
// app.use('/api/colleges', collegeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});