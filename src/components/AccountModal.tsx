import React, { useState, useRef } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { OrderStatus, DeliveryAddress, WineType } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Clock,
  Truck,
  CheckCircle2,
  ExternalLink,
  Wine,
  Trash2,
  Camera,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  Upload,
  AlertCircle,
  Plus,
  Save,
  Check,
  Compass
} from 'lucide-react';
import { DAVAO_BRANCHES } from '../data/mockData';

const AVATAR_PRESETS = [
  {
    id: 'sommelier-1',
    name: 'Sommelier Gold Crest',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23210D12" stroke="%23C6A15B" stroke-width="2.5"/><path d="M40 30 Q50 20 60 30 L60 50 Q60 62 50 65 Q40 62 40 50 Z" fill="%23861F32" stroke="%23C6A15B" stroke-width="1.5"/><line x1="50" y1="65" x2="50" y2="78" stroke="%23C6A15B" stroke-width="2"/><ellipse cx="50" cy="80" rx="14" ry="4" fill="%23C6A15B"/><circle cx="50" cy="40" r="3" fill="%23F5EFE7"/></svg>`
  },
  {
    id: 'cellar-2',
    name: 'Vintage Cellar Vault',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23130B0D" stroke="%2348151F" stroke-width="3"/><path d="M28 75 C28 40 72 40 72 75 Z" fill="%2348151F" stroke="%23C6A15B" stroke-width="1.5"/><rect x="42" y="55" width="16" height="20" rx="3" fill="%23861F32"/><circle cx="50" cy="32" r="6" fill="%23C6A15B"/></svg>`
  },
  {
    id: 'grand-cru-3',
    name: 'Grand Cru Terroir',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2348151F" stroke="%23C6A15B" stroke-width="2"/><polygon points="50,22 58,38 76,40 62,54 66,72 50,63 34,72 38,54 24,40 42,38" fill="%23861F32" stroke="%23C6A15B" stroke-width="1.5"/><circle cx="50" cy="48" r="8" fill="%23C6A15B"/></svg>`
  },
  {
    id: 'champagne-4',
    name: 'Prestige Cuvée',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23861F32" stroke="%23C6A15B" stroke-width="2"/><path d="M44 26 L56 26 L54 56 Q54 66 50 68 Q46 66 46 56 Z" fill="%23210D12" stroke="%23C6A15B" stroke-width="1.5"/><circle cx="50" cy="42" r="2" fill="%23F5EFE7"/><circle cx="48" cy="35" r="1.5" fill="%23F5EFE7"/><circle cx="52" cy="48" r="1.5" fill="%23F5EFE7"/><line x1="50" y1="68" x2="50" y2="82" stroke="%23C6A15B" stroke-width="2"/><ellipse cx="50" cy="84" rx="12" ry="3" fill="%23C6A15B"/></svg>`
  },
  {
    id: 'davao-cellar-5',
    name: 'Davao Collector Crest',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23210D12" stroke="%23C6A15B" stroke-width="2.5"/><path d="M30 35 L70 35 L70 58 Q70 76 50 84 Q30 76 30 58 Z" fill="%2348151F" stroke="%23C6A15B" stroke-width="1.5"/><text x="50" y="62" font-family="serif" font-size="20" fill="%23F5EFE7" text-anchor="middle">V</text></svg>`
  },
  {
    id: 'reserve-oak-6',
    name: 'Oak Reserve Barrel',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23130B0D" stroke="%23C6A15B" stroke-width="2"/><ellipse cx="50" cy="50" rx="26" ry="32" fill="%2348151F" stroke="%23C6A15B" stroke-width="1.5"/><line x1="26" y1="36" x2="74" y2="36" stroke="%23C6A15B" stroke-width="1"/><line x1="24" y1="64" x2="76" y2="64" stroke="%23C6A15B" stroke-width="1"/><circle cx="50" cy="50" r="4" fill="%23861F32" stroke="%23C6A15B"/></svg>`
  }
];

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    user,
    orders,
    wishlist,
    products,
    toggleWishlist,
    setSelectedProduct,
    setActiveTab,
    showToast,
    logoutCustomer,
    updateUserProfile,
    changeCustomerPassword,
    setIsAuthModalOpen,
    setAuthModalMode,
    accountActiveSubTab,
    setAccountActiveSubTab
  } = useWineStore();

  const activeSubTab = accountActiveSubTab;
  const setActiveSubTab = setAccountActiveSubTab;
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editDob, setEditDob] = useState(user?.date_of_birth || '');
  const [editBranch, setEditBranch] = useState(user?.favorite_davao_branch || DAVAO_BRANCHES[0]?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editDeliveryNotes, setEditDeliveryNotes] = useState(user?.delivery_instructions || '');

  // Avatar Customization State
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user?.avatar || AVATAR_PRESETS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Preferences State
  const [preferredTypes, setPreferredTypes] = useState<WineType[]>(user?.preferred_wine_types || ['Red']);
  const [flavorPreference, setFlavorPreference] = useState(user?.flavor_preference || 'Dry, bold reds with oak complexity');

  // Address Management State
  const [newStreet, setNewStreet] = useState('');
  const [newDistrict, setNewDistrict] = useState('Lanang');
  const [showAddAddress, setShowAddAddress] = useState(false);

  if (!isAccountOpen) return null;

  // If user is not logged in, show elegant Login / Sign-up invitation screen
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
        <div className="relative max-w-md w-full rounded-2xl bg-[#190D10] border border-[#392126] shadow-2xl p-8 text-center">
          <button
            onClick={() => setIsAccountOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#C1B7B4] hover:text-[#F5EFE7] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#7F1427] to-[#3A1018] border border-[#D5B15C]/50 flex items-center justify-center text-[#D5B15C] shadow-xl">
            <UserIcon className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl text-[#F5EFE7] font-normal mb-2">
            Customer Account
          </h2>
          <p className="text-xs text-[#C1B7B4] font-light leading-relaxed mb-6">
            Sign in or create a customer profile to track your cellar allocations, manage Davao delivery addresses, customize your tasting profile, and place orders.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsAccountOpen(false);
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 transition-all cursor-pointer shadow-lg"
            >
              Sign In to Existing Account
            </button>
            <button
              onClick={() => {
                setIsAccountOpen(false);
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-lg bg-[#100809] hover:bg-white/5 text-[#D5B15C] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#392126] hover:border-[#D5B15C]/50 transition-colors cursor-pointer"
            >
              Create New Customer Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.user_id === user.user_id);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.product_id));
  const orderStatuses: OrderStatus[] = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      date_of_birth: editDob,
      favorite_davao_branch: editBranch,
      bio: editBio,
      delivery_instructions: editDeliveryNotes
    });
  };

  const handleSaveAvatar = () => {
    updateUserProfile({ avatar: selectedAvatarUrl });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file size must be less than 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setSelectedAvatarUrl(base64);
          showToast('Image uploaded! Click "Save Profile Picture" to apply.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match. Please re-type.');
      return;
    }

    const res = changeCustomerPassword(currentPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password.');
    } else {
      setPasswordSuccess('Password successfully changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const toggleWinePreference = (type: WineType) => {
    const updated = preferredTypes.includes(type)
      ? preferredTypes.filter((t) => t !== type)
      : [...preferredTypes, type];
    setPreferredTypes(updated);
  };

  const handleSavePreferences = () => {
    updateUserProfile({
      preferred_wine_types: preferredTypes,
      flavor_preference: flavorPreference
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const newAddr: DeliveryAddress = {
      street: newStreet.trim(),
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000',
      country: 'Philippines'
    };

    const currentAddresses = user.saved_addresses || [];
    updateUserProfile({
      saved_addresses: [newAddr, ...currentAddresses]
    });

    setNewStreet('');
    setShowAddAddress(false);
    showToast('New Davao delivery address added.', 'success');
  };

  const handleDeleteAddress = (index: number) => {
    const currentAddresses = [...(user.saved_addresses || [])];
    currentAddresses.splice(index, 1);
    updateUserProfile({ saved_addresses: currentAddresses });
    showToast('Address removed.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-5xl w-full max-h-[92vh] overflow-hidden rounded-2xl bg-[#190D10] border border-[#392126] shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#C1B7B4] hover:text-white transition-colors cursor-pointer"
          aria-label="Close account modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Nav */}
        <div className="w-full md:w-72 bg-[#100809] border-b md:border-b-0 md:border-r border-[#392126] p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* User Profile Card */}
            <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-[#392126]">
              <div className="relative group shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D5B15C]/60 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7F1427] to-[#3A1018] border border-[#D5B15C]/40 flex items-center justify-center text-[#D5B15C] text-xl font-serif font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button
                  onClick={() => setActiveSubTab('avatar')}
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#7F1427] text-white border border-[#D5B15C] shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="Customize Profile Picture"
                >
                  <Camera className="w-3 h-3 text-[#D5B15C]" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg text-[#F5EFE7] font-normal truncate leading-tight">
                  {user.name}
                </h3>
                <span className="text-[10px] text-[#D5B15C] uppercase tracking-wider font-semibold block mt-0.5 truncate">
                  {user.membership_tier || 'Connoisseur Member'}
                </span>
                <span className="text-[10px] text-[#918481] block truncate font-mono">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1 text-xs font-medium">
              <button
                onClick={() => { setActiveSubTab('orders'); setSelectedOrderForTracking(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'orders' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({userOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'profile' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Edit Profile Info</span>
              </button>

              <button
                onClick={() => setActiveSubTab('avatar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'avatar' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Profile Picture</span>
              </button>

              <button
                onClick={() => setActiveSubTab('password')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'password' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <button
                onClick={() => setActiveSubTab('preferences')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'preferences' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Tasting Preferences</span>
              </button>

              <button
                onClick={() => setActiveSubTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'addresses' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveSubTab('wishlist')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'wishlist' ? 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35 font-semibold' : 'text-[#C1B7B4] hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  setActiveTab('branches');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-[#dfbe76] hover:bg-white/5 transition-colors cursor-pointer text-xs"
              >
                <Wine className="w-4 h-4 text-[#dfbe76]" />
                <span>5 Davao Branches</span>
              </button>
            </div>
          </div>

          <button
            onClick={logoutCustomer}
            className="flex items-center gap-2 px-3 py-2.5 text-xs text-neutral-400 hover:text-red-400 transition-colors mt-6 pt-6 border-t border-white/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({user.email})</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[80vh] md:max-h-[92vh]">
          {/* TAB: MY ORDERS */}
          {activeSubTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2b151f]">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal">My Orders & Allocations</h3>
                  <p className="text-xs text-neutral-400">Track shipments and view historic purchase receipts across Davao.</p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-16 text-center text-neutral-400">
                  <Package className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
                  <p className="text-sm text-neutral-300 mb-1">No orders placed yet</p>
                  <p className="text-xs text-neutral-500 mb-4">Browse our premium wine catalog and reserve bottles for delivery.</p>
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      setActiveTab('shop');
                    }}
                    className="py-2.5 px-5 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold border border-[#d4af37]/40 cursor-pointer"
                  >
                    Explore Cellar Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => {
                    const stepIdx = orderStatuses.indexOf(ord.status);
                    return (
                      <div
                        key={ord.order_id}
                        className="p-5 rounded-xl bg-[#1b0d13] border border-[#2e1521] space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs">
                          <div>
                            <span className="font-semibold text-white text-sm">Order #{ord.order_id}</span>
                            <span className="text-neutral-400 block text-[11px]">Placed on {ord.order_date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-base text-[#dfbe76] font-semibold">{formatPeso(ord.total_amount)}</span>
                            <span className="text-[11px] text-neutral-400 block">{ord.items.length} bottles</span>
                          </div>
                        </div>

                        {/* Order Stepper */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                            <span>Status: <strong className="text-[#dfbe76]">{ord.status}</strong></span>
                            <span>ETA: {ord.estimated_delivery}</span>
                          </div>

                          <div className="relative flex items-center justify-between py-2">
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-neutral-800 z-0" />
                            <div
                              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#801729] transition-all z-0"
                              style={{ width: `${(stepIdx / 3) * 100}%` }}
                            />

                            {orderStatuses.map((st, idx) => (
                              <div key={st} className="relative z-10 flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    idx <= stepIdx
                                      ? 'bg-[#801729] text-white border border-[#dfbe76]'
                                      : 'bg-neutral-800 text-neutral-500'
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 ${idx === stepIdx ? 'text-[#dfbe76] font-semibold' : 'text-neutral-500'}`}>
                                  {st}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottles list */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          {ord.items.map((item) => (
                            <div key={item.order_item_id} className="flex items-center justify-between text-xs">
                              <span className="text-neutral-300">
                                {item.name} ({item.vintage}) × {item.quantity}
                              </span>
                              <span className="text-neutral-400 tabular-nums">{formatPeso(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {ord.tracking_number && (
                          <div className="pt-2 text-[11px] text-neutral-400 flex flex-wrap justify-between border-t border-white/5">
                            <span>Tracking: <span className="font-mono text-[#dfbe76]">{ord.tracking_number}</span></span>
                            <span>Carrier: VÍNEA Davao Climate-Controlled Van</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: EDIT PROFILE INFO */}
          {activeSubTab === 'profile' && (
            <div>
              <div className="mb-6 pb-4 border-b border-[#392126]">
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">Customer Information</h3>
                <p className="text-xs text-[#C1B7B4]">Manage your verified customer details, contact info, and Davao cellar preferences.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full p-2.5 rounded-lg bg-[#100809]/50 border border-[#392126] text-sm text-[#918481] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Phone Number (+63 Davao)
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Date of Birth (21+ Verification)
                    </label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Favorite Davao Branch
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] cursor-pointer"
                  >
                    {DAVAO_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>{b.name} ({b.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Default Davao Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={editDeliveryNotes}
                    onChange={(e) => setEditDeliveryNotes(e.target.value)}
                    placeholder="e.g. Ring bell upon arrival; leave with building concierge in insulated box..."
                    className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C]"
                  />
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Collector Bio / Sommelier Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us about your wine journey or personal collecting interests..."
                    className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#918481] text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-[#D5B15C]" />
                    <span>Member since {user.member_since || 'October 2024'}</span>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-medium text-xs uppercase tracking-wider border border-[#D5B15C]/40 flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
                  >
                    <Save className="w-4 h-4 text-[#D5B15C]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PROFILE PICTURE CUSTOMIZATION */}
          {activeSubTab === 'avatar' && (
            <div>
              <div className="mb-6 pb-4 border-b border-[#392126]">
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">Customize Profile Picture</h3>
                <p className="text-xs text-[#C1B7B4]">Choose from curated cellar avatars, enter a custom web image URL, or upload from your device.</p>
              </div>

              {/* Current Preview */}
              <div className="p-5 rounded-xl bg-[#100809] border border-[#392126] mb-6 flex items-center gap-5">
                <img
                  src={selectedAvatarUrl || user.avatar}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#D5B15C] shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] text-[#D5B15C] uppercase tracking-wider font-semibold block mb-1">
                    Avatar Live Preview
                  </span>
                  <p className="text-[#F5EFE7] text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-[#918481]">This image will appear on your customer receipts, sommelier reviews, and VIP badge.</p>
                </div>
              </div>

              {/* Preset Avatars */}
              <div className="mb-6">
                <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-3">
                  Select a Luxury Sommelier Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedAvatarUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden border p-1 transition-all cursor-pointer ${
                        selectedAvatarUrl === p.url
                          ? 'border-[#D5B15C] ring-2 ring-[#D5B15C] bg-[#2A0D14]'
                          : 'border-[#392126] hover:border-[#D5B15C]/40 bg-[#100809]'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full aspect-square rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] text-[#C1B7B4] block truncate text-center mt-1">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload & Custom URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
                <div className="p-4 rounded-xl bg-[#100809] border border-[#392126] space-y-3">
                  <span className="text-[10px] text-[#C1B7B4] uppercase tracking-wider font-semibold block">
                    Upload From Your Device
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#2A0D14] hover:bg-[#3A1018] border border-[#D5B15C]/40 text-[#F5EFE7] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#D5B15C]" />
                    <span>Choose Image File (JPG/PNG)</span>
                  </button>
                  <p className="text-[10px] text-[#918481]">Max size 2MB. Saved safely in your local session.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#100809] border border-[#392126] space-y-3">
                  <span className="text-[10px] text-[#C1B7B4] uppercase tracking-wider font-semibold block">
                    Or Enter Image URL
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAvatarInput}
                      onChange={(e) => setCustomAvatarInput(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 p-2 rounded-lg bg-[#190D10] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarInput.trim()) {
                          setSelectedAvatarUrl(customAvatarInput.trim());
                          showToast('Custom URL preview loaded!', 'info');
                        }
                      }}
                      className="py-2 px-3 rounded-lg bg-[#2A0D14] border border-[#D5B15C]/40 text-[#D5B15C] text-xs font-medium cursor-pointer hover:bg-[#3A1018] transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                  <p className="text-[10px] text-[#918481]">Supports Unsplash, Gravatar, or personal avatar URLs.</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  className="py-2.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-medium text-xs uppercase tracking-wider border border-[#D5B15C]/40 flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
                >
                  <Check className="w-4 h-4 text-[#D5B15C]" />
                  <span>Save Profile Picture</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {activeSubTab === 'password' && (
            <div>
              <div className="mb-6 pb-4 border-b border-[#392126]">
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">Change Password</h3>
                <p className="text-xs text-[#C1B7B4]">Update your customer credential securely to protect your saved allocations.</p>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-[#3A1018]/80 border border-red-700/60 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full p-2.5 pr-10 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-[#918481] hover:text-[#F5EFE7]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    New Password (Min 6 Characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2.5 pr-10 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-[#918481] hover:text-[#F5EFE7]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-sm text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!currentPassword || !newPassword || !confirmNewPassword}
                    className="w-full py-3 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-medium text-xs uppercase tracking-wider border border-[#D5B15C]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    Update Password Securely
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: TASTING PREFERENCES */}
          {activeSubTab === 'preferences' && (
            <div>
              <div className="mb-6 pb-4 border-b border-[#392126]">
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">Wine & Tasting Preferences</h3>
                <p className="text-xs text-[#C1B7B4]">Tailor your sommelier quiz recommendations and allocation notifications.</p>
              </div>

              <div className="space-y-6 max-w-xl text-xs">
                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-3">
                    Preferred Wine Styles (Select All That Apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'] as WineType[]).map((type) => {
                      const isSelected = preferredTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleWinePreference(type)}
                          className={`py-2 px-4 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#7F1427] text-[#F5EFE7] border-[#D5B15C] shadow-sm'
                              : 'bg-[#100809] text-[#918481] border-[#392126] hover:text-[#F5EFE7]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D5B15C]" />}
                          <span>{type} Wine</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                    Palate & Gastronomic Notes
                  </label>
                  <input
                    type="text"
                    value={flavorPreference}
                    onChange={(e) => setFlavorPreference(e.target.value)}
                    placeholder="e.g. Crisp mineral whites, aged Barolo, dry rosés..."
                    className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] transition-colors"
                  />
                  <p className="text-[10px] text-[#918481] mt-1">
                    Used by our Davao cellar team to provide bespoke pairing advice during tastings.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1b0d13] border border-[#2e1521] space-y-3">
                  <span className="text-[10px] text-neutral-300 uppercase tracking-wider font-semibold block">
                    Davao Sommelier Alerts
                  </span>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-neutral-300">Rare Grand Cru allocation release notifications</span>
                    <input type="checkbox" defaultChecked className="accent-[#801729]" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-neutral-300">Invitations to VIP tasting flights at Lanang & Azuela Cove</span>
                    <input type="checkbox" defaultChecked className="accent-[#801729]" />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="py-2.5 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white font-semibold text-xs uppercase tracking-wider border border-[#d4af37]/40 flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4 text-[#dfbe76]" />
                    <span>Save Tasting Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SAVED ADDRESSES */}
          {activeSubTab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2b151f]">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal">Saved Delivery Addresses</h3>
                  <p className="text-xs text-neutral-400">Davao City addresses for adult-signature cold-chain delivery.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="py-2 px-3.5 rounded-lg bg-[#2a111a] hover:bg-[#3f1929] border border-[#d4af37]/40 text-[#dfbe76] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 rounded-xl bg-black/60 border border-[#d4af37]/40 space-y-3 text-xs animate-fade-in">
                  <span className="text-[10px] text-[#dfbe76] uppercase tracking-wider font-semibold block">
                    New Davao City Address
                  </span>
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">Street Address / Unit / Subdivision *</label>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. Unit 302, Insular Village Phase 1"
                      className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 text-[10px] mb-1">District / Barangay</label>
                      <select
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        className="w-full p-2.5 rounded bg-black/40 border border-neutral-700 text-white cursor-pointer"
                      >
                        <option value="Lanang">Lanang</option>
                        <option value="Bajada">Bajada</option>
                        <option value="Matina">Matina</option>
                        <option value="Ecoland">Ecoland</option>
                        <option value="Buhangin">Buhangin</option>
                        <option value="Toril">Toril</option>
                        <option value="Poblacion">Poblacion (Downtown)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-400 text-[10px] mb-1">City & Postal</label>
                      <input
                        type="text"
                        disabled
                        value="Davao City 8000"
                        className="w-full p-2.5 rounded bg-black/20 border border-neutral-800 text-neutral-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="py-1.5 px-3 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded bg-[#801729] hover:bg-[#961e33] text-white font-semibold text-xs uppercase tracking-wider border border-[#d4af37]/40"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-w-lg">
                {(user.saved_addresses || []).map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#1b0d13] border border-[#2e1521] text-xs flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#2b121c] text-[#dfbe76] text-[10px] uppercase font-semibold">
                          {idx === 0 ? 'Primary Davao Residence' : `Address #${idx + 1}`}
                        </span>
                        <span className="text-emerald-400 text-[10px]">Active</span>
                      </div>
                      <p className="text-white font-medium text-sm pt-0.5">{addr.street}</p>
                      <p className="text-neutral-300">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-neutral-500 text-[11px]">{addr.country}</p>
                    </div>
                    {user.saved_addresses && user.saved_addresses.length > 1 && (
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeSubTab === 'wishlist' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2b151f]">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal">Cellar Wishlist</h3>
                  <p className="text-xs text-neutral-400">Bottles you have bookmarked for future private occasions.</p>
                </div>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-16 text-center text-neutral-400">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
                  <p className="text-sm text-neutral-300 mb-1">Your wishlist is currently empty</p>
                  <p className="text-xs text-neutral-500 mb-4">Click the heart icon on any wine card to save vintages here.</p>
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      setActiveTab('shop');
                    }}
                    className="py-2.5 px-5 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold border border-[#d4af37]/40 cursor-pointer"
                  >
                    Browse Wine Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.product_id}
                      className="p-3.5 rounded-xl bg-[#1b0d13] border border-[#2e1521] flex items-center justify-between gap-3 hover:border-[#d4af37]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-16 rounded object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#dfbe76] uppercase tracking-wider block">
                            {p.winery} · {p.vintage}
                          </span>
                          <h4
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsAccountOpen(false);
                            }}
                            className="font-serif text-sm text-white font-normal hover:text-[#dfbe76] cursor-pointer truncate"
                          >
                            {p.name}
                          </h4>
                          <span className="text-xs text-[#dfbe76] font-semibold">{formatPeso(p.price)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleWishlist(p.product_id)}
                        className="text-neutral-500 hover:text-red-400 p-2 transition-colors cursor-pointer shrink-0"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
