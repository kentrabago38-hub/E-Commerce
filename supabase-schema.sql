-- ==============================================================================
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

-- ==============================================================================
-- INITIAL SEED DATA: Categories
-- ==============================================================================
INSERT INTO public.categories (category_id, category_name, slug, description, image, item_count)
VALUES
  ('cat-red', 'Red Wine', 'red', 'Full-bodied Cabernets, velvety Pinot Noirs, and bold historic terroirs with complex aromatics.', '/src/assets/images/category_red_wine_1791213197300.jpg', 5),
  ('cat-white', 'White Wine', 'white', 'Crisp Chardonnays, vibrant Sauvignon Blancs, and mineral-driven Rieslings from cool climate vineyards.', '/src/assets/images/category_white_wine_1791213207550.jpg', 3),
  ('cat-rose', 'Rosé', 'rose', 'Sun-drenched Mediterranean pale pinks offering fresh red berries, delicate minerality, and crisp acidity.', '/src/assets/images/category_red_wine_1791213197300.jpg', 2),
  ('cat-sparkling', 'Sparkling Wine', 'sparkling', 'Traditional method Champagne, artisanal Prosecco, and sparkling vintages with persistent fine mousse.', '/src/assets/images/category_sparkling_wine_1791213218531.jpg', 2),
  ('cat-collections', 'Premium Collections', 'collections', 'Curated cellared selections, library vintages, and rare single-vineyard allocations.', '/src/assets/images/hero_wine_cellar_1791213186963.jpg', 2),
  ('cat-gifts', 'Gift Sets', 'gift-sets', 'Artisan handcrafted wooden cases, sommelier glassware sets, and celebratory presentation sets.', '/src/assets/images/category_sparkling_wine_1791213218531.jpg', 2)
ON CONFLICT (category_id) DO UPDATE SET
  category_name = EXCLUDED.category_name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  item_count = EXCLUDED.item_count;

-- ==============================================================================
-- INITIAL SEED DATA: All 12 Luxury Wine Products
-- ==============================================================================
INSERT INTO public.products (
  product_id, name, winery, category, category_id, vintage, region, country, wine_type,
  grape_variety, alcohol_percentage, sweetness, body, price, original_price, stock,
  description, tasting_notes, bottle_size, image, bottle_color, accent_color,
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
  14.0,
  'Dry',
  'Full',
  7950.00,
  8950.00,
  24,
  'An exceptional Left Bank blend dominated by concentrated cassis, French oak cedar, cigar box, and refined powdery tannins. Cellared in toasted Allier oak barrels for 20 months.',
  '{"aroma": ["Ripe Blackberry", "Blackcurrant", "Cedarwood", "Dark Truffle"], "palate": "Opulent layers of dense black cherry, graphite minerality, and cocoa nibs with impeccably structured tannins.", "finish": "Long, persistent finish lingering with toasted spices and subtle vanilla bean."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#440e18',
  '#d4af37',
  4.9,
  38,
  '["Dry-Aged Ribeye", "Roasted Duck Breast", "Aged Comté Cheese", "Venison Tenderloin"]'::jsonb,
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
  '{"aroma": ["Wild Strawberry", "Crushed Melon", "White Peach", "Provence Herbs"], "palate": "Crisp, bone-dry palate with citrus zest brightness, pink grapefruit, and wet stone minerality.", "finish": "Clean, refreshing saline lift with a delicate floral blossom tail."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#9e3f52',
  '#f5c6cb',
  4.8,
  24,
  '["Grilled Sea Bass", "Heirloom Tomato Tart", "Fresh Oysters", "Goat Cheese Crostini"]'::jsonb,
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
  '{"aroma": ["Red Cherry", "Raspberry Coulis", "Forest Floor", "Violet Blossom"], "palate": "Silky, medium-bodied texture with lively red fruit acidity, tea leaf tannins, and subtle spice.", "finish": "Harmonious and graceful with savory dried herbs and lingering wild cherry."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#5e1927',
  '#dfbe76',
  4.7,
  19,
  '["Roast Quail", "Wild Mushroom Risotto", "Herb-Crusted Salmon", "Peking Duck"]'::jsonb,
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
  13.0,
  'Dry',
  'Medium',
  6050.00,
  NULL,
  15,
  'Classic Côte de Beaune poise. Glistening pale gold exhibiting ripe lemon curd, toasted brioche, flinty chalk minerality, and an unctuous creamy texture balanced by taut acidity.',
  '{"aroma": ["Meyer Lemon", "Brioche", "White Blossom", "Crushed Flint"], "palate": "Elegant creamy richness framed by crystalline citrus acidity, hazelnut, and salted butter notes.", "finish": "Long, vibrating chalky mineral finish with gentle smoky undertones."}'::jsonb,
  '750ml',
  '/src/assets/images/category_white_wine_1791213207550.jpg',
  '#82652b',
  '#e6ca65',
  4.9,
  31,
  '["Lobster Thermidor", "Pan-Seared Scallops", "Roasted Turbot", "Poulet de Bresse"]'::jsonb,
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
  12.0,
  'Dry',
  'Medium',
  10200.00,
  NULL,
  9,
  'A prestige cuvée aged 6 years on the lees in ancient Gallo-Roman chalk cellars. Tiny persistent bead with pastry aromas, golden apple, roasted almond, and saline precision.',
  '{"aroma": ["Brioche", "Golden Reinette Apple", "Toasted Almond", "Chalk Smoke"], "palate": "Silky, fine mousse with exhilarating tension, yellow mirabelle plum, and candied citrus peel.", "finish": "Expansive, mineral-drenched, deeply satisfying celebratory finish."}'::jsonb,
  '750ml',
  '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
  '#324a29',
  '#f0d27c',
  5.0,
  44,
  '["Caviar on Blinis", "Langoustines", "Black Truffle Pasta", "Aged Parmigiano Reggiano"]'::jsonb,
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
  '{"aroma": ["Macerated Cherry", "Tuscan Leather", "Dried Rosemary", "Tobacco Leaf"], "palate": "Firm, muscular structure with ripe gripping tannins, blood orange zest, and spiced plum.", "finish": "Remarkably persistent finish carried by savory earth and noble wood."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#420b13',
  '#c5a059',
  4.8,
  27,
  '["Bistecca alla Fiorentina", "Slow-Braised Osso Buco", "Wild Boar Ragù", "Pecorino Toscano"]'::jsonb,
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
  13.0,
  'Dry',
  'Light',
  2350.00,
  NULL,
  35,
  'Intensely aromatic Marlborough benchmark. Passionfruit, crushed lemongrass, lime cordial, and wet river stones with a thrilling, mouth-watering zesty acidity.',
  '{"aroma": ["Passionfruit", "Lemongrass", "Crushed Basil", "Grapefruit"], "palate": "Vibrant, electric palate with explosive tropical citrus flavors and crunchy green apple.", "finish": "Taut, mouthwatering lime and sea salt finish."}'::jsonb,
  '750ml',
  '/src/assets/images/category_white_wine_1791213207550.jpg',
  '#55694a',
  '#7bc991',
  4.6,
  22,
  '["Goat Cheese Salad", "Green Lip Mussels", "Ceviche", "Thai Spiced Prawns"]'::jsonb,
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
  14.0,
  'Dry',
  'Full',
  5250.00,
  NULL,
  20,
  'A traditional masterpiece aged 24 months in American oak followed by 36 months in bottle. Sweet dill, dried fig, cloves, coconut husk, and velvety softened tannins.',
  '{"aroma": ["Dried Fig", "American Vanilla", "Clove", "Leather Saddle"], "palate": "Silky, rounded mouthfeel with resolved tertiary fruit, roasted spices, and dark cherry liqueur.", "finish": "Warm, comforting finish with lingering cocoa and sweet tobacco."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#3d0a11',
  '#e0a96d',
  4.8,
  35,
  '["Roast Suckling Lamb", "Jamón Ibérico de Bellota", "Manchego Cheese", "Braised Beef Cheeks"]'::jsonb,
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
  '{"aroma": ["Blackberry Compote", "Espresso Bean", "Cassis", "Cinnamon Bark"], "palate": "Monumental weight and richness with layers of decadent blue fruits, melted dark chocolate, and sweet cedar.", "finish": "Monumental 60-second finish with cashmere tannins and warm berry core."}'::jsonb,
  '750ml',
  '/src/assets/images/category_red_wine_1791213197300.jpg',
  '#2e080e',
  '#c5a059',
  4.9,
  52,
  '["Prime Tomahawk Steak", "Smoked Beef Short Ribs", "Charred Lamb Chops", "Truffle Macaroni"]'::jsonb,
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
  '{"aroma": ["White Peach", "Jasmine Flower", "Flint Slate", "Lime Blossom"], "palate": "Dancing interplay of juicy apricot, honeysuckle sweetness, and cutting mineral acidity.", "finish": "Vibrant, crystal-clear finish that stimulates every tastebud."}'::jsonb,
  '750ml',
  '/src/assets/images/category_white_wine_1791213207550.jpg',
  '#495a32',
  '#d4af37',
  4.7,
  18,
  '["Spicy Szechuan Pork", "Duck Liver Pâté", "Crab Cakes with Remoulade", "Roast Goose"]'::jsonb,
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
  11.0,
  'Dry',
  'Light',
  1980.00,
  NULL,
  30,
  'Hand-picked from the UNESCO World Heritage steep hills of Valdobbiadene. Fresh green apple, acacia honey aromas, and an uplifting creamy foam.',
  '{"aroma": ["Golden Delicious Apple", "Acacia Flowers", "Williams Pear", "Lemon Verbena"], "palate": "Delicate, froth-like effervescence with succulent pear and refreshing citrus balance.", "finish": "Crisp, appetizing, and celebratory."}'::jsonb,
  '750ml',
  '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
  '#28402b',
  '#c5a059',
  4.6,
  28,
  '["Prosciutto di San Daniele", "Arancini", "Light Canapés", "Seafood Antipasti"]'::jsonb,
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
  '{"aroma": ["Truffle", "Cassis", "Brioche", "White Peach"], "palate": "A curated journey across the three greatest wine terroirs of France in pristine cellar condition.", "finish": "Unforgettable cellar-worthy experience."}'::jsonb,
  '750ml',
  '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
  '#260a10',
  '#dfbe76',
  5.0,
  14,
  '["Multi-Course Tasting Menu", "Holiday Celebrations", "Executive Gifting"]'::jsonb,
  'Assorted (see enclosed sommelier cards)',
  'Individual instructions enclosed',
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
END $$;
