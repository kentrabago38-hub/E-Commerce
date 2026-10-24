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
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { DAVAO_BRANCHES } from '../data/mockData';

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
  const [phone, setPhone] = useState('+63 917 ');
  const [dob, setDob] = useState('2000-01-15');
  const [favoriteBranch, setFavoriteBranch] = useState(DAVAO_BRANCHES[0]?.name || 'VÍNEA Lanang Flagship & Subterranean Cellar');
  const [streetAddress, setStreetAddress] = useState('');
  const [confirmAge, setConfirmAge] = useState(true);
  const [regError, setRegError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectReason(null);
    setLoginError('');
    setRegError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

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

    if (!confirmAge) {
      setRegError('You must confirm that you are at least 21 years of age.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
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
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.ph"
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

            {/* Quick Demo Credentials for fast evaluation */}
            <div className="mt-6 pt-5 border-t border-[#48151F]">
              <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block font-semibold mb-2.5 text-center">
                Quick Demo Sign-In (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFillDemoMaria}
                  className="p-2.5 rounded-lg bg-[#210D12] hover:bg-[#48151F]/40 border border-[#48151F] hover:border-[#C6A15B]/50 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#C6A15B] text-[11px] font-semibold">
                    <span>Maria Santos</span>
                    <KeyRound className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-[#B7AAA1] block truncate">maria.santos@vinea.ph</span>
                  <span className="text-[9px] text-[#B7AAA1]/75 block">Davao Grand Cru Member</span>
                </button>

                <button
                  type="button"
                  onClick={handleFillDemoRoberto}
                  className="p-2.5 rounded-lg bg-[#210D12] hover:bg-[#48151F]/40 border border-[#48151F] hover:border-[#C6A15B]/50 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[#C6A15B] text-[11px] font-semibold">
                    <span>Atty. Roberto Tan</span>
                    <KeyRound className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-[#B7AAA1] block truncate">roberto.tan@vinea.ph</span>
                  <span className="text-[9px] text-[#B7AAA1]/75 block">Matina Cellar Member</span>
                </button>
              </div>
            </div>
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sofia Delgado"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sofia.delgado@example.ph"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
              </div>
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
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-2.5 text-[#B7AAA1] hover:text-[#F5EFE7]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Confirm Password *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Phone Number (+63 Davao) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                  />
                </div>
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
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1">
                Davao Delivery Street / Barangay
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#B7AAA1]" />
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. One Oasis Davao, Eco West Drive"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#210D12] border border-[#48151F] text-xs text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
              </div>
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
