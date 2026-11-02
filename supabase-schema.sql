-- ==============================================================================
-- VÍNEA Cellars - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- ==============================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  product_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT,
  vintage TEXT,
  region TEXT,
  country TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  tasting_notes TEXT,
  alcohol_percentage TEXT,
  bottle_size TEXT DEFAULT '750ml',
  image TEXT,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  food_pairing TEXT,
  collector_note TEXT,
  featured BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  category_id TEXT PRIMARY KEY,
  category_name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  image TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  order_id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  delivery_address JSONB,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Processing',
  payment_method TEXT,
  order_date TEXT,
  tracking_number TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  review_id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  rating NUMERIC(2, 1) NOT NULL,
  comment TEXT,
  review_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Users / Profiles Table
CREATE TABLE IF NOT EXISTS public.users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT,
  role TEXT DEFAULT 'customer',
  avatar TEXT,
  membership_tier TEXT DEFAULT 'Connoisseur',
  member_since TEXT,
  date_of_birth TEXT,
  favorite_davao_branch TEXT,
  preferred_wine_types JSONB,
  flavor_preference TEXT,
  delivery_instructions TEXT,
  saved_addresses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- Public read access for shop items; authenticated updates
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read of products and categories
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);

-- Allow public / anon insertions (orders, reviews, new users)
CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow anon insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anon update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow all modifications on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all modifications on categories" ON public.categories FOR ALL USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
