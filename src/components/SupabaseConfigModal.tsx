import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Save,
  Trash2,
  Copy,
  Info,
  Terminal,
  HelpCircle
} from 'lucide-react';
import {
  isValidHttpUrl,
  isValidAnonKey,
  getSupabaseConfigStatus,
  setCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
  DEFAULT_FALLBACK_URL,
  testSupabaseConnection
} from '../lib/supabase';
import { useWineStore } from '../context/WineStoreContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { showToast } = useWineStore();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'configure' | 'guide'>('configure');

  const configStatus = getSupabaseConfigStatus();

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('vinea_custom_supabase_url') || '';
        const storedKey = localStorage.getItem('vinea_custom_supabase_key') || '';
        setUrl(storedUrl || (configStatus.isUrlValid ? configStatus.rawEnvUrl : ''));
        setAnonKey(storedKey || '');
      }
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl) {
      showToast('Please provide your Supabase Project URL.', 'error');
      return;
    }

    if (!isValidHttpUrl(cleanUrl)) {
      showToast('Invalid Supabase URL. It must start with https:// and end with .supabase.co', 'error');
      return;
    }

    if (!cleanKey) {
      showToast('Please provide your Supabase Anon/Public Key.', 'error');
      return;
    }

    if (!isValidAnonKey(cleanKey)) {
      showToast('Key appears too short or invalid. Please check your Supabase dashboard.', 'error');
      return;
    }

    const success = setCustomSupabaseCredentials(cleanUrl, cleanKey);
    if (success) {
      showToast('Supabase credentials saved successfully! Reloading...', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } else {
      showToast('Failed to save credentials to local storage.', 'error');
    }
  };

  const handleReset = () => {
    clearCustomSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    showToast('Custom credentials cleared. Resetting to default demo mode.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const ok = await testSupabaseConnection();
      setTestResult(ok ? 'success' : 'failed');
      if (ok) {
        showToast('Supabase connection verified!', 'success');
      } else {
        showToast('Unable to reach Supabase with provided credentials.', 'error');
      }
    } catch {
      setTestResult('failed');
      showToast('Connection test error occurred.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const copyEnvSnippet = () => {
    const text = `VITE_SUPABASE_URL=${url.trim() || 'https://your-project-id.supabase.co'}\nVITE_SUPABASE_ANON_KEY=${anonKey.trim() || 'eyJhbGciOi...'}`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    showToast('Copied .env snippet to clipboard!', 'success');
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#1A0E13] border border-[#C6A15B]/30 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#48151F] bg-[#140A0E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-[#3ECF8E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-[#F5EFE7]">
                Supabase Database Setup
              </h2>
              <p className="text-xs text-[#B7AAA1]">
                Connect your live Supabase PostgreSQL database & auth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B7AAA1] hover:text-[#F5EFE7] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#48151F] bg-[#170C10] px-6">
          <button
            onClick={() => setActiveTab('configure')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'configure'
                ? 'border-[#C6A15B] text-[#C6A15B]'
                : 'border-transparent text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Direct Connection Setup
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#C6A15B] text-[#C6A15B]'
                : 'border-transparent text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            Encoding Guide & PowerShell Fix
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#F5EFE7] text-sm">
          {activeTab === 'configure' ? (
            <>
              {/* Current Status Banner */}
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  configStatus.isConfigured
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                }`}
              >
                {configStatus.isConfigured ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-sm">
                    {configStatus.isConfigured
                      ? 'Supabase Cloud Connected'
                      : 'Resilient Demo Mode Active'}
                  </div>
                  <p className="text-[#B7AAA1]">
                    {configStatus.isConfigured
                      ? `Active URL: ${configStatus.activeUrl}`
                      : 'The app is using high-performance local storage and safe mock tables. Enter your Supabase credentials below to sync orders, catalog, and auth with your live cloud project.'}
                  </p>
                </div>
              </div>

              {/* Direct Setup Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1.5">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className="w-full px-3.5 py-2.5 bg-[#12070A] border border-[#48151F] focus:border-[#C6A15B] rounded-lg text-xs text-[#F5EFE7] placeholder-[#6A5A5D] focus:outline-none transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-[#918481]">
                    Found in your Supabase Dashboard → Settings → API → Project URL. Must start with{' '}
                    <code className="text-[#C6A15B]">https://</code>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C6A15B] uppercase tracking-wider mb-1.5">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 bg-[#12070A] border border-[#48151F] focus:border-[#C6A15B] rounded-lg text-xs text-[#F5EFE7] placeholder-[#6A5A5D] focus:outline-none transition-colors font-mono"
                  />
                  <p className="mt-1 text-[11px] text-[#918481]">
                    Found in your Supabase Dashboard → Settings → API → Project API Keys (anon public).
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C6A15B] hover:bg-[#D5B15C] text-[#1A0E13] font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Connect Now
                  </button>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3.5 py-2 bg-[#2E121B] hover:bg-[#48151F] border border-[#C6A15B]/30 text-[#F5EFE7] text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>

                  {configStatus.isCustom && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Credentials
                    </button>
                  )}
                </div>
              </form>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    testResult === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-950/40 text-red-300 border border-red-500/30'
                  }`}
                >
                  {testResult === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Connection test succeeded! Supabase answered query.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Could not query Supabase tables. Ensure SQL schema is created or continue in demo mode.</span>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Guide Tab answering the user's specific questions & errors */
            <div className="space-y-5 text-xs">
              {/* Question 1: Where to encode this? */}
              <div className="bg-[#12070A] p-4 rounded-lg border border-[#48151F] space-y-2.5">
                <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Where to encode this? (Fixing the PowerShell error)</span>
                </div>
                <p className="text-[#B7AAA1] leading-relaxed">
                  In your PowerShell screenshot, you typed{' '}
                  <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">
                    VITE_SUPABASE_URL=...
                  </code>{' '}
                  directly into the terminal. In Windows PowerShell, that causes the error:{' '}
                  <em>&ldquo;The term &apos;VITE_SUPABASE_URL=...&apos; is not recognized&rdquo;</em>.
                </p>
                <div className="p-3 bg-[#0A0507] rounded border border-[#301017] space-y-1.5 font-mono text-[11px]">
                  <div className="text-[#B7AAA1]">
                    Instead, save these lines inside the file named <span className="text-emerald-400">.env</span> in your project root:
                  </div>
                  <pre className="text-emerald-300 select-all p-2 bg-black/60 rounded overflow-x-auto">
{`# .env file in root directory
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                  </pre>
                  <button
                    onClick={copyEnvSnippet}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#48151F] hover:bg-[#861F32] text-xs text-[#F5EFE7] rounded cursor-pointer mt-1"
                  >
                    <Copy className="w-3 h-3 text-[#C6A15B]" />
                    {copiedEnv ? 'Copied!' : 'Copy .env template'}
                  </button>
                </div>
              </div>

              {/* Question 2: Fixing the npm install esbuild error */}
              <div className="bg-[#12070A] p-4 rounded-lg border border-[#48151F] space-y-2.5">
                <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Fixing the npm install ERESOLVE error (Screenshot 1)</span>
                </div>
                <p className="text-[#B7AAA1] leading-relaxed">
                  When running <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">npm install @supabase/supabase-js</code>, npm encountered an esbuild peer dependency conflict.
                  Run this command on your machine instead:
                </p>
                <div className="p-3 bg-[#0A0507] rounded border border-[#301017] font-mono text-[11px] text-emerald-300">
                  npm install @supabase/supabase-js --legacy-peer-deps
                </div>
              </div>

              {/* Question 3: Supabase SQL Schema */}
              <div className="bg-[#12070A] p-4 rounded-lg border border-[#48151F] space-y-2.5">
                <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                  <Database className="w-4 h-4" />
                  <span>Automatic SQL Schema</span>
                </div>
                <p className="text-[#B7AAA1] leading-relaxed">
                  We have included the complete schema file <code className="text-[#C6A15B]">supabase-schema.sql</code> in the project.
                  To create the tables in your Supabase project:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[#B7AAA1]">
                  <li>Open your Supabase Dashboard → SQL Editor</li>
                  <li>Click &ldquo;New Query&rdquo;</li>
                  <li>Paste the contents of <code className="text-[#C6A15B]">supabase-schema.sql</code> and click Run</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#140A0E] border-t border-[#48151F] flex items-center justify-between text-xs text-[#918481]">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#C6A15B] hover:text-[#D5B15C] transition-colors"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2E121B] hover:bg-[#48151F] text-[#F5EFE7] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
