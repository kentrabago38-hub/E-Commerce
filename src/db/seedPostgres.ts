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
} from './queries.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../data/mockData.ts';

export async function seedPostgresIfEmpty(): Promise<void> {
  if (!process.env.SQL_HOST) {
    // No PostgreSQL configured, skip database seeding
    return;
  }
  try {
    const existingProducts = await getAllProducts();
    if (existingProducts.length === 0) {
      console.log('Seeding initial VÍNEA wine catalog into PostgreSQL...');
      for (const prod of INITIAL_PRODUCTS) {
        await insertProduct(prod);
      }
    }

    const existingCats = await getAllCategories();
    if (existingCats.length === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await insertCategory(cat);
      }
    }

    const existingUsers = await getAllUsers();
    if (existingUsers.length === 0) {
      for (const usr of INITIAL_REGISTERED_USERS) {
        await upsertUserRecord(usr);
      }
    }

    const existingOrders = await getAllOrders();
    if (existingOrders.length === 0) {
      for (const ord of INITIAL_ORDERS) {
        await insertOrder(ord);
      }
    }

    const existingReviews = await getAllReviews();
    if (existingReviews.length === 0) {
      for (const rev of INITIAL_REVIEWS) {
        await insertReviewRecord(rev);
      }
    }

    console.log('PostgreSQL database seeded successfully.');
  } catch (error) {
    console.warn('Note on PostgreSQL seeding:', error);
  }
}
