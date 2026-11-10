import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import {
  X,
  Wine,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { DAVAO_BRANCHES } from '../data/mockData';
import {
  validateGmail,
  validatePhone11Digit,
  validateAddress,
  validateFullName,
  validatePassword
} from '../utils/validation';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    authRedirectReason,
    setAuthRedirectReason,
    loginCustomer,
    registerCustomer,
    setIsCheckoutOpen
  } = useWineStore();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [phone, setPhone] = useState('0917');
  const [dob, setDob] = useState('2000-01-15');
  const [favoriteBranch, setFavoriteBranch] = useState(DAVAO_BRANCHES[0]?.name || 'VÍNEA Lanang Flagship & Subterranean Cellar');
  const [streetAddress, setStreetAddress] = useState('');
  const [confirmAge, setConfirmAge] = useState(true);
  const [regError, setRegError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    street?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
    setLoginError('');
    setRegError('');
    setFieldErrors({});
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
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
    } else {
      handleClose();
      // If we were blocked from checkout, automatically open checkout modal
      if (authRedirectReason) {
        setIsCheckoutOpen(true);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      street?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameRes = validateFullName(name);
    if (!nameRes.isValid) errors.name = nameRes.error;

    const emailRes = validateGmail(regEmail);
    if (!emailRes.isValid) errors.email = emailRes.error;

    const phoneRes = validatePhone11Digit(phone);
    if (!phoneRes.isValid) errors.phone = phoneRes.error;

    const passRes = validatePassword(regPassword);
    if (!passRes.isValid) errors.password = passRes.error;

    if (regPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    if (streetAddress.trim()) {
      const addrRes = validateAddress({
        street: streetAddress.trim(),
        city: 'Davao City',
        state: 'Davao del Sur',
        postalCode: '8000'
      });
      if (!addrRes.isValid && addrRes.errors.street) {
        errors.street = addrRes.errors.street;
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setRegError(Object.values(errors)[0] || 'Please fix the highlighted fields.');
      return;
    }

    if (!confirmAge) {
      setRegError('You must confirm that you are at least 21 years of age.');
      return;
    }

    const res = registerCustomer({
      name,
      email: regEmail,
      password: regPassword,
      phone,
      date_of_birth: dob,
      favorite_davao_branch: favoriteBranch,
      saved_addresses: streetAddress.trim() ? [
        {
          street: streetAddress.trim(),
          city: 'Davao City',
          state: 'Davao del Sur',
          postalCode: '8000',
          country: 'Philippines'
        }
      ] : undefined
    });

    if (!res.success) {
      setRegError(res.error || 'Could not create account. Please check your details.');
    } else {
      handleClose();
      if (authRedirectReason) {
        setIsCheckoutOpen(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-[#F5EFE7]">
      <div className="relative max-w-lg w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#861F32] to-[#48151F] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-lg">
            <Wine className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl text-[#F5EFE7] font-normal block leading-tight">
            VÍNEA Cellar Membership
          </span>
          <p className="text-xs text-[#B7AAA1] font-light mt-1">
            Discover · Taste · Remember · Davao City, Philippines
          </p>
        </div>

        {/* Notice if opened due to checkout attempt */}
        {authRedirectReason && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#48151F]/40 border border-[#C6A15B]/40 text-xs text-[#C6A15B] flex items-start gap-2.5 animate-fade-in">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#C6A15B]" />
            <div>
              <p className="font-semibold text-[#F5EFE7] mb-0.5">Customer Account Required</p>
              <p className="text-[#B7AAA1] font-light leading-relaxed">{authRedirectReason}</p>
            </div>
          </div>
        )}

        {/* Tab switch: Sign In vs. Create Account */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#210D12] border border-[#48151F] mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setLoginError(''); }}
            className={`py-2.5 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#861F32] text-[#F5EFE7] shadow-md border border-[#C6A15B]/40 font-medium'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setRegError(''); }}
            className={`py-2.5 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#861F32] text-[#F5EFE7] shadow-md border border-[#C6A15B]/40 font-medium'
                : 'text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs animate-fade-in">
            {loginError && (
              <div className="p-3 rounded-lg bg-[#48151F]/80 border border-red-700/60 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold">
                  Email Address
                </label>
                <span className="text-[10px] text-[#C6A15B] font-mono">@gmail.com</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#210D12] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#210D12] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-[#B7AAA1] hover:text-[#F5EFE7]"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!loginEmail || !loginPassword}
              className="w-full py-3.5 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] font-medium text-xs uppercase tracking-wider border border-[#C6A15B]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </form>
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs animate-fade-in">
            {regError && (
              <div className="p-3 rounded-lg bg-[#48151F]/80 border border-red-700/60 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Sofia Delgado"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                    fieldErrors.name ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold">
                  Email Address *
                </label>
                <span className="text-[10px] text-[#C6A15B] font-mono">@gmail.com</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="sofia.delgado@gmail.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                    fieldErrors.email ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                  }`}
                />
              </div>
              {fieldErrors.email ? (
                <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.email}</p>
              ) : (
                <p className="mt-1 text-[10px] text-[#B7AAA1]/80">Must be a valid @gmail.com address</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Password * (6+ chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Create password"
                    className={`w-full pl-9 pr-8 py-2 rounded-lg bg-[#210D12] border text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                      fieldErrors.password ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2.5 text-[#B7AAA1] hover:text-[#F5EFE7]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Confirm Password *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Repeat password"
                  className={`w-full px-3 py-2 rounded-lg bg-[#210D12] border text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                    fieldErrors.confirmPassword ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold">
                    Phone (11 Digits) *
                  </label>
                  <span className="text-[10px] text-[#C6A15B] font-mono">09XXXXXXXXX</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="09171234567"
                    maxLength={13}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                      fieldErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                    }`}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.phone}</p>
                ) : (
                  <p className="mt-1 text-[10px] text-[#B7AAA1]/80">Exact 11-digit mobile number</p>
                )}
              </div>

              <div>
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Date of Birth (21+ only) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                  <input
                    type="date"
                    required
                    value={dob}
                    max="2005-12-31"
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                Preferred Davao Tasting Branch
              </label>
              <select
                value={favoriteBranch}
                onChange={(e) => setFavoriteBranch(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                {DAVAO_BRANCHES.map((b) => (
                  <option key={b.id} value={b.name}>{b.name} ({b.district})</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold">
                  Davao Delivery Street / Barangay *
                </label>
                <span className="text-[10px] text-[#C6A15B]">Min 5 chars</span>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => {
                    setStreetAddress(e.target.value);
                    if (fieldErrors.street) setFieldErrors(prev => ({ ...prev, street: undefined }));
                  }}
                  placeholder="e.g. Unit 4B, Lanang Premier Condominiums, J.P. Laurel Ave"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none transition-colors ${
                    fieldErrors.street ? 'border-rose-500 focus:border-rose-400' : 'border-[#48151F] focus:border-[#C6A15B]'
                  }`}
                />
              </div>
              {fieldErrors.street && (
                <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.street}</p>
              )}
            </div>

            <label className="flex items-start gap-2 pt-1 text-[11px] text-[#B7AAA1] cursor-pointer">
              <input
                type="checkbox"
                checked={confirmAge}
                onChange={(e) => setConfirmAge(e.target.checked)}
                className="mt-0.5 accent-[#861F32]"
              />
              <span>
                I certify that I am at least <strong className="text-[#F5EFE7]">21 years old</strong> and legally permitted to purchase alcoholic beverages in the Philippines.
              </span>
            </label>

            <button
              type="submit"
              disabled={!name || !regEmail || !regPassword || !confirmPassword || !confirmAge}
              className="w-full py-3 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white font-medium text-xs uppercase tracking-wider border border-[#C6A15B]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#48151F] text-center text-[11px] text-[#B7AAA1]">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Encrypted customer data. Authentic allocation (21+).</span>
          </p>
        </div>
      </div>
    </div>
  );
};
