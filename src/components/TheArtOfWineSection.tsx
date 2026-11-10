import React, { useEffect, useRef } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { ArrowRight, Sparkles, Compass, Wine, Award } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const TheArtOfWineSection: React.FC = () => {
  const { setActiveTab, setSelectedProduct } = useWineStore();
  const parallaxImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Completely disable scroll listeners on mobile/touch to eliminate scroll lag
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (isMobile) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (parallaxImageRef.current) {
            const offset = (window.scrollY * 0.035).toFixed(1);
            parallaxImageRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExplore = () => {
    setSelectedProduct(null);
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#130B0D] border-t border-[#351116]/80">
      {/* Background radial warmth */}
      <div className="absolute inset-0 bg-radial from-[#351116]/35 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Storytelling Photography with Parallax Depth */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-3 sm:-inset-4 border border-[#C6A15B]/20 rounded-3xl pointer-events-none -translate-x-2 -translate-y-2 hidden sm:block" />

            <div
              ref={parallaxImageRef}
              className="relative rounded-2xl overflow-hidden shadow-2xl group border border-[#351116]"
            >
              <img
                src={getWineImageUrl('/images/wine_pouring_crystal_glass_1793460097087.jpg')}
                alt="Decanting aged Grand Cru into hand-blown crystal stemware under candlelight"
                onError={handleImageError}
                className="w-full h-[460px] sm:h-[540px] object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/30" />

              {/* Floating Tasting Annotation */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#210D12]/90 backdrop-blur-md border border-[#351116] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
                    The Art of Aeration · Le Rituel
                  </span>
                  <p className="text-xs text-[#F5EFE7] font-serif italic mt-0.5">
                    "Decanting allows centuries of dormant character to awaken against crystal."
                  </p>
                </div>
                <div className="hidden sm:flex items-center text-xs text-[#B7AAA1] shrink-0 font-light">
                  <span>16°C Optimal Decant</span>
                </div>
              </div>
            </div>

            {/* Overlapping Luxury Seal Stamp */}
            <div className="hidden md:flex absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#351116] border border-[#C6A15B]/50 items-center justify-center p-3 text-center shadow-2xl rotate-12">
              <span className="text-[9px] uppercase tracking-widest text-[#C6A15B] font-serif leading-tight">
                HAUTE<br />CULTURE<br />VÍNEA
              </span>
            </div>
          </div>

          {/* Right Column: Master Editorial Headline & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Storytelling & Philosophy</span>
            </div>

            {/* Specific Requested Master Statement */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F5EFE7] font-normal leading-[1.05] mb-6 text-balance">
              “Wine is not simply poured.<br />
              <span className="italic font-light text-[#E5D7B7]">It is remembered.”</span>
            </h2>

            {/* Editorial Story Text */}
            <div className="space-y-4 text-sm sm:text-base text-[#B7AAA1] font-light leading-relaxed mb-8">
              <p>
                Wine is liquid geography and preserved history. In every bottle of an allocated vintage lies the rainfall of an unrepeatable summer, the ancient limestone of subterranean cliffs, and generations of cellar masters who understood that monumental greatness cannot be rushed.
              </p>
              <p>
                At VÍNEA, we curate bottles not solely for their acclaim, but for their power to transport. From hand-harvested steep terraces in Burgundy and ancient-vine Rioja plots to our temperature-regulated vaults in Davao, each allocation is guarded in uncompromised cold-chain custody until it touches your glass.
              </p>
            </div>

            {/* Sommelier Signature */}
            <div className="pt-6 border-t border-[#351116] flex items-center justify-between gap-6">
              <div>
                <p className="font-serif text-base text-[#F5EFE7] italic">
                  Antoine de Saint-Germain
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#C6A15B]">
                  Head Sommelier & Cellar Custodian
                </p>
              </div>

              <button
                type="button"
                onClick={handleExplore}
                className="gold-shimmer-cta px-5 py-3 rounded-xl bg-[#210D12] hover:bg-[#351116] border border-[#C6A15B]/40 hover:border-[#C6A15B] inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C6A15B] hover:text-[#F5EFE7] font-semibold transition-all cursor-pointer shadow-lg"
              >
                <span>Read The Wine Guide</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
