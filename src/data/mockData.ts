import { Product, Category, User, Order, Review, GuideArticle, DavaoBranch } from '../types/wine';

export const INITIAL_CATEGORIES: Category[] = [
  {
    category_id: 'cat-red',
    category_name: 'Red Wine',
    slug: 'red',
    description: 'Full-bodied Cabernets, velvety Pinot Noirs, and bold historic terroirs with complex aromatics.',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    item_count: 5
  },
  {
    category_id: 'cat-white',
    category_name: 'White Wine',
    slug: 'white',
    description: 'Crisp Chardonnays, vibrant Sauvignon Blancs, and mineral-driven Rieslings from cool climate vineyards.',
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    item_count: 3
  },
  {
    category_id: 'cat-rose',
    category_name: 'Rosé',
    slug: 'rose',
    description: 'Sun-drenched Mediterranean pale pinks offering fresh red berries, delicate minerality, and crisp acidity.',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    item_count: 2
  },
  {
    category_id: 'cat-sparkling',
    category_name: 'Sparkling Wine',
    slug: 'sparkling',
    description: 'Traditional method Champagne, artisanal Prosecco, and sparkling vintages with persistent fine mousse.',
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    item_count: 2
  },
  {
    category_id: 'cat-collections',
    category_name: 'Premium Collections',
    slug: 'collections',
    description: 'Curated cellared selections, library vintages, and rare single-vineyard allocations.',
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    item_count: 2
  },
  {
    category_id: 'cat-gifts',
    category_name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Artisan handcrafted wooden cases, sommelier glassware sets, and celebratory presentation sets.',
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    item_count: 2
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    product_id: 'prod-001',
    name: 'Château Lumière Cabernet Sauvignon',
    winery: 'Château Lumière',
    country: 'France',
    region: 'Bordeaux',
    vintage: 2021,
    wine_type: 'Red',
    grape_variety: 'Cabernet Sauvignon',
    alcohol_percentage: 14.0,
    sweetness: 'Dry',
    body: 'Full',
    price: 7950,
    original_price: 8950,
    stock: 24,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#440e18',
    accent_color: '#d4af37',
    description: 'An exceptional Left Bank blend dominated by concentrated cassis, French oak cedar, cigar box, and refined powdery tannins. Cellared in toasted Allier oak barrels for 20 months.',
    rating: 4.9,
    reviews_count: 38,
    featured: true,
    category_id: 'cat-red',
    tasting_notes: {
      aroma: ['Ripe Blackberry', 'Blackcurrant', 'Cedarwood', 'Dark Truffle'],
      palate: 'Opulent layers of dense black cherry, graphite minerality, and cocoa nibs with impeccably structured tannins.',
      finish: 'Long, persistent finish lingering with toasted spices and subtle vanilla bean.'
    },
    food_pairings: ['Dry-Aged Ribeye', 'Roasted Duck Breast', 'Aged Comté Cheese', 'Venison Tenderloin'],
    serving_temp: '16–18°C (60–64°F)',
    decanting: 'Decant for 60 minutes before serving'
  },
  {
    product_id: 'prod-002',
    name: 'Villa Rosé Provençal',
    winery: 'Villa Rosé Estates',
    country: 'France',
    region: 'Provence',
    vintage: 2024,
    wine_type: 'Rosé',
    grape_variety: 'Grenache & Cinsault',
    alcohol_percentage: 12.5,
    sweetness: 'Bone Dry',
    body: 'Light',
    price: 2650,
    stock: 42,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#9e3f52',
    accent_color: '#f5c6cb',
    description: 'Pale salmon hue hailing from coastal Saint-Tropez limestone soils. Expressive wild strawberries, white peach, hints of lavender, and a crisp saline breeze finish.',
    rating: 4.8,
    reviews_count: 24,
    featured: true,
    category_id: 'cat-rose',
    tasting_notes: {
      aroma: ['Wild Strawberry', 'Crushed Melon', 'White Peach', 'Provence Herbs'],
      palate: 'Crisp, bone-dry palate with citrus zest brightness, pink grapefruit, and wet stone minerality.',
      finish: 'Clean, refreshing saline lift with a delicate floral blossom tail.'
    },
    food_pairings: ['Grilled Sea Bass', 'Heirloom Tomato Tart', 'Fresh Oysters', 'Goat Cheese Crostini'],
    serving_temp: '8–10°C (46–50°F)',
    decanting: 'Serve chilled, no decanting needed'
  },
  {
    product_id: 'prod-003',
    name: 'Monteverde Pinot Noir',
    winery: 'Tenuta Monteverde',
    country: 'Italy',
    region: 'Veneto',
    vintage: 2022,
    wine_type: 'Red',
    grape_variety: 'Pinot Noir',
    alcohol_percentage: 13.5,
    sweetness: 'Dry',
    body: 'Medium',
    price: 4850,
    stock: 18,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#5e1927',
    accent_color: '#dfbe76',
    description: 'Crafted on the high-elevation volcanic hillside terraces of Veneto. Translucent ruby with seductive notes of wild cherries, forest floor, clove, and ethereal violet petals.',
    rating: 4.7,
    reviews_count: 19,
    featured: true,
    category_id: 'cat-red',
    tasting_notes: {
      aroma: ['Red Cherry', 'Raspberry Coulis', 'Forest Floor', 'Violet Blossom'],
      palate: 'Silky, medium-bodied texture with lively red fruit acidity, tea leaf tannins, and subtle spice.',
      finish: 'Harmonious and graceful with savory dried herbs and lingering wild cherry.'
    },
    food_pairings: ['Roast Quail', 'Wild Mushroom Risotto', 'Herb-Crusted Salmon', 'Peking Duck'],
    serving_temp: '14–16°C (57–61°F)',
    decanting: 'Decant for 30 minutes'
  },
  {
    product_id: 'prod-004',
    name: 'Maison Étoile Chardonnay',
    winery: 'Maison Étoile',
    country: 'France',
    region: 'Burgundy',
    vintage: 2023,
    wine_type: 'White',
    grape_variety: 'Chardonnay',
    alcohol_percentage: 13.0,
    sweetness: 'Dry',
    body: 'Medium',
    price: 6050,
    stock: 15,
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    bottle_color: '#82652b',
    accent_color: '#e6ca65',
    description: 'Classic Côte de Beaune poise. Glistening pale gold exhibiting ripe lemon curd, toasted brioche, flinty chalk minerality, and an unctuous creamy texture balanced by taut acidity.',
    rating: 4.9,
    reviews_count: 31,
    featured: true,
    category_id: 'cat-white',
    tasting_notes: {
      aroma: ['Meyer Lemon', 'Brioche', 'White Blossom', 'Crushed Flint'],
      palate: 'Elegant creamy richness framed by crystalline citrus acidity, hazelnut, and salted butter notes.',
      finish: 'Long, vibrating chalky mineral finish with gentle smoky undertones.'
    },
    food_pairings: ['Lobster Thermidor', 'Pan-Seared Scallops', 'Roasted Turbot', 'Poulet de Bresse'],
    serving_temp: '10–12°C (50–54°F)',
    decanting: 'Aerator or 15 minutes aeration'
  },
  {
    product_id: 'prod-005',
    name: 'Domaine de la Reine Brut Grand Cru',
    winery: 'Domaine de la Reine',
    country: 'France',
    region: 'Champagne',
    vintage: 2018,
    wine_type: 'Sparkling',
    grape_variety: 'Chardonnay & Pinot Noir',
    alcohol_percentage: 12.0,
    sweetness: 'Dry',
    body: 'Medium',
    price: 10200,
    stock: 9,
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    bottle_color: '#324a29',
    accent_color: '#f0d27c',
    description: 'A prestige cuvée aged 6 years on the lees in ancient Gallo-Roman chalk cellars. Tiny persistent bead with pastry aromas, golden apple, roasted almond, and saline precision.',
    rating: 5.0,
    reviews_count: 44,
    featured: true,
    category_id: 'cat-sparkling',
    tasting_notes: {
      aroma: ['Brioche', 'Golden Reinette Apple', 'Toasted Almond', 'Chalk Smoke'],
      palate: 'Silky, fine mousse with exhilarating tension, yellow mirabelle plum, and candied citrus peel.',
      finish: 'Expansive, mineral-drenched, deeply satisfying celebratory finish.'
    },
    food_pairings: ['Caviar on Blinis', 'Langoustines', 'Black Truffle Pasta', 'Aged Parmigiano Reggiano'],
    serving_temp: '8–10°C (46–50°F)',
    decanting: 'Serve immediately in tulip flutes'
  },
  {
    product_id: 'prod-006',
    name: 'Tenuta di San Pietro Brunello di Montalcino',
    winery: 'Tenuta di San Pietro',
    country: 'Italy',
    region: 'Tuscany',
    vintage: 2019,
    wine_type: 'Red',
    grape_variety: 'Sangiovese Grosso',
    alcohol_percentage: 14.5,
    sweetness: 'Dry',
    body: 'Full',
    price: 7450,
    stock: 12,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#420b13',
    accent_color: '#c5a059',
    description: 'Grown on sun-drenched Tuscan slopes 450 meters above sea level. Matured 36 months in Slavonian oak casks. Deep garnet with dried oregano, leather, macerated cherries, and balsamic lift.',
    rating: 4.8,
    reviews_count: 27,
    featured: false,
    category_id: 'cat-red',
    tasting_notes: {
      aroma: ['Macerated Cherry', 'Tuscan Leather', 'Dried Rosemary', 'Tobacco Leaf'],
      palate: 'Firm, muscular structure with ripe gripping tannins, blood orange zest, and spiced plum.',
      finish: 'Remarkably persistent finish carried by savory earth and noble wood.'
    },
    food_pairings: ['Bistecca alla Fiorentina', 'Slow-Braised Osso Buco', 'Wild Boar Ragù', 'Pecorino Toscano'],
    serving_temp: '18°C (64°F)',
    decanting: 'Decant for 90 minutes'
  },
  {
    product_id: 'prod-007',
    name: 'Cloud Valley Sauvignon Blanc',
    winery: 'Cloud Valley Vintners',
    country: 'New Zealand',
    region: 'Marlborough',
    vintage: 2023,
    wine_type: 'White',
    grape_variety: 'Sauvignon Blanc',
    alcohol_percentage: 13.0,
    sweetness: 'Dry',
    body: 'Light',
    price: 2350,
    stock: 35,
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    bottle_color: '#55694a',
    accent_color: '#7bc991',
    description: 'Intensely aromatic Marlborough benchmark. Passionfruit, crushed lemongrass, lime cordial, and wet river stones with a thrilling, mouth-watering zesty acidity.',
    rating: 4.6,
    reviews_count: 22,
    featured: false,
    category_id: 'cat-white',
    tasting_notes: {
      aroma: ['Passionfruit', 'Lemongrass', 'Crushed Basil', 'Grapefruit'],
      palate: 'Vibrant, electric palate with explosive tropical citrus flavors and crunchy green apple.',
      finish: 'Taut, mouthwatering lime and sea salt finish.'
    },
    food_pairings: ['Goat Cheese Salad', 'Green Lip Mussels', 'Ceviche', 'Thai Spiced Prawns'],
    serving_temp: '7–9°C (45–48°F)',
    decanting: 'Chill thoroughly, no decanting needed'
  },
  {
    product_id: 'prod-008',
    name: 'Bodega Solaria Gran Reserva',
    winery: 'Bodega Solaria',
    country: 'Spain',
    region: 'Rioja',
    vintage: 2018,
    wine_type: 'Red',
    grape_variety: 'Tempranillo & Graciano',
    alcohol_percentage: 14.0,
    sweetness: 'Dry',
    body: 'Full',
    price: 5250,
    stock: 20,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#3d0a11',
    accent_color: '#e0a96d',
    description: 'A traditional masterpiece aged 24 months in American oak followed by 36 months in bottle. Sweet dill, dried fig, cloves, coconut husk, and velvety softened tannins.',
    rating: 4.8,
    reviews_count: 35,
    featured: false,
    category_id: 'cat-red',
    tasting_notes: {
      aroma: ['Dried Fig', 'American Vanilla', 'Clove', 'Leather Saddle'],
      palate: 'Silky, rounded mouthfeel with resolved tertiary fruit, roasted spices, and dark cherry liqueur.',
      finish: 'Warm, comforting finish with lingering cocoa and sweet tobacco.'
    },
    food_pairings: ['Roast Suckling Lamb', 'Jamón Ibérico de Bellota', 'Manchego Cheese', 'Braised Beef Cheeks'],
    serving_temp: '17–19°C (62–66°F)',
    decanting: 'Decant for 45 minutes'
  },
  {
    product_id: 'prod-009',
    name: 'St. Helena Reserve Cabernet',
    winery: 'St. Helena Cellars',
    country: 'USA',
    region: 'Napa Valley',
    vintage: 2020,
    wine_type: 'Red',
    grape_variety: 'Cabernet Sauvignon',
    alcohol_percentage: 14.8,
    sweetness: 'Dry',
    body: 'Full',
    price: 11550,
    stock: 8,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    bottle_color: '#2e080e',
    accent_color: '#c5a059',
    description: 'Iconic valley floor and benchland fruit. Deep impenetrable ink-purple. Saturated blackberry compote, mocha, French oak spice, and plush, seamless velvet tannins.',
    rating: 4.9,
    reviews_count: 52,
    featured: true,
    category_id: 'cat-red',
    tasting_notes: {
      aroma: ['Blackberry Compote', 'Espresso Bean', 'Cassis', 'Cinnamon Bark'],
      palate: 'Monumental weight and richness with layers of decadent blue fruits, melted dark chocolate, and sweet cedar.',
      finish: 'Monumental 60-second finish with cashmere tannins and warm berry core.'
    },
    food_pairings: ['Prime Tomahawk Steak', 'Smoked Beef Short Ribs', 'Charred Lamb Chops', 'Truffle Macaroni'],
    serving_temp: '18°C (64°F)',
    decanting: 'Decant for 75 minutes'
  },
  {
    product_id: 'prod-010',
    name: 'Schloss Johannisberg Riesling Feinherb',
    winery: 'Schloss Johannisberg',
    country: 'Germany',
    region: 'Rheingau',
    vintage: 2022,
    wine_type: 'White',
    grape_variety: 'Riesling',
    alcohol_percentage: 11.5,
    sweetness: 'Semi-Dry',
    body: 'Light',
    price: 3550,
    stock: 16,
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    bottle_color: '#495a32',
    accent_color: '#d4af37',
    description: 'Steep slate slopes overlooking the Rhine river. Ethereal tension between natural sweetness and electric racy acidity. White peach, petrol nuances, and wet slate stone.',
    rating: 4.7,
    reviews_count: 18,
    featured: false,
    category_id: 'cat-white',
    tasting_notes: {
      aroma: ['White Peach', 'Jasmine Flower', 'Flint Slate', 'Lime Blossom'],
      palate: 'Dancing interplay of juicy apricot, honeysuckle sweetness, and cutting mineral acidity.',
      finish: 'Vibrant, crystal-clear finish that stimulates every tastebud.'
    },
    food_pairings: ['Spicy Szechuan Pork', 'Duck Liver Pâté', 'Crab Cakes with Remoulade', 'Roast Goose'],
    serving_temp: '8–10°C (46–50°F)',
    decanting: 'Serve chilled'
  },
  {
    product_id: 'prod-011',
    name: 'Valdobbiadene Prosecco Superiore DOCG',
    winery: 'Boutique Perla',
    country: 'Italy',
    region: 'Veneto',
    vintage: 2023,
    wine_type: 'Sparkling',
    grape_variety: 'Glera',
    alcohol_percentage: 11.0,
    sweetness: 'Dry',
    body: 'Light',
    price: 1980,
    stock: 30,
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    bottle_color: '#28402b',
    accent_color: '#c5a059',
    description: 'Hand-picked from the UNESCO World Heritage steep hills of Valdobbiadene. Fresh green apple, acacia honey aromas, and an uplifting creamy foam.',
    rating: 4.6,
    reviews_count: 28,
    featured: false,
    category_id: 'cat-sparkling',
    tasting_notes: {
      aroma: ['Golden Delicious Apple', 'Acacia Flowers', 'Williams Pear', 'Lemon Verbena'],
      palate: 'Delicate, froth-like effervescence with succulent pear and refreshing citrus balance.',
      finish: 'Crisp, appetizing, and celebratory.'
    },
    food_pairings: ['Prosciutto di San Daniele', 'Arancini', 'Light Canapés', 'Seafood Antipasti'],
    serving_temp: '6–8°C (42–46°F)',
    decanting: 'Serve cold in sparkling flutes'
  },
  {
    product_id: 'prod-012',
    name: 'Grand Terroirs of France Trio (Gift Box)',
    winery: 'VÍNEA Sommelier Curation',
    country: 'France',
    region: 'Bordeaux, Burgundy, Champagne',
    vintage: 2021,
    wine_type: 'Red',
    grape_variety: 'Cabernet, Chardonnay, Pinot Noir',
    alcohol_percentage: 13.5,
    sweetness: 'Dry',
    body: 'Full',
    price: 21750,
    original_price: 24200,
    stock: 7,
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    bottle_color: '#260a10',
    accent_color: '#dfbe76',
    description: 'A prestige handcrafted wooden collector case housing 3 iconic expressions: Left Bank Bordeaux, Côte d’Or Premier Cru Chardonnay, and Vintage Grand Cru Champagne.',
    rating: 5.0,
    reviews_count: 14,
    featured: true,
    category_id: 'cat-collections',
    tasting_notes: {
      aroma: ['Truffle', 'Cassis', 'Brioche', 'White Peach'],
      palate: 'A curated journey across the three greatest wine terroirs of France in pristine cellar condition.',
      finish: 'Unforgettable cellar-worthy experience.'
    },
    food_pairings: ['Multi-Course Tasting Menu', 'Holiday Celebrations', 'Executive Gifting'],
    serving_temp: 'Assorted (see enclosed sommelier cards)',
    decanting: 'Individual instructions enclosed'
  }
];

export const DAVAO_BRANCHES: DavaoBranch[] = [
  {
    id: 'branch-lanang-flagship',
    name: 'VÍNEA Flagship Cellar & Tasting Lounge',
    district: 'Lanang / North Davao',
    address: 'G/F Premier Wing, J.P. Laurel Avenue, Lanang, Davao City, 8000',
    landmark: 'Across from Lanang Business Park, beside Grand Regal',
    phone: '(082) 238-8921 / +63 917 842 1920',
    operatingHours: 'Monday – Sunday: 10:00 AM – 11:30 PM',
    features: [
      'Walk-In Subterranean Vault (13°C)',
      'Master Sommelier Private Tasting Room',
      'Artisan Charcuterie & Cheese Pairing Bar',
      'Temperature-Controlled Bottle Storage Lockers',
      'Curated Corporate & VIP Gift Concierge'
    ],
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    isFlagship: true,
    mapCoordinates: '7.1032, 125.6421'
  },
  {
    id: 'branch-abreeza',
    name: 'VÍNEA Cellar & Wine Bar — Abreeza',
    district: 'Bajada / Central District',
    address: 'Level 2, Restaurant Row, Abreeza Mall, J.P. Laurel Ave, Bajada, Davao City, 8000',
    landmark: 'Near the Garden Walk & Open-Air Courtyard',
    phone: '(082) 321-4560 / +63 917 520 8831',
    operatingHours: 'Monday – Sunday: 11:00 AM – 10:00 PM',
    features: [
      'Italian Enomatic Wine Tasting Dispensers',
      'Coravin Preserved Rare By-The-Glass Program',
      'Spanish Tapas & Jamón Ibérico Pairing',
      'Express Chilled Pick-Up for Online Orders'
    ],
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    mapCoordinates: '7.0911, 125.6178'
  },
  {
    id: 'branch-matina',
    name: 'VÍNEA Sommelier Reserve — Matina Enclaves',
    district: 'Ecoland / South Davao',
    address: 'Ground Level, The Matina Enclaves Clubhouse, Quimpo Boulevard, Matina, Davao City, 8000',
    landmark: 'Adjacent to SM City Davao & Ecoland Terminal area',
    phone: '(082) 297-7104 / +63 919 443 6211',
    operatingHours: 'Tuesday – Sunday: 1:00 PM – 10:30 PM',
    features: [
      'Private Residential Collector Wine Lockers',
      'Fireside Cellar Lounge & Intimate Booths',
      'Rare Bordeaux Grand Cru & Super Tuscan Library',
      'One-on-One Sommelier Cellar Consultations'
    ],
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    mapCoordinates: '7.0583, 125.5924'
  },
  {
    id: 'branch-azuela',
    name: 'VÍNEA Waterfront Cellar & Champagne Bar',
    district: 'Azuela Cove / Seaside District',
    address: 'Boardwalk Promenade, Azuela Cove, R. Castillo St, Lanang Seaside, Davao City, 8000',
    landmark: 'Facing Davao Gulf waters with open seaside breeze',
    phone: '(082) 285-9932 / +63 917 339 5510',
    operatingHours: 'Wednesday – Sunday: 2:00 PM – 12:00 Midnight',
    features: [
      'Sunset Gulf View Veranda with Outdoor Seating',
      'Vintage Champagne & Sparkling Flight Tastings',
      'Fresh Oysters, Davao Sea Salt Ceviche Pairings',
      'Chilled Provençal Rosé Garden'
    ],
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    mapCoordinates: '7.1124, 125.6541'
  },
  {
    id: 'branch-sm-lanang',
    name: 'VÍNEA Boutique & Express Cellar',
    district: 'Lanang Commercial Hub',
    address: '2nd Level, Premier Retail Row, SM Lanang Premier, J.P. Laurel Ave, Davao City, 8000',
    landmark: 'Near the Sky Garden Atrium escalator',
    phone: '(082) 282-1144 / +63 918 902 4431',
    operatingHours: 'Monday – Sunday: 10:00 AM – 9:00 PM',
    features: [
      'Instant Chilled Bottle Pick-Up & Express Checkout',
      'Curated Wine Gift Packaging & Wooden Boxes',
      'Riedel Sommelier Glassware & Decanters',
      'Daily Free Featured Tasting Samples'
    ],
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    mapCoordinates: '7.0988, 125.6327'
  }
];

export const INITIAL_USER: User = {
  user_id: 'usr-101',
  name: 'Maria Santos',
  email: 'maria.santos@vinea.ph',
  phone: '+63 917 842 1920',
  password: 'vinea123',
  role: 'customer',
  member_since: 'October 2024',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  date_of_birth: '1992-06-18',
  preferred_wine_types: ['Red', 'Sparkling'],
  flavor_preference: 'Dry, full-bodied reds with French oak and vintage Blanc de Blancs',
  favorite_davao_branch: 'VÍNEA Lanang Flagship & Subterranean Cellar',
  delivery_instructions: 'Please call mobile upon arrival at One Oasis gate. Leave with building concierge if unattended.',
  membership_tier: 'Grand Cru',
  bio: 'Private Bordeaux and Champagne collector based in Davao City.',
  saved_addresses: [
    {
      street: 'Penthouse 12A, One Oasis Davao, Eco West Drive',
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000',
      country: 'Philippines'
    }
  ]
};

export const INITIAL_REGISTERED_USERS: User[] = [
  INITIAL_USER,
  {
    user_id: 'usr-102',
    name: 'Atty. Roberto Tan',
    email: 'roberto.tan@vinea.ph',
    phone: '+63 918 552 8901',
    password: 'vinea123',
    role: 'customer',
    member_since: 'January 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date_of_birth: '1985-11-04',
    preferred_wine_types: ['Red', 'White'],
    flavor_preference: 'Barolo, Brunello di Montalcino, and Chablis Premier Cru',
    favorite_davao_branch: 'VÍNEA Matina Town Square Cellar & Lounge',
    delivery_instructions: 'Deliver to law offices at Matina during office hours.',
    membership_tier: 'Connoisseur',
    bio: 'Collector of Italian Piedmont and Tuscan allocations.',
    saved_addresses: [
      {
        street: 'Suite 404, Matina IT Park, MacArthur Hwy',
        city: 'Davao City',
        state: 'Davao del Sur',
        postalCode: '8000',
        country: 'Philippines'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    order_id: 'VN-98421',
    user_id: 'usr-101',
    customer_name: 'Maria Santos',
    email: 'maria.santos@vinea.ph',
    phone: '+63 917 842 1920',
    order_date: '2026-09-28',
    subtotal: 18150,
    shipping: 0,
    discount: 1815,
    discount_code: 'VINEA10',
    total_amount: 16335,
    payment_method: 'Credit/Debit Card',
    delivery_address: {
      street: 'Penthouse 12A, One Oasis Davao, Eco West Drive',
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000',
      country: 'Philippines'
    },
    status: 'Shipped',
    estimated_delivery: 'October 8, 2026',
    tracking_number: 'VNX-DVO-8921PH',
    items: [
      {
        order_item_id: 'item-1',
        product_id: 'prod-001',
        name: 'Château Lumière Cabernet Sauvignon',
        winery: 'Château Lumière',
        vintage: 2021,
        quantity: 1,
        price: 7950,
        image: '/src/assets/images/category_red_wine_1791213197300.jpg',
        wine_type: 'Red'
      },
      {
        order_item_id: 'item-2',
        product_id: 'prod-005',
        name: 'Domaine de la Reine Brut Grand Cru',
        winery: 'Domaine de la Reine',
        vintage: 2018,
        quantity: 1,
        price: 10200,
        image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
        wine_type: 'Sparkling'
      }
    ]
  },
  {
    order_id: 'VN-96104',
    user_id: 'usr-101',
    customer_name: 'Maria Santos',
    email: 'maria.santos@vinea.ph',
    phone: '+63 917 842 1920',
    order_date: '2026-09-12',
    subtotal: 7650,
    shipping: 250,
    discount: 0,
    total_amount: 7900,
    payment_method: 'E-Wallet',
    delivery_address: {
      street: 'Penthouse 12A, One Oasis Davao, Eco West Drive',
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000',
      country: 'Philippines'
    },
    status: 'Delivered',
    estimated_delivery: 'September 15, 2026',
    tracking_number: 'VNX-DVO-4102PH',
    items: [
      {
        order_item_id: 'item-3',
        product_id: 'prod-002',
        name: 'Villa Rosé Provençal',
        winery: 'Villa Rosé Estates',
        vintage: 2024,
        quantity: 2,
        price: 2650,
        image: '/src/assets/images/category_red_wine_1791213197300.jpg',
        wine_type: 'Rosé'
      },
      {
        order_item_id: 'item-4',
        product_id: 'prod-007',
        name: 'Cloud Valley Sauvignon Blanc',
        winery: 'Cloud Valley Vintners',
        vintage: 2023,
        quantity: 1,
        price: 2350,
        image: '/src/assets/images/category_white_wine_1791213207550.jpg',
        wine_type: 'White'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    review_id: 'rev-01',
    user_id: 'usr-101',
    user_name: 'Maria Santos (Davao City)',
    product_id: 'prod-001',
    rating: 5,
    comment: 'The depth of cassis and graphite in this 2021 vintage is breathtaking. Picked it up at the Lanang Premier branch chilled and in pristine condition. Paired with ribeye from Bajada, perfection!',
    review_date: '2 weeks ago'
  },
  {
    review_id: 'rev-02',
    user_id: 'usr-102',
    user_name: 'Atty. Roberto Tan (Matina)',
    product_id: 'prod-001',
    rating: 5,
    comment: 'Impeccable balance. Tannins are taut yet refined, with tremendous cellaring potential. VÍNEA delivered this in Davao with their temperature-controlled van within 2 hours.',
    review_date: '1 month ago'
  },
  {
    review_id: 'rev-03',
    user_id: 'usr-103',
    user_name: 'Camilla D. (Azuela Cove)',
    product_id: 'prod-002',
    rating: 5,
    comment: 'Bone dry with the most delicate saline strawberry notes. We love drinking this during sunset at the Azuela Cove branch while enjoying fresh oysters.',
    review_date: '3 weeks ago'
  },
  {
    review_id: 'rev-04',
    user_id: 'usr-104',
    user_name: 'Dr. Michael Chen (Abreeza)',
    product_id: 'prod-004',
    rating: 5,
    comment: 'The brioche and hazelnut notes paired with vibrant chalk minerality are quintessential Côte de Beaune. Davao finally has a genuine world-class wine merchant.',
    review_date: '5 days ago'
  }
];

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-01',
    title: 'How to Choose a Wine for Any Occasion',
    subtitle: 'Navigating terroirs, vintages, and palates with quiet confidence.',
    readTime: '6 min read',
    category: 'Fundamentals',
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    excerpt: 'Selecting the perfect bottle is neither an art reserved for sommeliers nor a game of chance. Learn the 4 pillars of wine selection.',
    content: [
      'When standing before an extensive wine list or curated marketplace, the key is understanding context. Begin with the gathering: is this an energetic celebratory gathering, an intimate five-course dinner, or a reflective evening glass?',
      'Consider the core flavor profile preferred by your guests. When in doubt, versatile high-acid reds like Pinot Noir or textured dry whites like Burgundy Chardonnay effortlessly bridge diverse tastes.',
      'Climate and terroir dictate weight: cooler regions yield wines with crisp acidity and lower alcohol, while warm sun-drenched valleys deliver opulent fruit concentration and higher body.'
    ],
    keyTakeaways: [
      'Match the wine’s weight to the occasion and culinary richness.',
      'Cool climate wines offer more acidity, making them exceptionally food-friendly.',
      'Never hesitate to seek vintage consistency over single-year hype.'
    ],
    sommelierQuote: '“Wine is liquid geography. Choose the place you wish to visit with your senses.”'
  },
  {
    id: 'guide-02',
    title: 'Red vs. White Wine: The Terroir Differences',
    subtitle: 'Beyond grape skins: acidity, tannin extraction, and barrel aging.',
    readTime: '5 min read',
    category: 'Cellar Science',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    excerpt: 'Explore why red and white wines evoke completely different physical sensations on the palate, from skin contact to oak maturation.',
    content: [
      'The foundational distinction between red and white winemaking is skin contact during fermentation. Red wine derives its color, structure, and preservative tannins from weeks of maceration with grape skins and seeds.',
      'White wines are generally pressed immediately before fermentation, preserving fragile florality, citrus aromatics, and focused linear acidity.',
      'Understanding this dynamic helps you anticipate mouthfeel: red wines stimulate the back of the palate through dry phenolic tannins, while white wines awaken the sides of the tongue through vibrant salivating acidity.'
    ],
    keyTakeaways: [
      'Tannins come from grape skins and oak barrels, providing age-worthiness.',
      'White wines rely heavily on natural fruit acidity for structure and longevity.',
      'Temperature dramatically affects perception: serve whites cool, reds cellar-cool.'
    ],
    sommelierQuote: '“Tannin gives structure to memory; acidity gives freshness to desire.”'
  },
  {
    id: 'guide-03',
    title: 'Understanding Wine Labels & Vintages',
    subtitle: 'De-coding Old World appellations vs. New World varietal labelling.',
    readTime: '7 min read',
    category: 'Connoisseurship',
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    excerpt: 'Why does French wine show the village while Californian wine shows the grape? Master the language of wine labels.',
    content: [
      'Old World wine labels (France, Italy, Spain, Germany) prioritize Appellation d’Origine Contrôlée (AOC/DOC). The label tells you where the grapes grew (e.g., Margaux or Barolo), assuming you know the traditional grapes codified for that terroir for centuries.',
      'New World labels (United States, New Zealand, Australia, Chile) celebrate the grape variety itself (e.g., Cabernet Sauvignon, Pinot Noir), emphasizing winemaker style and single-vineyard pride.',
      'The vintage represents the specific weather cycle of that harvesting year. A hot, dry year produces higher alcohol and jammy fruit; a cooler vintage yields taut, mineral, and longevity-focused wines.'
    ],
    keyTakeaways: [
      'Old World equals Place (Terroir); New World equals Grape (Varietal).',
      'Grand Cru and Premier Cru denote the most historically prestigious vineyard parcels.',
      'Vintage matters most in marginal cool climates like Champagne, Burgundy, and Mosel.'
    ],
    sommelierQuote: '“The label is a love letter written in the geography of a single harvest.”'
  },
  {
    id: 'guide-04',
    title: 'The Art of Wine and Food Pairing',
    subtitle: 'The golden balance: harmonizing acid, fat, tannin, and sweetness.',
    readTime: '6 min read',
    category: 'Gastronomy',
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    excerpt: 'Classic sommelier rules that will elevate every meal: acidity cuts richness, tannin softens with protein, and sweetness demands company.',
    content: [
      'The primary rule of gastronomic pairing is balance. High-fat dishes (like marbled steaks or duck confit) coat the tongue; a wine with firm tannins or sharp acidity cleanses the palate with every sip, making each bite feel as fresh as the first.',
      'Beware of sugar: a dry wine paired with a sweet dessert will taste bitter and unpleasantly hollow. The wine must always be as sweet or sweeter than the dish.',
      'Champagne and sparkling wines are the culinary secret weapon: their carbonation and pristine minerality cut through everything from salty caviar to rich fried poultry.'
    ],
    keyTakeaways: [
      'Fat cuts tannin; acid cuts fat.',
      'Sweet dishes require wine with equal or greater residual sugar.',
      'When uncertain, Champagne is universally gastronomic.'
    ],
    sommelierQuote: '“A great pairing does not make the wine better, or the food better; it creates a third flavor that did not exist before.”'
  },
  {
    id: 'guide-05',
    title: 'How to Store & Cellar Wine in Tropical Climates',
    subtitle: 'Protecting your bottles in Davao: heat, humidity, vibration, and light.',
    readTime: '5 min read',
    category: 'Collector Guide',
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    excerpt: 'In Davao City’s tropical heat, room temperature will quickly spoil fine wine. Learn the vital conditions for tropical cellaring.',
    content: [
      'Wine is an organic, living substance that evolves slowly through micro-oxygenation. In tropical climates like Davao where ambient temperatures exceed 30°C, wine will cook and lose fruit freshness within weeks without climate control.',
      'The ideal temperature for long-term cellaring is 12°C–14°C (53°F–57°F). All VÍNEA Davao branches and delivery vans maintain active 24/7 cooling to ensure uninterrupted cold-chain integrity.',
      'Humidity should hover around 65%–75% to keep natural corks moist and airtight. Lay bottles horizontally so the liquid remains in direct contact with the cork.'
    ],
    keyTakeaways: [
      'Never store fine wine at ambient tropical temperature in the Philippines.',
      'Target 13°C (55°F) with dedicated wine chilling cabinets.',
      'Our Davao delivery vans are custom-chilled to maintain provenance.'
    ],
    sommelierQuote: '“Temperature is the soul of wine preservation. In the tropics, cold-chain is non-negotiable.”'
  },
  {
    id: 'guide-06',
    title: 'Understanding Wine Tasting Notes Like a Sommelier',
    subtitle: 'From Sight and Swirl to the Finish: decoding the 5 S method.',
    readTime: '6 min read',
    category: 'Sensory Skills',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    excerpt: 'See, Swirl, Sniff, Sip, Savor. Transform vague impressions into evocative, precise tasting notes.',
    content: [
      'Tasting begins with the eyes. Tilt your glass against a white background: a deep purple rim suggests youth; an amber or brick rim signals graceful aging and tertiary complexity.',
      'Swirling introduces ambient oxygen, releasing hundreds of volatile aroma compounds. Take three short, gentle sniffs rather than one long inhale.',
      'Separate aromas into Primary (fresh fruit, flowers from the grape), Secondary (brioche, vanilla from oak and fermentation), and Tertiary (leather, tobacco, forest floor from bottle aging).'
    ],
    keyTakeaways: [
      'Observe the rim for clues on age and grape skin thickness.',
      'Distinguish primary fruit from oak and bottle age tertiary notes.',
      'The length of the finish is the truest benchmark of wine greatness.'
    ],
    sommelierQuote: '“Tasting is simply paying attention to what your palate has always known.”'
  }
];
