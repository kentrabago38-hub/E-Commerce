import { db } from './index.ts';
import { products, categories, orders, reviews, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { Product, Category, Order, Review, User } from '../types/wine';

// 1. PRODUCTS
export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await db.select().from(products);
    return rows.map((r) => ({
      product_id: r.productId,
      name: r.name,
      winery: r.winery,
      country: r.country,
      region: r.region,
      vintage: r.vintage,
      wine_type: r.wineType as any,
      grape_variety: r.grapeVariety,
      alcohol_percentage: r.alcoholPercentage,
      sweetness: r.sweetness as any,
      body: r.body as any,
      price: r.price,
      stock: r.stock,
      image: r.image,
      bottle_color: r.bottleColor || undefined,
      accent_color: r.accentColor || undefined,
      description: r.description,
      rating: r.rating ?? 5.0,
      reviews_count: r.reviewsCount ?? 0,
      featured: r.featured ?? false,
      category_id: r.categoryId,
      tasting_notes: {
        aroma: ['Blackberry', 'Vanilla', 'Dark Plum'],
        palate: 'Velvety tannins and structured berry compote',
        finish: 'Long, nuanced oak finish'
      },
      food_pairings: r.foodPairings || ['Prime Rib', 'Aged Cheese'],
      serving_temp: r.servingTemp || '16-18°C',
      decanting: r.decanting || '30-45 minutes',
    }));
  } catch (error) {
    console.error('Failed to get products from PostgreSQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function insertProduct(prod: Product): Promise<void> {
  try {
    await db.insert(products).values({
      productId: prod.product_id,
      name: prod.name,
      winery: prod.winery,
      country: prod.country,
      region: prod.region,
      vintage: prod.vintage,
      wineType: prod.wine_type,
      grapeVariety: prod.grape_variety,
      alcoholPercentage: prod.alcohol_percentage,
      sweetness: prod.sweetness,
      body: prod.body,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
      bottleColor: prod.bottle_color,
      accentColor: prod.accent_color,
      description: prod.description,
      rating: prod.rating,
      reviewsCount: prod.reviews_count,
      featured: prod.featured,
      categoryId: prod.category_id,
      foodPairings: prod.food_pairings,
      servingTemp: prod.serving_temp,
      decanting: prod.decanting,
    }).onConflictDoUpdate({
      target: products.productId,
      set: {
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        rating: prod.rating,
        reviewsCount: prod.reviews_count,
      },
    });
  } catch (error) {
    console.error('Failed to insert product in PostgreSQL:', error);
    throw new Error('Database write failed.', { cause: error });
  }
}

export async function updateProductRecord(prod: Product): Promise<void> {
  try {
    await db.update(products).set({
      name: prod.name,
      winery: prod.winery,
      country: prod.country,
      region: prod.region,
      vintage: prod.vintage,
      wineType: prod.wine_type,
      grapeVariety: prod.grape_variety,
      alcoholPercentage: prod.alcohol_percentage,
      sweetness: prod.sweetness,
      body: prod.body,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
      description: prod.description,
      rating: prod.rating,
      reviewsCount: prod.reviews_count,
      featured: prod.featured,
      categoryId: prod.category_id,
    }).where(eq(products.productId, prod.product_id));
  } catch (error) {
    console.error('Failed to update product in PostgreSQL:', error);
    throw new Error('Database update failed.', { cause: error });
  }
}

export async function updateStockRecord(productId: string, stock: number): Promise<void> {
  try {
    await db.update(products).set({ stock }).where(eq(products.productId, productId));
  } catch (error) {
    console.error('Failed to update stock in PostgreSQL:', error);
    throw new Error('Database update failed.', { cause: error });
  }
}

export async function deleteProductRecord(productId: string): Promise<void> {
  try {
    await db.delete(products).where(eq(products.productId, productId));
  } catch (error) {
    console.error('Failed to delete product in PostgreSQL:', error);
    throw new Error('Database delete failed.', { cause: error });
  }
}

// 2. CATEGORIES
export async function getAllCategories(): Promise<Category[]> {
  try {
    const rows = await db.select().from(categories);
    return rows.map((r) => ({
      category_id: r.categoryId,
      category_name: r.name,
      slug: r.slug,
      description: r.description || '',
      image: r.image || '',
      item_count: r.itemCount ?? 0,
    }));
  } catch (error) {
    console.error('Failed to get categories from PostgreSQL:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function insertCategory(cat: Category): Promise<void> {
  try {
    await db.insert(categories).values({
      categoryId: cat.category_id,
      name: cat.category_name,
      slug: cat.slug,
      description: cat.description,
      wineType: (cat as any).wine_type || null,
      image: cat.image,
      featured: (cat as any).featured ?? false,
      itemCount: cat.item_count,
    }).onConflictDoNothing();
  } catch (error) {
    console.error('Failed to insert category in PostgreSQL:', error);
    throw new Error('Database write failed.', { cause: error });
  }
}

export async function deleteCategoryRecord(categoryId: string): Promise<void> {
  try {
    await db.delete(categories).where(eq(categories.categoryId, categoryId));
  } catch (error) {
    console.error('Failed to delete category in PostgreSQL:', error);
    throw new Error('Database delete failed.', { cause: error });
  }
}

// 3. ORDERS
export async function getAllOrders(): Promise<Order[]> {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.orderDate));
    return rows.map((r) => ({
      order_id: r.orderId,
      user_id: r.userId,
      customer_name: r.customerName,
      email: r.email,
      phone: r.phone,
      order_date: r.orderDate,
      subtotal: r.subtotal,
      shipping: r.shipping ?? 0,
      discount: r.discount ?? 0,
      discount_code: r.discountCode || undefined,
      total_amount: r.totalAmount,
      payment_method: r.paymentMethod as any,
      delivery_address: r.deliveryAddress as any,
      status: r.status as any,
      estimated_delivery: r.estimatedDelivery || '1-2 business days',
      tracking_number: r.trackingNumber || undefined,
      items: r.items as any,
    }));
  } catch (error) {
    console.error('Failed to get orders from PostgreSQL:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function insertOrder(ord: Order): Promise<void> {
  try {
    await db.insert(orders).values({
      orderId: ord.order_id,
      userId: ord.user_id,
      customerName: ord.customer_name,
      email: ord.email,
      phone: ord.phone,
      orderDate: ord.order_date,
      subtotal: ord.subtotal,
      shipping: ord.shipping,
      discount: ord.discount,
      discountCode: ord.discount_code,
      totalAmount: ord.total_amount,
      paymentMethod: ord.payment_method,
      deliveryAddress: ord.delivery_address,
      status: ord.status,
      estimatedDelivery: ord.estimated_delivery,
      trackingNumber: ord.tracking_number,
      items: ord.items,
    }).onConflictDoUpdate({
      target: orders.orderId,
      set: {
        status: ord.status,
      },
    });
  } catch (error) {
    console.error('Failed to insert order in PostgreSQL:', error);
    throw new Error('Database write failed.', { cause: error });
  }
}

export async function updateOrderStatusRecord(orderId: string, status: Order['status']): Promise<void> {
  try {
    await db.update(orders).set({ status }).where(eq(orders.orderId, orderId));
  } catch (error) {
    console.error('Failed to update order status in PostgreSQL:', error);
    throw new Error('Database update failed.', { cause: error });
  }
}

// 4. USERS
export async function getAllUsers(): Promise<User[]> {
  try {
    const rows = await db.select().from(users);
    return rows.map((r) => ({
      user_id: r.userId,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      role: r.role as any,
      member_since: r.memberSince || undefined,
      avatar: r.avatar || undefined,
      date_of_birth: r.dateOfBirth || undefined,
      preferred_wine_types: r.preferredWineTypes as any,
      flavor_preference: r.flavorPreference || undefined,
      favorite_davao_branch: r.favoriteDavaoBranch || undefined,
      delivery_instructions: r.deliveryInstructions || undefined,
      membership_tier: r.membershipTier as any,
      bio: r.bio || undefined,
      saved_addresses: r.savedAddresses || undefined,
    }));
  } catch (error) {
    console.error('Failed to get users from PostgreSQL:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function upsertUserRecord(usr: User): Promise<void> {
  try {
    await db.insert(users).values({
      userId: usr.user_id,
      uid: usr.user_id,
      name: usr.name,
      email: usr.email,
      phone: usr.phone,
      role: usr.role,
      memberSince: usr.member_since,
      avatar: usr.avatar,
      dateOfBirth: usr.date_of_birth,
      preferredWineTypes: usr.preferred_wine_types,
      flavorPreference: usr.flavor_preference,
      favoriteDavaoBranch: usr.favorite_davao_branch,
      deliveryInstructions: usr.delivery_instructions,
      membershipTier: usr.membership_tier,
      bio: usr.bio,
      savedAddresses: usr.saved_addresses,
    }).onConflictDoUpdate({
      target: users.userId,
      set: {
        name: usr.name,
        phone: usr.phone,
        avatar: usr.avatar,
        dateOfBirth: usr.date_of_birth,
        favoriteDavaoBranch: usr.favorite_davao_branch,
        deliveryInstructions: usr.delivery_instructions,
        bio: usr.bio,
        savedAddresses: usr.saved_addresses,
      },
    });
  } catch (error) {
    console.error('Failed to upsert user in PostgreSQL:', error);
    throw new Error('Database write failed.', { cause: error });
  }
}

// 5. REVIEWS
export async function getAllReviews(): Promise<Review[]> {
  try {
    const rows = await db.select().from(reviews);
    return rows.map((r) => ({
      review_id: r.reviewId,
      product_id: r.productId,
      user_id: r.userId || 'guest-connoisseur',
      user_name: r.userName,
      rating: r.rating,
      comment: r.comment,
      review_date: r.reviewDate || 'Recently',
    }));
  } catch (error) {
    console.error('Failed to get reviews from PostgreSQL:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function insertReviewRecord(rev: Review): Promise<void> {
  try {
    await db.insert(reviews).values({
      reviewId: rev.review_id,
      productId: rev.product_id,
      userId: rev.user_id,
      userName: rev.user_name,
      rating: rev.rating,
      comment: rev.comment,
      reviewDate: rev.review_date,
    }).onConflictDoNothing();
  } catch (error) {
    console.error('Failed to insert review in PostgreSQL:', error);
    throw new Error('Database write failed.', { cause: error });
  }
}
