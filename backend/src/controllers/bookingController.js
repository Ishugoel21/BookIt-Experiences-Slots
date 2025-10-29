import { getDB } from '../config/database.js';
import { isDataApiEnabled, dataApiFind, dataApiCount } from '../services/dataApi.js';
import { Booking } from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
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
    
    // Check if database is connected
    let booking;
    try {
      const db = getDB();
      
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
      booking = await Booking.create(db, {
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
    } catch (dbError) {
      console.warn('Database not available, creating demo booking:', dbError.message);
      // Create a demo booking when database is not available
      booking = {
        id: Date.now().toString(),
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
        appliedCoupon,
        createdAt: new Date(),
        demo: true
      };
    }
    
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
    const { experienceId, date } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
    const sortBy = req.query.sortBy || 'createdAt';
    const order = (req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;
    
    // Check if database is connected
    let bookings = [];
    try {
      const db = getDB();
      
      let query = {};
      if (experienceId) query.experienceId = experienceId;
      if (date) query.date = date;
      
      // Prefer Data API via fetch if configured (often faster in serverless)
      const projection = {
        _id: 1,
        bookingId: 1,
        experienceId: 1,
        experienceName: 1,
        date: 1,
        time: 1,
        quantity: 1,
        customerName: 1,
        customerEmail: 1,
        total: 1,
        createdAt: 1,
        status: 1
      };

      if (isDataApiEnabled()) {
        const [items, total] = await Promise.all([
          dataApiFind({
            collection: 'bookings',
            filter: query,
            sort: { [sortBy]: order, _id: order },
            limit,
            skip,
            projection
          }),
          dataApiCount({ collection: 'bookings', filter: query })
        ]);
        bookings = items;
        return res.json({
          success: true,
          bookings,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
      }

      // Fallback to native driver
      const cursor = db.collection('bookings')
        .find(query, { maxTimeMS: 5000, projection })
        .sort({ [sortBy]: order, _id: order })
        .skip(skip)
        .limit(limit);

      const [items, total] = await Promise.all([
        cursor.toArray(),
        db.collection('bookings').countDocuments(query)
      ]);
      bookings = items;
      return res.json({ success: true, bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (dbError) {
      console.warn('Database not available, returning empty bookings:', dbError.message);
      bookings = [];
    }
    
    res.json({ success: true, bookings, pagination: { page, limit, total: 0, totalPages: 0 } });
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
    const { experienceId, date } = req.query;
    
    if (!experienceId || !date) {
      return res.status(400).json({
        error: 'experienceId and date are required'
      });
    }
    
    // Check if database is connected
    let bookings = [];
    try {
      const db = getDB();

      // Prefer aggregation to reduce data transfer and compute in DB
      if (isDataApiEnabled()) {
        // Use Data API aggregate for group by time
        const url = `${process.env.MONGODB_DATA_API_URL}/action/aggregate`;
        const body = {
          dataSource: process.env.MONGODB_DATA_SOURCE,
          database: process.env.DB_NAME || 'slot-booking',
          collection: 'bookings',
          pipeline: [
            { $match: { experienceId, date, status: 'confirmed' } },
            { $group: { _id: '$time', booked: { $sum: '$quantity' } } }
          ]
        };
        const resAgg = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': process.env.MONGODB_DATA_API_KEY },
          body: JSON.stringify(body)
        });
        if (!resAgg.ok) {
          throw new Error(`Data API aggregate failed: ${resAgg.status}`);
        }
        const json = await resAgg.json();
        bookings = (json.documents || []).map(d => ({ time: d._id, quantity: d.booked }));
      } else {
        const agg = [
          { $match: { experienceId, date, status: 'confirmed' } },
          { $group: { _id: '$time', booked: { $sum: '$quantity' } } }
        ];
        const docs = await db.collection('bookings').aggregate(agg, { maxTimeMS: 3000 }).toArray();
        bookings = docs.map(d => ({ time: d._id, quantity: d.booked }));
      }
    } catch (dbError) {
      console.warn('Database not available, using demo data:', dbError.message);
      // Use demo data when database is not available
      bookings = [];
    }
    
    // Calculate availability for each time slot
    const timeSlots = [
      { time: "07:00 am", maxCapacity: 10 },
      { time: "09:00 am", maxCapacity: 10 },
      { time: "11:00 am", maxCapacity: 10 },
      { time: "01:00 pm", maxCapacity: 10 },
      { time: "03:00 pm", maxCapacity: 10 },
      { time: "05:00 pm", maxCapacity: 10 }
    ];
    
    const totalsByTime = new Map(bookings.map(b => [b.time, b.quantity]));
    const availability = timeSlots.map(slot => {
      const booked = totalsByTime.get(slot.time) || 0;
      
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

