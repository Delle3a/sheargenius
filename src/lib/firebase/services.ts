"use server";

import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import type { Service } from '@/lib/data';

// Helper function to convert Firestore doc to Service object
const toService = (doc: DocumentData): Service => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        price: data.price,
        duration: data.duration
    };
};

export async function getServices(): Promise<Service[]> {
    const servicesCol = collection(db, 'services');
    const serviceSnapshot = await getDocs(servicesCol);
    const serviceList = serviceSnapshot.docs.map(doc => toService(doc));
    return serviceList;
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
    const servicesCol = collection(db, 'services');
    const docRef = await addDoc(servicesCol, service);
    return { id: docRef.id, ...service };
}

export async function updateService(id: string, service: Partial<Omit<Service, 'id'>>): Promise<void> {
    const serviceDoc = doc(db, 'services', id);
    await updateDoc(serviceDoc, service);
}

export async function deleteService(id: string): Promise<void> {
    const serviceDoc = doc(db, 'services', id);
    await deleteDoc(serviceDoc);
}
