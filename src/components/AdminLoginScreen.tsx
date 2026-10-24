import React, { useState } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Wine,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminLoginScreen: React.FC = () => {
  const { loginAdmin, exitAdminPortal } = useWineStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = loginAdmin(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed. Please verify administrative credentials.');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@vinea.com');
    setPassword('vinea2026');
    setErrorMsg('');
  };

  const handleFillDemoCustomer = () => {
    setEmail('eleanor.vance@example.com');
    setPassword('customer123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#130B0D] text-[#F5EFE7] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#861F32] selection:text-white">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#48151F]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#861F32] to-[#48151F] flex items-center justify-center border border-[#C6A15B]/40 shadow-sm">
            <Wine className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <div>
            <span className="font-serif text-2xl tracking-wider text-[#F5EFE7] font-normal block leading-none">
              VÍNEA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase block mt-1">
              Cellar Master Administration
            </span>
          </div>
        </div>

        <button
          onClick={exitAdminPortal}
          className="flex items-center gap-2 py-2 px-3.5 rounded-lg bg-[#210D12] hover:bg-[#48151F] text-[#B7AAA1] hover:text-[#F5EFE7] text-xs uppercase tracking-wider font-medium transition-colors border border-[#48151F] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Visit Public Storefront</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-12">
        <div className="relative rounded-3xl bg-[#210D12] border border-[#48151F] shadow-2xl p-8 sm:p-10 backdrop-blur-xl">
          {/* Security crest */}
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#130B0D] border border-[#C6A15B]/50 flex items-center justify-center text-[#C6A15B] shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#130B0D] border border-[#C6A15B]/35 text-[#C6A15B] text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Restricted Access Portal</span>
            </span>
            <h1 className="font-serif text-3xl text-[#F5EFE7] font-normal mb-2">
              Administrator Sign-In
            </h1>
            <p className="text-xs text-[#B7AAA1] font-light leading-relaxed">
              Authorized personnel only. Access to inventory management, allocation pricing, and customer order fulfillment requires verified cellar credentials.
            </p>
          </div>

          {/* Error Notification */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#48151F]/80 border border-red-700/60 text-xs text-red-200 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vinea.com"
                className="w-full p-3 rounded-lg bg-[#130B0D] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#B7AAA1] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full p-3 pr-10 rounded-lg bg-[#130B0D] border border-[#48151F] text-sm text-[#F5EFE7] placeholder-[#B7AAA1]/60 focus:outline-none focus:border-[#C6A15B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#B7AAA1] hover:text-[#F5EFE7]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3.5 px-4 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white font-medium text-xs uppercase tracking-[0.15em] border border-[#C6A15B]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Authenticate & Unlock Console'}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-[#48151F] space-y-3">
            <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block font-semibold text-center">
              Demonstration Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="p-2.5 rounded-lg bg-[#130B0D] hover:bg-[#48151F]/40 border border-[#48151F] hover:border-[#C6A15B]/50 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#C6A15B] text-[11px] font-semibold">
                  <span>Authorized Admin</span>
                  <KeyRound className="w-3 h-3" />
                </div>
                <span className="text-[10px] text-[#B7AAA1] block truncate">admin@vinea.com</span>
                <span className="text-[9px] text-[#B7AAA1]/75 block">Pass: vinea2026</span>
              </button>

              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="p-2.5 rounded-lg bg-[#130B0D] hover:bg-[#48151F]/40 border border-[#48151F] text-left transition-colors cursor-pointer"
                title="Click to test that customer credentials are blocked"
              >
                <div className="flex items-center justify-between text-[#B7AAA1] text-[11px] font-semibold">
                  <span>Customer (Denied)</span>
                  <ShieldAlert className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-[10px] text-[#B7AAA1] block truncate">eleanor.vance@example.com</span>
                <span className="text-[9px] text-[#B7AAA1]/75 block">Tests access rejection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-md mx-auto text-center text-[11px] text-[#B7AAA1]">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Encrypted administrative session. Customer data protected under strict role separation.</span>
        </p>
      </div>
    </div>
  );
};
