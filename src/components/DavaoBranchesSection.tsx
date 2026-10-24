import React, { useState } from 'react';
import { DAVAO_BRANCHES } from '../data/mockData';
import { DavaoBranch } from '../types/wine';
import {
  MapPin,
  Phone,
  Clock,
  Wine,
  CheckCircle2,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useWineStore } from '../context/WineStoreContext';

export const DavaoBranchesSection: React.FC = () => {
  const { showToast } = useWineStore();
  const [selectedBranch, setSelectedBranch] = useState<DavaoBranch | null>(null);

  const handleCall = (phone: string, name: string) => {
    showToast(`Connecting to ${name} concierge... (${phone})`, 'info');
  };

  const handleDirections = (name: string, landmark: string) => {
    showToast(`Opening Davao City directions for ${name} (${landmark})`, 'info');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#F5EFE7]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Mindanao’s Premier Cellar Network</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5EFE7] font-normal">
            5 Branches Across Davao City
          </h2>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
          From our subterranean Lanang vault to our Azuela seaside veranda, visit our five temperature-controlled tasting rooms for sommelier flights and instant bottle pick-up.
        </p>
      </div>

      {/* Flagship Feature Spotlight Card (Lanang) */}
      {DAVAO_BRANCHES[0] && (
        <div className="mb-12 rounded-3xl overflow-hidden bg-gradient-to-r from-[#210D12] via-[#130B0D] to-[#210D12] border border-[#48151F] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C6A15B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flagship Cellar & Master Sommelier Lounge</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal leading-tight">
                {DAVAO_BRANCHES[0].name}
              </h3>

              <div className="space-y-2 text-xs text-[#B7AAA1]">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <span>{DAVAO_BRANCHES[0].address} <span className="text-[#C6A15B]">({DAVAO_BRANCHES[0].landmark})</span></span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>{DAVAO_BRANCHES[0].operatingHours}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span className="font-mono text-[#F5EFE7]">{DAVAO_BRANCHES[0].phone}</span>
                </p>
              </div>

              {/* Feature Tags - clean unboxed buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {DAVAO_BRANCHES[0].features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[#130B0D] border border-[#48151F] text-xs text-[#B7AAA1]"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={() => handleCall(DAVAO_BRANCHES[0].phone, DAVAO_BRANCHES[0].name)}
                  className="py-2.5 px-5 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#C6A15B]/30"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Call Concierge</span>
                </button>
                <button
                  onClick={() => handleDirections(DAVAO_BRANCHES[0].name, DAVAO_BRANCHES[0].landmark)}
                  className="py-2.5 px-5 rounded-lg bg-[#130B0D] hover:bg-[#48151F] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-medium border border-[#48151F] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-80 rounded-2xl overflow-hidden relative border border-[#48151F]">
              <img
                src={DAVAO_BRANCHES[0].image}
                alt={DAVAO_BRANCHES[0].name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#130B0D]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#48151F] text-xs text-[#B7AAA1]">
                <span className="font-semibold text-[#C6A15B] block mb-0.5">Lanang Central Cellar</span>
                <span>Active 13°C temperature-controlled vaults holding over 3,000 vintage bottles.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid for Remaining 4 Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {DAVAO_BRANCHES.slice(1).map((branch) => (
          <div
            key={branch.id}
            className="group rounded-2xl overflow-hidden bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
          >
            {/* Image Header */}
            <div className="h-56 relative overflow-hidden bg-[#210D12]">
              <img
                src={branch.image}
                alt={branch.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/20" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded bg-[#130B0D]/85 backdrop-blur-md text-[#C6A15B] text-xs font-semibold uppercase tracking-wider border border-[#48151F]">
                  {branch.district}
                </span>
              </div>
            </div>

            {/* Branch Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3 group-hover:text-[#C6A15B] transition-colors leading-snug">
                  {branch.name}
                </h3>

                <div className="space-y-2 text-xs text-[#B7AAA1] mb-5">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="text-[#B7AAA1]/75 pl-5 text-[11px] italic">
                    Near: {branch.landmark}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                    <span>{branch.operatingHours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                    <span className="font-mono text-[#F5EFE7]">{branch.phone}</span>
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-[#48151F]/40">
                  {branch.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#B7AAA1]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#48151F]">
                <button
                  onClick={() => handleCall(branch.phone, branch.name)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#210D12] hover:bg-[#861F32] text-[#C6A15B] hover:text-[#F5EFE7] border border-[#48151F] hover:border-[#C6A15B]/40 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Branch</span>
                </button>
                <button
                  onClick={() => handleDirections(branch.name, branch.landmark)}
                  className="py-2.5 px-4 rounded-lg bg-[#130B0D] hover:bg-[#48151F] text-[#B7AAA1] hover:text-[#F5EFE7] border border-[#48151F] text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Davao Islandwide Delivery Guarantee */}
      <div className="mt-12 p-6 rounded-2xl bg-[#130B0D] border border-[#48151F] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#B7AAA1]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#F5EFE7] font-normal mb-0.5">
              Same-Day Climate-Controlled Delivery in Davao City
            </h4>
            <p className="text-[#B7AAA1]/80">
              Orders placed before 4:00 PM are delivered directly from our nearest Davao cellar branch in insulated cold-chain packaging.
            </p>
          </div>
        </div>
        <span className="text-xs text-[#C6A15B] font-semibold uppercase tracking-wider shrink-0 bg-[#210D12] px-3.5 py-1.5 rounded border border-[#48151F]">
          Complimentary over ₱5,000
        </span>
      </div>
    </section>
  );
};
