import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import couponRoutes from '../src/routes/coupons.js';
import bookingRoutes from '../src/routes/bookings.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? true : 'http://localhost:8080'),
  credentials: true
}));
app.use(express.json());

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
      console.error('❌ Database connection failed:', error);
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

// Routes
app.use('/api/coupons', couponRoutes);
app.use('/api/bookings', bookingRoutes);

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

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'API is working!',
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
      coupons: '/api/coupons',
      bookings: '/api/bookings'
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Export for Vercel serverless functions
export default app;

// Also export as handler for Vercel
export const handler = app;
