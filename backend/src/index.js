require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectMongoDB = require('./config/mongodb');
const connectPostgres = require('./config/postgres');

// Import Routes
const assignmentRoutes = require('./routes/assignment.routes');
const queryRoutes = require('./routes/query.routes');
const hintRoutes = require('./routes/hint.routes');
const authRoutes = require('./routes/auth.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

// Body Parser & Logging
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'CipherSQLStudio API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/hints', hintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database Connections & Server Start
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('✅ MongoDB connected successfully');
    
    // Connect to PostgreSQL
    await connectPostgres.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await connectPostgres.end();
  process.exit(0);
});
