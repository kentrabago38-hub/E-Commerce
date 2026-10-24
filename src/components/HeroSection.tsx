import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Thermometer, Award, Wine } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen } = useWineStore();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#210D12]">
      {/* Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_wine_cellar_1791213186963.jpg"
          alt="Atmospheric wine cellar with vintage bottles and crystal glass"
          className="w-full h-full object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Layered gradients for deep Midnight Bordeaux and Merlot immersion */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-[#210D12]/80 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#48151F]/40 to-[#130B0D]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
        {/* Eyebrow label: Clean unboxed editorial typography (Zero-Pill Discipline) */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-medium mb-6">
          <span className="h-px w-6 bg-[#C6A15B]/40"></span>
          <span>Discover · Taste · Remember</span>
          <span className="h-px w-6 bg-[#C6A15B]/40"></span>
        </div>

        {/* Main Headline: Large, refined editorial serif */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#F5EFE7] tracking-tight leading-[1.1] mb-6 max-w-4xl text-balance">
          Discover Exceptional Wines.
        </h1>

        {/* Supporting description */}
        <p className="text-base sm:text-lg md:text-xl text-[#B7AAA1] font-light max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          A curated destination for collectors and enthusiasts. Exceptional vintages, single-vineyard terroirs, and prestige allocations preserved in optimal 13°C cellar condition.
        </p>

        {/* CTA Buttons: Consistent heights, deliberate spacing, refined borders */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          {/* Primary CTA: Solid Wine Red button */}
          <button
            onClick={() => setActiveTab('shop')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] font-medium text-xs md:text-sm tracking-[0.15em] uppercase border border-[#C6A15B]/40 shadow-xl transition-all duration-200 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
          >
            <span>SHOP WINES</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>

          {/* Secondary CTA: Dark Merlot understated outlined button */}
          <button
            onClick={() => setActiveTab('collections')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#130B0D]/80 hover:bg-[#48151F]/60 text-[#F5EFE7] font-medium text-xs md:text-sm tracking-[0.15em] uppercase border border-[#48151F] backdrop-blur-md transition-all duration-200 cursor-pointer"
          >
            EXPLORE COLLECTIONS
          </button>

          {/* Tertiary CTA: Subtle Champagne Gold-accented discovery button */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="w-full sm:w-auto px-6 py-4 rounded-lg bg-[#48151F]/80 hover:bg-[#48151F] text-[#C6A15B] text-xs md:text-sm tracking-wider uppercase border border-[#C6A15B]/35 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#C6A15B]" />
            <span>Find Your Wine</span>
          </button>
        </div>

        {/* Trust and Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pt-8 border-t border-[#48151F]/80 w-full max-w-4xl text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#130B0D] flex items-center justify-center border border-[#48151F] shrink-0 shadow-sm">
              <Award className="w-4 h-4 text-[#C6A15B]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5EFE7]">Authentic Provenance</p>
              <p className="text-[11px] text-[#B7AAA1]">Direct winery allocation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#130B0D] flex items-center justify-center border border-[#48151F] shrink-0 shadow-sm">
              <Thermometer className="w-4 h-4 text-[#C6A15B]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5EFE7]">Temperature Controlled</p>
              <p className="text-[11px] text-[#B7AAA1]">14°C cold-chain transit</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#130B0D] flex items-center justify-center border border-[#48151F] shrink-0 shadow-sm">
              <Wine className="w-4 h-4 text-[#C6A15B]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5EFE7]">Curated Selections</p>
              <p className="text-[11px] text-[#B7AAA1]">Sommelier verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#130B0D] flex items-center justify-center border border-[#48151F] shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5EFE7]">Quality Guarantee</p>
              <p className="text-[11px] text-[#B7AAA1]">Pristine cork & fill promise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
