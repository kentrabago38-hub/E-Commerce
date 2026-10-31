import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Compass, ArrowRight, MapPin, Globe } from 'lucide-react';

interface WineRegion {
  id: string;
  name: string;
  country: string;
  appellation: string;
  description: string;
  signatureGrapes: string[];
  climate: string;
  image: string;
  searchFilter: string;
}

const WINE_REGIONS: WineRegion[] = [
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    country: 'France',
    appellation: 'Left & Right Bank AOC',
    description: 'The global benchmark for age-worthy, structured red blends. Gravelly Left Bank soils yield noble Cabernet Sauvignon, while Right Bank clay nurtures supple Merlot.',
    signatureGrapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'],
    climate: 'Maritime with temperate Atlantic breezes',
    image: '/src/assets/images/wine_region_terroir_1793457418686.jpg',
    searchFilter: 'Bordeaux'
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    country: 'France',
    appellation: 'Côte de Nuits & Côte de Beaune',
    description: 'The pinnacle of terroir expression. Pure, unadorned expressions of Pinot Noir and Chardonnay shaped by jurassic limestone soils and centuries of monastic parcel classification.',
    signatureGrapes: ['Pinot Noir', 'Chardonnay'],
    climate: 'Semi-continental with brisk crisp autumns',
    image: '/src/assets/images/hero_editorial_vineyard_1793457418592.jpg',
    searchFilter: 'Burgundy'
  },
  {
    id: 'tuscany',
    name: 'Tuscany',
    country: 'Italy',
    appellation: 'Chianti Classico & Brunello di Montalcino DOCG',
    description: 'Sun-drenched hills of galestro and alberese soils yielding Sangiovese with savory dried cherry, violet, leather, and tobacco complexity, flanked by revolutionary Super Tuscans.',
    signatureGrapes: ['Sangiovese', 'Cabernet Sauvignon', 'Merlot'],
    climate: 'Warm Mediterranean with cool Apennine night breezes',
    image: '/src/assets/images/wine_region_terroir_1793457418686.jpg',
    searchFilter: 'Tuscany'
  },
  {
    id: 'piedmont',
    name: 'Piedmont',
    country: 'Italy',
    appellation: 'Barolo & Barbaresco DOCG',
    description: 'The royal domain of the Nebbiolo grape nestled beneath the misty Alps. Celebrated for translucent garnet hues, assertive tannins, and ethereal aromas of tar and roses.',
    signatureGrapes: ['Nebbiolo', 'Barbera', 'Dolcetto'],
    climate: 'Continental with famous autumnal Langhe fogs (Nebbia)',
    image: '/src/assets/images/hero_wine_cellar_1791213186963.jpg',
    searchFilter: 'Piedmont'
  },
  {
    id: 'rioja',
    name: 'Rioja',
    country: 'Spain',
    appellation: 'DOCa Rioja Alta & Alavesa',
    description: 'Spain’s premier wine region where Tempranillo is traditionally matured in American and French oak casks to produce velvety Reservas and Gran Reservas with vanilla and cedar spice.',
    signatureGrapes: ['Tempranillo', 'Garnacha', 'Graciano'],
    climate: 'Continental-Atlantic transition',
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    searchFilter: 'Rioja'
  },
  {
    id: 'napa-valley',
    name: 'Napa Valley',
    country: 'United States',
    appellation: 'Oakville & Rutherford AVA',
    description: 'World-renowned volcanic and alluvial soils producing bold, plush Cabernets with cassis, dark cocoa, and supple fine-grained tannins beneath radiant California sunshine.',
    signatureGrapes: ['Cabernet Sauvignon', 'Chardonnay', 'Merlot'],
    climate: 'Mediterranean with morning marine fogs from San Pablo Bay',
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    searchFilter: 'Napa'
  },
  {
    id: 'marlborough',
    name: 'Marlborough',
    country: 'New Zealand',
    appellation: 'Wairau & Awatere Valleys',
    description: 'Crisp, electrifying Sauvignon Blancs and vibrant cool-climate Pinot Noirs framed by stony alluvial river terraces, intense UV clarity, and crisp Pacific maritime breezes.',
    signatureGrapes: ['Sauvignon Blanc', 'Pinot Noir'],
    climate: 'Cool maritime with high sunshine hours and cold nights',
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    searchFilter: 'Marlborough'
  }
];

export const WineRegionsSection: React.FC = () => {
  const { setActiveTab, setSearchQuery, setSelectedProduct } = useWineStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('bordeaux');

  const activeRegion = WINE_REGIONS.find((r) => r.id === selectedRegionId) || WINE_REGIONS[0];

  const handleExploreRegion = (region: WineRegion) => {
    setSelectedProduct(null);
    setSearchQuery(region.searchFilter);
    setActiveTab('shop');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Terroir & Provenance</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Discover by Region
          </h2>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
          The soul of fine wine lies in its origin. Explore the distinguished climates, geology, and heritage shaping each iconic viticultural landscape.
        </p>
      </div>

      {/* Region Selector Pills (Interactive filter controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {WINE_REGIONS.map((region) => {
          const isActive = region.id === selectedRegionId;
          return (
            <button
              key={region.id}
              onClick={() => setSelectedRegionId(region.id)}
              className={`px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#861F32] text-white border-[#C6A15B] shadow-md'
                  : 'bg-[#130B0D] text-[#B7AAA1] hover:text-[#F5EFE7] border-[#48151F] hover:border-[#C6A15B]/50'
              }`}
            >
              <span>{region.name}</span>
              <span className="text-[10px] opacity-70 ml-1.5 font-normal">({region.country})</span>
            </button>
          );
        })}
      </div>

      {/* Spotlight Card with Photographic Landscape */}
      <div className="relative rounded-2xl overflow-hidden bg-[#130B0D] border border-[#48151F] shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left: Atmospheric Image with Subtle Scrim */}
        <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-full overflow-hidden">
          <img
            src={activeRegion.image}
            alt={`${activeRegion.name}, ${activeRegion.country}`}
            className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#130B0D]" />

          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#130B0D]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#48151F] text-xs text-[#C6A15B]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-medium">{activeRegion.appellation}</span>
          </div>
        </div>

        {/* Right: Editorial Narrative & Specifications */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2">
              <span>{activeRegion.country}</span>
              <span>·</span>
              <span>Appellation d'Origine</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-4">
              {activeRegion.name}
            </h3>

            <p className="text-sm text-[#B7AAA1] font-light leading-relaxed mb-6">
              {activeRegion.description}
            </p>

            {/* Terroir metadata specs */}
            <div className="space-y-3 pt-4 border-t border-[#48151F] mb-8 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#B7AAA1] uppercase tracking-wider text-[11px] shrink-0">Signature Grapes</span>
                <span className="text-[#F5EFE7] font-medium text-right">
                  {activeRegion.signatureGrapes.join(', ')}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#B7AAA1] uppercase tracking-wider text-[11px] shrink-0">Mesoclimate</span>
                <span className="text-[#F5EFE7] font-medium text-right">{activeRegion.climate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleExploreRegion(activeRegion)}
            className="w-full py-3.5 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Explore {activeRegion.name} Wines</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>
        </div>
      </div>
    </section>
  );
};
