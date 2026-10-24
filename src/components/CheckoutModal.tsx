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
  Sparkles
} from 'lucide-react';
import { DAVAO_BRANCHES } from '../data/mockData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    user,
    loginCustomer,
    registerCustomer,
    placeOrder
  } = useWineStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

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

  // Checkout Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+63 ');

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

  const shippingCost = cartSubtotal >= 5000 ? 0 : 350;
  const totalAmount = cartSubtotal + shippingCost;

  const handleAuthLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginCustomer(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleAuthRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
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

  const handleFillDemoMaria = () => {
    setLoginEmail('maria.santos@vinea.ph');
    setLoginPassword('vinea123');
    setLoginError('');
  };

  const handleFillDemoRoberto = () => {
    setLoginEmail('roberto.tan@vinea.ph');
    setLoginPassword('vinea123');
    setLoginError('');
  };

  const handlePlaceOrder = () => {
    if (!user) return;

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
      street,
      city,
      state: stateProv,
      postalCode,
      country
    };

    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    placeOrder({
      user_id: user.user_id,
      customer_name: fullName,
      email,
      phone,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: 0,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      delivery_address: deliveryAddress,
      items: orderItems,
      estimated_delivery: estimatedDelivery
    });

    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 sm:p-8">
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
                      placeholder="maria.santos@vinea.ph"
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

                {/* Quick 1-click Demo credentials */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold mb-2 text-center">
                    Quick Test Sign-In
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleFillDemoMaria}
                      className="p-2.5 rounded-lg bg-[#210f17] hover:bg-[#341624] border border-[#d4af37]/30 text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[#dfbe76] text-[11px] font-semibold">
                        <span>Maria Santos</span>
                        <KeyRound className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] text-neutral-300 block truncate">maria.santos@vinea.ph</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFillDemoRoberto}
                      className="p-2.5 rounded-lg bg-[#210f17] hover:bg-[#341624] border border-[#d4af37]/30 text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[#dfbe76] text-[11px] font-semibold">
                        <span>Roberto Tan</span>
                        <KeyRound className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] text-neutral-300 block truncate">roberto.tan@vinea.ph</span>
                    </button>
                  </div>
                </div>
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
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maria Clara Santos"
                    className="w-full p-2.5 rounded-lg bg-black/50 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maria.clara@example.ph"
                    className="w-full p-2.5 rounded-lg bg-black/50 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Password (6+ chars) *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full p-2.5 rounded-lg bg-black/50 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full p-2.5 rounded-lg bg-black/50 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    Delivery Address in Davao (Street / Barangay)
                  </label>
                  <input
                    type="text"
                    value={regStreet}
                    onChange={(e) => setRegStreet(e.target.value)}
                    placeholder="e.g. Unit 4B, Lanang Premier Condominiums"
                    className="w-full p-2 rounded-lg bg-black/50 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                  />
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
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#2b161f]">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-[#dfbe76] uppercase font-semibold block">
                  VÍNEA Private Allocation Checkout
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Reserve & Finalize Order
                </h2>
              </div>
              <div className="text-right text-xs">
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
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Phone Number (+63 Davao Mobile) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+63 9XX XXX XXXX"
                        className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!fullName || !email || !phone}
                    className="py-3 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
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
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Unit 12B, One Oasis Davao, Eco West Drive"
                      className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Province / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateProv}
                        onChange={(e) => setStateProv(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/40 border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                      />
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
                    onClick={() => setStep(3)}
                    disabled={!street || !city || !postalCode}
                    className="py-3 px-6 rounded-lg bg-[#801729] hover:bg-[#961e33] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
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
                          src={item.product.image}
                          alt={item.product.name}
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
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#1a0f14] border border-[#2b161f] text-xs mb-6">
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

                {/* Financial calculation */}
                <div className="space-y-1.5 text-xs text-neutral-300 border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold tabular-nums text-white">{formatPeso(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Climate-Controlled Shipping</span>
                    <span className="font-semibold tabular-nums text-white">
                      {shippingCost === 0 ? 'Complimentary' : formatPeso(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                    <span className="font-serif text-xl">Total Due</span>
                    <span className="font-serif text-2xl text-[#dfbe76] tabular-nums">
                      {formatPeso(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-2.5 px-4 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="py-4 px-8 rounded-lg bg-gradient-to-r from-[#801729] via-[#66101f] to-[#450913] hover:from-[#941b31] hover:to-[#540c18] text-white text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold transition-all cursor-pointer shadow-xl border border-[#d4af37]/40"
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
