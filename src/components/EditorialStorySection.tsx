import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Wine, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import cellarPhoto from '../assets/images/hero_wine_cellar_1791213186963.jpg';

export const EditorialStorySection: React.FC = () => {
  const { setActiveTab } = useWineStore();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-[#130B0D] border border-[#48151F] shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#861F32]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-14 lg:p-20 relative z-10">
          {/* Left Column: Visual Vignette / Cellar Art */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#48151F] aspect-4/5 shadow-2xl">
              <img
                src={cellarPhoto}
                alt="Subterranean vintage wine cellar"
                className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/20" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 inset-x-6 p-4 rounded-xl bg-[#130B0D]/85 backdrop-blur-md border border-[#C6A15B]/35 text-[#F5EFE7]">
                <p className="font-serif italic text-sm text-[#C6A15B] mb-1">
                  “Wine is bottled poetry, preserved in silence.”
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[#B7AAA1]">
                  VÍNEA Head Sommelier · Davao Cellars
                </p>
              </div>
            </div>

            {/* Overlapping small accent card */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 p-4 rounded-xl bg-[#210D12] border border-[#C6A15B]/40 shadow-xl items-center gap-3 max-w-[210px]">
              <div className="w-10 h-10 rounded-full bg-[#130B0D] border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F5EFE7]">13°C Subterranean</p>
                <p className="text-[10px] text-[#B7AAA1]">Protected from tropical heat</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-[#C6A15B] text-xs uppercase tracking-[0.25em] font-semibold">
              <Wine className="w-3.5 h-3.5" />
              <span>Editorial Manifesto</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal leading-[1.15] tracking-tight">
              Crafted by Earth. Perfected by Time. Curated with Discipline.
            </h2>

            <p className="text-base sm:text-lg text-[#B7AAA1] font-light leading-relaxed">
              At VÍNEA, we believe true luxury in wine is not about ostentation, but about provenance, stewardship, and emotional resonance. Every vintage in our collection is sourced directly from estates that honor organic viticulture, hand harvests, and multi-generational dedication.
            </p>

            <p className="text-sm text-[#B7AAA1]/80 font-light leading-relaxed">
              Preserving exceptional bottles in the tropics requires obsessive care. Across our five climate-controlled cellars in Davao City, every allocation rests in vibration-free, darkness-shielded vaults calibrated to an unyielding 13°C and 70% relative humidity. When you open a bottle from VÍNEA, you experience the exact taste the winemaker bottled years ago in Burgundy, Tuscany, or Rioja.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#48151F]">
              <div>
                <span className="font-serif text-3xl text-[#C6A15B] font-normal block">5</span>
                <span className="text-xs text-[#B7AAA1] uppercase tracking-wider">Davao Cellars</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#C6A15B] font-normal block">100%</span>
                <span className="text-xs text-[#B7AAA1] uppercase tracking-wider">Estate Provenance</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#C6A15B] font-normal block">13°C</span>
                <span className="text-xs text-[#B7AAA1] uppercase tracking-wider">Cold-Chain Transit</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setActiveTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-7 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-[0.15em] font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('guide');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-lg bg-[#210D12] hover:bg-[#48151F] text-[#C6A15B] hover:text-[#F5EFE7] text-xs uppercase tracking-[0.15em] font-semibold border border-[#48151F] hover:border-[#C6A15B]/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Sommelier Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
