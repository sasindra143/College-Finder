const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 IMPORTANT: connect your real routes here
// Example:
// const collegeRoutes = require('./routes/collegeRoutes');
// app.use('/api/colleges', collegeRoutes);

// Temporary test route
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});