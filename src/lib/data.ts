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
  { id: '1', name: 'Classic Haircut', price: 30, duration: 30 },
  { id: '2', name: 'Beard Trim', price: 20, duration: 15 },
  { id: '3', name: 'Hot Towel Shave', price: 45, duration: 45 },
  { id: '4', name: 'The Full Works', price: 65, duration: 60 },
];

export const barbers: Barber[] = [
  { id: '1', name: 'Alex Johnson', specialty: 'Classic Cuts', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: '2', name: 'Maria Garcia', specialty: 'Modern Styles', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
  { id: '3', name: 'Sam Chen', specialty: 'Fades & Shaves', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: false },
  { id: '4', name: 'James "Blade" Miller', specialty: 'Beard Master', avatarUrl: 'https://placehold.co/100x100.png', isAvailable: true },
];

export const users: User[] = [
  { id: '1', name: 'John Doe', email: 'customer@test.com', role: 'customer' },
  { id: '2', name: 'Admin', email: 'admin@test.com', role: 'admin' },
  { id: '3', name: 'Sam Chen', email: 'barber@test.com', role: 'barber'}, // This user is also a barber
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

export const availableTimeSlots: { [key: string]: string[] } = {
  '0': [], // Sunday
  '1': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Monday
  '2': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Tuesday
  '3': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Wednesday
  '4': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Thursday
  '5': ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'], // Friday
  '6': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'], // Saturday
};
