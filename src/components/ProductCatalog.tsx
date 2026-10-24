import React, { useState, useMemo, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { ProductCard } from './ProductCard';
import { Product, WineType, SweetnessLevel, WineBody } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check
} from 'lucide-react';

interface ProductCatalogProps {
  initialTypeFilter?: WineType | 'Collections' | null;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialTypeFilter }) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    setSelectedProduct
  } = useWineStore();

  // Filters state
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter || 'all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGrape, setSelectedGrape] = useState<string>('all');
  const [selectedVintage, setSelectedVintage] = useState<string>('all');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('all');
  const [selectedBody, setSelectedBody] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync initial type filter if changed via navigation
  useEffect(() => {
    if (initialTypeFilter) {
      if (initialTypeFilter === 'Collections') {
        setSelectedType('all');
      } else {
        setSelectedType(initialTypeFilter);
      }
    }
  }, [initialTypeFilter]);

  // Dynamic filter options extracted from catalog
  const countries = useMemo(() => Array.from(new Set(products.map((p) => p.country))).sort(), [products]);
  const regions = useMemo(() => Array.from(new Set(products.map((p) => p.region))).sort(), [products]);
  const grapes = useMemo(() => Array.from(new Set(products.map((p) => p.grape_variety))).sort(), [products]);
  const vintages = useMemo(() => Array.from(new Set(products.map((p) => p.vintage))).sort((a, b) => b - a), [products]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCountry('all');
    setSelectedRegion('all');
    setSelectedGrape('all');
    setSelectedVintage('all');
    setSelectedSweetness('all');
    setSelectedBody('all');
    setMinRating(0);
    setPriceRange(25000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (selectedRegion !== 'all') count++;
    if (selectedGrape !== 'all') count++;
    if (selectedVintage !== 'all') count++;
    if (selectedSweetness !== 'all') count++;
    if (selectedBody !== 'all') count++;
    if (minRating > 0) count++;
    if (priceRange < 25000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedType,
    selectedCountry,
    selectedRegion,
    selectedGrape,
    selectedVintage,
    selectedSweetness,
    selectedBody,
    minRating,
    priceRange,
    searchQuery
  ]);

  // Filter & Sort evaluation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchWinery = p.winery.toLowerCase().includes(q);
          const matchGrape = p.grape_variety.toLowerCase().includes(q);
          const matchRegion = p.region.toLowerCase().includes(q);
          const matchCountry = p.country.toLowerCase().includes(q);
          if (!matchName && !matchWinery && !matchGrape && !matchRegion && !matchCountry) {
            return false;
          }
        }

        // Wine Type
        if (selectedType !== 'all') {
          if (p.wine_type.toLowerCase() !== selectedType.toLowerCase()) return false;
        }

        // Country
        if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;

        // Region
        if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;

        // Grape
        if (selectedGrape !== 'all' && p.grape_variety !== selectedGrape) return false;

        // Vintage
        if (selectedVintage !== 'all' && p.vintage.toString() !== selectedVintage) return false;

        // Sweetness
        if (selectedSweetness !== 'all' && p.sweetness !== selectedSweetness) return false;

        // Body
        if (selectedBody !== 'all' && p.body !== selectedBody) return false;

        // Min Rating
        if (minRating > 0 && p.rating < minRating) return false;

        // Price
        if (p.price > priceRange) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.vintage - a.vintage;
        // Default: featured or rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [
    products,
    searchQuery,
    selectedType,
    selectedCountry,
    selectedRegion,
    selectedGrape,
    selectedVintage,
    selectedSweetness,
    selectedBody,
    minRating,
    priceRange,
    sortBy
  ]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#F5EFE7]">
      {/* Catalog Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#48151F]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
            The Cellar Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5EFE7] font-normal">
            {selectedType !== 'all' ? `${selectedType} Wines` : 'All Exceptional Wines'}
          </h1>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md mt-2 md:mt-0 font-light">
          Showing <span className="text-[#C6A15B] font-semibold tabular-nums">{filteredProducts.length}</span> verified vintage bottles in our temperature-controlled cellar.
        </p>
      </div>

      {/* Control Bar: Search summary, Mobile Filter trigger, and Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#130B0D] p-4 rounded-xl border border-[#48151F]">
        {/* Left: Mobile trigger & active count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden py-2 px-4 rounded-lg bg-[#48151F] hover:bg-[#861F32] text-[#F5EFE7] text-xs font-semibold uppercase tracking-wider border border-[#C6A15B]/35 flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#B7AAA1] hover:text-[#F5EFE7] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span className="text-xs text-[#B7AAA1] uppercase tracking-wider font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1.5 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#C6A15B] font-medium focus:outline-none focus:border-[#C6A15B] cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Vintage</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop and Mobile Drawer) */}
        <aside
          className={`${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-[#130B0D] p-6 overflow-y-auto block'
              : 'hidden lg:block'
          } lg:relative lg:p-0 lg:bg-transparent lg:overflow-visible`}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#48151F] lg:hidden">
            <span className="font-serif text-2xl text-[#F5EFE7]">Filter Terroirs</span>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 rounded bg-white/5 text-[#B7AAA1] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 bg-[#130B0D] p-5 rounded-xl border border-[#48151F]">
            {/* Filter: Wine Type */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2.5">
                Wine Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Red', 'White', 'Rosé', 'Sparkling'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedType.toLowerCase() === type.toLowerCase()
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-[#210D12] text-[#B7AAA1] hover:bg-[#48151F] border border-[#48151F]'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold">
                  Max Price
                </label>
                <span className="text-xs font-semibold text-[#F5EFE7] tabular-nums">{formatPeso(priceRange)}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="25000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#861F32] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#B7AAA1] mt-1">
                <span>₱1,500</span>
                <span>₱25,000+</span>
              </div>
            </div>

            {/* Filter: Country */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filter: Region */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2">
                Region / Terroir
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Filter: Grape Variety */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2">
                Grape Variety
              </label>
              <select
                value={selectedGrape}
                onChange={(e) => setSelectedGrape(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                <option value="all">All Varieties</option>
                {grapes.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Filter: Vintage */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2">
                Vintage Year
              </label>
              <select
                value={selectedVintage}
                onChange={(e) => setSelectedVintage(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                <option value="all">All Vintages</option>
                {vintages.map((v) => (
                  <option key={v} value={v.toString()}>{v}</option>
                ))}
              </select>
            </div>

            {/* Filter: Sweetness */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2.5">
                Sweetness Level
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'Bone Dry', 'Dry', 'Semi-Dry', 'Sweet'].map((sweetness) => (
                  <button
                    key={sweetness}
                    onClick={() => setSelectedSweetness(sweetness)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer ${
                      selectedSweetness === sweetness
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-[#210D12] text-[#B7AAA1] hover:bg-[#48151F] border border-[#48151F]'
                    }`}
                  >
                    {sweetness === 'all' ? 'Any' : sweetness}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Body */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2.5">
                Wine Body
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'Light', 'Medium', 'Full'].map((body) => (
                  <button
                    key={body}
                    onClick={() => setSelectedBody(body)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer ${
                      selectedBody === body
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-[#210D12] text-[#B7AAA1] hover:bg-[#48151F] border border-[#48151F]'
                    }`}
                  >
                    {body === 'all' ? 'All' : body}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Rating */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block mb-2.5">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      minRating === rating
                        ? 'bg-[#861F32] text-white border border-[#C6A15B]'
                        : 'bg-[#210D12] text-[#B7AAA1] hover:bg-[#48151F] border border-[#48151F]'
                    }`}
                  >
                    {rating === 0 ? 'All' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile apply button */}
            <div className="pt-4 lg:hidden">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-lg bg-[#861F32] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Apply Filters ({filteredProducts.length} Wines)
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-[#140c10] border border-[#2b151f] p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#271219] flex items-center justify-center border border-[#d4af37]/30 text-[#dfbe76]">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">No Wines Matched Your Search</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6 font-light">
                Try loosening your filter criteria or clearing the search query to view our full cellared collection.
              </p>
              <button
                onClick={resetFilters}
                className="py-2.5 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
