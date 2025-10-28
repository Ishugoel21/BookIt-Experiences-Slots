# Slot Booking Backend

Backend API for the slot booking system using Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from ENV_TEMPLATE.txt or see MONGODB_ATLAS_SETUP.md):

For MongoDB Atlas:
```env
# Server Port
PORT=3001

# MongoDB Atlas Connection String
# Get this from: MongoDB Atlas → Connect → Drivers → Node.js
# Replace username, password, and cluster with your actual values
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database Name
DB_NAME=slot-booking
```

**Important**: You MUST create the `.env` file with your MongoDB Atlas connection string!

3. Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env` to point to your MongoDB instance.

4. Install nodemon (for auto-reload in development):
```bash
npm install
```

5. Run the server:
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

The server will start on port 3001 by default and display connection status messages.

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Coupons
- `POST /api/coupons/validate` - Validate a coupon code
  - Body: `{ code: string, subtotal: number }`
  - Returns: `{ valid: boolean, discount: number, couponId: string }`

- `POST /api/coupons/record-usage` - Record coupon usage
  - Body: `{ couponId: string, email: string }`
  - Returns: `{ success: boolean }`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name (default: slot-booking)

