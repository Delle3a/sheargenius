
"use server";

import { db } from './config';
import { collection, getDocs, doc, DocumentData, addDoc, updateDoc } from 'firebase/firestore';
import type { User } from '@/context/auth-context';

const toUser = (doc: DocumentData): User => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        isVerified: data.isVerified,
        password: data.password, // For demo purposes
    };
};

export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => toUser(doc));
    return userList;
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const usersCol = collection(db, 'users');
    const docRef = await addDoc(usersCol, user);
    return { id: docRef.id, ...user };
}

export async function updateUser(id: string, userData: Partial<Omit<User, 'id' | 'password'>>): Promise<void> {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, userData);
}
