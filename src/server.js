require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const quizResultsRouter = require('./routes/quizResults');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/constitutionlearn';

// Enable CORS for Live Server (port 5500)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Mount API routers
app.use('/', quizResultsRouter);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
    console.log('✓ Database: piston');
    console.log('✓ Collection: quizresults');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api/quiz-results`);
    });
  })
  .catch(err => {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    app.listen(PORT, () => console.log(`⚠ Server running on http://localhost:${PORT} (DB not connected)`));
  });

