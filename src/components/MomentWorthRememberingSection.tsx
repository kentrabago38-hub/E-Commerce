import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Sparkles, ArrowRight, Heart, Calendar } from 'lucide-react';

export const MomentWorthRememberingSection: React.FC = () => {
  const { setActiveTab, setIsQuizOpen, setSelectedProduct } = useWineStore();

  const handleBookConcierge = () => {
    setSelectedProduct(null);
    setActiveTab('branches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-[#210D12]">
      {/* Background with Ambient Candlelight Lifestyle Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/lifestyle_dinner_wine_moment_1793460098663.jpg"
          alt="Intimate candlelit European terrace dinner with crystal wine stemware"
          className="w-full h-full object-cover object-center brightness-[0.35] scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep layered Merlot, Bordeaux and Amber lighting scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-[#210D12]/75 to-black/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#351116]/40 to-[#130B0D]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Emotion, Occasion & Gastronomy Narrative */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Occasions & Memories</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F5EFE7] font-normal leading-[1.08] mb-6 text-balance">
              A Moment Worth<br />
              <span className="italic font-light text-[#E5D7B7]">Remembering.</span>
            </h2>

            {/* Narrative copy */}
            <p className="text-base sm:text-lg text-[#B7AAA1] font-light leading-relaxed mb-8 max-w-xl text-balance">
              The greatest wines are never consumed in solitude. They mark milestones, seal lifelong vows, and turn simple dinners into evenings spoken of for decades. Every bottle from our cellar is chosen to be the silent witness to your most cherished memories.
            </p>

            {/* Curated Occasions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-xl">
              <div className="p-4 rounded-lg bg-[#130B0D]/80 border border-[#48151F] backdrop-blur-md">
                <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] font-semibold block mb-1">
                  Intimate Celebrations
                </span>
                <p className="text-xs text-[#B7AAA1] font-light">
                  Champagne and mature Barolo selected for anniversaries and quiet triumphs.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#130B0D]/80 border border-[#48151F] backdrop-blur-md">
                <span className="text-[11px] uppercase tracking-wider text-[#C6A15B] font-semibold block mb-1">
                  Private Dinner Banquets
                </span>
                <p className="text-xs text-[#B7AAA1] font-light">
                  Multi-vintage pairings orchestrated directly with your private chef or catering team.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white font-semibold text-xs uppercase tracking-[0.15em] border border-[#C6A15B]/40 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Pairings For Your Occasion</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>

              <button
                onClick={handleBookConcierge}
                className="w-full sm:w-auto px-6 py-4 rounded-lg bg-[#130B0D]/90 hover:bg-[#351116] text-[#F5EFE7] font-semibold text-xs uppercase tracking-[0.15em] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#C6A15B]" />
                <span>Private Tasting In Davao</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Sommelier Note Card */}
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#210D12]/95 to-[#130B0D]/95 border border-[#48151F] shadow-2xl backdrop-blur-md relative">
              <div className="absolute -top-3 right-8 px-3 py-1 bg-[#861F32] border border-[#C6A15B]/50 rounded text-[10px] uppercase font-bold tracking-widest text-[#F5EFE7]">
                Davao Concierge
              </div>

              <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2">
                Private Cellar Curation
              </span>

              <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-4">
                "We don't sell bottles. We engineer unforgettable evenings."
              </h3>

              <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed mb-6">
                Whether you are hosting an intimate dinner in Lanang, an Azuela Cove terrace soiree, or a mountain retreat in Buda, our certified sommeliers will pre-chill, hand-deliver, and decant your vintages at the precise hour of service.
              </p>

              <div className="pt-6 border-t border-[#48151F] flex items-center justify-between text-xs text-[#B7AAA1]">
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
                  <span className="text-emerald-400 font-medium">On Standby Davao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
