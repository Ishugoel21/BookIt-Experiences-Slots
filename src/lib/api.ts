const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '' // Use empty string for same-domain deployment (no /api prefix)
    : 'http://localhost:3001');

// Small fetch helper with timeout
const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) => {
  const { timeoutMs = 8000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...rest, signal: controller.signal, headers: { 'Accept': 'application/json', ...(rest.headers || {}) } });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

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
  
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    keepalive: true,
    // POSTs should not be cached client-side
    cache: 'no-store'
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
    
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    keepalive: true,
    cache: 'no-store'
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

// Simple in-memory cache for availability to speed up UX
const availabilityCache = new Map<string, { ts: number; data: AvailabilityResponse }>();
const AVAIL_TTL_MS = 5_000; // keep short to avoid stale UI

export const invalidateAvailabilityCache = (experienceId?: string, date?: string) => {
  if (!experienceId && !date) {
    availabilityCache.clear();
    return;
  }
  const prefix = `${experienceId || ''}|${date || ''}`;
  for (const key of Array.from(availabilityCache.keys())) {
    if (key.startsWith(prefix)) availabilityCache.delete(key);
  }
};

export const getAvailability = async (
  experienceId: string,
  date: string
): Promise<AvailabilityResponse> => {
  const url = import.meta.env.PROD 
    ? `${API_BASE_URL}/api/bookings/availability?experienceId=${experienceId}&date=${date}`
    : `${API_BASE_URL}/api/bookings/availability?experienceId=${experienceId}&date=${date}`;
  
  const cacheKey = `${experienceId}|${date}`;
  const cached = availabilityCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.ts) < AVAIL_TTL_MS) {
    return cached.data;
  }

  // retry-on-timeout logic for cold starts or transient network
  const maxAttempts = 2;
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(url, { cache: 'no-store', timeoutMs: attempt === 1 ? 15000 : 22000 });
      const data = await response.json();
      if (data && data.success) {
        availabilityCache.set(cacheKey, { ts: now, data });
      }
      return data;
    } catch (err: any) {
      lastError = err;
      // If aborted or network error, retry once
      const isAbort = err?.name === 'AbortError';
      if (!isAbort || attempt === maxAttempts) {
        throw new Error(isAbort ? 'Request timed out, please try again.' : (err?.message || 'Network error'));
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastError || new Error('Failed to fetch availability');
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
    
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    keepalive: true,
    cache: 'no-store'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create booking');
  }
  return data;
};

