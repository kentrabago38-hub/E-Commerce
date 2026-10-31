import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../src/data/mockData';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  console.log('Seeding VÍNEA data to Firestore database:', firebaseConfig.firestoreDatabaseId);

  // 1. Seed Products
  for (const prod of INITIAL_PRODUCTS) {
    await setDoc(doc(db, 'products', prod.product_id), prod);
    console.log(`✓ Product: ${prod.name}`);
  }

  // 2. Seed Categories
  for (const cat of INITIAL_CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.category_id), cat);
    console.log(`✓ Category: ${cat.category_name}`);
  }

  // 3. Seed Orders
  for (const ord of INITIAL_ORDERS) {
    await setDoc(doc(db, 'orders', ord.order_id), ord);
    console.log(`✓ Order: ${ord.order_id}`);
  }

  // 4. Seed Reviews
  for (const rev of INITIAL_REVIEWS) {
    await setDoc(doc(db, 'reviews', rev.review_id), rev);
    console.log(`✓ Review: ${rev.review_id}`);
  }

  // 5. Seed Users
  for (const usr of INITIAL_REGISTERED_USERS) {
    await setDoc(doc(db, 'users', usr.user_id), usr);
    console.log(`✓ User: ${usr.name}`);
  }

  console.log('Seeding complete! All collections populated.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
