import { Product, Category, Order, Review, User } from '../types/wine';

export async function checkPostgresHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return false;
    const data = await res.json();
    return data.database === 'postgresql';
  } catch {
    return false;
  }
}

export async function fetchProductsApi(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products from PostgreSQL database');
  return res.json();
}

export async function createProductApi(prod: Product): Promise<void> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod),
  });
  if (!res.ok) throw new Error('Failed to create product in PostgreSQL');
}

export async function updateProductApi(prod: Product): Promise<void> {
  const res = await fetch(`/api/products/${encodeURIComponent(prod.product_id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prod),
  });
  if (!res.ok) throw new Error('Failed to update product in PostgreSQL');
}

export async function updateProductStockApi(productId: string, stock: number): Promise<void> {
  const res = await fetch(`/api/products/${encodeURIComponent(productId)}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) throw new Error('Failed to update stock in PostgreSQL');
}

export async function deleteProductApi(productId: string): Promise<void> {
  const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product in PostgreSQL');
}

export async function fetchCategoriesApi(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories from PostgreSQL');
  return res.json();
}

export async function createCategoryApi(cat: Category): Promise<void> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  if (!res.ok) throw new Error('Failed to create category in PostgreSQL');
}

export async function deleteCategoryApi(categoryId: string): Promise<void> {
  const res = await fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category in PostgreSQL');
}

export async function fetchOrdersApi(): Promise<Order[]> {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders from PostgreSQL');
  return res.json();
}

export async function createOrderApi(order: Order): Promise<void> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to persist order to PostgreSQL');
}

export async function updateOrderStatusApi(orderId: string, status: Order['status']): Promise<void> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status in PostgreSQL');
}

export async function fetchUsersApi(): Promise<User[]> {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users from PostgreSQL');
  return res.json();
}

export async function saveUserApi(user: User): Promise<void> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to save user in PostgreSQL');
}

export async function fetchReviewsApi(): Promise<Review[]> {
  const res = await fetch('/api/reviews');
  if (!res.ok) throw new Error('Failed to fetch reviews from PostgreSQL');
  return res.json();
}

export async function createReviewApi(review: Review): Promise<void> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to save review in PostgreSQL');
}
