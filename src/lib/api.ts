const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
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
  const response = await fetch(`${API_BASE_URL}/api/coupons/record-usage`, {
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
  const response = await fetch(
    `${API_BASE_URL}/api/bookings/availability?experienceId=${experienceId}&date=${date}`
  );
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
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
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

