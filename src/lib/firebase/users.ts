import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import type { UserWithPassword } from '../data';
import { v4 as uuidv4 } from 'uuid';


const USERS_COLLECTION = 'users';

export async function getUsers(): Promise<UserWithPassword[]> {
  const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserWithPassword));
}

// Adds a new user. If an ID is provided, it uses that. Otherwise, it generates a new UUID.
export async function addUser(userData: Omit<UserWithPassword, 'id'> & { id?: string }): Promise<UserWithPassword> {
    const userId = userData.id || uuidv4();
    const { id, ...dataToSave } = userData; // remove temp id if it exists
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, dataToSave);
    return { id: userId, ...dataToSave };
}

export async function updateUser(userId: string, updates: Partial<UserWithPassword>): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, updates);
}

    