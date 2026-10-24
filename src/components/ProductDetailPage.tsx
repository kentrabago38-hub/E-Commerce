import React, { useState } from 'react';
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
  Wine
} from 'lucide-react';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

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

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#f3efe6]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={onBack}
          className="hover:text-[#dfbe76] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        <span className="text-neutral-400">{product.wine_type} Wine</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        <span className="text-neutral-400">{product.country}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        <span className="text-[#dfbe76] truncate font-medium">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
        {/* Left Gallery: High-resolution Bottle Image with Zoom */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-gradient-to-b from-[#48151F]/40 via-[#210D12] to-[#130B0D] border border-[#48151F] cursor-crosshair group shadow-2xl"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${
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

            {/* Vintage tag */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold drop-shadow-md">
                Vintage {product.vintage} · {product.wine_type}
              </span>
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 pointer-events-none bg-[#130B0D]/80 backdrop-blur-md px-3 py-1 rounded text-[11px] text-[#B7AAA1] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Hover image to inspect label</span>
            </div>
          </div>

          {/* Provenance & Shipping Badges */}
          <div className="grid grid-cols-3 gap-3 w-full mt-4 text-center">
            <div className="p-3 rounded-lg bg-[#130B0D] border border-[#48151F] text-xs">
              <Thermometer className="w-4 h-4 mx-auto mb-1 text-[#C6A15B]" />
              <span className="text-[11px] text-[#B7AAA1] block">Serving Temp</span>
              <span className="font-semibold text-[#F5EFE7]">{product.serving_temp}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#130B0D] border border-[#48151F] text-xs">
              <Wine className="w-4 h-4 mx-auto mb-1 text-[#C6A15B]" />
              <span className="text-[11px] text-[#B7AAA1] block">Decanting</span>
              <span className="font-semibold text-[#F5EFE7]">{product.decanting}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#130B0D] border border-[#48151F] text-xs">
              <ShieldAlert className="w-4 h-4 mx-auto mb-1 text-[#C6A15B]" />
              <span className="text-[11px] text-[#B7AAA1] block">Cellar Seal</span>
              <span className="font-semibold text-[#F5EFE7]">Inspected Provenance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module & Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Terroir Header */}
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-medium mb-2">
              <span>{product.winery}</span>
              <span>{product.country} · {product.region}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F5EFE7] mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3 text-sm mb-6 pb-6 border-b border-[#48151F]">
              <div className="flex items-center text-[#C6A15B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-600'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#F5EFE7] tabular-nums">{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-[#B7AAA1]">({product.reviews_count} collector reviews)</span>
              <button
                onClick={handleShare}
                className="ml-auto text-xs text-[#B7AAA1] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-[#C6A15B] font-normal tabular-nums">
                  {formatPeso(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-base text-[#B7AAA1]/60 line-through tabular-nums">
                    {formatPeso(product.original_price)}
                  </span>
                )}
                <span className="text-xs text-[#B7AAA1]">PHP · Tax Included · Available in 5 Davao Branches</span>
              </div>
              <p className="text-xs text-[#F5EFE7] mt-1 font-medium">
                {isOutOfStock ? (
                  <span className="text-rose-400">Sold Out</span>
                ) : (
                  <span className="text-emerald-400">In Stock · {product.stock} bottles remaining in allocation</span>
                )}
              </p>
            </div>

            {/* Description */}
            <p className="text-[#B7AAA1] text-sm sm:text-base leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {/* Wine Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#130B0D] border border-[#48151F] mb-8">
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Grape Variety</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.grape_variety}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Alcohol %</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.alcohol_percentage}% ABV</span>
              </div>
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Sweetness Level</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.sweetness}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Body</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.body} Body</span>
              </div>
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Appellation</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.region}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#B7AAA1]/70 uppercase tracking-wider block">Vintage Year</span>
                <span className="text-xs sm:text-sm font-medium text-[#F5EFE7]">{product.vintage}</span>
              </div>
            </div>

            {/* Purchase CTA Cluster */}
            <div className="flex flex-col gap-3.5 mb-8">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-[#48151F] rounded-lg bg-[#130B0D]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="px-4 py-3 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-sm font-semibold tabular-nums min-w-[2.5rem] text-center text-[#F5EFE7]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="px-4 py-3 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-6 rounded-lg bg-[#48151F] hover:bg-[#861F32] text-[#C6A15B] hover:text-white border border-[#C6A15B]/40 text-xs sm:text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.product_id)}
                  className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'bg-[#861F32] text-white border-[#C6A15B]'
                      : 'border-[#48151F] hover:border-[#C6A15B] text-[#B7AAA1] bg-[#130B0D]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-4 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-xl"
              >
                Buy Now — Instant Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasting Notes & Food Pairings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 p-8 rounded-2xl bg-[#140b0f] border border-[#2b151f]">
        {/* Sommelier Tasting Notes */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#dfbe76] font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Master Sommelier Tasting Notes</span>
          </div>
          <h3 className="font-serif text-2xl text-white font-normal mb-4">
            Sensory Architecture
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                Aromas & Bouquet
              </span>
              <div className="flex flex-wrap gap-2">
                {product.tasting_notes.aroma.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[#251119] border border-[#3b1a26] text-xs text-neutral-200"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                Palate & Texture
              </span>
              <p className="text-neutral-300 leading-relaxed font-light">
                {product.tasting_notes.palate}
              </p>
            </div>

            <div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                Finish & Longevity
              </span>
              <p className="text-neutral-300 leading-relaxed font-light">
                {product.tasting_notes.finish}
              </p>
            </div>
          </div>
        </div>

        {/* Food Pairings */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#dfbe76] font-semibold mb-3">
            <Utensils className="w-4 h-4" />
            <span>Culinary Harmonization</span>
          </div>
          <h3 className="font-serif text-2xl text-white font-normal mb-4">
            Food Pairing Suggestions
          </h3>
          <p className="text-xs text-neutral-400 mb-4 font-light">
            Crafted to complement rich dining experiences by cleansing the palate and accentuating savoriness.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {product.food_pairings.map((pairing, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#1b0d13] border border-[#2e1520] flex items-center gap-2.5 text-xs font-medium text-neutral-200"
              >
                <div className="w-2 h-2 rounded-full bg-[#dfbe76] shrink-0" />
                <span>{pairing}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews & Community Feedback */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-[#2b161f] pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#dfbe76] font-semibold mb-1">
              Collector Verdicts
            </p>
            <h3 className="font-serif text-3xl text-white font-normal">
              Customer Reviews ({productReviews.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#dfbe76] mt-3 sm:mt-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400">Average across {product.reviews_count} collectors</span>
          </div>
        </div>

        {/* Existing reviews */}
        <div className="space-y-4 mb-10">
          {productReviews.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center italic">
              No reviews written yet. Be the first to add your tasting notes for this vintage.
            </p>
          ) : (
            productReviews.map((rev) => (
              <div
                key={rev.review_id}
                className="p-5 rounded-xl bg-[#150c10] border border-[#27131d]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{rev.user_name}</span>
                    <span className="text-xs text-neutral-500">· {rev.review_date}</span>
                  </div>
                  <div className="flex items-center text-[#dfbe76]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="p-6 rounded-2xl bg-[#170c11] border border-[#341824] max-w-2xl"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#dfbe76] font-semibold mb-3">
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave a Tasting Review</span>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-neutral-400 mb-1.5">Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-[#dfbe76] hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-neutral-700'}`}
                  />
                </button>
              ))}
              <span className="text-xs text-neutral-400 ml-2 font-medium">{newRating} Stars</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-neutral-400 mb-1.5">Your Tasting Impression</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe aromas, palate texture, aging notes, or food pairings..."
              rows={3}
              required
              className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-[#f3efe6] placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={reviewSubmitting || !newComment.trim()}
            className="py-2.5 px-5 rounded-lg bg-[#29121a] hover:bg-[#801729] text-[#dfbe76] hover:text-white border border-[#d4af37]/40 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* “You May Also Like” Section */}
      <div className="border-t border-[#2b161f] pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#dfbe76] font-semibold mb-1">
              Curated Recommendations
            </p>
            <h3 className="font-serif text-3xl text-white font-normal">
              You May Also Like
            </h3>
          </div>
          <button
            onClick={onBack}
            className="text-xs uppercase tracking-wider text-[#dfbe76] hover:underline cursor-pointer"
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
