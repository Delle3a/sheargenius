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
export const usersWithPasswords: User[] = [
    { id: 'user-admin', name: 'Admin User', email: 'admin@test.com', role: 'admin', password: 'password' },
    { id: 'barber-1', name: 'Alex Johnson', email: 'coiffeur@test.com', role: 'barber', password: 'password' },
    { id: 'user-customer-1', name: 'Jean Dupont', email: 'client@test.com', role: 'customer', password: 'password' },
];

export const services: Omit<Service, 'id' | 'price' | 'duration'> & { name: string; price: number; duration: number }[] = [
  { name: 'Coupe Classique', price: 30, duration: 30 },
  { name: 'Taille de la barbe', price: 20, duration: 15 },
  { name: 'Rasage à la serviette chaude', price: 45, duration: 45 },
  { name: 'Le Grand Jeu', price: 65, duration: 60 },
];

export const barbers: Omit<Barber, 'id'>[] = [
  { name: 'Alex Johnson', specialty: 'Coupes Classiques', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { name: 'Maria Garcia', specialty: 'Styles Modernes', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { name: 'Sam Chen', specialty: 'Dégradés et Rasages', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { name: 'James "La Lame" Miller', specialty: 'Maître Barbier', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: false },
];

export const bookings: Omit<Booking, 'id'>[] = [
  {
    userId: 'user-customer-1',
    serviceId: 'service-1',
    barberId: 'barber-2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    status: 'upcoming',
  },
  {
    userId: 'user-customer-1',
    serviceId: 'service-3',
    barberId: 'barber-1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    status: 'completed',
  },
];

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
