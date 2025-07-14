
"use server";

import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import type { Barber } from '@/lib/data';

const toBarber = (doc: DocumentData): Barber => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        specialty: data.specialty,
        avatarUrl: data.avatarUrl,
        isAvailable: data.isAvailable
    };
};

export async function getBarbers(): Promise<Barber[]> {
    const barbersCol = collection(db, 'barbers');
    const barberSnapshot = await getDocs(barbersCol);
    const barberList = barberSnapshot.docs.map(doc => toBarber(doc));
    return barberList;
}

export async function addBarber(barber: Omit<Barber, 'id'>): Promise<Barber> {
    const barbersCol = collection(db, 'barbers');
    const docRef = await addDoc(barbersCol, barber);
    return { id: docRef.id, ...barber };
}

export async function updateBarber(id: string, barber: Partial<Omit<Barber, 'id'>>): Promise<void> {
    const barberDoc = doc(db, 'barbers', id);
    await updateDoc(barberDoc, barber);
}

export async function deleteBarber(id: string): Promise<void> {
    const barberDoc = doc(db, 'barbers', id);
    await deleteDoc(barberDoc);
}
