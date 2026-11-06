import React, { useState } from 'react';
import { Product } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Info,
  Clock
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate realistic historical vintage trajectory based on the selected wine's vintage & price
  const baseVintage = product.vintage;
  const basePrice = product.price;

  const vintageHistory: VintageDataPoint[] = [-3, -2, -1, 0, 1, 2].map((offset) => {
    const yr = baseVintage + offset;
    const isCurrent = offset === 0;

    // Older vintages typically appreciate due to scarcity and cellaring maturity
    const ageBonus = -offset * 0.08;
    const variation = Math.sin(yr * 2.5) * 0.06;
    const computedPrice = Math.round((basePrice * (1 + ageBonus + variation)) / 100) * 100;

    // Rating variation (between 4.4 and 5.0)
    const ratingVariation = Math.cos(yr * 1.7) * 0.18;
    const computedRating = Math.min(5.0, Math.max(4.2, +(4.7 + ratingVariation).toFixed(1)));
    const score100 = Math.round(computedRating * 20);

    const conditions = [
      'Exceptional dry summer with concentrated phenolic maturity; low yields of extraordinary concentration.',
      'Classic balanced vintage with cool harvest nights; crystalline acid structure and intense aromatics.',
      'Record warmth yielding voluptuous velvety tannins and deep midnight-garnet fruit extraction.',
      'Pristine terroir expression with ideal rainfall distribution and seamless cellaring equilibrium.',
      'Vibrant energetic vintage marked by fresh savory herb nuances, taut minerality, and vibrant acidity.',
      'Historic benchmark vintage recognized by international cellar masters for 30+ year longevity.'
    ];

    const windows = [
      'Ready now · Optimal through 2038',
      'Peak maturity · Drink through 2035',
      'Approaching prime window · Best 2026–2040',
      'Youthful vigor · Decant 1h · Cellar through 2045',
      'Cellar aging phase · Prime window 2028–2048',
      'Collector release · Immense structure · 2030–2055'
    ];

    const idx = Math.abs((yr * 3) % conditions.length);
    const appreciationPct = Math.round((computedPrice / basePrice - 1) * 100);
    const appreciationStr = appreciationPct >= 0 ? `+${appreciationPct}%` : `${appreciationPct}%`;

    return {
      year: yr,
      price: computedPrice,
      rating: computedRating,
      score100,
      condition: conditions[idx],
      drinkingWindow: windows[idx],
      isCurrent,
      appreciation: appreciationStr
    };
  });

  const activeVintageData =
    vintageHistory.find((v) => v.year === selectedVintageYear) || vintageHistory[3];

  // SVG Chart Geometry
  const svgWidth = 800;
  const svgHeight = 320;
  const padLeft = 70;
  const padRight = 70;
  const padTop = 30;
  const padBottom = 50;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const minPrice = Math.min(...vintageHistory.map((d) => d.price)) * 0.92;
  const maxPrice = Math.max(...vintageHistory.map((d) => d.price)) * 1.08;

  const minRating = 4.0;
  const maxRating = 5.0;

  const points = vintageHistory.map((d, i) => {
    const x = padLeft + (i / (vintageHistory.length - 1)) * chartW;
    const yPrice = padTop + (1 - (d.price - minPrice) / (maxPrice - minPrice)) * chartH;
    const yRating = padTop + (1 - (d.rating - minRating) / (maxRating - minRating)) * chartH;
    return { ...d, x, yPrice, yRating };
  });

  // SVG Path Generator for Price
  const pricePathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.yPrice}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.yPrice}, ${cpX2} ${pt.yPrice}, ${pt.x} ${pt.yPrice}`;
  }, '');

  const priceAreaD = `${pricePathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  // SVG Path Generator for Rating
  const ratingPathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.yRating}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.yRating}, ${cpX2} ${pt.yRating}, ${pt.x} ${pt.yRating}`;
  }, '');

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Metric Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#351116]">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#F5EFE7] flex items-center gap-2">
            <span>Vintage Trajectory & Appreciation</span>
            <span className="text-xs font-sans uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C6A15B]/15 text-[#C6A15B] border border-[#C6A15B]/30 font-semibold">
              Terroir Index
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-[#B7AAA1] mt-1 font-light">
            Historical pricing trajectory and sommelier critic scores across consecutive harvests of {product.name}.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#14070A] border border-[#351116] self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all cursor-pointer ${
              activeMetric === 'both'
                ? 'bg-[#C6A15B] text-[#130B0D] shadow-sm font-bold'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            All Indices
          </button>
          <button
            onClick={() => setActiveMetric('price')}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all cursor-pointer ${
              activeMetric === 'price'
                ? 'bg-[#C6A15B] text-[#130B0D] shadow-sm font-bold'
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

      {/* Main Interactive SVG Graph */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#18090C] to-[#12070A] border border-[#351116] shadow-2xl relative">
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
            <span>Interactive: Hover or click points to inspect vintage</span>
          </div>
        </div>

        {/* Pure SVG Responsive Chart Container */}
        <div className="w-full relative overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto select-none overflow-visible"
            style={{ minHeight: '260px' }}
          >
            <defs>
              <linearGradient id="vintagePriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6A15B" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#C6A15B" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#C6A15B" stopOpacity={0.0} />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C6A15B" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padTop + pct * chartH;
              const priceVal = Math.round(maxPrice - pct * (maxPrice - minPrice));
              const ratingVal = (maxRating - pct * (maxRating - minRating)).toFixed(1);
              return (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#351116"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  {(activeMetric === 'both' || activeMetric === 'price') && (
                    <text
                      x={padLeft - 10}
                      y={y + 4}
                      fill="#C6A15B"
                      fontSize={10}
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      ₱{(priceVal / 1000).toFixed(0)}k
                    </text>
                  )}
                  {(activeMetric === 'both' || activeMetric === 'rating') && (
                    <text
                      x={svgWidth - padRight + 10}
                      y={y + 4}
                      fill="#E57373"
                      fontSize={10}
                      textAnchor="start"
                      fontFamily="monospace"
                    >
                      {ratingVal}★
                    </text>
                  )}
                </g>
              );
            })}

            {/* Price Area & Line */}
            {(activeMetric === 'both' || activeMetric === 'price') && (
              <>
                <path d={priceAreaD} fill="url(#vintagePriceGradient)" />
                <path
                  d={pricePathD}
                  fill="none"
                  stroke="#C6A15B"
                  strokeWidth={3}
                  filter="url(#goldGlow)"
                />
              </>
            )}

            {/* Rating Line */}
            {(activeMetric === 'both' || activeMetric === 'rating') && (
              <path
                d={ratingPathD}
                fill="none"
                stroke="#E57373"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}

            {/* Data Points and Column Hit Areas */}
            {points.map((pt, i) => {
              const isSelected = selectedVintageYear === pt.year;
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={pt.year}
                  className="cursor-pointer"
                  onClick={() => setSelectedVintageYear(pt.year)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible hit column */}
                  <rect
                    x={pt.x - chartW / 12}
                    y={padTop}
                    width={chartW / 6}
                    height={chartH}
                    fill="transparent"
                  />

                  {/* Vertical Guideline on hover/selection */}
                  {(isSelected || isHovered) && (
                    <line
                      x1={pt.x}
                      y1={padTop}
                      x2={pt.x}
                      y2={padTop + chartH}
                      stroke="#C6A15B"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      opacity={0.8}
                    />
                  )}

                  {/* Price Circle */}
                  {(activeMetric === 'both' || activeMetric === 'price') && (
                    <g>
                      <circle
                        cx={pt.x}
                        cy={pt.yPrice}
                        r={isSelected ? 7 : isHovered ? 6 : 4.5}
                        fill={isSelected ? '#F5EFE7' : '#130B0D'}
                        stroke="#C6A15B"
                        strokeWidth={isSelected ? 3 : 2}
                        filter={isSelected ? 'url(#goldGlow)' : undefined}
                      />
                    </g>
                  )}

                  {/* Rating Circle */}
                  {(activeMetric === 'both' || activeMetric === 'rating') && (
                    <g>
                      <circle
                        cx={pt.x}
                        cy={pt.yRating}
                        r={isSelected ? 5.5 : 3.5}
                        fill="#E57373"
                        stroke="#130B0D"
                        strokeWidth={1.5}
                      />
                    </g>
                  )}

                  {/* X Axis Vintage Year Labels */}
                  <text
                    x={pt.x}
                    y={padTop + chartH + 24}
                    fill={isSelected ? '#C6A15B' : '#B7AAA1'}
                    fontSize={isSelected ? 13 : 11}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    fontFamily="serif"
                  >
                    {pt.year}
                  </text>

                  {/* Badge for Current Bottle */}
                  {pt.isCurrent && (
                    <text
                      x={pt.x}
                      y={padTop + chartH + 40}
                      fill="#861F32"
                      fontSize={8}
                      fontWeight="bold"
                      textAnchor="middle"
                      className="uppercase tracking-widest"
                    >
                      CURRENT
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {activePoint && (
            <div
              className="absolute pointer-events-none p-3.5 rounded-xl bg-[#0D0709]/95 border border-[#C6A15B]/60 shadow-2xl backdrop-blur-md text-xs min-w-[190px] z-30 transition-all duration-150"
              style={{
                left: `clamp(10px, ${(activePoint.x / svgWidth) * 100}%, calc(100% - 210px))`,
                top: '10px'
              }}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#351116]">
                <span className="font-serif text-sm text-[#F5EFE7] font-semibold">
                  Vintage {activePoint.year}
                </span>
                {activePoint.isCurrent && (
                  <span className="px-1.5 py-0.5 rounded bg-[#861F32] text-white text-[9px] font-bold uppercase">
                    Current
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#B7AAA1]">Est. Value:</span>
                  <span className="font-serif font-semibold text-[#C6A15B]">
                    {formatPeso(activePoint.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B7AAA1]">Critic Score:</span>
                  <span className="font-semibold text-rose-300">
                    {activePoint.rating.toFixed(1)} ★ ({activePoint.score100} pts)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B7AAA1]">Appreciation:</span>
                  <span className="text-emerald-400 font-medium">
                    {activePoint.appreciation}
                  </span>
                </div>
              </div>
            </div>
          )}
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
