import { MongoClient } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'slot-booking';

let client;
let db;

export const connectDB = async () => {
  const URI = process.env.MONGODB_URI;
  
  if (!URI) {
    console.warn('⚠️ MONGODB_URI environment variable is not set!');
    console.warn('📝 Running in demo mode without database connection.');
    throw new Error('MONGODB_URI not configured');
  }
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    client = new MongoClient(URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📦 Database: ${DB_NAME}`);
    
    // Create indexes
    console.log('📋 Creating indexes...');
    await createIndexes();
    console.log('✅ Indexes created successfully!');
    
    // Seed initial data
    console.log('🌱 Seeding sample data...');
    await seedCoupons();
    console.log('✅ Database ready!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. If using MongoDB Atlas, check:');
    console.error('      - Your username and password in MONGODB_URI');
    console.error('      - Your IP is whitelisted in Network Access');
    console.error('      - Your cluster is running (not paused)');
    console.error('   2. If using local MongoDB, make sure MongoDB is installed and running');
    console.error('   3. Check MONGODB_ATLAS_SETUP.md for detailed setup instructions\n');
    throw error; // Throw error instead of exiting process
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

const createIndexes = async () => {
  const couponsCollection = db.collection('coupons');
  await couponsCollection.createIndex({ code: 1 }, { unique: true });
  await couponsCollection.createIndex({ is_active: 1, expires_at: 1 });
  
  const usageCollection = db.collection('coupon_usage');
  await usageCollection.createIndex({ coupon_id: 1, email: 1 });
  await usageCollection.createIndex({ coupon_id: 1 });
};

const seedCoupons = async () => {
  const couponsCollection = db.collection('coupons');
  
  // Check if coupons already exist
  const existingCoupons = await couponsCollection.countDocuments();
  
  if (existingCoupons > 0) {
    console.log(`ℹ️  Found ${existingCoupons} existing coupons, skipping seed.`);
    return;
  }
  
  if (existingCoupons === 0) {
    console.log('📝 Inserting sample coupons...');
    const sampleCoupons = [
      {
        code: 'SAVE10',
        discount_type: 'percentage',
        discount_value: 10,
        max_uses: null,
        current_uses: 0,
        is_active: true,
        expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'FLAT100',
        discount_type: 'fixed',
        discount_value: 100,
        max_uses: null,
        current_uses: 0,
        is_active: true,
        expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'WELCOME50',
        discount_type: 'fixed',
        discount_value: 50,
        max_uses: 100,
        current_uses: 0,
        is_active: true,
        expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'SUMMER20',
        discount_type: 'percentage',
        discount_value: 20,
        max_uses: 50,
        current_uses: 0,
        is_active: true,
        expires_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await couponsCollection.insertMany(sampleCoupons);
    console.log('✅ Sample coupons seeded successfully');
  }
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

