import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import { LazyWineImage } from './LazyWineImage';
import {
  Truck,
  Check,
  CheckCircle2,
  Clock,
  Wine,
  PackageCheck,
  MapPin,
  Thermometer,
  Droplets,
  ShieldCheck,
  Copy,
  ArrowLeft,
  ChevronRight,
  Download,
  Calendar,
  CreditCard,
  Navigation,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface OrderTrackingProps {
  order?: Order | null;
  orders?: Order[];
  activeOrderId?: string | null;
  onSelectOrder?: (orderId: string) => void;
  onBackToOrders?: () => void;
  variant?: 'full' | 'compact' | 'timeline-only';
  className?: string;
  onViewReceipt?: (order: Order) => void;
}

export type TimelineStep = {
  id: 'Placed' | 'Preparing' | 'Shipped' | 'Delivered';
  label: string;
  subtitle: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: 'Placed',
    label: 'Placed',
    subtitle: 'Order Confirmed',
    detail: 'Allocation verified & logged in subterranean cellar register.',
    icon: Check
  },
  {
    id: 'Preparing',
    label: 'Preparing',
    subtitle: 'Vault Conditioning',
    detail: 'Stabilized to 14°C and secured in vibration-damping thermal packaging.',
    icon: PackageCheck
  },
  {
    id: 'Shipped',
    label: 'Shipped',
    subtitle: 'In Cold-Chain Transit',
    detail: 'Dispatched via refrigerated fleet with active temperature telemetry.',
    icon: Truck
  },
  {
    id: 'Delivered',
    label: 'Delivered',
    subtitle: 'Handed Over',
    detail: 'Safely received at address with cork & thermal integrity intact.',
    icon: CheckCircle2
  }
];

export function getOrderStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Processing':
      return 1; // Placed done, Preparing active
    case 'Confirmed':
      return 1; // Placed done, Preparing active
    case 'Shipped':
      return 2; // Placed & Preparing done, Shipped active
    case 'Delivered':
      return 3; // All done
    default:
      return 0;
  }
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  order: propOrder,
  orders = [],
  activeOrderId,
  onSelectOrder,
  onBackToOrders,
  variant = 'full',
  className = '',
  onViewReceipt
}) => {
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Resolve target order
  const activeOrder: Order | null =
    propOrder ||
    orders.find((o) => o.order_id === activeOrderId) ||
    orders[0] ||
    null;

  const handleCopyTracking = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedTrackingId(code);
    setTimeout(() => setCopiedTrackingId(null), 2500);
  };

  if (!activeOrder) {
    return (
      <div className={`p-8 text-center text-[#B7AAA1] bg-[#12070A] rounded-2xl border border-[#392126] ${className}`}>
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B]">
          <Truck className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-xl text-[#F5EFE7] mb-1 font-medium">No Order Selected for Tracking</h3>
        <p className="text-xs text-[#B7AAA1] max-w-sm mx-auto mb-4">
          Select an order from your purchase history to view its real-time progress and cold-chain timeline.
        </p>
        {onBackToOrders && (
          <button
            type="button"
            onClick={onBackToOrders}
            className="py-2 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold border border-[#D5B15C]/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Purchase History</span>
          </button>
        )}
      </div>
    );
  }

  const stepIndex = getOrderStepIndex(activeOrder.status);
  const trackingCode = activeOrder.tracking_number || `VNX-DVO-${activeOrder.order_id.replace(/^ord-/, '')}`;

  // ==========================================
  // COMPACT & TIMELINE-ONLY VARIANT (Embedded inside purchase history card)
  // ==========================================
  if (variant === 'compact' || variant === 'timeline-only') {
    return (
      <div className={`rounded-xl bg-[#14080B] border border-[#392126] p-4.5 ${className}`}>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#D5B15C] font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Truck className="w-3.5 h-3.5" />
              <span>Davao Cold-Chain Timeline</span>
            </span>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[11px] text-white/80">
              {trackingCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#B7AAA1]">
              Est. Arrival: <strong className="text-white">{activeOrder.estimated_delivery}</strong>
            </span>
            {onBackToOrders && (
              <button
                type="button"
                onClick={onBackToOrders}
                className="text-[11px] text-[#D5B15C] hover:text-white font-medium flex items-center gap-1 cursor-pointer ml-1"
                title="View full tracking details"
              >
                <span>Full Monitor</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Step Progress Bar: Placed -> Preparing -> Shipped -> Delivered */}
        <div className="relative pt-2 pb-1">
          {/* Background Track */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-[#281318] rounded-full z-0 hidden sm:block" />

          {/* Active Gradient Fill Track */}
          <div
            className="absolute top-6 left-6 h-1 bg-gradient-to-r from-[#D5B15C] via-[#E5D7B7] to-emerald-400 rounded-full z-0 transition-all duration-700 hidden sm:block"
            style={{
              width: `${(stepIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 3rem)'
            }}
          />

          {/* Grid of Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-1">
            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const isPending = idx > stepIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center sm:items-center text-center p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-[#2A0E14]/80 ring-1 ring-[#D5B15C]/60 shadow-lg'
                      : 'bg-transparent'
                  }`}
                >
                  {/* Step Node */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-2 ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-md shadow-emerald-950/50'
                        : isCurrent
                        ? 'bg-[#861F32] text-[#D5B15C] border-2 border-[#D5B15C] shadow-lg shadow-[#861F32]/80 scale-105'
                        : 'bg-[#180A0D] text-[#B7AAA1]/50 border border-white/10'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Step Name */}
                  <span
                    className={`text-xs uppercase tracking-wider font-bold block leading-tight ${
                      isCompleted
                        ? 'text-emerald-300'
                        : isCurrent
                        ? 'text-[#F5EFE7]'
                        : 'text-white/40'
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* State badge */}
                  <span
                    className={`text-[10px] mt-0.5 block ${
                      isCompleted
                        ? 'text-emerald-400/90'
                        : isCurrent
                        ? 'text-[#D5B15C] font-semibold'
                        : 'text-white/30'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info snippet */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Preserved at <strong>14°C cold-chain</strong> across Davao City</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyTracking(trackingCode)}
              className="text-[#D5B15C] hover:text-white flex items-center gap-1 cursor-pointer font-medium"
              title="Copy tracking number"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedTrackingId === trackingCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
            {onViewReceipt && (
              <>
                <span className="text-white/20">·</span>
                <button
                  type="button"
                  onClick={() => onViewReceipt(activeOrder)}
                  className="text-white/80 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D5B15C]" />
                  <span>Invoice</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL DASHBOARD VARIANT
  // ==========================================
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header & Navigation Back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#392126]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {onBackToOrders && (
              <button
                type="button"
                onClick={onBackToOrders}
                className="py-1 px-2.5 rounded-lg bg-[#210D12] hover:bg-[#351116] text-[#E5D7B7] hover:text-white border border-[#48151F] hover:border-[#D5B15C]/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D5B15C]" />
                <span>Purchase History</span>
              </button>
            )}
            <span className="text-[10px] uppercase tracking-widest text-[#D5B15C] font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Davao Cold-Chain Telemetry</span>
            </span>
            <span className="text-[#392126]">·</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active 14°C Assurance
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] font-medium leading-tight">
            Order Progress & Cold-Chain Tracking
          </h2>
          <p className="text-xs text-[#B7AAA1] mt-1 max-w-2xl leading-relaxed">
            Real-time subterranean cellar dispatch milestones, continuous 14°C cold-chain telemetry, and tamper-sealed delivery across Davao City.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onViewReceipt && (
            <button
              type="button"
              onClick={() => onViewReceipt(activeOrder)}
              className="py-2 px-3.5 rounded-xl bg-[#210D12] hover:bg-[#48151F] text-[#E5D7B7] hover:text-white border border-[#D5B15C]/40 hover:border-[#D5B15C] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="View and download printable boutique invoice"
            >
              <Download className="w-3.5 h-3.5 text-[#D5B15C]" />
              <span>Boutique Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Order Selector (when user has multiple orders in history) */}
      {orders.length > 1 && onSelectOrder && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-[11px] text-[#B7AAA1] uppercase tracking-wider font-semibold shrink-0 pr-1">
            Orders in History ({orders.length}):
          </span>
          {orders.map((ord) => {
            const isSelected = ord.order_id === activeOrder.order_id;
            return (
              <button
                key={ord.order_id}
                type="button"
                onClick={() => onSelectOrder(ord.order_id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#861F32] text-white border-[#D5B15C] shadow-md shadow-[#861F32]/50'
                    : 'bg-[#14080A] text-[#B7AAA1] hover:text-[#FDFBF7] border-[#392126] hover:border-white/30'
                }`}
              >
                <span>{ord.order_id}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider font-sans font-bold ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-950 text-emerald-300'
                      : ord.status === 'Shipped'
                      ? 'bg-blue-950 text-blue-300'
                      : 'bg-[#3A141C] text-[#D5B15C]'
                  }`}
                >
                  {ord.status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Order Overview Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#210D12] via-[#14080B] to-[#1E0B10] border border-[#48151F] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#861F32]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-mono text-base sm:text-lg font-bold text-[#D5B15C] tracking-wide">
                {activeOrder.order_id}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  activeOrder.status === 'Delivered'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                    : activeOrder.status === 'Shipped'
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-600'
                    : 'bg-[#351017] text-[#D5B15C] border border-[#D5B15C]/50'
                }`}
              >
                {activeOrder.status}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs text-[#F5EFE7] font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D5B15C]" />
                <span>Placed {activeOrder.order_date}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#B7AAA1]">
              <div className="flex items-center gap-1.5">
                <span>Tracking Number:</span>
                <span className="font-mono font-bold text-white bg-black/60 px-2.5 py-0.5 rounded border border-white/10">
                  {trackingCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(trackingCode)}
                  className="p-1 rounded hover:bg-white/10 text-[#D5B15C] transition-colors cursor-pointer"
                  title="Copy tracking code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copiedTrackingId === trackingCode && (
                  <span className="text-[10px] text-emerald-400 font-semibold animate-fade-in">
                    Copied!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span>Payment:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#D5B15C]" />
                  {activeOrder.payment_method}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-[#B7AAA1] block mb-0.5 font-semibold">
              Total Valuation
            </span>
            <span className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] font-bold tabular-nums">
              {formatPeso(activeOrder.total_amount)}
            </span>
            <span className="text-[11px] text-[#D5B15C] mt-0.5 font-medium">
              {activeOrder.items.reduce((s, it) => s + it.quantity, 0)} bottle(s) · Davao Direct Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          VISUAL PROGRESS TIMELINE (Placed, Preparing, Shipped, Delivered)
          ======================================================== */}
      <div className="rounded-2xl bg-[#12070A] border border-[#392126] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#D5B15C] font-bold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#D5B15C]" />
              <span>Consignment Milestone Timeline</span>
            </span>
            <p className="text-xs text-[#B7AAA1] mt-0.5">
              Live status tracking from our subterranean vault to your doorstep.
            </p>
          </div>
          <span className="text-xs text-[#E5D7B7] bg-[#210D12] px-3 py-1 rounded-full border border-[#48151F] font-semibold self-start sm:self-auto">
            Stage {Math.min(stepIndex + 1, 4)} of 4: {TIMELINE_STEPS[stepIndex]?.label || 'Active'}
          </span>
        </div>

        {/* Timeline Graphical Bar & Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            const isPending = idx > stepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#180A0E] border-emerald-500/40 shadow-md'
                    : isCurrent
                    ? 'bg-gradient-to-b from-[#2A0E15] to-[#19090D] border-[#D5B15C] shadow-xl shadow-[#861F32]/40 ring-1 ring-[#D5B15C]/60 scale-[1.02]'
                    : 'bg-[#100608]/70 border-[#2A1117] opacity-75'
                }`}
              >
                {/* Connecting Line between cards on medium+ displays */}
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`hidden md:block absolute -right-2 top-8 w-4 h-0.5 z-10 ${
                      idx < stepIndex ? 'bg-emerald-400' : 'bg-[#392126]'
                    }`}
                  />
                )}

                <div>
                  {/* Step Header with Node & Status */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-md shadow-emerald-900/40'
                          : isCurrent
                          ? 'bg-[#861F32] text-[#D5B15C] border-2 border-[#D5B15C] shadow-lg shadow-[#861F32]/80 animate-pulse'
                          : 'bg-[#14080B] text-white/40 border border-[#392126]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                          : isCurrent
                          ? 'bg-[#D5B15C]/20 text-[#D5B15C] border border-[#D5B15C]/50 animate-pulse'
                          : 'bg-black/40 text-white/40 border border-white/5'
                      }`}
                    >
                      {isCompleted ? 'Done' : isCurrent ? 'Active Stage' : 'Pending'}
                    </span>
                  </div>

                  {/* Stage Label & Subtitle */}
                  <div className="mb-2">
                    <span className="text-[11px] font-mono text-[#D5B15C] font-semibold uppercase block">
                      Stage 0{idx + 1}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#FDFBF7] tracking-wide">
                      {step.label}
                    </h3>
                    <span className="text-xs text-[#E5D7B7] font-medium block mt-0.5">
                      {step.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-[#B7AAA1] leading-relaxed mb-4">
                    {step.detail}
                  </p>
                </div>

                {/* Milestone timestamp/estimate */}
                <div className="pt-3 border-t border-white/10 text-[10px] font-mono">
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      <span>{activeOrder.order_date} · Completed</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[#D5B15C] flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>In Progress now</span>
                    </span>
                  ) : (
                    <span className="text-white/40">
                      Est: {activeOrder.estimated_delivery}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Cold-Chain Telemetry Hub */}
      <div className="rounded-2xl bg-[#12070A] border border-[#48151F] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#392126]">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#D5B15C]" />
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#FDFBF7]">
              Live 14°C Telemetry & Cork Integrity Monitor
            </h3>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono self-start sm:self-auto font-semibold">
            Sensor: CALIBRATED (ISO-14001)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#180A0D] border border-[#392126]">
            <div className="flex items-center justify-between text-[#D5B15C] text-[10px] uppercase tracking-wider mb-1 font-semibold">
              <span>Compartment Temp</span>
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xl sm:text-2xl text-[#FDFBF7] font-bold block">
              {activeOrder.status === 'Delivered' ? '13.5°C' : '13.2°C'}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
              Optimal range: 12°C – 15°C
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#180A0D] border border-[#392126]">
            <div className="flex items-center justify-between text-[#D5B15C] text-[10px] uppercase tracking-wider mb-1 font-semibold">
              <span>Relative Humidity</span>
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xl sm:text-2xl text-[#FDFBF7] font-bold block">
              70% RH
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
              Cork Elasticity Protected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#180A0D] border border-[#392126]">
            <div className="flex items-center justify-between text-[#D5B15C] text-[10px] uppercase tracking-wider mb-1 font-semibold">
              <span>Anti-Shock G-Force</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xl sm:text-2xl text-[#FDFBF7] font-bold block">
              0.02 G
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
              Suspension Damping Active
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#180A0D] border border-[#392126]">
            <div className="flex items-center justify-between text-[#D5B15C] text-[10px] uppercase tracking-wider mb-1 font-semibold">
              <span>Delivery Sector</span>
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-sm sm:text-base text-[#FDFBF7] font-bold block truncate">
              {activeOrder.delivery_address.city}, Davao
            </span>
            <span className="text-[10px] text-white/60 block mt-1 truncate">
              {activeOrder.delivery_address.street}
            </span>
          </div>
        </div>
      </div>

      {/* Consignment Allocated Bottles */}
      <div className="rounded-2xl bg-[#12070A] border border-[#392126] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#392126]">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#FDFBF7]">
              Bottles Allocated in this Consignment
            </h3>
            <span className="text-[11px] text-[#B7AAA1]">
              {activeOrder.items.length} vintage selection(s) · Direct winery provenance guarantee
            </span>
          </div>
          <span className="font-mono text-base font-bold text-[#D5B15C]">
            {formatPeso(activeOrder.total_amount)}
          </span>
        </div>

        <div className="space-y-3">
          {activeOrder.items.map((it) => (
            <div
              key={it.order_item_id}
              className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#180A0D] border border-[#392126]/60 hover:border-[#D5B15C]/40 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 p-1 flex items-center justify-center">
                  <LazyWineImage
                    src={it.image}
                    alt={it.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-[#FDFBF7] truncate">
                    {it.name}
                  </h4>
                  <span className="text-[11px] text-[#E5D7B7] block truncate">
                    {it.winery} · Vintage {it.vintage} · {it.wine_type}
                  </span>
                  <span className="text-[10px] text-white/60 block mt-0.5">
                    Qty: <strong className="text-white">{it.quantity}</strong> allocation(s)
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-[#FDFBF7] block">
                  {formatPeso(it.price * it.quantity)}
                </span>
                <span className="text-[10px] text-white/50 block font-mono">
                  {formatPeso(it.price)} each
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
