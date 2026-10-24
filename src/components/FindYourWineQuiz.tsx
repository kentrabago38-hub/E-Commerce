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
  Wine,
  Flame,
  Feather,
  GlassWater,
  PartyPopper,
  Compass
} from 'lucide-react';

interface QuizOption {
  id: string;
  label: string;
  desc: string;
  typeMatch?: string[];
  sweetnessMatch?: string[];
  bodyMatch?: string[];
}

const WINE_STYLES: QuizOption[] = [
  {
    id: 'light-fruity',
    label: 'Light & Fruity',
    desc: 'Brimming with fresh berries, soft tannins, and lively drinkability.',
    typeMatch: ['Red', 'Rosé'],
    bodyMatch: ['Light', 'Medium']
  },
  {
    id: 'rich-bold',
    label: 'Rich & Bold',
    desc: 'Dense dark fruits, French oak vanilla, deep structure, and persistent finish.',
    typeMatch: ['Red'],
    bodyMatch: ['Full']
  },
  {
    id: 'sweet-smooth',
    label: 'Sweet & Smooth',
    desc: 'Silky unctuous mouthfeel with honeyed stone fruits and gentle acidity.',
    sweetnessMatch: ['Semi-Dry', 'Sweet', 'Dry']
  },
  {
    id: 'dry-crisp',
    label: 'Dry & Crisp',
    desc: 'Razor-sharp minerality, high citrus tension, and mouthwatering salinity.',
    typeMatch: ['White', 'Rosé'],
    sweetnessMatch: ['Bone Dry', 'Dry']
  },
  {
    id: 'elegant-aromatic',
    label: 'Elegant & Aromatic',
    desc: 'Perfumed white blossoms, wild rose, tea leaf, and harmonious complexity.',
    typeMatch: ['White', 'Red']
  },
  {
    id: 'sparkling-fresh',
    label: 'Sparkling & Fresh',
    desc: 'Effervescent bubbles, toasted brioche, celebration in a glass.',
    typeMatch: ['Sparkling']
  }
];

const OCCASIONS = [
  { id: 'dinner-steak', label: 'Prime Steak & Hearty Feasts' },
  { id: 'seafood', label: 'Fresh Seafood, Oysters & Salads' },
  { id: 'celebration', label: 'Milestone Celebration or Toast' },
  { id: 'gift', label: 'Prestigious Collector Gift' },
  { id: 'evening', label: 'Quiet Fireside Reflection' }
];

export const FindYourWineQuiz: React.FC = () => {
  const {
    isQuizOpen,
    setIsQuizOpen,
    products,
    addToCart,
    setQuickViewProduct,
    setSelectedProduct
  } = useWineStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedStyle, setSelectedStyle] = useState<string>('rich-bold');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('dinner-steak');

  if (!isQuizOpen) return null;

  // Recommendation algorithm
  const recommendedWines: Product[] = (() => {
    const styleObj = WINE_STYLES.find((s) => s.id === selectedStyle);

    return products
      .slice()
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (styleObj?.typeMatch) {
          if (styleObj.typeMatch.includes(a.wine_type)) scoreA += 3;
          if (styleObj.typeMatch.includes(b.wine_type)) scoreB += 3;
        }

        if (styleObj?.bodyMatch) {
          if (styleObj.bodyMatch.includes(a.body)) scoreA += 2;
          if (styleObj.bodyMatch.includes(b.body)) scoreB += 2;
        }

        if (styleObj?.sweetnessMatch) {
          if (styleObj.sweetnessMatch.includes(a.sweetness)) scoreA += 2;
          if (styleObj.sweetnessMatch.includes(b.sweetness)) scoreB += 2;
        }

        // Occasion weight
        if (selectedOccasion === 'dinner-steak') {
          if (a.body === 'Full' && a.wine_type === 'Red') scoreA += 3;
          if (b.body === 'Full' && b.wine_type === 'Red') scoreB += 3;
        } else if (selectedOccasion === 'seafood') {
          if (a.wine_type === 'White' || a.wine_type === 'Rosé') scoreA += 3;
          if (b.wine_type === 'White' || b.wine_type === 'Rosé') scoreB += 3;
        } else if (selectedOccasion === 'celebration') {
          if (a.wine_type === 'Sparkling') scoreA += 4;
          if (b.wine_type === 'Sparkling') scoreB += 4;
        } else if (selectedOccasion === 'gift') {
          if (a.price > 120) scoreA += 3;
          if (b.price > 120) scoreB += 3;
        }

        return scoreB - scoreA;
      })
      .slice(0, 3);
  })();

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setIsQuizOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setIsQuizOpen(false)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-white transition-colors cursor-pointer absolute top-5 right-5"
          aria-label="Close quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[#C6A15B] text-xs font-semibold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sommelier Discovery System</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-2">
            Find Your Wine
          </h2>
          <p className="text-xs sm:text-sm text-[#B7AAA1] max-w-md mx-auto font-light">
            Answer two quick sommelier questions to receive instant, personalized cellar recommendations.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#861F32] text-white border border-[#C6A15B]' : 'bg-[#210D12] text-[#B7AAA1]/50 border border-[#48151F]'
            }`}
          >
            1
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#861F32]' : 'bg-[#48151F]'}`} />
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-[#861F32] text-white border border-[#C6A15B]' : 'bg-[#210D12] text-[#B7AAA1]/50 border border-[#48151F]'
            }`}
          >
            2
          </div>
          <div className={`w-12 h-0.5 ${step === 3 ? 'bg-[#861F32]' : 'bg-[#48151F]'}`} />
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-[#C6A15B] text-[#130B0D] font-extrabold' : 'bg-[#210D12] text-[#B7AAA1]/50 border border-[#48151F]'
            }`}
          >
            3
          </div>
        </div>

        {/* STEP 1: Flavor Profile */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-xl sm:text-2xl text-center text-[#F5EFE7] font-normal mb-6">
              What kind of wine are you looking for?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {WINE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStyle === style.id
                      ? 'bg-[#210D12] border-[#C6A15B] shadow-lg ring-1 ring-[#C6A15B]'
                      : 'bg-[#130B0D] border-[#48151F] hover:border-[#C6A15B]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-lg text-[#F5EFE7] font-medium">
                      {style.label}
                    </span>
                    {selectedStyle === style.id && (
                      <Check className="w-4 h-4 text-[#C6A15B]" />
                    )}
                  </div>
                  <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
                    {style.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Next: Choose Occasion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Occasion */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-xl sm:text-2xl text-center text-[#F5EFE7] font-normal mb-6">
              What is the setting or culinary pairing?
            </h3>

            <div className="space-y-3 mb-8">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    selectedOccasion === occ.id
                      ? 'bg-[#210D12] border-[#C6A15B] shadow-lg ring-1 ring-[#C6A15B]'
                      : 'bg-[#130B0D] border-[#48151F] hover:border-[#C6A15B]/40'
                  }`}
                >
                  <span className="text-sm font-medium text-[#F5EFE7]">{occ.label}</span>
                  {selectedOccasion === occ.id && (
                    <Check className="w-4 h-4 text-[#C6A15B]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 text-xs text-[#B7AAA1] hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>View Recommendations</span>
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="p-4 rounded-xl bg-[#210D12] border border-[#48151F] mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#C6A15B] uppercase tracking-wider font-semibold">Your Palate Profile</p>
                <p className="text-sm text-[#F5EFE7] font-serif mt-0.5">
                  {WINE_STYLES.find(s => s.id === selectedStyle)?.label} · {OCCASIONS.find(o => o.id === selectedOccasion)?.label}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#B7AAA1] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {recommendedWines.map((wine) => (
                <div
                  key={wine.product_id}
                  className="p-4 rounded-xl bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={wine.image}
                      alt={wine.name}
                      className="w-16 h-16 rounded-lg object-cover bg-black/40 border border-[#48151F]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[11px] text-[#C6A15B] uppercase tracking-wider block">
                        {wine.winery} · Vintage {wine.vintage}
                      </span>
                      <h4
                        onClick={() => handleSelectProduct(wine)}
                        className="font-serif text-lg text-[#F5EFE7] font-normal hover:text-[#C6A15B] cursor-pointer"
                      >
                        {wine.name}
                      </h4>
                      <p className="text-xs text-[#B7AAA1]">
                        {wine.country} · {wine.region} · {wine.body} Body
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#48151F]">
                    <span className="font-serif text-xl text-[#C6A15B] tabular-nums font-normal">
                      {formatPeso(wine.price)}
                    </span>

                    <button
                      onClick={() => addToCart(wine, 1)}
                      className="py-2 px-3.5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>

                    <button
                      onClick={() => handleSelectProduct(wine)}
                      className="py-2 px-3 rounded-lg border border-[#48151F] hover:border-[#C6A15B] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs tracking-wider uppercase font-medium cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsQuizOpen(false)}
                className="py-3 px-8 rounded-lg bg-[#210D12] hover:bg-[#48151F] border border-[#48151F] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-medium cursor-pointer"
              >
                Close & Browse Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
