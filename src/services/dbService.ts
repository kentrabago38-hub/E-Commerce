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
export const NEWSLETTER_TABLE = 'newsletter_subscribers';
export const INQUIRIES_TABLE = 'sommelier_inquiries';
export const WISHLISTS_TABLE = 'wishlists';
export const BRANCHES_TABLE = 'branches';

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
 * Format order payload to support all PostgreSQL column schemas seamlessly.
 * Populates both `shipping` & `shipping_fee`, `total` & `total_amount`.
 */
export function formatOrderForSupabase(order: Order): Record<string, unknown> {
  const totalVal = order.total_amount ?? (order as unknown as { total?: number }).total ?? 0;
  const shippingVal = order.shipping ?? (order as unknown as { shipping_fee?: number }).shipping_fee ?? 0;

  return {
    order_id: order.order_id,
    user_id: order.user_id,
    customer_name: order.customer_name,
    email: order.email,
    phone: order.phone,
    delivery_address: order.delivery_address,
    items: order.items,
    subtotal: order.subtotal,
    shipping: shippingVal,
    shipping_fee: shippingVal,
    discount: order.discount ?? 0,
    discount_code: order.discount_code || null,
    total: totalVal,
    total_amount: totalVal,
    status: order.status,
    payment_method: order.payment_method,
    order_date: order.order_date,
    tracking_number: order.tracking_number,
    estimated_delivery: order.estimated_delivery
  };
}

/**
 * Fallback column subset for minimal/legacy `orders` table schemas.
 */
export function formatLegacyOrderForSupabase(order: Order): Record<string, unknown> {
  const totalVal = order.total_amount ?? (order as unknown as { total?: number }).total ?? 0;
  const shippingVal = order.shipping ?? (order as unknown as { shipping_fee?: number }).shipping_fee ?? 0;

  return {
    order_id: order.order_id,
    user_id: order.user_id,
    customer_name: order.customer_name,
    email: order.email,
    phone: order.phone,
    delivery_address: order.delivery_address,
    items: order.items,
    subtotal: order.subtotal,
    shipping_fee: shippingVal,
    total: totalVal,
    status: order.status,
    payment_method: order.payment_method,
    order_date: order.order_date,
    tracking_number: order.tracking_number
  };
}

/**
 * Normalizes rows read from Supabase back into standard typescript Order objects.
 */
export function normalizeOrderFromSupabase(row: Record<string, unknown>): Order {
  return {
    order_id: String(row.order_id || ''),
    user_id: String(row.user_id || ''),
    customer_name: String(row.customer_name || 'Customer'),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    order_date: String(row.order_date || new Date().toISOString().split('T')[0]),
    subtotal: Number(row.subtotal || 0),
    shipping: Number(row.shipping ?? row.shipping_fee ?? 0),
    discount: Number(row.discount || 0),
    discount_code: typeof row.discount_code === 'string' ? row.discount_code : undefined,
    total_amount: Number(row.total_amount ?? row.total ?? 0),
    payment_method: (row.payment_method as Order['payment_method']) || 'Credit/Debit Card',
    delivery_address: (row.delivery_address as Order['delivery_address']) || {
      street: '',
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000',
      country: 'Philippines'
    },
    status: (row.status as Order['status']) || 'Processing',
    items: Array.isArray(row.items) ? (row.items as Order['items']) : [],
    estimated_delivery: String(row.estimated_delivery || ''),
    tracking_number: row.tracking_number ? String(row.tracking_number) : undefined
  };
}

/**
 * Format user payload for Supabase users table with all optional columns
 */
export function formatUserForSupabase(user: User): Record<string, unknown> {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email.toLowerCase().trim(),
    phone: user.phone || null,
    password: user.password || null,
    role: user.role || 'customer',
    avatar: user.avatar || null,
    membership_tier: user.membership_tier || 'Connoisseur',
    member_since: user.member_since || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    date_of_birth: user.date_of_birth || null,
    favorite_davao_branch: user.favorite_davao_branch || null,
    preferred_wine_types: user.preferred_wine_types || ['Red'],
    flavor_preference: user.flavor_preference || null,
    delivery_instructions: user.delivery_instructions || null,
    saved_addresses: user.saved_addresses || [],
    loyalty_points: user.loyalty_points ?? 0,
    lifetime_points: user.lifetime_points ?? 0,
    redeemed_perks: user.redeemed_perks || [],
    rewards_history: user.rewards_history || [],
    bio: user.bio || null
  };
}

/**
 * Fallback minimal user payload with core columns only
 */
export function formatCoreUserForSupabase(user: User): Record<string, unknown> {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email.toLowerCase().trim(),
    phone: user.phone || null,
    password: user.password || null,
    role: user.role || 'customer'
  };
}

/**
 * Format product object to ensure required fields for Supabase table
 */
export function formatProductForSupabase(product: Product): Record<string, unknown> {
  return {
    ...product,
    category: product.category_id || product.wine_type || 'Red'
  };
}

export interface CatalogSyncResult {
  success: boolean;
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  usersCount: number;
  error?: string;
}

/**
 * Uploads/syncs all 12 wines, 6 categories, customer profiles, reviews, and sample orders to Supabase.
 */
export async function syncAllCatalogToSupabase(): Promise<CatalogSyncResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      productsCount: 0,
      categoriesCount: 0,
      ordersCount: 0,
      usersCount: 0,
      error: 'Supabase credentials not configured. Please save your Project URL and Anon Key first.'
    };
  }

  try {
    // 1. Categories
    const { error: catErr } = await supabase
      .from(CATEGORIES_TABLE)
      .upsert(INITIAL_CATEGORIES, { onConflict: 'category_id' });
    if (catErr) {
      console.warn('[Supabase Seeding] Categories notice:', catErr.message);
    }

    // 2. Products
    const formattedProducts = INITIAL_PRODUCTS.map(formatProductForSupabase);
    const { error: prodErr } = await supabase
      .from(PRODUCTS_TABLE)
      .upsert(formattedProducts, { onConflict: 'product_id' });
    if (prodErr) {
      throw new Error(`Products table error: ${prodErr.message}`);
    }

    // 3. Registered Users
    const { error: userErr } = await supabase
      .from(USERS_TABLE)
      .upsert(INITIAL_REGISTERED_USERS, { onConflict: 'user_id' });
    if (userErr) {
      console.warn('[Supabase Seeding] Users notice:', userErr.message);
    }

    // 4. Initial Orders
    const formattedOrders = INITIAL_ORDERS.map(formatOrderForSupabase);
    const { error: orderErr } = await supabase
      .from(ORDERS_TABLE)
      .upsert(formattedOrders, { onConflict: 'order_id' });
    if (orderErr) {
      try {
        const legacyOrders = INITIAL_ORDERS.map(formatLegacyOrderForSupabase);
        await supabase.from(ORDERS_TABLE).upsert(legacyOrders, { onConflict: 'order_id' });
      } catch {
        // Ignore fallback failure
      }
    }

    // 5. Initial Reviews
    const { error: revErr } = await supabase
      .from(REVIEWS_TABLE)
      .upsert(INITIAL_REVIEWS, { onConflict: 'review_id' });
    if (revErr) {
      console.warn('[Supabase Seeding] Reviews notice:', revErr.message);
    }

    console.log(`[Supabase] Successfully seeded ${INITIAL_PRODUCTS.length} products and ${INITIAL_CATEGORIES.length} categories.`);
    return {
      success: true,
      productsCount: INITIAL_PRODUCTS.length,
      categoriesCount: INITIAL_CATEGORIES.length,
      ordersCount: INITIAL_ORDERS.length,
      usersCount: INITIAL_REGISTERED_USERS.length
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[Supabase Seeding Error]:', msg);
    return {
      success: false,
      productsCount: 0,
      categoriesCount: 0,
      ordersCount: 0,
      usersCount: 0,
      error: msg
    };
  }
}

/**
 * Seed initial sample catalog data into Supabase if tables are empty.
 */
export async function seedInitialDataIfEmpty(): Promise<CatalogSyncResult | null> {
  if (!isSupabaseConfigured) {
    console.info('[Supabase] Running in local demo mode. Initial data loaded from local storage & memory.');
    return null;
  }

  try {
    const { data: existingProducts, error: prodErr } = await supabase
      .from(PRODUCTS_TABLE)
      .select('product_id')
      .limit(1);

    if (!prodErr && (!existingProducts || existingProducts.length === 0)) {
      console.log('Database tables detected empty in Supabase. Auto-seeding initial VÍNEA catalog...');
      return await syncAllCatalogToSupabase();
    }
    return null;
  } catch (error) {
    console.warn('[Supabase Seeding Note]:', error);
    return null;
  }
}

/**
 * Normalizes raw product rows from Supabase into typed Product objects
 */
export function normalizeProductFromSupabase(raw: Record<string, unknown>): Product {
  let tastingNotes: Product['tasting_notes'] = {
    aroma: ['Blackberry', 'Cassis', 'French Oak'],
    palate: 'Silky, structured tannins with dark fruits and noble oak.',
    finish: 'Persistent, elegant finish.'
  };

  if (raw.tasting_notes) {
    if (typeof raw.tasting_notes === 'string') {
      try {
        const parsed = JSON.parse(raw.tasting_notes as string);
        if (parsed && typeof parsed === 'object') {
          tastingNotes = {
            aroma: Array.isArray(parsed.aroma)
              ? parsed.aroma
              : typeof parsed.aroma === 'string'
              ? (parsed.aroma as string).split(',').map((s: string) => s.trim())
              : tastingNotes.aroma,
            palate: String(parsed.palate || tastingNotes.palate),
            finish: String(parsed.finish || tastingNotes.finish)
          };
        }
      } catch {
        tastingNotes.palate = String(raw.tasting_notes);
      }
    } else if (typeof raw.tasting_notes === 'object' && raw.tasting_notes !== null) {
      const tn = raw.tasting_notes as Record<string, unknown>;
      tastingNotes = {
        aroma: Array.isArray(tn.aroma)
          ? (tn.aroma as string[])
          : typeof tn.aroma === 'string'
          ? (tn.aroma as string).split(',').map((s: string) => s.trim())
          : tastingNotes.aroma,
        palate: String(tn.palate || tastingNotes.palate),
        finish: String(tn.finish || tastingNotes.finish)
      };
    }
  }

  let foodPairings: string[] = ['Aged Cheese', 'Grilled Steaks', 'Cellar Charcuterie'];
  if (raw.food_pairings) {
    if (Array.isArray(raw.food_pairings)) {
      foodPairings = raw.food_pairings as string[];
    } else if (typeof raw.food_pairings === 'string') {
      try {
        const parsed = JSON.parse(raw.food_pairings as string);
        if (Array.isArray(parsed)) foodPairings = parsed;
      } catch {
        foodPairings = (raw.food_pairings as string).split(',').map(s => s.trim());
      }
    }
  }

  return {
    product_id: String(raw.product_id || ''),
    name: String(raw.name || 'Fine Wine'),
    winery: String(raw.winery || 'Artisanal Winery'),
    country: String(raw.country || 'France'),
    region: String(raw.region || 'Bordeaux'),
    vintage: Number(raw.vintage || new Date().getFullYear()),
    wine_type: (raw.wine_type as Product['wine_type']) || 'Red',
    grape_variety: String(raw.grape_variety || 'Cabernet Sauvignon'),
    alcohol_percentage: Number(raw.alcohol_percentage || 13.5),
    sweetness: (raw.sweetness as Product['sweetness']) || 'Dry',
    body: (raw.body as Product['body']) || 'Full',
    price: Number(raw.price || 0),
    original_price: raw.original_price ? Number(raw.original_price) : undefined,
    stock: Number(raw.stock ?? 10),
    image: String(raw.image || '/images/category_red_wine_1791213197300.jpg'),
    images: Array.isArray(raw.images) ? (raw.images as string[]) : undefined,
    bottle_color: String(raw.bottle_color || '#440e18'),
    accent_color: String(raw.accent_color || '#d4af37'),
    description: String(raw.description || ''),
    rating: Number(raw.rating ?? 5.0),
    reviews_count: Number(raw.reviews_count ?? 1),
    featured: Boolean(raw.featured),
    category_id: String(raw.category_id || raw.category || 'cat-red'),
    tasting_notes: tastingNotes,
    food_pairings: foodPairings,
    serving_temp: String(raw.serving_temp || '16–18°C (60–64°F)'),
    decanting: String(raw.decanting || 'Decant 45 minutes before serving')
  };
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
    if (!data) return null;
    return (data as Record<string, unknown>[]).map(normalizeProductFromSupabase);
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
  if (!isSupabaseConfigured) {
    return () => {};
  }

  fetchProductsFromSupabase().then((items) => {
    if (items && items.length > 0) {
      onData(items);
    }
  }).catch((err) => {
    if (onError) onError(err);
  });

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
 * Fetch orders from Supabase with complete field normalization
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('*')
      .order('order_date', { ascending: false });

    if (error) throw error;
    if (!data) return null;
    return (data as Record<string, unknown>[]).map(normalizeOrderFromSupabase);
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

export interface SaveOrderResult {
  success: boolean;
  error?: string;
  code?: string;
  details?: string;
  isTableMissing?: boolean;
  isRlsBlocked?: boolean;
}

/**
 * Save Order to Supabase with automatic schema adaptation and detailed error classification
 */
export async function saveOrderToSupabase(order: Order): Promise<SaveOrderResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured with live credentials. Order was saved locally in demo mode.',
      code: 'NOT_CONFIGURED'
    };
  }

  // 1. Try with comprehensive payload
  const fullPayload = formatOrderForSupabase(order);
  try {
    const { error } = await supabase
      .from(ORDERS_TABLE)
      .upsert(fullPayload, { onConflict: 'order_id' });

    if (!error) {
      console.log(`[Supabase] Order #${order.order_id} successfully saved to '${ORDERS_TABLE}' table.`);
      return { success: true };
    }

    const errorMsg = error.message || '';
    const isTableMissing = error.code === '42P01' || errorMsg.includes('relation "public.orders" does not exist') || errorMsg.includes('not found');
    const isRls = error.code === '42501' || errorMsg.toLowerCase().includes('row-level security');
    const isColumnMissing = error.code === 'PGRST204' || errorMsg.toLowerCase().includes('column') || errorMsg.toLowerCase().includes('schema cache');

    // If a column isn't found in older schemas, retry with minimal legacy subset
    if (isColumnMissing) {
      console.info('[Supabase] Retrying order save with legacy schema column subset...');
      const legacyPayload = formatLegacyOrderForSupabase(order);
      const { error: retryError } = await supabase
        .from(ORDERS_TABLE)
        .upsert(legacyPayload, { onConflict: 'order_id' });

      if (!retryError) {
        console.log(`[Supabase] Order #${order.order_id} saved using legacy columns.`);
        return { success: true };
      }
      return {
        success: false,
        error: retryError.message,
        code: retryError.code,
        details: retryError.details
      };
    }

    if (isTableMissing) {
      console.warn(`[Supabase] Table '${ORDERS_TABLE}' does not exist in your Supabase project. Please execute the SQL schema in Supabase SQL Editor.`);
      return {
        success: false,
        error: `Table '${ORDERS_TABLE}' does not exist in your Supabase project. Run the SQL schema in Supabase SQL Editor.`,
        code: 'TABLE_NOT_FOUND',
        isTableMissing: true
      };
    }

    if (isRls) {
      console.warn(`[Supabase] Row-Level Security (RLS) blocked order insertion. Please enable the 'Allow anon insert orders' policy.`);
      return {
        success: false,
        error: 'Row-Level Security (RLS) policy blocked insertion. Run the SQL schema to enable public insert permissions.',
        code: 'RLS_BLOCKED',
        isRlsBlocked: true
      };
    }

    handleDatabaseError(error, OperationType.WRITE, ORDERS_TABLE);
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    handleDatabaseError(err, OperationType.WRITE, ORDERS_TABLE);
    return {
      success: false,
      error: msg
    };
  }
}

/**
 * Batch-sync all locally stored orders to Supabase (e.g. after connecting credentials)
 */
export async function syncAllLocalOrdersToSupabase(orders: Order[]): Promise<{
  syncedCount: number;
  failedCount: number;
  lastError?: string;
}> {
  if (!isSupabaseConfigured || orders.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  let synced = 0;
  let failed = 0;
  let lastError: string | undefined;

  for (const order of orders) {
    const res = await saveOrderToSupabase(order);
    if (res.success) {
      synced++;
    } else {
      failed++;
      lastError = res.error;
    }
  }

  return { syncedCount: synced, failedCount: failed, lastError };
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
    const payload = formatProductForSupabase(product);
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .upsert(payload, { onConflict: 'product_id' });

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

export interface SaveUserResult {
  success: boolean;
  error?: string;
  code?: string;
  details?: string;
  isTableMissing?: boolean;
  isRlsBlocked?: boolean;
}

/**
 * Save or Update User Profile in Supabase with adaptive column fallbacks and conflict resolution
 */
export async function saveUserToSupabase(user: User): Promise<SaveUserResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials not configured. User saved locally.',
      code: 'NOT_CONFIGURED'
    };
  }

  const fullPayload = formatUserForSupabase(user);

  try {
    // Attempt 1: Full payload with onConflict 'user_id'
    const { error } = await supabase
      .from(USERS_TABLE)
      .upsert(fullPayload, { onConflict: 'user_id' });

    if (!error) {
      console.log(`[Supabase] User account '${user.email}' successfully persisted to '${USERS_TABLE}' table.`);
      return { success: true };
    }

    const errorMsg = error.message || '';
    const isTableMissing = error.code === '42P01' || errorMsg.includes('relation "public.users" does not exist') || errorMsg.includes('not found');
    const isRls = error.code === '42501' || errorMsg.toLowerCase().includes('row-level security');
    const isColumnMissing = error.code === '42703' || error.code === 'PGRST204' || errorMsg.toLowerCase().includes('column');
    const isConflict = error.code === '23505' || errorMsg.toLowerCase().includes('unique') || errorMsg.toLowerCase().includes('conflict');

    // Attempt 2: If optional columns are missing in user's table (e.g. date_of_birth), retry with core columns
    if (isColumnMissing) {
      console.info(`[Supabase] Optional columns missing in users table for ${user.email}, retrying with core fields...`);
      const corePayload = formatCoreUserForSupabase(user);
      const { error: coreErr } = await supabase
        .from(USERS_TABLE)
        .upsert(corePayload, { onConflict: 'user_id' });

      if (!coreErr) {
        console.log(`[Supabase] User '${user.email}' saved using core column schema.`);
        return { success: true };
      }

      // Try onConflict email if user_id failed
      const { error: emailErr } = await supabase
        .from(USERS_TABLE)
        .upsert(corePayload, { onConflict: 'email' });

      if (!emailErr) {
        return { success: true };
      }

      return {
        success: false,
        error: coreErr.message,
        code: coreErr.code,
        details: coreErr.details
      };
    }

    // Attempt 3: If conflict on email
    if (isConflict) {
      const { error: conflictErr } = await supabase
        .from(USERS_TABLE)
        .upsert(fullPayload, { onConflict: 'email' });

      if (!conflictErr) {
        return { success: true };
      }
    }

    if (isTableMissing) {
      return {
        success: false,
        error: `Table '${USERS_TABLE}' does not exist in Supabase. Run SQL schema in Supabase SQL Editor.`,
        code: 'TABLE_NOT_FOUND',
        isTableMissing: true
      };
    }

    if (isRls) {
      return {
        success: false,
        error: `RLS blocked user insert on '${USERS_TABLE}'. Please enable public insert policy in SQL schema.`,
        code: 'RLS_BLOCKED',
        isRlsBlocked: true
      };
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    };
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, USERS_TABLE);
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}

/**
 * Batch-sync all locally registered users to Supabase (excludes any legacy demo accounts)
 */
export async function syncAllLocalUsersToSupabase(users: User[]): Promise<{
  syncedCount: number;
  failedCount: number;
  lastError?: string;
}> {
  if (!isSupabaseConfigured || users.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  // Filter out any leftover demo accounts
  const realUsers = users.filter(u =>
    u.email !== 'maria.santos@vinea.ph' &&
    u.email !== 'roberto.tan@vinea.ph' &&
    u.user_id !== 'usr-101' &&
    u.user_id !== 'usr-102'
  );

  let synced = 0;
  let failed = 0;
  let lastError: string | undefined;

  for (const user of realUsers) {
    const res = await saveUserToSupabase(user);
    if (res.success) {
      synced++;
    } else {
      failed++;
      lastError = res.error;
    }
  }

  return { syncedCount: synced, failedCount: failed, lastError };
}

/**
 * Fetch registered users from Supabase
 */
export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return null;

    return data
      .filter((u: Record<string, unknown>) => {
        const email = String(u.email || '').toLowerCase();
        return email !== 'maria.santos@vinea.ph' && email !== 'roberto.tan@vinea.ph';
      })
      .map((u: Record<string, unknown>) => ({
        user_id: String(u.user_id || `usr-${Date.now()}`),
        name: String(u.name || 'Collector'),
        email: String(u.email || ''),
        phone: String(u.phone || ''),
        password: String(u.password || ''),
        role: (u.role as User['role']) || 'customer',
        avatar: (u.avatar as string) || undefined,
        membership_tier: (u.membership_tier as User['membership_tier']) || 'Connoisseur',
        member_since: (u.member_since as string) || undefined,
        date_of_birth: (u.date_of_birth as string) || undefined,
        favorite_davao_branch: (u.favorite_davao_branch as string) || undefined,
        preferred_wine_types: Array.isArray(u.preferred_wine_types) ? (u.preferred_wine_types as User['preferred_wine_types']) : ['Red'],
        flavor_preference: (u.flavor_preference as string) || undefined,
        delivery_instructions: (u.delivery_instructions as string) || undefined,
        saved_addresses: Array.isArray(u.saved_addresses) ? (u.saved_addresses as User['saved_addresses']) : [],
        loyalty_points: Number(u.loyalty_points ?? 0),
        lifetime_points: Number(u.lifetime_points ?? 0),
        redeemed_perks: Array.isArray(u.redeemed_perks) ? (u.redeemed_perks as string[]) : [],
        rewards_history: Array.isArray(u.rewards_history) ? (u.rewards_history as User['rewards_history']) : [],
        bio: (u.bio as string) || undefined
      }));
  } catch (err) {
    console.warn('[Supabase Users Fetch Note]:', err);
    return null;
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

/**
 * 6. NEWSLETTER SUBSCRIBERS
 */
export async function subscribeNewsletterInSupabase(email: string, source = 'storefront_footer'): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };
  try {
    const { error } = await supabase
      .from(NEWSLETTER_TABLE)
      .upsert({
        email: email.trim().toLowerCase(),
        source,
        status: 'active'
      }, { onConflict: 'email' });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    handleDatabaseError(error, OperationType.WRITE, NEWSLETTER_TABLE);
    return { success: false, error: error?.message || 'Failed to save subscription.' };
  }
}

export async function fetchNewsletterSubscribersFromSupabase(): Promise<{ email: string; source: string; created_at: string }[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from(NEWSLETTER_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleDatabaseError(error, OperationType.LIST, NEWSLETTER_TABLE);
    return [];
  }
}

/**
 * 7. SOMMELIER INQUIRIES & TASTING RESERVATIONS
 */
export interface SommelierInquiry {
  inquiry_id?: string;
  customer_name: string;
  email: string;
  phone?: string;
  inquiry_type?: string;
  preferred_date?: string;
  preferred_branch?: string;
  guest_count?: number;
  notes?: string;
  status?: string;
}

export async function saveSommelierInquiryToSupabase(inquiry: SommelierInquiry): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };
  try {
    const id = inquiry.inquiry_id || `inq-${Date.now()}`;
    const { error } = await supabase
      .from(INQUIRIES_TABLE)
      .upsert({
        ...inquiry,
        inquiry_id: id,
        status: inquiry.status || 'Pending'
      }, { onConflict: 'inquiry_id' });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    handleDatabaseError(error, OperationType.WRITE, INQUIRIES_TABLE);
    return { success: false, error: error?.message || 'Failed to save inquiry.' };
  }
}

/**
 * 8. WISHLIST CLOUD SYNC
 */
export async function saveWishlistToSupabase(userId: string, productIds: string[]): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;
  try {
    const { error } = await supabase
      .from(WISHLISTS_TABLE)
      .upsert({
        user_id: userId,
        items: productIds,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, OperationType.WRITE, WISHLISTS_TABLE);
  }
}

export async function fetchWishlistFromSupabase(userId: string): Promise<string[] | null> {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data, error } = await supabase
      .from(WISHLISTS_TABLE)
      .select('items')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data && Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    handleDatabaseError(error, OperationType.GET, WISHLISTS_TABLE);
    return null;
  }
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
