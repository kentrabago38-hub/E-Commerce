import React, { useRef, useState, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart, Sparkles, Award } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const WineShelfCarousel: React.FC = () => {
  const { products, addToCart, setSelectedProduct, setQuickViewProduct, toggleWishlist, isInWishlist } = useWineStore();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Curate 8 diverse flagship bottles for the shelf
  const shelfWines = products.slice(0, 10);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scrollByAmount = (amount: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Mouse drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cellar Browse</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Curated for You
          </h2>
          <p className="text-xs sm:text-sm text-[#B7AAA1] font-light max-w-xl mt-2 leading-relaxed">
            Hand-selected by our Master Sommelier for current peak drinking windows and rare cellar depth. Drag or scroll to browse the subterranean shelf.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-380)}
            disabled={!canScrollLeft}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              canScrollLeft
                ? 'border-[#C6A15B] text-[#C6A15B] hover:bg-[#861F32] hover:text-white hover:border-[#861F32]'
                : 'border-[#351116] text-[#B7AAA1]/30 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(380)}
            disabled={!canScrollRight}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              canScrollRight
                ? 'border-[#C6A15B] text-[#C6A15B] hover:bg-[#861F32] hover:text-white hover:border-[#861F32]'
                : 'border-[#351116] text-[#B7AAA1]/30 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Physical Wine Shelf Container */}
      <div className="relative">
        <div
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-6 overflow-x-auto pb-12 pt-4 scrollbar-none select-none scroll-smooth ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shelfWines.map((wine) => {
            const isFavorited = isInWishlist(wine.product_id);

            return (
              <div
                key={wine.product_id}
                className="group relative w-72 sm:w-80 shrink-0 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-[#18090C] via-[#130B0D] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2"
                data-cursor="view"
              >
                {/* Bottle Presentation on Shelf */}
                <div
                  className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#210D12] mb-4 cursor-pointer"
                  onClick={() => handleSelectProduct(wine)}
                >
                  <img
                    src={getWineImageUrl(wine.image)}
                    alt={wine.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-transparent opacity-80" />

                  {/* Top Vintage Stamp */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase bg-black/75 px-2.5 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
                      {wine.vintage} · {wine.wine_type}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(wine.product_id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFavorited
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-black/50 text-[#B7AAA1] hover:text-white border border-white/10'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick Inspect Overlay */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(wine);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#210D12]/95 hover:bg-[#351116] text-[#C6A15B] text-xs font-semibold uppercase tracking-wider border border-[#C6A15B]/40 backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Wine Information */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#C6A15B] uppercase tracking-wider block font-medium">
                      {wine.winery} · {wine.region}
                    </span>
                    <h3
                      onClick={() => handleSelectProduct(wine)}
                      className="font-serif text-xl text-[#F5EFE7] font-normal leading-snug group-hover:text-[#C6A15B] transition-colors cursor-pointer line-clamp-1"
                    >
                      {wine.name}
                    </h3>
                    <p className="text-xs text-[#B7AAA1] font-light line-clamp-2 mt-1">
                      {wine.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="pt-4 border-t border-[#351116] flex items-center justify-between gap-3 mt-3">
                    <div>
                      <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">Allocation</span>
                      <span className="font-serif text-xl text-[#C6A15B] tabular-nums font-normal">
                        {formatPeso(wine.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(wine, 1);
                      }}
                      className="gold-shimmer-cta py-2 px-3.5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-[#C6A15B]/40 shadow-md"
                      data-cursor="add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Oak & Brass Wine Shelf Illusion Ledge */}
        <div className="absolute bottom-6 left-0 right-0 h-3 bg-gradient-to-r from-[#210D12] via-[#48151F] to-[#210D12] border-t border-[#C6A15B]/40 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.8)] pointer-events-none" />
      </div>
    </section>
  );
};
