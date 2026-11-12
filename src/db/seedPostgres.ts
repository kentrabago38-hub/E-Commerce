import {
  getAllProducts,
  insertProduct,
  getAllCategories,
  insertCategory,
  getAllUsers,
  upsertUserRecord,
  getAllOrders,
  insertOrder,
  getAllReviews,
  insertReviewRecord
} from './queries';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../data/mockData';

export async function seedPostgresIfEmpty(): Promise<void> {
  if (!process.env.SQL_HOST) {
    // No PostgreSQL configured, skip database seeding
    return;
  }
  try {
    const existingProducts = await getAllProducts();
    const existingIds = new Set(existingProducts.map(p => p.product_id));
    for (const prod of INITIAL_PRODUCTS) {
      if (!existingIds.has(prod.product_id)) {
        console.log(`Seeding wine ${prod.product_id} (${prod.name}) into PostgreSQL...`);
        await insertProduct(prod);
      }
    }

    const existingCats = await getAllCategories();
    const existingCatIds = new Set(existingCats.map(c => c.category_id));
    for (const cat of INITIAL_CATEGORIES) {
      if (!existingCatIds.has(cat.category_id)) {
        await insertCategory(cat);
      }
    }

    const existingUsers = await getAllUsers();
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
    for (const usr of INITIAL_REGISTERED_USERS) {
      if (!existingEmails.has(usr.email.toLowerCase())) {
        await upsertUserRecord(usr);
      }
    }

    const existingOrders = await getAllOrders();
    const existingOrderIds = new Set(existingOrders.map(o => o.order_id));
    for (const ord of INITIAL_ORDERS) {
      if (!existingOrderIds.has(ord.order_id)) {
        await insertOrder(ord);
      }
    }

    const existingReviews = await getAllReviews();
    const existingReviewIds = new Set(existingReviews.map(r => r.review_id));
    for (const rev of INITIAL_REVIEWS) {
      if (!existingReviewIds.has(rev.review_id)) {
        await insertReviewRecord(rev);
      }
    }

    console.log('PostgreSQL database synchronization check complete.');
  } catch (error) {
    console.warn('Note on PostgreSQL seeding:', error);
  }
}
