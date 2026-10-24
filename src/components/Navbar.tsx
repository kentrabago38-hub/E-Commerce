import React, { useState } from 'react';
import { useWineStore, NavTab } from '../context/WineStoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  SlidersHorizontal,
  Wine,
  Lock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsAccountOpen,
    openWishlist,
    setIsQuizOpen,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    user,
    setIsAuthModalOpen,
    setAuthModalMode,
    enterAdminPortal
  } = useWineStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    setSelectedProduct(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { label: string; tab: NavTab }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop', tab: 'shop' },
    { label: 'Red Wine', tab: 'red' },
    { label: 'White Wine', tab: 'white' },
    { label: 'Rosé', tab: 'rose' },
    { label: 'Sparkling', tab: 'sparkling' },
    { label: 'Collections', tab: 'collections' },
    { label: 'Davao Branches', tab: 'branches' },
    { label: 'About', tab: 'about' },
    { label: 'Wine Guide', tab: 'guide' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#210D12]/95 backdrop-blur-md border-b border-[#48151F]/70">
      {/* Top micro announcement bar */}
      <div className="bg-[#130B0D] py-2 px-4 text-center border-b border-[#48151F]/50 text-[11px] font-medium tracking-wider text-[#C6A15B] flex items-center justify-between">
        <div className="hidden sm:block text-[#B7AAA1] font-normal">
          Complimentary climate-controlled delivery across Davao on allocations over ₱5,000
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2.5 text-[#F5EFE7]">
          <span>5 Private Cellars in Davao</span>
          <span className="text-[#C6A15B]/40">·</span>
          <span className="text-[#B7AAA1]">Lanang · Bajada · Matina · Azuela Cove · Toril</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#48151F] flex items-center justify-center border border-[#C6A15B]/40 shadow-sm group-hover:border-[#C6A15B] transition-all">
              <Wine className="w-5 h-5 text-[#C6A15B] group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#F5EFE7] font-normal leading-none block">
                VÍNEA
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase block mt-1">
                Discover. Taste. Remember.
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs tracking-wider uppercase font-medium text-[#B7AAA1]">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNavClick(item.tab)}
              className={`relative py-1 transition-colors hover:text-[#C6A15B] cursor-pointer whitespace-nowrap ${
                activeTab === item.tab ? 'text-[#C6A15B] font-semibold' : 'text-[#B7AAA1]'
              }`}
            >
              {item.label}
              {activeTab === item.tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A15B] rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Interactive Affordances */}
        <div className="flex items-center gap-2 sm:gap-3 text-[#B7AAA1]">
          {/* Find Your Wine Button */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#C6A15B] bg-[#130B0D] hover:bg-[#48151F] border border-[#C6A15B]/35 transition-all cursor-pointer shadow-sm hover:border-[#C6A15B]"
            title="Wine Sommelier Quiz"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Find Your Wine</span>
          </button>

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-[#C6A15B] transition-colors relative cursor-pointer"
            aria-label="Search wines"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={openWishlist}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-[#C6A15B] transition-colors relative cursor-pointer"
            aria-label="Saved Wines Wishlist"
            title={`Wishlist (${wishlist.length})`}
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#C6A15B] fill-[#C6A15B]/20' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#861F32] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#130B0D]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-[#C6A15B] transition-colors relative cursor-pointer flex items-center gap-1.5"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C6A15B] text-[#130B0D] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </button>

          {/* User Dashboard Link / Pill (Logged in vs. Logged out) */}
          {user ? (
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden sm:flex items-center gap-2 py-1 px-3 rounded-lg hover:bg-[#48151F] border transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-[#48151F] border-[#C6A15B] text-[#C6A15B]'
                  : 'bg-[#130B0D] border-[#48151F] text-[#F5EFE7]'
              }`}
              aria-label="Customer Cellar Dashboard"
              title={`Customer Dashboard (${user.name})`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#C6A15B]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#861F32] text-[#F5EFE7] text-xs font-serif font-bold flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="text-xs text-[#F5EFE7] font-medium max-w-[85px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider font-semibold border-l border-[#48151F] pl-1.5 hidden md:inline">
                Dashboard
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-semibold text-[#F5EFE7] bg-[#861F32] hover:bg-[#a1253c] border border-[#C6A15B]/40 transition-all cursor-pointer shadow-sm hover:border-[#C6A15B]"
              aria-label="Customer Account Dashboard"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-neutral-300 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="bg-[#140b0e] border-t border-[#2b161f] p-4 animate-fade-in shadow-xl">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#dfbe76] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              placeholder="Search by wine name, winery (Château Lumière), grape, region (Bordeaux, Provence)..."
              className="w-full bg-transparent border-none text-[#f3efe6] placeholder-neutral-500 focus:outline-none text-sm md:text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#120a0d] border-b border-[#2b161f] px-6 py-6 animate-slide-down">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`text-left py-2.5 px-3 rounded-lg text-sm tracking-wider uppercase font-medium transition-colors ${
                  activeTab === item.tab
                    ? 'bg-[#2a111a] text-[#dfbe76]'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsQuizOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-[#dfbe76] bg-[#2a111a]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sommelier Quiz: Find Your Wine</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleNavClick('account');
                  }}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-[#D5B15C] bg-[#2A0D14] border border-[#D5B15C]/40"
                >
                  <UserIcon className="w-4 h-4 text-[#D5B15C]" />
                  <span>Customer Dashboard ({user.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleNavClick('account');
                  }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold text-[#D5B15C] bg-[#2A0D14]"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Customer Account & Sign In</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('branches');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-[#C1B7B4] hover:text-white hover:bg-white/5"
              >
                <Wine className="w-4 h-4 text-[#D5B15C]" />
                <span>5 Branches Across Davao</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
