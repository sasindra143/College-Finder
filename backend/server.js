const express = require('express');
const cors = require('cors');

const app = express();

/* ✅ CORRECT CORS */
app.use(cors({
  origin: "https://career-campus.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options('*', cors()); // 🔥 FIXES PREFLIGHT

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});