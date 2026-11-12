import React, { useState, useEffect } from 'react';
import { Product } from '../types/wine';
import { useWineStore } from '../context/WineStoreContext';
import { ProductCard } from './ProductCard';
import { formatPeso } from '../utils/formatCurrency';
import {
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  Utensils,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Share2,
  ZoomIn,
  MessageSquarePlus,
  Wine,
  TrendingUp,
  Plus
} from 'lucide-react';
import { VintageComparisonTab } from './VintageComparisonTab';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { LazyWineImage } from './LazyWineImage';

type DetailTab = 'vintage' | 'tasting' | 'reviews';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    setIsCheckoutOpen,
    setSelectedProduct,
    showToast
  } = useWineStore();

  const [quantity, setQuantity] = useState(1);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('vintage');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.image]);

  const allPhotos = [product.image, ...(product.images || [])].filter(Boolean);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const isFavorited = isInWishlist(product.product_id);
  const isOutOfStock = product.stock <= 0;

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.product_id === product.product_id);

  // "You May Also Like"
  const relatedProducts = products
    .filter((p) => p.product_id !== product.product_id && (p.wine_type === product.wine_type || p.country === product.country))
    .slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.', 'info');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewSubmitting(true);
    addReview(product.product_id, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitting(false);
  };

  // Sensory metric dot helper (1-5 scale)
  const bodyDots = product.body === 'Full' ? 5 : product.body === 'Medium' ? 3 : 2;
  const acidityDots = product.wine_type === 'White' || product.wine_type === 'Sparkling' ? 4 : 3;
  const tanninDots = product.wine_type === 'Red' ? (product.body === 'Full' ? 5 : 4) : 1;

  const renderDots = (value: number) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              dot <= value
                ? 'bg-[#D5B15C] shadow-[0_0_8px_#D5B15C]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#FDFBF7]">
      {/* Breadcrumb Navigation with High-Contrast Legibility */}
      <nav className="flex items-center gap-2 text-xs text-white/80 mb-5 sm:mb-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={onBack}
          className="hover:text-[#E5D7B7] text-white/90 transition-colors flex items-center gap-1.5 cursor-pointer font-medium shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D5B15C]" />
          <span>Back to Catalog</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
        <span className="text-white/80 font-medium">{product.wine_type} Wine</span>
        <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
        <span className="text-white/80 font-medium">{product.country}</span>
        <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
        <span className="text-[#E5D7B7] truncate font-bold">{product.name}</span>
      </nav>

      {/* Main Split-Screen PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-16 sm:mb-20 items-start">
        {/* Left Column: Large Sticky Bottle Showcase */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 flex flex-col items-center">
          <div
            className="relative w-full aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#210D12] via-[#14080A] to-[#0A0406] cursor-crosshair group shadow-2xl p-4 sm:p-6 flex items-center justify-center border border-[#D5B15C]/25"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Ambient luxury cellar backdrop radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#861F32]/25 via-transparent to-transparent pointer-events-none" />

            <div className="relative w-full h-full flex items-center justify-center animate-float z-5">
              <img
                src={getWineImageUrl(selectedImage || product.image)}
                alt={product.name}
                onError={handleImageError}
                className={`max-h-full max-w-full object-contain transition-transform duration-200 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`
                      }
                    : undefined
                }
                referrerPolicy="no-referrer"
              />
            </div>

            {/* High-Contrast Floating Vintage Badge (Shielded against light/busy backgrounds) */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none z-20">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0D0407]/95 backdrop-blur-xl border border-[#D5B15C] text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.22em] text-white font-bold shadow-2xl ring-1 ring-black">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D5B15C] shadow-[0_0_10px_#D5B15C]" />
                <span className="text-[#F5EFE7] font-extrabold">VINTAGE {product.vintage}</span>
                <span className="text-[#D5B15C]/70">·</span>
                <span className="text-white font-bold">{product.wine_type.toUpperCase()}</span>
              </span>
            </div>

            {/* High-Contrast Zoom Hint Badge (Desktop hover only) */}
            <div className="hidden sm:flex absolute bottom-4 right-4 pointer-events-none bg-[#0D0407]/95 backdrop-blur-xl px-4 py-2 rounded-full text-xs text-white border border-white/30 items-center gap-2 font-semibold shadow-2xl z-20 ring-1 ring-black">
              <ZoomIn className="w-3.5 h-3.5 text-[#D5B15C]" />
              <span className="text-[#FDFBF7] font-semibold">Hover image to inspect label</span>
            </div>
          </div>

          {/* Interactive Multi-Photo Gallery Thumbnails with Lazy Loading */}
          {allPhotos.length > 1 && (
            <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto pb-1">
              {allPhotos.map((imgUrl, i) => {
                const isSelected = (selectedImage || product.image) === imgUrl;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-black/60 p-1 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#D5B15C] scale-105 shadow-md shadow-[#D5B15C]/40 ring-2 ring-[#D5B15C]'
                        : 'border-white/15 hover:border-white/50 opacity-75 hover:opacity-100'
                    }`}
                    title={`View photo ${i + 1}`}
                  >
                    <LazyWineImage
                      src={imgUrl}
                      alt={`${product.name} photo ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Provenance & Serving Conditions Glass Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-4 sm:mt-5 text-center">
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl dark-luxury-glass text-xs border border-white/10">
              <Thermometer className="w-4 h-4 mx-auto mb-1 text-[#D5B15C]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#E5D7B7] font-semibold block">Serving Temp</span>
              <span className="font-bold text-white mt-1 block text-xs sm:text-sm">{product.serving_temp}</span>
            </div>
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl dark-luxury-glass text-xs border border-white/10">
              <Wine className="w-4 h-4 mx-auto mb-1 text-[#D5B15C]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#E5D7B7] font-semibold block">Decanting</span>
              <span className="font-bold text-white mt-1 block text-xs sm:text-sm">{product.decanting}</span>
            </div>
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl dark-luxury-glass text-xs border border-white/10">
              <ShieldAlert className="w-4 h-4 mx-auto mb-1 text-[#D5B15C]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#E5D7B7] font-semibold block">Cellar Seal</span>
              <span className="font-bold text-white mt-1 block text-xs sm:text-sm leading-tight">Inspected Provenance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module & Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
          <div>
            {/* Terroir & Origin Header with enhanced brand contrast */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2">
              <span className="text-[#E5D7B7] text-sm sm:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] drop-shadow-sm">
                {product.winery}
              </span>
              <span className="text-white/80 font-semibold text-xs tracking-wider">
                {product.country} · {product.region}
              </span>
            </div>

            {/* Product Title with Modern Editorial Scale & pure white readability */}
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white mb-4 leading-[1.1] tracking-tight drop-shadow-sm">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm mb-6 pb-6 border-b border-white/15">
              <div className="flex items-center text-[#D5B15C]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-white tabular-nums text-base">{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-white/70 text-xs">({product.reviews_count} collector reviews)</span>
              <button
                onClick={handleShare}
                className="ml-auto text-xs text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D5B15C]" />
                <span>Share</span>
              </button>
            </div>

            {/* Pricing Section with High-Contrast Champagne Gold */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl sm:text-5xl text-[#E5D7B7] font-bold tabular-nums drop-shadow-sm">
                  {formatPeso(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-base text-white/50 line-through tabular-nums">
                    {formatPeso(product.original_price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 mt-1 font-medium">
                PHP · Davao Climate Delivery Included · Available across 5 Cellar Branches
              </p>
              <p className="text-xs mt-2 font-medium">
                {isOutOfStock ? (
                  <span className="text-rose-400 font-bold">Sold Out of Allocation</span>
                ) : (
                  <span className="text-emerald-400 font-bold">In Cellar Stock · {product.stock} allocations remaining</span>
                )}
              </p>
            </div>

            {/* Sensory Attribute Dots (Body, Acidity, Tannin) with High-Contrast Gold */}
            <div className="p-3 sm:p-4.5 rounded-2xl dark-luxury-glass mb-6 grid grid-cols-3 gap-2 sm:gap-4 border border-white/10">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E5D7B7] font-bold block mb-1.5">
                  Body ({product.body})
                </span>
                {renderDots(bodyDots)}
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E5D7B7] font-bold block mb-1.5">
                  Acidity
                </span>
                {renderDots(acidityDots)}
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E5D7B7] font-bold block mb-1.5">
                  Tannin
                </span>
                {renderDots(tanninDots)}
              </div>
            </div>

            {/* Editorial Description with Crisp Reading Contrast */}
            <p className="text-[#F5EFE7] text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Wine Specifications Matrix with Enhanced Legibility */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5 p-3.5 sm:p-5 rounded-2xl dark-luxury-glass mb-8 border border-white/10">
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Grape Variety</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.grape_variety}</span>
              </div>
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Alcohol %</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.alcohol_percentage}% ABV</span>
              </div>
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Sweetness Level</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.sweetness}</span>
              </div>
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Body</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.body} Body</span>
              </div>
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Appellation</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.region}</span>
              </div>
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">Vintage Year</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{product.vintage}</span>
              </div>
            </div>

            {/* Purchase CTA Cluster with + ADD TO CELLAR */}
            <div className="flex flex-col gap-3.5 mb-8">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-white/15 rounded-xl dark-luxury-glass shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="px-3 sm:px-4 py-3 text-white hover:text-[#D5B15C] transition-colors cursor-pointer text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 sm:px-4 py-3 text-sm font-bold tabular-nums min-w-[2.25rem] sm:min-w-[2.5rem] text-center text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="px-3 sm:px-4 py-3 text-white hover:text-[#D5B15C] transition-colors cursor-pointer text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* + ADD TO CELLAR Primary CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn-magnetic flex-1 min-w-[170px] py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs sm:text-sm uppercase tracking-[0.14em] sm:tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl group disabled:opacity-50 border border-[#D5B15C]/40"
                  data-cursor="add"
                >
                  <Plus className="w-4 h-4 text-[#D5B15C] btn-magnetic-arrow shrink-0" />
                  <span>+ ADD TO CELLAR</span>
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product.product_id)}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                    isFavorited
                      ? 'bg-[#861F32] text-white border-[#D5B15C]'
                      : 'border-white/15 hover:border-[#D5B15C] text-white/80 dark-luxury-glass'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-[#D5B15C]' : ''}`} />
                </button>
              </div>

              {/* Instant Checkout Button */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-magnetic w-full py-4 px-6 rounded-xl dark-luxury-glass hover:bg-white/10 text-white text-xs sm:text-sm uppercase tracking-[0.15em] font-bold transition-all cursor-pointer border border-white/15 disabled:opacity-50"
              >
                Instant Davao Concierge Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Product Detail Tabs Navigation */}
      <div className="flex items-center gap-4 sm:gap-8 border-b border-white/15 mb-12 overflow-x-auto">
        <button
          onClick={() => setActiveDetailTab('vintage')}
          className={`pb-4 px-1 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeDetailTab === 'vintage'
              ? 'border-[#D5B15C] text-[#E5D7B7] font-bold'
              : 'border-transparent text-white/70 hover:text-white font-medium'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#D5B15C]" />
          <span>Vintage Analytics</span>
        </button>

        <button
          onClick={() => setActiveDetailTab('tasting')}
          className={`pb-4 px-1 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeDetailTab === 'tasting'
              ? 'border-[#D5B15C] text-[#E5D7B7] font-bold'
              : 'border-transparent text-white/70 hover:text-white font-medium'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D5B15C]" />
          <span>Sensory & Gastronomy</span>
        </button>

        <button
          onClick={() => setActiveDetailTab('reviews')}
          className={`pb-4 px-1 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeDetailTab === 'reviews'
              ? 'border-[#D5B15C] text-[#E5D7B7] font-bold'
              : 'border-transparent text-white/70 hover:text-white font-medium'
          }`}
        >
          <Star className="w-4 h-4 text-[#D5B15C]" />
          <span>Collector Reviews ({productReviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Vintage Comparison (Recharts Visualizations) */}
      {activeDetailTab === 'vintage' && (
        <div className="mb-20">
          <VintageComparisonTab product={product} />
        </div>
      )}

      {/* Tab 2: Sensory Architecture & Gastronomy */}
      {activeDetailTab === 'tasting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 p-4 sm:p-8 rounded-3xl dark-luxury-glass-elevated border border-white/10">
          {/* Sommelier Tasting Notes */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-3">
              <Sparkles className="w-4 h-4 text-[#D5B15C]" />
              <span>Kent Jorich Rabago's Tasting Notes</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-4">
              Sensory Architecture
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1.5">
                  Aromas & Bouquet
                </span>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let aromas: string[] = ['Blackberry', 'Cassis', 'French Oak'];
                    if (product.tasting_notes) {
                      let tn = product.tasting_notes;
                      if (typeof tn === 'string') {
                        try { tn = JSON.parse(tn); } catch {}
                      }
                      if (tn && typeof tn === 'object') {
                        if (Array.isArray(tn.aroma)) {
                          aromas = tn.aroma;
                        } else if (typeof tn.aroma === 'string' && tn.aroma) {
                          aromas = (tn.aroma as string).split(',').map((s: string) => s.trim());
                        }
                      }
                    }
                    return aromas.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-[#18090C] border border-[#D5B15C]/40 text-xs text-white font-medium"
                      >
                        {note}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">
                  Palate & Texture
                </span>
                <p className="text-[#F5EFE7] leading-relaxed font-normal">
                  {typeof product.tasting_notes === 'string'
                    ? product.tasting_notes
                    : product.tasting_notes?.palate || 'Structured, velvety tannins, refined fruit concentration and noble French oak.'}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#E5D7B7] font-bold uppercase tracking-wider block mb-1">
                  Finish & Longevity
                </span>
                <p className="text-[#F5EFE7] leading-relaxed font-normal">
                  {typeof product.tasting_notes === 'object'
                    ? product.tasting_notes?.finish || 'Persistent, harmonious finish with lingering mineral and spice notes.'
                    : 'Persistent, harmonious finish.'}
                </p>
              </div>
            </div>
          </div>

          {/* Food Pairings */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-3">
              <Utensils className="w-4 h-4 text-[#D5B15C]" />
              <span>Culinary Harmonization</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-4">
              Gastronomy Suggestions
            </h3>
            <p className="text-xs text-white/80 mb-4 font-normal">
              Crafted to complement rich dining experiences by cleansing the palate and accentuating savoriness.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.food_pairings.map((pairing, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl dark-luxury-glass flex items-center gap-2.5 text-xs font-semibold text-white border border-white/10"
                >
                  <div className="w-2 h-2 rounded-full bg-[#D5B15C] shrink-0" />
                  <span>{pairing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reviews & Community Feedback */}
      {activeDetailTab === 'reviews' && (
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-white/15 pb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-1">
                Collector Verdicts
              </p>
              <h3 className="font-serif text-3xl text-white font-normal">
                Customer Reviews ({productReviews.length})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#D5B15C] mt-3 sm:mt-0">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-white text-base">{product.rating.toFixed(1)}</span>
              <span className="text-white/70">Average across {product.reviews_count} collectors</span>
            </div>
          </div>

          {/* Existing reviews */}
          <div className="space-y-4 mb-10">
            {productReviews.length === 0 ? (
              <p className="text-sm text-white/80 py-6 text-center italic">
                No reviews written yet. Be the first to add your tasting notes for this vintage.
              </p>
            ) : (
              productReviews.map((rev) => (
                <div
                  key={rev.review_id}
                  className="p-5 rounded-2xl dark-luxury-glass border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.user_name}</span>
                      <span className="text-xs text-white/50">· {rev.review_date}</span>
                    </div>
                    <div className="flex items-center text-[#D5B15C]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F5EFE7] leading-relaxed font-normal">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="p-6 sm:p-8 rounded-3xl dark-luxury-glass-elevated max-w-2xl border border-white/10"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E5D7B7] font-bold mb-3">
              <MessageSquarePlus className="w-4 h-4 text-[#D5B15C]" />
              <span>Leave a Tasting Review</span>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-white/80 font-medium mb-1.5">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 text-[#D5B15C] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-neutral-700'}`}
                    />
                  </button>
                ))}
                <span className="text-xs text-white font-bold ml-2">{newRating} Stars</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-white/80 font-medium mb-1.5">Your Tasting Impression</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe aromas, palate texture, aging notes, or food pairings..."
                rows={3}
                required
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D5B15C]"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting || !newComment.trim()}
              className="btn-magnetic py-3 px-6 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-bold transition-all cursor-pointer disabled:opacity-50 border border-[#D5B15C]/40"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* “You May Also Like” Section */}
      <div className="border-t border-white/15 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-1">
              Curated Recommendations
            </p>
            <h3 className="font-serif text-3xl text-white font-normal">
              You May Also Like
            </h3>
          </div>
          <button
            onClick={onBack}
            className="text-xs uppercase tracking-wider text-[#E5D7B7] font-bold hover:underline cursor-pointer"
          >
            View Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.product_id}
              product={rel}
              onSelect={(p) => {
                setSelectedProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
