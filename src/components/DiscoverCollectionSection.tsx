import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import { Heart, ShoppingBag, Eye, ArrowRight, Award, Sparkles, Wine } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { LazyWineImage } from './LazyWineImage';

export const DiscoverCollectionSection: React.FC = () => {
  const {
    products,
    addToCart,
    setSelectedProduct,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
    setActiveTab
  } = useWineStore();

  // Pick 5 flagship wines with distinct terroirs for the asymmetric editorial catalog
  const heroRed = products.find((p) => p.product_id === 'prod-001') || products[0];
  const sideChampagne = products.find((p) => p.product_id === 'prod-006') || products[1];
  const sideWhite = products.find((p) => p.product_id === 'prod-003') || products[2];
  const lowerRose = products.find((p) => p.product_id === 'prod-005') || products[3];
  const lowerBrunello = products.find((p) => p.product_id === 'prod-004') || products[4];

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#351116] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Curated Catalog Edition</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Discover the Collection
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs sm:text-sm text-[#B7AAA1] max-w-md font-light leading-relaxed hidden sm:block">
            An editorial curation of benchmark terroirs, old-vine parcels, and limited-release allocations.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-wider text-[#C6A15B] hover:text-[#F5EFE7] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>View All Vintages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Asymmetric Magazine-Style Grid (Non-identical card layout) */}
      <div className="space-y-8">
        
        {/* ROW 1: Large Featured Master Bottle (Left) + 2 Stacked Boutique Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Large Asymmetric Flagship Showcase (7 Columns) */}
          {heroRed && (
            <div
              className="lg:col-span-7 group relative rounded-3xl bg-gradient-to-b from-[#18090C] via-[#130B0D] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-8"
              data-cursor="view"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Large Bottle Visual */}
                <div
                  className="sm:col-span-6 relative aspect-3/4 rounded-2xl overflow-hidden bg-[#210D12] cursor-pointer group"
                  onClick={() => handleSelectProduct(heroRed)}
                >
                  <LazyWineImage
                    src={heroRed.image}
                    alt={heroRed.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-transparent opacity-70" />

                  {/* Top Vintage Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase bg-black/80 px-2.5 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
                      {heroRed.vintage} · {heroRed.wine_type}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(heroRed.product_id);
                    }}
                    className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isInWishlist(heroRed.product_id)
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-black/50 text-[#B7AAA1] hover:text-white border border-white/10'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(heroRed.product_id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Editorial Information */}
                <div className="sm:col-span-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold block mb-1">
                      {heroRed.winery}
                    </span>
                    <h3
                      onClick={() => handleSelectProduct(heroRed)}
                      className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer transition-colors"
                    >
                      {heroRed.name}
                    </h3>
                    <p className="text-xs text-[#B7AAA1] mt-1 font-light">
                      {heroRed.region}, {heroRed.country} · {heroRed.grape_variety}
                    </p>
                  </div>

                  {/* Tasting Notes Box */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-[#351116] space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold block">
                      Tasting Notes
                    </span>
                    <p className="text-xs text-[#E5D7B7]/90 font-light italic leading-relaxed">
                      "{heroRed.tasting_notes?.palate || heroRed.description}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-[#B7AAA1]">
                      {heroRed.tasting_notes?.aroma?.map((a, idx) => (
                        <span key={idx} className="after:content-['·'] last:after:content-none after:ml-1.5">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#351116]">
                    <div>
                      <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">Allocation</span>
                      <span className="font-serif text-2xl text-[#C6A15B] tabular-nums font-normal">
                        {formatPeso(heroRed.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(heroRed, 1)}
                      className="btn-magnetic py-3 px-6 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
                      data-cursor="add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B] btn-magnetic-arrow" />
                      <span>+ Add to Cellar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards 2 & 3: Two Stacked Editorial Cards (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Upper Stacked Card: Champagne */}
            {sideChampagne && (
              <div
                className="group relative rounded-3xl bg-gradient-to-r from-[#18090C] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 overflow-hidden shadow-xl p-5 flex items-center gap-5"
                data-cursor="view"
              >
                <div
                  className="w-28 sm:w-32 aspect-3/4 rounded-xl overflow-hidden bg-[#210D12] shrink-0 cursor-pointer relative"
                  onClick={() => handleSelectProduct(sideChampagne)}
                >
                  <LazyWineImage
                    src={sideChampagne.image}
                    alt={sideChampagne.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-[#C6A15B] uppercase font-semibold">
                    {sideChampagne.vintage}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                  <div>
                    <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider font-semibold block">
                      {sideChampagne.winery} · {sideChampagne.region}
                    </span>
                    <h4
                      onClick={() => handleSelectProduct(sideChampagne)}
                      className="font-serif text-lg text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer line-clamp-1"
                    >
                      {sideChampagne.name}
                    </h4>
                    <p className="text-xs text-[#B7AAA1] font-light line-clamp-2 mt-0.5">
                      {sideChampagne.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#351116]">
                    <span className="font-serif text-xl text-[#C6A15B] tabular-nums font-normal">
                      {formatPeso(sideChampagne.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(sideChampagne, 1)}
                      className="p-2 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white transition-colors cursor-pointer border border-[#C6A15B]/30"
                      title="Add to Cart"
                      data-cursor="add"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lower Stacked Card: Heritage White Chardonnay */}
            {sideWhite && (
              <div
                className="group relative rounded-3xl bg-gradient-to-r from-[#18090C] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 overflow-hidden shadow-xl p-5 flex items-center gap-5"
                data-cursor="view"
              >
                <div
                  className="w-28 sm:w-32 aspect-3/4 rounded-xl overflow-hidden bg-[#210D12] shrink-0 cursor-pointer relative"
                  onClick={() => handleSelectProduct(sideWhite)}
                >
                  <LazyWineImage
                    src={sideWhite.image}
                    alt={sideWhite.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-[#C6A15B] uppercase font-semibold">
                    {sideWhite.vintage}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                  <div>
                    <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider font-semibold block">
                      {sideWhite.winery} · {sideWhite.region}
                    </span>
                    <h4
                      onClick={() => handleSelectProduct(sideWhite)}
                      className="font-serif text-lg text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer line-clamp-1"
                    >
                      {sideWhite.name}
                    </h4>
                    <p className="text-xs text-[#B7AAA1] font-light line-clamp-2 mt-0.5">
                      {sideWhite.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#351116]">
                    <span className="font-serif text-xl text-[#C6A15B] tabular-nums font-normal">
                      {formatPeso(sideWhite.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(sideWhite, 1)}
                      className="p-2 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white transition-colors cursor-pointer border border-[#C6A15B]/30"
                      title="Add to Cart"
                      data-cursor="add"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Complementary Asymmetric Pair (Rosé Vertical Card 5 Col + Wide Brunello Showcase 7 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 4: Rosé Bottle Showcase (5 Columns) */}
          {lowerRose && (
            <div
              className="lg:col-span-5 group relative rounded-3xl bg-gradient-to-b from-[#18090C] via-[#130B0D] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 overflow-hidden shadow-xl p-6 flex flex-col justify-between"
              data-cursor="view"
            >
              <div
                className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#210D12] mb-4 cursor-pointer"
                onClick={() => handleSelectProduct(lowerRose)}
              >
                <LazyWineImage
                  src={lowerRose.image}
                  alt={lowerRose.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] text-[#C6A15B] uppercase font-semibold border border-[#C6A15B]/30">
                  {lowerRose.vintage} · Provençal Rosé
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#C6A15B] uppercase tracking-wider font-semibold block mb-1">
                  {lowerRose.winery} · {lowerRose.region}
                </span>
                <h4
                  onClick={() => handleSelectProduct(lowerRose)}
                  className="font-serif text-xl text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer"
                >
                  {lowerRose.name}
                </h4>
                <p className="text-xs text-[#B7AAA1] font-light line-clamp-2 mt-1">
                  {lowerRose.description}
                </p>

                <div className="pt-4 border-t border-[#351116] flex items-center justify-between mt-4">
                  <span className="font-serif text-2xl text-[#C6A15B] tabular-nums font-normal">
                    {formatPeso(lowerRose.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(lowerRose, 1)}
                    className="gold-shimmer-cta py-2 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-[#C6A15B]/40"
                    data-cursor="add"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 5: Wide Brunello di Montalcino Showcase (7 Columns) */}
          {lowerBrunello && (
            <div
              className="lg:col-span-7 group relative rounded-3xl bg-gradient-to-b from-[#18090C] via-[#130B0D] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/70 transition-all duration-500 overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col justify-between"
              data-cursor="view"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div
                  className="sm:col-span-6 relative aspect-3/4 rounded-2xl overflow-hidden bg-[#210D12] cursor-pointer"
                  onClick={() => handleSelectProduct(lowerBrunello)}
                >
                  <LazyWineImage
                    src={lowerBrunello.image}
                    alt={lowerBrunello.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] text-[#C6A15B] uppercase font-semibold border border-[#C6A15B]/30">
                    {lowerBrunello.vintage} · {lowerBrunello.region}
                  </div>
                </div>

                <div className="sm:col-span-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold block mb-1">
                      {lowerBrunello.winery} · Tuscany, Italy
                    </span>
                    <h3
                      onClick={() => handleSelectProduct(lowerBrunello)}
                      className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer transition-colors"
                    >
                      {lowerBrunello.name}
                    </h3>
                    <p className="text-xs text-[#B7AAA1] font-light mt-1">
                      {lowerBrunello.grape_variety} · Aged 36 Months in Slavonian Oak
                    </p>
                  </div>

                  <p className="text-xs text-[#E5D7B7]/90 font-light italic leading-relaxed bg-black/40 p-3 rounded-xl border border-[#351116]">
                    "{lowerBrunello.tasting_notes?.palate || lowerBrunello.description}"
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#351116]">
                    <div>
                      <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">Allocation</span>
                      <span className="font-serif text-2xl text-[#C6A15B] tabular-nums font-normal">
                        {formatPeso(lowerBrunello.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(lowerBrunello, 1)}
                      className="btn-magnetic py-3 px-6 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
                      data-cursor="add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B] btn-magnetic-arrow" />
                      <span>+ Add to Cellar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
