export type WineType = 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert';

export type SweetnessLevel = 'Bone Dry' | 'Dry' | 'Semi-Dry' | 'Sweet';
export type WineBody = 'Light' | 'Medium' | 'Full';
export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';

export interface TastingNotes {
  aroma: string[];
  palate: string;
  finish: string;
}

export interface Review {
  review_id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  rating: number;
  comment: string;
  review_date: string;
}

export interface Product {
  product_id: string;
  name: string;
  winery: string;
  country: string;
  region: string;
  vintage: number;
  wine_type: WineType;
  grape_variety: string;
  alcohol_percentage: number;
  sweetness: SweetnessLevel;
  body: WineBody;
  price: number;
  original_price?: number;
  stock: number;
  image: string;
  bottle_color?: string;
  accent_color?: string;
  description: string;
  rating: number;
  reviews_count: number;
  featured?: boolean;
  category_id: string;
  tasting_notes: TastingNotes;
  food_pairings: string[];
  serving_temp: string;
  decanting: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  description: string;
  image: string;
  slug: string;
  item_count?: number;
}

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  order_item_id: string;
  product_id: string;
  name: string;
  winery: string;
  vintage: number;
  quantity: number;
  price: number;
  image: string;
  wine_type: WineType;
}

export interface Order {
  order_id: string;
  user_id: string;
  customer_name: string;
  email: string;
  phone: string;
  order_date: string;
  subtotal: number;
  shipping: number;
  discount: number;
  discount_code?: string;
  total_amount: number;
  payment_method: 'Credit/Debit Card' | 'E-Wallet' | 'Cash on Delivery';
  delivery_address: DeliveryAddress;
  status: OrderStatus;
  items: OrderItem[];
  estimated_delivery: string;
  tracking_number?: string;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  saved_addresses?: DeliveryAddress[];
  member_since?: string;
  // Customizable & additional customer information:
  date_of_birth?: string;
  preferred_wine_types?: WineType[];
  flavor_preference?: string;
  favorite_davao_branch?: string;
  delivery_instructions?: string;
  membership_tier?: 'Connoisseur' | 'Grand Cru' | 'Sommelier Reserve';
  bio?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  image: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
  sommelierQuote: string;
}

export interface DavaoBranch {
  id: string;
  name: string;
  district: string;
  address: string;
  landmark: string;
  phone: string;
  operatingHours: string;
  features: string[];
  image: string;
  isFlagship?: boolean;
  mapCoordinates?: string;
}

