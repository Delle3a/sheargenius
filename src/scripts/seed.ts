// This script is used to seed the Firestore database with initial data.
// Usage: npm run db:seed

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { services as initialServices, barbers as initialBarbers, bookings as initialBookings, users as initialUsers } from '../lib/data';

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

async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Collection "${collectionName}" is already empty. Skipping clearing.`);
        return;
    }
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Collection "${collectionName}" has been cleared.`);
}


async function seedCollection(collectionName: string, data: any[]) {
    const collectionRef = collection(db, collectionName);
    
    // Check if the collection should be seeded even if it has data.
    // For users and barbers, we'll overwrite with our seed data for consistency.
    // For services and bookings, if the seed data is empty, we respect that.
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty && data.length > 0) {
        console.log(`Collection "${collectionName}" already contains data. Overwriting with new seed data.`);
        // To be safe, we clear it first.
        await clearCollection(collectionName);
    } else if (!snapshot.empty && data.length === 0) {
        console.log(`Collection "${collectionName}" contains data, but seed data is empty. Clearing collection.`);
        await clearCollection(collectionName);
        return; // Nothing more to do
    }


    if (data.length === 0) {
        console.log(`Seed data for "${collectionName}" is empty. Skipping seeding.`);
        return;
    }

    const batch = writeBatch(db);
    data.forEach(item => {
        const { id, ...rest } = item;
        const docRef = doc(db, collectionName, id);
        batch.set(docRef, rest);
    });

    await batch.commit();
    console.log(`${data.length} documents have been added to the "${collectionName}" collection.`);
}

async function main() {
  console.log('Starting database seed...');
  try {
    // Clear all collections first to ensure a clean slate
    await clearCollection('services');
    await clearCollection('barbers');
    await clearCollection('users');
    await clearCollection('bookings');
    
    // Now seed with the new (mostly empty) data
    await seedCollection('services', initialServices);
    await seedCollection('barbers', initialBarbers);
    await seedCollection('users', initialUsers);
    await seedCollection('bookings', initialBookings);

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
