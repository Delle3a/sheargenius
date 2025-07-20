import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import type { Booking } from '../data';

const BOOKINGS_COLLECTION = 'bookings';

// Type for new booking data (without id)
type NewBookingData = Omit<Booking, 'id'>;

export async function getBookings(): Promise<Booking[]> {
  const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
}

export async function addBooking(bookingData: NewBookingData): Promise<Booking> {
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);
  return { id: docRef.id, ...bookingData };
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
  const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
  await updateDoc(bookingRef, { status });
}

    