import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { Product, Category, CartItem, Order, User, Review, GuideArticle, OrderStatus, DeliveryAddress, LoyaltyHistoryItem, UserVoucher } from '../types/wine';
import {
  PUBLIC_PROMO_VOUCHERS,
  getPerkBenefit,
  extractUserVouchers,
  MEMBER_PERKS
} from '../data/rewardsData';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USER,
  INITIAL_REGISTERED_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  GUIDE_ARTICLES
} from '../data/mockData';
import {
  checkPostgresHealth,
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  updateProductStockApi,
  deleteProductApi,
  fetchCategoriesApi,
  createCategoryApi,
  deleteCategoryApi,
  fetchOrdersApi,
  createOrderApi,
  updateOrderStatusApi,
  fetchUsersApi,
  saveUserApi,
  fetchReviewsApi,
  createReviewApi,
  fetchSessionApi,
  saveSessionApi,
  clearSessionApi
} from '../services/apiClient';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  seedInitialDataIfEmpty,
  syncAllCatalogToSupabase,
  syncCatalogProductsToSupabase,
  CatalogSyncResult,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  saveOrderToSupabase,
  syncAllLocalOrdersToSupabase,
  updateOrderStatusInSupabase,
  saveProductToSupabase,
  updateProductStockInSupabase,
  deleteProductFromSupabase,
  saveUserToSupabase,
  syncAllLocalUsersToSupabase,
  fetchUsersFromSupabase,
  saveReviewToSupabase,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut
} from '../services/dbService';
import { revokeGateSession } from '../lib/adminSecurity';
import {
  validateGmail,
  validatePhone11Digit,
  validateAddress,
  validateFullName
} from '../utils/validation';
import {
  saveCustomPhoto,
  deleteCustomPhoto,
  getAllCustomPhotosSync,
  loadAllCustomPhotosFromDb,
  safeSaveCurrentUserToLocalStorage,
  setExplicitLogoutFlag,
  isExplicitlyLoggedOut,
  saveCurrentUserToDb,
  loadCurrentUserFromDb,
  saveUserAvatarToDb,
  loadUserAvatarFromDb
} from '../utils/customPhotoStorage';


export type NavTab = 'home' | 'shop' | 'red' | 'white' | 'rose' | 'sparkling' | 'collections' | 'branches' | 'about' | 'guide' | 'account' | 'admin';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  title: string;
}

interface WineStoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  user: User | null;
  registeredUsers: User[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authRedirectReason: string | null;
  isAdminMode: boolean;
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  isVisitingAdmin: boolean;
  ageVerified: boolean;
  underageBlocked: boolean;
  activeTab: NavTab;
  searchQuery: string;
  selectedProduct: Product | null;
  quickViewProduct: Product | null;
  selectedGuideArticle: GuideArticle | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAccountOpen: boolean;
  accountActiveSubTab: 'orders' | 'tracking' | 'rewards' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses';
  isQuizOpen: boolean;
  activeOrderConfirmation: Order | null;
  viewingDigitalReceiptOrder: Order | null;
  toasts: ToastMessage[];

  // Actions
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: NavTab) => void;
  setSelectedProduct: (p: Product | null) => void;
  setQuickViewProduct: (p: Product | null) => void;
  setSelectedGuideArticle: (a: GuideArticle | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setAccountActiveSubTab: (tab: 'orders' | 'tracking' | 'rewards' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses') => void;
  openWishlist: () => void;
  setIsQuizOpen: (open: boolean) => void;
  setActiveOrderConfirmation: (o: Order | null) => void;
  setViewingDigitalReceiptOrder: (o: Order | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  setAuthRedirectReason: (reason: string | null) => void;
  loginCustomer: (email: string, password: string) => { success: boolean; error?: string };
  registerCustomer: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    date_of_birth?: string;
    favorite_davao_branch?: string;
    saved_addresses?: DeliveryAddress[];
  }) => { success: boolean; error?: string };
  logoutCustomer: () => void;
  updateUserProfile: (
    updates: Partial<User>,
    options?: { fallbackAvatarDataUrl?: string; silent?: boolean }
  ) => { success: boolean; error?: string };
  changeCustomerPassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  redeemPerk: (perkId: string, pointCost: number, perkTitle: string) => { success: boolean; code?: string; message: string };
  requireAuthForAction: (reason?: string) => boolean;
  setIsAdminMode: (admin: boolean) => void;
  setIsVisitingAdmin: (visiting: boolean) => void;
  enterAdminPortal: () => void;
  exitAdminPortal: () => void;
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  loginWithSecretCode: (secretCode: string) => { success: boolean; error?: string };
  adminSecretCode: string;
  updateAdminSecretCode: (newCode: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  placeOrder: (order: Omit<Order, 'order_id' | 'order_date' | 'status' | 'tracking_number'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  addProduct: (product: Omit<Product, 'product_id' | 'rating' | 'reviews_count'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;

  addCategory: (cat: Omit<Category, 'category_id'>) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (catId: string) => void;

  addReview: (productId: string, rating: number, comment: string) => void;

  verifyAge: (remember: boolean) => void;
  rejectAge: () => void;
  resetAgeGate: () => void;

  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  cartSubtotal: number;
  cartCount: number;
  userVouchers: UserVoucher[];
  appliedVoucher: UserVoucher | null;
  applyVoucherCode: (codeInput: string) => { success: boolean; message: string; voucher?: UserVoucher };
  removeAppliedVoucher: () => void;
  calculateOrderTotals: (subtotal: number, voucher?: UserVoucher | null) => {
    baseShipping: number;
    shippingCost: number;
    discountAmount: number;
    shippingDiscount: number;
    totalAmount: number;
  };
  isCloudConnected: boolean;
  isPostgresConnected: boolean;
  isSupabaseConnected: boolean;
  isSupabaseConfigOpen: boolean;
  setIsSupabaseConfigOpen: (open: boolean) => void;
  syncOrdersToSupabase: () => Promise<void>;
  syncUsersToSupabase: () => Promise<{ syncedCount: number; failedCount: number; lastError?: string }>;
  syncCatalogToSupabase: () => Promise<CatalogSyncResult>;
}

const WineStoreContext = createContext<WineStoreContextType | undefined>(undefined);

const DEFAULT_AVATAR_MARKER = 'images.unsplash.com/photo-1534528741775-53994a69daeb';

function isDefaultAvatarUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  return url.includes(DEFAULT_AVATAR_MARKER);
}

function getPerUserAvatarFromLocalStorage(email?: string, userId?: string): string | undefined {
  if (typeof window === 'undefined' || !window.localStorage) return undefined;
  try {
    const byEmail = email ? localStorage.getItem(`vinea_user_avatar_${email.toLowerCase().trim()}`) : null;
    if (byEmail && !isDefaultAvatarUrl(byEmail)) return byEmail;
    const byId = userId ? localStorage.getItem(`vinea_user_avatar_${userId}`) : null;
    if (byId && !isDefaultAvatarUrl(byId)) return byId;
    return byEmail || byId || undefined;
  } catch {
    return undefined;
  }
}

function resolveBestAvatar(
  primary?: string,
  secondary?: string,
  email?: string,
  userId?: string
): string | undefined {
  if (primary && !isDefaultAvatarUrl(primary)) return primary;
  if (secondary && !isDefaultAvatarUrl(secondary)) return secondary;
  const lsAvatar = getPerUserAvatarFromLocalStorage(email, userId);
  if (lsAvatar && !isDefaultAvatarUrl(lsAvatar)) return lsAvatar;
  return primary || secondary || lsAvatar;
}

function safeSaveProductsToLocalStorage(list: Product[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const compact = list.map((p) => {
      const next = { ...p };
      if (typeof next.image === 'string' && next.image.startsWith('data:') && next.image.length > 60000) {
        next.image = '';
      }
      if (Array.isArray(next.images)) {
        next.images = next.images.filter((img) => !(typeof img === 'string' && img.startsWith('data:') && img.length > 60000));
      }
      return next;
    });
    localStorage.setItem('vinea_products', JSON.stringify(compact));
  } catch (e) {
    console.warn('[ProductsStorage] LocalStorage cache write skipped:', e);
  }
}

function safeSaveUsersToLocalStorage(list: User[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const compact = list.map((u) => {
      if (typeof u.avatar === 'string' && u.avatar.startsWith('data:') && u.avatar.length > 50000) {
        return { ...u, avatar: undefined };
      }
      return u;
    });
    localStorage.setItem('vinea_registered_users', JSON.stringify(compact));
  } catch (e) {
    console.warn('[UsersStorage] LocalStorage cache write skipped:', e);
  }
}

const VALID_NAV_TABS: NavTab[] = ['home', 'shop', 'red', 'white', 'rose', 'sparkling', 'collections', 'branches', 'about', 'guide', 'account'];
const VALID_ACCOUNT_SUB_TABS = ['orders', 'tracking', 'rewards', 'profile', 'avatar', 'password', 'preferences', 'wishlist', 'addresses'] as const;

export const WineStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Storage hydration
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_products');
      let base: Product[] = INITIAL_PRODUCTS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Product) => p.product_id));
          const missing = INITIAL_PRODUCTS.filter((p: Product) => !existingIds.has(p.product_id));
          base = [...parsed, ...missing];
        }
      }
      const customPhotos = getAllCustomPhotosSync();
      if (customPhotos && Object.keys(customPhotos).length > 0) {
        base = base.map((p: Product) => {
          const custom = customPhotos[p.product_id];
          if (custom && custom.image) {
            const isBaseUploaded = p.image && (p.image.includes('/images/uploads/') || p.image.startsWith('data:'));
            const isCustomUploaded = custom.image.includes('/images/uploads/') || custom.image.startsWith('data:');
            if (isCustomUploaded || !isBaseUploaded) {
              return {
                ...p,
                image: custom.image,
                images: custom.images && custom.images.length > 0 ? custom.images : p.images
              };
            }
          }
          return p;
        });
      }
      return base;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Clean legacy mock favorites so new or unauthenticated users start with 0 favorites
      if (
        Array.isArray(parsed) &&
        parsed.length === 2 &&
        parsed.includes('prod-001') &&
        parsed.includes('prod-005')
      ) {
        try {
          localStorage.removeItem('vinea_wishlist');
        } catch {}
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_orders');
      let base: Order[] = INITIAL_ORDERS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (o: Order) =>
              o.email !== 'maria.santos@vinea.ph' &&
              o.order_id !== 'VN-98421' &&
              o.order_id !== 'VN-96104'
          );
          const existingOrderIds = new Set(filtered.map((o: Order) => o.order_id));
          const missing = INITIAL_ORDERS.filter((o: Order) => !existingOrderIds.has(o.order_id));
          base = [...filtered, ...missing];
        }
      }
      return base;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_registered_users');
      let base: User[] = INITIAL_REGISTERED_USERS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove legacy demo accounts, preserving authentic user-created accounts
          const filtered = parsed.filter(
            (u: User) =>
              u.email !== 'maria.santos@vinea.ph' &&
              u.email !== 'roberto.tan@vinea.ph' &&
              u.user_id !== 'usr-101' &&
              u.user_id !== 'usr-102'
          );
          const existingEmails = new Set(filtered.map((u: User) => u.email.toLowerCase()));
          const missing = INITIAL_REGISTERED_USERS.filter((u: User) => !existingEmails.has(u.email.toLowerCase()));
          base = [...filtered, ...missing];
        }
      }
      return base;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      if (isExplicitlyLoggedOut()) return null;
      const saved = localStorage.getItem('vinea_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const bestAvatar = resolveBestAvatar(parsed.avatar, undefined, parsed.email, parsed.user_id);
          if (bestAvatar) {
            parsed.avatar = bestAvatar;
          }
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const userRef = useRef<User | null>(user);
  userRef.current = user;

  const persistActiveUserSession = (activeUser: User) => {
    setExplicitLogoutFlag(false);
    safeSaveCurrentUserToLocalStorage(activeUser);
    saveCurrentUserToDb(activeUser).catch(() => {});
    saveSessionApi(activeUser).catch(() => {});
    if (activeUser.avatar && !isDefaultAvatarUrl(activeUser.avatar)) {
      saveUserAvatarToDb(activeUser.user_id, activeUser.email, activeUser.avatar).catch(() => {});
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authRedirectReason, setAuthRedirectReason] = useState<string | null>(null);
  const [accountActiveSubTab, setAccountActiveSubTab] = useState<'orders' | 'tracking' | 'rewards' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses'>(() => {
    try {
      const saved = sessionStorage.getItem('vinea_account_sub_tab') as any;
      if (saved && (VALID_ACCOUNT_SUB_TABS as readonly string[]).includes(saved)) {
        return saved;
      }
    } catch {}
    return 'orders';
  });

  const openWishlist = () => {
    setAccountActiveSubTab('wishlist');
    setIsAccountOpen(true);
  };

  const [ageVerified, setAgeVerified] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vinea_age_verified');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [underageBlocked, setUnderageBlocked] = useState<boolean>(false);

  // App UI state
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    try {
      const saved = sessionStorage.getItem('vinea_active_tab') as NavTab | null;
      if (saved && VALID_NAV_TABS.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'home';
  });
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const checkAdminRoute = (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      return (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('portal=admin') ||
        search.includes('admin=true')
      );
    } catch {
      return false;
    }
  };

  const [isVisitingAdmin, setIsVisitingAdmin] = useState<boolean>(() => checkAdminRoute());

  useEffect(() => {
    const handleUrlChange = () => {
      setIsVisitingAdmin(checkAdminRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Keyboard shortcut for authorized cellar staff: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsVisitingAdmin(prev => {
          const next = !prev;
          if (next) {
            window.location.hash = '#/admin';
          } else {
            if (window.location.hash.includes('admin')) {
              history.pushState('', document.title, window.location.pathname + window.location.search);
            }
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vinea_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('vinea_admin_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed.name.includes('Julian Vance')) {
          parsed.name = parsed.name.replace('Julian Vance', 'Kent Jorich Rabago');
          try {
            localStorage.setItem('vinea_admin_user', JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [adminSecretCode, setAdminSecretCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem('vinea_admin_secret_code') || 'vinea2026';
    } catch {
      return 'vinea2026';
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedGuideArticle, setSelectedGuideArticle] = useState<GuideArticle | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [activeOrderConfirmation, setActiveOrderConfirmation] = useState<Order | null>(null);
  const [viewingDigitalReceiptOrder, setViewingDigitalReceiptOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<UserVoucher | null>(() => {
    try {
      const saved = sessionStorage.getItem('vinea_applied_voucher');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isPostgresConnected, setIsPostgresConnected] = useState<boolean>(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState<boolean>(false);

  const userVouchers = useMemo(() => extractUserVouchers(user, orders), [user, orders]);

  useEffect(() => {
    try {
      if (appliedVoucher) {
        sessionStorage.setItem('vinea_applied_voucher', JSON.stringify(appliedVoucher));
      } else {
        sessionStorage.removeItem('vinea_applied_voucher');
      }
    } catch {}
  }, [appliedVoucher]);

  useEffect(() => {
    if (!appliedVoucher) return;
    if (!appliedVoucher.is_public_promo) {
      if (!user) {
        setAppliedVoucher(null);
        return;
      }
      const match = userVouchers.find(v => v.code.toUpperCase() === appliedVoucher.code.toUpperCase());
      if (match && match.status === 'used') {
        setAppliedVoucher(null);
      }
    }
  }, [user, userVouchers, appliedVoucher]);

  const calculateOrderTotals = (subtotal: number, voucher: UserVoucher | null = appliedVoucher) => {
    const baseShipping = subtotal === 0 || subtotal >= 5000 ? 0 : 350;
    let shippingCost = baseShipping;
    let discountAmount = 0;
    let shippingDiscount = 0;

    if (voucher && subtotal > 0) {
      if (voucher.discount_type === 'fixed') {
        discountAmount = Math.min(subtotal, Math.max(0, voucher.discount_value));
      } else if (voucher.discount_type === 'percent') {
        discountAmount = Math.min(subtotal, Math.round((subtotal * Math.max(0, voucher.discount_value)) / 100));
      } else if (voucher.discount_type === 'free_shipping') {
        shippingDiscount = baseShipping;
        shippingCost = 0;
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount) + shippingCost;
    return {
      baseShipping,
      shippingCost,
      discountAmount,
      shippingDiscount,
      totalAmount
    };
  };

  const applyVoucherCode = (codeInput: string): { success: boolean; message: string; voucher?: UserVoucher } => {
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'Please enter a voucher or promotion code.' };
    }

    // 1. Check logged-in member's redeemed reward vouchers
    const userMatch = userVouchers.find(v => v.code.toUpperCase() === code);
    if (userMatch) {
      if (userMatch.status === 'used') {
        showToast(`Voucher ${code} has already been redeemed.`, 'error');
        return { success: false, message: 'This voucher code has already been used on a previous order.' };
      }
      setAppliedVoucher(userMatch);
      showToast(`Applied voucher ${userMatch.code}: ${userMatch.title}`, 'success');
      return {
        success: true,
        voucher: userMatch,
        message: `${userMatch.title} (${userMatch.code}) applied to your order.`
      };
    }

    // 2. Check public promotional codes (VINEA10, SOMMELIER)
    const publicPromo = PUBLIC_PROMO_VOUCHERS[code];
    if (publicPromo) {
      setAppliedVoucher(publicPromo);
      showToast(`Applied promotion ${publicPromo.code}: ${publicPromo.title}`, 'success');
      return {
        success: true,
        voucher: publicPromo,
        message: `${publicPromo.title} (${publicPromo.code}) applied to your order.`
      };
    }

    if (!user && code.startsWith('VN-RW-')) {
      showToast('Please sign in to apply your personal VÍNEA Rewards voucher.', 'info');
      return { success: false, message: 'Sign in to your member account to apply personal reward vouchers.' };
    }

    showToast('Invalid or unrecognized voucher code.', 'error');
    return { success: false, message: 'Invalid voucher code. Check your Rewards Wallet or try VINEA10 / SOMMELIER.' };
  };

  const removeAppliedVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher removed from order.', 'info');
  };

  // Supabase & PostgreSQL real-time synchronization & initial boot
  useEffect(() => {
    let isMounted = true;
    let unsubProducts: () => void = () => {};
    let unsubCats: () => void = () => {};
    let unsubOrders: () => void = () => {};

    const initDb = async () => {
      try {
        const isHealthy = await checkPostgresHealth();
        if (isHealthy && isMounted) {
          setIsPostgresConnected(true);
          setIsCloudConnected(true);
        }

        // Initialize and seed Supabase if empty
        const seedResult = await seedInitialDataIfEmpty().catch(() => null);
        if (seedResult && seedResult.success && isMounted) {
          showToast(`Supabase tables were empty: Auto-seeded ${seedResult.productsCount} luxury wines & ${seedResult.categoriesCount} categories!`, 'success');
        }

        // Pre-load durable custom product photos from IndexedDB & Memory
        const dbPhotos = await loadAllCustomPhotosFromDb();

        // Fetch persisted data from PostgreSQL / Supabase backend
        const [pgProducts, pgCategories, pgOrders, pgUsers, pgReviews] = await Promise.all([
          fetchProductsApi(),
          fetchCategoriesApi(),
          fetchOrdersApi(),
          fetchUsersApi(),
          fetchReviewsApi()
        ]);

        if (isMounted) {
          if (pgProducts && pgProducts.length > 0) {
            let localProds: Product[] = [];
            try {
              const savedProds = localStorage.getItem('vinea_products');
              if (savedProds) localProds = JSON.parse(savedProds);
            } catch {}

            const mergedProducts: Product[] = pgProducts.map((p) => {
              const customInfo = dbPhotos[p.product_id] || getAllCustomPhotosSync()[p.product_id];
              const localMatch = localProds.find(lp => lp.product_id === p.product_id);

              // Determine authoritative image & gallery:
              const isBackendUploaded = Boolean(p.image && (p.image.includes('/images/uploads/') || p.image.startsWith('data:')));
              const isCustomUploaded = Boolean(customInfo?.image && (customInfo.image.includes('/images/uploads/') || customInfo.image.startsWith('data:')));
              const isLocalUploaded = Boolean(localMatch?.image && (localMatch.image.includes('/images/uploads/') || localMatch.image.startsWith('data:')));

              let resolvedImage = p.image;
              let resolvedImages = p.images || [];

              if (isBackendUploaded) {
                resolvedImage = p.image;
                resolvedImages = p.images && p.images.length > 0 ? p.images : resolvedImages;
              } else if (isCustomUploaded) {
                resolvedImage = customInfo!.image!;
                resolvedImages = customInfo!.images && customInfo!.images.length > 0 ? customInfo!.images : resolvedImages;
              } else if (isLocalUploaded) {
                resolvedImage = localMatch!.image!;
                resolvedImages = localMatch!.images && localMatch!.images.length > 0 ? localMatch!.images : resolvedImages;
              } else if (customInfo?.image) {
                resolvedImage = customInfo.image;
                resolvedImages = customInfo.images && customInfo.images.length > 0 ? customInfo.images : resolvedImages;
              } else if (localMatch?.image) {
                resolvedImage = localMatch.image;
                resolvedImages = localMatch.images && localMatch.images.length > 0 ? localMatch.images : resolvedImages;
              }

              // Keep cache synchronized with active photo
              if (resolvedImage && (resolvedImage.includes('/images/uploads/') || resolvedImage.startsWith('data:'))) {
                saveCustomPhoto(p.product_id, {
                  image: resolvedImage,
                  images: resolvedImages
                }).catch(() => {});
              }

              return {
                ...p,
                image: resolvedImage,
                images: resolvedImages
              };
            });

            // Also preserve any custom products created locally
            const pgProductIds = new Set(pgProducts.map(p => p.product_id));
            const extraLocalProds = localProds.filter(lp => !pgProductIds.has(lp.product_id));
            if (extraLocalProds.length > 0) {
              mergedProducts.unshift(...extraLocalProds);
              extraLocalProds.forEach(ep => createProductApi(ep).catch(() => {}));
            }

            // Ensure catalog is never truncated if backend had only partial items
            const currentIds = new Set(mergedProducts.map(p => p.product_id));
            const missingFromCatalog = INITIAL_PRODUCTS.filter(p => !currentIds.has(p.product_id));
            if (missingFromCatalog.length > 0) {
              mergedProducts.push(...missingFromCatalog);
            }

            safeSaveProductsToLocalStorage(mergedProducts);

            setProducts(mergedProducts);
          } else {
            // When backend is unavailable (e.g. static host/Vercel without Express),
            // ensure any photos from IndexedDB are actively applied
            if (Object.keys(dbPhotos).length > 0) {
              setProducts(prev => prev.map(p => {
                const custom = dbPhotos[p.product_id];
                if (custom && custom.image) {
                  return {
                    ...p,
                    image: custom.image,
                    images: custom.images && custom.images.length > 0 ? custom.images : p.images
                  };
                }
                return p;
              }));
            }
          }
          if (pgCategories && pgCategories.length > 0) {
            setCategories(pgCategories);
          }
          if (pgOrders && pgOrders.length > 0) {
            setOrders(pgOrders);
          }

          // Restore active user session from IndexedDB or backend /api/session if localStorage was empty/evicted
          if (!isExplicitlyLoggedOut()) {
            const [dbSessionUser, apiSessionUser] = await Promise.all([
              loadCurrentUserFromDb<User>().catch(() => null),
              fetchSessionApi().catch(() => null)
            ]);

            if (!isMounted) return;

            if (!userRef.current) {
              const recovered = apiSessionUser || dbSessionUser;
              if (recovered) {
                const storedAvatar = await loadUserAvatarFromDb(recovered.user_id, recovered.email).catch(() => null);
                const bestAvatar = resolveBestAvatar(
                  storedAvatar?.avatar && !isDefaultAvatarUrl(storedAvatar.avatar) ? storedAvatar.avatar : recovered.avatar,
                  recovered.avatar,
                  recovered.email,
                  recovered.user_id
                );
                const restoredUser: User = bestAvatar ? { ...recovered, avatar: bestAvatar } : recovered;
                userRef.current = restoredUser;
                setUser(restoredUser);
                safeSaveCurrentUserToLocalStorage(restoredUser);
                saveCurrentUserToDb(restoredUser).catch(() => {});
              }
            } else {
              // Ensure custom avatar from IndexedDB restores if current session has missing/default avatar
              const activeUser = userRef.current;
              const storedAvatar = await loadUserAvatarFromDb(activeUser.user_id, activeUser.email).catch(() => null);
              if (storedAvatar?.avatar && !isDefaultAvatarUrl(storedAvatar.avatar) && isDefaultAvatarUrl(activeUser.avatar)) {
                const hydrated = { ...activeUser, avatar: storedAvatar.avatar };
                userRef.current = hydrated;
                setUser(hydrated);
                persistActiveUserSession(hydrated);
              } else {
                // Keep backend & IndexedDB sessions warm for future refreshes
                saveCurrentUserToDb(activeUser).catch(() => {});
                saveSessionApi(activeUser).catch(() => {});
              }
            }
          }

          if (pgUsers && pgUsers.length > 0 && isMounted) {
            setRegisteredUsers(prev => {
              const prevByEmail = new Map(prev.map(u => [u.email.toLowerCase(), u]));
              return pgUsers.map(pu => {
                const localExisting = prevByEmail.get(pu.email.toLowerCase());
                const bestAvatar = resolveBestAvatar(
                  localExisting?.avatar,
                  pu.avatar,
                  pu.email,
                  pu.user_id
                );
                return bestAvatar ? { ...pu, avatar: bestAvatar } : pu;
              });
            });

            // Non-destructive sync with active customer session (never clobber custom avatar or newer local edits)
            const activeUser = userRef.current;
            if (activeUser) {
              const currentMatch = pgUsers.find(
                mu => mu.user_id === activeUser.user_id || mu.email.toLowerCase() === activeUser.email.toLowerCase()
              );
              const storedAvatar = await loadUserAvatarFromDb(activeUser.user_id, activeUser.email).catch(() => null);
              const customDbAvatar = storedAvatar?.avatar && !isDefaultAvatarUrl(storedAvatar.avatar) ? storedAvatar.avatar : undefined;
              const preservedAvatar = resolveBestAvatar(
                activeUser.avatar,
                customDbAvatar || currentMatch?.avatar,
                activeUser.email,
                activeUser.user_id
              );

              if (preservedAvatar && preservedAvatar !== activeUser.avatar && isMounted) {
                const updatedActive = { ...activeUser, avatar: preservedAvatar };
                userRef.current = updatedActive;
                setUser(updatedActive);
                persistActiveUserSession(updatedActive);
              } else if (currentMatch && preservedAvatar && isDefaultAvatarUrl(currentMatch.avatar) && !isDefaultAvatarUrl(preservedAvatar)) {
                // Server had default placeholder while client has custom avatar; sync custom avatar back up
                saveUserApi({ ...activeUser, avatar: preservedAvatar }).catch(() => {});
              }
            }
          }
          if (pgReviews && pgReviews.length > 0 && isMounted) {
            setReviews(pgReviews);
          }
        }

        // Supabase user accounts synchronization
        if (isSupabaseConfigured) {
          const remoteUsers = await fetchUsersFromSupabase().catch(() => null);
          if (remoteUsers && remoteUsers.length > 0 && isMounted) {
            setRegisteredUsers(prev => {
              const prevByEmail = new Map(prev.map(u => [u.email.toLowerCase(), u]));
              const map = new Map<string, User>();
              remoteUsers.forEach(u => {
                const localExisting = prevByEmail.get(u.email.toLowerCase());
                const bestAvatar = resolveBestAvatar(
                  localExisting?.avatar,
                  u.avatar,
                  u.email,
                  u.user_id
                );
                map.set(u.email.toLowerCase(), bestAvatar ? { ...u, avatar: bestAvatar } : u);
              });
              prev.forEach(u => {
                if (!map.has(u.email.toLowerCase())) {
                  map.set(u.email.toLowerCase(), u);
                }
              });
              return Array.from(map.values());
            });
          }

          // Auto-sync any user-created accounts residing in localStorage up to Supabase
          try {
            const localSaved = localStorage.getItem('vinea_registered_users');
            if (localSaved) {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const res = await syncAllLocalUsersToSupabase(parsed);
                if (res.syncedCount > 0 && isMounted) {
                  console.log(`[Supabase User Sync] Synced ${res.syncedCount} local accounts to Supabase.`);
                }
              }
            }
          } catch {}
        }
      } catch (err) {
        console.warn('Database initialization note:', err);
      }
    };

    initDb();

    // Setup Supabase real-time channels if Supabase credentials are configured
    if (isSupabaseConfigured) {
      setIsSupabaseConnected(true);
      unsubProducts = subscribeToProducts((fresh) => {
        if (fresh && fresh.length > 0 && isMounted) {
          const freshMap = new Map(fresh.map((p) => [p.product_id, p]));
          const customPhotos = getAllCustomPhotosSync();

          // Merge with INITIAL_PRODUCTS so any products not yet in Supabase are preserved
          const complete = INITIAL_PRODUCTS.map((initProd) => {
            const raw = freshMap.get(initProd.product_id) || initProd;
            const custom = customPhotos[raw.product_id];
            if (custom && custom.image) {
              return {
                ...raw,
                image: custom.image,
                images: custom.images && custom.images.length > 0 ? custom.images : raw.images
              };
            }
            return raw;
          });

          // Also append any new custom products created in Supabase
          fresh.forEach((fp) => {
            if (!complete.some((m) => m.product_id === fp.product_id)) {
              const custom = customPhotos[fp.product_id];
              complete.push(
                custom && custom.image
                  ? { ...fp, image: custom.image, images: custom.images && custom.images.length > 0 ? custom.images : fp.images }
                  : fp
              );
            }
          });

          setProducts(complete);

          // Auto-sync missing items up to Supabase if Supabase was only partially seeded (e.g. 12 items)
          const missing = INITIAL_PRODUCTS.filter((p) => !freshMap.has(p.product_id));
          if (missing.length > 0) {
            syncCatalogProductsToSupabase(missing).catch((err) => {
              console.warn('[Auto-sync missing products to Supabase notice]:', err);
            });
          }
        }
      });
      unsubCats = subscribeToCategories((fresh) => {
        if (fresh && fresh.length > 0 && isMounted) setCategories(fresh);
      });
      unsubOrders = subscribeToOrders((fresh) => {
        if (fresh && fresh.length > 0 && isMounted) setOrders(fresh);
      });
    }

    return () => {
      isMounted = false;
      unsubProducts();
      unsubCats();
      unsubOrders();
    };
  }, []);

  // Listen for hash changes like #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsVisitingAdmin(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync to localStorage & sessionStorage cleanly
  useEffect(() => {
    safeSaveProductsToLocalStorage(products);
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('vinea_categories', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('vinea_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vinea_wishlist', JSON.stringify(wishlist));
      if (user?.user_id) {
        localStorage.setItem(`vinea_wishlist_${user.user_id}`, JSON.stringify(wishlist));
      }
      if (user?.email) {
        localStorage.setItem(`vinea_wishlist_${user.email.toLowerCase()}`, JSON.stringify(wishlist));
      }
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, user?.user_id, user?.email]);

  useEffect(() => {
    try {
      localStorage.setItem('vinea_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('vinea_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    safeSaveUsersToLocalStorage(registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    userRef.current = user;
    if (user) {
      safeSaveCurrentUserToLocalStorage(user);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (activeTab && activeTab !== 'admin') {
        sessionStorage.setItem('vinea_active_tab', activeTab);
      }
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    try {
      sessionStorage.setItem('vinea_account_sub_tab', accountActiveSubTab);
    } catch {}
  }, [accountActiveSubTab]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.product_id === product.product_id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          cart_item_id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product_id: product.product_id,
          product,
          quantity: Math.min(quantity, product.stock)
        }
      ];
    });

    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${product.name}" to your cart.`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find(c => c.cart_item_id === cartItemId);
    setCart(prev => prev.filter(i => i.cart_item_id !== cartItemId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cart_item_id === cartItemId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const product = products.find(p => p.product_id === productId);
      if (exists) {
        showToast(`Removed "${product?.name || 'Item'}" from your cellar wishlist.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved "${product?.name || 'Item'}" to your cellar wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders (requires authenticated customer)
  const placeOrder = (orderData: Omit<Order, 'order_id' | 'order_date' | 'status' | 'tracking_number'>): Order => {
    if (!user) {
      showToast('Authentication required: Please sign in or create an account to order.', 'error');
      setAuthRedirectReason('An active customer account is required to reserve cellar allocations and arrange climate-controlled Davao delivery.');
      setIsAuthModalOpen(true);
      throw new Error('Authentication required to place order');
    }

    // Strict error validation for orders
    const finalEmail = orderData.email || user.email;
    const emailRes = validateGmail(finalEmail);
    if (!emailRes.isValid) {
      showToast(emailRes.error || 'A valid @gmail.com address is required for dispatch.', 'error');
      throw new Error(emailRes.error);
    }

    const finalPhone = orderData.phone || user.phone;
    const phoneRes = validatePhone11Digit(finalPhone);
    if (!phoneRes.isValid) {
      showToast(phoneRes.error || 'An 11-digit mobile phone number is required for dispatch.', 'error');
      throw new Error(phoneRes.error);
    }

    const addrRes = validateAddress(orderData.delivery_address);
    if (!addrRes.isValid) {
      showToast(addrRes.firstError || 'Complete delivery address is required.', 'error');
      throw new Error(addrRes.firstError);
    }

    const newOrderId = `VN-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `VNX-DVO-${Math.floor(1000 + Math.random() * 9000)}PH`;
    const today = new Date().toISOString().split('T')[0];

    const newOrder: Order = {
      ...orderData,
      user_id: user.user_id,
      customer_name: user.name || orderData.customer_name,
      email: emailRes.normalized || finalEmail,
      phone: phoneRes.normalized || finalPhone,
      order_id: newOrderId,
      order_date: today,
      status: 'Processing',
      tracking_number: trackingNum
    };

    // Deduct stock
    setProducts(prev =>
      prev.map(prod => {
        const purchasedItem = orderData.items.find(i => i.product_id === prod.product_id);
        if (purchasedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - purchasedItem.quantity)
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveOrderConfirmation(newOrder);

    // Calculate & award loyalty points to the member
    const userTier = user.membership_tier || 'Connoisseur';
    const multiplier = userTier === 'Sommelier Reserve' ? 2.0 : userTier === 'Grand Cru' ? 1.5 : 1.0;
    const pointsEarned = Math.round((newOrder.subtotal / 10) * multiplier);
    const existingPts = user.loyalty_points ?? 0;
    const existingLifetime = user.lifetime_points ?? existingPts;
    const nextPoints = existingPts + pointsEarned;
    const nextLifetime = existingLifetime + pointsEarned;
    const updatedTier = nextPoints >= 7500 ? 'Sommelier Reserve' : nextPoints >= 2500 ? 'Grand Cru' : 'Connoisseur';

    const orderLoyaltyRecord: LoyaltyHistoryItem = {
      id: `hist-ord-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      title: `Order Allocation #${newOrderId} Completed`,
      description: `Earned ${pointsEarned} VÍNEA Points (${multiplier}x multiplier on ${newOrder.items.length} vintage(s))`,
      points: pointsEarned,
      type: 'order'
    };

    const appliedCodeUpper = orderData.discount_code?.trim().toUpperCase();
    let nextUserVouchers: UserVoucher[] = [...(user.vouchers || [])];
    if (appliedCodeUpper) {
      const matchedActive = userVouchers.find(v => v.code.toUpperCase() === appliedCodeUpper && !v.is_public_promo);
      if (matchedActive) {
        const existsInSaved = nextUserVouchers.some(v => v.code.toUpperCase() === appliedCodeUpper);
        if (existsInSaved) {
          nextUserVouchers = nextUserVouchers.map(v =>
            v.code.toUpperCase() === appliedCodeUpper
              ? { ...v, status: 'used', used_at: today, order_id: newOrderId }
              : v
          );
        } else {
          nextUserVouchers = [
            { ...matchedActive, status: 'used', used_at: today, order_id: newOrderId },
            ...nextUserVouchers
          ];
        }
      }
    }

    const updatedUserWithPoints: User = {
      ...user,
      loyalty_points: nextPoints,
      lifetime_points: nextLifetime,
      membership_tier: updatedTier,
      rewards_history: [orderLoyaltyRecord, ...(user.rewards_history || [])],
      vouchers: nextUserVouchers
    };

    userRef.current = updatedUserWithPoints;
    setUser(updatedUserWithPoints);
    setAppliedVoucher(null);
    try {
      sessionStorage.removeItem('vinea_applied_voucher');
    } catch {}
    persistActiveUserSession(updatedUserWithPoints);
    setRegisteredUsers(prev => prev.map(u => (u.user_id === user.user_id ? updatedUserWithPoints : u)));
    saveUserToSupabase(updatedUserWithPoints).catch(() => {});
    saveUserApi(updatedUserWithPoints).catch(() => {});

    showToast(`Order #${newOrderId} placed successfully! +${pointsEarned} VÍNEA Points earned.`, 'success');

    // Persist Order and updated stock to Supabase & backend silently in background (no technical database toasts to customer)
    saveOrderToSupabase(newOrder)
      .then((res) => {
        if (!res.success && res.error && res.code !== 'NOT_CONFIGURED') {
          console.warn('[Supabase Order Sync Note]:', res.error);
        }
      })
      .catch((e: unknown) => console.warn('Supabase order sync note:', e));

    createOrderApi(newOrder).catch((e: unknown) => console.warn('Order sync note:', e));
    orderData.items.forEach((item) => {
      const currentProd = products.find((p) => p.product_id === item.product_id);
      if (currentProd) {
        const nextStock = Math.max(0, currentProd.stock - item.quantity);
        updateProductStockInSupabase(item.product_id, nextStock).catch(() => {});
        updateProductStockApi(item.product_id, nextStock).catch(() => {});
      }
    });

    return newOrder;
  };

  const syncOrdersToSupabase = async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured yet. Set up credentials in footer first.', 'error');
      return;
    }
    showToast('Syncing orders to Supabase...', 'info');
    const res = await syncAllLocalOrdersToSupabase(orders);
    if (res.syncedCount > 0) {
      showToast(`Successfully synced ${res.syncedCount} order(s) to Supabase!`, 'success');
    } else if (res.lastError) {
      showToast(`Sync notice: ${res.lastError}`, 'error');
    } else {
      showToast('All orders are up to date in Supabase.', 'info');
    }
  };

  const syncUsersToSupabase = async (): Promise<{ syncedCount: number; failedCount: number; lastError?: string }> => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured yet. Set up credentials in footer first.', 'error');
      return { syncedCount: 0, failedCount: 0, lastError: 'Not configured' };
    }
    showToast('Syncing customer accounts to Supabase...', 'info');
    const res = await syncAllLocalUsersToSupabase(registeredUsers);
    if (res.syncedCount > 0) {
      showToast(`Successfully synced ${res.syncedCount} customer account(s) to live Supabase!`, 'success');
    } else if (res.lastError) {
      showToast(`User sync notice: ${res.lastError}`, 'error');
    } else {
      showToast('All customer accounts are already synchronized in Supabase.', 'info');
    }
    return res;
  };

  const syncCatalogToSupabase = async (): Promise<CatalogSyncResult> => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured yet. Connect credentials in footer first.', 'error');
      return { success: false, productsCount: 0, categoriesCount: 0, ordersCount: 0, usersCount: 0, error: 'Not configured' };
    }
    showToast('Uploading full wine catalog, categories & data to Supabase...', 'info');
    const res = await syncAllCatalogToSupabase();
    if (res.success) {
      showToast(`Successfully seeded ${res.productsCount} wines and ${res.categoriesCount} categories to Supabase!`, 'success');
    } else {
      showToast(`Catalog seeding notice: ${res.error || 'Failed to populate Supabase tables.'}`, 'error');
    }
    return res;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, status } : o))
    );
    updateOrderStatusInSupabase(orderId, status).catch(() => {});
    updateOrderStatusApi(orderId, status).catch((e: unknown) => console.warn('Status sync note:', e));
    showToast(`Order #${orderId} status changed to ${status}`, 'info');
  };

  // Product Management (Admin)
  const addProduct = (productData: Omit<Product, 'product_id' | 'rating' | 'reviews_count'>) => {
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      product_id: newId,
      rating: 5.0,
      reviews_count: 1
    };

    if (newProduct.image) {
      saveCustomPhoto(newId, {
        image: newProduct.image,
        images: newProduct.images || []
      }).catch(err => console.warn('[PhotoStorage] write note:', err));
    }

    setProducts(prev => {
      const next = [newProduct, ...prev];
      safeSaveProductsToLocalStorage(next);
      return next;
    });
    saveProductToSupabase(newProduct).catch(() => {});
    createProductApi(newProduct).catch((e: unknown) => console.warn('Product add note:', e));
    showToast(`Product "${newProduct.name}" added to catalog.`, 'success');
  };

  const updateProduct = (updated: Product) => {
    // 1. Immediately update multi-tiered custom photo storage (Memory + LocalStorage + IndexedDB)
    if (updated.image) {
      saveCustomPhoto(updated.product_id, {
        image: updated.image,
        images: updated.images || []
      }).catch(err => console.warn('[PhotoStorage] write note:', err));
    }

    // 2. Update React products state and quota-safe localStorage 'vinea_products' immediately
    setProducts(prev => {
      const next = prev.map(p => (p.product_id === updated.product_id ? updated : p));
      safeSaveProductsToLocalStorage(next);
      return next;
    });

    saveProductToSupabase(updated).catch(() => {});
    updateProductApi(updated).catch((e: unknown) => console.warn('Product update note:', e));
    showToast(`Updated "${updated.name}".`, 'success');
  };

  const deleteProduct = (productId: string) => {
    deleteCustomPhoto(productId).catch(() => {});

    const prod = products.find(p => p.product_id === productId);
    setProducts(prev => {
      const next = prev.filter(p => p.product_id !== productId);
      safeSaveProductsToLocalStorage(next);
      return next;
    });
    deleteProductFromSupabase(productId).catch(() => {});
    deleteProductApi(productId).catch((e: unknown) => console.warn('Product delete note:', e));
    showToast(`Deleted "${prod?.name || 'Wine'}" from catalog.`, 'info');
  };

  const updateProductStock = (productId: string, stock: number) => {
    setProducts(prev =>
      prev.map(p => (p.product_id === productId ? { ...p, stock: Math.max(0, stock) } : p))
    );
    updateProductStockInSupabase(productId, stock).catch(() => {});
    updateProductStockApi(productId, stock).catch((e: unknown) => console.warn('Stock update note:', e));
    showToast(`Stock updated to ${stock}.`, 'info');
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'category_id'>) => {
    const newId = `cat-${cat.slug || Date.now()}`;
    const newCat: Category = { ...cat, category_id: newId, item_count: 0 };
    setCategories(prev => [...prev, newCat]);
    createCategoryApi(newCat).catch((e: unknown) => console.warn('Category add note:', e));
    showToast(`Category "${cat.category_name}" created.`, 'success');
  };

  const updateCategory = (cat: Category) => {
    setCategories(prev => prev.map(c => (c.category_id === cat.category_id ? cat : c)));
    showToast(`Category "${cat.category_name}" updated.`, 'success');
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.category_id !== catId));
    deleteCategoryApi(catId).catch((e: unknown) => console.warn('Category delete note:', e));
    showToast(`Category removed.`, 'info');
  };

  // Reviews
  const addReview = (productId: string, rating: number, comment: string) => {
    const newReview: Review = {
      review_id: `rev-${Date.now()}`,
      user_id: user ? user.user_id : 'guest-101',
      user_name: user ? user.name : 'Davao Wine Connoisseur',
      product_id: productId,
      rating,
      comment,
      review_date: 'Just now'
    };

    setReviews(prev => [newReview, ...prev]);
    saveReviewToSupabase(newReview).catch(() => {});
    createReviewApi(newReview).catch((e: unknown) => console.warn('Review sync note:', e));

    // Recalculate average rating
    setProducts(prev =>
      prev.map(p => {
        if (p.product_id === productId) {
          const productReviews = [...reviews.filter(r => r.product_id === productId), newReview];
          const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviews_count: productReviews.length
          };
        }
        return p;
      })
    );

    showToast('Your tasting review has been shared with fellow collectors.', 'success');
  };

  // Age verification
  const verifyAge = (remember: boolean) => {
    setAgeVerified(true);
    setUnderageBlocked(false);
    if (remember) {
      try {
        localStorage.setItem('vinea_age_verified', 'true');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const rejectAge = () => {
    setAgeVerified(false);
    setUnderageBlocked(true);
  };

  const resetAgeGate = () => {
    try {
      localStorage.removeItem('vinea_age_verified');
    } catch {}
    setAgeVerified(false);
    setUnderageBlocked(false);
  };

  // Customer Authentication & Profile Customization
  const loginCustomer = (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const email = emailInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    // Check @gmail.com validation for customer accounts
    const emailRes = validateGmail(email);
    if (!emailRes.isValid) {
      return {
        success: false,
        error: emailRes.error || 'Customer sign in requires your registered @gmail.com address.'
      };
    }

    const matched = registeredUsers.find(u => u.email.toLowerCase() === email);
    if (!matched) {
      return {
        success: false,
        error: 'No customer account found with this email. Please check your spelling or create an account.'
      };
    }

    if (matched.password && matched.password !== pass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    // Restore and lock in customer profile photo from per-user storage & IndexedDB
    const savedAvatar = resolveBestAvatar(matched.avatar, undefined, email, matched.user_id);
    const userToSet = savedAvatar ? { ...matched, avatar: savedAvatar } : matched;
    userRef.current = userToSet;
    setUser(userToSet);
    persistActiveUserSession(userToSet);

    // Asynchronously hydrate any custom avatar stored in IndexedDB if current is default/missing
    loadUserAvatarFromDb(matched.user_id, email)
      .then((stored) => {
        if (stored?.avatar && !isDefaultAvatarUrl(stored.avatar) && isDefaultAvatarUrl(userToSet.avatar)) {
          const hydrated = { ...userToSet, avatar: stored.avatar };
          userRef.current = hydrated;
          setUser(hydrated);
          persistActiveUserSession(hydrated);
          setRegisteredUsers(prev => prev.map(u => (u.user_id === hydrated.user_id ? hydrated : u)));
        }
      })
      .catch(() => {});

    // Restore user session wishlist
    try {
      const userWishlistRaw = localStorage.getItem(`vinea_wishlist_${matched.user_id}`) ||
        localStorage.getItem(`vinea_wishlist_${email}`);
      if (userWishlistRaw) {
        const userWishlist = JSON.parse(userWishlistRaw);
        if (Array.isArray(userWishlist) && userWishlist.length > 0) {
          setWishlist(prev => Array.from(new Set([...prev, ...userWishlist])));
        }
      }
    } catch (err) {
      console.warn('Wishlist restore note:', err);
    }

    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
    if (isSupabaseConfigured) {
      supabaseSignIn(email, pass).catch((err) => console.warn('Supabase auth note:', err));
    }
    showToast(`Welcome back, ${matched.name}!`, 'success');
    return { success: true };
  };

  const registerCustomer = (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    date_of_birth?: string;
    favorite_davao_branch?: string;
    saved_addresses?: DeliveryAddress[];
  }): { success: boolean; error?: string } => {
    // 1. Full name validation
    const nameRes = validateFullName(data.name);
    if (!nameRes.isValid) {
      return {
        success: false,
        error: nameRes.error || 'Please enter your full legal name (minimum 3 characters).'
      };
    }

    // 2. Email validation (must be @gmail.com)
    const emailRes = validateGmail(data.email);
    if (!emailRes.isValid) {
      return {
        success: false,
        error: emailRes.error || 'Email must be a valid @gmail.com address (e.g. yourname@gmail.com).'
      };
    }
    const email = emailRes.normalized!;

    // 3. Phone validation (must be 11 digits)
    const phoneRes = validatePhone11Digit(data.phone);
    if (!phoneRes.isValid) {
      return {
        success: false,
        error: phoneRes.error || 'Phone number must be an 11-digit mobile number (e.g., 09171234567).'
      };
    }
    const phone = phoneRes.normalized!;

    // 4. Address validation if provided
    if (data.saved_addresses && data.saved_addresses.length > 0) {
      for (const addr of data.saved_addresses) {
        const addrRes = validateAddress(addr);
        if (!addrRes.isValid) {
          return {
            success: false,
            error: addrRes.firstError || 'Please provide complete delivery address details.'
          };
        }
      }
    }

    if (registeredUsers.some(u => u.email.toLowerCase() === email)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.'
      };
    }

    if (data.password.trim().length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters in length.'
      };
    }

    // Age validation (21+ for legal purchase)
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 21) {
        return {
          success: false,
          error: 'You must be at least 21 years of age to create an account and order alcoholic beverages.'
        };
      }
    }

    const newUser: User = {
      user_id: `usr-${Date.now().toString().slice(-5)}`,
      name: nameRes.normalized || data.name.trim(),
      email,
      password: data.password.trim(),
      phone,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      date_of_birth: data.date_of_birth,
      favorite_davao_branch: data.favorite_davao_branch || 'VÍNEA Lanang Flagship & Subterranean Cellar',
      membership_tier: 'Connoisseur',
      member_since: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      preferred_wine_types: ['Red', 'Sparkling'],
      flavor_preference: 'Dry, full-bodied reds with oak complexity and vintage Champagne',
      delivery_instructions: 'Handle with care; temperature-controlled Davao delivery requested.',
      saved_addresses: data.saved_addresses || [
        {
          street: 'J.P. Laurel Avenue',
          city: 'Davao City',
          state: 'Davao del Sur',
          postalCode: '8000',
          country: 'Philippines'
        }
      ]
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    userRef.current = newUser;
    setUser(newUser);
    persistActiveUserSession(newUser);

    if (isSupabaseConfigured) {
      saveUserToSupabase(newUser)
        .then((res) => {
          if (!res.success && res.error) {
            console.warn('[Supabase User Register Note]:', res.error);
          }
        })
        .catch((e: unknown) => console.warn('Supabase user register note:', e));

      supabaseSignUp(email, data.password.trim(), {
        name: data.name.trim(),
        phone: data.phone.trim(),
        branch: data.favorite_davao_branch
      }).catch((err) => console.warn('Supabase signup note:', err));
    }

    saveUserApi(newUser).catch((e: unknown) => console.warn('User register sync note:', e));
    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
    showToast(`Account created! Welcome to VÍNEA Cellars, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logoutCustomer = () => {
    setExplicitLogoutFlag(true);
    userRef.current = null;
    safeSaveCurrentUserToLocalStorage(null);
    saveCurrentUserToDb(null).catch(() => {});
    clearSessionApi().catch(() => {});
    setUser(null);
    setAppliedVoucher(null);
    setIsAccountOpen(false);
    if (isSupabaseConfigured) {
      supabaseSignOut().catch(() => {});
    }
    showToast('You have signed out of your account.', 'info');
  };

  const updateUserProfile = (
    updates: Partial<User>,
    options?: { fallbackAvatarDataUrl?: string; silent?: boolean }
  ): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User is not logged in.' };

    // Validate phone number if updated
    if (updates.phone !== undefined && updates.phone.trim()) {
      const phoneRes = validatePhone11Digit(updates.phone);
      if (!phoneRes.isValid) {
        showToast(phoneRes.error || 'Invalid phone number format.', 'error');
        return { success: false, error: phoneRes.error };
      }
      updates.phone = phoneRes.normalized;
    }

    // Validate saved addresses if updated
    if (updates.saved_addresses && updates.saved_addresses.length > 0) {
      for (const addr of updates.saved_addresses) {
        const addrRes = validateAddress(addr);
        if (!addrRes.isValid) {
          const err = addrRes.firstError || 'Invalid address format.';
          showToast(err, 'error');
          return { success: false, error: err };
        }
      }
    }

    const updatedUser: User = { ...user, ...updates };

    // Explicitly lock in and persist custom avatar across IndexedDB, localStorage, and server session
    if (updates.avatar) {
      saveUserAvatarToDb(
        user.user_id,
        user.email,
        updates.avatar,
        options?.fallbackAvatarDataUrl
      ).catch((err) => console.warn('Avatar IndexedDB note:', err));
    }

    userRef.current = updatedUser;
    setUser(updatedUser);
    persistActiveUserSession(updatedUser);

    setRegisteredUsers(prev =>
      prev.map(u => (u.user_id === user.user_id ? updatedUser : u))
    );
    saveUserToSupabase(updatedUser).catch((e: unknown) => console.warn('Supabase profile sync note:', e));
    saveUserApi(updatedUser).catch((e: unknown) => console.warn('User profile sync note:', e));
    if (!options?.silent) {
      showToast('Your customer profile details have been saved.', 'success');
    }
    return { success: true };
  };

  const changeCustomerPassword = (currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User is not logged in.' };

    if (user.password && user.password !== currentPassword.trim()) {
      return {
        success: false,
        error: 'Current password does not match our records.'
      };
    }

    if (newPassword.trim().length < 6) {
      return {
        success: false,
        error: 'New password must contain at least 6 characters.'
      };
    }

    const updatedUser: User = { ...user, password: newPassword.trim() };
    userRef.current = updatedUser;
    setUser(updatedUser);
    persistActiveUserSession(updatedUser);
    setRegisteredUsers(prev =>
      prev.map(u => (u.user_id === user.user_id ? updatedUser : u))
    );
    saveUserToSupabase(updatedUser).catch((e: unknown) => console.warn('Supabase password sync note:', e));
    saveUserApi(updatedUser).catch((e: unknown) => console.warn('User password sync note:', e));
    showToast('Your account password has been updated securely.', 'success');
    return { success: true };
  };

  const redeemPerk = (perkId: string, pointCost: number, perkTitle: string): { success: boolean; code?: string; message: string } => {
    if (!user) {
      showToast('Please sign in to your customer account to redeem rewards.', 'error');
      return { success: false, message: 'Customer authentication required' };
    }

    const currentPoints = user.loyalty_points ?? 0;
    if (pointCost > 0 && currentPoints < pointCost) {
      showToast(`Insufficient points. You need ${pointCost} pts, but currently have ${currentPoints} pts.`, 'error');
      return { success: false, message: 'Insufficient points' };
    }

    const voucherCode = `VN-RW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const nextPoints = Math.max(0, currentPoints - pointCost);
    const currentRedeemed = user.redeemed_perks || [];
    const nextRedeemed = currentRedeemed.includes(perkId) ? currentRedeemed : [...currentRedeemed, perkId];
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const perkMeta = MEMBER_PERKS.find(p => p.id === perkId);
    const benefit = getPerkBenefit(perkId);

    const newVoucher: UserVoucher = {
      voucher_id: `vch-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      code: voucherCode,
      perk_id: perkId,
      title: perkMeta?.title || perkTitle,
      description: perkMeta?.tagline || benefit.label,
      discount_type: benefit.discountType,
      discount_value: benefit.discountValue,
      status: 'active',
      created_at: formattedDate
    };

    const redemptionRecord: LoyaltyHistoryItem = {
      id: `hist-red-${Date.now()}`,
      date: formattedDate,
      title: pointCost > 0 ? `Redeemed: ${perkTitle}` : `Activated: ${perkTitle}`,
      description: pointCost > 0
        ? `Used ${pointCost} loyalty points. Voucher Code: ${voucherCode}`
        : `Tier member benefit active. Reference: ${voucherCode}`,
      points: -pointCost,
      type: 'redemption',
      code: voucherCode
    };

    const updatedUser: User = {
      ...user,
      loyalty_points: nextPoints,
      redeemed_perks: nextRedeemed,
      rewards_history: [redemptionRecord, ...(user.rewards_history || [])],
      vouchers: [newVoucher, ...extractUserVouchers(user, orders)]
    };

    userRef.current = updatedUser;
    setUser(updatedUser);
    persistActiveUserSession(updatedUser);
    setRegisteredUsers(prev => prev.map(u => (u.user_id === user.user_id ? updatedUser : u)));
    saveUserToSupabase(updatedUser).catch(() => {});
    saveUserApi(updatedUser).catch(() => {});

    showToast(`Voucher ready! Code: ${voucherCode}`, 'success');
    return {
      success: true,
      code: voucherCode,
      message: `Successfully redeemed "${perkTitle}"! Your code is ${voucherCode}.`
    };
  };

  const requireAuthForAction = (reason?: string): boolean => {
    if (!user) {
      if (reason) setAuthRedirectReason(reason);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  // Dedicated Admin Authentication & Navigation
  const updateAdminSecretCode = (newCode: string): { success: boolean; message: string } => {
    const trimmed = newCode.trim();
    if (!trimmed || trimmed.length < 4) {
      return { success: false, message: 'Secret code must be at least 4 characters.' };
    }
    setAdminSecretCodeState(trimmed);
    try {
      localStorage.setItem('vinea_admin_secret_code', trimmed);
    } catch (e) {
      console.error(e);
    }
    showToast('Admin secret passcode updated successfully.', 'success');
    return { success: true, message: 'Secret passcode updated successfully.' };
  };

  const loginWithSecretCode = (secretCodeInput: string): { success: boolean; error?: string } => {
    const input = secretCodeInput.trim();
    const storedSecret = (localStorage.getItem('vinea_admin_secret_code') || adminSecretCode || 'vinea2026').trim();

    // Valid secret codes: user-configured code, or recognized master cellar keys
    const validCodes = [
      storedSecret,
      'vinea2026',
      'vinea-master-2026',
      'grandcru2026',
      'admin2026'
    ].map(c => c.toLowerCase());

    if (validCodes.includes(input.toLowerCase())) {
      const masterUser: AdminUser = {
        id: 'adm-001',
        name: 'Master Sommelier Kent Jorich Rabago',
        email: 'admin@vinea.com',
        role: 'admin',
        title: 'Chief Cellar Administrator & Sommelier'
      };
      setIsAdminAuthenticated(true);
      setAdminUser(masterUser);
      try {
        localStorage.setItem('vinea_admin_auth', 'true');
        localStorage.setItem('vinea_admin_user', JSON.stringify(masterUser));
      } catch (e) {
        console.error(e);
      }

      showToast(`Master Cellar Access Granted: Welcome back.`, 'success');
      return { success: true };
    }

    return {
      success: false,
      error: 'Security Verification Failed: The secret administrative passcode is incorrect. Customer accounts cannot access the cellar operations console.'
    };
  };

  // Dedicated Admin Authentication & Navigation
  const loginAdmin = (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const email = emailInput.trim().toLowerCase();
    const pass = passwordInput.trim();
    const currentSecret = (localStorage.getItem('vinea_admin_secret_code') || adminSecretCode || 'vinea2026').trim();

    // Whitelist of valid administrators with credentials
    const adminAccounts: Record<string, { pass: string; user: AdminUser }> = {
      'admin@vinea.com': {
        pass: 'vinea2026',
        user: {
          id: 'adm-001',
          name: 'Kent Jorich Rabago',
          email: 'admin@vinea.com',
          role: 'admin',
          title: 'Master Sommelier & Chief Cellar Administrator'
        }
      },
      'cellarmaster@vinea.com': {
        pass: 'grandcru2026',
        user: {
          id: 'adm-002',
          name: 'Camille Laurent',
          email: 'cellarmaster@vinea.com',
          role: 'admin',
          title: 'Head Cellar Master & Inventory Director'
        }
      }
    };

    const targetAdmin = adminAccounts[email];

    if (!targetAdmin) {
      return {
        success: false,
        error: 'Access Denied: The email provided is not registered as an authorized cellar administrator. Customer accounts cannot access the administrative console.'
      };
    }

    // Accept either administrator password or the configured secret passcode
    if (targetAdmin.pass !== pass && pass.toLowerCase() !== currentSecret.toLowerCase()) {
      return {
        success: false,
        error: 'Authentication Failed: Incorrect cellar administrator password or secret code.'
      };
    }

    // Success
    setIsAdminAuthenticated(true);
    setAdminUser(targetAdmin.user);
    try {
      localStorage.setItem('vinea_admin_auth', 'true');
      localStorage.setItem('vinea_admin_user', JSON.stringify(targetAdmin.user));
    } catch (e) {
      console.error(e);
    }

    showToast(`Access Granted: Welcome back, ${targetAdmin.user.name}.`, 'success');
    return { success: true };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    revokeGateSession();
    try {
      localStorage.removeItem('vinea_admin_auth');
      localStorage.removeItem('vinea_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Administrator session closed successfully.', 'info');
  };

  const enterAdminPortal = () => {
    setIsVisitingAdmin(true);
    try {
      window.location.hash = '#/admin';
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitAdminPortal = () => {
    setIsVisitingAdmin(false);
    try {
      if (window.location.hash.includes('admin') || window.location.search.includes('admin') || window.location.search.includes('portal=admin')) {
        history.pushState('', document.title, window.location.pathname.replace(/\/admin\/?$/, '/') || '/');
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Computations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <WineStoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        reviews,
        user,
        registeredUsers,
        isAuthModalOpen,
        authModalMode,
        authRedirectReason,
        isAdminMode,
        isAdminAuthenticated,
        adminUser,
        isVisitingAdmin,
        ageVerified,
        underageBlocked,
        activeTab,
        searchQuery,
        selectedProduct,
        quickViewProduct,
        selectedGuideArticle,
        isCartOpen,
        isCheckoutOpen,
        isAccountOpen,
        accountActiveSubTab,
        isQuizOpen,
        activeOrderConfirmation,
        viewingDigitalReceiptOrder,
        toasts,

        setSearchQuery,
        setActiveTab,
        setSelectedProduct,
        setQuickViewProduct,
        setSelectedGuideArticle,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsAccountOpen,
        setAccountActiveSubTab,
        openWishlist,
        setIsQuizOpen,
        setActiveOrderConfirmation,
        setViewingDigitalReceiptOrder,
        setIsAuthModalOpen,
        setAuthModalMode,
        setAuthRedirectReason,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateUserProfile,
        changeCustomerPassword,
        redeemPerk,
        requireAuthForAction,
        setIsAdminMode,
        setIsVisitingAdmin,
        enterAdminPortal,
        exitAdminPortal,
        loginAdmin,
        loginWithSecretCode,
        adminSecretCode,
        updateAdminSecretCode,
        logoutAdmin,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        toggleWishlist,
        isInWishlist,

        placeOrder,
        updateOrderStatus,

        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,

        addCategory,
        updateCategory,
        deleteCategory,

        addReview,

        verifyAge,
        rejectAge,
        resetAgeGate,

        showToast,
        removeToast,

        cartSubtotal,
        cartCount,
        userVouchers,
        appliedVoucher,
        applyVoucherCode,
        removeAppliedVoucher,
        calculateOrderTotals,
        isCloudConnected,
        isPostgresConnected,
        isSupabaseConnected,
        isSupabaseConfigOpen,
        setIsSupabaseConfigOpen,
        syncOrdersToSupabase,
        syncUsersToSupabase,
        syncCatalogToSupabase
      }}
    >
      {children}
    </WineStoreContext.Provider>
  );
};

export const useWineStore = () => {
  const context = useContext(WineStoreContext);
  if (!context) {
    throw new Error('useWineStore must be used within a WineStoreProvider');
  }
  return context;
};
