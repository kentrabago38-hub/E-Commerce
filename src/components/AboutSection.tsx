import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { DAVAO_BRANCHES } from '../data/mockData';
import {
  Wine,
  ShieldCheck,
  Truck,
  Sparkles,
  Award,
  Globe,
  MapPin,
  Clock,
  Phone,
  Compass,
  CheckCircle2,
  Users
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { setActiveTab, showToast } = useWineStore();

  const handleCall = (phone: string, name: string) => {
    showToast(`Connecting with ${name}... (${phone})`, 'info');
  };

  const handleDirections = (name: string, landmark: string) => {
    showToast(`Directions to ${name} (${landmark})`, 'info');
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#F5EFE7]">
      {/* Brand Story Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#210D12] via-[#130B0D] to-[#210D12] border border-[#48151F] p-8 sm:p-14 lg:p-20 shadow-2xl mb-20">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-6">
            <Wine className="w-3.5 h-3.5" />
            <span>The VÍNEA Story · Davao City</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F5EFE7] font-normal mb-6 leading-[1.1]">
            A Celebration in Every Bottle.
          </h1>

          <p className="text-base sm:text-lg text-[#B7AAA1] leading-relaxed font-light mb-6">
            Welcome to <strong className="text-[#F5EFE7]">VÍNEA</strong>, Mindanao’s foremost wine marketplace and tasting lounge network. Founded in Davao City, our mission is to bring the world’s most prestigious terroirs—from the classified growths of Bordeaux and Burgundy to the sun-soaked estates of Tuscany, Napa Valley, and Rioja—straight to our fellow wine enthusiasts across Davao.
          </p>

          <p className="text-sm sm:text-base text-[#B7AAA1]/80 leading-relaxed font-light mb-10">
            We understand that fine wine is an exquisite living craft that demands supreme care, especially in the tropical climate of the Philippines. That is why every single bottle in our possession is stored in dedicated, uninterrupted 13°C climate-controlled subterranean vaults across our 5 Davao locations and dispatched in custom cold-chain insulated packaging.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('shop')}
              className="py-3.5 px-8 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-[0.15em] font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg"
            >
              Shop Cellar Allocations
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className="py-3.5 px-8 rounded-lg bg-[#130B0D] hover:bg-[#48151F] text-[#C6A15B] hover:text-[#F5EFE7] text-xs uppercase tracking-[0.15em] font-semibold border border-[#48151F] hover:border-[#C6A15B]/40 transition-colors cursor-pointer"
            >
              Explore 5 Davao Branches
            </button>
          </div>
        </div>
      </section>

      {/* 5 Branches Across Davao Highlight Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Visit Us in Person</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal">
              5 Cellars & Tasting Rooms Across Davao
            </h2>
          </div>
          <p className="text-sm text-[#B7AAA1] max-w-md mt-2 md:mt-0 font-light leading-relaxed">
            Conveniently situated in Davao City’s premier commercial and seaside districts for cellar browsing, flights, and instant chilled bottle pick-up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAVAO_BRANCHES.map((b) => (
            <div
              key={b.id}
              className="group rounded-2xl overflow-hidden bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div className="h-48 relative overflow-hidden bg-[#210D12]">
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/20" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#130B0D]/85 backdrop-blur-md text-[#C6A15B] text-[11px] font-semibold uppercase tracking-wider border border-[#48151F]">
                    {b.district}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#F5EFE7] font-normal mb-2.5 group-hover:text-[#C6A15B] transition-colors">
                    {b.name}
                  </h3>
                  <div className="space-y-1.5 text-xs text-[#B7AAA1] mb-4">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
                      <span>{b.address}</span>
                    </p>
                    <p className="text-[#B7AAA1]/75 pl-5 text-[11px] italic">
                      Near: {b.landmark}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                      <span>{b.operatingHours}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                      <span className="font-mono text-[#F5EFE7]">{b.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-[#48151F]/40 mb-5">
                    {b.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#B7AAA1]">
                        <CheckCircle2 className="w-3 h-3 text-[#C6A15B] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#48151F]">
                  <button
                    onClick={() => handleCall(b.phone, b.name)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#210D12] hover:bg-[#861F32] text-[#C6A15B] hover:text-[#F5EFE7] border border-[#48151F] hover:border-[#C6A15B]/40 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleDirections(b.name, b.landmark)}
                    className="py-2 px-3 rounded-lg bg-[#130B0D] hover:bg-[#48151F] text-[#B7AAA1] hover:text-[#F5EFE7] border border-[#48151F] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Pillars of Excellence */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 rounded-2xl bg-[#130B0D] border border-[#48151F]">
          <div className="w-12 h-12 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B] mb-6">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3">Direct Terroir Procurement</h3>
          <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed">
            Our sommelier panel maintains direct relationships with generational châteaux in Bordeaux, Burgundy, Rioja, Tuscany, and Napa Valley, importing authenticated allocations without intermediary detours.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#130B0D] border border-[#48151F]">
          <div className="w-12 h-12 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B] mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3">Tropical Cold-Chain Seal</h3>
          <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed">
            In Davao’s warm environment, heat is wine’s biggest enemy. We operate constant 13°C chilled storage and bespoke insulated dispatch vans, ensuring freshness from vineyard cellars to your dining table.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#130B0D] border border-[#48151F]">
          <div className="w-12 h-12 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B] mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3">In-House Master Sommeliers</h3>
          <p className="text-xs sm:text-sm text-[#B7AAA1] font-light leading-relaxed">
            Whether booking a private flight at our Lanang tasting room, pairing wine with local Davao gastronomy, or curating an investment cellar, our certified team is at your service.
          </p>
        </div>
      </section>
    </div>
  );
};
