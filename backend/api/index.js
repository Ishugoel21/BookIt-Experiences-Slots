import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🚀 Starting serverless function...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 MongoDB URI set:', !!process.env.MONGODB_URI);

// Global error handlers to prevent process exit
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('🔄 Continuing in demo mode...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('🔄 Continuing in demo mode...');
});

// Import modules
let connectDB, couponRoutes, bookingRoutes;

try {
  const databaseModule = await import('../src/config/database.js');
  connectDB = databaseModule.connectDB;
  
  const couponModule = await import('../src/routes/coupons.js');
  couponRoutes = couponModule.default;
  
  const bookingModule = await import('../src/routes/bookings.js');
  bookingRoutes = bookingModule.default;
  
  console.log('✅ Modules imported successfully');
} catch (importError) {
  console.error('❌ Failed to import modules:', importError);
  throw importError;
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? true : 'http://localhost:8080'),
  credentials: true
}));
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    originalUrl: req.originalUrl,
    url: req.url
  });
  next();
});

// Initialize database connection
let dbConnected = false;

const initializeDB = async () => {
  if (!dbConnected) {
    try {
      if (!process.env.MONGODB_URI) {
        console.warn('⚠️ MONGODB_URI not set, running in demo mode');
        dbConnected = false;
        return;
      }
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.warn('🔄 Continuing in demo mode without database');
      dbConnected = false;
    }
  }
};

// Initialize database on first request
app.use(async (req, res, next) => {
  if (!dbConnected && process.env.MONGODB_URI) {
    await initializeDB();
  }
  next();
});

// Routes - try both with and without /api prefix
app.use('/api/coupons', couponRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/coupons', couponRoutes);
app.use('/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnected ? 'connected' : 'demo mode'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnected ? 'connected' : 'demo mode'
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug route to test bookings
app.get('/bookings/debug', (req, res) => {
  res.json({
    message: 'Bookings route is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/bookings/debug', (req, res) => {
  res.json({
    message: 'Bookings route is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Slot Booking API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      coupons: '/coupons',
      bookings: '/bookings'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Debug route to catch all requests
app.use('*', (req, res) => {
  console.log('🔍 404 Handler triggered:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    url: req.url,
    query: req.query
  });
  
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    debug: {
      method: req.method,
      path: req.path,
      originalUrl: req.originalUrl,
      url: req.url
    }
  });
});

console.log('✅ Serverless function initialized successfully');

// Export for Vercel serverless functions
export default app;

// Also export as handler for Vercel
export const handler = app;