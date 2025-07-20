
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

// NOTE: In a real app, password handling would be done securely on a server.
// Add isVerified: true for all seed users so they can log in.
export const usersWithPasswords: Omit<User, 'password'>[] = [
    { id: 'user-admin', name: 'Admin User', email: 'admin@test.com', role: 'admin', isVerified: true },
];

export const users: (Omit<User, 'id'> & { id: string })[] = [
    { id: 'user-admin', name: 'Admin User', email: 'admin@test.com', role: 'admin', password: 'password', isVerified: true },
];

export const services: Service[] = [];

export const barbers: Barber[] = [
  { id: 'barber-1', name: 'Alex Johnson', specialty: 'Coupes Classiques', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
];

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
