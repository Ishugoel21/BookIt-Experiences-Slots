import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../../src/config/database.js';
import couponRoutes from '../../src/routes/coupons.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize database connection
let dbConnected = false;

const initializeDB = async () => {
  if (!dbConnected) {
    try {
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
  if (!dbConnected) {
    await initializeDB();
  }
  next();
});

// Routes
app.use('/', couponRoutes);

export default app;
