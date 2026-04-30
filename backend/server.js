const express = require('express');
const cors = require('cors');

const app = express();

/* ✅ STEP 1 — CORS (PUT THIS FIRST) */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://career-campus.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

/* ✅ STEP 2 — EXTRA HEADERS (PUT AFTER CORS) */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://career-campus.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

/* ✅ STEP 3 — BODY PARSER */
app.use(express.json());

/* ✅ STEP 4 — ROUTES */
// Example:
// const collegeRoutes = require('./routes/collegeRoutes');
// app.use('/api/colleges', collegeRoutes);

/* ✅ TEST ROUTE */
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});