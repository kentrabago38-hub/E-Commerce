import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import {
  CheckCircle2,
  X,
  Package,
  Truck,
  Wine,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Compass
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeOrderConfirmation,
    setActiveOrderConfirmation,
    setIsAccountOpen,
    setActiveTab
  } = useWineStore();

  const [showTracker, setShowTracker] = useState(false);

  if (!activeOrderConfirmation) return null;

  const order = activeOrderConfirmation;

  const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStep = statuses.indexOf(order.status);

  const handleTrackMyOrder = () => {
    setShowTracker(true);
  };

  const handleDone = () => {
    setActiveOrderConfirmation(null);
    setShowTracker(false);
  };

  const handleGoToAccount = () => {
    setActiveOrderConfirmation(null);
    setShowTracker(false);
    setIsAccountOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={handleDone}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer"
          aria-label="Close confirmation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Content */}
        {!showTracker ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#210D12] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-[#C6A15B]" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
              Allocation Confirmed
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3">
              Thank You for Your Order.
            </h2>
            <p className="text-xs sm:text-sm text-[#B7AAA1] max-w-md mx-auto mb-8 font-light leading-relaxed">
              Your vintage selections have been secured in our climate-controlled vault. A confirmation receipt has been sent to <span className="text-[#C6A15B] font-mono">{order.email}</span>.
            </p>

            {/* Receipt Card */}
            <div className="p-6 rounded-2xl bg-[#210D12] border border-[#48151F] text-left text-xs mb-8 space-y-4">
              <div className="flex flex-wrap justify-between gap-2 pb-4 border-b border-[#48151F]">
                <div>
                  <span className="text-[#B7AAA1] uppercase tracking-wider block text-[10px]">Order Number</span>
                  <span className="font-semibold text-[#F5EFE7] text-sm">{order.order_id}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] uppercase tracking-wider block text-[10px]">Order Date</span>
                  <span className="font-semibold text-[#F5EFE7] text-sm">{order.order_date}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] uppercase tracking-wider block text-[10px]">Payment Method</span>
                  <span className="font-semibold text-[#F5EFE7] text-sm">{order.payment_method}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] uppercase tracking-wider block text-[10px]">Estimated Delivery</span>
                  <span className="font-semibold text-[#C6A15B] text-sm">{order.estimated_delivery}</span>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <span className="text-[#B7AAA1] uppercase tracking-wider text-[10px] block mb-2 font-semibold">
                  Items Purchased ({order.items.length})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.order_item_id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[#F5EFE7]">
                          {item.name} <span className="text-[#B7AAA1]">× {item.quantity}</span>
                        </span>
                      </div>
                      <span className="font-medium text-[#C6A15B] tabular-nums">{formatPeso(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="pt-3 border-t border-[#48151F]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[#B7AAA1] uppercase tracking-wider text-[10px] block">Delivery Address</span>
                  <p className="text-[#F5EFE7]">
                    {order.customer_name} · {order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postalCode}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[#B7AAA1] uppercase tracking-wider text-[10px] block">Total Amount</span>
                  <span className="font-serif text-xl text-[#C6A15B] font-semibold tabular-nums">
                    {formatPeso(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTrackMyOrder}
                className="flex-1 py-3.5 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg"
              >
                Track My Order
              </button>
              <button
                onClick={handleDone}
                className="py-3.5 px-6 rounded-lg border border-[#48151F] hover:border-[#C6A15B]/40 text-[#B7AAA1] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Live Tracking Stepper View */
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#48151F]">
              <div className="w-10 h-10 rounded-full bg-[#210D12] border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold block">
                  Cold-Chain Transit Monitor
                </span>
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal">
                  Order Status: #{order.order_id}
                </h3>
              </div>
            </div>

            {/* 4-Stage Stepper: Processing → Confirmed → Shipped → Delivered */}
            <div className="py-8 px-4 bg-[#210D12] rounded-2xl border border-[#48151F] mb-8">
              <div className="relative flex items-center justify-between">
                {/* Connecting bar */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#130B0D] z-0" />
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#861F32] transition-all duration-500 z-0"
                  style={{
                    width: `${(currentStep / (statuses.length - 1)) * 100}%`
                  }}
                />

                {statuses.map((s, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                          isDone
                            ? 'bg-[#861F32] text-white border-2 border-[#C6A15B]'
                            : 'bg-[#130B0D] text-[#B7AAA1] border border-[#48151F]'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-xs mt-2 text-center whitespace-nowrap font-medium ${
                          isCurrent ? 'text-[#C6A15B] font-bold' : isDone ? 'text-[#F5EFE7]' : 'text-[#B7AAA1]'
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Details */}
            <div className="space-y-3 p-4 rounded-xl bg-[#210D12] border border-[#48151F] text-xs mb-8">
              <div className="flex justify-between text-[#B7AAA1]">
                <span>Carrier Partner:</span>
                <span className="text-[#F5EFE7] font-medium">VinLogistics Insulated Cold-Chain</span>
              </div>
              <div className="flex justify-between text-[#B7AAA1]">
                <span>Tracking Number:</span>
                <span className="text-[#C6A15B] font-mono font-medium">{order.tracking_number}</span>
              </div>
              <div className="flex justify-between text-[#B7AAA1]">
                <span>Transit Temperature:</span>
                <span className="text-emerald-400 font-medium">Nominal: 13.8°C (Monitored)</span>
              </div>
              <div className="flex justify-between text-[#B7AAA1]">
                <span>Estimated Arrival:</span>
                <span className="text-[#F5EFE7] font-medium">{order.estimated_delivery}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowTracker(false)}
                className="py-2.5 px-4 text-xs text-[#B7AAA1] hover:text-[#F5EFE7] cursor-pointer"
              >
                Back to Receipt
              </button>
              <button
                onClick={handleGoToAccount}
                className="py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border border-[#C6A15B]/40"
              >
                View in Account History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
