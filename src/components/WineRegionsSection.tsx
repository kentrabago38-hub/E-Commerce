import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { Compass, ArrowRight, MapPin, Globe, Sparkles, Wine, Eye } from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

interface WineRegion {
  id: string;
  name: string;
  country: string;
  flag: string;
  appellation: string;
  description: string;
  signatureGrapes: string[];
  climate: string;
  soil: string;
  image: string;
  featuredWineId: string;
  featuredWineName: string;
  featuredWineImage: string;
  featuredWinePrice: number;
  mapCoords: { x: number; y: number }; // Percentage for interactive map nodes
  searchFilter: string;
}

const WINE_REGIONS: WineRegion[] = [
  {
    id: 'france',
    name: 'France',
    country: 'Bordeaux & Burgundy',
    flag: 'FR',
    appellation: 'Pauillac & Côte de Nuits AOC',
    description: 'The historic cradle of fine wine. Gravelly Left Bank terroir produces structured, age-worthy Cabernet blends, while Jurassic limestone slopes in Burgundy nurture ethereal Pinot Noir and Chardonnay.',
    signatureGrapes: ['Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay', 'Merlot'],
    climate: 'Temperate Maritime & Semi-Continental',
    soil: 'Deep Gunzian gravels and Kimmeridgian limestone',
    image: '/images/region_bordeaux_chateau.jpg',
    featuredWineId: 'prod-001',
    featuredWineName: 'Château Lumière Grand Cru Pauillac',
    featuredWineImage: '/images/product_chateau_lumiere_cabernet.jpg',
    featuredWinePrice: 4850,
    mapCoords: { x: 48, y: 32 },
    searchFilter: 'France'
  },
  {
    id: 'italy',
    name: 'Italy',
    country: 'Tuscany & Piedmont',
    flag: 'IT',
    appellation: 'Brunello di Montalcino & Barolo DOCG',
    description: 'Sun-drenched hills where Sangiovese achieves monumental depth with dried cherry, tobacco, and leather notes, alongside Piedmont’s foggy Langhe hills yielding translucent garnet Nebbiolo.',
    signatureGrapes: ['Sangiovese Grosso', 'Nebbiolo', 'Barbera'],
    climate: 'Warm Mediterranean with cool Apennine thermal shifts',
    soil: 'Galestro, Alberese limestone, and Tortonian blue marls',
    image: '/images/region_tuscany_hills.jpg',
    featuredWineId: 'prod-004',
    featuredWineName: 'San Pietro Brunello di Montalcino Riserva',
    featuredWineImage: '/images/product_san_pietro_brunello.jpg',
    featuredWinePrice: 6200,
    mapCoords: { x: 53, y: 36 },
    searchFilter: 'Italy'
  },
  {
    id: 'spain',
    name: 'Spain',
    country: 'Rioja & Priorat',
    flag: 'ES',
    appellation: 'DOCa Rioja Alta & Alavesa',
    description: 'Centuries of barrel-aging tradition in American and French oak casks. Velvety Tempranillo reservas balance ripe dark plum, toasted cedar, roasted vanilla, and balsamic freshness.',
    signatureGrapes: ['Tempranillo', 'Garnacha', 'Graciano'],
    climate: 'Continental-Atlantic transitional climate',
    soil: 'Calcareous clay and alluvial iron-rich silt',
    image: '/images/region_rioja_spain.jpg',
    featuredWineId: 'prod-007',
    featuredWineName: 'Bodega Solaria Rioja Gran Reserva',
    featuredWineImage: '/images/product_bodega_solaria_rioja.jpg',
    featuredWinePrice: 3850,
    mapCoords: { x: 44, y: 38 },
    searchFilter: 'Spain'
  },
  {
    id: 'usa',
    name: 'United States',
    country: 'Napa Valley & Sonoma',
    flag: 'US',
    appellation: 'Oakville & Rutherford AVA',
    description: 'Iconic California sunshine meets cooling Pacific marine fogs. Bold, plush Cabernets with creme de cassis, dark cocoa, graphite, and supple fine-grained tannins.',
    signatureGrapes: ['Cabernet Sauvignon', 'Chardonnay', 'Zinfandel'],
    climate: 'Mediterranean with morning marine inversion layers',
    soil: 'Volcanic benchlands and Rutherford alluvial dust',
    image: '/images/region_napa_valley.jpg',
    featuredWineId: 'prod-009',
    featuredWineName: 'St. Helena Reserve Napa Valley Cabernet',
    featuredWineImage: '/images/product_st_helena_napa_cabernet.jpg',
    featuredWinePrice: 7900,
    mapCoords: { x: 22, y: 35 },
    searchFilter: 'United States'
  },
  {
    id: 'australia',
    name: 'Australia',
    country: 'Barossa Valley & Eden Valley',
    flag: 'AU',
    appellation: 'South Australia GI',
    description: 'Home to some of the planet’s oldest ungrafted Shiraz and Grenache vines. Powerhouse concentration of blackberry liqueur, espresso, dark chocolate, and savoury peppercorn.',
    signatureGrapes: ['Shiraz', 'Cabernet Sauvignon', 'Riesling'],
    climate: 'Warm Mediterranean with cool diurnal altitude',
    soil: 'Ironstone, red-brown earth, and ancient weathered quartz',
    image: '/images/region_marlborough_nz.jpg',
    featuredWineId: 'prod-008',
    featuredWineName: 'Cloud Valley Sauvignon Blanc (Australasia)',
    featuredWineImage: '/images/product_cloud_valley_sauvignon.jpg',
    featuredWinePrice: 2250,
    mapCoords: { x: 82, y: 72 },
    searchFilter: 'Australia'
  },
  {
    id: 'philippines',
    name: 'Philippines',
    country: 'Davao Private Cellars',
    flag: 'PH',
    appellation: 'VÍNEA Subterranean Vaults',
    description: 'Specialized tropical cellaring perfection. Five private temperature-controlled vaults in Davao operating at continuous 13°C, safeguarding prestigious allocations from world terroirs for local collectors.',
    signatureGrapes: ['Imported Grand Cru Allocations', 'Curated Global Vintages'],
    climate: 'Subterranean constant 13°C / 65% Humidity preservation',
    soil: 'Climate-monitored volcanic cellars & bespoke lockers',
    image: '/images/davao_wine_cellar_1793457420629.jpg',
    featuredWineId: 'prod-012',
    featuredWineName: 'Grand Terroirs Sommelier Vault Allocation',
    featuredWineImage: '/images/product_grand_terroirs_gift_box.jpg',
    featuredWinePrice: 18500,
    mapCoords: { x: 78, y: 52 },
    searchFilter: 'Davao'
  }
];

export const WineRegionsSection: React.FC = () => {
  const { setActiveTab, setSearchQuery, setSelectedProduct, products, addToCart } = useWineStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('france');

  const activeRegion = WINE_REGIONS.find((r) => r.id === selectedRegionId) || WINE_REGIONS[0];

  const handleExploreRegion = (region: WineRegion) => {
    setSelectedProduct(null);
    setSearchQuery(region.searchFilter);
    setActiveTab('shop');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleInspectFeaturedWine = () => {
    const prod = products.find((p) => p.product_id === activeRegion.featuredWineId) || products[0];
    if (prod) {
      setSelectedProduct(prod);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddFeaturedToCart = () => {
    const prod = products.find((p) => p.product_id === activeRegion.featuredWineId) || products[0];
    if (prod) {
      addToCart(prod, 1);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#351116]/80">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Terroir & Origins</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Explore the Origins
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#B7AAA1] max-w-md font-light leading-relaxed">
          Hover or select a winemaking realm to unveil its distinct geology, mesoclimate, and flagship allocation.
        </p>
      </div>

      {/* Interactive Region Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {WINE_REGIONS.map((region) => {
          const isActive = region.id === selectedRegionId;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => setSelectedRegionId(region.id)}
              className={`px-5 py-3 rounded-xl text-xs tracking-wider uppercase font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#861F32] text-white border-[#C6A15B] shadow-lg shadow-[#861F32]/30 scale-[1.02]'
                  : 'bg-[#18090C] text-[#B7AAA1] hover:text-[#F5EFE7] border-[#351116] hover:border-[#C6A15B]/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Terroir Card with Live Bottle Sync */}
      <div className="relative rounded-3xl overflow-hidden bg-[#18090C] border border-[#351116] shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left: Atmospheric Vineyard Landscape with Interactive Map Overlay */}
        <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full overflow-hidden group">
          <img
            src={getWineImageUrl(activeRegion.image)}
            alt={`${activeRegion.name} Vineyards`}
            onError={handleImageError}
            className="w-full h-full object-cover object-center scale-100 group-hover:scale-104 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18090C] via-black/40 to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-[#18090C]" />

          {/* Top Location Pill */}
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-[#130B0D]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#C6A15B]/30 text-xs text-[#C6A15B]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold">{activeRegion.appellation}</span>
          </div>

          {/* Interactive Coordinates Grid Overlay */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] text-[#B7AAA1] bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="font-mono text-[#C6A15B]">TERROIR LOG: {activeRegion.name.toUpperCase()}</span>
            <span>Soil: {activeRegion.soil}</span>
          </div>
        </div>

        {/* Right: Editorial Narrative + Live Bottle Showcase */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2">
              <span>{activeRegion.country}</span>
              <span>·</span>
              <span>Protected Appellation</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3">
              {activeRegion.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed mb-6">
              {activeRegion.description}
            </p>

            {/* Terroir & Climate Specs */}
            <div className="space-y-2.5 pt-4 border-t border-[#351116] text-xs">
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

          {/* Live Bottle Showcase from Region */}
          <div className="p-4 rounded-2xl bg-[#130B0D] border border-[#351116] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={getWineImageUrl(activeRegion.featuredWineImage)}
                alt={activeRegion.featuredWineName}
                onError={handleImageError}
                className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-[#351116] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold block">
                  Featured Terroir Bottle
                </span>
                <h4
                  onClick={handleInspectFeaturedWine}
                  className="font-serif text-sm text-[#F5EFE7] font-normal truncate hover:text-[#C6A15B] cursor-pointer"
                >
                  {activeRegion.featuredWineName}
                </h4>
                <span className="text-xs text-[#C6A15B] tabular-nums font-serif">
                  ₱{activeRegion.featuredWinePrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAddFeaturedToCart}
                className="py-1.5 px-3 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-[11px] uppercase tracking-wider font-semibold border border-[#C6A15B]/30 cursor-pointer transition-colors"
                title="Add to Cart"
                data-cursor="add"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleInspectFeaturedWine}
                className="p-1.5 rounded-lg border border-[#351116] hover:border-[#C6A15B] text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer"
                title="Inspect Vintage"
                data-cursor="view"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action to Filter by Region */}
          <button
            type="button"
            onClick={() => handleExploreRegion(activeRegion)}
            className="gold-shimmer-cta w-full py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Explore All {activeRegion.name} Allocations</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>
        </div>
      </div>
    </section>
  );
};
