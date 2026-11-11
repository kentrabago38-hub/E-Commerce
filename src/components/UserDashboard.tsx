import React, { useState, useRef } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { WineType, DeliveryAddress, OrderStatus, Order } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import { DAVAO_BRANCHES } from '../data/mockData';
import { VineaRewardsSection } from './VineaRewardsSection';
import { uploadImageApi } from '../services/apiClient';
import { validatePhone11Digit, validateAddress } from '../utils/validation';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Clock,
  Truck,
  CheckCircle2,
  Wine,
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
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  SlidersHorizontal,
  Compass,
  Lock,
  Search,
  Copy,
  Droplets,
  Thermometer,
  PhoneCall,
  Navigation,
  FileText,
  CheckCheck,
  Download
} from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { downloadVineaReceipt } from '../utils/receiptGenerator';
import { OrderTracking } from './OrderTracking';

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

export const UserDashboard: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    setSelectedProduct,
    setActiveTab,
    showToast,
    logoutCustomer,
    updateUserProfile,
    changeCustomerPassword,
    setIsAuthModalOpen,
    setAuthModalMode,
    accountActiveSubTab,
    setAccountActiveSubTab,
    setViewingDigitalReceiptOrder
  } = useWineStore();

  const [activeTabState, setActiveTabState] = useState<'orders' | 'tracking' | 'rewards' | 'profile' | 'avatar' | 'password' | 'preferences' | 'addresses' | 'wishlist'>(
    (accountActiveSubTab as any) || 'orders'
  );

  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(null);
  const [trackingSearchQuery, setTrackingSearchQuery] = useState<string>('');
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const handleCopyTracking = (code: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      setCopiedTrackingId(code);
      showToast(`Tracking code ${code} copied to clipboard`, 'info');
      setTimeout(() => setCopiedTrackingId(null), 2500);
    } catch {
      showToast(`Tracking code: ${code}`, 'info');
    }
  };

  const handleDownloadSlip = (ord: Order) => {
    downloadVineaReceipt(ord);
    showToast(`Official VÍNEA Cellar Receipt downloaded for Order #${ord.order_id}`, 'success');
  };

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
  const [profilePhoneError, setProfilePhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditDob(user.date_of_birth || '');
      setEditBranch(user.favorite_davao_branch || DAVAO_BRANCHES[0]?.name || '');
      setEditBio(user.bio || '');
      setEditDeliveryNotes(user.delivery_instructions || '');
      setSelectedAvatarUrl(user.avatar || AVATAR_PRESETS[0].url);
      setPreferredTypes(user.preferred_wine_types || ['Red']);
      setFlavorPreference(user.flavor_preference || '');
    }
  }, [user]);

  // If customer is not logged in: present high-end sign in / registration screen
  if (!user) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in text-[#F5EFE7]">
        <div className="rounded-3xl bg-[#190D10] border border-[#392126] shadow-2xl p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7F1427]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7F1427] to-[#3A1018] border border-[#D5B15C]/50 flex items-center justify-center text-[#D5B15C] shadow-2xl">
            <UserIcon className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#100809] border border-[#D5B15C]/35 text-[#D5B15C] text-[10px] uppercase tracking-[0.25em] font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Cellar Portal</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EFE7] font-normal mb-4 tracking-tight">
            Customer Account Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#C1B7B4] font-light max-w-xl mx-auto leading-relaxed mb-8">
            Access your private cellar allocations, track climate-controlled Davao deliveries, customize your tasting profile, and manage verified member details.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto py-3.5 px-8 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>Sign In to Customer Account</span>
              <ArrowRight className="w-4 h-4 text-[#D5B15C]" />
            </button>

            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto py-3.5 px-8 rounded-lg bg-[#100809] hover:bg-white/5 text-[#D5B15C] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#392126] hover:border-[#D5B15C]/50 transition-colors cursor-pointer"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.user_id === user.user_id);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.product_id));
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total_amount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePhoneError('');

    if (editPhone.trim()) {
      const phoneVal = validatePhone11Digit(editPhone);
      if (!phoneVal.isValid) {
        setProfilePhoneError(phoneVal.error || 'Must be a valid 11-digit mobile number (09XXXXXXXXX).');
        showToast(phoneVal.error || 'Invalid phone: 11-digit number required (09XXXXXXXXX)', 'error');
        return;
      }
      setEditPhone(phoneVal.normalized || editPhone);
    }

    updateUserProfile({
      name: editName,
      phone: editPhone.trim() ? (validatePhone11Digit(editPhone).normalized || editPhone) : editPhone,
      date_of_birth: editDob,
      favorite_davao_branch: editBranch,
      bio: editBio,
      delivery_instructions: editDeliveryNotes
    });
  };

  const handleSaveAvatar = () => {
    updateUserProfile({ avatar: selectedAvatarUrl });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showToast('Image file size must be less than 15MB.', 'error');
        return;
      }
      try {
        showToast('Uploading profile image...', 'info');
        const permanentUrl = await uploadImageApi(file, file.name);
        setSelectedAvatarUrl(permanentUrl);
        updateUserProfile({ avatar: permanentUrl });
        showToast('Profile photo uploaded and saved successfully!', 'success');
      } catch (err) {
        console.error('Avatar upload failed:', err);
        showToast('Failed to upload image. Please try another.', 'error');
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match. Please re-enter.');
      return;
    }

    const res = changeCustomerPassword(currentPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password.');
    } else {
      setPasswordSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const toggleWinePreference = (type: WineType) => {
    const next = preferredTypes.includes(type)
      ? preferredTypes.filter((t) => t !== type)
      : [...preferredTypes, type];
    setPreferredTypes(next);
    updateUserProfile({ preferred_wine_types: next });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    const addrVal = validateAddress({
      street: newStreet.trim(),
      city: 'Davao City',
      state: 'Davao del Sur',
      postalCode: '8000'
    });

    if (!addrVal.isValid) {
      const err = addrVal.firstError || addrVal.errors.street || 'Street address must be at least 5 characters.';
      setAddressError(err);
      showToast(err, 'error');
      return;
    }

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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#F5EFE7] animate-fade-in">
      {/* 1. Header Banner & Identity */}
      <div className="rounded-2xl bg-gradient-to-r from-[#210D12] via-[#130B0D] to-[#210D12] border border-[#48151F] p-6 sm:p-10 mb-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#C6A15B] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#48151F] border-2 border-[#C6A15B]/60 flex items-center justify-center text-[#C6A15B] text-3xl font-serif font-bold shadow-2xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <button
                onClick={() => setActiveTabState('avatar')}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#861F32] text-white border border-[#C6A15B] shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5 text-[#C6A15B]" />
              </button>
            </div>

            <div>
              <div className="text-[#C6A15B] text-[11px] uppercase tracking-[0.2em] font-semibold mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>{user.membership_tier || 'Connoisseur Member'} · Verified Cellar Customer</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal leading-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#B7AAA1]">
                <span className="font-mono">{user.email}</span>
                <span>·</span>
                <span>{user.phone || '+63 Davao'}</span>
                <span>·</span>
                <span className="text-[#C6A15B]">{user.favorite_davao_branch || 'VÍNEA Lanang'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('shop')}
              className="py-2.5 px-5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Wine className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Browse Cellar</span>
            </button>

            <button
              onClick={logoutCustomer}
              className="py-2.5 px-4 rounded-lg bg-[#130B0D] hover:bg-white/5 text-[#B7AAA1] hover:text-white text-xs uppercase tracking-wider font-medium border border-[#48151F] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8 pt-8 border-t border-[#48151F]">
          <div className="p-4 rounded-xl bg-[#130B0D]/80 border border-[#48151F]">
            <span className="text-[10px] text-[#B7AAA1]/70 uppercase tracking-wider block mb-1">Total Orders</span>
            <span className="font-serif text-2xl text-[#F5EFE7] font-normal">{userOrders.length}</span>
            <span className="text-[10px] text-[#B7AAA1] block mt-0.5">Cellar allocations</span>
          </div>

          <div className="p-4 rounded-xl bg-[#130B0D]/80 border border-[#48151F]">
            <span className="text-[10px] text-[#B7AAA1]/70 uppercase tracking-wider block mb-1">Total Spent</span>
            <span className="font-serif text-2xl text-[#C6A15B] font-normal tabular-nums">{formatPeso(totalSpent)}</span>
            <span className="text-[10px] text-[#B7AAA1] block mt-0.5">Direct winery pricing</span>
          </div>

          {/* VÍNEA Rewards Metric Button */}
          <button
            onClick={() => setActiveTabState('rewards')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#260B12] to-[#130B0D] border border-[#C6A15B]/50 hover:border-[#C6A15B] text-left transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>VÍNEA Rewards</span>
              </span>
              <span className="text-[9px] text-[#D5B15C] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <span className="font-serif text-2xl text-[#D5B15C] font-normal tabular-nums block">
              {(user.loyalty_points ?? 0).toLocaleString()} <span className="text-xs font-sans text-[#C1B7B4]">pts</span>
            </span>
            <span className="text-[10px] text-[#C1B7B4] block mt-0.5 group-hover:text-white transition-colors">
              {user.membership_tier || 'Grand Cru'} · View Perks
            </span>
          </button>

          <div className="p-4 rounded-xl bg-[#130B0D]/80 border border-[#48151F]">
            <span className="text-[10px] text-[#B7AAA1]/70 uppercase tracking-wider block mb-1">Saved In Wishlist</span>
            <span className="font-serif text-2xl text-[#F5EFE7] font-normal">{wishlist.length}</span>
            <span className="text-[10px] text-[#B7AAA1] block mt-0.5">Bottles reserved</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#130B0D]/80 border border-[#48151F]">
            <span className="text-[10px] text-[#B7AAA1]/70 uppercase tracking-wider block mb-1">Member Status</span>
            <span className="font-serif text-2xl text-emerald-400 font-normal">Active (21+)</span>
            <span className="text-[10px] text-[#B7AAA1] block mt-0.5">Davao cold-chain verified</span>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Layout: Sidebar Navigation & Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs (Sidebar on Desktop) */}
        <div className="lg:col-span-1 space-y-1.5">
          <div className="rounded-xl bg-[#130B0D] border border-[#48151F] p-3 shadow-lg">
            <span className="text-[10px] text-[#B7AAA1]/70 uppercase tracking-wider font-semibold px-3 py-2 block">
              Customer Navigation
            </span>

            <button
              onClick={() => setActiveTabState('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'orders'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders & Allocations</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#210D12] text-[10px] border border-[#48151F]">
                {userOrders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTabState('tracking');
                if (!selectedTrackingOrderId && userOrders.length > 0) {
                  setSelectedTrackingOrderId(userOrders[0].order_id);
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'tracking'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>Order Tracking</span>
              </div>
              {userOrders.some((o) => o.status === 'Shipped') ? (
                <span className="px-2 py-0.5 rounded-full bg-[#861F32] text-[#F5EFE7] text-[10px] font-semibold border border-[#C6A15B]/40 animate-pulse">
                  In Transit
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#210D12] text-[10px] text-[#C6A15B] border border-[#48151F]">
                  Cold-Chain
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTabState('rewards')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'rewards'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#D5B15C]" />
                <span>VÍNEA Rewards & Perks</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#7F1427] text-[#D5B15C] text-[10px] font-mono border border-[#D5B15C]/40">
                {(user.loyalty_points ?? 0).toLocaleString()} pts
              </span>
            </button>

            <button
              onClick={() => setActiveTabState('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'profile'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Customer Information</span>
            </button>

            <button
              onClick={() => setActiveTabState('avatar')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'avatar'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Profile Picture</span>
            </button>

            <button
              onClick={() => setActiveTabState('password')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'password'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <button
              onClick={() => setActiveTabState('preferences')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'preferences'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tasting Preferences</span>
            </button>

            <button
              onClick={() => setActiveTabState('addresses')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'addresses'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Davao Delivery Addresses</span>
            </button>

            <button
              onClick={() => setActiveTabState('wishlist')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTabState === 'wishlist'
                  ? 'bg-[#48151F] text-[#C6A15B] border border-[#C6A15B]/40 font-semibold shadow-md'
                  : 'text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-[#210D12]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Cellar Wishlist</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#210D12] text-[10px] border border-[#48151F]">
                {wishlist.length}
              </span>
            </button>
          </div>

          {/* Sommelier Concierge Info */}
          <div className="rounded-xl bg-[#130B0D] border border-[#48151F] p-4 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] block mb-1 font-semibold flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Sommelier Concierge</span>
            </span>
            <p className="text-[#C1B7B4] text-[11px] leading-relaxed mb-2">
              Need personalized pairing advice or vintage cellar curation for special occasions in Davao?
            </p>
            <p className="text-[10px] text-[#918481]">
              Consult our resident Master Sommelier at any of our 5 Davao City cellar branches.
            </p>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-[#190D10] border border-[#392126] p-6 sm:p-8 shadow-xl">
            {/* TAB: ORDERS */}
            {activeTabState === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#392126]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">My Orders & Allocations</h2>
                    <p className="text-xs text-[#C1B7B4]">Track climate-controlled transit across Davao and review historical allocation receipts.</p>
                  </div>
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-16 text-center text-[#918481]">
                    <Package className="w-12 h-12 mx-auto mb-3 text-[#918481]/50" />
                    <p className="text-sm text-[#F5EFE7] mb-1">No orders placed yet</p>
                    <p className="text-xs text-[#C1B7B4] mb-5 max-w-sm mx-auto">
                      Explore our curated wine catalog and reserve bottles for direct Davao delivery.
                    </p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="py-3 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 cursor-pointer shadow-lg"
                    >
                      Explore Cellar Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord) => {
                      const isTrackingOpen = selectedOrderForTracking === ord.order_id;
                      const orderStatuses: OrderStatus[] = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
                      const currentStep = orderStatuses.indexOf(ord.status);

                      return (
                        <div
                          key={ord.order_id}
                          className="rounded-xl bg-[#100809] border border-[#392126] p-5 hover:border-[#D5B15C]/40 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#392126]">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-sm font-semibold text-[#D5B15C]">
                                  {ord.order_id}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    ord.status === 'Delivered'
                                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                                      : ord.status === 'Shipped'
                                      ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                                      : 'bg-[#2A0D14] text-[#D5B15C] border border-[#D5B15C]/35'
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#918481] block mt-0.5">
                                Placed on {ord.order_date} · {ord.items.length} vintage(s) · {ord.payment_method}
                              </span>
                            </div>

                            <div className="flex flex-col sm:items-end gap-1.5 mt-2 sm:mt-0">
                              <span className="font-serif text-xl text-[#F5EFE7] font-normal block tabular-nums">
                                {formatPeso(ord.total_amount)}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTrackingOrderId(ord.order_id);
                                    setActiveTabState('tracking');
                                  }}
                                  className="py-1 px-2.5 rounded-md bg-[#210D12] hover:bg-[#48151F] text-[#C6A15B] hover:text-[#F5EFE7] border border-[#48151F] hover:border-[#C6A15B]/50 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                  title="Open full cold-chain tracking monitor"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Track</span>
                                </button>
                                <button
                                  onClick={() => setViewingDigitalReceiptOrder(ord)}
                                  className="py-1 px-2.5 rounded-md bg-[#210D12] hover:bg-[#48151F] text-[#E5D7B7] hover:text-white border border-[#C6A15B]/40 hover:border-[#C6A15B] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                  title="View and print official VÍNEA Boutique Invoice & Digital Receipt"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#D5B15C]" />
                                  <span>Invoice & Receipt</span>
                                </button>
                                <button
                                  onClick={() =>
                                    setSelectedOrderForTracking(isTrackingOpen ? null : ord.order_id)
                                  }
                                  className="text-xs text-[#B7AAA1] hover:text-[#F5EFE7] flex items-center gap-1 cursor-pointer py-1 px-1.5"
                                >
                                  <span>{isTrackingOpen ? 'Hide' : 'Progress'}</span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${isTrackingOpen ? 'rotate-90' : ''}`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Visual Progress Timeline (Placed, Preparing, Shipped, Delivered) */}
                          {isTrackingOpen && (
                            <div className="mb-4 animate-fade-in">
                              <OrderTracking
                                order={ord}
                                variant="compact"
                                onBackToOrders={() => {
                                  setSelectedTrackingOrderId(ord.order_id);
                                  setActiveTabState('tracking');
                                }}
                                onViewReceipt={setViewingDigitalReceiptOrder}
                              />
                            </div>
                          )}

                          {/* Items Breakdown */}
                          <div className="space-y-2 pt-2">
                            {ord.items.map((it) => (
                              <div key={it.order_item_id} className="flex items-center justify-between text-xs">
                                <span className="text-[#C1B7B4]">
                                  {it.name} ({it.vintage}) × {it.quantity}
                                </span>
                                <span className="text-[#F5EFE7] tabular-nums font-mono">
                                  {formatPeso(it.price * it.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ORDER TRACKING */}
            {activeTabState === 'tracking' && (
              <OrderTracking
                orders={userOrders}
                activeOrderId={selectedTrackingOrderId}
                onSelectOrder={setSelectedTrackingOrderId}
                onBackToOrders={() => setActiveTabState('orders')}
                onViewReceipt={setViewingDigitalReceiptOrder}
              />
            )}

            {/* TAB: VÍNEA REWARDS */}
            {activeTabState === 'rewards' && (
              <VineaRewardsSection
                onNavigateToCatalog={() => setActiveTab('shop')}
                onNavigateToTracking={() => setActiveTabState('tracking')}
              />
            )}

            {/* TAB: PROFILE INFO */}
            {activeTabState === 'profile' && (
              <div>
                <div className="mb-6 pb-4 border-b border-[#392126]">
                  <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Customer Information</h2>
                  <p className="text-xs text-[#C1B7B4]">Manage your verified personal details, Davao cellar preference, and contact information.</p>
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
                        Email Address (Verified)
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold">
                          Phone Number (11-Digit Mobile)
                        </label>
                        <span className="text-[9px] text-[#D5B15C] font-mono">09XXXXXXXXX</span>
                      </div>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => {
                          setEditPhone(e.target.value);
                          if (profilePhoneError) setProfilePhoneError('');
                        }}
                        placeholder="09171234567"
                        maxLength={14}
                        className={`w-full p-2.5 rounded-lg bg-[#100809] border text-sm text-[#F5EFE7] focus:outline-none transition-colors ${
                          profilePhoneError ? 'border-rose-500 focus:border-rose-400' : 'border-[#392126] focus:border-[#D5B15C]'
                        }`}
                      />
                      {profilePhoneError && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{profilePhoneError}</span>
                        </p>
                      )}
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
                      Preferred Davao Tasting Branch
                    </label>
                    <select
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#100809] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C] cursor-pointer"
                    >
                      {DAVAO_BRANCHES.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Default Delivery Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={editDeliveryNotes}
                      onChange={(e) => setEditDeliveryNotes(e.target.value)}
                      placeholder="e.g. Ring bell upon arrival; leave with concierge in climate-controlled bag..."
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

                  <div className="pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#918481] text-[11px]">
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

            {/* TAB: PROFILE PICTURE */}
            {activeTabState === 'avatar' && (
              <div>
                <div className="mb-6 pb-4 border-b border-[#392126]">
                  <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Customize Profile Picture</h2>
                  <p className="text-xs text-[#C1B7B4]">Choose from curated cellar avatars, enter a custom web image URL, or upload directly from your device.</p>
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
                    <p className="text-xs text-[#918481]">
                      This image will appear on your customer receipts, VIP badge, and sommelier tasting consultations.
                    </p>
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
                    <p className="text-[10px] text-[#918481]">Max file size 2MB. Stored locally in your session.</p>
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
                    <p className="text-[10px] text-[#918481]">Supports Unsplash, Gravatar, or web image URLs.</p>
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

            {/* TAB: PASSWORD */}
            {activeTabState === 'password' && (
              <div>
                <div className="mb-6 pb-4 border-b border-[#392126]">
                  <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Change Password</h2>
                  <p className="text-xs text-[#C1B7B4]">Update your customer security credential to protect your allocations and saved payment methods.</p>
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

            {/* TAB: PREFERENCES */}
            {activeTabState === 'preferences' && (
              <div>
                <div className="mb-6 pb-4 border-b border-[#392126]">
                  <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Wine & Tasting Preferences</h2>
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
                </div>
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTabState === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#392126]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Davao Delivery Addresses</h2>
                    <p className="text-xs text-[#C1B7B4]">Manage your verified residential and commercial delivery locations in Davao City.</p>
                  </div>

                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="py-2 px-3.5 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs font-medium border border-[#D5B15C]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="mb-6 p-4 rounded-xl bg-[#100809] border border-[#392126] space-y-3 text-xs animate-fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold">
                          Street Address / Condominium / Subdivision
                        </label>
                        <span className="text-[9px] text-[#D5B15C]">Min 5 characters</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => {
                          setNewStreet(e.target.value);
                          if (addressError) setAddressError('');
                        }}
                        placeholder="e.g. Unit 12B, Abreeza Residences, J.P. Laurel Avenue"
                        className={`w-full p-2.5 rounded-lg bg-[#190D10] border text-xs text-[#F5EFE7] focus:outline-none transition-colors ${
                          addressError ? 'border-rose-500 focus:border-rose-400' : 'border-[#392126] focus:border-[#D5B15C]'
                        }`}
                      />
                      {addressError && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{addressError}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                          District / Area
                        </label>
                        <select
                          value={newDistrict}
                          onChange={(e) => setNewDistrict(e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#190D10] border border-[#392126] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#D5B15C]"
                        >
                          <option value="Lanang">Lanang, Davao City</option>
                          <option value="Bajada">Bajada, Davao City</option>
                          <option value="Matina">Matina, Davao City</option>
                          <option value="Ecoland">Ecoland, Davao City</option>
                          <option value="Poblacion">Poblacion, Davao City</option>
                          <option value="Buhangin">Buhangin, Davao City</option>
                          <option value="Toril">Toril, Davao City</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#C1B7B4] uppercase tracking-wider text-[10px] font-semibold mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          disabled
                          value="8000 (Davao City)"
                          className="w-full p-2 rounded-lg bg-[#190D10]/50 border border-[#392126] text-xs text-[#918481] cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="py-1.5 px-3 rounded-lg text-xs text-[#918481] hover:text-[#F5EFE7]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-1.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs font-medium border border-[#D5B15C]/40"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {(user.saved_addresses || []).length === 0 ? (
                    <p className="text-xs text-[#918481] py-8 text-center">No saved addresses. Click "Add New Address" above.</p>
                  ) : (
                    user.saved_addresses?.map((addr, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#100809] border border-[#392126] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-[#D5B15C] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[#F5EFE7] font-medium">{addr.street}</p>
                            <p className="text-[11px] text-[#918481]">
                              {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-[#918481] hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                          title="Remove Address"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTabState === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#392126]">
                  <div>
                    <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">Cellar Wishlist</h2>
                    <p className="text-xs text-[#C1B7B4]">Bottles and reserves you have flagged for future allocations.</p>
                  </div>
                  <span className="text-xs text-[#D5B15C] font-semibold">
                    {wishlistProducts.length} saved
                  </span>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-16 text-center text-[#918481]">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-[#918481]/50" />
                    <p className="text-sm text-[#F5EFE7] mb-1">Your cellar wishlist is currently empty</p>
                    <p className="text-xs text-[#C1B7B4] mb-5">Click the heart icon on any vintage in the shop to bookmark it here.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="py-2.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 cursor-pointer shadow-lg"
                    >
                      Browse Wine Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.product_id}
                        className="rounded-xl bg-[#100809] border border-[#392126] p-4 flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={getWineImageUrl(p.image)}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-12 h-16 object-cover rounded bg-[#190D10]"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-[#D5B15C] uppercase block truncate">{p.winery}</span>
                            <h4 className="text-xs text-[#F5EFE7] font-medium truncate">{p.name}</h4>
                            <span className="text-[11px] text-[#C1B7B4] font-mono block mt-0.5">{formatPeso(p.price)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-2 rounded-lg bg-[#2A0D14] hover:bg-[#7F1427] text-white text-[11px] uppercase tracking-wider font-medium border border-[#D5B15C]/30 transition-colors cursor-pointer"
                        >
                          View Vintage Details
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
    </div>
  );
};
