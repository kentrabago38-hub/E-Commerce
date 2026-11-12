import { Product, Category, Order, Review, User } from '../types/wine';

async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function checkPostgresHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return false;
    const data = await res.json();
    return data?.database === 'postgresql';
  } catch {
    return false;
  }
}

export async function fetchProductsApi(): Promise<Product[]> {
  return safeFetchJson<Product[]>('/api/products', []);
}

export async function createProductApi(prod: Product): Promise<void> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod),
    });
    if (!res.ok) throw new Error('Failed to create product');
  } catch (err) {
    console.warn('[apiClient] POST /api/products notice:', err);
  }
}

export async function updateProductApi(prod: Product): Promise<void> {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(prod.product_id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod),
    });
    if (!res.ok) throw new Error('Failed to update product');
  } catch (err) {
    console.warn('[apiClient] PUT /api/products notice:', err);
  }
}

export async function updateProductStockApi(productId: string, stock: number): Promise<void> {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    if (!res.ok) throw new Error('Failed to update stock');
  } catch (err) {
    console.warn('[apiClient] PATCH /api/products/stock notice:', err);
  }
}

export async function deleteProductApi(productId: string): Promise<void> {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  } catch (err) {
    console.warn('[apiClient] DELETE /api/products notice:', err);
  }
}

export async function fetchCategoriesApi(): Promise<Category[]> {
  return safeFetchJson<Category[]>('/api/categories', []);
}

export async function createCategoryApi(cat: Category): Promise<void> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    if (!res.ok) throw new Error('Failed to create category');
  } catch (err) {
    console.warn('[apiClient] POST /api/categories notice:', err);
  }
}

export async function deleteCategoryApi(categoryId: string): Promise<void> {
  try {
    const res = await fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
  } catch (err) {
    console.warn('[apiClient] DELETE /api/categories notice:', err);
  }
}

export async function fetchOrdersApi(): Promise<Order[]> {
  return safeFetchJson<Order[]>('/api/orders', []);
}

export async function createOrderApi(order: Order): Promise<void> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to persist order');
  } catch (err) {
    console.warn('[apiClient] POST /api/orders notice:', err);
  }
}

export async function updateOrderStatusApi(orderId: string, status: Order['status']): Promise<void> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
  } catch (err) {
    console.warn('[apiClient] PATCH /api/orders/status notice:', err);
  }
}

export async function fetchUsersApi(): Promise<User[]> {
  return safeFetchJson<User[]>('/api/users', []);
}

export async function saveUserApi(user: User): Promise<void> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to save user');
  } catch (err) {
    console.warn('[apiClient] POST /api/users notice:', err);
  }
}

export async function fetchReviewsApi(): Promise<Review[]> {
  return safeFetchJson<Review[]>('/api/reviews', []);
}

export async function createReviewApi(review: Review): Promise<void> {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Failed to save review');
  } catch (err) {
    console.warn('[apiClient] POST /api/reviews notice:', err);
  }
}

/**
 * Compresses an image file or base64 data URL to an optimized JPEG (max 1200px, 0.88 quality).
 * Keeps payload lightweight (~80-120KB) and prevents browser storage quota issues.
 */
export async function optimizeImageClientSide(
  fileOrDataUrl: File | string,
  maxDimension = 1200,
  quality = 0.88
): Promise<string> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  }

  let rawDataUrl = '';
  if (typeof fileOrDataUrl === 'string') {
    if (!fileOrDataUrl.startsWith('data:image')) {
      return fileOrDataUrl;
    }
    rawDataUrl = fileOrDataUrl;
  } else {
    rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

const CLIENT_SESSION_ID_KEY = 'vinea_sid';

export function getClientSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CLIENT_SESSION_ID_KEY) || sessionStorage.getItem(CLIENT_SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export function getOrCreateClientSessionId(): string {
  const existing = getClientSessionId();
  if (existing) return existing;

  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `sid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CLIENT_SESSION_ID_KEY, generated);
    } catch {}
    try {
      sessionStorage.setItem(CLIENT_SESSION_ID_KEY, generated);
    } catch {}
  }
  return generated;
}

export async function fetchSessionApi(): Promise<User | null> {
  try {
    const sid = getClientSessionId();
    const headers: Record<string, string> = {};
    if (sid) headers['x-vinea-session-id'] = sid;
    const res = await fetch('/api/session', {
      headers,
      credentials: 'include'
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const data = await res.json();
    if (data?.authenticated && data.user) {
      return data.user as User;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveSessionApi(user: User): Promise<void> {
  try {
    const sid = getOrCreateClientSessionId();
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vinea-session-id': sid
      },
      credentials: 'include',
      body: JSON.stringify({ user })
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.sessionId && typeof window !== 'undefined') {
        try {
          localStorage.setItem(CLIENT_SESSION_ID_KEY, data.sessionId);
        } catch {}
        try {
          sessionStorage.setItem(CLIENT_SESSION_ID_KEY, data.sessionId);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[apiClient] POST /api/session notice:', err);
  }
}

export async function clearSessionApi(): Promise<void> {
  try {
    const sid = getClientSessionId();
    const headers: Record<string, string> = {};
    if (sid) headers['x-vinea-session-id'] = sid;
    await fetch('/api/session', {
      method: 'DELETE',
      headers,
      credentials: 'include'
    });
  } catch (err) {
    console.warn('[apiClient] DELETE /api/session notice:', err);
  }
}

/**
 * Compresses a user profile avatar to a compact 400px JPEG (~15-35KB).
 */
export async function optimizeAvatarClientSide(fileOrDataUrl: File | string): Promise<string> {
  return optimizeImageClientSide(fileOrDataUrl, 400, 0.84);
}

/**
 * Uploads an avatar image to the server and also returns a compact client-side dataUrl fallback
 * for IndexedDB persistence across ephemeral restarts or offline refreshes.
 */
export async function uploadAvatarApi(
  fileOrDataUrl: File | string,
  filename?: string
): Promise<{ url: string; dataUrl: string }> {
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('/images/') || fileOrDataUrl.startsWith('http'))) {
    return { url: fileOrDataUrl, dataUrl: fileOrDataUrl };
  }

  let fname = filename || 'user_avatar';
  if (fileOrDataUrl instanceof File) {
    fname = fileOrDataUrl.name;
  }

  const compactDataUrl = await optimizeAvatarClientSide(fileOrDataUrl);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: compactDataUrl, filename: fname }),
    });

    if (!res.ok) {
      throw new Error(`Upload server responded with HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Upload response was not JSON');
    }

    const data = await res.json();
    if (data.url && typeof data.url === 'string') {
      return { url: data.url, dataUrl: compactDataUrl };
    }
    throw new Error('Upload server did not return a valid file URL');
  } catch {
    console.info('[apiClient] Backend avatar upload fallback: using compact client-side photo data');
    return { url: compactDataUrl, dataUrl: compactDataUrl };
  }
}

/**
 * Upload an image (File or Base64 data URL) to the backend server.
 * Returns the permanent public image URL (e.g. /images/uploads/wine_...) or optimized persistent data URL.
 */
export async function uploadImageApi(
  fileOrDataUrl: File | string,
  filename?: string
): Promise<string> {
  // If already a static URL (e.g. /images/...), return as is
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('/images/') || fileOrDataUrl.startsWith('http'))) {
    return fileOrDataUrl;
  }

  let fname = filename || 'wine_photo';
  if (fileOrDataUrl instanceof File) {
    fname = fileOrDataUrl.name;
  }

  const base64String = await optimizeImageClientSide(fileOrDataUrl);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64String, filename: fname }),
    });

    if (!res.ok) {
      throw new Error(`Upload server responded with HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Upload response was not JSON');
    }

    const data = await res.json();
    if (data.url && typeof data.url === 'string') {
      return data.url;
    }
    throw new Error('Upload server did not return a valid file URL');
  } catch (err) {
    console.info('[apiClient] Backend upload fallback: using client-side optimized photo data');
    return base64String;
  }
}

