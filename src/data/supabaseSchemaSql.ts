// Auto-generated self-contained Supabase schema export
export const schemaSql = String.raw`-- ==============================================================================
-- VÍNEA Cellars - Complete Supabase Database Schema & Seed Data
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Safe to re-run multiple times (idempotent, uses ON CONFLICT DO UPDATE).
-- ==============================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  product_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  winery TEXT,
  category TEXT,
  category_id TEXT,
  vintage INTEGER,
  region TEXT,
  country TEXT,
  wine_type TEXT,
  grape_variety TEXT,
  alcohol_percentage NUMERIC(4, 1),
  sweetness TEXT,
  body TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  tasting_notes JSONB,
  bottle_size TEXT DEFAULT '750ml',
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  bottle_color TEXT,
  accent_color TEXT,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  food_pairings JSONB,
  serving_temp TEXT,
  decanting TEXT,
  featured BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe migrations if products table already exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS winery TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vintage INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wine_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS grape_variety TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS alcohol_percentage NUMERIC(4, 1);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sweetness TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tasting_notes JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bottle_size TEXT DEFAULT '750ml';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bottle_color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS accent_color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 1) DEFAULT 5.0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS food_pairings JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS serving_temp TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS decanting TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge TEXT;

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

-- Safe migrations for categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS item_count INTEGER DEFAULT 0;

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
  shipping NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  discount_code TEXT,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'Processing',
  payment_method TEXT,
  order_date TEXT,
  estimated_delivery TEXT,
  tracking_number TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe migrations for orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  review_id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  comment TEXT,
  review_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe migrations for reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1);
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS review_date TEXT;

-- 5. Users Table
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
  loyalty_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  redeemed_perks JSONB DEFAULT '[]'::jsonb,
  rewards_history JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe migrations for users (ensures existing tables get all columns)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'Connoisseur';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS member_since TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS favorite_davao_branch TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_wine_types JSONB;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS flavor_preference TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS saved_addresses JSONB;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS lifetime_points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS redeemed_perks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS rewards_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wishlist JSONB DEFAULT '[]'::jsonb;

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  email TEXT PRIMARY KEY,
  source TEXT DEFAULT 'storefront_footer',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Sommelier Inquiries & Tasting Reservations Table
CREATE TABLE IF NOT EXISTS public.sommelier_inquiries (
  inquiry_id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT DEFAULT 'Sommelier Tasting Flight',
  preferred_date TEXT,
  preferred_branch TEXT DEFAULT 'Azuela Cove Flagship (Davao)',
  guest_count INTEGER DEFAULT 2,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Customer Wishlists Table (Cross-Device Cloud Sync)
CREATE TABLE IF NOT EXISTS public.wishlists (
  user_id TEXT PRIMARY KEY,
  items JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Davao City Physical Cellar Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
  branch_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  landmark TEXT,
  phone TEXT,
  operating_hours TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  is_flagship BOOLEAN DEFAULT false,
  map_coordinates TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe migrations for branches
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS is_flagship BOOLEAN DEFAULT false;
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS map_coordinates TEXT;

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- Public read & write permissions for client-side catalog & checkout
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Products
DROP POLICY IF EXISTS "Public products viewable by everyone" ON public.products;
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all modifications on products" ON public.products;
CREATE POLICY "Allow all modifications on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Categories
DROP POLICY IF EXISTS "Public categories viewable by everyone" ON public.categories;
CREATE POLICY "Public categories viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all modifications on categories" ON public.categories;
CREATE POLICY "Allow all modifications on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Orders
DROP POLICY IF EXISTS "Allow anon select orders" ON public.orders;
CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert orders" ON public.orders;
CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update orders" ON public.orders;
CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE USING (true);

-- Reviews
DROP POLICY IF EXISTS "Public reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Public reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert reviews" ON public.reviews;
CREATE POLICY "Allow anon insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Users
DROP POLICY IF EXISTS "Allow anon select users" ON public.users;
CREATE POLICY "Allow anon select users" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON public.users;
CREATE POLICY "Allow anon insert users" ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update users" ON public.users;
CREATE POLICY "Allow anon update users" ON public.users FOR UPDATE USING (true);

-- Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow anon select newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon insert newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow anon insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Sommelier Inquiries
ALTER TABLE public.sommelier_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select inquiries" ON public.sommelier_inquiries;
CREATE POLICY "Allow anon select inquiries" ON public.sommelier_inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon insert inquiries" ON public.sommelier_inquiries;
CREATE POLICY "Allow anon insert inquiries" ON public.sommelier_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon update inquiries" ON public.sommelier_inquiries;
CREATE POLICY "Allow anon update inquiries" ON public.sommelier_inquiries FOR UPDATE USING (true);

-- Wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select wishlists" ON public.wishlists;
CREATE POLICY "Allow anon select wishlists" ON public.wishlists FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon insert wishlists" ON public.wishlists;
CREATE POLICY "Allow anon insert wishlists" ON public.wishlists FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon update wishlists" ON public.wishlists;
CREATE POLICY "Allow anon update wishlists" ON public.wishlists FOR UPDATE USING (true);

-- Davao Branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public branches viewable by everyone" ON public.branches;
CREATE POLICY "Public branches viewable by everyone" ON public.branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modifications on branches" ON public.branches;
CREATE POLICY "Allow all modifications on branches" ON public.branches FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA: Categories
-- ==============================================================================
INSERT INTO public.categories (category_id, category_name, slug, description, image, item_count)
VALUES
  ('cat-red', 'Red Wine', 'red', 'Full-bodied Cabernets, velvety Pinot Noirs, and bold historic terroirs with complex aromatics.', '/images/category_red_wine_curated.jpg', 5),
  ('cat-white', 'White Wine', 'white', 'Crisp Chardonnays, vibrant Sauvignon Blancs, and mineral-driven Rieslings from cool climate vineyards.', '/images/category_white_wine_curated.jpg', 3),
  ('cat-rose', 'Rosé', 'rose', 'Sun-drenched Mediterranean pale pinks offering fresh red berries, delicate minerality, and crisp acidity.', '/images/category_rose_wine_curated.jpg', 2),
  ('cat-sparkling', 'Sparkling Wine', 'sparkling', 'Traditional method Champagne, artisanal Prosecco, and sparkling vintages with persistent fine mousse.', '/images/category_sparkling_wine_curated.jpg', 2),
  ('cat-collections', 'Premium Collections', 'collections', 'Curated cellared selections, library vintages, and rare single-vineyard allocations.', '/images/category_collections_vault_curated.jpg', 2),
  ('cat-gifts', 'Gift Sets', 'gift-sets', 'Artisan handcrafted wooden cases, sommelier glassware sets, and celebratory presentation sets.', '/images/category_gift_sets_curated.jpg', 2)
ON CONFLICT (category_id) DO UPDATE SET
  category_name = EXCLUDED.category_name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  item_count = EXCLUDED.item_count;

-- ==============================================================================
-- INITIAL SEED DATA: 5 Davao City Physical Cellar Branches
-- ==============================================================================
INSERT INTO public.branches (
  branch_id, name, district, address, landmark, phone, operating_hours,
  features, image, is_flagship, map_coordinates
) VALUES
(
  'branch-lanang-flagship',
  'VÍNEA Flagship Cellar & Tasting Lounge',
  'Lanang / North Davao',
  'G/F Premier Wing, J.P. Laurel Avenue, Lanang, Davao City, 8000',
  'Across from Lanang Business Park, beside Grand Regal',
  '(082) 238-8921 / +63 917 842 1920',
  'Monday – Sunday: 10:00 AM – 11:30 PM',
  '["Walk-In Subterranean Vault (13°C)", "Master Sommelier Private Tasting Room", "Artisan Charcuterie & Cheese Pairing Bar", "Temperature-Controlled Bottle Storage Lockers", "Curated Corporate & VIP Gift Concierge"]'::jsonb,
  '/images/branch_lanang_flagship.jpg',
  true,
  '7.1032, 125.6421'
),
(
  'branch-abreeza',
  'VÍNEA Cellar & Wine Bar — Abreeza',
  'Bajada / Central District',
  'Level 2, Restaurant Row, Abreeza Mall, J.P. Laurel Ave, Bajada, Davao City, 8000',
  'Near the Garden Walk & Open-Air Courtyard',
  '(082) 321-4560 / +63 917 520 8831',
  'Monday – Sunday: 11:00 AM – 10:00 PM',
  '["Italian Enomatic Wine Tasting Dispensers", "Coravin Preserved Rare By-The-Glass Program", "Spanish Tapas & Jamón Ibérico Pairing", "Express Chilled Pick-Up for Online Orders"]'::jsonb,
  '/images/branch_abreeza_wine_bar.jpg',
  false,
  '7.0911, 125.6178'
),
(
  'branch-matina',
  'VÍNEA Reserve Vault & Cellar — Matina',
  'Matina / South Davao',
  'Unit 104, The Veranda Complex, McArthur Highway, Matina, Davao City, 8000',
  'Near Ateneo de Davao Matina Campus & Tulip Drive',
  '(082) 297-6411 / +63 917 312 9044',
  'Tuesday – Sunday: 1:00 PM – 11:00 PM',
  '["Collector Cellar Advisory Consultation", "Private Bordeaux & Burgundy Locker Storage", "South Davao Chilled Van Dispatch Hub", "Boutique Artisan Glassware & Decanter Shop"]'::jsonb,
  '/images/branch_matina_reserve.jpg',
  false,
  '7.0544, 125.5862'
),
(
  'branch-azuela',
  'VÍNEA Waterfront Cellar & Terrace — Azuela Cove',
  'Azuela Cove / Lanang Seaside',
  'The Boardwalk at Azuela Cove, R. Castillo St, Lanang, Davao City, 8000',
  'Overlooking the Davao Gulf & Samal Island horizon',
  '(082) 285-1900 / +63 917 609 4322',
  'Wednesday – Monday: 3:00 PM – 12:00 MN',
  '["Seaside Sunset Rosé & Champagne Flights", "Al Fresco Oceanfront Wine Deck", "Live Acoustic Jazz & Sommelier Salons", "Yacht & Island Cruise Provisioning Service"]'::jsonb,
  '/images/branch_azuela_waterfront.jpg',
  false,
  '7.1089, 125.6543'
),
(
  'branch-ecoland',
  'VÍNEA Boutique Tasting Cellar — Ecoland',
  'Ecoland / Quimpo Boulevard',
  'G/F The Annex, Quimpo Boulevard, Ecoland, Davao City, 8000',
  'Adjacent to SM City Davao Annex & John Paul College',
  '(082) 299-8833 / +63 917 441 7719',
  'Monday – Saturday: 12:00 NN – 10:30 PM',
  '["Everyday Fine Wine Selections under ₱3,000", "Express 60-Minute Delivery Dispatch for South Davao", "Gift Packaging & Hand-Engraved Wooden Boxes", "Weekly Free Public Cellar Tasting Flights"]'::jsonb,
  '/images/branch_sm_lanang_boutique.jpg',
  false,
  '7.0498, 125.5912'
)
ON CONFLICT (branch_id) DO UPDATE SET
  name = EXCLUDED.name,
  district = EXCLUDED.district,
  address = EXCLUDED.address,
  landmark = EXCLUDED.landmark,
  phone = EXCLUDED.phone,
  operating_hours = EXCLUDED.operating_hours,
  features = EXCLUDED.features,
  image = EXCLUDED.image,
  is_flagship = EXCLUDED.is_flagship,
  map_coordinates = EXCLUDED.map_coordinates;

-- ==============================================================================
-- INITIAL SEED DATA: All 32 Luxury Wine Products
-- ==============================================================================
INSERT INTO public.products (
  product_id, name, winery, category, category_id, vintage, region, country, wine_type,
  grape_variety, alcohol_percentage, sweetness, body, price, original_price, stock,
  description, tasting_notes, bottle_size, image, images, bottle_color, accent_color,
  rating, reviews_count, food_pairings, serving_temp, decanting, featured
) VALUES
(
  'prod-001',
  'Château Lumière Cabernet Sauvignon',
  'Château Lumière',
  'cat-red',
  'cat-red',
  2021,
  'Bordeaux',
  'France',
  'Red',
  'Cabernet Sauvignon',
  14,
  'Dry',
  'Full',
  7950.00,
  8950.00,
  24,
  'An exceptional Left Bank blend dominated by concentrated cassis, French oak cedar, cigar box, and refined powdery tannins. Cellared in toasted Allier oak barrels for 20 months.',
  '{"aroma":["Ripe Blackberry","Blackcurrant","Cedarwood","Dark Truffle"],"palate":"Opulent layers of dense black cherry, graphite minerality, and cocoa nibs with impeccably structured tannins.","finish":"Long, persistent finish lingering with toasted spices and subtle vanilla bean."}'::jsonb,
  '750ml',
  '/images/product_chateau_lumiere_cabernet.jpg',
  '["/images/region_bordeaux_chateau.jpg","/images/wine_pouring_crystal_glass_1793460097087.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#440e18',
  '#d4af37',
  4.9,
  38,
  '["Dry-Aged Ribeye","Roasted Duck Breast","Aged Comté Cheese","Venison Tenderloin"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 60 minutes before serving',
  true
),
(
  'prod-002',
  'Villa Rosé Provençal',
  'Villa Rosé Estates',
  'cat-rose',
  'cat-rose',
  2024,
  'Provence',
  'France',
  'Rosé',
  'Grenache & Cinsault',
  12.5,
  'Bone Dry',
  'Light',
  2650.00,
  NULL,
  42,
  'Pale salmon hue hailing from coastal Saint-Tropez limestone soils. Expressive wild strawberries, white peach, hints of lavender, and a crisp saline breeze finish.',
  '{"aroma":["Wild Strawberry","Crushed Melon","White Peach","Provence Herbs"],"palate":"Crisp, bone-dry palate with citrus zest brightness, pink grapefruit, and wet stone minerality.","finish":"Clean, refreshing saline lift with a delicate floral blossom tail."}'::jsonb,
  '750ml',
  '/images/product_villa_rose_provencal.jpg',
  '["/images/category_rose_wine_curated.jpg","/images/pairing_oysters_and_caviar.jpg"]'::jsonb,
  '#9e3f52',
  '#f5c6cb',
  4.8,
  24,
  '["Grilled Sea Bass","Heirloom Tomato Tart","Fresh Oysters","Goat Cheese Crostini"]'::jsonb,
  '8–10°C (46–50°F)',
  'Serve chilled, no decanting needed',
  true
),
(
  'prod-003',
  'Monteverde Pinot Noir',
  'Tenuta Monteverde',
  'cat-red',
  'cat-red',
  2022,
  'Veneto',
  'Italy',
  'Red',
  'Pinot Noir',
  13.5,
  'Dry',
  'Medium',
  4850.00,
  NULL,
  18,
  'Crafted on the high-elevation volcanic hillside terraces of Veneto. Translucent ruby with seductive notes of wild cherries, forest floor, clove, and ethereal violet petals.',
  '{"aroma":["Red Cherry","Raspberry Coulis","Forest Floor","Violet Blossom"],"palate":"Silky, medium-bodied texture with lively red fruit acidity, tea leaf tannins, and subtle spice.","finish":"Harmonious and graceful with savory dried herbs and lingering wild cherry."}'::jsonb,
  '750ml',
  '/images/product_monteverde_pinot_noir.jpg',
  '["/images/region_burgundy_slopes.jpg","/images/wine_pouring_crystal_glass_1793460097087.jpg"]'::jsonb,
  '#5e1927',
  '#dfbe76',
  4.7,
  19,
  '["Roast Quail","Wild Mushroom Risotto","Herb-Crusted Salmon","Peking Duck"]'::jsonb,
  '14–16°C (57–61°F)',
  'Decant for 30 minutes',
  true
),
(
  'prod-004',
  'Maison Étoile Chardonnay',
  'Maison Étoile',
  'cat-white',
  'cat-white',
  2023,
  'Burgundy',
  'France',
  'White',
  'Chardonnay',
  13,
  'Dry',
  'Medium',
  6050.00,
  NULL,
  15,
  'Classic Côte de Beaune poise. Glistening pale gold exhibiting ripe lemon curd, toasted brioche, flinty chalk minerality, and an unctuous creamy texture balanced by taut acidity.',
  '{"aroma":["Meyer Lemon","Brioche","White Blossom","Crushed Flint"],"palate":"Elegant creamy richness framed by crystalline citrus acidity, hazelnut, and salted butter notes.","finish":"Long, vibrating chalky mineral finish with gentle smoky undertones."}'::jsonb,
  '750ml',
  '/images/product_maison_etoile_chardonnay.jpg',
  '["/images/pairing_seared_scallops_lobster.jpg","/images/category_white_wine_curated.jpg"]'::jsonb,
  '#82652b',
  '#e6ca65',
  4.9,
  31,
  '["Lobster Thermidor","Pan-Seared Scallops","Roasted Turbot","Poulet de Bresse"]'::jsonb,
  '10–12°C (50–54°F)',
  'Aerator or 15 minutes aeration',
  true
),
(
  'prod-005',
  'Domaine de la Reine Brut Grand Cru',
  'Domaine de la Reine',
  'cat-sparkling',
  'cat-sparkling',
  2018,
  'Champagne',
  'France',
  'Sparkling',
  'Chardonnay & Pinot Noir',
  12,
  'Dry',
  'Medium',
  10200.00,
  NULL,
  9,
  'A prestige cuvée aged 6 years on the lees in ancient Gallo-Roman chalk cellars. Tiny persistent bead with pastry aromas, golden apple, roasted almond, and saline precision.',
  '{"aroma":["Brioche","Golden Reinette Apple","Toasted Almond","Chalk Smoke"],"palate":"Silky, fine mousse with exhilarating tension, yellow mirabelle plum, and candied citrus peel.","finish":"Expansive, mineral-drenched, deeply satisfying celebratory finish."}'::jsonb,
  '750ml',
  '/images/product_domaine_reine_champagne.jpg',
  '["/images/region_champagne_france.jpg","/images/pairing_oysters_and_caviar.jpg"]'::jsonb,
  '#324a29',
  '#f0d27c',
  5.0,
  44,
  '["Caviar on Blinis","Langoustines","Black Truffle Pasta","Aged Parmigiano Reggiano"]'::jsonb,
  '8–10°C (46–50°F)',
  'Serve immediately in tulip flutes',
  true
),
(
  'prod-006',
  'Tenuta di San Pietro Brunello di Montalcino',
  'Tenuta di San Pietro',
  'cat-red',
  'cat-red',
  2019,
  'Tuscany',
  'Italy',
  'Red',
  'Sangiovese Grosso',
  14.5,
  'Dry',
  'Full',
  7450.00,
  NULL,
  12,
  'Grown on sun-drenched Tuscan slopes 450 meters above sea level. Matured 36 months in Slavonian oak casks. Deep garnet with dried oregano, leather, macerated cherries, and balsamic lift.',
  '{"aroma":["Macerated Cherry","Tuscan Leather","Dried Rosemary","Tobacco Leaf"],"palate":"Firm, muscular structure with ripe gripping tannins, blood orange zest, and spiced plum.","finish":"Remarkably persistent finish carried by savory earth and noble wood."}'::jsonb,
  '750ml',
  '/images/product_san_pietro_brunello.jpg',
  '["/images/region_tuscany_hills.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#420b13',
  '#c5a059',
  4.8,
  27,
  '["Bistecca alla Fiorentina","Slow-Braised Osso Buco","Wild Boar Ragù","Pecorino Toscano"]'::jsonb,
  '18°C (64°F)',
  'Decant for 90 minutes',
  false
),
(
  'prod-007',
  'Cloud Valley Sauvignon Blanc',
  'Cloud Valley Vintners',
  'cat-white',
  'cat-white',
  2023,
  'Marlborough',
  'New Zealand',
  'White',
  'Sauvignon Blanc',
  13,
  'Dry',
  'Light',
  2350.00,
  NULL,
  35,
  'Intensely aromatic Marlborough benchmark. Passionfruit, crushed lemongrass, lime cordial, and wet river stones with a thrilling, mouth-watering zesty acidity.',
  '{"aroma":["Passionfruit","Lemongrass","Crushed Basil","Grapefruit"],"palate":"Vibrant, electric palate with explosive tropical citrus flavors and crunchy green apple.","finish":"Taut, mouthwatering lime and sea salt finish."}'::jsonb,
  '750ml',
  '/images/product_cloud_valley_sauvignon.jpg',
  '["/images/region_marlborough_nz.jpg","/images/pairing_oysters_and_caviar.jpg"]'::jsonb,
  '#55694a',
  '#7bc991',
  4.6,
  22,
  '["Goat Cheese Salad","Green Lip Mussels","Ceviche","Thai Spiced Prawns"]'::jsonb,
  '7–9°C (45–48°F)',
  'Chill thoroughly, no decanting needed',
  false
),
(
  'prod-008',
  'Bodega Solaria Gran Reserva',
  'Bodega Solaria',
  'cat-red',
  'cat-red',
  2018,
  'Rioja',
  'Spain',
  'Red',
  'Tempranillo & Graciano',
  14,
  'Dry',
  'Full',
  5250.00,
  NULL,
  20,
  'A traditional masterpiece aged 24 months in American oak followed by 36 months in bottle. Sweet dill, dried fig, cloves, coconut husk, and velvety softened tannins.',
  '{"aroma":["Dried Fig","American Vanilla","Clove","Leather Saddle"],"palate":"Silky, rounded mouthfeel with resolved tertiary fruit, roasted spices, and dark cherry liqueur.","finish":"Warm, comforting finish with lingering cocoa and sweet tobacco."}'::jsonb,
  '750ml',
  '/images/product_bodega_solaria_rioja.jpg',
  '["/images/region_rioja_spain.jpg","/images/pairing_artisanal_charcuterie.jpg"]'::jsonb,
  '#3d0a11',
  '#e0a96d',
  4.8,
  35,
  '["Roast Suckling Lamb","Jamón Ibérico de Bellota","Manchego Cheese","Braised Beef Cheeks"]'::jsonb,
  '17–19°C (62–66°F)',
  'Decant for 45 minutes',
  false
),
(
  'prod-009',
  'St. Helena Reserve Cabernet',
  'St. Helena Cellars',
  'cat-red',
  'cat-red',
  2020,
  'Napa Valley',
  'USA',
  'Red',
  'Cabernet Sauvignon',
  14.8,
  'Dry',
  'Full',
  11550.00,
  NULL,
  8,
  'Iconic valley floor and benchland fruit. Deep impenetrable ink-purple. Saturated blackberry compote, mocha, French oak spice, and plush, seamless velvet tannins.',
  '{"aroma":["Blackberry Compote","Espresso Bean","Cassis","Cinnamon Bark"],"palate":"Monumental weight and richness with layers of decadent blue fruits, melted dark chocolate, and sweet cedar.","finish":"Monumental 60-second finish with cashmere tannins and warm berry core."}'::jsonb,
  '750ml',
  '/images/product_st_helena_napa_cabernet.jpg',
  '["/images/region_napa_valley.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#2e080e',
  '#c5a059',
  4.9,
  52,
  '["Prime Tomahawk Steak","Smoked Beef Short Ribs","Charred Lamb Chops","Truffle Macaroni"]'::jsonb,
  '18°C (64°F)',
  'Decant for 75 minutes',
  true
),
(
  'prod-010',
  'Schloss Johannisberg Riesling Feinherb',
  'Schloss Johannisberg',
  'cat-white',
  'cat-white',
  2022,
  'Rheingau',
  'Germany',
  'White',
  'Riesling',
  11.5,
  'Semi-Dry',
  'Light',
  3550.00,
  NULL,
  16,
  'Steep slate slopes overlooking the Rhine river. Ethereal tension between natural sweetness and electric racy acidity. White peach, petrol nuances, and wet slate stone.',
  '{"aroma":["White Peach","Jasmine Flower","Flint Slate","Lime Blossom"],"palate":"Dancing interplay of juicy apricot, honeysuckle sweetness, and cutting mineral acidity.","finish":"Vibrant, crystal-clear finish that stimulates every tastebud."}'::jsonb,
  '750ml',
  '/images/product_schloss_johannisberg_riesling.jpg',
  '["/images/pairing_artisanal_charcuterie.jpg","/images/category_white_wine_curated.jpg"]'::jsonb,
  '#495a32',
  '#d4af37',
  4.7,
  18,
  '["Spicy Szechuan Pork","Duck Liver Pâté","Crab Cakes with Remoulade","Roast Goose"]'::jsonb,
  '8–10°C (46–50°F)',
  'Serve chilled',
  false
),
(
  'prod-011',
  'Valdobbiadene Prosecco Superiore DOCG',
  'Boutique Perla',
  'cat-sparkling',
  'cat-sparkling',
  2023,
  'Veneto',
  'Italy',
  'Sparkling',
  'Glera',
  11,
  'Dry',
  'Light',
  1980.00,
  NULL,
  30,
  'Hand-picked from the UNESCO World Heritage steep hills of Valdobbiadene. Fresh green apple, acacia honey aromas, and an uplifting creamy foam.',
  '{"aroma":["Golden Delicious Apple","Acacia Flowers","Williams Pear","Lemon Verbena"],"palate":"Delicate, froth-like effervescence with succulent pear and refreshing citrus balance.","finish":"Crisp, appetizing, and celebratory."}'::jsonb,
  '750ml',
  '/images/product_valdobbiadene_prosecco.jpg',
  '["/images/category_sparkling_wine_curated.jpg","/images/pairing_artisanal_charcuterie.jpg"]'::jsonb,
  '#28402b',
  '#c5a059',
  4.6,
  28,
  '["Prosciutto di San Daniele","Arancini","Light Canapés","Seafood Antipasti"]'::jsonb,
  '6–8°C (42–46°F)',
  'Serve cold in sparkling flutes',
  false
),
(
  'prod-012',
  'Grand Terroirs of France Trio (Gift Box)',
  'VÍNEA Sommelier Curation',
  'cat-collections',
  'cat-collections',
  2021,
  'Bordeaux, Burgundy, Champagne',
  'France',
  'Red',
  'Cabernet, Chardonnay, Pinot Noir',
  13.5,
  'Dry',
  'Full',
  21750.00,
  24200.00,
  7,
  'A prestige handcrafted wooden collector case housing 3 iconic expressions: Left Bank Bordeaux, Côte d’Or Premier Cru Chardonnay, and Vintage Grand Cru Champagne.',
  '{"aroma":["Truffle","Cassis","Brioche","White Peach"],"palate":"A curated journey across the three greatest wine terroirs of France in pristine cellar condition.","finish":"Unforgettable cellar-worthy experience."}'::jsonb,
  '750ml',
  '/images/product_grand_terroirs_gift_box.jpg',
  '["/images/category_collections_vault_curated.jpg","/images/category_gift_sets_curated.jpg"]'::jsonb,
  '#260a10',
  '#dfbe76',
  5.0,
  14,
  '["Multi-Course Tasting Menu","Holiday Celebrations","Executive Gifting"]'::jsonb,
  'Assorted (see enclosed sommelier cards)',
  'Individual instructions enclosed',
  true
),
(
  'prod-013',
  'Château Margaux Premier Grand Cru Classé',
  'Château Margaux',
  'cat-red',
  'cat-red',
  2015,
  'Margaux, Bordeaux',
  'France',
  'Red',
  '87% Cabernet Sauvignon, 8% Merlot, 3% Cabernet Franc, 2% Petit Verdot',
  13.5,
  'Dry',
  'Full',
  68500.00,
  74000.00,
  3,
  'An ethereal Premier Grand Cru blending profound violet perfume, silky cassis, crushed graphite, and seamless fine-grained tannins aged in 100% new French oak for 22 months.',
  '{"aroma":["Crushed Violets","Blackcurrant Compote","French Cedar","Cuban Cigar Box"],"palate":"Silky, aristocratic velvet texture with immense purity of black fruit and aristocratic poise.","finish":"Extremely long, echoing with graphite minerality and dark cocoa for minutes."}'::jsonb,
  '750ml',
  '/images/product_chateau_lumiere_cabernet.jpg',
  '["/images/region_bordeaux_chateau.jpg","/images/sommelier_reserve_bottle_1793457418720.jpg"]'::jsonb,
  '#380a13',
  '#dfbe76',
  5.0,
  29,
  '["Prime Wagyu Tenderloin","Roasted Squab with Truffles","Aged Comté 36-Month"]'::jsonb,
  '17–18°C (62–64°F)',
  'Decant for 90 minutes before tasting',
  true
),
(
  'prod-014',
  'Tenuta San Guido Sassicaia Bolgheri',
  'Tenuta San Guido',
  'cat-red',
  'cat-red',
  2019,
  'Bolgheri, Tuscany',
  'Italy',
  'Red',
  '85% Cabernet Sauvignon, 15% Cabernet Franc',
  14,
  'Dry',
  'Full',
  26800.00,
  29500.00,
  4,
  'The quintessential Super Tuscan benchmark. Pure aristocratic black cherry, wild rosemary, Mediterranean scrub, and finely chiseled mineral tannins with vibrant Tuscan freshness.',
  '{"aroma":["Wild Black Cherry","Rosemary Scrub","Cured Leather","Balsamic Juniper"],"palate":"Taut, tensile Tuscan acidity balancing plush dark plums and fine graphite tannins.","finish":"Sustained, structured finish with marine salinity and toasted walnut."}'::jsonb,
  '750ml',
  '/images/product_san_pietro_brunello.jpg',
  '["/images/region_tuscany_hills.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#420d18',
  '#c9a050',
  4.9,
  42,
  '["Bistecca alla Fiorentina","Wild Boar Ragù Pappardelle","Pecorino di Pienza"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 60 minutes',
  true
),
(
  'prod-015',
  'Dom Pérignon Vintage Brut Prestige',
  'Moët & Chandon / Dom Pérignon',
  'cat-sparkling',
  'cat-sparkling',
  2013,
  'Épernay, Champagne',
  'France',
  'Sparkling',
  'Pinot Noir & Chardonnay',
  12.5,
  'Bone Dry',
  'Medium',
  17800.00,
  NULL,
  2,
  'Luminous vintage champagne radiating roasted hazelnuts, mirabelle plum, crushed oyster shells, and an energetic crystalline salinity that stretches endlessly on the palate.',
  '{"aroma":["Mirabelle Plum","Roasted Hazelnuts","Cardamom Smoke","Toasted Brioche"],"palate":"Crystalline precision with microscopic effervescence, flint minerality, and racy citrus zest.","finish":"Taut, saline, and smoke-tinged persistence."}'::jsonb,
  '750ml',
  '/images/product_domaine_reine_champagne.jpg',
  '["/images/region_champagne_france.jpg","/images/wine_pouring_crystal_glass_1793460097087.jpg"]'::jsonb,
  '#1a1005',
  '#dfbe76',
  4.9,
  53,
  '["Beluga Caviar & Blinis","Butter-Poached Davao Rock Lobster","Seared Sea Scallops"]'::jsonb,
  '9–11°C (48–52°F)',
  'Open 15 minutes before pouring',
  true
),
(
  'prod-016',
  'Egon Müller Scharzhofberger Riesling Kabinett',
  'Weingut Egon Müller',
  'cat-white',
  'cat-white',
  2021,
  'Saar, Mosel',
  'Germany',
  'White',
  '100% Riesling',
  8.5,
  'Semi-Dry',
  'Light',
  14500.00,
  NULL,
  12,
  'From the hallowed blue slate slopes of the Scharzhofberg. Dazzling balance between lime blossom delicacy, white peach, electric slate minerality, and feathery acidity.',
  '{"aroma":["Lime Blossom","White Peach","Slate Shingle","Lemon Verbena"],"palate":"Feathery light yet incredibly concentrated with dancing laser acidity and natural fruit sweetness.","finish":"Intensely stony, mouthwatering, and pristine."}'::jsonb,
  '750ml',
  '/images/product_schloss_johannisberg_riesling.jpg',
  '["/images/category_white_wine_curated.jpg"]'::jsonb,
  '#0e1d14',
  '#e5d7b7',
  4.9,
  18,
  '["Spicy King Crab Legs","Crispy Pork Belly with Apple Sauce","Thai Lemongrass Prawns"]'::jsonb,
  '8–10°C (46–50°F)',
  'Not required, serve chilled',
  false
),
(
  'prod-017',
  'Gaja Barbaresco Riserva DOCG',
  'Gaja Winery',
  'cat-red',
  'cat-red',
  2018,
  'Barbaresco, Piedmont',
  'Italy',
  'Red',
  '100% Nebbiolo',
  14.5,
  'Bone Dry',
  'Full',
  23500.00,
  26000.00,
  3,
  'Angelo Gaja’s flagship Nebbiolo. Scented with dried rose petals, orange peel, white truffles, and tobacco leaf wrapped in austere, aristocratic structure with 30-year cellaring potential.',
  '{"aroma":["Dried Rose Petals","Alba Truffles","Tar","Seville Orange Peel"],"palate":"Gripping, youthful chalky tannins backed by wild red berries, liquorice, and earthy undertones.","finish":"Towering, architectural structure that softens into crushed violets and spice."}'::jsonb,
  '750ml',
  '/images/product_monteverde_pinot_noir.jpg',
  '["/images/region_tuscany_hills.jpg"]'::jsonb,
  '#350912',
  '#d4af37',
  4.8,
  22,
  '["Truffled Risotto","Roasted Rack of Venison","Braised Beef Shank in Nebbiolo"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 2 hours before serving',
  true
),
(
  'prod-018',
  'Opus One Proprietary Red',
  'Opus One Winery',
  'cat-red',
  'cat-red',
  2019,
  'Oakville, Napa Valley',
  'USA',
  'Red',
  '78% Cabernet Sauvignon, 8% Merlot, 6% Petit Verdot, 6% Cabernet Franc, 2% Malbec',
  14.5,
  'Dry',
  'Full',
  34900.00,
  38000.00,
  1,
  'The historic joint venture between Baron Philippe de Rothschild and Robert Mondavi. Silky cassis, dark mocha, pencil lead, and broad, polished velvet tannins that glide across the palate.',
  '{"aroma":["Crushed Cassis","French Roast Coffee","Black Olives","Vanilla Pod"],"palate":"Opulent layers of black cherry, graphite, and espresso nibs with exceptionally fine tannins.","finish":"Monumental persistence with seamless warm spice."}'::jsonb,
  '750ml',
  '/images/product_st_helena_napa_cabernet.jpg',
  '["/images/region_napa_valley.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#2e070e',
  '#dfbe76',
  5.0,
  67,
  '["Dry-Aged Tomahawk Steak","Roast Leg of Lamb with Garlic & Rosemary","Dark Cocoa Venison"]'::jsonb,
  '17–19°C (62–66°F)',
  'Decant for 75 minutes',
  true
),
(
  'prod-019',
  'Domaine Leflaive Puligny-Montrachet Premier Cru',
  'Domaine Leflaive',
  'cat-white',
  'cat-white',
  2020,
  'Côte de Beaune, Burgundy',
  'France',
  'White',
  '100% Chardonnay',
  13.5,
  'Dry',
  'Medium',
  19800.00,
  NULL,
  8,
  'Biodynamic mastery from Burgundy’s most revered white wine address. Citrus oil, toasted brioche, white truffle, and a profound limestone-driven finish with crystalline acidity.',
  '{"aroma":["Meyer Lemon Curd","Crushed Chalk","Honeysuckle","Fresh Hazelnut"],"palate":"Chiseled minerality married with rich, creamy textures and vibrant citrus tension.","finish":"Pulsing with energy, lime zest, and wet stone minerality."}'::jsonb,
  '750ml',
  '/images/product_maison_etoile_chardonnay.jpg',
  '["/images/region_burgundy_slopes.jpg"]'::jsonb,
  '#151e10',
  '#e5d7b7',
  4.9,
  19,
  '["Turbot with Beurre Blanc","Pan-Roasted Langoustines","Davao Farm Roast Chicken with Herbs"]'::jsonb,
  '11–13°C (52–55°F)',
  'Open 30 minutes prior to serving',
  false
),
(
  'prod-020',
  'Clarendon Hills Astralis Syrah',
  'Clarendon Hills',
  'cat-red',
  'cat-red',
  2017,
  'Blewitt Springs, McLaren Vale',
  'Australia',
  'Red',
  'Old Vine Syrah (1920 Plantings)',
  15,
  'Dry',
  'Full',
  28900.00,
  NULL,
  4,
  'Ungrafted 1920s bush-vine Syrah yielding immense aromatic complexity of smoked meats, star anise, roasted espresso, and colossal yet seamless dark fruit tannins.',
  '{"aroma":["Smoked Meat","Star Anise","Blueberry Coulis","Dark Cocoa"],"palate":"Viscous, full-throttle palate of dense black fruits, cracked black pepper, and polished fine-grain tannins.","finish":"Towering, concentrated finish that coats every corner of the palate."}'::jsonb,
  '750ml',
  '/images/product_bodega_solaria_rioja.jpg',
  '["/images/sommelier_reserve_bottle_1793457418720.jpg"]'::jsonb,
  '#320b12',
  '#d4af37',
  4.8,
  15,
  '["Wood-Fired Ribeye Cap","Slow-Roasted Lamb Shoulder","Smoked Duck Breast"]'::jsonb,
  '17–19°C (62–66°F)',
  'Decant for 90 minutes',
  true
),
(
  'prod-021',
  'Clos Erasmus Priorat DOCa',
  'Clos i Terrasses (Daphne Glorian)',
  'cat-red',
  'cat-red',
  2018,
  'Priorat, Catalunya',
  'Spain',
  'Red',
  '85% Garnacha, 15% Syrah',
  15,
  'Dry',
  'Full',
  21500.00,
  NULL,
  6,
  'From dizzying llicorella slate terraces. Intense wild blueberries, crushed granite, wild mountain herbs, and a majestic velvet texture that coats the palate with Mediterranean warmth.',
  '{"aroma":["Llicorella Slate Dust","Wild Blueberries","Rosemary Oil","Kirsch"],"palate":"Monumental depth with intense mineral spine, licorice, and seamless rounded tannins.","finish":"Warm, savory, slate-dusted finish that endures beautifully."}'::jsonb,
  '750ml',
  '/images/product_bodega_solaria_rioja.jpg',
  '["/images/region_rioja_spain.jpg"]'::jsonb,
  '#330811',
  '#c9a050',
  4.9,
  24,
  '["Charcoal Grilled Lamb Chops","Ibérico Pork Secreto","Aged Manchego Curado"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 60 minutes',
  false
),
(
  'prod-022',
  'Château d’Yquem Premier Cru Supérieur',
  'Château d’Yquem',
  'cat-collections',
  'cat-collections',
  2016,
  'Sauternes, Bordeaux',
  'France',
  'Dessert',
  '75% Sémillon, 25% Sauvignon Blanc',
  14,
  'Sweet',
  'Full',
  38500.00,
  42000.00,
  2,
  'The only Sauternes awarded Premier Cru Supérieur in the 1855 classification. Golden amber hue with candied saffron, dried apricot, honeycomb, and eternal balancing acidity.',
  '{"aroma":["Candied Saffron","Wild Honeycomb","Dried Apricot","Orange Marmalade"],"palate":"Unctuous richness cut through by vibrant botrytis acidity, candied ginger, and vanilla cream.","finish":"Centuries-worthy finish lingering on the palate for minutes."}'::jsonb,
  '750ml',
  '/images/product_schloss_johannisberg_riesling.jpg',
  '["/images/category_collections_vault_curated.jpg","/images/sommelier_reserve_bottle_1793457418720.jpg"]'::jsonb,
  '#281c06',
  '#dfbe76',
  5.0,
  36,
  '["Seared Foie Gras with Brioche","Roquefort Blue Cheese","Crème Brûlée with Madagascar Vanilla"]'::jsonb,
  '10–12°C (50–54°F)',
  'Uncork 30 minutes before serving',
  true
),
(
  'prod-023',
  'Château Cheval Blanc Premier Grand Cru Classé A',
  'Château Cheval Blanc',
  'cat-red',
  'cat-red',
  2016,
  'Saint-Émilion, Bordeaux',
  'France',
  'Red',
  '58% Cabernet Franc, 38% Merlot, 4% Cabernet Sauvignon',
  14,
  'Dry',
  'Full',
  78500.00,
  84000.00,
  2,
  'The pinnacle of Right Bank Bordeaux. An extraordinary fusion of crushed black raspberries, Turkish rose petals, dark graphite, and silken cashmere tannins.',
  '{"aroma":["Black Raspberries","Turkish Rose","Cranberry Confit","Graphite Shavings"],"palate":"Profound architectural harmony with velvety mouthfeel and cool mineral freshness.","finish":"Sustained, noble persistence extending for minutes."}'::jsonb,
  '750ml',
  '/images/product_chateau_lumiere_cabernet.jpg',
  '["/images/region_bordeaux_chateau.jpg","/images/sommelier_reserve_bottle_1793457418720.jpg"]'::jsonb,
  '#380a14',
  '#dfbe76',
  5.0,
  31,
  '["Roast Duck Breast with Cherry Glaze","Wagyu Ribeye Cap","Aged Comté"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 90 minutes before serving',
  true
),
(
  'prod-024',
  'Marchesi Antinori Tignanello Toscana IGT',
  'Marchesi Antinori',
  'cat-red',
  'cat-red',
  2020,
  'Tuscany',
  'Italy',
  'Red',
  '80% Sangiovese, 15% Cabernet Sauvignon, 5% Cabernet Franc',
  14,
  'Dry',
  'Full',
  16800.00,
  18500.00,
  8,
  'The trailblazing Super Tuscan aged in French barriques. Ripe red plums, licorice root, roasted espresso bean, and chiseled Mediterranean tannins.',
  '{"aroma":["Ripe Red Plums","Licorice Root","Espresso Cream","Mediterranean Thyme"],"palate":"Supple, taut texture with lively Sangiovese acidity cutting through opulent dark fruit.","finish":"Spicy, mineral-driven finish."}'::jsonb,
  '750ml',
  '/images/product_san_pietro_brunello.jpg',
  '["/images/region_tuscany_hills.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#3d0d17',
  '#dfbe76',
  4.9,
  47,
  '["Truffled Pappardelle","Grilled Florentine T-Bone Steak","Parmigiano-Reggiano 30-Month"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 45 minutes',
  true
),
(
  'prod-025',
  'Krug Grande Cuvée 170ème Édition Brut',
  'Maison Krug',
  'cat-sparkling',
  'cat-sparkling',
  2014,
  'Reims, Champagne',
  'France',
  'Sparkling',
  '51% Pinot Noir, 38% Chardonnay, 11% Meunier',
  12.5,
  'Bone Dry',
  'Full',
  21500.00,
  23900.00,
  3,
  'The archetype of Haute Champagne prestige. A breathtaking blend of 195 wines from 12 vintages, resting over 7 years on lees for hazelnut, nougat, and gingerbread complexity.',
  '{"aroma":["Toasted Brioche","Roasted Hazelnuts","Nougat","Candied Citrus"],"palate":"Explosive, creamy effervescence with vibrant lemon curd and chalky limestone tension.","finish":"Infinitely broad, dry, and aristocratic."}'::jsonb,
  '750ml',
  '/images/product_domaine_reine_champagne.jpg',
  '["/images/region_champagne_france.jpg","/images/wine_pouring_crystal_glass_1793460097087.jpg"]'::jsonb,
  '#1c1206',
  '#dfbe76',
  5.0,
  38,
  '["Gillardeau Oysters","Ibérico Bellota Ham","Pan-Seared Davao White Sea Bass"]'::jsonb,
  '9–11°C (48–52°F)',
  'Open 15 minutes before pouring',
  true
),
(
  'prod-026',
  'Domaine Dujac Clos de la Roche Grand Cru',
  'Domaine Dujac',
  'cat-red',
  'cat-red',
  2019,
  'Morey-Saint-Denis, Burgundy',
  'France',
  'Red',
  '100% Pinot Noir',
  13.5,
  'Dry',
  'Medium',
  62000.00,
  68000.00,
  2,
  'Mythic Grand Cru Pinot Noir crafted with whole-cluster fermentation. Exquisite wild strawberries, sous-bois forest floor, blood orange, and weightless power.',
  '{"aroma":["Wild Strawberries","Sous-Bois Forest Floor","Peony Blossoms","Blood Orange"],"palate":"Ethereal, floating texture with intense internal energy and lace-like mineral tannins.","finish":"Symphonic finish with lingering crushed stones and rose hip."}'::jsonb,
  '750ml',
  '/images/product_monteverde_pinot_noir.jpg',
  '["/images/region_burgundy_slopes.jpg","/images/sommelier_reserve_bottle_1793457418720.jpg"]'::jsonb,
  '#2d0811',
  '#dfbe76',
  5.0,
  19,
  '["Slow-Roasted Pigeon","Burgundian Beef Bourguignon","Truffled Brie de Meaux"]'::jsonb,
  '15–16°C (59–61°F)',
  'Decant for 60 minutes',
  true
),
(
  'prod-027',
  'Vega Sicilia Único Ribera del Duero',
  'Bodegas Vega Sicilia',
  'cat-red',
  'cat-red',
  2012,
  'Ribera del Duero',
  'Spain',
  'Red',
  '95% Tinto Fino (Tempranillo), 5% Cabernet Sauvignon',
  14.5,
  'Dry',
  'Full',
  34500.00,
  38000.00,
  3,
  'Spain’s most legendary benchmark wine, aged for 10 full years in wood and bottle before release. Black fig, tobacco leaf, roasted cedar, and timeless velvet structure.',
  '{"aroma":["Black Fig","Sweet Havana Cigar","Cedar Wood","Crushed Damson Plum"],"palate":"Monumental weight delivered with astonishing freshness and aristocratic Spanish polish.","finish":"Profound savory leather and dark cacao persistence."}'::jsonb,
  '750ml',
  '/images/product_bodega_solaria_rioja.jpg',
  '["/images/region_rioja_spain.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#380a12',
  '#dfbe76',
  4.9,
  33,
  '["Roast Suckling Pig (Cochinillo)","Prime Ribeye with Truffle Butter","Queso Manchego Curado"]'::jsonb,
  '17–18°C (62–64°F)',
  'Decant for 75 minutes',
  true
),
(
  'prod-028',
  'Cloudy Bay Te Koko Sauvignon Blanc',
  'Cloudy Bay Vineyards',
  'cat-white',
  'cat-white',
  2020,
  'Marlborough',
  'New Zealand',
  'White',
  '100% Sauvignon Blanc',
  13.5,
  'Dry',
  'Medium',
  5450.00,
  NULL,
  14,
  'An iconoclastic wild-ferment Sauvignon Blanc aged in French oak barrels. White peach, lime blossom, beeswax, and savory mineral complexity.',
  '{"aroma":["White Nectarine","Lime Blossom","Honeycomb","Roasted Almond"],"palate":"Rich and textural with creamy lees texture balanced by razor-sharp Marlborough acidity.","finish":"Crisp, saline, and smoke-dusted citrus."}'::jsonb,
  '750ml',
  '/images/product_cloud_valley_sauvignon.jpg',
  '["/images/region_marlborough_nz.jpg","/images/pairing_seared_scallops_lobster.jpg"]'::jsonb,
  '#1f2516',
  '#c9a050',
  4.8,
  41,
  '["Pan-Seared Davao Scallops","Lemongrass Salmon Tartare","Goat Cheese Crostini"]'::jsonb,
  '10–12°C (50–54°F)',
  'No decanting required',
  false
),
(
  'prod-029',
  'Penfolds Grange Bin 95 Shiraz',
  'Penfolds',
  'cat-red',
  'cat-red',
  2018,
  'Barossa Valley & McLaren Vale, South Australia',
  'Australia',
  'Red',
  '97% Shiraz, 3% Cabernet Sauvignon',
  14.5,
  'Dry',
  'Full',
  48900.00,
  53500.00,
  3,
  'Australia’s indisputable national treasure. 100% new American oak hogsheads aging deliver an intoxicating wave of black licorice, mocha, blackberry reduction, and formidable longevity.',
  '{"aroma":["Blackberry Reduction","Anise Seed","Dark Mocha","Toasted American Oak"],"palate":"Tremendous density of fruit held in a vice-like grip of ripe, graphite-laced tannins.","finish":"Colossal finish echoing with espresso and sweet spice."}'::jsonb,
  '750ml',
  '/images/product_st_helena_napa_cabernet.jpg',
  '["/images/category_red_wine_curated.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#33080e',
  '#dfbe76',
  5.0,
  28,
  '["Charcoal-Grilled Wagyu Tomahawk","Braised Short Ribs","Venison with Black Cherry Sauce"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 120 minutes',
  true
),
(
  'prod-030',
  'Domaine Tempier Bandol Rosé',
  'Domaine Tempier',
  'cat-rose',
  'cat-rose',
  2022,
  'Bandol, Provence',
  'France',
  'Rosé',
  '55% Mourvèdre, 25% Grenache, 20% Cinsault',
  13,
  'Bone Dry',
  'Medium',
  4950.00,
  NULL,
  9,
  'The world gold standard of age-worthy gastronomy rosé. Mourvèdre provides muscular structure with blood orange, garrigue herbs, pomegranate, and Mediterranean sea salt.',
  '{"aroma":["Blood Orange Rind","Pomegranate","Wild Thyme","Crushed Marine Shells"],"palate":"Firm, vinous, textured rosé with bracing minerality and savory herbal depth.","finish":"Dry, salivating, and exceptionally long."}'::jsonb,
  '750ml',
  '/images/product_villa_rose_provencal.jpg',
  '["/images/category_rose_wine_curated.jpg","/images/pairing_oysters_and_caviar.jpg"]'::jsonb,
  '#381614',
  '#dfbe76',
  4.9,
  35,
  '["Bouillabaisse Seafood Stew","Charcoal-Grilled Davao Tuna Belly","Provençal Roasted Lamb"]'::jsonb,
  '11–13°C (52–55°F)',
  'Serve cellar-cool in red wine glasses',
  false
),
(
  'prod-031',
  'Ornellaia Bolgheri Superiore DOC',
  'Tenuta dell’Ornellaia',
  'cat-red',
  'cat-red',
  2019,
  'Bolgheri, Tuscany',
  'Italy',
  'Red',
  '62% Cabernet Sauvignon, 31% Merlot, 4% Petit Verdot, 3% Cabernet Franc',
  14.5,
  'Dry',
  'Full',
  24800.00,
  27500.00,
  4,
  'The aristocrat of the Tuscan coast. Harmonious black currant, dark chocolate, balsamic rosemary, and silky Mediterranean tannins shaped by sea breezes.',
  '{"aroma":["Cassis","Dark Chocolate Ganache","Balsamic Eucalyptus","Warm Cedar"],"palate":"Opulent and multi-layered with silky tannins wrapped around ripe black fruit and mineral tension.","finish":"Long, polished, and noble."}'::jsonb,
  '750ml',
  '/images/product_san_pietro_brunello.jpg',
  '["/images/region_tuscany_hills.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#3a0913',
  '#dfbe76',
  4.9,
  39,
  '["Bistecca alla Fiorentina","Roast Squab with Porcini","Pecorino Toscano Stagionato"]'::jsonb,
  '16–18°C (60–64°F)',
  'Decant for 60 minutes',
  true
),
(
  'prod-032',
  'Schrader Cellars Beckstoffer To Kalon Cabernet Sauvignon',
  'Schrader Cellars',
  'cat-red',
  'cat-red',
  2019,
  'Oakville, Napa Valley, California',
  'USA',
  'Red',
  '100% Cabernet Sauvignon',
  14.8,
  'Dry',
  'Full',
  42000.00,
  46500.00,
  2,
  'Cult Napa Valley perfection from the legendary Beckstoffer To Kalon vineyard. Inky purple with crusted boysenberry, crème de cassis, graphite, and awe-inspiring power.',
  '{"aroma":["Crème de Cassis","Boysenberry Compote","Violets","Pencil Lead"],"palate":"Monumental purity of fruit with velvety, multi-layered tannins that glide effortlessly across the palate.","finish":"Profoundly long with echoes of black fruit and volcanic graphite."}'::jsonb,
  '750ml',
  '/images/product_st_helena_napa_cabernet.jpg',
  '["/images/region_napa_valley.jpg","/images/pairing_prime_ribeye_steak.jpg"]'::jsonb,
  '#350a11',
  '#dfbe76',
  5.0,
  22,
  '["Dry-Aged Bone-in Ribeye","Venison Chop with Juniper","Roquefort Cheese"]'::jsonb,
  '17–18°C (62–64°F)',
  'Decant for 90 minutes',
  true
)
ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  winery = EXCLUDED.winery,
  category = EXCLUDED.category,
  category_id = EXCLUDED.category_id,
  vintage = EXCLUDED.vintage,
  region = EXCLUDED.region,
  country = EXCLUDED.country,
  wine_type = EXCLUDED.wine_type,
  grape_variety = EXCLUDED.grape_variety,
  alcohol_percentage = EXCLUDED.alcohol_percentage,
  sweetness = EXCLUDED.sweetness,
  body = EXCLUDED.body,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  description = EXCLUDED.description,
  tasting_notes = EXCLUDED.tasting_notes,
  bottle_size = EXCLUDED.bottle_size,
  image = EXCLUDED.image,
  images = EXCLUDED.images,
  bottle_color = EXCLUDED.bottle_color,
  accent_color = EXCLUDED.accent_color,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  food_pairings = EXCLUDED.food_pairings,
  serving_temp = EXCLUDED.serving_temp,
  decanting = EXCLUDED.decanting,
  featured = EXCLUDED.featured;

-- ==============================================================================
-- INITIAL SEED DATA: Sommelier & Cellar Master Tasting Reviews
-- ==============================================================================
INSERT INTO public.reviews (review_id, user_id, user_name, product_id, rating, comment, review_date)
VALUES
  ('rev-01', 'cellar-panel-01', 'Cellar Master Panel (Davao Flagship)', 'prod-001', 5.0, 'The depth of cassis and graphite in this 2021 vintage is breathtaking. Cellared in pristine climate-controlled conditions with taut, silky tannins.', '2 weeks ago'),
  ('rev-02', 'collector-panel-02', 'Verified Collector (Matina)', 'prod-001', 5.0, 'Impeccable balance. Tannins are taut yet refined, with tremendous cellaring potential. VÍNEA delivered in Davao with their temperature-controlled van within 2 hours.', '1 month ago'),
  ('rev-03', 'collector-panel-03', 'Private Collector (Azuela Cove)', 'prod-002', 5.0, 'Bone dry with the most delicate saline strawberry notes. Exceptional paired with fresh Davao seafood at sunset.', '3 weeks ago')
ON CONFLICT (review_id) DO NOTHING;

-- ==============================================================================
-- Enable Realtime for all tables
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sommelier_inquiries;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wishlists;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.branches;
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;
`;
export default schemaSql;
