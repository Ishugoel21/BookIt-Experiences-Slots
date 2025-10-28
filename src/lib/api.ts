const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '' // Use empty string for same-domain deployment (no /api prefix)
    : 'http://localhost:3001');

export interface ValidateCouponRequest {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discount: number;
  couponId: string;
  discountType: string;
  discountValue: number;
  error?: string;
}

export interface RecordCouponUsageRequest {
  couponId: string;
  email: string;
}

export interface RecordCouponUsageResponse {
  success: boolean;
  error?: string;
}

// Validate coupon code
export const validateCoupon = async (
  request: ValidateCouponRequest
): Promise<ValidateCouponResponse> => {
  const url = import.meta.env.PROD 
    ? `${API_BASE_URL}/api/coupons/validate`
    : `${API_BASE_URL}/api/coupons/validate`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data;
};

// Record coupon usage
export const recordCouponUsage = async (
  request: RecordCouponUsageRequest
): Promise<RecordCouponUsageResponse> => {
  const url = import.meta.env.PROD 
    ? `${API_BASE_URL}/api/coupons/record-usage`
    : `${API_BASE_URL}/api/coupons/record-usage`;
    
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data;
};

// Booking API
export interface SlotAvailability {
  time: string;
  booked: number;
  available: number;
  soldOut: boolean;
  maxCapacity: number;
}

export interface AvailabilityResponse {
  success: boolean;
  date: string;
  availability: SlotAvailability[];
}

export const getAvailability = async (
  experienceId: string,
  date: string
): Promise<AvailabilityResponse> => {
  const url = import.meta.env.PROD 
    ? `${API_BASE_URL}/api/bookings/availability?experienceId=${experienceId}&date=${date}`
    : `${API_BASE_URL}/api/bookings/availability?experienceId=${experienceId}&date=${date}`;
    
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export interface CreateBookingRequest {
  experienceId: string;
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  taxes: number;
  total: number;
  discount?: number;
  appliedCoupon?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  booking: any;
  message: string;
}

export const createBooking = async (
  request: CreateBookingRequest
): Promise<CreateBookingResponse> => {
  const url = import.meta.env.PROD 
    ? `${API_BASE_URL}/api/bookings`
    : `${API_BASE_URL}/api/bookings`;
    
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create booking');
  }
  return data;
};

