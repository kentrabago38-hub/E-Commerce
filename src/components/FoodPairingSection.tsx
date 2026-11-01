import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { Utensils, ArrowRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface FoodPairingCategory {
  id: string;
  name: string;
  tagline: string;
  foodDish: string;
  recommendedWineType: string;
  recommendedWineName: string;
  recommendedWineId: string;
  winery: string;
  vintage: number;
  price: number;
  image: string;
  pairingRule: string;
  flavorTastingWhy: string;
}

const FOOD_PAIRINGS: FoodPairingCategory[] = [
  {
    id: 'steak',
    name: 'Prime Steak & Red Wine',
    tagline: 'Bold Tannins & Rich Marbling',
    foodDish: 'Dry-Aged Prime Ribeye with Rosemary Flakes & Garlic Confit',
    recommendedWineType: 'Full-Bodied Red Wine',
    recommendedWineName: 'Château Margaux Premier Grand Cru',
    recommendedWineId: 'prod-002',
    winery: 'Château Margaux',
    vintage: 2015,
    price: 36500,
    image: '/src/assets/images/luxury_food_pairing_1793457420570.jpg',
    pairingRule: 'Tannic Harmony',
    flavorTastingWhy: 'The intense, structured tannins of aged Cabernet Sauvignon bind with the protein and rendered fat of the beef, softening the palate while unlocking blackcurrant and graphite aromatics.'
  },
  {
    id: 'seafood',
    name: 'Fresh Seafood & Mineral Whites',
    tagline: 'Saline Acidity & Ocean Purity',
    foodDish: 'Pan-Seared Davao Scallops, Oyster Platter & Chilean Seabass',
    recommendedWineType: 'Crisp Mineral White',
    recommendedWineName: 'Domaine Leflaive Puligny-Montrachet',
    recommendedWineId: 'prod-003',
    winery: 'Domaine Leflaive',
    vintage: 2020,
    price: 18500,
    image: '/src/assets/images/category_white_wine_1791213207550.jpg',
    pairingRule: 'Acid & Brine Complement',
    flavorTastingWhy: 'Vibrant citrus minerality and steely acidity cut through rich seafood butter sauces, elevating sweet maritime brininess with lemon curd and crushed limestone notes.'
  },
  {
    id: 'tapas',
    name: 'Mediterranean Tapas & Dry Rosé',
    tagline: 'Provençal Herbs & Sun-Drenched Tapas',
    foodDish: 'Ibérico Bellota Jamón, Grilled Octopus & Artisan Goat Cheese',
    recommendedWineType: 'Dry Provençal Rosé',
    recommendedWineName: 'Domaines Ott Château de Selle Rosé',
    recommendedWineId: 'prod-005',
    winery: 'Domaines Ott',
    vintage: 2022,
    price: 4950,
    image: '/src/assets/images/category_red_wine_1791213197300.jpg',
    pairingRule: 'Fresh Herbaceous Lift',
    flavorTastingWhy: 'A bone-dry, pale rosé with wild strawberry and garrigue thyme lifts cured meats without overwhelming subtle delicate olive and herb seasonings.'
  },
  {
    id: 'celebrations',
    name: 'Prestige Cuvée & Celebrations',
    tagline: 'Persistent Mousse & Brioche Complexity',
    foodDish: 'Oscietra Caviar on Blinis, Truffled Gougères & Langoustines',
    recommendedWineType: 'Vintage Champagne',
    recommendedWineName: 'Dom Pérignon Vintage Brut',
    recommendedWineId: 'prod-006',
    winery: 'Moët & Chandon',
    vintage: 2013,
    price: 19800,
    image: '/src/assets/images/category_sparkling_wine_1791213218531.jpg',
    pairingRule: 'Effervescent Elegance',
    flavorTastingWhy: 'Microscopic effervescence scrubs the palate clean of rich caviar fats, while years of autolytic lees aging deliver brioche and hazelnut depth.'
  }
];

export const FoodPairingSection: React.FC = () => {
  const { products, addToCart, setQuickViewProduct, setSelectedProduct } = useWineStore();
  const [selectedPairingId, setSelectedPairingId] = useState<string>('steak');

  const currentPairing = FOOD_PAIRINGS.find((p) => p.id === selectedPairingId) || FOOD_PAIRINGS[0];
  const matchedProduct = products.find((p) => p.product_id === currentPairing.recommendedWineId) || products[0];

  return (
    <section className="py-24 bg-[#150B0E] text-[#F5EFE7] border-t border-[#351116] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#351116] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
              <Utensils className="w-3.5 h-3.5" />
              <span>Gastronomy & Sommelier Art</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
              The Art of Food & Wine Pairing
            </h2>
          </div>
          <p className="text-sm text-[#B7AAA1] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Great wine reaches its zenith at table. Discover classical pairings engineered to harmonise acids, tannins, fats, and textures.
          </p>
        </div>

        {/* Pairing Tabs (Functional Buttons) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-10">
          {FOOD_PAIRINGS.map((pairing) => {
            const isActive = pairing.id === selectedPairingId;
            return (
              <button
                key={pairing.id}
                onClick={() => setSelectedPairingId(pairing.id)}
                className={`py-3.5 px-4 rounded-xl text-left transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-[#351116] border-[#C6A15B] shadow-lg'
                    : 'bg-[#100709] border-[#2A0E13] text-[#B7AAA1] hover:text-[#F5EFE7] hover:border-[#351116]'
                }`}
              >
                <span className={`block text-xs uppercase tracking-wider font-semibold ${isActive ? 'text-[#C6A15B]' : 'text-neutral-400'}`}>
                  {pairing.name.split(' & ')[0]}
                </span>
                <span className="block text-[11px] text-[#B7AAA1] truncate mt-0.5">
                  + {pairing.recommendedWineType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Display Box */}
        <div className="rounded-2xl overflow-hidden bg-[#210D12] border border-[#351116] shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Culinary Media Showcase */}
          <div className="lg:col-span-6 relative aspect-4/3 lg:aspect-auto overflow-hidden">
            <img
              src={currentPairing.image}
              alt={currentPairing.foodDish}
              className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#210D12] via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-[#210D12]" />

            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs">
              <span className="text-[#C6A15B] uppercase tracking-wider font-semibold text-[10px] block mb-0.5">
                Gastronomic Focus
              </span>
              <p className="text-white font-medium">{currentPairing.foodDish}</p>
            </div>
          </div>

          {/* Right: Sommelier Explanation & Instant Allocation Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentPairing.pairingRule}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal mb-3">
                {currentPairing.tagline}
              </h3>

              <p className="text-sm text-[#B7AAA1] font-light leading-relaxed mb-6">
                {currentPairing.flavorTastingWhy}
              </p>

              {/* Matching Wine Allocation Card */}
              <div className="p-4 rounded-xl bg-[#130B0D] border border-[#48151F] mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-14 rounded-lg bg-[#210D12] overflow-hidden shrink-0 border border-[#351116]">
                    <img
                      src={matchedProduct.image}
                      alt={matchedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#C6A15B] uppercase tracking-wider block font-semibold">
                      Recommended Pairing Bottle
                    </span>
                    <h4 className="font-serif text-base text-[#F5EFE7] font-normal line-clamp-1">
                      {matchedProduct.name}
                    </h4>
                    <span className="font-serif text-sm text-[#C6A15B] font-medium tabular-nums">
                      {formatPeso(matchedProduct.price)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setQuickViewProduct(matchedProduct)}
                  className="p-2.5 rounded-lg bg-[#210D12] hover:bg-[#351116] text-[#C6A15B] border border-[#48151F] text-xs transition-colors shrink-0 cursor-pointer"
                  title="View Bottle Dossier"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#351116]">
              <button
                onClick={() => addToCart(matchedProduct, 1)}
                className="gold-shimmer-cta w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold tracking-wider uppercase border border-[#C6A15B]/40 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                <span>Add Pairing Wine to Bag</span>
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(matchedProduct);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="gold-shimmer-cta w-full sm:w-auto px-5 py-3.5 rounded-lg bg-transparent hover:bg-white/5 text-[#F5EFE7] text-xs font-semibold tracking-wider uppercase border border-white/20 hover:border-[#C6A15B]/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
