export interface Experience {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
  category: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  date: string;
  times: {
    time: string;
    available: number;
    soldOut?: boolean;
  }[];
}

export interface Booking {
  experienceId: string;
  experienceName: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  fullName: string;
  email: string;
  promoCode?: string;
}
