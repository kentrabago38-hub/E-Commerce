import React from 'react';

interface VineaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export const VineaLogoIcon: React.FC<{ sizePx?: number; className?: string }> = ({
  sizePx = 40,
  className = ''
}) => {
  return (
    <div
      style={{ width: sizePx, height: sizePx }}
      className={`relative shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-[#FFF2D6] via-[#C6A15B] to-[#7A561C] shadow-md group ${className}`}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2D1118] via-[#1A080C] to-[#0F0406] flex items-center justify-center overflow-hidden relative">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-radial from-[#9B2338]/40 via-transparent to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vinea_comp_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="30%" stopColor="#E5C778" />
              <stop offset="70%" stopColor="#C6A15B" />
              <stop offset="100%" stopColor="#936F26" />
            </linearGradient>
            <linearGradient id="vinea_comp_wine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9B2338" />
              <stop offset="100%" stopColor="#5B1421" />
            </linearGradient>
          </defs>

          {/* Inner dotted filigree */}
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="url(#vinea_comp_gold)"
            strokeWidth="0.7"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />

          {/* Wine liquid glow */}
          <path d="M 23 21 C 23 31, 41 31, 41 21 Z" fill="url(#vinea_comp_wine)" opacity="0.6" />

          {/* Chalice silhouette */}
          <path
            d="M 21 17 C 21 31, 30.5 35.5, 30.5 39 L 30.5 45.5 L 25 46.5 L 25 48.5 L 39 48.5 L 39 46.5 L 33.5 45.5 L 33.5 39 C 33.5 35.5, 43 31, 43 17 C 43 16.5, 42 16.5, 40.5 16.5 C 38.5 16.5, 25.5 16.5, 23.5 16.5 C 22 16.5, 21 16.5, 21 17 Z"
            stroke="url(#vinea_comp_gold)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Intertwined Serif Roman 'V' Monogram */}
          <path
            d="M 23.5 19.5 L 28 19.5 L 32 31.5 L 36 19.5 L 40.5 19.5 L 40.5 20.8 L 38.5 21 L 33.2 36.5 L 30.8 36.5 L 25.5 21 L 23.5 20.8 Z"
            fill="url(#vinea_comp_gold)"
          />

          {/* Crown Vine Leaves & Grape Cluster */}
          <path d="M 32 14.5 C 30 11.5, 26 12, 26 13.5 C 26 15, 29 15, 32 14.5 Z" fill="url(#vinea_comp_gold)" opacity="0.9" />
          <path d="M 32 14.5 C 34 11.5, 38 12, 38 13.5 C 38 15, 35 15, 32 14.5 Z" fill="url(#vinea_comp_gold)" opacity="0.9" />
          <path d="M 32 14.5 C 32 11, 33 9.5, 34.5 9" stroke="url(#vinea_comp_gold)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="29" cy="14" r="1.5" fill="url(#vinea_comp_gold)" />
          <circle cx="35" cy="14" r="1.5" fill="url(#vinea_comp_gold)" />
          <circle cx="32" cy="16" r="1.6" fill="url(#vinea_comp_gold)" />
        </svg>
      </div>
    </div>
  );
};

export const VineaLogo: React.FC<VineaLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = 'Discover · Taste · Remember',
  className = ''
}) => {
  const sizeMap = {
    sm: { px: 32, titleClass: 'text-xl', subClass: 'text-[8px] tracking-[0.2em]' },
    md: { px: 42, titleClass: 'text-2xl sm:text-3xl', subClass: 'text-[9px] tracking-[0.25em]' },
    lg: { px: 52, titleClass: 'text-3xl sm:text-4xl', subClass: 'text-[10px] tracking-[0.28em]' },
    xl: { px: 64, titleClass: 'text-4xl sm:text-5xl', subClass: 'text-[12px] tracking-[0.3em]' }
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <VineaLogoIcon sizePx={current.px} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif tracking-wider text-[#F5EFE7] font-normal leading-none block ${current.titleClass}`}>
            VÍNEA
          </span>
          {subtitle && (
            <span className={`text-[#C6A15B] uppercase block mt-1 font-sans ${current.subClass}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VineaLogo;
