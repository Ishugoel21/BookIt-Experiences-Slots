# Slot Booking Pro

A modern slot booking system with coupon management, built with React, Node.js, Express, and MongoDB.

## Architecture

This project has been separated into frontend and backend:

- **Frontend**: React + TypeScript + Vite + shadcn-ui
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB (replacing Supabase)

## Project Structure

```
.
├── backend/              # Backend API server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── README.md
├── src/                  # Frontend React application
│   ├── components/       # React components
│   ├── lib/              # API client and utilities
│   ├── pages/            # Page components
│   └── ...
└── package.json          # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas)

### Frontend Setup

1. Navigate to the root directory and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (or copy from ENV_TEMPLATE.txt):
```bash
# Backend API URL
VITE_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (or copy from backend/ENV_TEMPLATE.txt):
```bash
# Server Port
PORT=3001

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/

# Database Name
DB_NAME=slot-booking
```

4. Start MongoDB (if running locally):
```bash
# On macOS/Linux
brew services start mongodb-community

# On Windows
mongod
```

5. Start the backend server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend API will be available at `http://localhost:3001`

## Features

- Browse available experiences
- **Dynamic Calendar**: Pick any date with a full calendar picker
- **Real-time Availability**: See available slots fetched from the backend
- **Smart Booking System**: Slots automatically marked as booked when reserved
- Apply coupon codes with validation
- Track coupon usage to prevent abuse
- Complete checkout flow with booking confirmation

## API Endpoints

### Coupons

- `POST /api/coupons/validate` - Validate a coupon code
  - Request body: `{ code: string, subtotal: number }`
  - Response: `{ valid: boolean, discount: number, couponId: string }`

- `POST /api/coupons/record-usage` - Record coupon usage
  - Request body: `{ couponId: string, email: string }`
  - Response: `{ success: boolean }`

### Bookings

- `GET /api/bookings/availability` - Get slot availability for a date
  - Query params: `experienceId`, `date`
  - Response: `{ success: boolean, date: string, availability: [...] }`

- `POST /api/bookings` - Create a new booking
  - Request body: `{ experienceId, experienceName, date, time, quantity, customerName, customerEmail, subtotal, taxes, total, discount?, appliedCoupon? }`
  - Response: `{ success: boolean, booking: {...}, message: string }`

- `GET /api/bookings` - Get all bookings (with optional query params)
  - Query params: `experienceId?`, `date?`
  - Response: `{ success: boolean, bookings: [...] }`

## Sample Coupon Codes

The backend seeds the following coupon codes:

- `SAVE10` - 10% discount
- `FLAT100` - ₹100 off
- `WELCOME50` - ₹50 off (max 100 uses)
- `SUMMER20` - 20% discount (max 50 uses)

## Technologies Used

### Frontend
- Vite
- TypeScript
- React 18
- React Router
- shadcn-ui
- Tailwind CSS
- TanStack Query

### Backend
- Node.js
- Express
- MongoDB
- CORS

## Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting service. Set the `VITE_API_URL` environment variable to your backend API URL.

### Backend
Deploy to Railway, Render, Heroku, or any Node.js hosting service. Make sure to set the MongoDB connection string in your environment variables.

## License

MIT
