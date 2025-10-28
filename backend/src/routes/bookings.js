import express from 'express';
import { 
  createBooking, 
  getBookings, 
  getAvailability 
} from '../controllers/bookingController.js';

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/', createBooking);

// GET /api/bookings - Get all bookings (with optional query params)
router.get('/', getBookings);

// GET /api/bookings/availability - Get slot availability for a specific date
router.get('/availability', getAvailability);

export default router;

