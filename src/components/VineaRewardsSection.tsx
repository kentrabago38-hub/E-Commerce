import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { LOYALTY_TIERS, MEMBER_PERKS, TierInfo } from '../data/rewardsData';
import { LoyaltyTier, MemberPerk } from '../types/wine';
import {
  Award,
  Sparkles,
  Gift,
  Truck,
  Wine,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle,
  Ticket
} from 'lucide-react';

interface VineaRewardsSectionProps {
  onNavigateToCatalog?: () => void;
  onNavigateToTracking?: () => void;
}

export const VineaRewardsSection: React.FC<VineaRewardsSectionProps> = ({
  onNavigateToCatalog,
  onNavigateToTracking
}) => {
  const {
    user,
    redeemPerk,
    showToast,
    userVouchers,
    appliedVoucher,
    applyVoucherCode,
    cart,
    setIsCartOpen,
    setIsAccountOpen
  } = useWineStore();

  const [filterCategory, setFilterCategory] = useState<'all' | 'unlocked' | 'vouchers' | 'experiences'>('all');
  const [selectedPerkForModal, setSelectedPerkForModal] = useState<MemberPerk | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [lastRedeemedCode, setLastRedeemedCode] = useState<{ id: string; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showTierComparison, setShowTierComparison] = useState<boolean>(false);

  if (!user) return null;

  const userTier: LoyaltyTier = user.membership_tier || 'Grand Cru';
  const currentPoints = user.loyalty_points ?? 0;
  const lifetimePoints = user.lifetime_points ?? currentPoints;
  const redeemedPerkIds = user.redeemed_perks || [];
  const rewardsHistory = user.rewards_history || [];

  const tierOrder: LoyaltyTier[] = ['Connoisseur', 'Grand Cru', 'Sommelier Reserve'];
  const userTierIndex = tierOrder.indexOf(userTier);

  // Next tier calculations
  const nextTier: LoyaltyTier | null =
    userTierIndex < tierOrder.length - 1 ? tierOrder[userTierIndex + 1] : null;
  const nextTierPoints = nextTier ? LOYALTY_TIERS[nextTier].minPoints : 10000;
  const prevTierPoints = LOYALTY_TIERS[userTier].minPoints;
  const pointsInCurrentTier = Math.max(0, currentPoints - prevTierPoints);
  const pointsNeededForSpan = nextTier ? nextTierPoints - prevTierPoints : 2500;
  const progressPercent = nextTier
    ? Math.min(100, Math.max(8, Math.round((pointsInCurrentTier / pointsNeededForSpan) * 100)))
    : 100;
  const pointsToNextTier = nextTier ? Math.max(0, nextTierPoints - currentPoints) : 0;

  const currentTierInfo: TierInfo = LOYALTY_TIERS[userTier];

  // Helper for perk eligibility
  const isPerkUnlockedForTier = (perk: MemberPerk): boolean => {
    const requiredIdx = tierOrder.indexOf(perk.tierRequired);
    return userTierIndex >= requiredIdx;
  };

  const handleCopyCode = (code: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      setCopiedCode(code);
      showToast(`Voucher code "${code}" copied to clipboard`, 'info');
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      showToast(`Voucher code: ${code}`, 'info');
    }
  };

  const handleConfirmRedeem = (perk: MemberPerk) => {
    setIsRedeeming(true);
    const pointCost = perk.pointCost || 0;

    setTimeout(() => {
      const result = redeemPerk(perk.id, pointCost, perk.title);
      setIsRedeeming(false);
      if (result.success && result.code) {
        setLastRedeemedCode({ id: perk.id, code: result.code });
        setSelectedPerkForModal(null);
      }
    }, 350);
  };

  const handleUseVoucher = (code: string) => {
    const res = applyVoucherCode(code);
    if (res.success && cart.length > 0) {
      setIsAccountOpen(false);
      setIsCartOpen(true);
    } else if (res.success && cart.length === 0) {
      showToast(`Voucher ${code} is armed for your next bottle — explore the cellar to use it!`, 'info');
    }
  };

  // Filter perks
  const filteredPerks = MEMBER_PERKS.filter((perk) => {
    if (filterCategory === 'unlocked') {
      return isPerkUnlockedForTier(perk);
    }
    if (filterCategory === 'vouchers') {
      return perk.category === 'voucher';
    }
    if (filterCategory === 'experiences') {
      return perk.category === 'experience' || perk.category === 'sommelier';
    }
    return true;
  });

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#C6A15B]" />;
      case 'Wine':
        return <Wine className="w-5 h-5 text-[#C6A15B]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C6A15B]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#C6A15B]" />;
      default:
        return <Gift className="w-5 h-5 text-[#C6A15B]" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#F5EFE7]">
      {/* 1. Header with Breadcrumb & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#392126]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>VÍNEA Cellar Guild</span>
            </span>
            <span className="text-[#392126]">·</span>
            <span className="text-[10px] text-[#C1B7B4] font-medium flex items-center gap-1">
              Member ID: <strong className="font-mono text-[#D5B15C]">VN-RW-{user.user_id.replace(/\D/g, '') || '101'}</strong>
            </span>
          </div>
          <h2 className="font-serif text-3xl text-[#F5EFE7] font-normal tracking-tight">
            VÍNEA Rewards & Member Perks
          </h2>
          <p className="text-xs text-[#C1B7B4] max-w-2xl leading-relaxed">
            Exclusive loyalty privileges, bespoke Davao sommelier experiences, and climate-controlled cellar benefits reserved for our verified patrons.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowTierComparison(!showTierComparison)}
            className="py-2 px-3.5 rounded-lg bg-[#210D12] hover:bg-[#48151F] text-[#C6A15B] hover:text-[#F5EFE7] border border-[#48151F] hover:border-[#C6A15B]/50 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showTierComparison ? 'Hide Tier Table' : 'Compare All Tiers'}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Member Card & Tier Progression */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#240c12] via-[#14080b] to-[#1c0a0f] border border-[#5a242d] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#7F1427]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#392126]/80">
            {/* Left: Tier Crest & Details */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#7F1427] to-[#1A080D] border-2 border-[#D5B15C] p-0.5 flex items-center justify-center shadow-xl shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#1a080d] flex flex-col items-center justify-center text-[#D5B15C]">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 mb-0.5" />
                  <span className="text-[9px] font-mono tracking-widest uppercase">VÍNEA</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${currentTierInfo.badgeBg} ${currentTierInfo.badgeBorder} ${currentTierInfo.badgeText}`}>
                    ★ {userTier} Tier
                  </span>
                  <span className="text-[11px] text-[#C6A15B] font-mono bg-[#100809] px-2.5 py-0.5 rounded border border-[#392126]">
                    {currentTierInfo.multiplierLabel}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal leading-tight">
                  {user.name}
                </h3>
                <p className="text-xs text-[#C1B7B4] mt-0.5">
                  {currentTierInfo.tagline} · Davao Cellar Patron since {user.member_since || 'October 2024'}
                </p>
              </div>
            </div>

            {/* Right: Key Balance Figures */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-[#100809]/90 border border-[#48151F] text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#918481] block mb-0.5 font-medium">
                  Available Points
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#D5B15C] font-normal block tabular-nums">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C1B7B4] block mt-0.5 font-sans">
                  ≈ {formatPeso(currentPoints)} cellar credit
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100809]/90 border border-[#48151F] text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#918481] block mb-0.5 font-medium">
                  Lifetime Earned
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal block tabular-nums">
                  {lifetimePoints.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5 font-sans">
                  Never expires
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-[#100809]/90 border border-[#48151F] text-center sm:text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#918481] block mb-0.5 font-medium">
                    Perks Unlocked
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl text-white font-normal block tabular-nums">
                    {MEMBER_PERKS.filter(isPerkUnlockedForTier).length} / {MEMBER_PERKS.length}
                  </span>
                </div>
                <span className="text-[10px] text-[#C6A15B] block mt-0.5">
                  Exclusive Privileges
                </span>
              </div>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#F5EFE7] font-medium">
                  Current Status: <strong className="text-[#D5B15C]">{userTier}</strong>
                </span>
                {nextTier && (
                  <span className="text-[11px] text-[#918481]">
                    ({currentPoints.toLocaleString()} of {nextTierPoints.toLocaleString()} pts to unlock {nextTier})
                  </span>
                )}
              </div>

              {nextTier ? (
                <span className="text-xs text-[#C6A15B] font-mono">
                  {pointsToNextTier.toLocaleString()} pts needed for {nextTier}
                </span>
              ) : (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Maximum Tier Achieved — Guild Fellow</span>
                </span>
              )}
            </div>

            {/* Gauge Track */}
            <div className="w-full h-3 rounded-full bg-[#100809] border border-[#392126] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#861F32] via-[#C6A15B] to-[#F5EFE7] transition-all duration-700 shadow-lg"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Milestone markers */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#918481] mt-2 font-mono">
              <span className={userTierIndex >= 0 ? 'text-[#D5B15C] font-semibold' : ''}>
                Connoisseur (0 pts)
              </span>
              <span className={userTierIndex >= 1 ? 'text-[#D5B15C] font-semibold' : ''}>
                Grand Cru (2,500 pts)
              </span>
              <span className={userTierIndex >= 2 ? 'text-[#D5B15C] font-semibold' : ''}>
                Sommelier Reserve (7,500 pts)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 My Voucher Wallet */}
      <div className="rounded-2xl bg-[#14080B] border border-[#48151F] p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#392126]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold flex items-center gap-1.5 mb-0.5">
              <Ticket className="w-3.5 h-3.5" />
              <span>Cellar Voucher Wallet</span>
            </span>
            <h3 className="font-serif text-xl text-[#F5EFE7] font-normal">
              Your Active & Redeemed Vouchers
            </h3>
          </div>
          <span className="text-xs text-[#C6A15B] font-mono bg-[#1A080D] px-3 py-1 rounded border border-[#48151F] self-start sm:self-auto">
            {userVouchers.filter(v => v.status === 'active').length} Active · {userVouchers.length} Total
          </span>
        </div>

        {userVouchers.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#C1B7B4]">
            Redeem any perk below to generate a checkout-ready voucher code. You can also apply public seasonal codes like <strong className="font-mono text-[#D5B15C]">VINEA10</strong> in your cart.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {userVouchers.map((voucher) => {
              const isApplied = appliedVoucher?.code?.toUpperCase() === voucher.code.toUpperCase();
              const isUsed = voucher.status === 'used';
              return (
                <div
                  key={voucher.voucher_id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isUsed
                      ? 'bg-[#0E0608] border-[#2A1014] opacity-70'
                      : isApplied
                      ? 'bg-[#210D12] border-emerald-500/60 shadow-lg'
                      : 'bg-[#1A0A0E] border-[#48151F] hover:border-[#C6A15B]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#D5B15C] bg-[#100809] px-2 py-0.5 rounded border border-[#48151F]">
                          {voucher.code}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                            isUsed
                              ? 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                              : isApplied
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50'
                              : 'bg-[#2A0D14] text-[#F5EFE7] border border-[#C6A15B]/40'
                          }`}
                        >
                          {isUsed ? `Used${voucher.order_id ? ` · #${voucher.order_id}` : ''}` : isApplied ? 'Applied to Cart' : 'Ready to Use'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-[#F5EFE7] font-normal leading-snug">
                        {voucher.title}
                      </h4>
                      <p className="text-[11px] text-[#C1B7B4] mt-0.5">
                        {voucher.discount_type === 'fixed'
                          ? `${formatPeso(voucher.discount_value)} instant deduction at checkout`
                          : voucher.discount_type === 'percent'
                          ? `${voucher.discount_value}% off subtotal at checkout`
                          : voucher.discount_type === 'free_shipping'
                          ? 'Waives ₱350 Davao Cold-Chain Delivery fee'
                          : voucher.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#392126]/70 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-[#918481] font-mono">
                      Issued {voucher.created_at}
                    </span>
                    {!isUsed && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(voucher.code)}
                          className="py-1.5 px-2.5 rounded-lg bg-[#100809] hover:bg-[#210D12] border border-[#392126] text-[11px] font-mono text-[#D5B15C] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCode === voucher.code ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUseVoucher(voucher.code)}
                          className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                            isApplied
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50'
                              : 'bg-[#861F32] hover:bg-[#a1253c] text-white border border-[#C6A15B]/40'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isApplied ? (cart.length > 0 ? 'Open Cart' : 'Applied') : 'Apply to Cart'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Tier Comparison Table (Toggled) */}
      {showTierComparison && (
        <div className="rounded-2xl bg-[#190D10] border border-[#48151F] p-6 sm:p-8 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#392126]">
            <div>
              <h3 className="font-serif text-xl text-[#F5EFE7]">VÍNEA Cellar Guild Tier Privileges</h3>
              <p className="text-xs text-[#C1B7B4]">Explore benefits across our three collector tiers.</p>
            </div>
            <button
              onClick={() => setShowTierComparison(false)}
              className="text-xs text-[#918481] hover:text-[#F5EFE7]"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Connoisseur', 'Grand Cru', 'Sommelier Reserve'] as LoyaltyTier[]).map((tierKey) => {
              const info = LOYALTY_TIERS[tierKey];
              const isCurrent = userTier === tierKey;
              return (
                <div
                  key={tierKey}
                  className={`rounded-xl p-5 border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-[#240C12] border-[#C6A15B] shadow-xl ring-1 ring-[#C6A15B]/50'
                      : 'bg-[#100809] border-[#392126]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${info.badgeBg} ${info.badgeBorder} ${info.badgeText}`}>
                        {tierKey}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                          Current Tier
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#C6A15B] font-mono block mb-1">
                      {info.minPoints.toLocaleString()} points required
                    </span>
                    <span className="text-xs text-[#C1B7B4] block mb-4 italic">
                      "{info.tagline}"
                    </span>

                    <ul className="space-y-2 text-xs text-[#F5EFE7]/90 mb-6">
                      {info.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#392126]">
                    <span className="text-[10px] text-[#918481] block">
                      Accelerator: <strong className="text-[#F5EFE7]">{info.multiplierLabel}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Filterable Member Perks Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">Available Member Privileges</h3>
            <p className="text-xs text-[#C1B7B4]">
              Redeem loyalty points for allocations, cellar vouchers, and luxury tasting sessions in Davao.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-[#861F32] text-white border border-[#C6A15B]/50 shadow-sm font-semibold'
                  : 'bg-[#100809] text-[#B7AAA1] border border-[#392126] hover:text-[#F5EFE7]'
              }`}
            >
              All Perks ({MEMBER_PERKS.length})
            </button>

            <button
              onClick={() => setFilterCategory('unlocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'unlocked'
                  ? 'bg-[#861F32] text-white border border-[#C6A15B]/50 shadow-sm font-semibold'
                  : 'bg-[#100809] text-[#B7AAA1] border border-[#392126] hover:text-[#F5EFE7]'
              }`}
            >
              Unlocked for Your Tier
            </button>

            <button
              onClick={() => setFilterCategory('vouchers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'vouchers'
                  ? 'bg-[#861F32] text-white border border-[#C6A15B]/50 shadow-sm font-semibold'
                  : 'bg-[#100809] text-[#B7AAA1] border border-[#392126] hover:text-[#F5EFE7]'
              }`}
            >
              Cellar Credit Vouchers
            </button>

            <button
              onClick={() => setFilterCategory('experiences')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'experiences'
                  ? 'bg-[#861F32] text-white border border-[#C6A15B]/50 shadow-sm font-semibold'
                  : 'bg-[#100809] text-[#B7AAA1] border border-[#392126] hover:text-[#F5EFE7]'
              }`}
            >
              VIP Experiences
            </button>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredPerks.map((perk) => {
            const isUnlocked = isPerkUnlockedForTier(perk);
            const activeForPerk = userVouchers.filter(v => v.perk_id === perk.id && v.status === 'active');
            const isRepeatableVoucher = perk.category === 'voucher';
            const isClaimed = !isRepeatableVoucher && redeemedPerkIds.includes(perk.id);
            const pointCost = perk.pointCost || 0;
            const canAfford = currentPoints >= pointCost;
            const isComplimentary = perk.isComplimentaryForTier && isUnlocked;

            return (
              <div
                key={perk.id}
                className={`relative rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-[#14080B] border-[#48151F] hover:border-[#C6A15B]/60 shadow-lg'
                    : 'bg-[#0E0507] border-[#2A1014] opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Tier requirement, Value Label */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center justify-center shrink-0">
                        {getPerkIcon(perk.iconName)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider block font-medium">
                          {perk.valueLabel}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg text-[#F5EFE7] font-normal leading-snug">
                          {perk.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border shrink-0 ${
                        isUnlocked
                          ? 'bg-[#2A0D14] text-[#D5B15C] border-[#D5B15C]/30'
                          : 'bg-[#190D10] text-[#918481] border-[#392126]'
                      }`}
                    >
                      {perk.tierRequired}
                    </span>
                  </div>

                  <p className="text-xs text-[#C6A15B]/90 font-medium mb-1.5">
                    {perk.tagline}
                  </p>
                  <p className="text-xs text-[#C1B7B4] leading-relaxed mb-4">
                    {perk.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[#392126] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    {isComplimentary ? (
                      <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Included in your tier</span>
                      </span>
                    ) : pointCost > 0 ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg text-[#D5B15C] font-normal tabular-nums">
                          {pointCost.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#918481] uppercase font-sans">
                          Points
                        </span>
                        {activeForPerk.length > 0 && (
                          <span className="text-[10px] text-emerald-400 font-medium ml-1">
                            ({activeForPerk.length} active)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#C6A15B] text-xs font-medium">
                        Automatic Privilege
                      </span>
                    )}
                  </div>

                  {/* Buttons based on status */}
                  <div>
                    {!isUnlocked ? (
                      <div className="text-[11px] text-[#918481] flex items-center gap-1 italic">
                        <span>Requires {perk.tierRequired}</span>
                      </div>
                    ) : isClaimed ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Active / Claimed</span>
                        </span>
                        {(lastRedeemedCode?.id === perk.id || activeForPerk[0]) && (
                          <button
                            onClick={() => handleUseVoucher((lastRedeemedCode?.id === perk.id ? lastRedeemedCode.code : activeForPerk[0].code))}
                            className="py-1 px-2.5 rounded bg-[#210D12] text-[#D5B15C] text-[11px] font-mono border border-[#48151F] hover:bg-[#48151F] transition-colors flex items-center gap-1 cursor-pointer"
                            title="Apply voucher to cart"
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Use {lastRedeemedCode?.id === perk.id ? lastRedeemedCode.code : activeForPerk[0].code}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPerkForModal(perk)}
                        disabled={pointCost > 0 && !canAfford}
                        className={`py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          canAfford || pointCost === 0
                            ? 'bg-[#861F32] hover:bg-[#a1253c] text-white border border-[#C6A15B]/40 shadow-md hover:scale-[1.02]'
                            : 'bg-[#210D12] text-[#918481] border border-[#392126] cursor-not-allowed'
                        }`}
                      >
                        <span>{pointCost > 0 ? (isRepeatableVoucher && activeForPerk.length > 0 ? 'Redeem Another' : 'Redeem Perk') : 'Activate Privilege'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Rewards Ledger & Points History */}
      <div className="rounded-2xl bg-[#14080B] border border-[#392126] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#392126]">
          <div>
            <h3 className="font-serif text-xl text-[#F5EFE7] font-normal">Points & Rewards Activity Ledger</h3>
            <p className="text-xs text-[#C1B7B4]">Transparent record of points earned on cellar acquisitions and redeemed privileges.</p>
          </div>

          <span className="text-xs text-[#C6A15B] font-mono bg-[#1A080D] px-3 py-1 rounded border border-[#48151F]">
            {rewardsHistory.length} Recorded Transactions
          </span>
        </div>

        {rewardsHistory.length === 0 ? (
          <div className="py-12 text-center text-[#918481]">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#C1B7B4]">No points activity recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#392126]/60">
            {rewardsHistory.map((item) => {
              const isPositive = item.points >= 0;
              return (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isPositive ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-[#3A1018] text-[#D5B15C] border border-[#D5B15C]/30'
                      }`}
                    >
                      {item.type === 'order' ? (
                        <Wine className="w-4 h-4" />
                      ) : item.type === 'redemption' ? (
                        <Gift className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <span className="text-[#F5EFE7] font-medium block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#C1B7B4] block mt-0.5">
                        {item.description}
                      </span>
                      <span className="text-[10px] text-[#918481] block mt-0.5 font-mono">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    {item.code && (
                      <button
                        onClick={() => handleCopyCode(item.code!)}
                        className="py-1 px-2.5 rounded bg-[#100809] hover:bg-[#210D12] border border-[#392126] text-[11px] font-mono text-[#D5B15C] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCode === item.code ? 'Copied' : item.code}</span>
                      </button>
                    )}

                    <span
                      className={`font-serif text-base font-medium tabular-nums ${
                        isPositive ? 'text-emerald-400' : 'text-[#D5B15C]'
                      }`}
                    >
                      {isPositive ? `+${item.points.toLocaleString()}` : item.points.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. How to Accelerate Points Guide */}
      <div className="rounded-2xl bg-gradient-to-r from-[#170a0e] via-[#1f0b12] to-[#170a0e] border border-[#48151F] p-6 sm:p-8">
        <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Sommelier Insider Guide</span>
        </span>
        <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-3">
          How to Accelerate Your VÍNEA Points & Tier Status
        </h3>
        <p className="text-xs text-[#C1B7B4] max-w-2xl leading-relaxed mb-6">
          Every fine wine purchase directly enhances your cellar privileges. Take advantage of exclusive accelerators to reach Sommelier Reserve status.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#100809] border border-[#392126]">
            <span className="text-[#C6A15B] font-serif text-lg block mb-1">10–20 pts</span>
            <span className="text-[#F5EFE7] font-medium block mb-1">Per ₱100 Spent</span>
            <p className="text-[11px] text-[#918481] leading-relaxed">
              Automatic points credited immediately on every verified order placed online or at our Davao cellar locations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#100809] border border-[#392126]">
            <span className="text-[#C6A15B] font-serif text-lg block mb-1">2.0x Double Points</span>
            <span className="text-[#F5EFE7] font-medium block mb-1">Featured Allocations</span>
            <p className="text-[11px] text-[#918481] leading-relaxed">
              Earn 2x rewards points on select monthly sommelier collections and library-release Bordeaux blends.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#100809] border border-[#392126]">
            <span className="text-[#C6A15B] font-serif text-lg block mb-1">+250 pts</span>
            <span className="text-[#F5EFE7] font-medium block mb-1">Vintage Tasting Notes</span>
            <p className="text-[11px] text-[#918481] leading-relaxed">
              Submit verified tasting notes and pairing reviews for bottles in your cellar to help fellow Davao collectors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#100809] border border-[#392126]">
            <span className="text-[#C6A15B] font-serif text-lg block mb-1">+500 pts</span>
            <span className="text-[#F5EFE7] font-medium block mb-1">Cellar Lounge Tastings</span>
            <p className="text-[11px] text-[#918481] leading-relaxed">
              Receive 500 bonus points upon attending private sommelier tastings at our Lanang Flagship or Matina cellar.
            </p>
          </div>
        </div>
      </div>

      {/* 7. Perk Redemption Confirmation Modal */}
      {selectedPerkForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#1A080D] border border-[#C6A15B]/50 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPerkForModal(null)}
              className="absolute top-4 right-4 text-[#918481] hover:text-[#F5EFE7] p-1.5 transition-colors"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#7F1427] border border-[#D5B15C]/50 flex items-center justify-center text-[#D5B15C] mb-4">
              {getPerkIcon(selectedPerkForModal.iconName)}
            </div>

            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block mb-1">
              Confirm Privilege Redemption
            </span>
            <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-2">
              {selectedPerkForModal.title}
            </h3>
            <p className="text-xs text-[#C1B7B4] leading-relaxed mb-6">
              {selectedPerkForModal.description}
            </p>

            <div className="p-4 rounded-xl bg-[#100809] border border-[#392126] space-y-2 text-xs mb-6">
              <div className="flex justify-between text-[#C1B7B4]">
                <span>Current Available Balance:</span>
                <span className="font-mono text-[#F5EFE7]">{currentPoints.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-[#C1B7B4]">
                <span>Points Required:</span>
                <span className="font-mono text-[#D5B15C]">
                  {selectedPerkForModal.pointCost ? `-${selectedPerkForModal.pointCost.toLocaleString()} pts` : 'Complimentary'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#392126] font-medium text-[#F5EFE7]">
                <span>Remaining Balance After:</span>
                <span className="font-mono text-emerald-400">
                  {Math.max(0, currentPoints - (selectedPerkForModal.pointCost || 0)).toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPerkForModal(null)}
                className="py-2.5 px-4 rounded-lg text-xs font-medium text-[#B7AAA1] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRedeeming}
                onClick={() => handleConfirmRedeem(selectedPerkForModal)}
                className="py-2.5 px-6 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/50 shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                {isRedeeming ? (
                  <span>Generating Code...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#D5B15C]" />
                    <span>Confirm & Generate Voucher</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
