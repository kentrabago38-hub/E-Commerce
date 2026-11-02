import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from '../src/data/mockData.ts';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env to seed Supabase.');
  console.log('Example:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJh...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Connecting to Supabase at:', supabaseUrl);

  // 1. Seed Categories
  console.log('1. Seeding categories...');
  const { error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES, { onConflict: 'category_id' });
  if (catErr) console.warn('Categories error:', catErr.message);
  else console.log(`✓ ${INITIAL_CATEGORIES.length} Categories seeded`);

  // 2. Seed Products
  console.log('2. Seeding products...');
  const { error: prodErr } = await supabase.from('products').upsert(INITIAL_PRODUCTS, { onConflict: 'product_id' });
  if (prodErr) console.warn('Products error:', prodErr.message);
  else console.log(`✓ ${INITIAL_PRODUCTS.length} Products seeded`);

  // 3. Seed Orders
  console.log('3. Seeding orders...');
  const { error: ordErr } = await supabase.from('orders').upsert(INITIAL_ORDERS, { onConflict: 'order_id' });
  if (ordErr) console.warn('Orders error:', ordErr.message);
  else console.log(`✓ ${INITIAL_ORDERS.length} Orders seeded`);

  // 4. Seed Reviews
  console.log('4. Seeding reviews...');
  const { error: revErr } = await supabase.from('reviews').upsert(INITIAL_REVIEWS, { onConflict: 'review_id' });
  if (revErr) console.warn('Reviews error:', revErr.message);
  else console.log(`✓ ${INITIAL_REVIEWS.length} Reviews seeded`);

  // 5. Seed Users
  console.log('5. Seeding users...');
  const { error: usrErr } = await supabase.from('users').upsert(INITIAL_REGISTERED_USERS, { onConflict: 'user_id' });
  if (usrErr) console.warn('Users error:', usrErr.message);
  else console.log(`✓ ${INITIAL_REGISTERED_USERS.length} Registered Users seeded`);

  console.log('\nAll initial VÍNEA Luxury Cellar records seeded successfully to Supabase!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
