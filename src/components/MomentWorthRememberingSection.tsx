import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, Calendar, Wine } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export const MomentWorthRememberingSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen, setSelectedProduct } = useWineStore();

  const handleBookConcierge = () => {
    setSelectedProduct(null);
    setActiveTab('branches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-[#120A0C]">
      {/* Background with Ambient Candlelight Lifestyle Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src={getWineImageUrl('/images/lifestyle_dinner_wine_moment_1793460098663.jpg')}
          alt="Intimate candlelit European terrace dinner with crystal wine stemware"
          onError={handleImageError}
          className="w-full h-full object-cover object-center brightness-[0.25] scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep layered Merlot, Bordeaux and Amber lighting scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120A0C] via-[#210D12]/80 to-[#120A0C]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#210D12]/40 to-[#120A0C]/95" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Emotion, Occasion & Gastronomy Narrative */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Ritual & The Memory</span>
            </div>

            {/* Dominant Editorial Headline */}
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#F5EFE7] font-normal leading-[1.05] tracking-tight text-balance">
              A bottle is opened.<br />
              <span className="italic font-light text-[#E5D7B7]">A moment begins.</span>
            </h2>

            {/* Narrative copy */}
            <p className="text-base sm:text-lg text-[#B7AAA1] font-light leading-relaxed max-w-xl text-balance">
              The greatest wines are never consumed in solitude. They mark milestones, seal lifelong vows, and turn simple dinners into evenings spoken of for decades. Every bottle from our cellar is chosen to be the silent witness to your most cherished memories.
            </p>

            {/* Curated Occasions Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
              <div className="p-5 rounded-2xl dark-luxury-glass">
                <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] font-semibold block mb-1">
                  Intimate Celebrations
                </span>
                <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                  Vintage Champagne and mature Barolo selected for anniversaries and quiet triumphs.
                </p>
              </div>

              <div className="p-5 rounded-2xl dark-luxury-glass">
                <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] font-semibold block mb-1">
                  Private Dinner Banquets
                </span>
                <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                  Multi-vintage pairings orchestrated directly with your private chef or catering team.
                </p>
              </div>
            </div>

            {/* Magnetic Modern CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="btn-magnetic w-full sm:w-auto px-8 py-4 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white font-semibold text-xs uppercase tracking-[0.18em] shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
                data-cursor="explore"
              >
                <span>Find Pairings For Your Occasion</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B] btn-magnetic-arrow" />
              </button>

              <button
                onClick={handleBookConcierge}
                className="btn-magnetic w-full sm:w-auto px-6 py-4 rounded-xl dark-luxury-glass hover:bg-white/10 text-[#F5EFE7] font-semibold text-xs uppercase tracking-[0.18em] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-4 h-4 text-[#C6A15B]" />
                <span>Private Cellar Tasting</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Dark Luxury Glass Sommelier Note */}
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-3xl dark-luxury-glass-elevated relative space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">
                  Private Sommelier Desk
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#E5D7B7]">
                  Davao Concierge
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal leading-snug">
                "We don't sell bottles. We engineer unforgettable evenings."
              </h3>

              <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed">
                Whether you are hosting an intimate dinner in Lanang, an Azuela Cove terrace soiree, or a mountain retreat in Buda, our certified sommeliers will pre-chill, hand-deliver, and decant your vintages at the precise hour of service.
              </p>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#B7AAA1]">
                <div>
                  <span className="text-[#F5EFE7] font-serif italic block text-sm">
                    Concierge Direct Line
                  </span>
                  <span className="text-[#C6A15B] font-mono tracking-wider">
                    +63 (82) 285-8463
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] text-[#B7AAA1]/80">Climate Vans</span>
                  <span className="text-[#C6A15B] font-medium">On Standby Davao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
