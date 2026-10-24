import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { X, Heart, ShoppingBag, Star, Sparkles, Utensils, Check, ArrowRight } from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useWineStore();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.product_id);
  const isOutOfStock = quickViewProduct.stock <= 0;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleViewFullDetails = () => {
    setSelectedProduct(quickViewProduct);
    setQuickViewProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 md:p-8 text-[#F5EFE7]">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer absolute top-4 right-4"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Media Column */}
          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gradient-to-b from-[#48151F]/40 to-[#130B0D] border border-[#48151F]">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold drop-shadow-md">
                Vintage {quickViewProduct.vintage} · {quickViewProduct.wine_type}
              </span>
            </div>
          </div>

          {/* Right Product Details Column */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#C6A15B] font-medium uppercase tracking-widest mb-1.5">
              <span>{quickViewProduct.winery}</span>
              <span>{quickViewProduct.country} · {quickViewProduct.region}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal mb-2 leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs mb-4">
              <div className="flex items-center text-[#C6A15B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#F5EFE7] tabular-nums">{quickViewProduct.rating.toFixed(1)}</span>
              <span className="text-[#B7AAA1]">({quickViewProduct.reviews_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-3xl text-[#C6A15B] tabular-nums">
                {formatPeso(quickViewProduct.price)}
              </span>
              {quickViewProduct.original_price && (
                <span className="text-sm text-[#B7AAA1]/60 line-through tabular-nums">
                  {formatPeso(quickViewProduct.original_price)}
                </span>
              )}
              <span className="text-xs text-[#B7AAA1]">Tax included · Free delivery across Davao over ₱5,000</span>
            </div>

            <p className="text-xs sm:text-sm text-[#B7AAA1] leading-relaxed mb-6 font-light line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#210D12] p-3 rounded-lg border border-[#48151F] mb-6">
              <div>
                <span className="text-[#B7AAA1]/70 block text-[11px]">Grape Variety</span>
                <span className="font-medium text-[#F5EFE7]">{quickViewProduct.grape_variety}</span>
              </div>
              <div>
                <span className="text-[#B7AAA1]/70 block text-[11px]">Alcohol</span>
                <span className="font-medium text-[#F5EFE7]">{quickViewProduct.alcohol_percentage}% ABV</span>
              </div>
              <div>
                <span className="text-[#B7AAA1]/70 block text-[11px]">Body & Sweetness</span>
                <span className="font-medium text-[#F5EFE7]">{quickViewProduct.body} Body · {quickViewProduct.sweetness}</span>
              </div>
              <div>
                <span className="text-[#B7AAA1]/70 block text-[11px]">Stock Status</span>
                <span className={`font-medium ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOutOfStock ? 'Sold Out' : `${quickViewProduct.stock} bottles in cellar`}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Actions */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#48151F] rounded-lg bg-[#130B0D]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="px-3 py-2 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold tabular-nums min-w-[2rem] text-center text-[#F5EFE7]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= quickViewProduct.stock}
                    className="px-3 py-2 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#48151F] hover:bg-[#861F32] text-[#C6A15B] hover:text-white border border-[#C6A15B]/40 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.product_id)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'bg-[#861F32] text-white border-[#C6A15B]'
                      : 'border-[#48151F] hover:border-[#C6A15B] text-[#B7AAA1] bg-[#130B0D]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg"
                >
                  Instant Checkout
                </button>

                <button
                  onClick={handleViewFullDetails}
                  className="py-3 px-4 rounded-lg border border-[#48151F] hover:border-[#C6A15B] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs tracking-wider uppercase font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
