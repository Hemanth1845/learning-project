require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const runSeeder = require('./config/seeder');

// Triggering database re-seed with rich textbook course content
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const dsaRoutes = require('./routes/dsa');
const interviewRoutes = require('./routes/interviews');
const dashboardRoutes = require('./routes/dashboard');
const notesRoutes = require('./routes/notes');
const theoryRoutes = require('./routes/theory');
const aptitudeRoutes = require('./routes/aptitude');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/aptitude', aptitudeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Study & Placement Prep Portal API is running' });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_prep';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully.');
    
    // Seed initial database
    await runSeeder();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
