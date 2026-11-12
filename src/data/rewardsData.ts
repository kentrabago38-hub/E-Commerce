import { MemberPerk, LoyaltyTier, LoyaltyHistoryItem, User, Order, UserVoucher, VoucherDiscountType } from '../types/wine';

export interface TierInfo {
  tier: LoyaltyTier;
  minPoints: number;
  multiplier: number;
  multiplierLabel: string;
  tagline: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
  highlights: string[];
}

export const LOYALTY_TIERS: Record<LoyaltyTier, TierInfo> = {
  Connoisseur: {
    tier: 'Connoisseur',
    minPoints: 0,
    multiplier: 1.0,
    multiplierLabel: '1.0x (10 pts per ₱100)',
    tagline: 'Founding Cellar Member',
    badgeBg: 'bg-[#1a0f12]',
    badgeBorder: 'border-[#5a242d]',
    badgeText: 'text-[#d6a56c]',
    accentColor: '#c59d5f',
    highlights: [
      'Earn 10 points for every ₱100 spent on all fine wines',
      '5% Birthday cellar voucher credited annually',
      'Quarterly Davao sommelier tasting notes digest',
      'Access to VÍNEA Davao temperature-controlled locker reservation',
    ]
  },
  'Grand Cru': {
    tier: 'Grand Cru',
    minPoints: 2500,
    multiplier: 1.5,
    multiplierLabel: '1.5x (15 pts per ₱100)',
    tagline: 'Distinguished Collector',
    badgeBg: 'bg-gradient-to-r from-[#2c0e16] to-[#170a0d]',
    badgeBorder: 'border-[#c59d5f]',
    badgeText: 'text-[#e5c287]',
    accentColor: '#e5c287',
    highlights: [
      '1.5x Points accelerator (15 pts per ₱100 spent)',
      '100% Free Davao Climate-Controlled White-Glove Delivery (No minimum)',
      '1 Complimentary Private Sommelier Tasting Session (2 Guests) annually',
      '48-Hour Priority Early Access to Limited Library Releases',
      'Direct WhatsApp concierge channel for Davao branch bottle reserves'
    ]
  },
  'Sommelier Reserve': {
    tier: 'Sommelier Reserve',
    minPoints: 7500,
    multiplier: 2.0,
    multiplierLabel: '2.0x (20 pts per ₱100)',
    tagline: 'Prestige Patron & Guild Fellow',
    badgeBg: 'bg-gradient-to-r from-[#3f121d] via-[#1a080d] to-[#2a0d13]',
    badgeBorder: 'border-[#f2d89b]',
    badgeText: 'text-[#f6dfab]',
    accentColor: '#f6dfab',
    highlights: [
      '2.0x Double Points on all rare cellar acquisitions',
      'Guaranteed En Primeur Bordeaux & Napa Cult Allocation reservations',
      'Complimentary VIP Pass to Annual Davao Harvest Gala & Vintners Dinner',
      'Personalized Laser-Engraved Wooden Collector Crate on multi-bottle orders',
      '24/7 Direct line to VÍNEA Executive Resident Sommelier',
      'Free private climate locker at VÍNEA Lanang Subterranean Vault'
    ]
  }
};

export const MEMBER_PERKS: MemberPerk[] = [
  {
    id: 'perk-white-glove-delivery',
    title: 'White-Glove 14°C Davao Cold-Chain Delivery',
    tagline: 'Subterranean van transit directly to your door in Davao City',
    description: 'Bypass standard delivery fees. Every bottle arrives preserved inside active 14°C temperature-monitored isothermal chambers across Lanang, Matina, Buhangin, Toril, and Poblacion.',
    tierRequired: 'Connoisseur',
    pointCost: 400,
    isComplimentaryForTier: true, // Auto-unlocked for Grand Cru and above
    category: 'delivery',
    valueLabel: '₱450 Value / Free for Grand Cru+',
    iconName: 'Truck',
    codePrefix: 'COLDCHAIN'
  },
  {
    id: 'perk-sommelier-tasting',
    title: 'Private Sommelier Tasting Session (2 Guests)',
    tagline: 'Guided 4-vintage sensory flight in Lanang Subterranean Vault',
    description: 'An exclusive 60-minute private consultation and tasting flight hosted by our certified sommelier. Includes artisan cheeses, charcuterie board, and crystal decanting instruction.',
    tierRequired: 'Grand Cru',
    pointCost: 1500,
    category: 'sommelier',
    valueLabel: '₱3,500 Experience Value',
    iconName: 'Wine',
    codePrefix: 'SOMM-FLIGHT'
  },
  {
    id: 'perk-voucher-1000',
    title: '₱1,000 Cellar Credit Voucher',
    tagline: 'Instant checkout discount applicable to any vintage',
    description: 'Redeem 1,000 loyalty points for an immediate ₱1,000 credit deduction at checkout. Valid on Bordeaux, Champagne, Burgundy, and Italian reserves.',
    tierRequired: 'Connoisseur',
    pointCost: 1000,
    category: 'voucher',
    valueLabel: '₱1,000 Instant Credit',
    iconName: 'Award',
    codePrefix: 'VINEA-1000'
  },
  {
    id: 'perk-voucher-2500',
    title: '₱2,500 Cellar Credit Voucher',
    tagline: 'High-value collector allocation credit at discounted point rate',
    description: 'Redeem 2,200 loyalty points (special Grand Cru discounted rate) for ₱2,500 direct cellar purchasing power. Stacks with member seasonal offers.',
    tierRequired: 'Grand Cru',
    pointCost: 2200,
    category: 'voucher',
    valueLabel: '₱2,500 Instant Credit (Save 300 pts)',
    iconName: 'Award',
    codePrefix: 'VINEA-2500'
  },
  {
    id: 'perk-en-primeur',
    title: 'En Primeur & Pre-Release Allocation Rights',
    tagline: '48-hour priority reservation on scarce international imports',
    description: 'Exclusive reservation window for First Growth Bordeaux, rare Burgundy Premier Crus, and limited-yield Napa Cabernet allocations before public storefront availability.',
    tierRequired: 'Grand Cru',
    pointCost: 0,
    isComplimentaryForTier: true,
    category: 'allocation',
    valueLabel: 'Exclusive Member Privilege',
    iconName: 'Sparkles',
    codePrefix: 'PRIMEUR'
  },
  {
    id: 'perk-engraved-crate',
    title: 'Artisan Laser-Etched Wooden Collector Crate',
    tagline: 'Custom French pine 3-bottle storage box with your monogram',
    description: 'Handcrafted solid cedarwood presentation crate finished with brass hinges, velvet interior resting groove, and your family crest or personal initials laser-engraved.',
    tierRequired: 'Grand Cru',
    pointCost: 1800,
    category: 'experience',
    valueLabel: '₱2,800 Bespoke Woodcraft',
    iconName: 'Package',
    codePrefix: 'CRATE-VIP'
  },
  {
    id: 'perk-harvest-gala',
    title: 'Annual Davao Harvest Gala & Vintners Dinner Pass',
    tagline: '6-course gastronomic wine pairing banquet with guest winemakers',
    description: 'Join international winemakers and fellow esteemed collectors at VÍNEA’s annual black-tie harvest banquet in Davao. Includes vintage Champagne reception and rare library pourings.',
    tierRequired: 'Sommelier Reserve',
    pointCost: 4500,
    isComplimentaryForTier: true, // 1 free pass per season for Sommelier Reserve
    category: 'experience',
    valueLabel: '₱8,500 Black-Tie Gala Ticket',
    iconName: 'Award',
    codePrefix: 'GALA-INVITE'
  },
  {
    id: 'perk-riedel-glassware',
    title: 'Riedel Vinum Bordeaux Crystal Stemware Pair',
    tagline: 'Set of two varietal-specific Austrian lead-free crystal glasses',
    description: 'Engineered by Riedel to accentuate Cabernet Sauvignon, Merlot, and Bordeaux blends by directing the flow to the palate center for optimum tannin integration.',
    tierRequired: 'Connoisseur',
    pointCost: 2000,
    category: 'experience',
    valueLabel: '₱3,200 Austrian Glassware',
    iconName: 'Wine',
    codePrefix: 'RIEDEL-PAIR'
  }
];

export const INITIAL_LOYALTY_HISTORY_MARIA: LoyaltyHistoryItem[] = [
  {
    id: 'hist-001',
    date: 'Sep 28, 2026',
    title: 'Order Allocation #VN-98421 Completed',
    description: 'Château Lumière Cabernet Sauvignon & Provençal Rosé purchase (1.5x Grand Cru accelerator applied)',
    points: 2450,
    type: 'order'
  },
  {
    id: 'hist-002',
    date: 'Aug 14, 2026',
    title: 'Davao Flagship Cellar Tasting Visit',
    description: 'Attended Premier Crus sensory workshop at VÍNEA Lanang Subterranean Lounge',
    points: 500,
    type: 'bonus'
  },
  {
    id: 'hist-003',
    date: 'Jul 02, 2026',
    title: 'Cellar Review & Sommelier Tasting Notes Submission',
    description: 'Reviewed Château Margaux 2015 and awarded community collector rating',
    points: 250,
    type: 'review'
  },
  {
    id: 'hist-004',
    date: 'Jun 18, 2026',
    title: 'Annual Birthday Vintage Bonus',
    description: 'Complimentary celebratory cellar credit from VÍNEA Cellarmasters',
    points: 650,
    type: 'bonus'
  }
];

export const INITIAL_LOYALTY_HISTORY_ROBERTO: LoyaltyHistoryItem[] = [
  {
    id: 'hist-r1',
    date: 'Aug 20, 2026',
    title: 'Welcome Cellar Member Enrolment',
    description: 'Verified collector onboarding bonus for VÍNEA Davao portal',
    points: 500,
    type: 'welcome'
  },
  {
    id: 'hist-r2',
    date: 'Sep 10, 2026',
    title: 'Matina Cellar Allocation Purchase',
    description: 'Bodega Solaria Gran Reserva 2018 acquisition',
    points: 700,
    type: 'order'
  }
];

export function calculatePointsForOrder(subtotal: number, tier: LoyaltyTier): number {
  const tierInfo = LOYALTY_TIERS[tier] || LOYALTY_TIERS.Connoisseur;
  // 10 pts per 100 peso base * multiplier
  const basePoints = Math.floor(subtotal / 10);
  return Math.round(basePoints * (tierInfo.multiplier || 1.0));
}

export function determineTierFromPoints(points: number): LoyaltyTier {
  if (points >= LOYALTY_TIERS['Sommelier Reserve'].minPoints) {
    return 'Sommelier Reserve';
  }
  if (points >= LOYALTY_TIERS['Grand Cru'].minPoints) {
    return 'Grand Cru';
  }
  return 'Connoisseur';
}

export const PUBLIC_PROMO_VOUCHERS: Record<string, UserVoucher> = {
  VINEA10: {
    voucher_id: 'promo-vinea10',
    code: 'VINEA10',
    title: 'VÍNEA Cellar 10% Privilege',
    description: '10% courtesy cellar savings on your fine wine order',
    discount_type: 'percent',
    discount_value: 10,
    status: 'active',
    created_at: 'Seasonal Privilege',
    is_public_promo: true
  },
  SOMMELIER: {
    voucher_id: 'promo-sommelier',
    code: 'SOMMELIER',
    title: 'Sommelier Reserve ₱1,500 Credit',
    description: '₱1,500 direct cellar allocation deduction',
    discount_type: 'fixed',
    discount_value: 1500,
    status: 'active',
    created_at: 'Sommelier Privilege',
    is_public_promo: true
  }
};

export interface PerkBenefit {
  discountType: VoucherDiscountType;
  discountValue: number;
  label: string;
}

export function getPerkBenefit(perkId: string): PerkBenefit {
  switch (perkId) {
    case 'perk-voucher-1000':
      return { discountType: 'fixed', discountValue: 1000, label: '₱1,000 Off' };
    case 'perk-voucher-2500':
      return { discountType: 'fixed', discountValue: 2500, label: '₱2,500 Off' };
    case 'perk-white-glove-delivery':
      return { discountType: 'free_shipping', discountValue: 350, label: 'Free Cold-Chain Delivery' };
    case 'perk-sommelier-tasting':
      return { discountType: 'perk', discountValue: 0, label: 'Private Tasting Pass (2 Guests)' };
    case 'perk-en-primeur':
      return { discountType: 'perk', discountValue: 0, label: 'En Primeur Priority Access' };
    case 'perk-engraved-crate':
      return { discountType: 'perk', discountValue: 0, label: 'Monogrammed Wooden Crate' };
    case 'perk-harvest-gala':
      return { discountType: 'perk', discountValue: 0, label: 'Harvest Gala VIP Pass' };
    case 'perk-riedel-glassware':
      return { discountType: 'perk', discountValue: 0, label: 'Riedel Crystal Stemware Pair' };
    default:
      return { discountType: 'perk', discountValue: 0, label: 'VIP Cellar Privilege' };
  }
}

export function extractUserVouchers(user: User | null, orders: Order[] = []): UserVoucher[] {
  if (!user) return [];

  const userOrders = orders.filter(
    o =>
      o.user_id === user.user_id ||
      (o.email && user.email && o.email.toLowerCase() === user.email.toLowerCase())
  );

  const usedCodesMap = new Map<string, { orderId: string; date: string }>();
  userOrders.forEach(o => {
    if (o.discount_code && o.discount_code.trim()) {
      usedCodesMap.set(o.discount_code.trim().toUpperCase(), {
        orderId: o.order_id,
        date: o.order_date
      });
    }
  });

  const voucherMap = new Map<string, UserVoucher>();

  (user.vouchers || []).forEach(v => {
    if (!v || !v.code) return;
    const upperCode = v.code.trim().toUpperCase();
    const orderUse = usedCodesMap.get(upperCode);
    voucherMap.set(upperCode, {
      ...v,
      code: upperCode,
      status: orderUse ? 'used' : v.status,
      used_at: orderUse ? orderUse.date : v.used_at,
      order_id: orderUse ? orderUse.orderId : v.order_id
    });
  });

  // Backfill any previously redeemed codes stored in rewards_history
  (user.rewards_history || []).forEach(item => {
    if (!item.code || !item.code.trim()) return;
    const upperCode = item.code.trim().toUpperCase();
    if (voucherMap.has(upperCode)) return;

    const cleanTitle = item.title.replace(/^(Redeemed|Activated):\s*/i, '').trim();
    const matchedPerk = MEMBER_PERKS.find(
      p => p.title.toLowerCase() === cleanTitle.toLowerCase() || cleanTitle.toLowerCase().includes(p.title.toLowerCase())
    );
    const benefit = getPerkBenefit(matchedPerk?.id || '');
    const orderUse = usedCodesMap.get(upperCode);

    voucherMap.set(upperCode, {
      voucher_id: `vch-${item.id}`,
      code: upperCode,
      perk_id: matchedPerk?.id,
      title: matchedPerk?.title || cleanTitle,
      description: matchedPerk?.tagline || item.description,
      discount_type: benefit.discountType,
      discount_value: benefit.discountValue,
      status: orderUse ? 'used' : 'active',
      created_at: item.date,
      used_at: orderUse?.date,
      order_id: orderUse?.orderId
    });
  });

  return Array.from(voucherMap.values());
}
