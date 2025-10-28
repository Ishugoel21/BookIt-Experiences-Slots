import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Kayaking",
    location: "Udupi",
    price: 999,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.",
    category: "Adventure",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "07:00 am", available: 6 },
          { time: "09:00 am", available: 2 },
          { time: "11:00 am", available: 5 },
          { time: "01:00 pm", available: 0, soldOut: true },
        ],
      },
      {
        date: "Oct 23",
        times: [
          { time: "07:00 am", available: 4 },
          { time: "09:00 am", available: 3 },
          { time: "11:00 am", available: 6 },
          { time: "01:00 pm", available: 2 },
        ],
      },
      {
        date: "Oct 24",
        times: [
          { time: "07:00 am", available: 5 },
          { time: "09:00 am", available: 4 },
          { time: "11:00 am", available: 3 },
          { time: "01:00 pm", available: 1 },
        ],
      },
      {
        date: "Oct 25",
        times: [
          { time: "07:00 am", available: 6 },
          { time: "09:00 am", available: 5 },
          { time: "11:00 am", available: 4 },
          { time: "01:00 pm", available: 3 },
        ],
      },
      {
        date: "Oct 26",
        times: [
          { time: "07:00 am", available: 4 },
          { time: "09:00 am", available: 3 },
          { time: "11:00 am", available: 2 },
          { time: "01:00 pm", available: 1 },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    price: 899,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    category: "Nature",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "05:00 am", available: 8 },
          { time: "05:30 am", available: 6 },
        ],
      },
      {
        date: "Oct 23",
        times: [
          { time: "05:00 am", available: 7 },
          { time: "05:30 am", available: 5 },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Coffee Trail",
    location: "Coorg",
    price: 1299,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    category: "Nature",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "08:00 am", available: 10 },
          { time: "10:00 am", available: 8 },
          { time: "02:00 pm", available: 6 },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Boat Cruise",
    location: "Sunderbans",
    price: 999,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    category: "Adventure",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "09:00 am", available: 12 },
          { time: "11:00 am", available: 10 },
          { time: "01:00 pm", available: 8 },
          { time: "03:00 pm", available: 6 },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Bunjee Jumping",
    location: "Manali",
    price: 999,
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    category: "Adventure",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "10:00 am", available: 4 },
          { time: "12:00 pm", available: 3 },
          { time: "02:00 pm", available: 2 },
          { time: "04:00 pm", available: 1 },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Kayaking",
    location: "Udupi, Karnataka",
    price: 999,
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    category: "Adventure",
    availableSlots: [
      {
        date: "Oct 22",
        times: [
          { time: "07:00 am", available: 6 },
          { time: "09:00 am", available: 4 },
          { time: "11:00 am", available: 3 },
        ],
      },
    ],
  },
];
