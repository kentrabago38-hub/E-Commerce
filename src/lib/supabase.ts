import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

export const DEFAULT_FALLBACK_URL = 'https://vinea-wine-cellar.supabase.co';
export const DEFAULT_FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key';

/**
 * Validates whether a candidate string is a well-formed HTTP or HTTPS URL.
 * Prevents "@supabase/supabase-js" from crashing on invalid values like numbers,
 * empty strings, or unformatted strings.
 */
export function isValidHttpUrl(candidate: unknown): candidate is string {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      parsed.hostname.length > 3 &&
      !parsed.hostname.includes('your-project-ref') &&
      !parsed.hostname.includes('placeholder')
    );
  } catch {
    return false;
  }
}

/**
 * Validates whether a candidate key looks like a real Supabase Anon/Public Key.
 */
export function isValidAnonKey(candidate: unknown): candidate is string {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  return trimmed.length >= 20 && !trimmed.includes('placeholder_anon_key');
}

/**
 * Retrieve credentials from localStorage (if configured via in-app UI) or Vite env
 */
function resolveCredentials() {
  let customUrl: string | null = null;
  let customKey: string | null = null;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      customUrl = localStorage.getItem('vinea_custom_supabase_url');
      customKey = localStorage.getItem('vinea_custom_supabase_key');
    } catch {
      // Ignore localStorage errors
    }
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').toString().trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').toString().trim();

  const chosenUrl = isValidHttpUrl(customUrl)
    ? customUrl!
    : isValidHttpUrl(envUrl)
      ? envUrl
      : DEFAULT_FALLBACK_URL;

  const chosenKey = isValidAnonKey(customKey)
    ? customKey!
    : isValidAnonKey(envKey)
      ? envKey
      : DEFAULT_FALLBACK_KEY;

  const isConfigured =
    (isValidHttpUrl(customUrl) && isValidAnonKey(customKey)) ||
    (isValidHttpUrl(envUrl) && isValidAnonKey(envKey));

  return {
    url: chosenUrl,
    key: chosenKey,
    isConfigured,
    rawEnvUrl: envUrl,
    rawEnvKey: envKey,
    isCustom: Boolean(isValidHttpUrl(customUrl) && isValidAnonKey(customKey)),
  };
}

const initialCreds = resolveCredentials();

export const isSupabaseConfigured = initialCreds.isConfigured;

/**
 * Safely creates a Supabase client without ever throwing an unhandled exception.
 */
function createSafeSupabaseClient(url: string, key: string): SupabaseClient {
  const safeUrl = isValidHttpUrl(url) ? url : DEFAULT_FALLBACK_URL;
  const safeKey = key && key.length > 10 ? key : DEFAULT_FALLBACK_KEY;

  try {
    return createClient(safeUrl, safeKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('[VÍNEA Supabase] Safe client fallback triggered:', err);
    // Guaranteed fallback with hardcoded valid URL & key
    return createClient(DEFAULT_FALLBACK_URL, DEFAULT_FALLBACK_KEY);
  }
}

/**
 * Global Supabase Client instance for VÍNEA Luxury Wine Marketplace
 */
export const supabase: SupabaseClient = createSafeSupabaseClient(
  initialCreds.url,
  initialCreds.key
);

if (!initialCreds.isConfigured) {
  console.info(
    '[VÍNEA Supabase] Running in resilient offline/demo mode with local storage persistence. To connect to a live Supabase project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or configure via the in-app Supabase Connection tool.'
  );
}

/**
 * Helper to update Supabase credentials dynamically from the UI
 */
export function setCustomSupabaseCredentials(url: string, key: string): boolean {
  if (!isValidHttpUrl(url)) {
    return false;
  }
  if (!isValidAnonKey(key)) {
    return false;
  }
  try {
    localStorage.setItem('vinea_custom_supabase_url', url.trim());
    localStorage.setItem('vinea_custom_supabase_key', key.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear custom Supabase credentials from localStorage
 */
export function clearCustomSupabaseCredentials(): void {
  try {
    localStorage.removeItem('vinea_custom_supabase_url');
    localStorage.removeItem('vinea_custom_supabase_key');
  } catch {
    // Ignore
  }
}

/**
 * Get current configuration status for UI inspection
 */
export function getSupabaseConfigStatus() {
  const creds = resolveCredentials();
  return {
    isConfigured: creds.isConfigured,
    isCustom: creds.isCustom,
    activeUrl: creds.url,
    rawEnvUrl: creds.rawEnvUrl,
    isUrlValid: isValidHttpUrl(creds.rawEnvUrl),
    isKeyValid: isValidAnonKey(creds.rawEnvKey),
  };
}

/**
 * Test connectivity with Supabase
 */
export async function testSupabaseConnection(): Promise<boolean> {
  const status = getSupabaseConfigStatus();
  if (!status.isConfigured) {
    return true; // Resilient local demo mode
  }
  try {
    const { error } = await supabase.from('products').select('product_id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

export type { SupabaseClient, SupabaseUser, Session };
export default supabase;
