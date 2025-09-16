const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const axios = require('axios'); 
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const problemRoutes = require('./routes/problemRoutes');
const userRoutes = require('./routes/userRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for rate limiting (required for X-Forwarded-For headers)
app.set('trust proxy', 1);

// Cache setup (TTL: 10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting - Different limits for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 , // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for analysis endpoints
const analysisLimiter = rateLimit({
  windowMs: 5 * 60 * 1000 , // 5 minutes
  max: 20, // limit each IP to 20 analysis requests per 5 minutes
  message: {
    error: 'Too many analysis requests. Please wait before analyzing more problems.',
    retryAfter: Math.ceil(5 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiting for refresh operations
const refreshLimiter = rateLimit({
  windowMs: 10 * 60 * 1000 , // 10 minutes
  max: 5, // limit each IP to 5 refresh requests per 10 minutes
  message: {
    error: 'Too many refresh requests. Please wait before forcing more refreshes.',
    retryAfter: Math.ceil(10 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make cache available to routes
app.use((req, res, next) => {
  req.cache = cache;
  next();
});

// Routes with specific rate limiting
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisLimiter, analysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Function to wake up the API service
const wakeAPIService = async () => {
  if (!process.env.LEETCODE_API_BASE) {
    console.log("⚠️ LEETCODE_API_BASE is not set in .env");
    return;
  }

  try {
    console.log("⏳ Waking up API service...");
    const response = await axios.get(process.env.LEETCODE_API_BASE, { timeout: 5000 });
    console.log("✅ API service awake:", response.status, response.data ? "Data received" : "No data");
  } catch (err) {
    console.log("⚠️ Could not wake API service:", err.message);
  }
};

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Wake up the API service in background
    await wakeAPIService();

    app.listen(PORT,() => {
      console.log(`🚀 LeetCode Companion Backend running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Database: Connected to PostgreSQL`);
      console.log(`🤖 AI: Gemini integration enabled`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
