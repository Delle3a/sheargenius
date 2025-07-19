
"use server";

import { db } from './config';
import { collection, getDocs, doc, DocumentData } from 'firebase/firestore';
import type { User } from '@/context/auth-context';

const toUser = (doc: DocumentData): User => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password, // For demo purposes
    };
};

export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => toUser(doc));
    return userList;
}
