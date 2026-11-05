import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Product, Category, Order, OrderStatus } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Wine,
  CheckCircle2,
  Save,
  X,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Database,
  RefreshCw,
  Copy,
  Check,
  Server,
  Settings,
  Code,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { getSupabaseConfigStatus } from '../lib/supabase';
import schemaSql from '../../supabase-schema.sql?raw';

export const WINE_PHOTO_PRESETS = [
  { name: 'Red Grand Cru', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', badge: 'Red' },
  { name: 'Burgundy Pinot', url: 'https://images.unsplash.com/photo-1558001373-a8ef32b507d4?auto=format&fit=crop&w=800&q=80', badge: 'Red' },
  { name: 'Champagne Cuvée', url: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80', badge: 'Sparkling' },
  { name: 'Chardonnay White', url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80', badge: 'White' },
  { name: 'Provence Rosé', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=800&q=80', badge: 'Rosé' },
  { name: 'Cellar Vault', url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80', badge: 'Estate' },
  { name: 'Wooden Prestige Box', url: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=800&q=80', badge: 'Collection' }
];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    reviews,
    registeredUsers,
    adminUser,
    logoutAdmin,
    exitAdminPortal,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    updateOrderStatus,
    addCategory,
    deleteCategory,
    isCloudConnected,
    isPostgresConnected,
    isSupabaseConnected,
    isSupabaseConfigOpen,
    setIsSupabaseConfigOpen,
    syncOrdersToSupabase,
    syncUsersToSupabase,
    syncCatalogToSupabase,
    adminSecretCode,
    updateAdminSecretCode,
    showToast
  } = useWineStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'categories' | 'reports' | 'database'>('products');
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [isSeedingCatalog, setIsSeedingCatalog] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Secret Admin Passcode Management State
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const [newSecretInput, setNewSecretInput] = useState('');

  const handleUpdateSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretInput.trim()) return;
    const res = updateAdminSecretCode(newSecretInput.trim());
    if (res.success) {
      setIsEditingSecret(false);
      setNewSecretInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const configStatus = getSupabaseConfigStatus();

  const handleManualOrderSync = async () => {
    setIsSyncingOrders(true);
    try {
      await syncOrdersToSupabase();
    } finally {
      setIsSyncingOrders(false);
    }
  };

  const handleManualUserSync = async () => {
    setIsSyncingUsers(true);
    try {
      const res = await syncUsersToSupabase();
      if (res.syncedCount > 0) {
        showToast(`Successfully synced ${res.syncedCount} customer account(s) to Supabase!`, 'success');
      }
    } finally {
      setIsSyncingUsers(false);
    }
  };

  const handleSeedCatalog = async () => {
    setIsSeedingCatalog(true);
    try {
      const res = await syncCatalogToSupabase();
      if (res.success) {
        showToast(`Seeded ${res.productsCount} wines & ${res.categoriesCount} categories to Supabase!`, 'success');
      }
    } finally {
      setIsSeedingCatalog(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    showToast('Complete SQL schema copied to clipboard! Paste in Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Modal states for Product Add / Edit
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [prodName, setProdName] = useState('');
  const [prodWinery, setProdWinery] = useState('');
  const [prodCountry, setProdCountry] = useState('France');
  const [prodRegion, setProdRegion] = useState('Bordeaux');
  const [prodVintage, setProdVintage] = useState<number>(2022);
  const [prodType, setProdType] = useState<'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert'>('Red');
  const [prodGrape, setProdGrape] = useState('Cabernet Sauvignon');
  const [prodAbv, setProdAbv] = useState<number>(13.5);
  const [prodSweetness, setProdSweetness] = useState<'Bone Dry' | 'Dry' | 'Semi-Dry' | 'Sweet'>('Dry');
  const [prodBody, setProdBody] = useState<'Light' | 'Medium' | 'Full'>('Full');
  const [prodPrice, setProdPrice] = useState<number>(120);
  const [prodStock, setProdStock] = useState<number>(24);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Dedicated Product Photo Management State
  const [managingPhotosProduct, setManagingPhotosProduct] = useState<Product | null>(null);
  const [photoModalPrimary, setPhotoModalPrimary] = useState('');
  const [photoModalGallery, setPhotoModalGallery] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const openPhotoManager = (p: Product) => {
    setManagingPhotosProduct(p);
    setPhotoModalPrimary(p.image);
    setPhotoModalGallery(p.images ? [...p.images] : []);
    setPhotoUrlInput('');
  };

  const handleDeviceUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    destination: 'primary' | 'gallery' | 'add_form' | 'edit_form'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    setIsPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (destination === 'primary') {
        setPhotoModalPrimary(result);
        showToast('Primary photo updated from device upload.', 'info');
      } else if (destination === 'gallery') {
        setPhotoModalGallery((prev) => [...prev, result]);
        showToast('Photo added to product gallery.', 'info');
      } else if (destination === 'add_form') {
        setProdImage(result);
        showToast('Product photo uploaded.', 'info');
      } else if (destination === 'edit_form' && editingProduct) {
        setEditingProduct({ ...editingProduct, image: result });
        showToast('Product photo updated.', 'info');
      }
      setIsPhotoUploading(false);
    };
    reader.onerror = () => {
      showToast('Error reading image file from device.', 'error');
      setIsPhotoUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePhotoModal = () => {
    if (!managingPhotosProduct) return;
    const updated: Product = {
      ...managingPhotosProduct,
      image: photoModalPrimary || managingPhotosProduct.image,
      images: photoModalGallery
    };
    updateProduct(updated);
    showToast(`Photos updated successfully for "${managingPhotosProduct.name}"!`, 'success');
    setManagingPhotosProduct(null);
  };

  // Category Add State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // KPIs
  const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  const mockCustomers = registeredUsers.map((u) => {
    const userOrders = orders.filter((o) => o.user_id === u.user_id);
    return {
      id: u.user_id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      ordersCount: userOrders.length,
      totalSpent: userOrders.reduce((s, o) => s + o.total_amount, 0),
      memberSince: u.member_since || 'October 2024'
    };
  });

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    addProduct({
      name: prodName,
      winery: prodWinery || 'Boutique Estate',
      country: prodCountry,
      region: prodRegion,
      vintage: Number(prodVintage),
      wine_type: prodType,
      grape_variety: prodGrape,
      alcohol_percentage: Number(prodAbv),
      sweetness: prodSweetness,
      body: prodBody,
      price: Number(prodPrice),
      stock: Number(prodStock),
      image: prodImage || (
        prodType === 'White'
          ? '/src/assets/images/category_white_wine_1791213207550.jpg'
          : prodType === 'Sparkling'
          ? '/src/assets/images/category_sparkling_wine_1791213218531.jpg'
          : '/src/assets/images/category_red_wine_1791213197300.jpg'
      ),
      description: prodDesc || 'Hand-harvested estate bottled vintage with remarkable balance and longevity.',
      category_id: prodType === 'Red' ? 'cat-red' : prodType === 'White' ? 'cat-white' : 'cat-sparkling',
      tasting_notes: {
        aroma: ['Ripe Fruit', 'Oak Spice', 'Minerality'],
        palate: 'Silky and structured with balanced acidity.',
        finish: 'Persistent and harmonious.'
      },
      food_pairings: ['Artisan Cheeses', 'Roasted Meats', 'Fine Dining'],
      serving_temp: '16–18°C',
      decanting: 'Decant for 45 minutes'
    });

    setIsAddProductOpen(false);
    setProdName('');
    setProdDesc('');
    setProdImage('');
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      category_name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc || 'Curated estate collections.',
      image: '/src/assets/images/category_red_wine_1791213197300.jpg'
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  return (
    <div className="min-h-screen bg-[#100809] text-[#F5EFE7] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Administrative Profile */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#392126]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D5B15C] font-semibold mb-1">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Cellar Administration Portal (Restricted)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-1">
            VÍNEA Operations Console
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#C1B7B4]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Authenticated: <strong className="text-white">{adminUser?.name || 'Master Sommelier Julian Vance'}</strong> ({adminUser?.email || 'admin@vinea.com'}) · <span className="text-[#D5B15C]">{adminUser?.title || 'Master Sommelier'}</span>
            </span>
            <span className="text-[#392126]">·</span>
            <button
              onClick={() => setActiveTab('database')}
              className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Click to view Database & Supabase Management Console"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isSupabaseConnected ? 'Supabase & Postgres: Connected' : 'Supabase: Ready (Click to Configure)'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            onClick={exitAdminPortal}
            className="py-2.5 px-4 rounded-lg bg-[#190D10] hover:bg-[#2A0D14] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#392126] hover:border-[#D5B15C]/50 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D5B15C]" />
            <span>Visit Public Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="py-2.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            title="Terminate administrator session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#190D10] border border-[#392126]">
          <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">Total Sales</span>
          <span className="font-serif text-2xl font-normal text-[#D5B15C] tabular-nums">{formatPeso(totalSales)}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">+18.4% this month</span>
        </div>

        <div className="p-4 rounded-xl bg-[#190D10] border border-[#392126]">
          <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">Total Orders</span>
          <span className="font-serif text-2xl font-normal text-[#F5EFE7] tabular-nums">{totalOrders}</span>
          <span className="text-[10px] text-[#918481] block mt-1">Davao climate-controlled</span>
        </div>

        <div className="p-4 rounded-xl bg-[#190D10] border border-[#392126]">
          <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">Total Customers</span>
          <span className="font-serif text-2xl font-normal text-[#F5EFE7] tabular-nums">{mockCustomers.length}</span>
          <span className="text-[10px] text-[#918481] block mt-1">Verified collectors</span>
        </div>

        <div className="p-4 rounded-xl bg-[#190D10] border border-[#392126]">
          <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">Active Vintages</span>
          <span className="font-serif text-2xl font-normal text-[#F5EFE7] tabular-nums">{totalProducts}</span>
          <span className="text-[10px] text-[#918481] block mt-1">In 6 categories</span>
        </div>

        <div className="p-4 rounded-xl bg-[#190D10] border border-[#392126]">
          <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">Low Stock Alerts</span>
          <span className="font-serif text-2xl font-normal text-amber-400 tabular-nums">{lowStockCount}</span>
          <span className="text-[10px] text-amber-300 block mt-1">≤ 10 bottles remaining</span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#2b161f] gap-2 mb-8 overflow-x-auto whitespace-nowrap text-xs uppercase tracking-wider font-semibold">
        {[
          { id: 'products', label: 'Products', icon: Wine },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'categories', label: 'Categories', icon: FolderTree },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'database', label: 'Database & Supabase', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#dfbe76] text-[#dfbe76] bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-white font-normal">Cellar Inventory</h2>
              <p className="text-xs text-neutral-400">Add, edit, or adjust stock levels for all vintage allocations.</p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="py-2.5 px-4 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Wine</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl bg-[#140b0f] border border-[#2b161f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b0d13] text-[#dfbe76] uppercase tracking-wider text-[10px] border-b border-[#2b161f]">
                <tr>
                  <th className="p-3.5">Wine & Terroir</th>
                  <th className="p-3.5">Vintage & Type</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <div
                        onClick={() => openPhotoManager(p)}
                        className="relative group/thumb cursor-pointer shrink-0"
                        title="Click to view & add photos for this wine"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover border border-[#392126] group-hover/thumb:border-[#D5B15C] transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                          <Camera className="w-4 h-4 text-[#D5B15C]" />
                        </div>
                        {p.images && p.images.length > 0 && (
                          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#7F1427] text-white text-[8px] rounded font-mono font-bold border border-[#100809]">
                            +{p.images.length}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-white block text-sm">{p.name}</span>
                        <span className="text-neutral-400 text-[11px]">{p.winery} · {p.country}, {p.region}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-300">
                      <span>{p.vintage} · {p.wine_type}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-white tabular-nums">
                      {formatPeso(p.price)}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={p.stock}
                          onChange={(e) => updateProductStock(p.product_id, parseInt(e.target.value) || 0)}
                          className="w-16 p-1 rounded bg-black/40 border border-neutral-700 text-center font-semibold text-white text-xs tabular-nums focus:border-[#d4af37]"
                        />
                        {p.stock <= 10 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40 text-[9px] uppercase font-bold">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-300 tabular-nums">
                      ★ {p.rating.toFixed(1)} ({p.reviews_count})
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openPhotoManager(p)}
                        className="py-1 px-2.5 rounded bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] transition-all cursor-pointer text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-sm"
                        title="Add or manage photos for this wine"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Photos {p.images && p.images.length > 0 ? `(${1 + p.images.length})` : ''}</span>
                      </button>
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.product_id)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-white font-normal">Customer Orders</h2>
            <p className="text-xs text-neutral-400">Inspect allocations, view customer details, and update live transit statuses.</p>
          </div>

          <div className="overflow-x-auto rounded-xl bg-[#140b0f] border border-[#2b161f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b0d13] text-[#dfbe76] uppercase tracking-wider text-[10px] border-b border-[#2b161f]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer & Contact</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Total & Items</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status Stepper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-semibold text-white">{o.order_id}</span>
                      {o.tracking_number && (
                        <span className="text-[10px] text-neutral-500 block font-mono">{o.tracking_number}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-white block">{o.customer_name}</span>
                      <span className="text-neutral-400 text-[11px] block">{o.email}</span>
                      <span className="text-neutral-500 text-[10px]">{o.delivery_address.city}, {o.delivery_address.state}</span>
                    </td>
                    <td className="p-3.5 text-neutral-300">
                      {o.order_date}
                    </td>
                    <td className="p-3.5">
                      <span className="font-serif text-sm font-semibold text-[#dfbe76] tabular-nums">{formatPeso(o.total_amount)}</span>
                      <span className="text-neutral-400 text-[11px] block">{o.items.length} bottles</span>
                    </td>
                    <td className="p-3.5 text-neutral-300">
                      {o.payment_method}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.order_id, e.target.value as OrderStatus)}
                        className="py-1 px-2.5 rounded bg-black/60 border border-[#3b1c28] text-xs font-semibold text-[#dfbe76] focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-white font-normal">Registered Collectors</h2>
            <p className="text-xs text-neutral-400">View customer profiles and historic cellar acquisition spend.</p>
          </div>

          <div className="overflow-x-auto rounded-xl bg-[#140b0f] border border-[#2b161f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1b0d13] text-[#dfbe76] uppercase tracking-wider text-[10px] border-b border-[#2b161f]">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email & Phone</th>
                  <th className="p-3.5">Orders Count</th>
                  <th className="p-3.5">Total Spend</th>
                  <th className="p-3.5">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-medium text-white">
                      {c.name}
                    </td>
                    <td className="p-3.5">
                      <span className="text-neutral-300 block">{c.email}</span>
                      <span className="text-neutral-500 text-[10px]">{c.phone}</span>
                    </td>
                    <td className="p-3.5 text-neutral-300 tabular-nums">
                      {c.ordersCount} orders
                    </td>
                    <td className="p-3.5 font-serif text-sm font-semibold text-[#dfbe76] tabular-nums">
                      {formatPeso(c.totalSpent)}
                    </td>
                    <td className="p-3.5 text-neutral-400">
                      {c.memberSince}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-white font-normal">Wine Categories</h2>
              <p className="text-xs text-neutral-400">Organize styles and terroirs showcased across the marketplace.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add category form */}
            <form onSubmit={handleAddCategory} className="p-5 rounded-xl bg-[#140b0f] border border-[#2b161f] space-y-3">
              <h3 className="font-serif text-lg text-white font-normal">Add Category</h3>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Dessert Wine"
                  className="w-full p-2 rounded bg-black/40 border border-neutral-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Slug</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. dessert"
                  className="w-full p-2 rounded bg-black/40 border border-neutral-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Description</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description for storefront cards"
                  rows={2}
                  className="w-full p-2 rounded bg-black/40 border border-neutral-700 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Create Category
              </button>
            </form>

            {/* Existing Categories list */}
            <div className="md:col-span-2 space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.category_id}
                  className="p-4 rounded-xl bg-[#160c11] border border-[#2b161f] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.category_name}
                      className="w-12 h-12 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif text-lg text-white font-normal">{cat.category_name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCategory(cat.category_id)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-white font-normal">Performance & Analytics</h2>
            <p className="text-xs text-neutral-400">Sales velocity, best-selling terroirs, and monthly order distributions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best selling products */}
            <div className="p-6 rounded-xl bg-[#140b0f] border border-[#2b161f]">
              <h3 className="font-serif text-lg text-white font-normal mb-4">Best-Selling Wines</h3>
              <div className="space-y-3">
                {products.slice(0, 4).map((p, idx) => (
                  <div key={p.product_id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-none">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-neutral-500 font-bold">{idx + 1}.</span>
                      <div>
                        <span className="text-white font-medium block">{p.name}</span>
                        <span className="text-neutral-400 text-[11px]">{p.winery} · {p.vintage}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm text-[#dfbe76] tabular-nums font-semibold">{formatPeso(p.price)}</span>
                      <span className="text-[10px] text-neutral-500 block">Allocation High</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="p-6 rounded-xl bg-[#140b0f] border border-[#2b161f]">
              <h3 className="font-serif text-lg text-white font-normal mb-4">Monthly Orders Summary</h3>
              <div className="space-y-4">
                {[
                  { month: 'October 2026 (MTD)', orders: orders.length, revenue: totalSales, progress: 85 },
                  { month: 'September 2026', orders: 18, revenue: 198500, progress: 100 },
                  { month: 'August 2026', orders: 14, revenue: 164200, progress: 78 }
                ].map((m) => (
                  <div key={m.month}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-medium">{m.month}</span>
                      <span className="text-[#dfbe76] font-semibold tabular-nums">{formatPeso(m.revenue)} ({m.orders} orders)</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#801729] to-[#dfbe76]"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: DATABASE & SUPABASE CLOUD MANAGEMENT */}
      {activeTab === 'database' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#190D10] border border-[#392126]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D5B15C] font-semibold mb-1">
                <Database className="w-4 h-4" />
                <span>Supabase PostgreSQL Cloud Infrastructure</span>
              </div>
              <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-1">
                Database & Cloud Persistence Console
              </h2>
              <p className="text-xs text-[#918481] max-w-2xl">
                Restricted to authorized cellar administrators. Manage direct PostgreSQL database persistence, live data synchronization across devices, customer records, and run SQL migration scripts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSupabaseConfigOpen(true)}
                className="py-2.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Settings className="w-4 h-4" />
                <span>Configure API Credentials</span>
              </button>
            </div>
          </div>

          {/* Connection Status Banner */}
          <div
            className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isSupabaseConnected
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSupabaseConnected ? 'bg-emerald-900/60 text-emerald-400' : 'bg-amber-900/60 text-amber-400'
                }`}
              >
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span>{isSupabaseConnected ? 'Connected to Supabase PostgreSQL' : 'Supabase Not Connected (Local Cache Mode)'}</span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <p className="text-xs opacity-85 mt-0.5 font-mono">
                  {isSupabaseConnected
                    ? `Active Endpoint: ${configStatus.activeUrl || 'Direct Supabase Cloud Connection'}`
                    : 'The app is currently persisting records to browser LocalStorage. Click "Configure API Credentials" to connect your live Supabase project.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {isSupabaseConnected ? (
                <span className="px-3 py-1 rounded bg-emerald-900/80 border border-emerald-700/60 text-[11px] font-mono text-emerald-300">
                  Read/Write: Live Cloud
                </span>
              ) : (
                <button
                  onClick={() => setIsSupabaseConfigOpen(true)}
                  className="px-3 py-1.5 rounded bg-amber-900/80 hover:bg-amber-800 border border-amber-700/60 text-xs font-semibold text-amber-100 cursor-pointer transition-colors"
                >
                  Connect Supabase Now
                </button>
              )}
            </div>
          </div>

          {/* 3 Core Data Synchronization Actions */}
          <div>
            <h3 className="font-serif text-lg text-[#F5EFE7] mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#D5B15C]" />
              <span>Data Sync & Database Seeding</span>
            </h3>
            <p className="text-xs text-[#918481] mb-4">
              Push your in-memory cellar allocations, registered customer accounts, and client order histories directly to Supabase tables.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Catalog */}
              <div className="p-5 rounded-xl bg-[#190D10] border border-[#392126] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D5B15C]">Wine Catalog</span>
                    <Package className="w-4 h-4 text-[#D5B15C]" />
                  </div>
                  <h4 className="font-serif text-lg text-white mb-1">Seed Catalog to Cloud</h4>
                  <p className="text-xs text-[#918481] mb-3">
                    Upload all 12 vintage allocations, pricing, tasting notes, grape varieties, and 6 categories to <code className="text-[#D5B15C]">public.products</code> and <code className="text-[#D5B15C]">public.categories</code>.
                  </p>
                  <div className="text-[11px] text-[#C1B7B4] bg-black/40 p-2.5 rounded border border-[#2b161f] font-mono mb-4">
                    <span>{products.length} Products</span> · <span>{categories.length} Categories</span>
                  </div>
                </div>

                <button
                  onClick={handleSeedCatalog}
                  disabled={isSeedingCatalog}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeedingCatalog ? 'animate-spin' : ''}`} />
                  <span>{isSeedingCatalog ? 'Seeding Catalog...' : 'Seed Catalog to Supabase'}</span>
                </button>
              </div>

              {/* Card 2: Customers */}
              <div className="p-5 rounded-xl bg-[#190D10] border border-[#392126] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D5B15C]">Customer Profiles</span>
                    <Users className="w-4 h-4 text-[#D5B15C]" />
                  </div>
                  <h4 className="font-serif text-lg text-white mb-1">Sync Customer Accounts</h4>
                  <p className="text-xs text-[#918481] mb-3">
                    Upsert registered customer profiles, passwords, loyalty tiers, delivery addresses, and Davao branch preferences to <code className="text-[#D5B15C]">public.users</code>.
                  </p>
                  <div className="text-[11px] text-[#C1B7B4] bg-black/40 p-2.5 rounded border border-[#2b161f] font-mono mb-4">
                    <span>{registeredUsers.length} Registered Collectors</span>
                  </div>
                </div>

                <button
                  onClick={handleManualUserSync}
                  disabled={isSyncingUsers}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingUsers ? 'animate-spin' : ''}`} />
                  <span>{isSyncingUsers ? 'Syncing Accounts...' : 'Sync Accounts to Supabase'}</span>
                </button>
              </div>

              {/* Card 3: Orders */}
              <div className="p-5 rounded-xl bg-[#190D10] border border-[#392126] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D5B15C]">Wine Invoices</span>
                    <ShoppingBag className="w-4 h-4 text-[#D5B15C]" />
                  </div>
                  <h4 className="font-serif text-lg text-white mb-1">Sync Wine Orders</h4>
                  <p className="text-xs text-[#918481] mb-3">
                    Sync wine order transactions, climate-controlled shipping records, and payment receipts (GCash/Maya/COD) to <code className="text-[#D5B15C]">public.orders</code>.
                  </p>
                  <div className="text-[11px] text-[#C1B7B4] bg-black/40 p-2.5 rounded border border-[#2b161f] font-mono mb-4">
                    <span>{orders.length} Completed Orders</span> · <span>{formatPeso(totalSales)}</span>
                  </div>
                </div>

                <button
                  onClick={handleManualOrderSync}
                  disabled={isSyncingOrders}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin' : ''}`} />
                  <span>{isSyncingOrders ? 'Syncing Orders...' : 'Sync Orders to Supabase'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Database Tables Status Overview */}
          <div className="p-6 rounded-2xl bg-[#190D10] border border-[#392126]">
            <h3 className="font-serif text-lg text-[#F5EFE7] mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#D5B15C]" />
              <span>Supabase Database Tables Architecture</span>
            </h3>
            <p className="text-xs text-[#918481] mb-4">
              Overview of the 5 relational tables comprising the VÍNEA wine platform schema.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2b161f] text-[#918481] uppercase tracking-wider">
                    <th className="py-3 px-4">PostgreSQL Table</th>
                    <th className="py-3 px-4">Primary Content & Columns</th>
                    <th className="py-3 px-4 text-center">App Records</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Access Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b161f]/50">
                  <tr>
                    <td className="py-3 px-4 font-mono font-semibold text-[#D5B15C]">public.products</td>
                    <td className="py-3 px-4 text-[#C1B7B4]">Wine allocations, tasting notes JSON, ABV, vintage years, stock counts, cellar imagery</td>
                    <td className="py-3 px-4 text-center font-mono text-white">{products.length}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#918481] font-mono text-[11px]">RLS: Public Read / Admin All</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-mono font-semibold text-[#D5B15C]">public.categories</td>
                    <td className="py-3 px-4 text-[#C1B7B4]">Red, White, Rosé, Sparkling, Dessert, Rare Collections classification</td>
                    <td className="py-3 px-4 text-center font-mono text-white">{categories.length}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#918481] font-mono text-[11px]">RLS: Public Read / Admin All</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-mono font-semibold text-[#D5B15C]">public.orders</td>
                    <td className="py-3 px-4 text-[#C1B7B4]">Order allocations, items JSON, delivery addresses in Davao, GCash/Maya/COD status</td>
                    <td className="py-3 px-4 text-center font-mono text-white">{orders.length}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#918481] font-mono text-[11px]">RLS: Anon Insert & Select</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-mono font-semibold text-[#D5B15C]">public.users</td>
                    <td className="py-3 px-4 text-[#C1B7B4]">Registered customer accounts, password, loyalty points, date_of_birth, Davao branch</td>
                    <td className="py-3 px-4 text-center font-mono text-white">{registeredUsers.length}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#918481] font-mono text-[11px]">RLS: Anon Insert & Select</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-mono font-semibold text-[#D5B15C]">public.reviews</td>
                    <td className="py-3 px-4 text-[#C1B7B4]">Sommelier curation scores, customer ratings, verified buyer tasting impressions</td>
                    <td className="py-3 px-4 text-center font-mono text-white">{reviews?.length || 24}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#918481] font-mono text-[11px]">RLS: Public Read / Anon Write</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SQL Schema Migration Script & Instructions */}
          <div className="p-6 rounded-2xl bg-[#190D10] border border-[#392126]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2b161f]">
              <div>
                <h3 className="font-serif text-lg text-[#F5EFE7] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#D5B15C]" />
                  <span>Supabase SQL Migration & Schema Setup</span>
                </h3>
                <p className="text-xs text-[#918481] mt-0.5">
                  Execute this SQL in your Supabase SQL Editor to provision all tables, enable Row-Level Security, and perform safe non-destructive column migrations.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="py-2.5 px-4 rounded-lg bg-[#D5B15C] hover:bg-[#c49f48] text-[#100809] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-md font-mono"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy Complete SQL Script'}</span>
              </button>
            </div>

            {/* Quick 3-step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-[#2b161f]">
                <strong className="text-[#D5B15C] block mb-1">1. Open Supabase SQL Editor</strong>
                <span className="text-[#918481]">Go to your Supabase project dashboard, navigate to "SQL Editor" in the left sidebar, and click "New Query".</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-[#2b161f]">
                <strong className="text-[#D5B15C] block mb-1">2. Paste & Run Schema</strong>
                <span className="text-[#918481]">Click the "Copy Complete SQL Script" button above, paste the entire SQL script into the query editor, and press Run (Ctrl + Enter).</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-[#2b161f]">
                <strong className="text-[#D5B15C] block mb-1">3. Non-Destructive Migrations</strong>
                <span className="text-[#918481]">The script uses <code className="text-[#D5B15C]">ADD COLUMN IF NOT EXISTS</code> for columns like <code className="text-[#D5B15C]">date_of_birth</code> so existing tables upgrade seamlessly.</span>
              </div>
            </div>

            {/* Schema Preview */}
            <div className="relative">
              <div className="text-[10px] text-[#C1B7B4] bg-[#0c0608] p-4 rounded-xl border border-[#2b161f] font-mono max-h-56 overflow-y-auto leading-relaxed select-all">
                <pre>{schemaSql.slice(0, 1500)}
{schemaSql.length > 1500 ? `\n\n-- ... [${Math.round(schemaSql.length / 1024)} KB complete script continues with products, categories, orders, users, reviews, and RLS policies. Click 'Copy Complete SQL Script' to get full file] ...` : ''}</pre>
              </div>
            </div>
          </div>

          {/* Cellar Master Secret Passcode & Access Control */}
          <div className="p-6 rounded-2xl bg-[#190D10] border border-[#392126]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#2b161f]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D5B15C] font-semibold mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Master Administrative Security</span>
                </div>
                <h3 className="font-serif text-lg text-[#F5EFE7] mb-1">
                  Cellar Master Secret Passcode & Stealth Controls
                </h3>
                <p className="text-xs text-[#918481]">
                  All public admin links have been removed from the storefront. Only individuals with your secret code can unlock this console.
                </p>
              </div>

              {!isEditingSecret && (
                <button
                  onClick={() => {
                    setIsEditingSecret(true);
                    setNewSecretInput('');
                  }}
                  className="py-2 px-3.5 rounded-lg bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Change Secret Passcode</span>
                </button>
              )}
            </div>

            {/* Secret Passcode Display / Edit Form */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#2b161f] mb-6">
              {isEditingSecret ? (
                <form onSubmit={handleUpdateSecret} className="space-y-3">
                  <label className="block text-xs font-semibold text-[#D5B15C]">
                    Enter New Secret Admin Passcode:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={newSecretInput}
                      onChange={(e) => setNewSecretInput(e.target.value)}
                      placeholder="e.g. MySecretCode2026"
                      className="flex-1 p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-sm text-white font-mono focus:outline-none focus:border-[#D5B15C]"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-lg bg-[#D5B15C] hover:bg-[#c49f48] text-[#100809] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Save Passcode
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingSecret(false)}
                        className="py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#918481] block">
                    Once saved, you can immediately use this new code to unlock the admin portal.
                  </span>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#918481] uppercase tracking-wider block mb-1">
                      Current Secret Admin Passcode
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-semibold text-[#D5B15C]">
                        {showSecretCode ? adminSecretCode : '••••••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSecretCode(!showSecretCode)}
                        className="text-[#918481] hover:text-white cursor-pointer"
                        title={showSecretCode ? 'Hide passcode' : 'Show passcode'}
                      >
                        {showSecretCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded font-mono self-start sm:self-auto">
                    Active & Armed
                  </span>
                </div>
              )}
            </div>

            {/* Secret Access Instructions for Owner */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#F5EFE7] block">
                How to Access the Admin Portal (Owner Stealth Methods):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/30 border border-[#2b161f]">
                  <strong className="text-[#D5B15C] flex items-center gap-1.5 mb-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>1. Keyboard Shortcut</span>
                  </strong>
                  <p className="text-[#918481] text-[11px] leading-relaxed">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[#D5B15C] font-mono">Ctrl + Shift + A</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[#D5B15C] font-mono">Cmd + Shift + A</kbd>) from anywhere on the website to toggle this console.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-[#2b161f]">
                  <strong className="text-[#D5B15C] flex items-center gap-1.5 mb-1">
                    <Wine className="w-3.5 h-3.5" />
                    <span>2. Secret Logo 5-Clicks</span>
                  </strong>
                  <p className="text-[#918481] text-[11px] leading-relaxed">
                    Quickly click the <strong className="text-white">VÍNEA logo</strong> in the top navigation bar 5 times in rapid succession. Works on phones and desktop.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-[#2b161f]">
                  <strong className="text-[#D5B15C] flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>3. Direct URL Bar</span>
                  </strong>
                  <p className="text-[#918481] text-[11px] leading-relaxed">
                    Type <code className="text-[#D5B15C] font-mono">#admin</code> or <code className="text-[#D5B15C] font-mono">/admin</code> in your browser URL bar to jump straight to the authentication screen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#140c10] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-white font-normal mb-4">
              Add New Wine Allocation
            </h3>

            <form onSubmit={handleSaveNewProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Wine Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Domaine Saint-Germain Pinot Noir"
                  className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Winery</label>
                  <input
                    type="text"
                    value={prodWinery}
                    onChange={(e) => setProdWinery(e.target.value)}
                    placeholder="Winery name"
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Vintage Year</label>
                  <input
                    type="number"
                    value={prodVintage}
                    onChange={(e) => setProdVintage(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={prodCountry}
                    onChange={(e) => setProdCountry(e.target.value)}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Region</label>
                  <input
                    type="text"
                    value={prodRegion}
                    onChange={(e) => setProdRegion(e.target.value)}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Wine Type</label>
                  <select
                    value={prodType}
                    onChange={(e) => setProdType(e.target.value as any)}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  >
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                    <option value="Rosé">Rosé</option>
                    <option value="Sparkling">Sparkling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Price (₱)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Alcohol %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={prodAbv}
                    onChange={(e) => setProdAbv(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              {/* Product Photo Selector */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D5B15C]" />
                    <span>Product Photo</span>
                  </label>
                  <label className="py-1 px-3 rounded bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDeviceUpload(e, 'add_form')}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={
                      prodImage ||
                      (prodType === 'White'
                        ? '/src/assets/images/category_white_wine_1791213207550.jpg'
                        : prodType === 'Sparkling'
                        ? '/src/assets/images/category_sparkling_wine_1791213218531.jpg'
                        : '/src/assets/images/category_red_wine_1791213197300.jpg')
                    }
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full p-2 rounded bg-black/50 border border-neutral-700 text-white font-mono text-[11px]"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="text-neutral-500 py-0.5">Quick Presets:</span>
                      {WINE_PHOTO_PRESETS.slice(0, 5).map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setProdImage(preset.url)}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer"
                        >
                          {preset.badge}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description & Tasting Notes</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  placeholder="Sommelier description..."
                  className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="py-2.5 px-4 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white font-semibold uppercase tracking-wider"
                >
                  Save Wine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#140c10] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-white font-normal mb-4">
              Edit Product: {editingProduct.name}
            </h3>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Wine Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Winery</label>
                  <input
                    type="text"
                    value={editingProduct.winery}
                    onChange={(e) => setEditingProduct({ ...editingProduct, winery: e.target.value })}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Price (₱)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Grape Variety</label>
                  <input
                    type="text"
                    value={editingProduct.grape_variety}
                    onChange={(e) => setEditingProduct({ ...editingProduct, grape_variety: e.target.value })}
                    className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              {/* Product Photo Selector */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D5B15C]" />
                    <span>Product Photo</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const p = editingProduct;
                        setEditingProduct(null);
                        openPhotoManager(p);
                      }}
                      className="py-1 px-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Full Gallery Manager
                    </button>
                    <label className="py-1 px-3 rounded bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDeviceUpload(e, 'edit_form')}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={editingProduct.image}
                    alt={editingProduct.name}
                    className="w-14 h-14 rounded-lg object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="Image URL (https://...)"
                      className="w-full p-2 rounded bg-black/50 border border-neutral-700 text-white font-mono text-[11px]"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="text-neutral-500 py-0.5">Quick Presets:</span>
                      {WINE_PHOTO_PRESETS.slice(0, 5).map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: preset.url })}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 cursor-pointer"
                        >
                          {preset.badge}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2.5 px-4 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white font-semibold uppercase tracking-wider"
                >
                  Update Wine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE PRODUCT PHOTOS & GALLERY */}
      {managingPhotosProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#140c10] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 text-xs text-[#F5EFE7]">
            <button
              onClick={() => setManagingPhotosProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D5B15C] font-semibold mb-1">
              <Camera className="w-4 h-4" />
              <span>Visual Assets & Gallery Manager</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-1">
              Manage Photos: {managingPhotosProduct.name}
            </h3>
            <p className="text-neutral-400 text-xs mb-6">
              Vintage {managingPhotosProduct.vintage} · {managingPhotosProduct.winery} · {managingPhotosProduct.country}
            </p>

            <div className="space-y-6">
              {/* PRIMARY PHOTO SECTION */}
              <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block text-sm">Primary Storefront Photo</span>
                    <span className="text-[11px] text-neutral-400">The main cover photo displayed across catalog cards, search, and checkout.</span>
                  </div>
                  <label className="py-1.5 px-3 rounded bg-[#7F1427] hover:bg-[#8e192f] text-white font-semibold text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDeviceUpload(e, 'primary')}
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pt-2">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#D5B15C]/50 shadow-md shrink-0 bg-neutral-900">
                    <img
                      src={photoModalPrimary || managingPhotosProduct.image}
                      alt="Primary Wine"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[#D5B15C] text-[9px] font-mono">
                      Cover
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-neutral-400 text-[11px]">Primary Image URL:</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoModalPrimary}
                        onChange={(e) => setPhotoModalPrimary(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 p-2 rounded bg-black/60 border border-neutral-700 text-white font-mono text-[11px]"
                      />
                    </div>

                    <div className="pt-1">
                      <span className="text-neutral-500 text-[10px] block mb-1">Or pick a curated cellar preset:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {WINE_PHOTO_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setPhotoModalPrimary(preset.url);
                              showToast(`Applied preset: ${preset.name}`, 'info');
                            }}
                            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] border border-neutral-700 cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GALLERY PHOTOS SECTION */}
              <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block text-sm">
                      Additional Gallery Photos ({photoModalGallery.length})
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Showcase bottle details, back label, winery estate, and sommelier decanting.
                    </span>
                  </div>

                  <label className="py-1.5 px-3 rounded bg-[#2A0D14] hover:bg-[#3d131d] text-[#D5B15C] border border-[#D5B15C]/40 hover:border-[#D5B15C] font-semibold text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload to Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDeviceUpload(e, 'gallery')}
                    />
                  </label>
                </div>

                {/* Add Photo by URL */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="Add gallery photo via image URL (https://...)"
                    className="flex-1 p-2 rounded bg-black/60 border border-neutral-700 text-white font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!photoUrlInput.trim()) return;
                      setPhotoModalGallery((prev) => [...prev, photoUrlInput.trim()]);
                      setPhotoUrlInput('');
                      showToast('Photo added to gallery.', 'info');
                    }}
                    className="py-1.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Gallery Grid */}
                {photoModalGallery.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-neutral-800 rounded-xl text-neutral-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No additional gallery photos yet.</p>
                    <p className="text-[10px] mt-0.5">Upload photos from your phone/computer or paste URLs above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {photoModalGallery.map((photoUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 aspect-square">
                        <img
                          src={photoUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              const oldPrimary = photoModalPrimary;
                              setPhotoModalPrimary(photoUrl);
                              setPhotoModalGallery((prev) => prev.map((img, i) => (i === idx ? oldPrimary : img)));
                              showToast('Swapped photo with Primary cover.', 'info');
                            }}
                            className="px-2 py-1 rounded bg-[#D5B15C] text-black font-semibold cursor-pointer hover:bg-white"
                          >
                            Set as Primary
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoModalGallery((prev) => prev.filter((_, i) => i !== idx));
                              showToast('Photo removed from gallery.', 'info');
                            }}
                            className="px-2 py-1 rounded bg-red-900/80 text-white hover:bg-red-800 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-neutral-300">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-500">
                Changes will persist to local storage and sync to Supabase.
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setManagingPhotosProduct(null)}
                  className="py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePhotoModal}
                  className="py-2.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
