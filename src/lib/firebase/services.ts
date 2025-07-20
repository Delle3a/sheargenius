import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { Service } from '../data';

const SERVICES_COLLECTION = 'services';

// Type for new service data (without id)
type NewServiceData = Omit<Service, 'id'>;

export async function getServices(): Promise<Service[]> {
  const querySnapshot = await getDocs(collection(db, SERVICES_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
}

export async function addService(serviceData: NewServiceData): Promise<Service> {
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), serviceData);
  return { id: docRef.id, ...serviceData };
}

export async function updateService(serviceId: string, updates: Partial<NewServiceData>): Promise<void> {
  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
  await updateDoc(serviceRef, updates);
}

export async function deleteService(serviceId: string): Promise<void> {
  await deleteDoc(doc(db, SERVICES_COLLECTION, serviceId));
}

    