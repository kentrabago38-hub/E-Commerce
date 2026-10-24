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
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
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
    isCloudConnected
  } = useWineStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'categories' | 'reports'>('products');

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
      image: prodType === 'White'
        ? '/src/assets/images/category_white_wine_1791213207550.jpg'
        : prodType === 'Sparkling'
        ? '/src/assets/images/category_sparkling_wine_1791213218531.jpg'
        : '/src/assets/images/category_red_wine_1791213197300.jpg',
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
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
              {isCloudConnected ? 'Cloud Firestore: Live' : 'Firestore: Connected'}
            </span>
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
          { id: 'reports', label: 'Reports', icon: BarChart3 }
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
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                        referrerPolicy="no-referrer"
                      />
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
                    <td className="p-3.5 text-right space-x-2">
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
    </div>
  );
};
