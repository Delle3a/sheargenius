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

export const services: Service[] = [
  { id: 'service-1', name: 'Coupe Classique', price: 30, duration: 30 },
  { id: 'service-2', name: 'Taille de la barbe', price: 20, duration: 15 },
  { id: 'service-3', name: 'Rasage à la serviette chaude', price: 45, duration: 45 },
  { id: 'service-4', name: 'Le Grand Jeu', price: 65, duration: 60 },
];

export const barbers: Barber[] = [
  { id: 'barber-1', name: 'Alex Johnson', specialty: 'Coupes Classiques', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: 'barber-2', name: 'Maria Garcia', specialty: 'Styles Modernes', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: 'barber-3', name: 'Sam Chen', specialty: 'Dégradés et Rasages', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: 'barber-4', name: 'James "La Lame" Miller', specialty: 'Maître Barbier', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
];

export const users: User[] = [
  { id: 'user-customer', name: 'Jean Dupont', email: 'client@test.com', role: 'customer' },
  { id: 'user-admin', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  // The barber user now has a matching ID in the barbers array
  { id: 'barber-3', name: 'Sam Chen', email: 'coiffeur@test.com', role: 'barber'},
];

export const bookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-customer', // Corrected User ID
    serviceId: 'service-1',
    barberId: 'barber-2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    status: 'upcoming',
  },
  {
    id: 'booking-2',
    userId: 'user-customer', // Corrected User ID
    serviceId: 'service-3',
    barberId: 'barber-1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    status: 'completed',
  },
];