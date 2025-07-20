
import type { User } from '@/context/auth-context';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'upcoming' | 'completed' | 'cancelled';
}

// This array is used by the seed script to populate the database.
// The password is included here for demo purposes so the initial login works.
// In a real-world app, this would be handled much more securely.
export const users: (Omit<User, 'id'> & { id: string })[] = [
    { id: 'user-admin', name: 'Admin User', email: 'admin@test.com', password: 'password', role: 'admin', isVerified: true },
];

// This is an empty array for services, as requested.
export const services: Service[] = [];

// This provides one sample barber, as requested.
export const barbers: Barber[] = [
  { id: 'barber-1', name: 'Alex Johnson', specialty: 'Coupes Classiques', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
];

// This is an empty array for bookings, as requested.
export const bookings: Booking[] = [];

// 0: Sunday, 1: Monday, etc.
export const availableTimeSlots: { [key: number]: string[] } = {
  1: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  2: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  3: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  4: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  5: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
  6: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "14:00"],
  0: [], // Sunday
};
