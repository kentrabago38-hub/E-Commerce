import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { ArrowUpRight, Wine, Sparkles, Compass } from 'lucide-react';

interface FeaturedCollectionItem {
  id: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  slug: string;
  colSpan: string;
  minHeight: string;
  filterType?: string;
}

const CURATED_COLLECTIONS: FeaturedCollectionItem[] = [
  {
    id: 'col-old-world',
    title: 'Old World Classics',
    kicker: 'Historic Terroirs & Heritage',
    description: 'Classified Grand Crus and estate allocations from Bordeaux, Burgundy, Rioja, and Piedmont, shaped by centuries of viticultural pedigree.',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    slug: 'red',
    colSpan: 'md:col-span-7',
    minHeight: 'min-h-[440px] sm:min-h-[480px]',
    filterType: 'Red'
  },
  {
    id: 'col-new-world',
    title: 'New World Discoveries',
    kicker: 'Modern Innovation & Expression',
    description: 'Sun-drenched Napa Valley Cabernets, high-altitude Andean Malbecs, and crisp Marlborough Sauvignon Blancs redefining contemporary luxury.',
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    slug: 'white',
    colSpan: 'md:col-span-5',
    minHeight: 'min-h-[440px] sm:min-h-[480px]',
    filterType: 'White'
  },
  {
    id: 'col-collectors',
    title: "Collector's Selection",
    kicker: 'Library Vintages & Rare Allocations',
    description: 'Rare single-vineyard bottlings, numbered releases, and museum vintages with pristine cork seals preserved in 13°C subterranean vaults.',
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    slug: 'collections',
    colSpan: 'md:col-span-6',
    minHeight: 'min-h-[380px]',
    filterType: 'Collections'
  },
  {
    id: 'col-sparkling',
    title: 'Sparkling Celebrations',
    kicker: 'Champagne & Prestige Cuvées',
    description: 'Traditional method Champagne, Franciacorta, and artisan sparkling wines with fine persistent mousse and toasted brioche complexity.',
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    slug: 'sparkling',
    colSpan: 'md:col-span-6',
    minHeight: 'min-h-[380px]',
    filterType: 'Sparkling'
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2 flex items-center gap-2">
            <Wine className="w-3.5 h-3.5" />
            <span>Curated Cellar Portfolios</span>
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Featured Collections
          </h2>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
          From ancient Grand Cru appellations and cellar reserves to crisp coastal terroirs, discover wines selected for character, balance, and pedigree.
        </p>
      </div>

      {/* Asymmetrical Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {CURATED_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            onClick={() => handleCollectionClick(col.slug)}
            className={`group ${col.colSpan} relative rounded-xl overflow-hidden bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/60 transition-all duration-500 cursor-pointer shadow-xl flex flex-col justify-end ${col.minHeight} p-8 sm:p-10`}
          >
            {/* Background Image with Cinematic Vignette */}
            <div className="absolute inset-0">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.6]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-[#130B0D]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#210D12]/80 via-transparent to-transparent" />
            </div>

            {/* Content (Zero-Pill Discipline: Unboxed Kicker) */}
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C6A15B]" />
                <span>{col.kicker}</span>
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3 group-hover:text-[#C6A15B] transition-colors">
                {col.title}
              </h3>
              <p className="text-sm text-[#B7AAA1] max-w-lg mb-6 leading-relaxed font-light">
                {col.description}
              </p>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C6A15B] font-semibold group-hover:translate-x-1 transition-transform">
                <span>Explore Allocations</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


