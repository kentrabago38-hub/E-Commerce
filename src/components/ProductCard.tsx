import React from 'react';
import { Product } from '../types/wine';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setSelectedProduct
  } = useWineStore();

  const isFavorited = isInWishlist(product.product_id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setSelectedProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative rounded-xl bg-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl">
      {/* Top Media Area */}
      <div
        className="relative aspect-4/3 overflow-hidden bg-gradient-to-b from-[#2A0E13] to-[#130B0D] cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/30" />

        {/* Vintage & Wine Type Metadata (Zero-Pill Discipline) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 drop-shadow-md">
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

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.product_id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
            isFavorited
              ? 'bg-[#861F32] text-white border border-[#C6A15B]'
              : 'bg-black/50 text-[#B7AAA1] hover:text-white hover:bg-black/80 border border-white/10'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (reveals on hover on desktop) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
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
          <div className="flex items-center justify-between text-xs text-[#B7AAA1] mb-1.5">
            <span className="truncate font-serif italic">{product.winery}</span>
            <span className="shrink-0 text-[#B7AAA1]/80">
              {product.country} · {product.region}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleCardClick}
            className="font-serif text-lg sm:text-xl text-[#F5EFE7] font-normal leading-snug line-clamp-1 group-hover:text-[#C6A15B] transition-colors cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Grape & Body characteristics */}
          <div className="flex items-center gap-2 text-xs text-[#B7AAA1] mb-3">
            <span>{product.grape_variety}</span>
            <span aria-hidden="true" className="text-[#351116]">·</span>
            <span>{product.body} Body</span>
            <span aria-hidden="true" className="text-[#351116]">·</span>
            <span>{product.sweetness}</span>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-xs text-[#B7AAA1] mb-4">
            <div className="flex items-center text-[#C6A15B]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-[#F5EFE7] tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-[#B7AAA1]/70 tabular-nums">({product.reviews_count} reviews)</span>
          </div>
        </div>

        {/* Price & Action row */}
        <div className="pt-3 border-t border-[#351116] flex items-center justify-between gap-3">
          <div>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#C6A15B] tabular-nums block">
              {formatPeso(product.price)}
            </span>
            <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">
              Davao Climate Cellar
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={isOutOfStock}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isOutOfStock
                ? 'bg-[#1e1114] text-neutral-500 border border-neutral-700/40 cursor-not-allowed'
                : 'bg-[#861F32] hover:bg-[#a1253c] text-white border border-[#C6A15B]/40 hover:border-[#C6A15B]'
            }`}
            title={isOutOfStock ? 'Sold out' : 'Add to cart'}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
