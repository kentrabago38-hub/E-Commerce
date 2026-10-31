import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Thermometer, Award, Wine, Compass } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen, setSelectedProduct } = useWineStore();

  const handleExploreWines = () => {
    setSelectedProduct(null);
    setActiveTab('shop');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleDiscoverCollections = () => {
    setSelectedProduct(null);
    setActiveTab('collections');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#210D12]">
      {/* Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_editorial_vineyard_1793457418592.jpg"
          alt="French historic wine estate and prestige vineyard at golden hour"
          className="w-full h-full object-cover object-center brightness-[0.42] scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep layered Merlot, Bordeaux and Charcoal lighting scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-[#210D12]/75 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#351116]/30 to-[#130B0D]/85" />
      </div>

      {/* Main Hero Editorial Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Eyebrow: Zero-Pill refined typography */}
          <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-medium mb-6">
            <span className="h-px w-8 bg-[#C6A15B]/50"></span>
            <span>VÍNEA · Haute Sommelerie · Est. 2026</span>
            <span className="h-px w-8 bg-[#C6A15B]/50"></span>
          </div>

          {/* Master Headline from Brief */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#F5EFE7] tracking-tight leading-[1.05] mb-6 max-w-4xl text-balance">
            An Art of Wine.<br />
            <span className="italic font-light text-[#E5D7B7]">A World of Discovery.</span>
          </h1>

          {/* Supporting description from Brief */}
          <p className="text-base sm:text-lg md:text-xl text-[#B7AAA1] font-light max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Explore exceptional vintages, distinctive terroirs, and carefully curated selections. Discover wines that transform every occasion into a memorable experience.
          </p>

          {/* 3 Strategically Positioned Call-To-Action Buttons from Brief */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* CTA 1: Explore Our Wines (Primary Wine Red) */}
            <button
              onClick={handleExploreWines}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white font-semibold text-xs md:text-sm tracking-[0.15em] uppercase border border-[#C6A15B]/40 shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
            >
              <span>Explore Our Wines</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>

            {/* CTA 2: Discover Collections (Understated Outlined Burgundy) */}
            <button
              onClick={handleDiscoverCollections}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#130B0D]/80 hover:bg-[#351116] text-[#F5EFE7] font-semibold text-xs md:text-sm tracking-[0.15em] uppercase border border-[#48151F] hover:border-[#C6A15B]/50 backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              Discover Collections
            </button>

            {/* CTA 3: Find Your Wine (Champagne Gold Accented Sommelier Finder) */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-lg bg-[#351116]/80 hover:bg-[#48151F] text-[#C6A15B] text-xs md:text-sm tracking-wider uppercase border border-[#C6A15B]/40 hover:border-[#C6A15B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              <span>Find Your Wine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Trust Indicators Strip (Prompt Section 2.D) */}
      <div className="relative z-10 w-full border-t border-[#48151F]/70 bg-[#130B0D]/90 backdrop-blur-md">
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
