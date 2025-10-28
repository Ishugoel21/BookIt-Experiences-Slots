export const Booking = {
  // This will be used in the bookings collection
  collection: 'bookings',
  
  // Create a booking
  create: async (db, bookingData) => {
    const bookings = db.collection('bookings');
    const booking = {
      ...bookingData,
      bookingId: Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date(),
      status: 'confirmed'
    };
    const result = await bookings.insertOne(booking);
    return { ...booking, _id: result.insertedId };
  },
  
  // Get bookings by experience and date
  getByExperienceAndDate: async (db, experienceId, date) => {
    const bookings = db.collection('bookings');
    return await bookings.find({
      experienceId,
      date,
      status: 'confirmed'
    }).toArray();
  },
  
  // Get slot availability
  getSlotAvailability: async (db, experienceId, date, time) => {
    const bookings = db.collection('bookings');
    const bookedCount = await bookings.countDocuments({
      experienceId,
      date,
      time,
      status: 'confirmed'
    });
    return bookedCount;
  },
  
  // Get all bookings
  getAll: async (db) => {
    const bookings = db.collection('bookings');
    return await bookings.find({}).toArray();
  }
};

