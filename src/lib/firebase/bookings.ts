
"use server";

import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, doc, DocumentData } from 'firebase/firestore';
import type { Booking } from '@/lib/data';

const toBooking = (doc: DocumentData): Booking => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        serviceId: data.serviceId,
        barberId: data.barberId,
        date: data.date,
        time: data.time,
        status: data.status,
    };
};

export async function getBookings(): Promise<Booking[]> {
    const bookingsCol = collection(db, 'bookings');
    const bookingSnapshot = await getDocs(bookingsCol);
    const bookingList = bookingSnapshot.docs.map(doc => toBooking(doc));
    // Sort by date descending by default
    return bookingList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const bookingsCol = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCol, booking);
    return { id: docRef.id, ...booking };
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const bookingDoc = doc(db, 'bookings', id);
    await updateDoc(bookingDoc, { status });
}
