import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import {
  Wine,
  Send,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ShieldCheck,
  Heart,
  AlertCircle
} from 'lucide-react';
import { VineaLogoIcon } from './VineaLogo';
import { validateGmail } from '../utils/validation';

export const Footer: React.FC = () => {
  const {
    setActiveTab,
    setSelectedProduct,
    showToast,
    resetAgeGate
  } = useWineStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    const val = validateGmail(email);
    if (!val.isValid) {
      setEmailError(val.error || 'Please enter a valid @gmail.com address.');
      showToast(val.error || 'Please enter a valid @gmail.com address (e.g. name@gmail.com).', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Thank you for subscribing to VÍNEA Private Allocations.', 'success');
    setEmail('');
  };

  const handleNav = (tab: any) => {
    setSelectedProduct(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#130B0D] border-t border-[#48151F] text-[#F5EFE7] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#48151F]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <VineaLogoIcon sizePx={40} />
              <div>
                <span className="font-serif text-2xl tracking-wider text-white font-medium drop-shadow-sm">VÍNEA</span>
                <span className="text-[9px] tracking-[0.25em] text-[#E5D7B7] uppercase block font-bold">
                  Haute Sommelerie · Est. 2026
                </span>
              </div>
            </div>

            <p className="font-serif text-lg text-white/90 italic">
              “Discover. Taste. Remember.”
            </p>

            <p className="text-xs text-white/80 font-normal leading-relaxed max-w-sm">
              Connecting collectors and wine lovers with exceptional vintages, single-vineyard terroirs, and prestige allocations preserved in optimal 13°C cellar condition across Davao City.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-white/80">
              <a href="#instagram" className="p-2 rounded-lg bg-[#210D12] border border-white/10 hover:bg-[#861F32] hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 rounded-lg bg-[#210D12] border border-white/10 hover:bg-[#861F32] hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 rounded-lg bg-[#210D12] border border-white/10 hover:bg-[#861F32] hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="p-2 rounded-lg bg-[#210D12] border border-white/10 hover:bg-[#861F32] hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-4">
              Explore Cellar
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Shop All Wines
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('red')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Red Wine
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('white')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  White Wine
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rose')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Rosé
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('sparkling')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Sparkling & Champagne
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Collections & Reserves
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge & Service */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#E5D7B7] font-bold mb-4">
              Knowledge & Service
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-[#D5B15C] transition-colors cursor-pointer text-[#E5D7B7] font-bold flex items-center gap-1.5">
                  <span>Customer Cellar Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('guide')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  Sommelier Wine Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#D5B15C] transition-colors cursor-pointer">
                  About VÍNEA
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('branches')} className="hover:text-[#D5B15C] transition-colors cursor-pointer text-white flex items-center gap-1.5 font-bold">
                  <span>5 Davao Cellar Branches</span>
                </button>
              </li>
              <li>
                <span className="text-white/70 hover:text-white transition-colors cursor-pointer">Climate-Controlled Delivery</span>
              </li>
              <li>
                <span className="text-white/70 hover:text-white transition-colors cursor-pointer">Sommelier Tasting Consultations</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Membership Signup */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-4">
              Private Allocations
            </h4>
            <p className="text-xs text-[#B7AAA1]/80 mb-3 font-light leading-relaxed">
              Subscribe to receive discreet notifications of library vintage cellar releases and sommelier tasting invites.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter your @gmail.com address"
                  className={`w-full py-2.5 pl-3 pr-10 bg-[#210D12] border rounded-lg text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                    emailError ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                  }`}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-[#861F32] hover:bg-[#a1253c] text-white transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Subscribed to allocations
                </p>
              )}
            </form>

            {/* Payment Method Disciplined Unboxed Presentation */}
            <div className="pt-4 mt-4 border-t border-[#48151F]">
              <span className="text-[10px] uppercase tracking-wider text-[#B7AAA1]/70 block mb-2">
                Accepted Payment Methods
              </span>
              <div className="text-xs text-[#B7AAA1] flex items-center gap-2 flex-wrap font-medium">
                <span>GCash</span>
                <span aria-hidden="true" className="text-[#48151F]">·</span>
                <span>Maya</span>
                <span aria-hidden="true" className="text-[#48151F]">·</span>
                <span>Visa</span>
                <span aria-hidden="true" className="text-[#48151F]">·</span>
                <span>Mastercard</span>
                <span aria-hidden="true" className="text-[#48151F]">·</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Notices & Age Verification */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#918481] font-light">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} VÍNEA. All rights reserved.</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms & Conditions</span>
            <span>·</span>
            <button onClick={resetAgeGate} className="hover:text-[#F5EFE7] underline cursor-pointer">
              Re-Verify Legal Age
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#C1B7B4]">
            <ShieldCheck className="w-4 h-4 text-[#D5B15C]" />
            <span>21+ Only. Alcoholic beverages marketplace demonstration. Drink responsibly.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
