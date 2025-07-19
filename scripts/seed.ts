
// This script is used to seed the Firestore database with initial data.
// Usage: npm run db:seed

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { services as initialServices, barbers as initialBarbers, bookings as initialBookings, users as initialUsers } from '../src/lib/data';

// IMPORTANT: This script uses the same Firebase config as the app.
// Make sure your src/lib/firebase/config.ts is correctly configured.
// NOTE: This is a simplified script using the client-side SDK.
// For more robust, server-side seeding, you would typically use the Firebase Admin SDK.

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

async function seedCollection(collectionName: string, data: any[], idField: string = 'id') {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Collection "${collectionName}" already contains data. Skipping seeding.`);
        return;
    }

    const batch = writeBatch(db);
    data.forEach(item => {
        const docId = item[idField];
        const docRef = doc(db, collectionName, docId);
        // Create a new object without the id field
        const { [idField]: _, ...rest } = item;
        batch.set(docRef, rest);
    });

    await batch.commit();
    console.log(`${data.length} documents have been added to the "${collectionName}" collection.`);
}

async function main() {
  console.log('Starting database seed...');
  try {
    await seedCollection('services', initialServices, 'id');
    await seedCollection('barbers', initialBarbers, 'id');
    await seedCollection('users', initialUsers, 'id');
    await seedCollection('bookings', initialBookings, 'id');

    console.log('Database seeding completed successfully!');
    // The script will hang open due to the active Firestore connection.
    // We explicitly exit the process.
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();
