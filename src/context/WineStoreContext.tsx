import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartItem, Order, User, Review, GuideArticle, OrderStatus, DeliveryAddress } from '../types/wine';
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
  seedInitialDataIfEmpty,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveProductToFirestore,
  updateProductStockInFirestore,
  deleteProductFromFirestore,
  saveUserToFirestore,
  saveReviewToFirestore
} from '../services/dbService';
import { testFirestoreConnection } from '../lib/firebase';

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
  accountActiveSubTab: 'orders' | 'tracking' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses';
  isQuizOpen: boolean;
  activeOrderConfirmation: Order | null;
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
  setAccountActiveSubTab: (tab: 'orders' | 'tracking' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses') => void;
  openWishlist: () => void;
  setIsQuizOpen: (open: boolean) => void;
  setActiveOrderConfirmation: (o: Order | null) => void;
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
  updateUserProfile: (updates: Partial<User>) => { success: boolean; error?: string };
  changeCustomerPassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  requireAuthForAction: (reason?: string) => boolean;
  setIsAdminMode: (admin: boolean) => void;
  setIsVisitingAdmin: (visiting: boolean) => void;
  enterAdminPortal: () => void;
  exitAdminPortal: () => void;
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
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
  isCloudConnected: boolean;
}

const WineStoreContext = createContext<WineStoreContextType | undefined>(undefined);

export const WineStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Storage hydration
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
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
      return saved ? JSON.parse(saved) : ['prod-001', 'prod-005'];
    } catch {
      return ['prod-001', 'prod-005'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vinea_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
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
      return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('vinea_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authRedirectReason, setAuthRedirectReason] = useState<string | null>(null);
  const [accountActiveSubTab, setAccountActiveSubTab] = useState<'orders' | 'tracking' | 'profile' | 'avatar' | 'password' | 'preferences' | 'wishlist' | 'addresses'>('orders');

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
  const [activeTab, setActiveTab] = useState<NavTab>('home');
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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Firestore real-time synchronization & initial boot
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeCategories: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;

    const initDb = async () => {
      try {
        const connected = await testFirestoreConnection();
        setIsCloudConnected(connected);

        // Seed initial wine collections to Cloud Firestore if database is clean
        await seedInitialDataIfEmpty();

        // Subscribe to live cloud updates for products, categories, and orders
        unsubscribeProducts = subscribeToProducts((cloudProducts) => {
          if (cloudProducts && cloudProducts.length > 0) {
            setProducts(cloudProducts);
          }
        });

        unsubscribeCategories = subscribeToCategories((cloudCats) => {
          if (cloudCats && cloudCats.length > 0) {
            setCategories(cloudCats);
          }
        });

        unsubscribeOrders = subscribeToOrders((cloudOrders) => {
          if (cloudOrders && cloudOrders.length > 0) {
            setOrders(cloudOrders);
          }
        });
      } catch (err) {
        console.warn('Database initialization note:', err);
      }
    };

    initDb();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeOrders) unsubscribeOrders();
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vinea_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
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
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

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
    try {
      localStorage.setItem('vinea_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('vinea_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('vinea_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

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

    const newOrderId = `VN-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `VNX-DVO-${Math.floor(1000 + Math.random() * 9000)}PH`;
    const today = new Date().toISOString().split('T')[0];

    const newOrder: Order = {
      ...orderData,
      user_id: user.user_id,
      customer_name: user.name || orderData.customer_name,
      email: user.email || orderData.email,
      phone: user.phone || orderData.phone,
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
    showToast(`Order #${newOrderId} placed successfully!`, 'success');

    // Persist Order and updated stock to Cloud Database
    saveOrderToFirestore(newOrder).catch((e) => console.warn('Order sync note:', e));
    orderData.items.forEach((item) => {
      const currentProd = products.find((p) => p.product_id === item.product_id);
      if (currentProd) {
        const nextStock = Math.max(0, currentProd.stock - item.quantity);
        updateProductStockInFirestore(item.product_id, nextStock).catch(() => {});
      }
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, status } : o))
    );
    updateOrderStatusInFirestore(orderId, status).catch((e) => console.warn('Status sync note:', e));
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
    setProducts(prev => [newProduct, ...prev]);
    saveProductToFirestore(newProduct).catch((e) => console.warn('Product add note:', e));
    showToast(`Product "${newProduct.name}" added to catalog.`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.product_id === updated.product_id ? updated : p)));
    saveProductToFirestore(updated).catch((e) => console.warn('Product update note:', e));
    showToast(`Updated "${updated.name}".`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find(p => p.product_id === productId);
    setProducts(prev => prev.filter(p => p.product_id !== productId));
    deleteProductFromFirestore(productId).catch((e) => console.warn('Product delete note:', e));
    showToast(`Deleted "${prod?.name || 'Wine'}" from catalog.`, 'info');
  };

  const updateProductStock = (productId: string, stock: number) => {
    setProducts(prev =>
      prev.map(p => (p.product_id === productId ? { ...p, stock: Math.max(0, stock) } : p))
    );
    updateProductStockInFirestore(productId, stock).catch((e) => console.warn('Stock update note:', e));
    showToast(`Stock updated to ${stock}.`, 'info');
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'category_id'>) => {
    const newId = `cat-${cat.slug || Date.now()}`;
    const newCat: Category = { ...cat, category_id: newId, item_count: 0 };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${cat.category_name}" created.`, 'success');
  };

  const updateCategory = (cat: Category) => {
    setCategories(prev => prev.map(c => (c.category_id === cat.category_id ? cat : c)));
    showToast(`Category "${cat.category_name}" updated.`, 'success');
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.category_id !== catId));
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
    saveReviewToFirestore(newReview).catch((e) => console.warn('Review sync note:', e));

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

    setUser(matched);
    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
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
    const email = data.email.trim().toLowerCase();

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
      name: data.name.trim(),
      email,
      password: data.password.trim(),
      phone: data.phone.trim(),
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
    setUser(newUser);
    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
    showToast(`Account created! Welcome to VÍNEA Cellars, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logoutCustomer = () => {
    setUser(null);
    setIsAccountOpen(false);
    showToast('You have signed out of your account.', 'info');
  };

  const updateUserProfile = (updates: Partial<User>): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User is not logged in.' };

    const updatedUser: User = { ...user, ...updates };
    setUser(updatedUser);
    setRegisteredUsers(prev =>
      prev.map(u => (u.user_id === user.user_id ? updatedUser : u))
    );
    saveUserToFirestore(updatedUser).catch((e) => console.warn('User profile sync note:', e));
    showToast('Your customer profile details have been saved.', 'success');
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
    setUser(updatedUser);
    setRegisteredUsers(prev =>
      prev.map(u => (u.user_id === user.user_id ? updatedUser : u))
    );
    showToast('Your account password has been updated securely.', 'success');
    return { success: true };
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
  const loginAdmin = (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const email = emailInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    // Whitelist of valid administrators with credentials
    const adminAccounts: Record<string, { pass: string; user: AdminUser }> = {
      'admin@vinea.com': {
        pass: 'vinea2026',
        user: {
          id: 'adm-001',
          name: 'Julian Vance',
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

    if (targetAdmin.pass !== pass) {
      return {
        success: false,
        error: 'Authentication Failed: Incorrect cellar administrator password.'
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
        setIsAuthModalOpen,
        setAuthModalMode,
        setAuthRedirectReason,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateUserProfile,
        changeCustomerPassword,
        requireAuthForAction,
        setIsAdminMode,
        setIsVisitingAdmin,
        enterAdminPortal,
        exitAdminPortal,
        loginAdmin,
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
        isCloudConnected
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
