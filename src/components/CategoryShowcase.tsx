import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { ArrowUpRight, Wine, Sparkles, Award } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

interface CuratedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  colSpan: string;
  minHeight: string;
}

const COLLECTIONS_LIST: CuratedCollection[] = [
  {
    id: 'red-collection',
    title: 'The Red Collection',
    subtitle: 'Grand Crus & Age-Worthy Bordeaux Blends',
    description: 'Structured Left Bank Cabernets, velvety Pomerol Merlots, and noble Barolo Nebbiolos crafted for profound longevity.',
    image: '/images/category_red_wine_curated.jpg',
    slug: 'red',
    colSpan: 'lg:col-span-8',
    minHeight: 'min-h-[460px]'
  },
  {
    id: 'white-essentials',
    title: 'White Wine Essentials',
    subtitle: 'Chablis, Sancerre & Montrachet',
    description: 'Steely mineral precision, vibrant salinity, and barrel-fermented Burgundy Chardonnays with crystalline purity.',
    image: '/images/category_white_wine_curated.jpg',
    slug: 'white',
    colSpan: 'lg:col-span-4',
    minHeight: 'min-h-[460px]'
  },
  {
    id: 'sparkling-elegance',
    title: 'Sparkling Elegance',
    subtitle: 'Vintage Champagne & Prestige Cuvées',
    description: 'Traditional method Grand Cru effervescence with microscopic beads, toasted brioche, and hazelnut autolysis.',
    image: '/images/category_sparkling_wine_curated.jpg',
    slug: 'sparkling',
    colSpan: 'lg:col-span-4',
    minHeight: 'min-h-[420px]'
  },
  {
    id: 'rose-selection',
    title: 'Rosé Selection',
    subtitle: 'Pale Provençal Terroirs',
    description: 'Bone-dry estate bottlings from Bandol and Côtes de Provence capturing lavender, wild strawberry, and crushed sea shell.',
    image: '/images/category_rose_wine_curated.jpg',
    slug: 'rose',
    colSpan: 'lg:col-span-4',
    minHeight: 'min-h-[420px]'
  },
  {
    id: 'collectors-reserve',
    title: "Collector's Reserve",
    subtitle: 'Subterranean Vault Allocations',
    description: 'Museum-release library vintages, numbered single-barrel lots, and provenance-certified allocations.',
    image: '/images/category_collections_vault_curated.jpg',
    slug: 'collections',
    colSpan: 'lg:col-span-4',
    minHeight: 'min-h-[420px]'
  }
];

export const CategoryShowcase: React.FC = () => {
  const { setActiveTab, setSelectedProduct } = useWineStore();

  const handleCollectionClick = (slug: string) => {
    setSelectedProduct(null);
    if (slug === 'red') setActiveTab('red');
    else if (slug === 'white') setActiveTab('white');
    else if (slug === 'rose') setActiveTab('rose');
    else if (slug === 'sparkling') setActiveTab('sparkling');
    else if (slug === 'collections') setActiveTab('collections');
    else setActiveTab('shop');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#F5F0E7] text-[#211D1C] border-b border-[#B7AA9B]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-[#B7AA9B]/40 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#741E2B] font-semibold mb-2">
              <Wine className="w-3.5 h-3.5" />
              <span>Curated Portfolios</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#351116] font-normal tracking-tight">
              Featured Wine Collections
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#574E4C] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Curated by style, terroir, and maturity. Discover wines categorized to provide seamless discovery for both seasoned collectors and casual dinner hosts.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {COLLECTIONS_LIST.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.slug)}
              className={`${col.colSpan} ${col.minHeight} group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#B7AA9B]/40 flex flex-col justify-end p-6 sm:p-8 bg-[#18080C]`}
            >
              {/* Opulent Ambient Cellar Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#351116] via-[#1A080D] to-[#0D0407]" />

              {/* Media Layer with text-transparent to suppress ugly broken image icon text */}
              <img
                src={getWineImageUrl(col.image)}
                alt={col.title}
                onError={(e) => handleImageError(e, '/images/hero_wine_cellar_1791213186963.jpg')}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out text-transparent"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim for Contrast & Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-colors" />

              {/* Card Content in Editorial Typography */}
              <div className="relative z-10 text-white">
                <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C6A15B] uppercase block mb-1.5 drop-shadow">
                  {col.subtitle}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2 leading-tight flex items-center justify-between">
                  <span>{col.title}</span>
                  <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#741E2B] border border-white/20 group-hover:border-[#C6A15B] flex items-center justify-center transition-all duration-300 shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl opacity-90 group-hover:opacity-100 transition-opacity">
                  {col.description}
                </p>

                <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between">
                  <span className="gold-shimmer-cta inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#351116]/80 text-[#C6A15B] group-hover:text-white group-hover:bg-[#861F32] text-xs font-semibold uppercase tracking-wider border border-[#C6A15B]/40 transition-all shadow-md">
                    <span>View Collection</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-white/60 tracking-widest uppercase font-mono hidden sm:inline">
                    VÍNEA RESERVE
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
