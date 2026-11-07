import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { Award, ArrowRight, ShieldCheck, Lock, Eye, ShoppingBag } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const CollectorsRoomSection: React.FC = () => {
  const { products, setSelectedProduct, setQuickViewProduct, addToCart, setActiveTab } = useWineStore();

  // Pick high-end / collector wines (price > 10,000 or rare tag)
  const collectorWines = products
    .filter((p) => p.price >= 12000 || p.featured)
    .slice(0, 3);

  const handleOpenWine = (p: typeof products[0]) => {
    setSelectedProduct(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#0D0709] border-y border-[#351116]">
      {/* Background vault texture & spotlight lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={getWineImageUrl('/images/collectors_room_vault_1793460098223.jpg')}
          alt="The VÍNEA Private Collector Vault with rare aged vintage library"
          onError={handleImageError}
          className="w-full h-full object-cover object-center brightness-[0.22] scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0709] via-[#0D0709]/85 to-[#0D0709]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#210D12]/40 to-[#0D0709]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#351116]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Private Cellar Reserve · Strict Allocation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
              The Collector's Room
            </h2>
            <p className="text-sm sm:text-base text-[#B7AAA1] font-light mt-3 leading-relaxed">
              Rare vintages, museum library reserves, and numbered wooden cases reserved exclusively for patrons and private connoisseurs. Verified authentic provenance with unbroken cold-chain storage.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="gold-shimmer-cta px-6 py-3 rounded-lg bg-[#351116] hover:bg-[#48151F] text-[#C6A15B] text-xs uppercase tracking-[0.15em] font-semibold border border-[#C6A15B]/40 hover:border-[#C6A15B] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>View All Rare Allocations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Style C — Exclusive Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectorWines.map((wine, idx) => (
            <div
              key={wine.product_id}
              className="group relative rounded-xl bg-gradient-to-b from-[#1E0B10] to-[#12070A] border border-[#48151F] hover:border-[#C6A15B] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Media Container with dramatic lighting */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-[#18090C] cursor-pointer"
                onClick={() => handleOpenWine(wine)}
              >
                <img
                  src={getWineImageUrl(wine.image)}
                  alt={wine.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12070A] via-transparent to-black/40" />

                {/* Collector Allocation Number & Vintage Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase bg-black/60 px-2.5 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
                    Vault Allocation #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5EFE7]/80 bg-[#48151F]/80 px-2.5 py-1 rounded border border-white/10">
                    {wine.vintage}
                  </span>
                </div>

                {/* Quick View Hover overlay */}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(wine);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0D0709]/95 text-[#C6A15B] text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/50 flex items-center justify-center gap-2 hover:bg-[#351116] transition-all cursor-pointer shadow-xl"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect Allocation</span>
                  </button>
                </div>
              </div>

              {/* Collector Details Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-[#B7AAA1] uppercase tracking-[0.2em] mb-1.5 flex items-center justify-between">
                    <span>{wine.region}, {wine.country}</span>
                    <span className="text-[#C6A15B] font-medium">{wine.wine_type} · 750ml</span>
                  </div>

                  <h3
                    onClick={() => handleOpenWine(wine)}
                    className="font-serif text-xl sm:text-2xl text-[#F5EFE7] font-normal leading-snug line-clamp-1 group-hover:text-[#C6A15B] transition-colors cursor-pointer mb-2"
                  >
                    {wine.name}
                  </h3>

                  <p className="text-xs text-[#B7AAA1] font-serif italic mb-4 line-clamp-2">
                    {wine.tasting_notes?.palate || wine.description || 'Extraordinary depth of black fruit, cedar wood, crushed violets, and refined minerality with decades of cellar potential.'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#B7AAA1] mb-6">
                    <span className="text-[#F5EFE7] font-medium">{wine.grape_variety}</span>
                    <span className="text-[#48151F]">/</span>
                    <span>14.5% Vol</span>
                    <span className="text-[#48151F]">/</span>
                    <span className="text-emerald-400 font-medium">Original Wooden Cask</span>
                  </div>
                </div>

                {/* Price and Acquisition Button */}
                <div className="pt-4 border-t border-[#351116] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">
                      Allocated Valuation
                    </span>
                    <span className="font-serif text-2xl font-normal text-[#C6A15B] tabular-nums block">
                      {formatPeso(wine.price)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(wine, 1);
                    }}
                    className="gold-shimmer-cta py-2.5 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 hover:border-[#C6A15B] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sommelier Guarantee Footer Banner */}
        <div className="mt-12 p-6 rounded-xl bg-[#1E0B10]/80 border border-[#48151F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B7AAA1]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C6A15B] shrink-0" />
            <span>
              All Collector's Room bottles undergo ultrasonic ullage testing and laser inspection before release to client cellars.
            </span>
          </div>
          <span className="text-[#C6A15B] uppercase tracking-widest font-semibold shrink-0">
            Davao Central Vault Inspected
          </span>
        </div>
      </div>
    </section>
  );
};
