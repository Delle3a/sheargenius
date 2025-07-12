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
  date: string; // ISO string
  time: string; // HH:mm
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const services: Service[] = [
  { id: '1', name: 'Coupe Classique', price: 30, duration: 30 },
  { id: '2', name: 'Taille de la barbe', price: 20, duration: 15 },
  { id: '3', name: 'Rasage à la serviette chaude', price: 45, duration: 45 },
  { id: '4', name: 'Le Grand Jeu', price: 65, duration: 60 },
];

export const barbers: Barber[] = [
  { id: '1', name: 'Alex Johnson', specialty: 'Coupes Classiques', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: '2', name: 'Maria Garcia', specialty: 'Styles Modernes', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: '3', name: 'Sam Chen', specialty: 'Dégradés et Rasages', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: false },
  { id: '4', name: 'James "La Lame" Miller', specialty: 'Maître Barbier', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
];

export const users: User[] = [
  { id: '1', name: 'Jean Dupont', email: 'client@test.com', role: 'customer' },
  { id: '2', name: 'Admin', email: 'admin@test.com', role: 'admin' },
  { id: '3', name: 'Sam Chen', email: 'coiffeur@test.com', role: 'barber'}, // This user is also a barber
];

export let bookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    serviceId: '1',
    barberId: '2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    status: 'upcoming',
  },
  {
    id: '2',
    userId: '1',
    serviceId: '3',
    barberId: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    status: 'completed',
  },
    {
    id: '3',
    userId: '1', // A customer booked this
    serviceId: '2',
    barberId: '3', // But it's for barber Sam Chen
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00',
    status: 'upcoming',
  },
   {
    id: '4',
    userId: '1', 
    serviceId: '4',
    barberId: '3', // Another one for Sam Chen
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '15:00',
    status: 'upcoming',
  },
];

export const availableTimeSlots: { [key: number]: string[] } = {
  0: [], // Dimanche
  1: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Lundi
  2: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Mardi
  3: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Mercredi
  4: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Jeudi
  5: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'], // Vendredi
  6: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'], // Samedi
};
