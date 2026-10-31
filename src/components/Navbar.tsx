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
  Wine,
  ArrowRight
} from 'lucide-react';

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
    products,
    user
  } = useWineStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    setSelectedProduct(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { label: string; tab: NavTab; hasDropdown?: boolean }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop All', tab: 'shop', hasDropdown: true },
    { label: 'Red Wine', tab: 'red' },
    { label: 'White Wine', tab: 'white' },
    { label: 'Rosé', tab: 'rose' },
    { label: 'Sparkling', tab: 'sparkling' },
    { label: 'Collections', tab: 'collections' },
    { label: 'Davao Branches', tab: 'branches' },
    { label: 'About', tab: 'about' },
    { label: 'Wine Guide', tab: 'guide' },
  ];

  // Search filtered suggestions
  const suggestedProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.winery.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
        );
      }).slice(0, 4)
    : products.slice(0, 3);

  const handleSelectSuggestedProduct = (p: Product) => {
    setSelectedProduct(p);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnterShop = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#18090C]/98 backdrop-blur-xl border-[#48151F] shadow-2xl'
          : 'bg-[#210D12]/80 backdrop-blur-md border-[#351116]/40 shadow-sm'
      }`}
    >
      {/* Top micro announcement bar (Prompt 2.A) */}
      <div className="bg-[#130B0D] py-2 px-4 text-center border-b border-[#351116]/60 text-[11px] font-medium tracking-wider text-[#C6A15B] flex items-center justify-between">
        <div className="hidden sm:block text-[#B7AAA1] font-light">
          Complimentary climate-controlled delivery across Davao on allocations over ₱5,000
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2.5 text-[#F5EFE7]">
          <span>5 Private Cellars in Davao</span>
          <span className="text-[#C6A15B]/40">·</span>
          <span className="text-[#B7AAA1] font-light">Lanang · Bajada · Matina · Azuela Cove · SM Premier</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Display Serif + Tagline) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#351116] flex items-center justify-center border border-[#C6A15B]/40 shadow-sm group-hover:border-[#C6A15B] transition-all">
              <Wine className="w-5 h-5 text-[#C6A15B] group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#F5EFE7] font-normal leading-none block">
                VÍNEA
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase block mt-1 font-sans">
                Discover · Taste · Remember
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop with Dropdown) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs tracking-wider uppercase font-medium text-[#B7AAA1]">
          {navItems.map((item) => (
            <div
              key={item.tab}
              className="relative"
              onMouseEnter={item.hasDropdown ? handleMouseEnterShop : undefined}
              onMouseLeave={item.hasDropdown ? handleMouseLeaveShop : undefined}
            >
              <button
                onClick={() => handleNavClick(item.tab)}
                className={`py-1.5 flex items-center gap-1 transition-colors hover:text-[#C6A15B] cursor-pointer whitespace-nowrap ${
                  activeTab === item.tab ? 'text-[#C6A15B] font-semibold' : 'text-[#B7AAA1]'
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
                {activeTab === item.tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A15B] rounded-full"></span>
                )}
              </button>

              {/* Mega Dropdown for Wine Categories */}
              {item.hasDropdown && megaMenuOpen && (
                <div className="absolute top-full -left-12 w-[620px] bg-[#150B0E] border border-[#351116] rounded-xl shadow-2xl p-6 grid grid-cols-3 gap-6 animate-fade-in z-50">
                  <div className="col-span-1 space-y-2 border-r border-[#351116] pr-4">
                    <span className="text-[10px] text-[#C6A15B] uppercase tracking-widest font-semibold block mb-2">
                      Wine Varietals
                    </span>
                    <button
                      onClick={() => handleNavClick('red')}
                      className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] transition-colors py-1"
                    >
                      Grand Cru Reds
                    </button>
                    <button
                      onClick={() => handleNavClick('white')}
                      className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] transition-colors py-1"
                    >
                      Heritage Whites
                    </button>
                    <button
                      onClick={() => handleNavClick('rose')}
                      className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] transition-colors py-1"
                    >
                      Provençal Rosé
                    </button>
                    <button
                      onClick={() => handleNavClick('sparkling')}
                      className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] transition-colors py-1"
                    >
                      Vintage Champagne
                    </button>
                    <button
                      onClick={() => handleNavClick('collections')}
                      className="block text-left text-xs text-[#F5EFE7] hover:text-[#C6A15B] transition-colors py-1"
                    >
                      Cellar Allocations
                    </button>
                  </div>

                  <div className="col-span-2 space-y-3">
                    <span className="text-[10px] text-[#C6A15B] uppercase tracking-widest font-semibold block">
                      Cellar Highlights
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => handleNavClick('collections')}
                        className="p-3 rounded-lg bg-[#210D12] hover:bg-[#351116] transition-colors cursor-pointer border border-[#351116]"
                      >
                        <span className="text-[11px] text-[#F5EFE7] font-serif block mb-0.5">Subterranean Reserves</span>
                        <span className="text-[10px] text-[#B7AAA1] block">Aged at constant 13°C</span>
                      </div>
                      <div
                        onClick={() => {
                          setIsQuizOpen(true);
                          setMegaMenuOpen(false);
                        }}
                        className="p-3 rounded-lg bg-[#210D12] hover:bg-[#351116] transition-colors cursor-pointer border border-[#C6A15B]/30"
                      >
                        <span className="text-[11px] text-[#C6A15B] font-serif block mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Find Your Wine</span>
                        </span>
                        <span className="text-[10px] text-[#B7AAA1] block">Sommelier matching</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Zone 3: Interactive Affordances (Search, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-2 sm:gap-3 text-[#B7AAA1]">
          {/* Find Your Wine Button */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#C6A15B] bg-[#130B0D] hover:bg-[#351116] border border-[#C6A15B]/35 transition-all cursor-pointer shadow-sm hover:border-[#C6A15B]"
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

          {/* User Sign In / Account Link */}
          {user ? (
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-2 py-1 px-3 rounded-lg bg-[#130B0D] hover:bg-[#351116] border border-[#351116] transition-all cursor-pointer"
              title={`Customer Account (${user.name})`}
            >
              <div className="w-6 h-6 rounded-full bg-[#861F32] text-[#F5EFE7] text-xs font-serif font-bold flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs text-[#F5EFE7] font-medium max-w-[85px] truncate">
                {user.name.split(' ')[0]}
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
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-neutral-300 xl:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Overlay with Live Product Suggestions (Prompt 2.B) */}
      {searchOpen && (
        <div className="bg-[#150B0E] border-t border-[#351116] p-4 sm:p-6 shadow-2xl animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-[#351116]">
              <Search className="w-5 h-5 text-[#C6A15B] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'shop') setActiveTab('shop');
                }}
                placeholder="Search wines by name, vintage, appellation (Bordeaux, Barolo), or grape variety..."
                className="w-full bg-transparent border-none text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none text-sm md:text-base"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#B7AAA1] hover:text-white px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#B7AAA1] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions row */}
            <div className="pt-4">
              <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] font-semibold block mb-3">
                {searchQuery ? 'Top Search Matches' : 'Cellar Recommendations'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suggestedProducts.map((p) => (
                  <div
                    key={p.product_id}
                    onClick={() => handleSelectSuggestedProduct(p)}
                    className="p-3 rounded-xl bg-[#210D12] hover:bg-[#351116] border border-[#351116] hover:border-[#C6A15B]/50 transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-serif text-sm text-[#F5EFE7] truncate">{p.name}</h5>
                      <span className="text-xs text-[#C6A15B] font-semibold tabular-nums">
                        {formatPeso(p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#150B0E] border-b border-[#351116] px-6 py-6 animate-slide-down">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`text-left py-2.5 px-3 rounded-lg text-sm tracking-wider uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === item.tab
                    ? 'bg-[#351116] text-[#C6A15B]'
                    : 'text-[#B7AAA1] hover:bg-white/5'
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
                className="flex items-center gap-2 py-3 px-3 rounded-lg text-sm font-semibold text-[#C6A15B] bg-[#351116] border border-[#C6A15B]/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Your Wine: Sommelier Quiz</span>
              </button>

              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-[#F5EFE7] bg-[#210D12]"
              >
                <UserIcon className="w-4 h-4 text-[#C6A15B]" />
                <span>{user ? `Account (${user.name})` : 'Customer Sign In'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
