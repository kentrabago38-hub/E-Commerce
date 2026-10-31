import { pgTable, text, integer, real, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Products Table (Fine Wine Catalog)
export const products = pgTable('products', {
  productId: text('product_id').primaryKey(),
  name: text('name').notNull(),
  winery: text('winery').notNull(),
  country: text('country').notNull(),
  region: text('region').notNull(),
  vintage: integer('vintage').notNull(),
  wineType: text('wine_type').notNull(),
  grapeVariety: text('grape_variety').notNull(),
  alcoholPercentage: real('alcohol_percentage').notNull(),
  sweetness: text('sweetness').notNull(),
  body: text('body').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  image: text('image').notNull(),
  bottleColor: text('bottle_color'),
  accentColor: text('accent_color'),
  description: text('description').notNull(),
  rating: real('rating').default(5.0),
  reviewsCount: integer('reviews_count').default(0),
  featured: boolean('featured').default(false),
  categoryId: text('category_id').notNull(),
  foodPairings: jsonb('food_pairings').$type<string[]>(),
  servingTemp: text('serving_temp'),
  decanting: text('decanting'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories Table
export const categories = pgTable('categories', {
  categoryId: text('category_id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  wineType: text('wine_type'),
  image: text('image'),
  featured: boolean('featured').default(false),
  itemCount: integer('item_count').default(0),
});

// Users Table (Linked with Firebase Auth / Customer Profiles)
export const users = pgTable('users', {
  userId: text('user_id').primaryKey(),
  uid: text('uid').unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').default('customer').notNull(),
  memberSince: text('member_since'),
  avatar: text('avatar'),
  dateOfBirth: text('date_of_birth'),
  preferredWineTypes: jsonb('preferred_wine_types').$type<string[]>(),
  flavorPreference: text('flavor_preference'),
  favoriteDavaoBranch: text('favorite_davao_branch'),
  deliveryInstructions: text('delivery_instructions'),
  membershipTier: text('membership_tier').default('Connoisseur'),
  bio: text('bio'),
  savedAddresses: jsonb('saved_addresses').$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders Table (Cellar allocations & shipments)
export const orders = pgTable('orders', {
  orderId: text('order_id').primaryKey(),
  userId: text('user_id').notNull(),
  customerName: text('customer_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  orderDate: text('order_date').notNull(),
  subtotal: integer('subtotal').notNull(),
  shipping: integer('shipping').default(0),
  discount: integer('discount').default(0),
  discountCode: text('discount_code'),
  totalAmount: integer('total_amount').notNull(),
  paymentMethod: text('payment_method').notNull(),
  deliveryAddress: jsonb('delivery_address').notNull(),
  status: text('status').default('Processing').notNull(),
  estimatedDelivery: text('estimated_delivery'),
  trackingNumber: text('tracking_number'),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  reviewId: text('review_id').primaryKey(),
  productId: text('product_id').notNull(),
  userId: text('user_id'),
  userName: text('user_name').notNull(),
  rating: real('rating').notNull(),
  comment: text('comment').notNull(),
  reviewDate: text('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const productsRelations = relations(products, ({ many, one }) => ({
  reviews: many(reviews),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.categoryId],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.userId],
    references: [users.userId],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.productId],
  }),
}));
