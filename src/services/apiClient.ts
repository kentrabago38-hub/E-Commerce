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
 * Upload an image (File or Base64 data URL) to the backend server.
 * Returns the permanent public image URL (e.g. /images/uploads/wine_...).
 */
export async function uploadImageApi(
  fileOrDataUrl: File | string,
  filename?: string
): Promise<string> {
  let base64String = '';
  let fname = filename || 'wine_photo';

  if (typeof fileOrDataUrl === 'string') {
    base64String = fileOrDataUrl;
  } else if (fileOrDataUrl instanceof File) {
    fname = fileOrDataUrl.name;
    base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  // If already a static URL (e.g. /images/...), return as is
  if (base64String.startsWith('/images/')) {
    return base64String;
  }

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64String, filename: fname }),
    });

    if (!res.ok) {
      throw new Error(`Upload server responded with HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.url && typeof data.url === 'string') {
      return data.url;
    }
    throw new Error('Upload server did not return a valid file URL');
  } catch (err) {
    console.warn('Backend image upload notice (using fallback):', err);
    return base64String;
  }
}

