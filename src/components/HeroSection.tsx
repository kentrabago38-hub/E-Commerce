import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Thermometer, Award, Wine, ChevronDown, Eye } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen, setSelectedProduct, products, setQuickViewProduct } = useWineStore();

  const handleDiscoverCollection = () => {
    setSelectedProduct(null);
    setActiveTab('collections');
    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  const handleExploreWines = () => {
    setSelectedProduct(null);
    setActiveTab('shop');
    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  // Find a flagship wine for the hero highlight
  const heroHighlightWine = products.find((p) => p.featured) || products[0];

  return (
    <section className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#210D12]">
      {/* Background Image with Cinematic Scrims */}
      <div className="absolute inset-0 z-0">
        <img
          src={getWineImageUrl('/images/hero_editorial_vineyard_1793457418592.jpg')}
          alt="Historic French Burgundy vineyard at golden hour dusk"
          onError={handleImageError}
          className="w-full h-full object-cover object-center brightness-[0.38] scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep layered Merlot, Bordeaux and Charcoal lighting scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-[#210D12]/75 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#351116]/30 to-[#130B0D]/85" />
      </div>

      {/* Main Asymmetrical Hero Editorial Layout */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Asymmetrical Typography & Editorial CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small vertical brand / editorial tag + eyebrow */}
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-medium mb-6">
              <span className="h-px w-8 bg-[#C6A15B]/50" />
              <span>VÍNEA · Haute Sommelerie · Est. 2026</span>
            </div>

            {/* Master Headline: Every Bottle Tells a Story */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-[#F5EFE7] tracking-tight leading-[1.02] mb-6 text-balance">
              Every Bottle<br />
              <span className="italic font-light text-[#E5D7B7]">Tells a Story.</span>
            </h1>

            {/* Supporting description */}
            <p className="text-base sm:text-lg lg:text-xl text-[#B7AAA1] font-light max-w-xl mb-10 leading-relaxed text-balance">
              Discover exceptional vintages, remarkable origins, and unforgettable moments, carefully selected for those who appreciate the art of wine.
            </p>

            {/* Compact CTA Arrangement */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
              {/* CTA 1: Discover the Collection */}
              <button
                onClick={handleDiscoverCollection}
                className="gold-shimmer-cta w-full sm:w-auto px-8 py-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white font-semibold text-xs uppercase tracking-[0.15em] border border-[#C6A15B]/40 shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
              >
                <span>Discover the Collection</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>

              {/* CTA 2: Find Your Wine (Champagne Gold Sommelier Quiz) */}
              <button
                onClick={() => setIsQuizOpen(true)}
                className="gold-shimmer-cta w-full sm:w-auto px-6 py-4 rounded-lg bg-[#130B0D]/90 hover:bg-[#351116] text-[#C6A15B] text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 hover:border-[#C6A15B] backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>Find Your Wine</span>
              </button>
            </div>

            {/* Terroir & Origin Micro-Annotation */}
            <div className="flex items-center gap-3 text-xs text-[#B7AAA1] font-light">
              <span className="text-[#C6A15B]">Direct Châteaux Provenance</span>
              <span>·</span>
              <span>5 Vaults Across Davao</span>
              <span>·</span>
              <span>Climate-Controlled Vans</span>
            </div>
          </div>

          {/* Right Column: Main Prestige Wine Bottle Campaign Presentation */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Ambient gold glow backdrop */}
            <div className="absolute w-72 h-72 rounded-full bg-[#861F32]/25 blur-3xl pointer-events-none -top-10 -right-10" />

            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Bottle Showcase Card with High-End Lighting */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#210D12] via-[#130B0D] to-[#130B0D] border border-[#48151F] shadow-2xl p-4 sm:p-5">
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#18090C]">
                  <img
                    src={getWineImageUrl('/images/hero_luxury_wine_bottle_1793460098064.jpg')}
                    alt="Prestige Grand Cru reserve wine bottle with wax seal on aged French barrel"
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/30" />

                  {/* Top Vintage Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase bg-black/60 px-2.5 py-1 rounded backdrop-blur-md border border-[#C6A15B]/30">
                      Vosne-Romanée · 2018
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-[#861F32]/90 px-2.5 py-1 rounded border border-[#C6A15B]/40">
                      Grand Cru
                    </span>
                  </div>
                </div>

                {/* Floating Info Details Below Bottle */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg text-[#F5EFE7] font-normal leading-snug">
                      Domaine de la Roche
                    </h3>
                    <p className="text-xs text-[#B7AAA1] font-light">
                      Prestige Cuvée · Côte de Nuits, France
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-xl text-[#C6A15B] tabular-nums font-normal block">
                      ₱42,500
                    </span>
                    <button
                      onClick={() => {
                        if (heroHighlightWine) {
                          setQuickViewProduct(heroHighlightWine);
                        }
                      }}
                      className="text-[10px] uppercase tracking-wider text-[#C6A15B] hover:text-[#F5EFE7] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Sommelier Stamp */}
              <div className="hidden sm:flex absolute -bottom-4 -left-6 px-4 py-2.5 rounded-xl bg-[#130B0D]/95 border border-[#48151F] shadow-xl backdrop-blur-md items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#861F32] flex items-center justify-center text-[#C6A15B] border border-[#C6A15B]/40">
                  <Wine className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
                    Cellar Custody
                  </span>
                  <span className="text-xs text-[#F5EFE7] font-serif italic">
                    14°C Climate Preserved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Animated Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pb-3 text-[#C6A15B]/70 hover:text-[#C6A15B] transition-colors cursor-pointer"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-medium mb-1">
          Scroll to explore
        </span>
        <div className="w-5 h-5 flex items-center justify-center animate-bounce">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Brand Trust Indicators Strip */}
      <div className="relative z-10 w-full border-t border-[#48151F]/70 bg-[#130B0D]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#210D12] flex items-center justify-center border border-[#48151F] shrink-0 text-[#C6A15B] shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Authentic Provenance</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Direct châteaux allocations</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#210D12] flex items-center justify-center border border-[#48151F] shrink-0 text-[#C6A15B] shadow-sm">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Temperature-Controlled Delivery</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Cold-chain climate vans across Davao</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#210D12] flex items-center justify-center border border-[#48151F] shrink-0 text-[#C6A15B] shadow-sm">
                <Wine className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Curated Selections</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Tasted & verified by sommeliers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#210D12] flex items-center justify-center border border-[#48151F] shrink-0 text-[#C6A15B] shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Quality Guarantee</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Pristine cork, fill & provenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
