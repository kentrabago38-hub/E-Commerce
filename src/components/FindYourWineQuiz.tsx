import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  X,
  Sparkles,
  Check,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  Eye,
  Utensils,
  Award,
  Plus
} from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { InteractiveTastingProfile } from './InteractiveTastingProfile';

interface MoodOption {
  id: string;
  label: string;
  desc: string;
  typeMatch: string[];
  bodyMatch?: string[];
  sweetnessMatch?: string[];
}

const MOODS: MoodOption[] = [
  {
    id: 'rich-bold',
    label: 'Rich & Bold',
    desc: 'Deep dark fruit, French oak vanilla, structured tannins, and a velvety lingering finish.',
    typeMatch: ['Red'],
    bodyMatch: ['Full']
  },
  {
    id: 'light-elegant',
    label: 'Light & Elegant',
    desc: 'Ethereal red cherries, violet florality, silk-smooth tannins, and Burgundian finesse.',
    typeMatch: ['Red', 'Rosé'],
    bodyMatch: ['Light', 'Medium']
  },
  {
    id: 'fresh-crisp',
    label: 'Fresh & Crisp',
    desc: 'High-tension citrus, mouthwatering chalk minerality, green apple, and bright salinity.',
    typeMatch: ['White', 'Rosé'],
    sweetnessMatch: ['Bone Dry', 'Dry']
  },
  {
    id: 'sweet-aromatic',
    label: 'Sweet & Aromatic',
    desc: 'Lush apricot, jasmine blossom, candied orange peel, and balanced natural sweetness.',
    typeMatch: ['White', 'Dessert'],
    sweetnessMatch: ['Semi-Dry', 'Sweet']
  },
  {
    id: 'sparkling',
    label: 'Sparkling',
    desc: 'Fine persistent effervescence, toasted brioche, lemon curd, and joyful celebration.',
    typeMatch: ['Sparkling']
  }
];

interface PairingOption {
  id: string;
  label: string;
  desc: string;
  preferredTypes: string[];
}

const PAIRINGS: PairingOption[] = [
  {
    id: 'steak',
    label: 'Steak & Fine Beef',
    desc: 'Prime ribeye, wagyu, roasted lamb chops, or rich reductions',
    preferredTypes: ['Red']
  },
  {
    id: 'seafood',
    label: 'Fresh Seafood',
    desc: 'Pan-seared scallops, oysters, butter-poached lobster, or seabass',
    preferredTypes: ['White', 'Sparkling']
  },
  {
    id: 'pasta',
    label: 'Artisan Pasta & Risotto',
    desc: 'Truffle tagliatelle, slow-braised ragù, or wild mushroom risotto',
    preferredTypes: ['Red', 'White']
  },
  {
    id: 'cheese',
    label: 'Aged Cheeses & Charcuterie',
    desc: 'Aged Comté, artisanal charcuterie, truffled pecorino, or Brie',
    preferredTypes: ['Red', 'White', 'Sparkling']
  },
  {
    id: 'dessert',
    label: 'Patisserie & Dessert',
    desc: 'Dark chocolate ganache, tarte tatin, or fresh fruit tarts',
    preferredTypes: ['Dessert', 'White']
  },
  {
    id: 'celebration',
    label: 'Intimate Celebration',
    desc: 'Milestone toasts, intimate anniversaries, or elevated gatherings',
    preferredTypes: ['Sparkling', 'Red']
  }
];

interface PriceTier {
  id: string;
  label: string;
  rangeDesc: string;
  min: number;
  max: number;
}

const PRICE_TIERS: PriceTier[] = [
  {
    id: 'accessible',
    label: 'Under ₱3,500',
    rangeDesc: 'Artisanal daily cellaring & boutique vineyard discoveries',
    min: 0,
    max: 3500
  },
  {
    id: 'reserve',
    label: '₱3,500 – ₱8,000',
    rangeDesc: 'Sommelier Reserve single-vineyard estate bottlings',
    min: 3500,
    max: 8000
  },
  {
    id: 'grand-cru',
    label: '₱8,000 – ₱25,000',
    rangeDesc: 'Grand Cru Classé & iconic benchmark estates',
    min: 8000,
    max: 25000
  },
  {
    id: 'prestige-vault',
    label: '₱25,000+',
    rangeDesc: 'Rare historical allocations & museum library vintages',
    min: 25000,
    max: 1000000
  }
];

export const FindYourWineQuiz: React.FC = () => {
  const {
    isQuizOpen,
    setIsQuizOpen,
    products,
    addToCart,
    setSelectedProduct
  } = useWineStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMood, setSelectedMood] = useState<string>('rich-bold');
  const [selectedPairing, setSelectedPairing] = useState<string>('steak');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('reserve');

  if (!isQuizOpen) return null;

  // Personalized Recommendation Scoring
  const rankedProducts: Product[] = (() => {
    const moodObj = MOODS.find((m) => m.id === selectedMood);
    const pairingObj = PAIRINGS.find((p) => p.id === selectedPairing);
    const priceObj = PRICE_TIERS.find((pt) => pt.id === selectedPriceTier);

    return products
      .slice()
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // 1. Mood type match
        if (moodObj?.typeMatch) {
          if (moodObj.typeMatch.includes(a.wine_type)) scoreA += 5;
          if (moodObj.typeMatch.includes(b.wine_type)) scoreB += 5;
        }

        // 2. Body / Sweetness match
        if (moodObj?.bodyMatch) {
          if (moodObj.bodyMatch.includes(a.body)) scoreA += 3;
          if (moodObj.bodyMatch.includes(b.body)) scoreB += 3;
        }
        if (moodObj?.sweetnessMatch) {
          if (moodObj.sweetnessMatch.includes(a.sweetness)) scoreA += 3;
          if (moodObj.sweetnessMatch.includes(b.sweetness)) scoreB += 3;
        }

        // 3. Gastronomic Pairing match
        if (pairingObj?.preferredTypes) {
          if (pairingObj.preferredTypes.includes(a.wine_type)) scoreA += 4;
          if (pairingObj.preferredTypes.includes(b.wine_type)) scoreB += 4;
        }

        // 4. Budget filter
        if (priceObj) {
          if (a.price >= priceObj.min && a.price <= priceObj.max) scoreA += 5;
          if (b.price >= priceObj.min && b.price <= priceObj.max) scoreB += 5;
        }

        // 5. Featured priority
        if (a.featured) scoreA += 1;
        if (b.featured) scoreB += 1;

        return scoreB - scoreA;
      });
  })();

  const topPick = rankedProducts[0] || products[0];
  const secondaryPicks = rankedProducts.slice(1, 3);

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setIsQuizOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120A0C]/90 backdrop-blur-2xl p-2 sm:p-6 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-4xl w-full max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl dark-luxury-glass-elevated shadow-2xl p-4 sm:p-10 border border-white/10">
        {/* Close Button */}
        <button
          onClick={() => setIsQuizOpen(false)}
          className="p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer absolute top-3.5 right-3.5 sm:top-6 sm:right-6 z-20"
          aria-label="Close wine finder"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title & Eyebrow */}
        <div className="text-center mb-5 sm:mb-8 pr-8 sm:pr-0">
          <div className="inline-flex items-center gap-2 text-[#C6A15B] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Interactive Sommelier Recommendation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Find Your Wine
          </h2>
          <p className="text-xs sm:text-sm text-[#B7AAA1] max-w-md mx-auto font-light mt-2">
            Personalized vintage matching based on your sensory palate, menu pairing, and cellar allocation.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
          {[1, 2, 3, 4].map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  step === s
                    ? 'bg-[#C6A15B] text-[#120A0C] shadow-lg scale-110'
                    : step > s
                    ? 'bg-[#861F32] text-white'
                    : 'bg-white/5 text-[#B7AAA1]/50 border border-white/10'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {idx < 3 && (
                <div
                  className={`w-7 sm:w-16 h-0.5 transition-colors ${
                    step > s ? 'bg-[#861F32]' : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: What are you in the mood for? */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal">
                WHAT ARE YOU IN THE MOOD FOR?
              </h3>
              <p className="text-xs sm:text-sm text-[#B7AAA1] mt-1 font-light">
                Select the flavor architecture and texture you wish to experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#210D12] border-2 border-[#C6A15B] shadow-xl'
                        : 'dark-luxury-glass hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-xl text-[#F5EFE7] font-medium">
                        {mood.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#C6A15B]" />}
                    </div>
                    <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                      {mood.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto justify-center btn-magnetic py-3.5 px-6 sm:px-8 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
              >
                <span>Next: Choose Pairing</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B] btn-magnetic-arrow" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: What are you pairing it with? */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal">
                WHAT ARE YOU PAIRING IT WITH?
              </h3>
              <p className="text-xs sm:text-sm text-[#B7AAA1] mt-1 font-light">
                Harmonize wine acidity, tannin, and body with your chosen cuisine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PAIRINGS.map((pairing) => {
                const isSelected = selectedPairing === pairing.id;
                return (
                  <button
                    key={pairing.id}
                    type="button"
                    onClick={() => setSelectedPairing(pairing.id)}
                    className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#210D12] border-2 border-[#C6A15B] shadow-xl'
                        : 'dark-luxury-glass hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-lg text-[#F5EFE7] font-medium flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-[#C6A15B]" />
                        <span>{pairing.label}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#C6A15B]" />}
                    </div>
                    <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                      {pairing.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 text-xs uppercase tracking-wider text-[#B7AAA1] hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-magnetic py-3.5 px-6 sm:px-8 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
              >
                <span>Next: Allocation Range</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B] btn-magnetic-arrow" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preferred price range */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal">
                WHAT IS YOUR ALLOCATION RANGE?
              </h3>
              <p className="text-xs sm:text-sm text-[#B7AAA1] mt-1 font-light">
                Tailor our master sommelier selection to your desired investment level.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRICE_TIERS.map((tier) => {
                const isSelected = selectedPriceTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedPriceTier(tier.id)}
                    className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#210D12] border-2 border-[#C6A15B] shadow-xl'
                        : 'dark-luxury-glass hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-xl text-[#C6A15B] font-medium">
                        {tier.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#C6A15B]" />}
                    </div>
                    <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                      {tier.rangeDesc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 text-xs uppercase tracking-wider text-[#B7AAA1] hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-magnetic py-3.5 px-5 sm:px-8 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
              >
                <span>Reveal Sommelier Recommendation</span>
                <Sparkles className="w-4 h-4 text-[#C6A15B] btn-magnetic-arrow shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Your VÍNEA Recommendation Showcase */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
                  Sommelier Curated Match
                </span>
                <h3 className="font-serif text-2xl text-[#F5EFE7] mt-0.5">
                  YOUR PERFECT BOTTLE
                </h3>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="text-xs text-[#B7AAA1] hover:text-[#C6A15B] flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>

            {/* Primary Hero Recommended Bottle Card */}
            <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl dark-luxury-glass-elevated border border-[#C6A15B]/40 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Bottle Visual */}
              <div className="md:col-span-5 relative flex justify-center">
                <div className="relative w-48 aspect-3/4 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl group flex items-center justify-center p-2">
                  <img
                    src={getWineImageUrl(topPick.image)}
                    alt={topPick.name}
                    onError={handleImageError}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out text-transparent"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 border border-[#C6A15B]/40 text-[9px] uppercase tracking-wider text-[#C6A15B] font-semibold">
                    Top Match
                  </div>
                </div>
              </div>

              {/* Wine Details & Tasting Profile */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#C6A15B] uppercase tracking-widest font-medium mb-1">
                    <span>{topPick.winery}</span>
                    <span>·</span>
                    <span>Vintage {topPick.vintage}</span>
                  </div>
                  <h4
                    onClick={() => handleSelectProduct(topPick)}
                    className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal leading-snug hover:text-[#C6A15B] cursor-pointer transition-colors"
                  >
                    {topPick.name}
                  </h4>
                  <p className="text-xs text-[#B7AAA1] mt-1 font-light">
                    {topPick.region}, {topPick.country} · {topPick.grape_variety} · {topPick.alcohol_percentage}% ABV
                  </p>
                </div>

                {/* Organoleptic Tasting Profile Bar Display */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <InteractiveTastingProfile
                    metrics={{
                      body: topPick.body === 'Full' ? 5 : topPick.body === 'Medium' ? 3 : 2,
                      acidity: topPick.wine_type === 'White' || topPick.wine_type === 'Sparkling' ? 4 : 3,
                      sweetness: topPick.sweetness === 'Sweet' ? 4 : topPick.sweetness === 'Semi-Dry' ? 3 : topPick.sweetness === 'Dry' ? 2 : 1,
                      tannin: topPick.wine_type === 'Red' ? 4 : 1,
                      fruit: 4
                    }}
                    compact
                  />
                </div>

                {/* Gastronomic Pairing Tip */}
                <div className="text-xs text-[#B7AAA1] bg-white/[0.03] p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[#F5EFE7] font-medium">Sommelier Pairing: </strong>
                    {topPick.food_pairings && topPick.food_pairings.length > 0
                      ? topPick.food_pairings.join(', ')
                      : 'Artisan Cheeses, Roasted Fine Meats, or Milestone Celebration'}
                  </p>
                </div>

                {/* Price & Immediate Add to Cellar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">Cellar Allocation</span>
                    <span className="font-serif text-2xl text-[#C6A15B] tabular-nums font-semibold">
                      {formatPeso(topPick.price)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(topPick, 1)}
                      className="btn-magnetic py-3 px-5 sm:px-6 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg group"
                      data-cursor="add"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B] btn-magnetic-arrow" />
                      <span>+ ADD TO CELLAR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(topPick)}
                      className="py-3 px-4 rounded-xl dark-luxury-glass hover:bg-white/10 text-[#F5EFE7] text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Complementary Alternative Recommendations */}
            {secondaryPicks.length > 0 && (
              <div className="pt-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#B7AAA1] font-semibold block mb-3">
                  Complementary Cellar Allocations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {secondaryPicks.map((wine) => (
                    <div
                      key={wine.product_id}
                      className="p-4 rounded-2xl dark-luxury-glass hover:bg-white/[0.08] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getWineImageUrl(wine.image)}
                          alt={wine.name}
                          onError={handleImageError}
                          className="w-12 h-16 rounded-lg object-contain bg-black/40 shrink-0 text-transparent"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5
                            onClick={() => handleSelectProduct(wine)}
                            className="font-serif text-sm text-[#F5EFE7] font-normal truncate hover:text-[#C6A15B] cursor-pointer"
                          >
                            {wine.name}
                          </h5>
                          <span className="text-xs text-[#C6A15B] tabular-nums block font-serif">
                            {formatPeso(wine.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(wine, 1)}
                        className="p-2.5 rounded-xl bg-[#210D12] hover:bg-[#861F32] text-[#C6A15B] hover:text-white transition-colors cursor-pointer border border-white/10"
                        title="Add to Cellar"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
