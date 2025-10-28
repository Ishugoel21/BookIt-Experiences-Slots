import { getDB } from '../config/database.js';
import { Booking } from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const db = getDB();
    const {
      experienceId,
      experienceName,
      date,
      time,
      quantity,
      customerName,
      customerEmail,
      subtotal,
      taxes,
      total,
      discount = 0,
      appliedCoupon
    } = req.body;
    
    // Validate required fields
    if (!experienceId || !date || !time || !customerName || !customerEmail) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }
    
    // Check slot availability
    const existingBookings = await Booking.getByExperienceAndDate(
      db,
      experienceId,
      date
    );
    
    const bookedInTimeSlot = existingBookings.filter(b => b.time === time)
      .reduce((sum, b) => sum + b.quantity, 0);
    
    // Assuming max 10 slots per time slot
    const maxCapacity = 10;
    if (bookedInTimeSlot + quantity > maxCapacity) {
      return res.status(400).json({
        error: 'Not enough slots available',
        available: maxCapacity - bookedInTimeSlot
      });
    }
    
    // Create booking
    const booking = await Booking.create(db, {
      experienceId,
      experienceName,
      date,
      time,
      quantity,
      customerName,
      customerEmail,
      subtotal,
      taxes,
      total,
      discount,
      appliedCoupon
    });
    
    res.status(201).json({
      success: true,
      booking,
      message: 'Booking confirmed successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const db = getDB();
    const { experienceId, date } = req.query;
    
    let query = {};
    if (experienceId) query.experienceId = experienceId;
    if (date) query.date = date;
    
    const bookings = await db.collection('bookings').find(query).toArray();
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error.message
    });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const db = getDB();
    const { experienceId, date } = req.query;
    
    if (!experienceId || !date) {
      return res.status(400).json({
        error: 'experienceId and date are required'
      });
    }
    
    // Get all bookings for this experience on this date
    const bookings = await Booking.getByExperienceAndDate(db, experienceId, date);
    
    // Calculate availability for each time slot
    const timeSlots = [
      { time: "07:00 am", maxCapacity: 10 },
      { time: "09:00 am", maxCapacity: 10 },
      { time: "11:00 am", maxCapacity: 10 },
      { time: "01:00 pm", maxCapacity: 10 },
      { time: "03:00 pm", maxCapacity: 10 },
      { time: "05:00 pm", maxCapacity: 10 }
    ];
    
    const availability = timeSlots.map(slot => {
      const booked = bookings
        .filter(b => b.time === slot.time)
        .reduce((sum, b) => sum + b.quantity, 0);
      
      const available = Math.max(0, slot.maxCapacity - booked);
      
      return {
        time: slot.time,
        booked,
        available,
        soldOut: available === 0,
        maxCapacity: slot.maxCapacity
      };
    });
    
    res.json({
      success: true,
      date,
      availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      error: 'Failed to fetch availability',
      message: error.message
    });
  }
};

