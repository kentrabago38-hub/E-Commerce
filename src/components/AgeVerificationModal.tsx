import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { ShieldCheck, AlertOctagon, Wine } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { ageVerified, underageBlocked, verifyAge, rejectAge, resetAgeGate } = useWineStore();
  const [remember, setRemember] = useState(true);

  if (underageBlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070506]/95 backdrop-blur-xl p-4">
        <div className="max-w-md w-full p-8 rounded-xl bg-[#140e11] border border-red-900/40 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/40 flex items-center justify-center border border-red-800/40 text-red-400">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#f3efe6] mb-3">Access Restricted</h2>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            In compliance with international beverage laws and responsible service standards, access to VÍNEA is restricted to individuals of legal drinking age.
          </p>
          <div className="p-4 rounded-lg bg-black/40 border border-neutral-800 text-xs text-neutral-400 mb-6 text-left">
            <p className="font-semibold text-neutral-300 mb-1">Responsible Enjoyment</p>
            <p>To learn more about drinking age laws and health guidelines in your country, visit <a href="https://www.responsibledrinking.org" target="_blank" rel="noreferrer" className="text-[#d4af37] underline">responsibledrinking.org</a>.</p>
          </div>
          <button
            onClick={resetAgeGate}
            className="w-full py-3 px-6 rounded-md bg-[#2d1219] hover:bg-[#3f1923] text-[#f3efe6] text-sm font-medium tracking-wide transition-colors border border-[#d4af37]/30"
          >
            I Made a Mistake (Verify Again)
          </button>
        </div>
      </div>
    );
  }

  if (ageVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#130B0D]/95 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-lg w-full p-8 md:p-10 rounded-3xl bg-[#130B0D] border border-[#48151F] text-center shadow-2xl">
        {/* Subtle decorative gold crest */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#210D12] flex items-center justify-center border border-[#C6A15B]/40 shadow-inner">
          <Wine className="w-8 h-8 text-[#C6A15B]" />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mb-2">Age Verification</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#F5EFE7] mb-4">
          Welcome to VÍNEA
        </h2>

        <p className="text-sm md:text-base text-[#B7AAA1] mb-8 leading-relaxed max-w-md mx-auto font-light">
          VÍNEA offers fine alcoholic beverages and cellar allocations. You must be of legal drinking age (21+) to enter and purchase.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => verifyAge(remember)}
            className="flex-1 py-3.5 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] font-medium text-sm tracking-wider uppercase border border-[#C6A15B]/40 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            YES, ENTER (21+)
          </button>
          <button
            onClick={rejectAge}
            className="flex-1 py-3.5 px-6 rounded-lg bg-transparent hover:bg-white/5 text-[#B7AAA1] hover:text-[#F5EFE7] font-medium text-sm tracking-wider uppercase border border-[#48151F] transition-all cursor-pointer"
          >
            NO, EXIT
          </button>
        </div>

        {/* Remember my choice checkbox */}
        <label className="flex items-center justify-center gap-2.5 text-xs text-[#B7AAA1] select-none cursor-pointer hover:text-[#F5EFE7] transition-colors">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-[#48151F] bg-[#130B0D] text-[#861F32] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#861F32]"
          />
          <span>Remember my verification</span>
        </label>

        <div className="mt-8 pt-4 border-t border-[#48151F] flex items-center justify-center gap-2 text-[11px] text-[#B7AAA1]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>VÍNEA promotes responsible and legal consumption only</span>
        </div>
      </div>
    </div>
  );
};
