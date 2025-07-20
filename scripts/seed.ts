// This script is used to seed the Firestore database with initial data.
// Usage: npm run db:seed

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { usersWithPasswords, barbers, services, bookings } from '../src/lib/data';

// IMPORTANT: This script uses the same Firebase config as the app.
// Make sure your src/lib/firebase/config.ts is correctly configured.

const firebaseConfig = {
  apiKey: "AIzaSyDxjH-4J2qZ_ePnYs1CIWOJZ0we6FODM0k",
  authDomain: "shear-geniu.firebaseapp.com",
  projectId: "shear-geniu",
  storageBucket: "shear-geniu.firebasestorage.app",
  messagingSenderId: "215757153302",
  appId: "1:215757153302:web:0516d63981d2d471cdc137"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This function will delete all documents in a collection.
async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Collection "${collectionName}" is already empty.`);
        return;
    }
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared ${snapshot.size} documents from "${collectionName}".`);
}


async function seedCollection(collectionName: string, data: any[]) {
    if (!data || data.length === 0) {
        console.log(`No data provided for "${collectionName}". Skipping seeding.`);
        return;
    }

    const collectionRef = collection(db, collectionName);
    const batch = writeBatch(db);
    data.forEach(item => {
        const docId = item.id;
        if (!docId) {
            console.warn(`Skipping item in ${collectionName} due to missing id:`, item);
            return;
        }
        const docRef = doc(db, collectionName, docId);
        // Create a new object without the id field to prevent storing it in the document
        const { id, ...rest } = item;
        batch.set(docRef, rest);
    });

    await batch.commit();
    console.log(`${data.length} documents have been added to the "${collectionName}" collection.`);
}

async function main() {
  console.log('Starting database seed...');
  try {
    // Clear all existing data first to ensure a clean slate
    await clearCollection('users');
    await clearCollection('barbers');
    await clearCollection('services');
    await clearCollection('bookings');

    console.log('\nSeeding new data...');
    // Now seed the new, clean data
    await seedCollection('users', usersWithPasswords);
    await seedCollection('barbers', barbers);
    await seedCollection('services', services);
    await seedCollection('bookings', bookings);

    console.log('\nDatabase seeding completed successfully!');
    // The script will hang open due to the active Firestore connection.
    // We explicitly exit the process.
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();

    