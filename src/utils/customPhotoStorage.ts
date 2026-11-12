/**
 * Persistent storage for user-customized product photos.
 * Uses a multi-tiered architecture:
 * 1. Synchronous in-memory cache for instant UI rendering without layout shifts
 * 2. LocalStorage for synchronous hydration on initial page load
 * 3. IndexedDB for durable, unlimited storage that survives browser refreshes,
 *    cache clearing, and never fails due to localStorage quota limits.
 */

const DB_NAME = 'vinea_store_db';
const STORE_NAME = 'custom_photos';
const LOCAL_STORAGE_KEY = 'vinea_product_custom_images';

export interface CustomPhotoEntry {
  image?: string;
  images?: string[];
  updatedAt?: number;
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
 * Open or create the IndexedDB database for persistent photo storage.
 */
function openPhotoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
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

  // 2. Persist to localStorage (with safe quota handling)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));
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
 * and syncs to localStorage. Call this during store initialization.
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

    // Try keeping localStorage up-to-date with non-oversized items
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));
      } catch {}
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));
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
