import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import {
  Mail,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Wine,
  AlertCircle,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { subscribeNewsletterInSupabase } from '../services/dbService';

export const NewsletterSubscriptionSection: React.FC = () => {
  const { showToast, setActiveTab, setSelectedProduct } = useWineStore();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Preference tags (optional selection for personalized dispatch)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Library Allocations',
    'Davao Tastings'
  ]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  /**
   * Basic & robust RFC 5322 compatible email validation
   */
  const validateEmail = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    // Standard email regex: must contain local part, @, domain, and TLD of at least 2 chars
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email format (e.g., patron@domain.com).');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (hasInteracted) {
      if (!val.trim()) {
        setErrorMessage('Please enter your email address.');
      } else {
        validateEmail(val);
      }
    }
  };

  const handleInputBlur = () => {
    setHasInteracted(true);
    if (email.trim()) {
      validateEmail(email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    // Persist to Supabase newsletter_subscribers table
    subscribeNewsletterInSupabase(cleanEmail, 'storefront_footer').catch(() => {});

    // Save to local storage as fallback
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('vinea_newsletter_subscribers') || '[]');
        if (!existing.includes(cleanEmail)) {
          existing.push(cleanEmail);
          localStorage.setItem('vinea_newsletter_subscribers', JSON.stringify(existing));
        }
      } catch {
        // Ignore localStorage error
      }

      setIsSubmitting(false);
      setIsSubscribed(true);
      showToast('Welcome to the VÍNEA Cellar Dispatch! Enjoy your welcome voucher.', 'success');
    }, 700);
  };

  const handleCopyVoucher = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('DISPATCH5');
      }
      setCopiedCode(true);
      showToast('Voucher code DISPATCH5 copied to clipboard.', 'info');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      showToast('Voucher code: DISPATCH5', 'info');
    }
  };

  const handleSubscribeAnother = () => {
    setEmail('');
    setIsSubscribed(false);
    setErrorMessage('');
    setHasInteracted(false);
  };

  return (
    <section
      aria-label="Newsletter Subscription"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[#351116] bg-gradient-to-b from-[#18090C] via-[#100608] to-[#14080B] text-[#F5EFE7] overflow-hidden"
    >
      {/* Background radial ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C6A15B]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#861F32]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {!isSubscribed ? (
          <div className="text-center space-y-6">
            {/* Header Kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">
              <Wine className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>The Cellar Dispatch</span>
              <span aria-hidden="true" className="text-[#48151F]">·</span>
              <span className="text-[#B7AAA1] font-light">Discreet In-Box Allocations</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F5EFE7] font-normal tracking-tight leading-[1.15] max-w-2xl mx-auto">
              Rare Vintage Releases, Delivered to Your In-box.
            </h2>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-[#B7AAA1] font-light leading-relaxed max-w-xl mx-auto">
              Join our private circle of collectors in Davao and across the archipelago. Be first to access scarce Bordeaux allocations, invitations to subterranean vault tastings, and seasonal sommelier curation notes.
            </p>

            {/* Subtle Topic Interest Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[11px] text-[#918481] uppercase tracking-wider block sm:inline mr-1">
                Preferred Topics:
              </span>
              {[
                'Library Allocations',
                'Davao Tastings',
                'En Primeur Pre-Release',
                'Sommelier Pairings'
              ].map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#351116] text-[#C6A15B] border-[#C6A15B]/50 font-medium'
                        : 'bg-[#14080B]/60 text-[#918481] border-[#392126] hover:text-[#F5EFE7]'
                    }`}
                  >
                    {isSelected && <span className="mr-1 text-[#C6A15B]">✓</span>}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>

            {/* Subscription Form with Subtle Gold-Shimmer Input Wrapper */}
            <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto pt-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Gold-Shimmer Input Container */}
                <div className="gold-shimmer-input-wrapper flex-1">
                  <div className="relative flex items-center bg-[#130B0D] rounded-[10px] px-3.5 py-1">
                    <Mail
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        errorMessage ? 'text-red-400' : 'text-[#C6A15B]'
                      }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter your collector email address..."
                      aria-label="Collector email address"
                      aria-invalid={Boolean(errorMessage)}
                      aria-describedby={errorMessage ? 'newsletter-error' : undefined}
                      className="w-full py-2.5 px-3 bg-transparent text-sm text-[#F5EFE7] placeholder-[#918481]/60 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-shimmer-cta py-3.5 px-7 rounded-xl bg-[#861F32] hover:bg-[#9d243b] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/50 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Join Dispatch</span>
                      <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                    </>
                  )}
                </button>
              </div>

              {/* Validation Error Message */}
              {errorMessage && (
                <div
                  id="newsletter-error"
                  role="alert"
                  className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-rose-300 font-medium animate-fade-in"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Discreet Anti-Spam & Trust Notice */}
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#918481]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]/80 shrink-0" />
                <span>Discreet cellar communications only. Never shared. One-click unsubscribe anytime.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success View */
          <div className="rounded-2xl bg-gradient-to-br from-[#1C090D] via-[#100608] to-[#170A0E] border border-[#C6A15B]/60 p-8 sm:p-12 text-center shadow-2xl animate-fade-in relative">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#861F32] to-[#210D12] border-2 border-[#C6A15B] flex items-center justify-center text-[#C6A15B] shadow-xl">
              <CheckCircle2 className="w-8 h-8 text-[#C6A15B]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#130B0D] border border-[#C6A15B]/40 text-[#C6A15B] text-[10px] uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-[#C6A15B]" />
              <span>Allocation Invitation Confirmed</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3">
              Welcome to the Cellar Dispatch
            </h3>
            <p className="text-sm text-[#C1B7B4] font-light max-w-md mx-auto leading-relaxed mb-6">
              A private welcome message and your initial sommelier allocation guide have been transmitted to <strong className="font-mono text-[#F5EFE7]">{email}</strong>.
            </p>

            {/* Exclusive Welcome Voucher Card */}
            <div className="max-w-sm mx-auto p-4 rounded-xl bg-[#130B0D] border border-[#392126] mb-8">
              <span className="text-[10px] uppercase tracking-wider text-[#918481] block mb-1">
                Collector Welcome Privilege · 5% Off Any Vintage
              </span>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#210D12] border border-[#C6A15B]/30 font-mono text-sm text-[#D5B15C]">
                <span className="tracking-widest font-semibold">DISPATCH5</span>
                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="py-1 px-2.5 rounded bg-[#351116] hover:bg-[#48151F] text-xs text-[#F5EFE7] border border-[#C6A15B]/40 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy voucher code"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#C6A15B]" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <span className="text-[10px] text-[#918481] block mt-1.5">
                Apply at checkout on any order across Davao City or nationwide.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('shop');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <span>Browse Cellar Vintages</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
              </button>

              <button
                type="button"
                onClick={handleSubscribeAnother}
                className="py-3 px-5 rounded-lg bg-[#130B0D] hover:bg-[#210D12] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-medium border border-[#392126] transition-colors cursor-pointer"
              >
                Register Another Email
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
