import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Category, Order, Review, User } from '../types/wine';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../data/mockData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const REVIEWS_COLLECTION = 'reviews';
const USERS_COLLECTION = 'users';

// Seed initial data if collection is empty
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty) {
      console.log('Seeding initial VÍNEA catalog to Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.product_id), prod);
      }
    }

    const categoriesSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (categoriesSnap.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, CATEGORIES_COLLECTION, cat.category_id), cat);
      }
    }

    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      for (const ord of INITIAL_ORDERS) {
        await setDoc(doc(db, ORDERS_COLLECTION, ord.order_id), ord);
      }
    }

    const reviewsSnap = await getDocs(collection(db, REVIEWS_COLLECTION));
    if (reviewsSnap.empty) {
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, REVIEWS_COLLECTION, rev.review_id), rev);
      }
    }

    const usersSnap = await getDocs(collection(db, USERS_COLLECTION));
    if (usersSnap.empty) {
      for (const usr of INITIAL_REGISTERED_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, usr.user_id), usr);
      }
    }
  } catch (error) {
    console.warn('Initial seeding note (may be running in offline/cached mode):', error);
  }
}

// Subscribe to real-time products
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Product);
        onData(list);
      }
    },
    (error) => {
      console.warn('Products subscription note:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
      } catch {
        // Logged
      }
    }
  );
}

// Subscribe to real-time categories
export function subscribeToCategories(
  onData: (categories: Category[]) => void,
  onError?: (err: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, CATEGORIES_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Category);
        onData(list);
      }
    },
    (error) => {
      console.warn('Categories subscription note:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, CATEGORIES_COLLECTION);
      } catch {
        // Logged
      }
    }
  );
}

// Subscribe to real-time orders
export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: unknown) => void
): () => void {
  return onSnapshot(
    collection(db, ORDERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as Order);
        // Sort descending by order date or ID
        list.sort((a, b) => (b.order_date || '').localeCompare(a.order_date || ''));
        onData(list);
      }
    },
    (error) => {
      console.warn('Orders subscription note:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
      } catch {
        // Logged
      }
    }
  );
}

// Save Order to Firestore
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${order.order_id}`;
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.order_id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update Order Status in Firestore
export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Save or Update Product in Firestore
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.product_id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.product_id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update Product Stock in Firestore
export async function updateProductStockInFirestore(productId: string, stock: number): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), { stock });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Delete Product in Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Save or Update User Profile in Firestore
export async function saveUserToFirestore(user: User): Promise<void> {
  const path = `${USERS_COLLECTION}/${user.user_id}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, user.user_id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Review to Firestore
export async function saveReviewToFirestore(review: Review): Promise<void> {
  const path = `${REVIEWS_COLLECTION}/${review.review_id}`;
  try {
    await setDoc(doc(db, REVIEWS_COLLECTION, review.review_id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
