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
  HelpCircle,
  Wand2,
  Check,
  ArrowRight,
  FileCode,
  RefreshCw,
  ShoppingBag,
  Wine,
  Users
} from 'lucide-react';
import {
  isValidHttpUrl,
  isValidAnonKey,
  sanitizeSupabaseUrl,
  getSupabaseConfigStatus,
  setCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
  DEFAULT_FALLBACK_URL,
  testSupabaseConnection,
  SupabaseTestResult
} from '../lib/supabase';
import { useWineStore } from '../context/WineStoreContext';
import schemaSql from '../../supabase-schema.sql?raw';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_SCHEMA_SQL = schemaSql;

export const SupabaseConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { showToast, orders, products, registeredUsers, syncOrdersToSupabase, syncUsersToSupabase, syncCatalogToSupabase } = useWineStore();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [isSeedingCatalog, setIsSeedingCatalog] = useState(false);
  const [testResult, setTestResult] = useState<SupabaseTestResult | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'configure' | 'guide'>('configure');

  const configStatus = getSupabaseConfigStatus();

  // Populate on modal open
  useEffect(() => {
    if (isOpen) {
      const storedUrl = localStorage.getItem('vinea_custom_supabase_url') || '';
      const storedKey = localStorage.getItem('vinea_custom_supabase_key') || '';
      
      const cleanedUrl = sanitizeSupabaseUrl(storedUrl);
      if (cleanedUrl && cleanedUrl !== storedUrl) {
        localStorage.setItem('vinea_custom_supabase_url', cleanedUrl);
        setUrl(cleanedUrl);
      } else {
        setUrl(storedUrl || (configStatus.envUrl ? sanitizeSupabaseUrl(configStatus.envUrl) : ''));
      }

      setAnonKey(storedKey || configStatus.envKey || '');
      setTestResult(null);
    }
  }, [isOpen, configStatus.envUrl, configStatus.envKey]);

  if (!isOpen) return null;

  const hasRestSuffix = url.includes('/rest/v1') || url.includes('/auth/v1');

  const handleAutoFixUrl = () => {
    const cleaned = sanitizeSupabaseUrl(url);
    setUrl(cleaned);
    showToast('Cleaned Supabase Project URL: removed REST endpoint suffix.', 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUrl = sanitizeSupabaseUrl(url);
    const cleanKey = anonKey.trim();

    if (!isValidHttpUrl(cleanUrl)) {
      showToast('Please provide a valid Supabase project URL (e.g. https://xyz.supabase.co)', 'error');
      return;
    }

    if (!isValidAnonKey(cleanKey)) {
      showToast('Key appears too short or invalid. Check Supabase Dashboard → Settings → API.', 'error');
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

    const cleanUrl = sanitizeSupabaseUrl(url);
    const cleanKey = anonKey.trim();

    if (cleanUrl && cleanUrl !== url) {
      setUrl(cleanUrl);
    }

    try {
      const result = await testSupabaseConnection(cleanUrl, cleanKey);
      setTestResult(result);

      if (result.status === 'connected') {
        showToast('Supabase connection verified! Database tables are ready.', 'success');
      } else if (result.status === 'connected_missing_tables') {
        showToast('Connected to Supabase project! Remember to run SQL schema for tables.', 'info');
      } else {
        showToast(result.message || 'Unable to reach Supabase with provided credentials.', 'error');
      }
    } catch {
      setTestResult({
        success: false,
        status: 'error',
        message: 'Unexpected network error during connectivity test.',
        sanitizedUrl: cleanUrl
      });
      showToast('Connection test error occurred.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualOrderSync = async () => {
    setIsSyncingOrders(true);
    try {
      await syncOrdersToSupabase();
    } finally {
      setIsSyncingOrders(false);
    }
  };

  const handleManualUserSync = async () => {
    setIsSyncingUsers(true);
    try {
      const res = await syncUsersToSupabase();
      if (res.syncedCount > 0) {
        setTestResult({
          success: true,
          status: 'connected',
          message: `Successfully synchronized ${res.syncedCount} customer account(s) to Supabase!`,
          sanitizedUrl: sanitizeSupabaseUrl(url)
        });
      }
    } finally {
      setIsSyncingUsers(false);
    }
  };

  const handleSeedCatalog = async () => {
    setIsSeedingCatalog(true);
    try {
      const res = await syncCatalogToSupabase();
      if (res.success) {
        setTestResult({
          success: true,
          status: 'connected',
          message: `Successfully seeded ${res.productsCount} luxury wines, ${res.categoriesCount} categories, reviews and users into Supabase!`,
          sanitizedUrl: sanitizeSupabaseUrl(url)
        });
      }
    } finally {
      setIsSeedingCatalog(false);
    }
  };

  const copyEnvSnippet = () => {
    const cleanUrl = sanitizeSupabaseUrl(url) || 'https://your-project-id.supabase.co';
    const text = `VITE_SUPABASE_URL=${cleanUrl}\nVITE_SUPABASE_ANON_KEY=${anonKey.trim() || 'eyJhbGciOi...'}`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    showToast('Copied .env snippet to clipboard!', 'success');
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const copySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSchema(true);
    showToast('Complete SQL schema copied to clipboard! Paste in Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-[#F5EFE7]">
      <div className="relative w-full max-w-2xl bg-[#1A0E13] border border-[#C6A15B]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#48151F] bg-[#140A0E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-[#3ECF8E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-[#F5EFE7]">
                Cellar Admin: Supabase Database Setup
              </h2>
              <p className="text-xs text-[#B7AAA1]">
                Administrative console: Connect your live Supabase PostgreSQL database & cloud tables
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#48151F] bg-[#170C10] px-6">
          <button
            onClick={() => setActiveTab('configure')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'configure'
                ? 'border-[#C6A15B] text-[#C6A15B] font-semibold'
                : 'border-transparent text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            <span>Direct Connection Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-[#C6A15B] text-[#C6A15B] font-semibold'
                : 'border-transparent text-[#B7AAA1] hover:text-[#F5EFE7]'
            }`}
          >
            <span>SQL Schema & Order Troubleshooting</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#F5EFE7] text-sm">
          {activeTab === 'configure' ? (
            <>
              {/* Current Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  configStatus.isConfigured
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
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
                      : 'Demo Mode (Offline / In-Memory)'}
                  </div>
                  <p className="text-[#B7AAA1] leading-relaxed">
                    {configStatus.isConfigured
                      ? `Active URL: ${configStatus.activeUrl}`
                      : 'Orders and catalog are currently saved in browser local storage. Connect your real Supabase project below to persist orders directly to your cloud PostgreSQL database.'}
                  </p>
                </div>
              </div>

              {/* Order Sync Quick Card */}
              {configStatus.isConfigured && (
                <div className="p-4 bg-[#140A0E] rounded-xl border border-[#48151F] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#C6A15B]/10 text-[#C6A15B]">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F5EFE7]">
                        Store Orders Sync
                      </div>
                      <div className="text-[11px] text-[#B7AAA1]">
                        {orders.length} order(s) recorded in store state
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualOrderSync}
                    disabled={isSyncingOrders}
                    className="py-1.5 px-3 rounded-lg bg-[#2E121B] hover:bg-[#48151F] border border-[#C6A15B]/30 text-xs font-medium text-[#F5EFE7] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C6A15B] ${isSyncingOrders ? 'animate-spin' : ''}`} />
                    <span>{isSyncingOrders ? 'Syncing...' : 'Sync All Orders to Supabase'}</span>
                  </button>
                </div>
              )}

              {/* Customer Accounts Sync Quick Card */}
              {configStatus.isConfigured && (
                <div className="p-4 bg-[#140A0E] rounded-xl border border-[#48151F] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#C6A15B]/10 text-[#C6A15B]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F5EFE7] flex items-center gap-2">
                        <span>Customer Accounts Sync</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#C6A15B]/20 text-[#C6A15B] font-mono">
                          {registeredUsers.length} Account(s)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#B7AAA1]">
                        {registeredUsers.length > 0
                          ? `Sync your ${registeredUsers.length} created account(s) into Supabase 'users' table`
                          : 'No custom accounts created yet; register an account to sync'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualUserSync}
                    disabled={isSyncingUsers || registeredUsers.length === 0}
                    className="py-1.5 px-3 rounded-lg bg-[#2E121B] hover:bg-[#48151F] border border-[#C6A15B]/30 text-xs font-medium text-[#F5EFE7] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C6A15B] ${isSyncingUsers ? 'animate-spin' : ''}`} />
                    <span>{isSyncingUsers ? 'Syncing...' : 'Sync Accounts to Supabase'}</span>
                  </button>
                </div>
              )}

              {/* Catalog & Wine Seeding Quick Card */}
              {configStatus.isConfigured && (
                <div className="p-4 bg-[#140A0E] rounded-xl border border-[#3ECF8E]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E]">
                      <Wine className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F5EFE7] flex items-center gap-2">
                        <span>Wines & Catalog Seeding</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#3ECF8E]/20 text-[#3ECF8E] font-mono">
                          12 Wines
                        </span>
                      </div>
                      <div className="text-[11px] text-[#B7AAA1]">
                        Populate all products, categories, reviews & collector profiles
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedCatalog}
                    disabled={isSeedingCatalog}
                    className="py-1.5 px-3 rounded-lg bg-[#142C1D] hover:bg-[#1C3D29] border border-[#3ECF8E]/40 text-xs font-medium text-[#3ECF8E] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#3ECF8E] ${isSeedingCatalog ? 'animate-spin' : ''}`} />
                    <span>{isSeedingCatalog ? 'Seeding...' : 'Seed Catalog to Supabase'}</span>
                  </button>
                </div>
              )}

              {/* Credentials Input Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A15B]">
                      Supabase Project URL
                    </label>
                    {hasRestSuffix && (
                      <button
                        type="button"
                        onClick={handleAutoFixUrl}
                        className="text-[11px] text-[#3ECF8E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Auto-Fix URL (Remove /rest/v1)</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={() => {
                      if (hasRestSuffix) handleAutoFixUrl();
                    }}
                    placeholder="https://your-project-id.supabase.co"
                    className={`w-full px-4 py-2.5 bg-[#0D0508] border rounded-xl font-mono text-xs text-[#F5EFE7] focus:outline-none transition-colors ${
                      hasRestSuffix
                        ? 'border-amber-500/70 focus:border-amber-400'
                        : 'border-[#48151F] focus:border-[#C6A15B]'
                    }`}
                  />
                  {hasRestSuffix ? (
                    <p className="mt-1.5 text-[11px] text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        URL includes &ldquo;/rest/v1/&rdquo;. The SDK needs the base URL only. Click <strong>Auto-Fix</strong> or save to correct automatically.
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#B7AAA1]">
                      Found in Supabase Dashboard → Settings → API → Project URL. Must start with <code className="text-[#C6A15B]">https://</code>.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A15B] mb-1.5">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-2.5 bg-[#0D0508] border border-[#48151F] rounded-xl font-mono text-xs text-[#F5EFE7] focus:border-[#C6A15B] focus:outline-none transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-[#B7AAA1]">
                    Found in Supabase Dashboard → Settings → API → Project API Keys (anon public).
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#C6A15B] to-[#D5B15C] text-[#140A0E] font-semibold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Connect Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-4 py-2.5 bg-[#2E121B] hover:bg-[#48151F] border border-[#C6A15B]/30 text-[#F5EFE7] text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Database className={`w-4 h-4 text-[#C6A15B] ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  {configStatus.isCustom && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Credentials</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Diagnostic Test Result Banner */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl text-xs space-y-2 border ${
                    testResult.status === 'connected'
                      ? 'bg-emerald-950/50 text-emerald-200 border-emerald-500/50'
                      : testResult.status === 'connected_missing_tables'
                      ? 'bg-amber-950/50 text-amber-200 border-amber-500/50'
                      : 'bg-red-950/50 text-red-200 border-red-500/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {testResult.status === 'connected' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : testResult.status === 'connected_missing_tables' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1">
                      <div className="font-semibold text-sm">
                        {testResult.status === 'connected'
                          ? '✓ Supabase Connection Verified & Tables Ready!'
                          : testResult.status === 'connected_missing_tables'
                          ? 'Connected to Project (Database Tables Needed)'
                          : 'Connection Error'}
                      </div>
                      <p className="leading-relaxed">{testResult.message}</p>
                    </div>
                  </div>

                  {testResult.status === 'connected_missing_tables' && (
                    <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-amber-500/30">
                      <button
                        type="button"
                        onClick={copySqlSchema}
                        className="py-1.5 px-3 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-100 text-xs font-medium border border-amber-400/40 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema to Clipboard'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('guide')}
                        className="py-1.5 px-3 rounded-lg bg-[#2E121B] hover:bg-[#48151F] text-[#F5EFE7] text-xs font-medium border border-[#C6A15B]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>View SQL Setup Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Guide & Troubleshooting Tab */
            <div className="space-y-5 text-xs">
              {/* Account and Data Persistence Guidance */}
              <div className="bg-[#190C11] p-4 rounded-xl border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Why Did Newly Created Accounts Not Appear in Supabase?</span>
                </div>
                <div className="text-[#B7AAA1] space-y-2 leading-relaxed">
                  <p>
                    When creating an account, if your Supabase <code className="text-[#C6A15B]">users</code> table was missing customer profile columns (like <code className="text-[#C6A15B]">date_of_birth</code>, error 42703), the cloud write was rejected and stored safely in your browser.
                  </p>
                  <p className="text-[#F5EFE7]">
                    <strong>How this is fixed now:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1 text-[#F5EFE7]">
                    <li>
                      <strong>1-Click Sync</strong>: Go to the <em>Direct Connection Setup</em> tab and click <strong className="text-[#C6A15B]">&ldquo;Sync Accounts to Supabase&rdquo;</strong>. The app will immediately upload your registered accounts to your live Supabase <code className="text-[#C6A15B]">users</code> table.
                    </li>
                    <li>
                      <strong>Adaptive Schema Fallback</strong>: Even if your Supabase table has only basic columns, account registrations now adaptively save with core columns (<code className="text-[#C6A15B]">user_id, name, email, phone, role, password</code>).
                    </li>
                    <li>
                      <strong>Safe SQL Migration</strong>: Step 1 below adds all optional columns (<code className="text-[#C6A15B]">date_of_birth</code>, etc.) via <code className="text-[#C6A15B]">ALTER TABLE ... ADD COLUMN IF NOT EXISTS</code> without errors.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 1: 1-Click Copy Schema */}
              <div className="bg-[#12070A] p-4 rounded-xl border border-[#48151F] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                    <Database className="w-4 h-4 text-[#C6A15B]" />
                    <span>Step 1: Run the SQL Schema in Supabase</span>
                  </div>
                  <button
                    type="button"
                    onClick={copySqlSchema}
                    className="py-1 px-3 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{copiedSchema ? 'Copied!' : 'Copy SQL Schema'}</span>
                  </button>
                </div>

                <p className="text-[#B7AAA1] leading-relaxed">
                  Creates the <code className="text-[#C6A15B]">orders</code>, <code className="text-[#C6A15B]">products</code>, <code className="text-[#C6A15B]">categories</code>, <code className="text-[#C6A15B]">reviews</code>, and <code className="text-[#C6A15B]">users</code> tables with public insert policies:
                </p>

                <ol className="list-decimal list-inside space-y-1 text-[#B7AAA1] pl-1">
                  <li>In your Supabase project dashboard, click <strong>SQL Editor</strong> in the left sidebar (icon <code className="text-[#C6A15B]">&gt;_</code>)</li>
                  <li>Click <strong>New Query</strong></li>
                  <li>Paste the copied SQL and click <strong>Run</strong></li>
                </ol>
              </div>

              {/* Step 2: Push Local Orders */}
              <div className="bg-[#12070A] p-4 rounded-xl border border-[#48151F] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                    <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
                    <span>Step 2: Sync Local Orders Directly to Supabase</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualOrderSync}
                    disabled={isSyncingOrders || !configStatus.isConfigured}
                    className="py-1 px-3 rounded-lg bg-[#C6A15B] hover:bg-[#D5B15C] text-[#140A0E] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin' : ''}`} />
                    <span>{isSyncingOrders ? 'Syncing...' : 'Sync Pending Orders'}</span>
                  </button>
                </div>
                <p className="text-[#B7AAA1] leading-relaxed">
                  Orders placed while in demo mode remain saved in your browser. Once your Supabase connection is active, click <strong>Sync Pending Orders</strong> to upload them all immediately into your live Supabase <code className="text-[#C6A15B]">orders</code> table.
                </p>
              </div>

              {/* Step 3: .env file format */}
              <div className="bg-[#12070A] p-4 rounded-xl border border-[#48151F] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C6A15B] font-semibold text-sm">
                    <FileCode className="w-4 h-4 text-[#C6A15B]" />
                    <span>Alternative: Store in .env File</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyEnvSnippet}
                    className="py-1 px-2.5 bg-[#48151F] hover:bg-[#861F32] text-xs text-[#F5EFE7] rounded cursor-pointer"
                  >
                    {copiedEnv ? 'Copied!' : 'Copy .env snippet'}
                  </button>
                </div>
                <div className="p-3 bg-[#0A0507] rounded-lg border border-[#301017] font-mono text-[11px] text-emerald-300">
                  VITE_SUPABASE_URL=https://qxecwloxupgcprpbwpme.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=your_anon_key_here
                </div>
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
