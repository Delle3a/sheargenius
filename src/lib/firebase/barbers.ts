import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { Barber } from '../data';

const BARBERS_COLLECTION = 'barbers';

// Type for new barber data (without id)
type NewBarberData = Omit<Barber, 'id'>;

export async function getBarbers(): Promise<Barber[]> {
  const querySnapshot = await getDocs(collection(db, BARBERS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
}

export async function addBarber(barberData: NewBarberData): Promise<Barber> {
  const docRef = await addDoc(collection(db, BARBERS_COLLECTION), barberData);
  return { id: docRef.id, ...barberData };
}

export async function updateBarber(barberId: string, updates: Partial<NewBarberData>): Promise<void> {
  const barberRef = doc(db, BARBERS_COLLECTION, barberId);
  await updateDoc(barberRef, updates);
}

export async function deleteBarber(barberId: string): Promise<void> {
  await deleteDoc(doc(db, BARBERS_COLLECTION, barberId));
}

    