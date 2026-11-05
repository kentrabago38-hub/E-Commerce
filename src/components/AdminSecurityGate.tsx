import React, { useState, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import {
  authorizeGateSession,
  verifyAdminGatePassword
} from '../lib/adminSecurity';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Wine,
  AlertCircle,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

interface AdminSecurityGateProps {
  onVerified: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({ onVerified }) => {
  const { exitAdminPortal, loginWithSecretCode, showToast } = useWineStore();

  const [enteredKey, setEnteredKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Lockout protection against brute force
  const [attempts, setAttempts] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('vinea_gate_fails');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    try {
      const lockUntil = sessionStorage.getItem('vinea_gate_lockout_until');
      if (lockUntil) {
        return Math.max(0, Math.ceil((parseInt(lockUntil, 10) - Date.now()) / 1000));
      }
      return 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('vinea_gate_lockout_until');
          sessionStorage.setItem('vinea_gate_fails', '0');
          setAttempts(0);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg('');
    setIsVerifying(true);

    const isValid = verifyAdminGatePassword(enteredKey);

    if (!isValid) {
      const nextFails = attempts + 1;
      setAttempts(nextFails);
      sessionStorage.setItem('vinea_gate_fails', nextFails.toString());

      if (nextFails >= 3) {
        const lockUntil = Date.now() + 300 * 1000; // 5 min lockout
        sessionStorage.setItem('vinea_gate_lockout_until', lockUntil.toString());
        setLockoutSeconds(300);
        setErrorMsg('Gate Locked: 3 consecutive failed verification attempts. Access temporarily suspended.');
      } else {
        setErrorMsg(`Verification Failed: Invalid administrative gate key. (${3 - nextFails} attempt${3 - nextFails === 1 ? '' : 's'} remaining)`);
      }
      setIsVerifying(false);
      return;
    }

    // Success: authorize gate session
    authorizeGateSession(enteredKey);
    // Also authorize admin user session in store
    loginWithSecretCode(enteredKey);

    sessionStorage.removeItem('vinea_gate_fails');
    sessionStorage.removeItem('vinea_gate_lockout_until');
    setIsVerifying(false);
    showToast('Admin Security Gate Verified: Operations console unlocked.', 'success');
    onVerified();
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
              Protected Cellar Enclave
            </span>
          </div>
        </div>

        <button
          onClick={exitAdminPortal}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#190D10] hover:bg-[#2A0D14] text-[#D5B15C] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors border border-[#392126] hover:border-[#D5B15C]/50 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>
      </div>

      {/* Main Gate Card */}
      <div className="max-w-md mx-auto w-full my-8">
        {/* Customer Redirection Callout */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#190D10] border border-[#392126] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#918481]">
            <HelpCircle className="w-4 h-4 text-[#D5B15C] shrink-0" />
            <span>Looking for wines to purchase?</span>
          </div>
          <button
            onClick={exitAdminPortal}
            className="text-[11px] font-semibold text-[#D5B15C] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Go to Wine Shop</span>
          </button>
        </div>

        <div className="relative rounded-3xl bg-[#190D10] border border-[#392126] shadow-2xl p-7 sm:p-9 backdrop-blur-xl">
          {/* Security Crest */}
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#100809] border border-[#D5B15C]/50 flex items-center justify-center text-[#D5B15C] shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#100809] border border-[#D5B15C]/35 text-[#D5B15C] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D5B15C]" />
              <span>Password-Protected Gate</span>
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal mb-1.5">
              Admin Portal Security Gate
            </h1>
            <p className="text-xs text-[#918481] leading-relaxed">
              Rendering this operations panel requires a verification check against the secure environment variable or constant. All public access is strictly blocked.
            </p>
          </div>

          {/* Lockout Warning */}
          {lockoutSeconds > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 animate-fade-in">
              <div className="flex items-center gap-2 font-semibold text-red-300 mb-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>Security Gate Locked</span>
              </div>
              <p className="text-[11px] text-red-300/80 leading-relaxed mb-2">
                Too many failed verification attempts. Access is locked for security.
              </p>
              <div className="font-mono text-center py-2 px-3 bg-black/60 rounded border border-red-900/60 text-red-300 text-xs">
                Unlocks in: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && lockoutSeconds <= 0 && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#2A0D14] border border-red-700/60 text-xs text-red-200 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">{errorMsg}</p>
            </div>
          )}

          {/* Gate Verification Form */}
          <form onSubmit={handleVerifyGate} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#918481] uppercase tracking-wider text-[10px] font-semibold mb-1.5">
                Master Gate Password / Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  disabled={lockoutSeconds > 0}
                  value={enteredKey}
                  onChange={(e) => setEnteredKey(e.target.value)}
                  placeholder="Enter secure gate password"
                  autoFocus
                  className="w-full p-3 pr-10 rounded-lg bg-black/50 border border-[#392126] text-sm text-[#F5EFE7] placeholder-[#918481]/50 focus:outline-none focus:border-[#D5B15C] transition-colors font-mono tracking-wider disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-[#918481] hover:text-white cursor-pointer"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-[#918481] block mt-1.5">
                Verified against secure environment variable (or master constant) before displaying content.
              </span>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !enteredKey || lockoutSeconds > 0}
              className="w-full py-3.5 px-4 rounded-lg bg-[#7F1427] hover:bg-[#8e192f] text-white font-semibold text-xs uppercase tracking-[0.15em] border border-[#D5B15C]/40 shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Key...' : 'Verify Key & Unlock Portal'}</span>
            </button>
          </form>

          {/* Customer Return Button */}
          <div className="mt-6 pt-5 border-t border-[#2b161f] text-center">
            <button
              onClick={exitAdminPortal}
              className="text-xs text-[#918481] hover:text-[#D5B15C] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accidentally here? Return to wine storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-md mx-auto text-center text-[11px] text-[#918481]">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D5B15C]" />
          <span>Encrypted security gate. Customer traffic strictly segregated from operations.</span>
        </p>
      </div>
    </div>
  );
};
