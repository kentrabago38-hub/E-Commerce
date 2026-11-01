import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { Award, ShoppingBag, Eye, Heart, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const SommeliersSelectionSection: React.FC = () => {
  const {
    products,
    addToCart,
    setQuickViewProduct,
    setSelectedProduct,
    toggleWishlist,
    isInWishlist
  } = useWineStore();

  // Find a pinnacle bottle, e.g. Domaine de la Romanée-Conti, Château Margaux, or first featured red
  const sommelierPick = products.find((p) => p.product_id === 'prod-001') || products[0];

  if (!sommelierPick) return null;

  const isFavorited = isInWishlist(sommelierPick.product_id);

  return (
    <section className="py-24 bg-[#F5F0E7] text-[#211D1C] relative overflow-hidden border-y border-[#B7AA9B]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Magazine Editorial Eyebrow & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#741E2B] font-semibold mb-3">
            <Award className="w-4 h-4 text-[#C6A15B]" />
            <span>Master Sommelier Curation · Vol. IV</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#351116] font-normal tracking-tight mb-4 text-balance">
            Selected with Expertise. Enjoyed with Intention.
          </h2>
          <p className="text-sm sm:text-base text-[#574E4C] font-light leading-relaxed">
            Every quarter, our Cellar Master isolates exceptional bottles showing extraordinary maturity, purity of fruit, and cellar longevity.
          </p>
        </div>

        {/* Feature Split Layout: Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl border border-[#B7AA9B]/40">
          {/* Left Column: Premium Photography with isolated bottle + crystal glass */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-4/3 lg:aspect-3/4 rounded-xl overflow-hidden bg-[#211D1C] shadow-2xl flex items-center justify-center">
              <img
                src="/src/assets/images/sommelier_reserve_bottle_1793457418720.jpg"
                alt="Sommelier Reserve Vintage Bottle and Burgundy crystal glass"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges in quiet editorial typography */}
              <div className="absolute top-4 left-4 bg-[#351116]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#C6A15B]/40 text-xs text-[#C6A15B] font-serif tracking-wider">
                Cellar Vault Allocation
              </div>

              <button
                onClick={() => toggleWishlist(sommelierPick.product_id)}
                className={`absolute top-4 right-4 p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                  isFavorited
                    ? 'bg-[#741E2B] text-white border border-[#C6A15B]'
                    : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/70 border border-white/20'
                }`}
                aria-label="Wishlist sommelier selection"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                <span className="font-serif italic text-sm">{sommelierPick.winery}</span>
                <span className="text-[#C6A15B] font-semibold uppercase tracking-wider">{sommelierPick.vintage} Vintage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sommelier Tasting Notes & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#741E2B] font-semibold mb-2">
                <span>{sommelierPick.region}, {sommelierPick.country}</span>
                <span aria-hidden="true">·</span>
                <span>{sommelierPick.grape_variety}</span>
                <span aria-hidden="true">·</span>
                <span>{sommelierPick.alcohol_percentage}% ABV</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-[#351116] font-normal mb-3">
                {sommelierPick.name}
              </h3>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#741E2B] tabular-nums">
                  {formatPeso(sommelierPick.price)}
                </span>
                <span className="text-xs text-[#574E4C] uppercase tracking-wider">
                  Davao Duty Paid · 750ml
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#423A38] font-light leading-relaxed mb-6">
                {sommelierPick.description}
              </p>

              {/* Sommelier Tasting Notes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F5F0E7] border border-[#B7AA9B]/30 mb-8 text-xs">
                <div>
                  <span className="text-[#741E2B] uppercase tracking-wider font-semibold block text-[11px] mb-1">
                    Aroma
                  </span>
                  <p className="text-[#211D1C] font-light leading-tight">
                    {sommelierPick.tasting_notes?.aroma.join(', ') || 'Blackberry, dark plum, sweet tobacco'}
                  </p>
                </div>
                <div>
                  <span className="text-[#741E2B] uppercase tracking-wider font-semibold block text-[11px] mb-1">
                    Palate
                  </span>
                  <p className="text-[#211D1C] font-light leading-tight">
                    {sommelierPick.tasting_notes?.palate || 'Structured, velvety tannins, crushed gravel'}
                  </p>
                </div>
                <div>
                  <span className="text-[#741E2B] uppercase tracking-wider font-semibold block text-[11px] mb-1">
                    Finish & Cellar
                  </span>
                  <p className="text-[#211D1C] font-light leading-tight">
                    {sommelierPick.tasting_notes?.finish || 'Persistent, harmonious oak finish. Drink 2026–2038.'}
                  </p>
                </div>
              </div>

              {/* Master Sommelier Tasting Quote */}
              <blockquote className="border-l-2 border-[#C6A15B] pl-4 italic text-sm text-[#574E4C] mb-8 font-serif">
                “This vintage demonstrates an uncommon harmony between powerful fruit concentration and crystalline mineral tension. Decant for one hour in our Davao cellars.”
                <footer className="text-xs font-sans not-italic text-[#741E2B] font-semibold mt-1">
                  — Julian Vance, Master Sommelier
                </footer>
              </blockquote>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#B7AA9B]/30">
              <button
                onClick={() => addToCart(sommelierPick, 1)}
                className="gold-shimmer-cta w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#741E2B] hover:bg-[#8e2535] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#C6A15B]/40"
              >
                <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                <span>Acquire This Allocation</span>
              </button>

              <button
                onClick={() => setQuickViewProduct(sommelierPick)}
                className="gold-shimmer-cta w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-[#F5F0E7] text-[#351116] text-xs font-semibold tracking-wider uppercase border border-[#B7AA9B]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Eye className="w-4 h-4 text-[#741E2B]" />
                <span>Tasting dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
