import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginScreen: React.FC = () => {
  const { loginAdmin, loginWithSecretCode, exitAdminPortal } = useWineStore();

  const [authMode, setAuthMode] = useState<'secret_code' | 'credentials'>('secret_code');
  const [secretCode, setSecretCode] = useState('');
  const [showSecretCode, setShowSecretCode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Lockout Protection
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('vinea_admin_fails');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    try {
      const lockUntil = sessionStorage.getItem('vinea_admin_lockout_until');
      if (lockUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(lockUntil, 10) - Date.now()) / 1000));
        return remaining;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('vinea_admin_lockout_until');
          sessionStorage.setItem('vinea_admin_fails', '0');
          setFailedAttempts(0);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const recordFailedAttempt = (customError?: string) => {
    const nextFails = failedAttempts + 1;
    setFailedAttempts(nextFails);
    sessionStorage.setItem('vinea_admin_fails', nextFails.toString());

    if (nextFails >= 3) {
      const lockDurationMs = 300 * 1000; // 5 minutes lockout
      const lockUntil = Date.now() + lockDurationMs;
      sessionStorage.setItem('vinea_admin_lockout_until', lockUntil.toString());
      setLockoutSeconds(300);
      setErrorMsg('Security Lockout Activated: 3 consecutive unauthorized access attempts. Access is temporarily suspended.');
    } else {
      setErrorMsg(
        customError ||
          `Access Denied: Invalid administrative credentials. (${3 - nextFails} attempt${3 - nextFails === 1 ? '' : 's'} remaining before security lockout)`
      );
    }
  };

  const handleSecretCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setErrorMsg('');
    setIsSubmitting(true);

    const result = loginWithSecretCode(secretCode);
    setIsSubmitting(false);

    if (!result.success) {
      recordFailedAttempt(result.error);
    } else {
      sessionStorage.removeItem('vinea_admin_fails');
      sessionStorage.removeItem('vinea_admin_lockout_until');
    }
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setErrorMsg('');
    setIsSubmitting(true);

    const result = loginAdmin(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      recordFailedAttempt(result.error);
    } else {
      sessionStorage.removeItem('vinea_admin_fails');
      sessionStorage.removeItem('vinea_admin_lockout_until');
    }
  };

  return (
    <div className="min-h-screen bg-[#100809] text-[#F5EFE7] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#861F32] selection:text-white">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#392126]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#861F32] to-[#392126] flex items-center justify-center border border-[#D5B15C]/40 shadow-sm">
            <Wine className="w-5 h-5 text-[#D5B15C]" />
          </div>
          <div>
            <span className="font-serif text-2xl tracking-wider text-[#F5EFE7] font-normal block leading-none">
              VÍNEA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#D5B15C] uppercase block mt-1">
              Cellar Master Operations
            </span>
          </div>
        </div>

        {/* Immediate Return Button for accidental customer visitors */}
        <button
          onClick={exitAdminPortal}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#190D10] hover:bg-[#2A0D14] text-[#D5B15C] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors border border-[#392126] hover:border-[#D5B15C]/50 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-8">
        {/* Customer Accident Banner */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#190D10] border border-[#392126] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#918481]">
            <HelpCircle className="w-4 h-4 text-[#D5B15C] shrink-0" />
            <span>Are you a customer or wine lover?</span>
          </div>
          <button
            onClick={exitAdminPortal}
            className="text-[11px] font-semibold text-[#D5B15C] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Go to Shop</span>
          </button>
        </div>

        <div className="relative rounded-3xl bg-[#190D10] border border-[#392126] shadow-2xl p-7 sm:p-9 backdrop-blur-xl">
          {/* Security crest */}
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#100809] border border-[#D5B15C]/50 flex items-center justify-center text-[#D5B15C] shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#100809] border border-[#D5B15C]/35 text-[#D5B15C] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D5B15C]" />
              <span>Restricted Cellar Backend</span>
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal mb-1.5">
              Authorized Access Only
            </h1>
            <p className="text-xs text-[#918481] leading-relaxed">
              This portal is restricted to authorized cellar administration. All unauthorized attempts are blocked and monitored.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#2b161f] mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('secret_code');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'secret_code'
                  ? 'border-[#D5B15C] text-[#D5B15C] bg-white/5'
                  : 'border-transparent text-[#918481] hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Secret Admin Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('credentials');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'credentials'
                  ? 'border-[#D5B15C] text-[#D5B15C] bg-white/5'
                  : 'border-transparent text-[#918481] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          </div>

          {/* Lockout Warning */}
          {lockoutSeconds > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 animate-fade-in">
              <div className="flex items-center gap-2 font-semibold text-red-300 mb-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>Security Lockdown In Effect</span>
              </div>
              <p className="text-[11px] text-red-300/80 leading-relaxed mb-2">
                Too many failed authorization attempts. Access is locked for security.
              </p>
              <div className="font-mono text-center py-2 px-3 bg-black/60 rounded border border-red-900/60 text-red-300 text-xs">
                Unlocks in: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
              </div>
            </div>
          )}

          {/* General Error Notification */}
          {errorMsg && lockoutSeconds <= 0 && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#2A0D14] border border-red-700/60 text-xs text-red-200 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">{errorMsg}</p>
            </div>
          )}

          {/* FORM 1: SECRET ADMIN PASSCODE */}
          {authMode === 'secret_code' && (
            <form onSubmit={handleSecretCodeLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#918481] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                  Enter Admin Secret Passcode
                </label>
                <div className="relative">
                  <input
                    type={showSecretCode ? 'text' : 'password'}
                    required
                    disabled={lockoutSeconds > 0}
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Enter your secret passcode"
                    autoFocus
                    className="w-full p-3 pr-10 rounded-lg bg-black/50 border border-[#392126] text-sm text-[#F5EFE7] placeholder-[#918481]/50 focus:outline-none focus:border-[#D5B15C] transition-colors font-mono tracking-wider disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretCode(!showSecretCode)}
                    className="absolute right-3 top-3 text-[#918481] hover:text-white cursor-pointer"
                    aria-label={showSecretCode ? 'Hide secret code' : 'Show secret code'}
                  >
                    {showSecretCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-[#918481] block mt-1.5">
                  Only the owner with the private secret key can unlock the operations console.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !secretCode || lockoutSeconds > 0}
                className="w-full py-3.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-semibold text-xs uppercase tracking-[0.15em] border border-[#D5B15C]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Verifying Code...' : 'Unlock Admin Operations'}
              </button>
            </form>
          )}

          {/* FORM 2: STAFF CREDENTIALS */}
          {authMode === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#918481] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                  Cellar Staff Email
                </label>
                <input
                  type="email"
                  required
                  disabled={lockoutSeconds > 0}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vinea.com"
                  className="w-full p-3 rounded-lg bg-black/50 border border-[#392126] text-sm text-[#F5EFE7] placeholder-[#918481]/50 focus:outline-none focus:border-[#D5B15C] transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[#918481] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                  Administrator Password or Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSeconds > 0}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password or secret code"
                    className="w-full p-3 pr-10 rounded-lg bg-black/50 border border-[#392126] text-sm text-[#F5EFE7] placeholder-[#918481]/50 focus:outline-none focus:border-[#D5B15C] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#918481] hover:text-white cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email || !password || lockoutSeconds > 0}
                className="w-full py-3.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-semibold text-xs uppercase tracking-[0.15em] border border-[#D5B15C]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Authenticating...' : 'Authenticate & Unlock Console'}
              </button>
            </form>
          )}

          {/* Fallback return option */}
          <div className="mt-6 pt-5 border-t border-[#2b161f] text-center">
            <button
              onClick={exitAdminPortal}
              className="text-xs text-[#918481] hover:text-[#D5B15C] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accidentally here? Click here to return to the store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-md mx-auto text-center text-[11px] text-[#918481]">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D5B15C]" />
          <span>Restricted enclave. Customer shopping sessions are isolated and protected.</span>
        </p>
      </div>
    </div>
  );
};
