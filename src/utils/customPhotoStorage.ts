/**
 * Persistent storage for user-customized product photos.
 * Uses a multi-tiered architecture:
 * 1. Synchronous in-memory cache for instant UI rendering without layout shifts
 * 2. LocalStorage for synchronous hydration on initial page load
 * 3. IndexedDB for durable, unlimited storage that survives browser refreshes,
 *    cache clearing, and never fails due to localStorage quota limits.
 */

const DB_NAME = 'vinea_store_db';
const DB_VERSION = 2;
const STORE_NAME = 'custom_photos';
const SESSION_STORE_NAME = 'user_session';
const AVATAR_STORE_NAME = 'user_avatars';
const LOCAL_STORAGE_KEY = 'vinea_product_custom_images';
const CURRENT_USER_KEY = 'vinea_current_user';
const EXPLICIT_LOGOUT_KEY = 'vinea_explicit_logout';

export interface CustomPhotoEntry {
  image?: string;
  images?: string[];
  updatedAt?: number;
}

export interface StoredAvatarEntry {
  key: string;
  avatar: string;
  fallbackDataUrl?: string;
  updatedAt: number;
}

// In-memory synchronous cache
const memoryCache: Record<string, CustomPhotoEntry> = {};

// Initialize memoryCache from localStorage immediately at module load
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.assign(memoryCache, parsed);
      }
    }
  } catch (e) {
    console.warn('[PhotoStorage] Initial cache load note:', e);
  }
}

/**
 * Open or create the IndexedDB database for persistent photo & session storage.
 */
function openPhotoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
      }
      if (!db.objectStoreNames.contains(SESSION_STORE_NAME)) {
        db.createObjectStore(SESSION_STORE_NAME, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(AVATAR_STORE_NAME)) {
        db.createObjectStore(AVATAR_STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a custom photo entry for a product across memory, localStorage, and IndexedDB.
 */
export async function saveCustomPhoto(
  productId: string,
  entry: CustomPhotoEntry
): Promise<void> {
  if (!productId) return;

  const data: CustomPhotoEntry = {
    image: entry.image,
    images: entry.images || [],
    updatedAt: Date.now()
  };

  // 1. Update in-memory synchronous cache
  memoryCache[productId] = data;

  // 2. Persist to localStorage (only non-bloated entries to preserve quota for user session)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const compactCache: Record<string, CustomPhotoEntry> = {};
      for (const [k, v] of Object.entries(memoryCache)) {
        if (v.image && v.image.startsWith('data:') && v.image.length > 60000) continue;
        compactCache[k] = v;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(compactCache));
    } catch (err) {
      console.warn('[PhotoStorage] LocalStorage quota limit reached (IndexedDB will preserve photo):', err);
    }
  }

  // 3. Persist to IndexedDB (virtually unlimited browser storage)
  try {
    const db = await openPhotoDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ productId, ...data });

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[PhotoStorage] IndexedDB write note:', err);
  }
}

/**
 * Synchronously retrieve custom photo info from memory cache.
 */
export function getCustomPhotoSync(productId: string): CustomPhotoEntry | undefined {
  return memoryCache[productId];
}

/**
 * Synchronously retrieve all cached custom photos.
 */
export function getAllCustomPhotosSync(): Record<string, CustomPhotoEntry> {
  return { ...memoryCache };
}

/**
 * Asynchronously loads all custom photos from IndexedDB, merges into memoryCache,
 * and syncs compact entries to localStorage. Call this during store initialization.
 */
export async function loadAllCustomPhotosFromDb(): Promise<Record<string, CustomPhotoEntry>> {
  try {
    const db = await openPhotoDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    const results = await new Promise<Array<CustomPhotoEntry & { productId: string }>>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    for (const item of results) {
      if (item && item.productId) {
        memoryCache[item.productId] = {
          image: item.image,
          images: item.images,
          updatedAt: item.updatedAt
        };
      }
    }
  } catch (err) {
    console.warn('[PhotoStorage] IndexedDB load note:', err);
  }

  return { ...memoryCache };
}

/**
 * Remove a custom photo entry when a product is deleted.
 */
export async function deleteCustomPhoto(productId: string): Promise<void> {
  delete memoryCache[productId];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const compactCache: Record<string, CustomPhotoEntry> = {};
      for (const [k, v] of Object.entries(memoryCache)) {
        if (v.image && v.image.startsWith('data:') && v.image.length > 60000) continue;
        compactCache[k] = v;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(compactCache));
    } catch {}
  }

  try {
    const db = await openPhotoDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(productId);
  } catch (err) {
    console.warn('[PhotoStorage] IndexedDB delete note:', err);
  }
}

/**
 * Quota-safe persistence for the active logged-in user in localStorage.
 * If localStorage is full due to heavy product image caches, evicts image caches
 * (already stored in IndexedDB) so the user session is NEVER lost on refresh.
 */
export function safeSaveCurrentUserToLocalStorage(user: any | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  if (!user) {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {}
    return;
  }

  const serialized = JSON.stringify(user);
  try {
    localStorage.setItem(CURRENT_USER_KEY, serialized);
  } catch {
    // QuotaExceededError recovery: evict bulky product photo caches (IndexedDB retains them)
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('vinea_saved_avatar');
      const prodsRaw = localStorage.getItem('vinea_products');
      if (prodsRaw && prodsRaw.length > 200000) {
        localStorage.removeItem('vinea_products');
      }
      localStorage.setItem(CURRENT_USER_KEY, serialized);
    } catch {
      // Last resort: store user without oversized inline base64 avatar in localStorage;
      // IndexedDB user_avatars & user_session still hold the full avatar.
      try {
        const compactUser = { ...user };
        if (typeof compactUser.avatar === 'string' && compactUser.avatar.startsWith('data:') && compactUser.avatar.length > 50000) {
          delete compactUser.avatar;
        }
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(compactUser));
      } catch (innerErr) {
        console.warn('[SessionStorage] Unable to write user to localStorage:', innerErr);
      }
    }
  }
}

/**
 * Explicit logout marker so page refresh does not confuse an intentional logout with lost storage.
 */
export function setExplicitLogoutFlag(loggedOut: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (loggedOut) {
      localStorage.setItem(EXPLICIT_LOGOUT_KEY, 'true');
    } else {
      localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
    }
  } catch {}
}

export function isExplicitlyLoggedOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(EXPLICIT_LOGOUT_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Persist active customer session to IndexedDB.
 */
export async function saveCurrentUserToDb(user: any | null): Promise<void> {
  try {
    const db = await openPhotoDb();
    const tx = db.transaction(SESSION_STORE_NAME, 'readwrite');
    const store = tx.objectStore(SESSION_STORE_NAME);
    if (user) {
      store.put({ key: 'active_user', user, updatedAt: Date.now() });
    } else {
      store.delete('active_user');
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[SessionDB] IndexedDB write note:', err);
  }
}

/**
 * Load active customer session from IndexedDB.
 */
export async function loadCurrentUserFromDb<T = any>(): Promise<T | null> {
  try {
    const db = await openPhotoDb();
    const tx = db.transaction(SESSION_STORE_NAME, 'readonly');
    const store = tx.objectStore(SESSION_STORE_NAME);
    const request = store.get('active_user');
    const result = await new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return result?.user ?? null;
  } catch (err) {
    console.warn('[SessionDB] IndexedDB load note:', err);
    return null;
  }
}

/**
 * Save user's custom avatar (and optional compact data URL fallback) to IndexedDB.
 */
export async function saveUserAvatarToDb(
  userId: string,
  email: string,
  avatar: string,
  fallbackDataUrl?: string
): Promise<void> {
  if (!avatar) return;
  const now = Date.now();
  const keys = [userId, email?.toLowerCase()?.trim()].filter(Boolean);

  // Sync compact reference to localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    for (const k of keys) {
      try {
        if (!avatar.startsWith('data:') || avatar.length <= 60000) {
          localStorage.setItem(`vinea_user_avatar_${k}`, avatar);
        }
      } catch {}
    }
  }

  try {
    const db = await openPhotoDb();
    const tx = db.transaction(AVATAR_STORE_NAME, 'readwrite');
    const store = tx.objectStore(AVATAR_STORE_NAME);
    for (const k of keys) {
      store.put({
        key: k,
        avatar,
        fallbackDataUrl: fallbackDataUrl || (avatar.startsWith('data:') ? avatar : undefined),
        updatedAt: now
      });
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[AvatarDB] IndexedDB write note:', err);
  }
}

/**
 * Load user's saved avatar entry from IndexedDB.
 */
export async function loadUserAvatarFromDb(
  userId?: string,
  email?: string
): Promise<StoredAvatarEntry | null> {
  const keys = [email?.toLowerCase()?.trim(), userId].filter(Boolean) as string[];
  if (keys.length === 0) return null;

  try {
    const db = await openPhotoDb();
    const tx = db.transaction(AVATAR_STORE_NAME, 'readonly');
    const store = tx.objectStore(AVATAR_STORE_NAME);

    for (const k of keys) {
      const req = store.get(k);
      const entry = await new Promise<StoredAvatarEntry | undefined>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      if (entry && entry.avatar) {
        return entry;
      }
    }
    return null;
  } catch (err) {
    console.warn('[AvatarDB] IndexedDB load note:', err);
    return null;
  }
}

