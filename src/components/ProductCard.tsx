import React, { useState } from 'react';
import { Product } from '../types/wine';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { LazyWineImage } from './LazyWineImage';

export type ProductCardStyle = 'boutique' | 'editorial' | 'collector';

interface ProductCardProps {
  product: Product;
  styleVariant?: ProductCardStyle;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  styleVariant = 'boutique',
  onSelect
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setSelectedProduct
  } = useWineStore();

  const [addedRecently, setAddedRecently] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);
  const isFavorited = isInWishlist(product.product_id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  // Staggered cellar float so cards in a grid float with natural, gentle rhythm
  const isEven = (product.product_id.charCodeAt(product.product_id.length - 1) % 2 === 0);
  const floatAnimationClass = isEven ? 'animate-float' : 'animate-float-delayed';

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setSelectedProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPulsing(true);
    toggleWishlist(product.product_id);
    setTimeout(() => setHeartPulsing(false), 500);
  };

  // STYLE A: Editorial Showcase (Larger wine bottle focus, oversized wine name, minimal metadata)
  if (styleVariant === 'editorial') {
    return (
      <div
        className="group relative rounded-2xl bg-[#18090C] hover:bg-[#210D12] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-400 ease-out flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
        data-cursor="view"
      >
        <div
          className="relative aspect-3/4 overflow-hidden bg-gradient-to-b from-[#2A0E13] to-[#130B0D] cursor-pointer"
          onClick={handleCardClick}
        >
          {/* Subtle Floating Wine Bottle in Cellar with Lazy Loading & Blur-Up */}
          <div className={`w-full h-full ${floatAnimationClass}`}>
            <LazyWineImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out text-transparent"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#18090C] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none" />

          {/* Editorial Top Stamp */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C6A15B] uppercase bg-black/75 px-3 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
              {product.vintage} · {product.region}
            </span>
          </div>

          {/* Wishlist Heart Toggle with Pulse */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
              isFavorited
                ? 'bg-[#861F32] text-[#D5B15C] border border-[#D5B15C] shadow-lg shadow-[#861F32]/60'
                : 'bg-black/60 text-[#B7AAA1] hover:text-white hover:bg-black/85 border border-white/15'
            } ${heartPulsing ? 'scale-125' : 'hover:scale-110'}`}
            title={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
            aria-label={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-[#D5B15C] text-[#D5B15C]' : ''}`} />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="gold-shimmer-cta w-full py-2.5 px-4 rounded-xl bg-[#210D12]/95 hover:bg-[#351116] text-[#C6A15B] text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 backdrop-blur-md flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Editorial Quick View</span>
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#E5D7B7] uppercase tracking-wider font-bold block mb-1">
              {product.winery}
            </span>
            <h3
              onClick={handleCardClick}
              className="font-serif text-2xl text-white font-medium leading-snug group-hover:text-[#D5B15C] transition-colors cursor-pointer mb-2"
            >
              {product.name}
            </h3>
            <p className="text-xs text-white/80 line-clamp-2 font-normal mb-4">
              {product.tasting_notes?.palate || product.description || 'Silky tannins with wild blackberries and toasted oak finish.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="font-serif text-2xl text-[#E5D7B7] font-bold tabular-nums">
              {formatPeso(product.price)}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-magnetic py-2 px-4 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md group"
              data-cursor="add"
            >
              {addedRecently ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B] btn-magnetic-arrow" />}
              <span>{addedRecently ? 'In Cellar' : '+ Cellar'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STYLE C: Collector's Dark Luxury Card (Deep Burgundy canvas, gold details, exclusive collection labels)
  if (styleVariant === 'collector') {
    return (
      <div
        className="group relative rounded-2xl bg-gradient-to-b from-[#1E0B10] to-[#12070A] hover:from-[#250E14] hover:to-[#18090C] border border-[#48151F] hover:border-[#C6A15B]/70 transition-all duration-400 ease-out flex flex-col justify-between overflow-hidden shadow-2xl hover:-translate-y-1.5"
        data-cursor="view"
      >
        <div
          className="relative aspect-4/3 overflow-hidden bg-[#18090C] cursor-pointer"
          onClick={handleCardClick}
        >
          {/* Subtle Floating Wine Bottle in Cellar with Lazy Loading & Blur-Up */}
          <div className={`w-full h-full ${floatAnimationClass}`}>
            <LazyWineImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out text-transparent"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#12070A] via-transparent to-black/40 pointer-events-none" />

          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase bg-black/75 px-2.5 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
              Vault Reserve · {product.vintage}
            </span>
          </div>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer z-10 ${
              isFavorited
                ? 'bg-[#861F32] text-[#D5B15C] border border-[#D5B15C] shadow-lg shadow-[#861F32]/60'
                : 'bg-black/60 text-[#B7AAA1] hover:text-white hover:bg-black/85 border border-white/15'
            } ${heartPulsing ? 'scale-125' : 'hover:scale-110'}`}
            title={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
            aria-label={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-[#D5B15C] text-[#D5B15C]' : ''}`} />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[11px] text-[#B7AAA1] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{product.region}, {product.country}</span>
              <span className="text-[#C6A15B] font-medium">{product.wine_type} · 750ml</span>
            </div>
            <h3
              onClick={handleCardClick}
              className="font-serif text-lg sm:text-xl text-[#F5EFE7] font-normal leading-snug line-clamp-1 group-hover:text-[#C6A15B] transition-colors cursor-pointer mb-2"
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#B7AAA1] mb-3">
              <span>{product.grape_variety}</span>
              <span>·</span>
              <span>{product.body} Body</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Original Cask</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#351116] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">Valuation</span>
              <span className="font-serif text-xl sm:text-2xl font-normal text-[#C6A15B] tabular-nums block">
                {formatPeso(product.price)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="gold-shimmer-cta py-2 px-3.5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              data-cursor="add"
            >
              {addedRecently ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />}
              <span>{addedRecently ? 'Acquired' : 'Acquire'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STYLE B (DEFAULT): Boutique Product Grid (Refined borders, subtle hover interactions, clean typography)
  return (
    <div
      className="group relative rounded-2xl bg-[#130B0D] hover:bg-[#1c0d11] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-400 ease-out flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5"
      data-cursor="view"
    >
      {/* Top Media Area */}
      <div
        className="relative aspect-4/3 overflow-hidden bg-gradient-to-b from-[#2A0E13] to-[#130B0D] cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Subtle Floating Wine Bottle in Cellar with Lazy Loading & Blur-Up */}
        <div className={`w-full h-full ${floatAnimationClass}`}>
          <LazyWineImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out text-transparent"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Vintage & Wine Type Metadata (Zero-Pill Discipline) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 drop-shadow-md z-10">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C6A15B] uppercase">
            {product.vintage} · {product.wine_type} · 750ml
          </span>
          {isOutOfStock ? (
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
              · Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-300">
              · {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Button with Pulse Micro-interaction */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer z-10 ${
            isFavorited
              ? 'bg-[#861F32] text-[#D5B15C] border border-[#D5B15C] shadow-lg shadow-[#861F32]/60'
              : 'bg-black/60 text-[#B7AAA1] hover:text-white hover:bg-black/85 border border-white/15'
          } ${heartPulsing ? 'scale-125' : 'hover:scale-110'}`}
          title={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
          aria-label={isFavorited ? 'Remove from cellar wishlist' : 'Save to cellar wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-[#D5B15C] text-[#D5B15C]' : ''}`} />
        </button>

        {/* Quick View Button (Reveals on hover) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2 px-3 rounded-lg bg-[#210D12]/95 hover:bg-[#351116] text-[#C6A15B] text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 backdrop-blur-md flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Origin & Winery metadata */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="truncate text-[#E5D7B7] font-bold uppercase tracking-wider">{product.winery}</span>
            <span className="shrink-0 text-white/70 font-medium">
              {product.country} · {product.region}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleCardClick}
            className="font-serif text-lg sm:text-xl text-white font-medium leading-snug line-clamp-1 group-hover:text-[#D5B15C] transition-colors cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Grape & Body characteristics */}
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium mb-2.5">
            <span>{product.grape_variety}</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>{product.body} Body</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>{product.sweetness}</span>
          </div>

          {/* Tasting Note Sneak Peek */}
          <p className="text-xs text-white/75 line-clamp-1 font-normal italic mb-3 group-hover:text-white transition-colors">
            {product.tasting_notes?.palate || product.description}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-xs text-white/80 mb-4">
            <div className="flex items-center text-[#D5B15C]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-white tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-white/70 tabular-nums">({product.reviews_count} reviews)</span>
          </div>
        </div>

        {/* Price & Action row */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#E5D7B7] tabular-nums block">
              {formatPeso(product.price)}
            </span>
            <span className="text-[10px] text-white/70 uppercase tracking-wider block font-medium">
              Davao Climate Cellar
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn-magnetic px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer group ${
              isOutOfStock
                ? 'bg-[#1e1114] text-neutral-500 border border-white/5 cursor-not-allowed'
                : addedRecently
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#861F32] hover:bg-[#a1253c] text-white border border-white/10'
            }`}
            title={isOutOfStock ? 'Sold out' : 'Add to Cellar'}
            data-cursor="add"
          >
            {addedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">In Cellar</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B] btn-magnetic-arrow" />
                <span className="hidden sm:inline">+ Cellar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
