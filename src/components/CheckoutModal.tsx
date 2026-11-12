import React, { useState, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { OrderItem, DeliveryAddress } from '../types/wine';
import { formatPeso } from '../utils/formatCurrency';
import {
  X,
  CheckCircle2,
  CreditCard,
  Wallet,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Wine,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Calendar,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Tag,
  Ticket,
  Check
} from 'lucide-react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';
import { DAVAO_BRANCHES } from '../data/mockData';
import {
  validateGmail,
  validatePhone11Digit,
  validateAddress,
  validateFullName,
  validatePassword
} from '../utils/validation';

export const CheckoutModal: React.FC = () => {

  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    user,
    loginCustomer,
    registerCustomer,
    placeOrder,
    userVouchers,
    appliedVoucher,
    applyVoucherCode,
    removeAppliedVoucher,
    calculateOrderTotals
  } = useWineStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  // Auth gate mode if not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form in auth gate
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+63 917 ');
  const [regDob, setRegDob] = useState('1998-05-20');
  const [regBranch, setRegBranch] = useState(DAVAO_BRANCHES[0]?.name || 'VÍNEA Lanang Flagship & Subterranean Cellar');
  const [regStreet, setRegStreet] = useState('');
  const [regError, setRegError] = useState('');

  // Validation Error States
  const [contactErrors, setContactErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});
  const [addressErrors, setAddressErrors] = useState<{ street?: string; city?: string; state?: string; postalCode?: string }>({});
  const [regFieldErrors, setRegFieldErrors] = useState<{ name?: string; email?: string; phone?: string; street?: string; password?: string }>({});

  // Checkout Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '0917');

  // Step 2 Address State
  const defaultAddr = user?.saved_addresses?.[0] || {
    street: 'Lanang Executive Homes, J.P. Laurel Ave',
    city: 'Davao City',
    state: 'Davao del Sur',
    postalCode: '8000',
    country: 'Philippines'
  };

  const [street, setStreet] = useState(defaultAddr.street);
  const [city, setCity] = useState(defaultAddr.city);
  const [stateProv, setStateProv] = useState(defaultAddr.state);
  const [postalCode, setPostalCode] = useState(defaultAddr.postalCode);
  const [country, setCountry] = useState(defaultAddr.country);

  // Step 3 Payment State
  const [paymentMethod, setPaymentMethod] = useState<'Credit/Debit Card' | 'E-Wallet' | 'Cash on Delivery'>('Credit/Debit Card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Sync with user whenever user logs in
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.saved_addresses?.[0]) {
        setStreet(user.saved_addresses[0].street);
        setCity(user.saved_addresses[0].city);
        setStateProv(user.saved_addresses[0].state);
        setPostalCode(user.saved_addresses[0].postalCode);
        setCountry(user.saved_addresses[0].country);
      }
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const activeWalletVouchers = userVouchers.filter(v => v.status === 'active');
  const { shippingCost, discountAmount, shippingDiscount, totalAmount } = calculateOrderTotals(cartSubtotal, appliedVoucher);

  const handleApplyVoucher = () => {
    setVoucherError('');
    const res = applyVoucherCode(voucherInput);
    if (res.success) {
      setVoucherInput('');
    } else {
      setVoucherError(res.message);
    }
  };

  const handleAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailCheck = validateGmail(loginEmail);
    if (!emailCheck.isValid) {
      setLoginError(emailCheck.error || 'Please enter your registered @gmail.com address.');
      return;
    }

    const res = loginCustomer(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleAuthRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const errors: { name?: string; email?: string; phone?: string; street?: string; password?: string } = {};

    const nameRes = validateFullName(regName);
    if (!nameRes.isValid) errors.name = nameRes.error;

    const emailRes = validateGmail(regEmail);
    if (!emailRes.isValid) errors.email = emailRes.error;

    const phoneRes = validatePhone11Digit(regPhone);
    if (!phoneRes.isValid) errors.phone = phoneRes.error;

    if (regPassword.length < 6) errors.password = 'Password must be at least 6 characters.';

    if (regStreet.trim()) {
      const addrRes = validateAddress({
        street: regStreet.trim(),
        city: 'Davao City',
        state: 'Davao del Sur',
        postalCode: '8000'
      });
      if (!addrRes.isValid && addrRes.errors.street) {
        errors.street = addrRes.errors.street;
      }
    }

    setRegFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setRegError(Object.values(errors)[0] || 'Please correct the highlighted fields.');
      return;
    }

    const res = registerCustomer({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      date_of_birth: regDob,
      favorite_davao_branch: regBranch,
      saved_addresses: regStreet.trim() ? [
        {
          street: regStreet.trim(),
          city: 'Davao City',
          state: 'Davao del Sur',
          postalCode: '8000',
          country: 'Philippines'
        }
      ] : undefined
    });
    if (!res.success) {
      setRegError(res.error || 'Failed to create customer account.');
    }
  };

  const handleContinueToDelivery = () => {
    const errors: { fullName?: string; email?: string; phone?: string } = {};

    const nameRes = validateFullName(fullName);
    if (!nameRes.isValid) errors.fullName = nameRes.error;

    const emailRes = validateGmail(email);
    if (!emailRes.isValid) errors.email = emailRes.error;

    const phoneRes = validatePhone11Digit(phone);
    if (!phoneRes.isValid) errors.phone = phoneRes.error;

    setContactErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (emailRes.normalized) setEmail(emailRes.normalized);
    if (phoneRes.normalized) setPhone(phoneRes.normalized);

    setStep(2);
  };

  const handleContinueToPayment = () => {
    const addrRes = validateAddress({
      street,
      city,
      state: stateProv,
      postalCode,
      country
    });

    setAddressErrors(addrRes.errors);

    if (!addrRes.isValid) {
      return;
    }

    setStep(3);
  };

  const handlePlaceOrder = () => {
    if (!user) return;

    // Verify contact info
    const emailRes = validateGmail(email);
    const phoneRes = validatePhone11Digit(phone);
    if (!emailRes.isValid || !phoneRes.isValid) {
      setStep(1);
      return;
    }

    // Verify address
    const addrRes = validateAddress({
      street,
      city,
      state: stateProv,
      postalCode,
      country
    });
    if (!addrRes.isValid) {
      setStep(2);
      return;
    }

    const orderItems: OrderItem[] = cart.map((item) => ({
      order_item_id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      product_id: item.product_id,
      name: item.product.name,
      winery: item.product.winery,
      vintage: item.product.vintage,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image,
      wine_type: item.product.wine_type
    }));

    const deliveryAddress: DeliveryAddress = {
      street: street.trim(),
      city: city.trim(),
      state: stateProv.trim(),
      postalCode: postalCode.trim(),
      country
    };

    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    try {
      placeOrder({
        user_id: user.user_id,
        customer_name: fullName.trim(),
        email: emailRes.normalized || email.trim(),
        phone: phoneRes.normalized || phone.trim(),
        subtotal: cartSubtotal,
        shipping: shippingCost,
        discount: discountAmount,
        discount_code: appliedVoucher?.code,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        items: orderItems,
        estimated_delivery: estimatedDelivery
      });
      setIsCheckoutOpen(false);
    } catch (e: any) {
      console.warn('Checkout error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-4 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* IF NOT LOGGED IN: MANDATORY CUSTOMER AUTHENTICATION GATE       */}
        {/* ------------------------------------------------------------- */}
        {!user ? (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#48151F] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-xl">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-[#C6A15B] text-[11px] uppercase tracking-[0.2em] font-semibold mb-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Account Required to Order</span>
              </div>
              <h2 className="font-serif text-3xl text-[#F5EFE7] font-normal mb-1">
                Customer Sign-In
              </h2>
              <p className="text-xs text-[#B7AAA1] font-light max-w-md mx-auto leading-relaxed">
                VÍNEA offers alcoholic beverages. To ensure compliance with legal age requirements (21+) and coordinate cold-chain Davao delivery, you must sign in or create an account before checkout.
              </p>
            </div>

            {/* Mode switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#210D12] border border-[#48151F] mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); }}
                className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#861F32] text-white shadow-md border border-[#C6A15B]/40 font-medium'
                    : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
                }`}
              >
                Sign In to Checkout
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegError(''); }}
                className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#861F32] text-white shadow-md border border-[#C6A15B]/40 font-medium'
                    : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
                }`}
              >
                Create Account & Order
              </button>
            </div>

            {/* Login Tab */}
            {authMode === 'login' && (
              <form onSubmit={handleAuthLogin} className="space-y-4 text-xs">
                {loginError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="collector@example.ph"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-black/50 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-black/50 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!loginEmail || !loginPassword}
                  className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#801729] to-[#540c18] hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider border border-[#d4af37]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Sign In & Continue Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#dfbe76]" />
                </button>
              </form>
            )}

            {/* Register Tab */}
            {authMode === 'register' && (
              <form onSubmit={handleAuthRegister} className="space-y-3.5 text-xs">
                {regError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      if (regFieldErrors.name) setRegFieldErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Maria Clara Santos"
                    className={`w-full p-2.5 rounded-lg bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      regFieldErrors.name ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                    }`}
                  />
                  {regFieldErrors.name && (
                    <p className="mt-1 text-[11px] text-rose-400">{regFieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold">
                      Email Address *
                    </label>
                    <span className="text-[10px] text-[#C6A15B] font-mono">@gmail.com</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (regFieldErrors.email) setRegFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="maria.clara@gmail.com"
                    className={`w-full p-2.5 rounded-lg bg-black/50 border text-sm text-white focus:outline-none transition-colors ${
                      regFieldErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                    }`}
                  />
                  {regFieldErrors.email ? (
                    <p className="mt-1 text-[11px] text-rose-400">{regFieldErrors.email}</p>
                  ) : (
                    <p className="mt-1 text-[10px] text-neutral-400">Must be a valid @gmail.com address</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Password (6+ chars) *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (regFieldErrors.password) setRegFieldErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Create password"
                      className={`w-full p-2.5 rounded-lg bg-black/50 border text-xs text-white focus:outline-none transition-colors ${
                        regFieldErrors.password ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                      }`}
                    />
                    {regFieldErrors.password && (
                      <p className="mt-1 text-[11px] text-rose-400">{regFieldErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold">
                        Phone (11 Digits) *
                      </label>
                      <span className="text-[10px] text-[#C6A15B] font-mono">09XXXXXXXXX</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => {
                        setRegPhone(e.target.value);
                        if (regFieldErrors.phone) setRegFieldErrors(prev => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="09171234567"
                      maxLength={13}
                      className={`w-full p-2.5 rounded-lg bg-black/50 border text-xs text-white focus:outline-none transition-colors ${
                        regFieldErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                      }`}
                    />
                    {regFieldErrors.phone ? (
                      <p className="mt-1 text-[11px] text-rose-400">{regFieldErrors.phone}</p>
                    ) : (
                      <p className="mt-1 text-[10px] text-neutral-400">11-digit mobile number</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Date of Birth (21+) *
                    </label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      max="2005-12-31"
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black/50 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Preferred Davao Branch
                    </label>
                    <select
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black/50 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {DAVAO_BRANCHES.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Delivery Address in Davao (Street / Barangay) *
                  </label>
                  <input
                    type="text"
                    value={regStreet}
                    onChange={(e) => {
                      setRegStreet(e.target.value);
                      if (regFieldErrors.street) setRegFieldErrors(prev => ({ ...prev, street: undefined }));
                    }}
                    placeholder="e.g. Unit 4B, Lanang Premier Condominiums, J.P. Laurel Ave"
                    className={`w-full p-2 rounded-lg bg-black/50 border text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                      regFieldErrors.street ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                    }`}
                  />
                  {regFieldErrors.street && (
                    <p className="mt-1 text-[11px] text-rose-400">{regFieldErrors.street}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!regName || !regEmail || !regPassword || !regPhone}
                  className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#801729] to-[#540c18] hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider border border-[#d4af37]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Create Account & Continue Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#dfbe76]" />
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* LOGGED IN: REGULAR 4-STEP CHECKOUT PROCESS                     */
          /* ------------------------------------------------------------- */
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-[#2b161f] pr-8">
              <div>
                <span className="text-[10px] tracking-[0.22em] text-[#dfbe76] uppercase font-semibold block">
                  VÍNEA Private Allocation Checkout
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Reserve & Finalize Order
                </h2>
              </div>
              <div className="text-left sm:text-right text-xs">
                <span className="text-neutral-400 block">Logged In As</span>
                <span className="text-[#dfbe76] font-semibold">{user.name}</span>
              </div>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { num: 1, label: 'Customer' },
                { num: 2, label: 'Delivery' },
                { num: 3, label: 'Payment' },
                { num: 4, label: 'Review' }
              ].map((s) => (
                <div key={s.num} className="flex flex-col gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      step >= s.num ? 'bg-[#dfbe76]' : 'bg-neutral-800'
                    }`}
                  />
                  <span className={`text-[10px] text-center font-medium ${step >= s.num ? 'text-white' : 'text-neutral-500'}`}>
                    {s.num}. {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="font-serif text-2xl text-white font-normal mb-2">
                  Customer & Age Verification
                </h3>
                <div className="p-3.5 rounded-xl bg-[#1d0e15] border border-[#d4af37]/40 text-neutral-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#dfbe76] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Verified Adult Account</span>
                    <span className="text-[11px] text-neutral-400">
                      Alcoholic beverages require verified adult status. Cold-chain delivery personnel in Davao will request adult signature upon handover.
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (contactErrors.fullName) setContactErrors(prev => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="e.g. Maria Clara Santos"
                      className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                        contactErrors.fullName ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                      }`}
                    />
                    {contactErrors.fullName && (
                      <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{contactErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold">
                          Email Address *
                        </label>
                        <span className="text-[10px] text-[#C6A15B] font-mono">@gmail.com</span>
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (contactErrors.email) setContactErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        placeholder="yourname@gmail.com"
                        className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                          contactErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                        }`}
                      />
                      {contactErrors.email ? (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{contactErrors.email}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-neutral-400">Must be a valid @gmail.com address</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold">
                          Phone Number (11-Digits) *
                        </label>
                        <span className="text-[10px] text-[#C6A15B] font-mono">09XXXXXXXXX</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (contactErrors.phone) setContactErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="09171234567"
                        maxLength={13}
                        className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                          contactErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                        }`}
                      />
                      {contactErrors.phone ? (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{contactErrors.phone}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-neutral-400">Exact 11-digit mobile number</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleContinueToDelivery}
                    className="py-3 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-[#801729]/30"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Address */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="font-serif text-2xl text-white font-normal mb-2">
                  Davao Delivery Address
                </h3>
                <p className="text-neutral-400 font-light mb-4">
                  Complimentary climate-controlled van transit across Davao on allocations over ₱5,000.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Street Address & Residence / Unit Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        if (addressErrors.street) setAddressErrors(prev => ({ ...prev, street: undefined }));
                      }}
                      placeholder="e.g. Unit 12B, One Oasis Davao, Eco West Drive"
                      className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                        addressErrors.street ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                      }`}
                    />
                    {addressErrors.street && (
                      <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{addressErrors.street}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (addressErrors.city) setAddressErrors(prev => ({ ...prev, city: undefined }));
                        }}
                        className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                          addressErrors.city ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                        }`}
                      />
                      {addressErrors.city && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{addressErrors.city}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Province / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateProv}
                        onChange={(e) => {
                          setStateProv(e.target.value);
                          if (addressErrors.state) setAddressErrors(prev => ({ ...prev, state: undefined }));
                        }}
                        className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                          addressErrors.state ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                        }`}
                      />
                      {addressErrors.state && (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{addressErrors.state}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold">
                          Postal Code *
                        </label>
                        <span className="text-[10px] text-[#C6A15B] font-mono">4-Digits</span>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          if (addressErrors.postalCode) setAddressErrors(prev => ({ ...prev, postalCode: undefined }));
                        }}
                        placeholder="8000"
                        className={`w-full p-3 rounded-lg bg-black/40 border text-sm text-white focus:outline-none transition-colors ${
                          addressErrors.postalCode ? 'border-rose-500 focus:border-rose-400' : 'border-neutral-700 focus:border-[#d4af37]'
                        }`}
                      />
                      {addressErrors.postalCode ? (
                        <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{addressErrors.postalCode}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-neutral-400">e.g. 8000 for Davao City</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value={country}
                        className="w-full p-3 rounded-lg bg-black/20 border border-neutral-800 text-sm text-neutral-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="py-3 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-[#801729]/30"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="animate-fade-in text-xs">
                <h3 className="font-serif text-2xl text-white font-normal mb-2">
                  Payment Method
                </h3>
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 mb-6 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Demonstration Mode: No real financial transaction will occur. Select any demo option below to simulate order completion.
                  </span>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'Credit/Debit Card', icon: CreditCard, label: 'Credit or Debit Card', desc: 'Visa / Mastercard secure tokenized demo authorization' },
                    { id: 'E-Wallet', icon: Wallet, label: 'E-Wallet (GCash / Maya / GrabPay Demo)', desc: 'Instant Philippine digital wallet demo authorization' },
                    { id: 'Cash on Delivery', icon: Truck, label: 'Cash on Delivery / Davao Cellar Handover', desc: 'Pay carrier in cash upon temperature-controlled delivery' }
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          paymentMethod === p.id
                            ? 'bg-[#2a121c] border-[#dfbe76] shadow-lg ring-1 ring-[#dfbe76]'
                            : 'bg-[#180d13] border-[#2e1521] hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/40 border border-[#3b1c28] flex items-center justify-center text-[#dfbe76]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white block">{p.label}</span>
                            <span className="text-xs text-neutral-400 font-light">{p.desc}</span>
                          </div>
                        </div>
                        {paymentMethod === p.id && (
                          <CheckCircle2 className="w-5 h-5 text-[#dfbe76]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Demo card inputs if card selected */}
                {paymentMethod === 'Credit/Debit Card' && (
                  <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3 mb-8">
                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">Demo Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded bg-black/60 border border-neutral-700 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 rounded bg-black/60 border border-neutral-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 uppercase tracking-wider mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full p-2.5 rounded bg-black/60 border border-neutral-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="py-3 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Review Order Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review and Submit */}
            {step === 4 && (
              <div className="animate-fade-in text-xs">
                <h3 className="font-serif text-2xl text-white font-normal mb-2">
                  Review & Authorize
                </h3>

                {/* Items summary */}
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.cart_item_id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#190e13] border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getWineImageUrl(item.product.image)}
                          alt={item.product.name}
                          onError={handleImageError}
                          className="w-9 h-9 rounded object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-medium text-white block">{item.product.name}</span>
                          <span className="text-neutral-400">Qty: {item.quantity} · Vintage {item.product.vintage}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-white tabular-nums">
                        {formatPeso(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address & Method Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#1a0f14] border border-[#2b161f] text-xs mb-5">
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">Delivering To</span>
                    <p className="text-white font-medium">{fullName}</p>
                    <p className="text-neutral-300">{street}, {city}</p>
                    <p className="text-neutral-400">{country} · {phone}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">Payment Method</span>
                    <p className="text-white font-medium">{paymentMethod}</p>
                    <p className="text-emerald-400 text-[11px] mt-1">Verified Demo Authorization</p>
                  </div>
                </div>

                {/* Vouchers & Privileges */}
                <div className="p-3.5 rounded-xl bg-[#190d12] border border-[#3a1a25] space-y-2.5 mb-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#dfbe76] font-semibold flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>VÍNEA Rewards Voucher or Promo Code</span>
                    </span>
                    {appliedVoucher && (
                      <button
                        type="button"
                        onClick={() => {
                          removeAppliedVoucher();
                          setVoucherError('');
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedVoucher ? (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-emerald-950/35 border border-emerald-700/40 text-emerald-300">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        <div className="min-w-0">
                          <span className="font-mono font-semibold block truncate">{appliedVoucher.code}</span>
                          <span className="text-[11px] text-emerald-200/80 block truncate">{appliedVoucher.title}</span>
                        </div>
                      </div>
                      <span className="font-semibold tabular-nums shrink-0 text-emerald-300">
                        {discountAmount > 0
                          ? `-${formatPeso(discountAmount)}`
                          : shippingDiscount > 0
                          ? `-${formatPeso(shippingDiscount)} Ship`
                          : 'Attached'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1 min-w-0">
                          <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                          <input
                            type="text"
                            value={voucherInput}
                            onChange={(e) => {
                              setVoucherInput(e.target.value);
                              if (voucherError) setVoucherError('');
                            }}
                            placeholder="Enter VN-RW-... or VINEA10"
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#dfbe76]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          className="py-2 px-3.5 rounded-lg bg-[#48151F] hover:bg-[#801729] text-[#dfbe76] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#dfbe76]/30 transition-colors cursor-pointer shrink-0"
                        >
                          Apply
                        </button>
                      </div>

                      {voucherError && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{voucherError}</span>
                        </p>
                      )}

                      {activeWalletVouchers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeWalletVouchers.map((v) => (
                            <button
                              key={v.voucher_id}
                              type="button"
                              onClick={() => {
                                setVoucherError('');
                                applyVoucherCode(v.code);
                              }}
                              className="px-2.5 py-1 rounded-md bg-black/40 hover:bg-[#48151F] border border-[#dfbe76]/40 text-[11px] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span className="font-mono text-[#dfbe76] font-semibold">{v.code}</span>
                              <span className="text-neutral-300">
                                ·{' '}
                                {v.discount_type === 'fixed'
                                  ? `${formatPeso(v.discount_value)} Off`
                                  : v.discount_type === 'percent'
                                  ? `${v.discount_value}% Off`
                                  : v.discount_type === 'free_shipping'
                                  ? 'Free Shipping'
                                  : 'VIP Perk'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Financial calculation */}
                <div className="space-y-1.5 text-xs text-neutral-300 border-t border-white/10 pt-4 mb-6 sm:mb-8">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold tabular-nums text-white">{formatPeso(cartSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Voucher Savings ({appliedVoucher?.code})</span>
                      <span className="font-semibold tabular-nums">-{formatPeso(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Climate-Controlled Shipping</span>
                    <span className="font-semibold tabular-nums text-white">
                      {shippingCost === 0
                        ? shippingDiscount > 0
                          ? 'Waived by Voucher'
                          : 'Complimentary'
                        : formatPeso(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                    <span className="font-serif text-xl">Total Due</span>
                    <span className="font-serif text-2xl text-[#dfbe76] tabular-nums">
                      {formatPeso(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-2.5 px-4 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="gold-shimmer-cta w-full sm:w-auto py-4 px-8 rounded-lg bg-gradient-to-r from-[#801729] via-[#66101f] to-[#450913] hover:from-[#941b31] hover:to-[#540c18] text-white text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold transition-all cursor-pointer shadow-xl border border-[#d4af37]/40 text-center"
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
