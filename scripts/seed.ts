
// This script is used to seed the Firestore database with initial data.
// Usage: npm run db:seed

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { services as initialServices, barbers as initialBarbers, bookings as initialBookings } from '../src/lib/data';

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

async function seedServices() {
  const servicesCollection = collection(db, 'services');
  const snapshot = await getDocs(servicesCollection);
  if (!snapshot.empty) {
    console.log('Services collection already contains data. Skipping seeding.');
    return;
  }

  const batch = writeBatch(db);
  initialServices.forEach(service => {
    // Use the hardcoded ID from the data file to maintain relationships
    const docRef = doc(db, 'services', service.id);
    batch.set(docRef, service);
  });

  await batch.commit();
  console.log(`${initialServices.length} services have been added to the database.`);
}

async function seedBarbers() {
  const barbersCollection = collection(db, 'barbers');
  const snapshot = await getDocs(barbersCollection);
  if (!snapshot.empty) {
    console.log('Barbers collection already contains data. Skipping seeding.');
    return;
  }

  const batch = writeBatch(db);
  initialBarbers.forEach(barber => {
     // Use the hardcoded ID from the data file to maintain relationships
    const docRef = doc(db, 'barbers', barber.id);
    batch.set(docRef, barber);
  });

  await batch.commit();
  console.log(`${initialBarbers.length} barbers have been added to the database.`);
}

async function seedBookings() {
  const bookingsCollection = collection(db, 'bookings');
  const snapshot = await getDocs(bookingsCollection);
  if (!snapshot.empty) {
    console.log('Bookings collection already contains data. Skipping seeding.');
    return;
  }

  const batch = writeBatch(db);
  initialBookings.forEach(booking => {
     // Use the hardcoded ID from the data file to maintain relationships
    const docRef = doc(db, 'bookings', booking.id);
    batch.set(docRef, booking);
  });

  await batch.commit();
  console.log(`${initialBookings.length} bookings have been added to the database.`);
}

async function main() {
  console.log('Starting database seed...');
  try {
    await seedServices();
    await seedBarbers();
    await seedBookings();
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
