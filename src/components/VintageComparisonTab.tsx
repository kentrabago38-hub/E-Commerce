import React, { useState } from 'react';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  Info,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface VintageComparisonTabProps {
  product: Product;
}

interface VintageDataPoint {
  year: number;
  price: number;
  rating: number;
  score100: number;
  condition: string;
  drinkingWindow: string;
  isCurrent: boolean;
  appreciation: string;
}

export const VintageComparisonTab: React.FC<VintageComparisonTabProps> = ({ product }) => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'price' | 'rating'>('both');
  const [selectedVintageYear, setSelectedVintageYear] = useState<number>(product.vintage);

  // Generate realistic historical vintage trajectory based on the selected wine's vintage & price
  const baseVintage = product.vintage;
  const basePrice = product.price;
  const baseRating = product.rating;

  const vintageHistory: VintageDataPoint[] = [-3, -2, -1, 0, 1, 2].map((offset) => {
    const yr = baseVintage + offset;
    const isCurrent = offset === 0;

    // Older vintages typically appreciate due to scarcity and cellaring maturity
    // Price multiplier based on age and vintage variation
    const ageBonus = -offset * 0.08; // older bottles +8% per year
    const variation = Math.sin(yr * 2.5) * 0.06;
    const computedPrice = Math.round((basePrice * (1 + ageBonus + variation)) / 100) * 100;

    // Rating variation (between 4.4 and 5.0)
    const ratingVariation = Math.cos(yr * 1.7) * 0.18;
    const computedRating = Math.min(5.0, Math.max(4.2, +(baseRating + (isCurrent ? 0 : ratingVariation)).toFixed(1)));
    const computedScore100 = Math.round(computedRating * 20 - 1 + Math.random() * 2);

    const conditions = [
      'Exceptional solar exposure; dense anthocyanins & velvety tannins.',
      'Classic temperate growing season with crystalline acidity.',
      'Dry autumn harvest; remarkable aromatic depth and purity.',
      'Generous summer with record harvest concentration.',
      'Cool spring followed by optimal late maturation.',
      'Prestige benchmark vintage with exceptional aging endurance.'
    ];

    const windows = [
      'Peak Maturity — Ready to Enjoy',
      'Approaching Prime — Decant 45 mins',
      'Prime Window — Superb Structure',
      'Cellar Aging — Peak in 2028–2035',
      'Youthful & Vibrant — Hold or Aerate',
      'Long-Term Cellar — Maturing Gracefully'
    ];

    return {
      year: yr,
      price: isCurrent ? basePrice : computedPrice,
      rating: isCurrent ? baseRating : computedRating,
      score100: isCurrent ? Math.min(99, Math.round(baseRating * 19.5)) : computedScore100,
      condition: conditions[Math.abs((yr * 7) % conditions.length)],
      drinkingWindow: windows[Math.abs((yr * 3) % windows.length)],
      isCurrent,
      appreciation: offset < 0 ? `+${Math.round(Math.abs(offset) * 12 + 4)}%` : offset === 0 ? 'Current Base' : `-${Math.round(offset * 6)}%`
    };
  });

  const activeVintageData = vintageHistory.find((v) => v.year === selectedVintageYear) || vintageHistory[3];

  return (
    <div className="space-y-10">
      {/* Header Explainer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#351116] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terroir & Harvest Chronology</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal">
            Multi-Vintage Valuation & Sommelier Score Trends
          </h3>
          <p className="text-xs sm:text-sm text-[#B7AAA1] font-light mt-1 max-w-2xl leading-relaxed">
            Compare harvest conditions, international critic scores, and secondary market valuations across recent vintages for {product.winery}’s {product.name}.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#130B0D] border border-[#48151F] shrink-0">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all cursor-pointer ${
              activeMetric === 'both'
                ? 'bg-[#861F32] text-white shadow-sm'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveMetric('price')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all cursor-pointer ${
              activeMetric === 'price'
                ? 'bg-[#861F32] text-white shadow-sm'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Valuation (₱)
          </button>
          <button
            onClick={() => setActiveMetric('rating')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all cursor-pointer ${
              activeMetric === 'rating'
                ? 'bg-[#861F32] text-white shadow-sm'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Ratings
          </button>
        </div>
      </div>

      {/* Main Interactive Recharts Graph */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#18090C] to-[#12070A] border border-[#351116] shadow-2xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4 text-xs">
            {(activeMetric === 'both' || activeMetric === 'price') && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#C6A15B]" />
                <span className="text-[#F5EFE7] font-medium">Estimated Bottle Valuation (PHP ₱)</span>
              </div>
            )}
            {(activeMetric === 'both' || activeMetric === 'rating') && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E57373]" />
                <span className="text-[#F5EFE7] font-medium">Sommelier Rating (0 – 5.0 ★)</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#B7AAA1] uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Interactive: Click dots to inspect vintage</span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={vintageHistory}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const clickedYear = e.activePayload[0].payload.year;
                  if (typeof clickedYear === 'number') {
                    setSelectedVintageYear(clickedYear);
                  }
                }
              }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C6A15B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C6A15B" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#351116" strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="year"
                stroke="#B7AAA1"
                tick={{ fill: '#B7AAA1', fontSize: 12, fontFamily: 'serif' }}
                tickLine={{ stroke: '#351116' }}
              />

              {/* Left Y Axis for Price */}
              <YAxis
                yAxisId="priceAxis"
                orientation="left"
                stroke="#C6A15B"
                domain={['dataMin - 3000', 'dataMax + 3000']}
                tickFormatter={(val: number) => `₱${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#C6A15B', fontSize: 11 }}
                tickLine={{ stroke: '#351116' }}
                hide={activeMetric === 'rating'}
              />

              {/* Right Y Axis for Rating */}
              <YAxis
                yAxisId="ratingAxis"
                orientation="right"
                stroke="#E57373"
                domain={[3.8, 5.0]}
                tickFormatter={(val: number) => `${val.toFixed(1)}★`}
                tick={{ fill: '#E57373', fontSize: 11 }}
                tickLine={{ stroke: '#351116' }}
                hide={activeMetric === 'price'}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as VintageDataPoint;
                    return (
                      <div className="p-4 rounded-xl bg-[#0D0709]/95 border border-[#C6A15B]/50 shadow-2xl backdrop-blur-md text-xs min-w-[200px]">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#351116]">
                          <span className="font-serif text-base text-[#F5EFE7] font-semibold">
                            Vintage {data.year}
                          </span>
                          {data.isCurrent && (
                            <span className="px-2 py-0.5 rounded bg-[#861F32] text-white text-[10px] font-bold uppercase tracking-wider">
                              Current Bottle
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-neutral-300">
                          <div className="flex items-center justify-between">
                            <span className="text-[#B7AAA1]">Est. Valuation:</span>
                            <span className="font-serif text-sm font-semibold text-[#C6A15B]">
                              {formatPeso(data.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#B7AAA1]">Sommelier Rating:</span>
                            <span className="font-semibold text-rose-300">
                              {data.rating.toFixed(1)} / 5.0 ({data.score100} pts)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#B7AAA1]">Appreciation:</span>
                            <span className="text-emerald-400 font-medium">
                              {data.appreciation}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#351116] text-[11px] text-[#B7AAA1] font-serif italic">
                          "{data.condition}"
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Price Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'price') && (
                <Area
                  yAxisId="priceAxis"
                  type="monotone"
                  dataKey="price"
                  name="Valuation (₱)"
                  stroke="#C6A15B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                  activeDot={{ r: 6, fill: '#F5EFE7', stroke: '#C6A15B', strokeWidth: 2 }}
                />
              )}

              {/* Rating Line */}
              {(activeMetric === 'both' || activeMetric === 'rating') && (
                <Line
                  yAxisId="ratingAxis"
                  type="monotone"
                  dataKey="rating"
                  name="Rating"
                  stroke="#E57373"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#E57373' }}
                  activeDot={{ r: 7, fill: '#861F32', stroke: '#E57373', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Vintage Detail Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#140b0f] border border-[#2b151f] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2b151f] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#210D12] border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-2xl text-[#F5EFE7]">
                  Vintage {activeVintageData.year} Dossier
                </h4>
                {activeVintageData.isCurrent && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#861F32] border border-[#C6A15B]/40 text-[10px] uppercase font-bold text-white tracking-wider">
                    Viewing Selected Bottle
                  </span>
                )}
              </div>
              <p className="text-xs text-[#B7AAA1]">
                Harvest analysis and maturation status for {product.region}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">
                Historical Valuation
              </span>
              <span className="font-serif text-2xl text-[#C6A15B] font-normal tabular-nums">
                {formatPeso(activeVintageData.price)}
              </span>
            </div>
            <div className="pl-4 border-l border-[#2b151f]">
              <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">
                Critic Index
              </span>
              <span className="text-xl text-[#F5EFE7] font-semibold">
                {activeVintageData.score100} / 100
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#1d0e14] border border-[#3b1724]">
            <div className="flex items-center gap-2 text-[#C6A15B] font-semibold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vintage Climate Profile</span>
            </div>
            <p className="text-neutral-300 font-light leading-relaxed">
              {activeVintageData.condition}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1d0e14] border border-[#3b1724]">
            <div className="flex items-center gap-2 text-[#C6A15B] font-semibold uppercase tracking-wider mb-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Cellar Longevity Window</span>
            </div>
            <p className="text-neutral-300 font-light leading-relaxed">
              {activeVintageData.drinkingWindow}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1d0e14] border border-[#3b1724]">
            <div className="flex items-center gap-2 text-[#C6A15B] font-semibold uppercase tracking-wider mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market Appreciation</span>
            </div>
            <p className="text-emerald-400 font-medium leading-relaxed">
              {activeVintageData.appreciation} estimated secondary market growth compared to vintage release.
            </p>
          </div>
        </div>

        {/* Vintage Selector Pills */}
        <div className="mt-8 pt-6 border-t border-[#2b151f] flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs uppercase tracking-wider text-[#B7AAA1] font-medium">
            Jump to vintage dossier:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {vintageHistory.map((item) => (
              <button
                key={item.year}
                onClick={() => setSelectedVintageYear(item.year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedVintageYear === item.year
                    ? 'bg-[#C6A15B] text-[#130B0D] shadow-md font-bold'
                    : 'bg-[#210D12] text-[#B7AAA1] hover:text-[#F5EFE7] border border-[#351116] hover:border-[#C6A15B]/50'
                }`}
              >
                {item.year} {item.isCurrent ? '★' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
