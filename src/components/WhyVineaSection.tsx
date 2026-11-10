import React from 'react';
import { Wine, ShieldCheck, Thermometer, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface BenefitItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  detailPoints: string[];
}

export const WhyVineaSection: React.FC = () => {
  const benefits: BenefitItem[] = [
    {
      number: '01',
      title: 'Curated Selection',
      subtitle: 'Artisanal & Grand Cru Terroirs',
      description: 'Hand-selected wines from remarkable small-yield châteaux and prestigious grand cru domaines across France, Italy, Spain, and the new world.',
      icon: <Wine className="w-5 h-5 text-[#C6A15B]" />,
      detailPoints: ['Allocations directly from vigneron cellars', 'Sommelier-scored vintage evaluations', 'Limited annual production runs']
    },
    {
      number: '02',
      title: 'Authentic Provenance',
      subtitle: 'Verified Chain of Custody',
      description: 'Every bottle is sourced with absolute transparency, verified châteaux provenance, tamper-evident security, and certified storage logs.',
      icon: <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />,
      detailPoints: ['Full vintage pedigree documentation', 'Direct estate-bottled allocations', 'Authenticity guarantee seal']
    },
    {
      number: '03',
      title: 'Climate-Controlled Delivery',
      subtitle: 'Continuous 13°C Cold Chain',
      description: 'Proper handling from subterranean cellar to your doorstep. Our temperature-regulated fleet safeguards the delicate structure and longevity of every vintage.',
      icon: <Thermometer className="w-5 h-5 text-[#C6A15B]" />,
      detailPoints: ['Refrigerated vans operating in Davao', 'Shock-absorbing protective packaging', 'Real-time temperature monitoring']
    },
    {
      number: '04',
      title: 'Davao Wine Experience',
      subtitle: 'Local Community & Private Vaults',
      description: 'Exclusive access to VÍNEA’s five physical private cellars in Davao, member-only masterclasses, private tastings, and bespoke sommelier cellar stocking.',
      icon: <MapPin className="w-5 h-5 text-[#C6A15B]" />,
      detailPoints: ['5 physical boutique tasting rooms in Davao', 'On-demand personal sommelier pairing', 'Private cellar lockers & VIP tastings']
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#351116]/80">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Standard of Haute Sommelerie</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
            Why VÍNEA?
          </h2>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md font-light leading-relaxed">
          More than a wine marketplace. An unwavering commitment to uncompromised terroir, provenance, and the ceremonial art of living well.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b) => (
          <div
            key={b.number}
            className="group relative p-7 rounded-2xl bg-gradient-to-b from-[#18090C] to-[#130B0D] border border-[#351116] hover:border-[#C6A15B]/60 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Top row: Number and Icon */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif text-2xl text-[#C6A15B]/40 font-normal group-hover:text-[#C6A15B] transition-colors tabular-nums">
                  {b.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#210D12] border border-[#351116] group-hover:border-[#C6A15B]/50 flex items-center justify-center transition-colors">
                  {b.icon}
                </div>
              </div>

              <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block mb-1">
                {b.subtitle}
              </span>
              <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3">
                {b.title}
              </h3>
              <p className="text-xs text-[#B7AAA1] font-light leading-relaxed mb-6">
                {b.description}
              </p>
            </div>

            {/* Checklist items */}
            <div className="pt-4 border-t border-[#351116]/80 space-y-2">
              {b.detailPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-[#E5D7B7]/90 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
