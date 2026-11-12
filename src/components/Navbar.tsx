import React, { useState, useRef, useEffect } from 'react';
import { useWineStore, NavTab } from '../context/WineStoreContext';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight,
  MapPin,
  Plus
} from 'lucide-react';
import { VineaLogoIcon } from './VineaLogo';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { loadUserAvatarFromDb } from '../utils/customPhotoStorage';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    wishlist,
    setIsCartOpen,
    openWishlist,
    setIsQuizOpen,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    addToCart,
    products,
    user,
    enterAdminPortal
  } = useWineStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [fallbackAvatar, setFallbackAvatar] = useState<string | null>(null);

  useEffect(() => {
    setAvatarImgError(false);
    setFallbackAvatar(null);
  }, [user?.avatar, user?.user_id]);

  const handleAvatarLoadError = async () => {
    if (!fallbackAvatar && user) {
      const stored = await loadUserAvatarFromDb(user.user_id, user.email).catch(() => null);
      if (stored?.fallbackDataUrl && stored.fallbackDataUrl !== user.avatar) {
        setFallbackAvatar(stored.fallbackDataUrl);
        return;
      }
    }
    setAvatarImgError(true);
  };

  // Secret 5-click easter egg on the brand logo for the owner to access admin
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    handleNavClick('home');
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        enterAdminPortal();
        return 0;
      }
      return next;
    });

    if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
    logoClickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2500);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled((prev) => {
            // Asymmetric hysteresis thresholds:
            // Scroll down past 75px to activate floating pill style
            // Scroll up to within 20px of the top to return to banner state
            // Completely eliminates scroll-up layout jitter and oscillation
            if (!prev && y > 75) return true;
            if (prev && y < 20) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMegaMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    setSelectedProduct(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { label: string; tab: NavTab; hasMegaMenu?: boolean }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop', tab: 'shop', hasMegaMenu: true },
    { label: 'Collections', tab: 'collections' },
    { label: 'Wine Guide', tab: 'guide' },
    { label: 'About', tab: 'about' },
    { label: 'Account', tab: 'account' }
  ];

  const handleMouseEnterShop = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 240);
  };

  // Search filtered suggestions
  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.winery.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.wine_type.toLowerCase().includes(q) ||
          p.grape_variety.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 6);

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured flagship bottle inside mega menu
  const megaMenuFeaturedBottle = products.find((p) => p.featured) || products[0];

  const quickSearchTags = ['Red Wine', 'Burgundy', 'Cabernet Sauvignon', 'Sparkling', 'Gift Wines', 'Grand Cru'];

  return (
    <>
      {/* Top announcement bar: in natural document flow so it scrolls away naturally without layout shift */}
      <div className="bg-[#130B0D] py-2 px-4 text-center border-b border-[#351116]/60 text-xs font-semibold tracking-wider text-[#E5D7B7] flex items-center justify-between select-none">
        <div className="hidden sm:block text-white/80 font-normal">
          Complimentary climate-controlled delivery across Davao on allocations over ₱5,000
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2.5 text-white">
          <span className="flex items-center gap-1.5 text-[#E5D7B7] font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#D5B15C]" />
            5 Private Cellars in Davao
          </span>
          <span className="text-white/40">·</span>
          <span className="text-white/80 font-normal">Lanang · Bajada · Matina · Azuela Cove · SM Premier</span>
        </div>
      </div>

      {/* Sticky Floating Modern Header Island */}
      <div className="sticky top-0 z-40 w-full pointer-events-none py-2 px-3 sm:px-6">
        <header
          className={`pointer-events-auto mx-auto transition-[max-width,border-radius,background-color,border-color,box-shadow] duration-300 ease-out ${
            isScrolled
              ? 'max-w-6xl rounded-full dark-luxury-glass px-6 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/15'
              : 'max-w-7xl rounded-2xl bg-[#210D12]/95 backdrop-blur-md border border-white/10 px-4 sm:px-6 lg:px-8 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between gap-6 h-16 sm:h-18">
            {/* Zone 1: Minimal Brand Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleLogoClick}
                className="group flex items-center gap-3 text-left cursor-pointer"
                title="VÍNEA Fine Wine Merchant"
              >
                <VineaLogoIcon sizePx={36} className="group-hover:scale-105 transition-transform duration-300" />
                <div>
                  <span className="font-serif text-2xl tracking-wider text-white font-medium leading-none block drop-shadow-sm group-hover:text-[#D5B15C] transition-colors">
                    VÍNEA
                  </span>
                  <span className="text-[9px] tracking-[0.28em] text-[#E5D7B7] uppercase block mt-1.5 font-bold font-sans">
                    Haute Sommelerie
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Minimal Navigation Links (Desktop with Mega Menu) */}
            <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.18em] uppercase font-semibold text-white/90">
              {navItems.map((item) => {
                const isActive = activeTab === item.tab;

                return (
                  <div
                    key={item.tab}
                    className="relative"
                    onMouseEnter={item.hasMegaMenu ? handleMouseEnterShop : undefined}
                    onMouseLeave={item.hasMegaMenu ? handleMouseLeaveShop : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.tab)}
                      className={`relative py-2 flex items-center gap-1.5 transition-colors hover:text-[#D5B15C] cursor-pointer whitespace-nowrap group ${
                        isActive ? 'text-[#E5D7B7] font-bold' : 'text-white/90 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hasMegaMenu && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            megaMenuOpen ? 'rotate-180 text-[#D5B15C]' : 'opacity-70'
                          }`}
                        />
                      )}

                      {/* Animated Gold Underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-[#D5B15C] rounded-full transition-all duration-300 ease-out ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>

                    {/* SOPHISTICATED FULL-WIDTH FLOATING MEGA MENU */}
                    {item.hasMegaMenu && megaMenuOpen && (
                      <div
                        className="absolute top-full -left-28 w-[860px] dark-luxury-glass-elevated rounded-2xl shadow-2xl p-8 grid grid-cols-4 gap-8 z-50 mt-2"
                        style={{
                          animation: 'fadeInSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}
                      >
                        {/* Column 1: SHOP WINE */}
                        <div className="space-y-3 border-r border-white/5 pr-4">
                          <span className="text-[10px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold block mb-4">
                            Shop Wine
                          </span>
                          {[
                            { label: 'Red Wine', tab: 'red' as NavTab },
                            { label: 'White Wine', tab: 'white' as NavTab },
                            { label: 'Rosé', tab: 'rose' as NavTab },
                            { label: 'Sparkling & Champagne', tab: 'sparkling' as NavTab }
                          ].map((t) => (
                            <button
                              key={t.label}
                              type="button"
                              onClick={() => handleNavClick(t.tab)}
                              className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] hover:translate-x-1.5 transition-all py-1.5 cursor-pointer w-full font-light"
                            >
                              {t.label}
                            </button>
                          ))}
                          <div className="pt-3 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => handleNavClick('shop')}
                              className="text-[11px] text-[#C6A15B] hover:text-white flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                            >
                              <span>Browse All Wines</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Column 2: DISCOVER */}
                        <div className="space-y-3 border-r border-white/5 pr-4">
                          <span className="text-[10px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold block mb-4">
                            Discover
                          </span>
                          {[
                            { label: 'Collections & Reserves', action: () => handleNavClick('collections') },
                            { label: 'New Arrivals', action: () => { setSearchQuery('2023'); handleNavClick('shop'); } },
                            { label: 'Best Sellers', action: () => { handleNavClick('shop'); } },
                            { label: 'Rare Vault Bottles', action: () => { setSearchQuery('Grand Cru'); handleNavClick('shop'); } }
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={item.action}
                              className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] hover:translate-x-1.5 transition-all py-1.5 cursor-pointer w-full font-light"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Column 3: EXPLORE */}
                        <div className="space-y-3 border-r border-white/5 pr-4">
                          <span className="text-[10px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold block mb-4">
                            Explore
                          </span>
                          {[
                            { label: 'Sommelier Wine Guide', action: () => handleNavClick('guide') },
                            { label: 'Gastronomy Pairings', action: () => { handleNavClick('home'); window.scrollTo({ top: 1200, behavior: 'smooth' }); } },
                            { label: 'Terroirs & Regions', action: () => { handleNavClick('home'); window.scrollTo({ top: 1600, behavior: 'smooth' }); } },
                            { label: '5 Davao Cellar Branches', action: () => handleNavClick('branches') }
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={item.action}
                              className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] hover:translate-x-1.5 transition-all py-1.5 cursor-pointer w-full font-light"
                            >
                              {item.label}
                            </button>
                          ))}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsQuizOpen(true);
                                setMegaMenuOpen(false);
                              }}
                              className="text-[11px] text-[#C6A15B] hover:text-[#F5EFE7] flex items-center gap-1.5 font-semibold bg-[#210D12] px-3 py-2 rounded-lg border border-[#C6A15B]/30 hover:border-[#C6A15B] transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-[#C6A15B]" />
                              <span>Find Your Wine</span>
                            </button>
                          </div>
                        </div>

                        {/* Column 4: VISUALLY FEATURED WINE IMAGE */}
                        <div className="flex flex-col justify-between">
                          <span className="text-[10px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold block mb-3">
                            Featured Vintage
                          </span>
                          {megaMenuFeaturedBottle && (
                            <div
                              className="group/bottle p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-[#C6A15B]/50 transition-all cursor-pointer flex flex-col justify-between"
                              onClick={() => {
                                setSelectedProduct(megaMenuFeaturedBottle);
                                setMegaMenuOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-[#18090C] mb-3">
                                <img
                                  src={getWineImageUrl(megaMenuFeaturedBottle.image)}
                                  alt={megaMenuFeaturedBottle.name}
                                  onError={handleImageError}
                                  className="w-full h-full object-cover group-hover/bottle:scale-106 transition-transform duration-500 text-transparent"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-[#C6A15B] font-semibold">
                                  {megaMenuFeaturedBottle.vintage}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-serif text-sm text-[#F5EFE7] font-normal truncate group-hover/bottle:text-[#C6A15B]">
                                  {megaMenuFeaturedBottle.name}
                                </h5>
                                <span className="font-serif text-xs text-[#C6A15B] tabular-nums block mt-0.5">
                                  {formatPeso(megaMenuFeaturedBottle.price)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Zone 3: Modern Minimal Utility Icons (Search, Wishlist, Cart, Account) */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/90 shrink-0">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 hover:text-[#D5B15C] transition-colors relative cursor-pointer"
                aria-label="Search wines"
                title="Search VÍNEA"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={openWishlist}
                className="p-2 rounded-full hover:bg-white/10 hover:text-[#D5B15C] transition-colors relative cursor-pointer group"
                aria-label="Saved Wines Wishlist"
                title={`Wishlist (${wishlist.length})`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    wishlist.length > 0 ? 'text-[#D5B15C] fill-[#D5B15C]/40' : ''
                  }`}
                />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#861F32] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#130B0D]">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 hover:text-[#D5B15C] transition-colors relative cursor-pointer flex items-center gap-1.5 group"
                aria-label="Shopping Cart"
                data-cursor="add"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D5B15C] text-[#130B0D] text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account Profile Button with persistent avatar preview */}
              <button
                type="button"
                onClick={() => handleNavClick('account')}
                className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'account'
                    ? 'bg-[#861F32] text-white ring-2 ring-[#D5B15C] shadow-lg shadow-[#861F32]/50'
                    : 'hover:bg-white/10 hover:text-[#D5B15C]'
                }`}
                aria-label="Customer Account Profile"
                title={user ? `Signed in as ${user.name}` : 'Sign In / Register (21+)'}
              >
                {user && (fallbackAvatar || user.avatar) && !avatarImgError ? (
                  <img
                    src={fallbackAvatar || user.avatar}
                    alt={user.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#D5B15C]"
                    referrerPolicy="no-referrer"
                    onError={handleAvatarLoadError}
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-white/10 hover:text-[#D5B15C] transition-colors cursor-pointer text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* EXPANSIVE FULLSCREEN / LARGE MODERN SEARCH OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#120A0C]/95 backdrop-blur-2xl flex flex-col justify-start p-6 md:p-12 overflow-y-auto animate-fade-in">
          <div className="max-w-5xl w-full mx-auto space-y-8">
            {/* Top Bar with Close button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C6A15B] font-semibold block">
                  Sommelier Cellar Search
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#F5EFE7] mt-1 font-normal tracking-wide">
                  SEARCH VÍNEA
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-3 rounded-full hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <span className="hidden sm:inline">Close [Esc]</span>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Large Search Input */}
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-[#C6A15B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vintages, châteaux, regions, grape varieties..."
                className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#C6A15B] py-4 pl-12 pr-4 text-xl md:text-2xl text-[#F5EFE7] placeholder-[#B7AAA1]/40 focus:outline-none transition-colors font-serif"
                autoFocus
              />
            </div>

            {/* Curated Suggestion Quick Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs uppercase tracking-widest text-[#B7AAA1] mr-2">Suggestions:</span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    searchQuery === tag
                      ? 'bg-[#C6A15B] text-[#120A0C] border-[#C6A15B] font-semibold'
                      : 'bg-white/5 border-white/10 text-[#F5EFE7] hover:border-[#C6A15B] hover:text-[#C6A15B]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Results Grid */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#B7AAA1] tracking-wider uppercase">
                <span>
                  {searchQuery.trim() ? `Found ${searchResults.length} allocations` : 'Cellar Highlights'}
                </span>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      handleNavClick('shop');
                    }}
                    className="text-[#C6A15B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.product_id}
                    className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#C6A15B]/40 transition-all flex gap-4 items-center cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="w-16 h-22 rounded-xl bg-black/40 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img
                        src={getWineImageUrl(product.image)}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 text-transparent"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] block font-medium">
                        {product.vintage} · {product.region}
                      </span>
                      <h4 className="font-serif text-base text-[#F5EFE7] truncate group-hover:text-[#C6A15B] transition-colors mt-0.5">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-serif text-sm text-[#C6A15B] tabular-nums font-semibold">
                          {formatPeso(product.price)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#210D12] hover:bg-[#861F32] text-xs text-[#F5EFE7] border border-white/10 hover:border-[#C6A15B] transition-colors flex items-center gap-1 cursor-pointer"
                          title="Add to Cellar Allocation"
                        >
                          <Plus className="w-3 h-3 text-[#C6A15B]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#120A0C]/98 backdrop-blur-2xl p-6 pt-24 overflow-y-auto animate-fade-in flex flex-col justify-between">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-[#F5EFE7] hover:text-[#C6A15B] cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-4">
            {/* Direct Account Dashboard Access Card */}
            <div
              onClick={() => handleNavClick('account')}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#210D12] via-[#160A0D] to-[#210D12] border border-[#D5B15C]/40 mb-2 flex items-center justify-between cursor-pointer hover:border-[#D5B15C] transition-colors shadow-lg"
            >
              <div className="flex items-center gap-3">
                {user && (fallbackAvatar || user.avatar) && !avatarImgError ? (
                  <img
                    src={fallbackAvatar || user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D5B15C]"
                    referrerPolicy="no-referrer"
                    onError={handleAvatarLoadError}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#861F32] text-[#D5B15C] flex items-center justify-center font-bold text-sm border border-[#D5B15C]/60 shadow-md">
                    {user ? user.name.charAt(0) : <UserIcon className="w-5 h-5" />}
                  </div>
                )}
                <div>
                  <span className="text-sm font-serif font-bold text-white block">
                    {user ? user.name : 'Customer Account & Orders'}
                  </span>
                  <span className="text-[10px] text-[#D5B15C] uppercase tracking-wider block font-medium">
                    {user ? `${user.membership_tier || 'Connoisseur'} · View Cellar` : 'Tap to sign in or view orders'}
                  </span>
                </div>
              </div>
              <span className="py-1 px-2.5 rounded-lg bg-[#861F32] text-white text-[11px] font-semibold uppercase tracking-wider border border-[#D5B15C]/40">
                Open
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-4">
              VÍNEA Directory
            </span>
            {navItems.map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNavClick(item.tab)}
                className={`w-full text-left py-3.5 px-4 rounded-xl text-base tracking-wider uppercase transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-[#861F32] text-white border border-[#C6A15B]/50 font-semibold'
                    : 'text-[#F5EFE7] hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsQuizOpen(true);
                setMobileMenuOpen(false);
              }}
              className="gold-shimmer-cta w-full mt-6 py-4 px-4 rounded-xl bg-[#210D12] text-[#C6A15B] border border-[#C6A15B]/40 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              <span>Find Your Wine (Sommelier Quiz)</span>
            </button>
          </div>

          <div className="pt-8 border-t border-white/10 text-xs text-[#B7AAA1] space-y-1.5">
            <p className="text-[#C6A15B] font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              5 Private Cellars in Davao City
            </p>
            <p>Climate-controlled nationwide delivery at 13°C</p>
          </div>
        </div>
      )}
    </>
  );
};
