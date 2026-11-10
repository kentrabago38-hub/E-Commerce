import React, { useState, useRef, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Thermometer, Award, Wine, ChevronDown, Eye } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen, setSelectedProduct, products, setQuickViewProduct } = useWineStore();

  const sectionRef = useRef<HTMLElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, spotlightX: 50, spotlightY: 50 });
  const [isHoveringBottle, setIsHoveringBottle] = useState(false);
  const bottleCardRef = useRef<HTMLDivElement>(null);

  // Subtle, slow scroll-based parallax effect with direct DOM updates (60fps/120fps, zero re-renders)
  useEffect(() => {
    // Respect accessibility settings and bypass on mobile devices to prevent touch scroll lag
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (isMobile) return;

    let ticking = false;

    const updateParallax = () => {
      if (!sectionRef.current) {
        ticking = false;
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only compute when the hero section is in or near the viewport
      if (rect.bottom > -50 && rect.top < windowHeight + 50) {
        // Distance scrolled relative to the hero section top
        const scrollDistance = Math.max(0, -rect.top);

        // Deep vineyard background moves gently at ~0.20x scroll rate
        if (parallaxBgRef.current) {
          const bgOffset = scrollDistance * 0.20;
          parallaxBgRef.current.style.transform = `translate3d(0, ${bgOffset.toFixed(1)}px, 0)`;
        }

        // Ambient atmospheric lighting layer moves slightly slower at ~0.09x for layered depth
        if (atmosphereRef.current) {
          const atmoOffset = scrollDistance * 0.09;
          atmosphereRef.current.style.transform = `translate3d(0, ${atmoOffset.toFixed(1)}px, 0)`;
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial position calculation
    updateParallax();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleDiscoverCollection = () => {
    setSelectedProduct(null);
    setActiveTab('collections');
    window.scrollTo({ top: 480, behavior: 'smooth' });
  };

  // 3D Tilt calculation based on mouse position relative to bottle card
  const handleBottleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bottleCardRef.current) return;
    const rect = bottleCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Subtle tilt: max 9 degrees for refined luxury feel
    const rotateY = normX * 8;
    const rotateX = -normY * 8;

    const spotlightX = (x / rect.width) * 100;
    const spotlightY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, spotlightX, spotlightY });
  };

  const handleBottleMouseEnter = () => {
    setIsHoveringBottle(true);
  };

  const handleBottleMouseLeave = () => {
    setIsHoveringBottle(false);
    setTilt({ x: 0, y: 0, spotlightX: 50, spotlightY: 50 });
  };

  // Featured flagship wine
  const heroHighlightWine = products.find((p) => p.featured) || products[0];

  const handleInspectBottle = () => {
    if (heroHighlightWine) {
      setSelectedProduct(heroHighlightWine);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#210D12]"
    >
      {/* Background Image with Subtle Slow Parallax, Dark Wine Scrim, and Atmospheric Lighting */}
      <div
        ref={parallaxBgRef}
        className="absolute -top-[15%] -left-[5%] -right-[5%] h-[130%] z-0 will-change-transform pointer-events-none select-none"
        style={{ transform: 'translate3d(0, 0px, 0)' }}
      >
        <img
          src={getWineImageUrl('/images/hero_editorial_vineyard_1793457418592.jpg')}
          alt="Historic French vineyard at dusk with rolling limestone hills"
          onError={handleImageError}
          className="w-full h-full object-cover object-center brightness-[0.34] scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Scrims: Merlot, Deep Bordeaux, Radial Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-[#210D12]/70 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#351116]/40 to-[#130B0D]/90" />
        {/* Subtle texture / grain feel */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#F5EFE7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Layered Atmospheric Glow (Subtly shifts at a different parallax speed) */}
      <div
        ref={atmosphereRef}
        className="absolute -inset-10 z-0 will-change-transform pointer-events-none select-none opacity-70"
        style={{ transform: 'translate3d(0, 0px, 0)' }}
      >
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#861F32]/25 via-[#C6A15B]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-[#351116]/35 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Dominant Editorial Headline & Call to Action */}
          {/* Left Column: Dominant Editorial Headline & Call to Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* 1. Small Eyebrow (Entrance step 1) */}
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-medium mb-6 animate-fade-in">
              <span className="h-px w-8 bg-[#C6A15B]/60" />
              <span>VÍNEA · Haute Sommelerie · Est. 2026</span>
            </div>

            {/* 2. Dominant Master Headline (Fluid clamp typography with editorial italics) */}
            <h1 className="text-clamp-hero font-serif font-normal text-[#F5EFE7] tracking-tight mb-8 text-balance">
              <span className="block animate-fade-in" style={{ animationDelay: '150ms' }}>
                Every Bottle
              </span>
              <span
                className="block italic font-light text-[#E5D7B7] animate-fade-in"
                style={{ animationDelay: '300ms' }}
              >
                Tells a Story.
              </span>
            </h1>

            {/* 3. Supporting Description */}
            <p
              className="text-base sm:text-lg lg:text-xl text-[#B7AAA1] font-light max-w-xl mb-10 leading-relaxed text-balance animate-fade-in"
              style={{ animationDelay: '450ms' }}
            >
              Discover exceptional vintages, remarkable origins, and unforgettable moments, carefully selected for those who appreciate the art of wine.
            </p>

            {/* 4. Action Buttons with Magnetic Transitions */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 animate-fade-in"
              style={{ animationDelay: '600ms' }}
            >
              {/* Primary CTA: Discover the Collection */}
              <button
                type="button"
                onClick={handleDiscoverCollection}
                className="btn-magnetic gold-shimmer-cta group w-full sm:w-auto px-8 py-4 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#C6A15B]/40 shadow-2xl cursor-pointer flex items-center justify-center gap-3 active:scale-98"
                data-cursor="explore"
              >
                <span>Discover the Collection</span>
                <ArrowRight className="btn-magnetic-arrow w-4 h-4 text-[#C6A15B]" />
              </button>

              {/* Secondary CTA: Find Your Wine */}
              <button
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="btn-magnetic group w-full sm:w-auto px-7 py-4 rounded-xl dark-luxury-glass hover:bg-[#351116]/80 text-[#C6A15B] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-white/10 hover:border-[#C6A15B]/50 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                data-cursor="discover"
              >
                <Sparkles className="w-4 h-4 text-[#C6A15B] group-hover:rotate-12 transition-transform duration-300" />
                <span>Find Your Wine</span>
              </button>
            </div>

            {/* Quiet Provenance & Trust Markers */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-[#B7AAA1] font-light">
              <span className="text-[#C6A15B] font-medium">Direct Châteaux Provenance</span>
              <span>·</span>
              <span>5 Vaults in Davao</span>
              <span>·</span>
              <span>Refrigerated 13°C Fleet</span>
            </div>
          </div>

          {/* Right Column: Unboxed Floating Bottle Showcase (No nested card boxes) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '700ms' }}>
            
            {/* Dynamic Atmospheric Spotlight Glow behind the floating bottle */}
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out"
              style={{
                background: isHoveringBottle
                  ? `radial-gradient(circle at ${tilt.spotlightX}% ${tilt.spotlightY}%, rgba(198,161,91,0.35), rgba(134,31,50,0.25) 50%, transparent 80%)`
                  : 'radial-gradient(circle, rgba(134,31,50,0.3) 0%, rgba(198,161,91,0.15) 50%, transparent 80%)',
                transform: `scale(${isHoveringBottle ? 1.3 : 1})`
              }}
            />

            {/* 3D Tilt Container for Floating Bottle Presentation */}
            <div
              ref={bottleCardRef}
              onMouseMove={handleBottleMouseMove}
              onMouseEnter={handleBottleMouseEnter}
              onMouseLeave={handleBottleMouseLeave}
              onClick={handleInspectBottle}
              style={{
                perspective: '1200px',
                cursor: 'pointer'
              }}
              className="relative max-w-sm sm:max-w-md w-full flex flex-col items-center"
              data-cursor="view"
            >
              {/* Bottle Visual Container - Breaths freely without heavy rectangular card borders */}
              <div
                className="relative w-full aspect-3/4 flex items-center justify-center transition-transform duration-300 ease-out will-change-transform group/bottle"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHoveringBottle ? -10 : 0}px)`
                }}
              >
                {/* Floating Bottle Image with Soft Vignette Blend */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
                  <img
                    src={getWineImageUrl('/images/hero_luxury_wine_bottle_1793460098064.jpg')}
                    alt="2018 Vosne-Romanée Grand Cru bottle resting in private subterranean cellar"
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center group-hover/bottle:scale-105 transition-transform duration-700 ease-out text-transparent"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle editorial lighting scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/20 opacity-80" />
                </div>

                {/* Soft realistic cellar floor shadow */}
                <div
                  className="absolute -bottom-4 inset-x-8 h-8 rounded-full bg-black/80 blur-xl pointer-events-none transition-all duration-300"
                  style={{
                    transform: `scale(${isHoveringBottle ? 0.9 : 1})`,
                    opacity: isHoveringBottle ? 0.6 : 0.9
                  }}
                />

                {/* Floating Glass Label 1: “2018 VOSNE-ROMANÉE” */}
                <div
                  className="absolute top-6 left-6 transition-transform duration-300 pointer-events-none z-10"
                  style={{ transform: `translate3d(${tilt.y * 1.2}px, ${-tilt.x * 1.2}px, 30px)` }}
                >
                  <span className="text-xs font-bold tracking-[0.25em] text-white uppercase bg-[#120A0C]/95 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-[#D5B15C]/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D5B15C] shadow-[0_0_8px_#D5B15C]" />
                    <span>2018 Vosne-Romanée</span>
                  </span>
                </div>

                {/* Floating Glass Label 2: “GRAND CRU” */}
                <div
                  className="absolute top-6 right-6 transition-transform duration-300 pointer-events-none z-10"
                  style={{ transform: `translate3d(${-tilt.y * 1.2}px, ${-tilt.x * 1.2}px, 30px)` }}
                >
                  <span className="text-xs uppercase font-extrabold tracking-widest text-white bg-[#861F32]/95 px-4 py-2 rounded-full border border-[#D5B15C]/60 shadow-2xl">
                    Grand Cru
                  </span>
                </div>

                {/* Hover Inspect Cue */}
                <div className={`absolute inset-x-6 bottom-6 transition-all duration-300 flex items-center justify-center z-10 ${
                  isHoveringBottle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  <div className="w-full py-3 px-4 rounded-xl bg-[#120A0C]/95 text-[#E5D7B7] text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-2xl border border-white/20">
                    <Eye className="w-3.5 h-3.5 text-[#D5B15C]" />
                    <span>Inspect Vintage Details</span>
                  </div>
                </div>
              </div>

              {/* Floating Minimal Glass Metadata Bar Below Bottle */}
              <div
                className="mt-4 w-full p-4 rounded-2xl dark-luxury-glass-elevated flex items-center justify-between gap-4 transition-transform duration-300 border border-white/15"
                style={{ transform: `translate3d(${-tilt.y * 0.4}px, ${tilt.x * 0.4}px, 15px)` }}
              >
                <div>
                  <span className="text-xs text-[#E5D7B7] uppercase tracking-[0.2em] font-bold block mb-0.5">
                    Domaine de la Roche
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium leading-snug">
                    Prestige Grand Cuvée
                  </h3>
                  <p className="text-xs text-white/80 font-normal">
                    Côte de Nuits, France · Pinot Noir
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif text-2xl text-[#E5D7B7] tabular-nums font-bold block">
                    ₱42,500
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                    Vault Allocation
                  </span>
                </div>
              </div>

              {/* Quiet Subterranean Vault Custody Badge */}
              <div
                className="hidden sm:flex absolute -bottom-6 -left-6 px-4 py-2.5 rounded-full dark-luxury-glass-elevated items-center gap-3 transition-transform duration-300 pointer-events-none"
                style={{ transform: `translate3d(${-tilt.y * 0.6}px, ${tilt.x * 0.6}px, 35px)` }}
              >
                <div className="w-7 h-7 rounded-full bg-[#861F32] flex items-center justify-center text-[#C6A15B] border border-[#C6A15B]/40 shrink-0">
                  <Wine className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
                    Cellar Custody
                  </span>
                  <span className="text-[11px] text-[#F5EFE7] font-serif italic">
                    13°C Subterranean Vault
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div
        className="relative z-10 flex flex-col items-center justify-center pb-3 text-[#C6A15B]/70 hover:text-[#C6A15B] transition-colors cursor-pointer"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight * 0.92, behavior: 'smooth' });
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-medium mb-1">
          Scroll to explore cellar
        </span>
        <div className="w-5 h-5 flex items-center justify-center animate-bounce">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Brand Trust Indicators Strip */}
      <div className="relative z-10 w-full border-t border-[#351116]/80 bg-[#130B0D]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#210D12] flex items-center justify-center border border-[#351116] shrink-0 text-[#C6A15B] shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Authentic Provenance</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Direct châteaux allocations</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#210D12] flex items-center justify-center border border-[#351116] shrink-0 text-[#C6A15B] shadow-sm">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Climate-Controlled Delivery</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Cold-chain climate fleet across Davao</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#210D12] flex items-center justify-center border border-[#351116] shrink-0 text-[#C6A15B] shadow-sm">
                <Wine className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Curated Selections</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">Hand-evaluated by sommeliers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#210D12] flex items-center justify-center border border-[#351116] shrink-0 text-[#C6A15B] shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F5EFE7] uppercase tracking-wider">Davao Wine Experience</h4>
                <p className="text-[11px] text-[#B7AAA1] font-light mt-0.5">5 private tasting rooms & vaults</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
