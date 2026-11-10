import React from 'react';
import { Wine, Droplets, Sparkles, Flame, Sun } from 'lucide-react';

interface TastingMetric {
  label: string;
  value: number; // 1 to 5
  descriptor: string;
  icon: React.ReactNode;
}

interface InteractiveTastingProfileProps {
  metrics?: {
    body?: number;
    acidity?: number;
    sweetness?: number;
    tannin?: number;
    fruit?: number;
  };
  customDescriptors?: {
    body?: string;
    acidity?: string;
    sweetness?: string;
    tannin?: string;
    fruit?: string;
  };
  compact?: boolean;
  className?: string;
}

export const InteractiveTastingProfile: React.FC<InteractiveTastingProfileProps> = ({
  metrics = {
    body: 4,
    acidity: 3,
    sweetness: 1,
    tannin: 4,
    fruit: 4
  },
  customDescriptors,
  compact = false,
  className = ''
}) => {
  const profileList: TastingMetric[] = [
    {
      label: 'Body',
      value: metrics.body ?? 4,
      descriptor: customDescriptors?.body || (metrics.body && metrics.body >= 4 ? 'Full & Structured' : metrics.body === 3 ? 'Medium-Bodied' : 'Light & Delicate'),
      icon: <Wine className="w-3.5 h-3.5 text-[#C6A15B]" />
    },
    {
      label: 'Acidity',
      value: metrics.acidity ?? 3,
      descriptor: customDescriptors?.acidity || (metrics.acidity && metrics.acidity >= 4 ? 'Crisp & Vibrant' : metrics.acidity === 3 ? 'Balanced Freshness' : 'Soft & Rounded'),
      icon: <Droplets className="w-3.5 h-3.5 text-[#C6A15B]" />
    },
    {
      label: 'Sweetness',
      value: metrics.sweetness ?? 1,
      descriptor: customDescriptors?.sweetness || (metrics.sweetness === 1 ? 'Bone Dry' : metrics.sweetness === 2 ? 'Dry' : metrics.sweetness === 3 ? 'Semi-Dry' : 'Lush Sweet'),
      icon: <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
    },
    {
      label: 'Tannin',
      value: metrics.tannin ?? 4,
      descriptor: customDescriptors?.tannin || (metrics.tannin && metrics.tannin >= 4 ? 'Velvety & Firm' : metrics.tannin === 3 ? 'Silky & Integrated' : 'Gentle / Supple'),
      icon: <Flame className="w-3.5 h-3.5 text-[#C6A15B]" />
    },
    {
      label: 'Fruit',
      value: metrics.fruit ?? 4,
      descriptor: customDescriptors?.fruit || (metrics.fruit && metrics.fruit >= 4 ? 'Ripe Dark Berries' : metrics.fruit === 3 ? 'Stone & Orchard Fruit' : 'Subtle Minerality'),
      icon: <Sun className="w-3.5 h-3.5 text-[#C6A15B]" />
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {!compact && (
        <div className="flex items-center justify-between pb-2 border-b border-[#351116]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold flex items-center gap-1.5">
            <Wine className="w-3.5 h-3.5" />
            <span>Sommelier Tasting Profile</span>
          </span>
          <span className="text-[10px] text-[#B7AAA1] font-light">Organoleptic Analysis</span>
        </div>
      )}

      <div className="space-y-2.5">
        {profileList.map((item) => {
          const pct = Math.min(100, Math.max(10, (item.value / 5) * 100));

          return (
            <div key={item.label} className="group/row">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-[#F5EFE7] font-medium">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                <span className="text-[11px] text-[#C6A15B] font-light">
                  {item.descriptor}
                </span>
              </div>

              {/* Progress Rail with Marker */}
              <div className="relative h-2 rounded-full bg-[#130B0D] border border-[#351116] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#861F32] via-[#B38E46] to-[#C6A15B] transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Scale points */}
              <div className="flex justify-between text-[9px] text-[#B7AAA1]/50 px-0.5 mt-0.5">
                <span>Low</span>
                <span>Balanced</span>
                <span>High</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
