const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const musicRoutes = require('./routes/music');
const { verifyToken } = require('./middleware/auth');
const { connectDB } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
const frontendPath = path.join(__dirname, '..');
const staticPath = path.join(frontendPath, 'frontend');
app.use(express.static(staticPath));

// Fallback route to serve index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', verifyToken, musicRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Welcome to the music streaming server!');
});

module.exports = app;