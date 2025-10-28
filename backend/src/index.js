import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './config/database.js';
import couponRoutes from './routes/coupons.js';
import bookingRoutes from './routes/bookings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
const envPath = join(__dirname, '..', '.env');
console.log('📁 Looking for .env at:', envPath);
console.log('📍 Current working directory:', process.cwd());
dotenv.config({ path: envPath });
console.log('🔐 MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes (hidden for security)' : 'No');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/coupons', couponRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server after database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API endpoints:`);
      console.log(`   - Coupons: http://localhost:${PORT}/api/coupons`);
      console.log(`   - Bookings: http://localhost:${PORT}/api/bookings`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

