import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Category, Order, Review, User } from '../types/wine';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../data/mockData';

export const PRODUCTS_TABLE = 'products';
export const CATEGORIES_TABLE = 'categories';
export const ORDERS_TABLE = 'orders';
export const REVIEWS_TABLE = 'reviews';
export const USERS_TABLE = 'users';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleDatabaseError(error: unknown, operation: OperationType, table: string) {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  console.warn(`[Supabase DB Note] Failed ${operation} on table '${table}':`, message);
}

// Backwards-compatible alias for any residual Firestore error handlers
export const handleFirestoreError = handleDatabaseError;

/**
 * Seed initial sample catalog data into Supabase if tables are empty.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  if (!isSupabaseConfigured) {
    console.info('[Supabase] Running in local demo mode. Initial data loaded from local storage & memory.');
    return;
  }

  try {
    // 1. Check & Seed Products
    const { data: existingProducts, error: prodErr } = await supabase
      .from(PRODUCTS_TABLE)
      .select('product_id')
      .limit(1);

    if (!prodErr && (!existingProducts || existingProducts.length === 0)) {
      console.log('Seeding initial VÍNEA catalog to Supabase...');
      await supabase.from(PRODUCTS_TABLE).upsert(INITIAL_PRODUCTS, { onConflict: 'product_id' });
    }

    // 2. Check & Seed Categories
    const { data: existingCats, error: catErr } = await supabase
      .from(CATEGORIES_TABLE)
      .select('category_id')
      .limit(1);

    if (!catErr && (!existingCats || existingCats.length === 0)) {
      await supabase.from(CATEGORIES_TABLE).upsert(INITIAL_CATEGORIES, { onConflict: 'category_id' });
    }

    // 3. Check & Seed Orders
    const { data: existingOrders, error: ordErr } = await supabase
      .from(ORDERS_TABLE)
      .select('order_id')
      .limit(1);

    if (!ordErr && (!existingOrders || existingOrders.length === 0)) {
      await supabase.from(ORDERS_TABLE).upsert(INITIAL_ORDERS, { onConflict: 'order_id' });
    }

    // 4. Check & Seed Reviews
    const { data: existingReviews, error: revErr } = await supabase
      .from(REVIEWS_TABLE)
      .select('review_id')
      .limit(1);

    if (!revErr && (!existingReviews || existingReviews.length === 0)) {
      await supabase.from(REVIEWS_TABLE).upsert(INITIAL_REVIEWS, { onConflict: 'review_id' });
    }

    // 5. Check & Seed Users
    const { data: existingUsers, error: usrErr } = await supabase
      .from(USERS_TABLE)
      .select('user_id')
      .limit(1);

    if (!usrErr && (!existingUsers || existingUsers.length === 0)) {
      await supabase.from(USERS_TABLE).upsert(INITIAL_REGISTERED_USERS, { onConflict: 'user_id' });
    }
  } catch (error) {
    console.warn('[Supabase Seeding Note]:', error);
  }
}

/**
 * Fetch all products from Supabase
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data as Product[]) || null;
  } catch (err) {
    handleDatabaseError(err, OperationType.LIST, PRODUCTS_TABLE);
    return null;
  }
}

/**
 * Real-time subscription to Products with PostgreSQL changes
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  // If not configured with live credentials, return no-op cleanup
  if (!isSupabaseConfigured) {
    return () => {};
  }

  // Initial fetch
  fetchProductsFromSupabase().then((items) => {
    if (items && items.length > 0) {
      onData(items);
    }
  }).catch((err) => {
    if (onError) onError(err);
  });

  // Subscribe to real-time postgres changes
  const channel = supabase
    .channel('public:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: PRODUCTS_TABLE },
      async () => {
        const refreshed = await fetchProductsFromSupabase();
        if (refreshed) onData(refreshed);
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && onError) {
        onError(new Error('Supabase channel subscription failed'));
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Fetch categories from Supabase
 */
export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .order('category_name', { ascending: true });

    if (error) throw error;
    return (data as Category[]) || null;
  } catch (err) {
    handleDatabaseError(err, OperationType.LIST, CATEGORIES_TABLE);
    return null;
  }
}

/**
 * Real-time subscription to Categories
 */
export function subscribeToCategories(
  onData: (categories: Category[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSupabaseConfigured) return () => {};

  fetchCategoriesFromSupabase().then((cats) => {
    if (cats && cats.length > 0) onData(cats);
  }).catch(onError);

  const channel = supabase
    .channel('public:categories')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: CATEGORIES_TABLE },
      async () => {
        const refreshed = await fetchCategoriesFromSupabase();
        if (refreshed) onData(refreshed);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Fetch orders from Supabase
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .order('order_date', { ascending: false });

    if (error) throw error;
    return (data as Order[]) || null;
  } catch (err) {
    handleDatabaseError(err, OperationType.LIST, ORDERS_TABLE);
    return null;
  }
}

/**
 * Real-time subscription to Orders
 */
export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSupabaseConfigured) return () => {};

  fetchOrdersFromSupabase().then((ords) => {
    if (ords && ords.length > 0) onData(ords);
  }).catch(onError);

  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: ORDERS_TABLE },
      async () => {
        const refreshed = await fetchOrdersFromSupabase();
        if (refreshed) onData(refreshed);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Save Order to Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(ORDERS_TABLE)
      .upsert(order, { onConflict: 'order_id' });

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, ORDERS_TABLE);
  }
}

/**
 * Update Order Status in Supabase
 */
export async function updateOrderStatusInSupabase(orderId: string, status: Order['status']): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(ORDERS_TABLE)
      .update({ status })
      .eq('order_id', orderId);

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.UPDATE, ORDERS_TABLE);
  }
}

/**
 * Save or Update Product in Supabase
 */
export async function saveProductToSupabase(product: Product): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .upsert(product, { onConflict: 'product_id' });

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, PRODUCTS_TABLE);
  }
}

/**
 * Update Product Stock in Supabase
 */
export async function updateProductStockInSupabase(productId: string, stock: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .update({ stock })
      .eq('product_id', productId);

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.UPDATE, PRODUCTS_TABLE);
  }
}

/**
 * Delete Product in Supabase
 */
export async function deleteProductFromSupabase(productId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('product_id', productId);

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.DELETE, PRODUCTS_TABLE);
  }
}

/**
 * Save or Update User Profile in Supabase
 */
export async function saveUserToSupabase(user: User): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(USERS_TABLE)
      .upsert(user, { onConflict: 'user_id' });

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, USERS_TABLE);
  }
}

/**
 * Save Review to Supabase
 */
export async function saveReviewToSupabase(review: Review): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from(REVIEWS_TABLE)
      .upsert(review, { onConflict: 'review_id' });

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, REVIEWS_TABLE);
  }
}

/**
 * Supabase Customer Authentication methods
 */
export async function supabaseSignUp(email: string, password: string, metadata?: Record<string, unknown>) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {},
    },
  });
}

export async function supabaseSignIn(email: string, password: string) {
  if (!isSupabaseConfigured) return { data: null, error: null };
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function supabaseSignOut() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getSupabaseCurrentUser() {
  if (!isSupabaseConfigured) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// --------------------------------------------------------------------------
// BACKWARDS-COMPATIBILITY ALIASES
// (Allows any existing components or references to migrate seamlessly)
// --------------------------------------------------------------------------
export const saveOrderToFirestore = saveOrderToSupabase;
export const updateOrderStatusInFirestore = updateOrderStatusInSupabase;
export const saveProductToFirestore = saveProductToSupabase;
export const updateProductStockInFirestore = updateProductStockInSupabase;
export const deleteProductFromFirestore = deleteProductFromSupabase;
export const saveUserToFirestore = saveUserToSupabase;
export const saveReviewToFirestore = saveReviewToSupabase;
