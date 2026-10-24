import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Wine,
  Tag,
  Check,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    setIsCheckoutOpen,
    setActiveTab,
    showToast,
    user,
    setIsAuthModalOpen,
    setAuthModalMode,
    setAuthRedirectReason
  } = useWineStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountFlat, setDiscountFlat] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');

  if (!isCartOpen) return null;

  // Free shipping threshold: ₱5,000
  const shippingCost = cartSubtotal >= 5000 || cartSubtotal === 0 ? 0 : 350;
  const discountAmount = discountPercent > 0
    ? (cartSubtotal * discountPercent) / 100
    : discountFlat > 0
    ? Math.min(discountFlat, cartSubtotal)
    : 0;

  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'VINEA10') {
      setDiscountPercent(10);
      setDiscountFlat(0);
      setAppliedCoupon('VINEA10 (10% Off)');
      showToast('Promo code VINEA10 applied: 10% discount!', 'success');
      setCouponCode('');
    } else if (code === 'SOMMELIER') {
      setDiscountFlat(1500);
      setDiscountPercent(0);
      setAppliedCoupon('SOMMELIER (₱1,500 Off)');
      showToast('Sommelier VIP credit applied: ₱1,500 discount!', 'success');
      setCouponCode('');
    } else {
      showToast('Invalid promotion code. Try "VINEA10" or "SOMMELIER"', 'error');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      setAuthRedirectReason('An active customer account (21+) is required to order wine allocations and arrange climate-controlled Davao delivery.');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in text-[#F5EFE7]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#130B0D] border-l border-[#48151F] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#48151F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C6A15B]" />
              <h2 className="font-serif text-2xl text-[#F5EFE7] font-normal">
                Cellar Cart ({cart.reduce((a, c) => a + c.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-[#B7AAA1] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center justify-center text-[#C6A15B]">
                  <Wine className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#F5EFE7] font-normal mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-xs text-[#B7AAA1] max-w-xs mx-auto mb-6 font-light leading-relaxed">
                  Discover remarkable vintages from Bordeaux, Tuscany, Provence, and beyond to populate your cellar.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('shop');
                  }}
                  className="py-3 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Explore Wines
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="p-3.5 rounded-xl bg-[#210D12] border border-[#48151F] flex items-center gap-3.5"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-20 rounded-lg object-cover bg-black/30 border border-[#48151F] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#C6A15B] uppercase tracking-wider block">
                      {item.product.winery} · {item.product.vintage}
                    </span>
                    <h4 className="font-serif text-base text-[#F5EFE7] font-normal truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-[#B7AAA1] mb-2">
                      {formatPeso(item.product.price)} each
                    </p>

                    {/* Quantity controls & remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#48151F] rounded-md bg-[#130B0D]">
                        <button
                          onClick={() => updateCartQuantity(item.cart_item_id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#B7AAA1] hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold tabular-nums text-[#F5EFE7]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cart_item_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs text-[#B7AAA1] hover:text-white cursor-pointer disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="text-[#B7AAA1]/60 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Remove bottle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary (only if cart has items) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#48151F] bg-[#130B0D] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B7AAA1]/50" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon (e.g. VINEA10)"
                    className="w-full pl-8 pr-3 py-2 bg-[#210D12] border border-[#48151F] rounded-lg text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/50 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-3.5 rounded-lg bg-[#48151F] hover:bg-[#861F32] text-[#C6A15B] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#C6A15B]/30 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-400 px-2">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Coupon Active: {appliedCoupon}
                  </span>
                  <button
                    onClick={() => {
                      setDiscountPercent(0);
                      setDiscountFlat(0);
                      setAppliedCoupon('');
                    }}
                    className="text-[11px] text-[#B7AAA1] hover:text-white underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#B7AAA1] border-t border-[#48151F] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#F5EFE7]">{formatPeso(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">-{formatPeso(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold tabular-nums text-[#F5EFE7]">
                    {shippingCost === 0 ? 'Complimentary' : formatPeso(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#F5EFE7] pt-2 border-t border-[#48151F]">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-xl text-[#C6A15B] tabular-nums">
                    {formatPeso(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 border border-[#C6A15B]/40 transition-all cursor-pointer shadow-xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-lg bg-transparent hover:bg-white/5 text-[#B7AAA1] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#B7AAA1]/60 pt-1">
                <ShieldCheck className="w-3 h-3 text-[#C6A15B]" />
                <span>Secure climate-controlled transit with ID verification upon delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
