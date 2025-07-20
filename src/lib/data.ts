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
  time: string; // HH:MM
  status: 'upcoming' | 'completed' | 'cancelled';
}

// For AuthContext and client-side use (without password)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'barber';
  isVerified: boolean;
  verificationToken?: string;
}

// For seeding script (with password)
export interface UserWithPassword extends User {
  password?: string;
}

export const usersWithPasswords: UserWithPassword[] = [
  {
    id: "admin-user",
    name: "Admin",
    email: "admin@test.com",
    password: "password",
    role: "admin",
    isVerified: true
  },
];


export const barbers: Barber[] = [
  {
    id: "barber-1",
    name: "Alexandre Dubois",
    specialty: "Coupes classiques",
    avatarUrl: "https://placehold.co/100x100.png",
    isAvailable: true,
  }
];

export const services: Service[] = [];
export const bookings: Booking[] = [];

// Sunday = 0, Monday = 1, etc.
// No slots for Sunday (0) or Monday (1)
export const availableTimeSlots: { [key: number]: string[] } = {
  2: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"], // Tuesday
  3: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"], // Wednesday
  4: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"], // Thursday
  5: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"], // Friday
  6: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"], // Saturday
};

    