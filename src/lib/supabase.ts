import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

export const DEFAULT_FALLBACK_URL = 'https://vinea-wine-cellar.supabase.co';
export const DEFAULT_FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key';

/**
 * Automatically cleans and standardizes a Supabase Project URL.
 * Strips accidental trailing slashes and PostgREST endpoints like `/rest/v1` or `/rest/v1/`
 * which users frequently copy from the Supabase API documentation settings page.
 * Example: "https://qxecwloxupgcprpbwpme.supabase.co/rest/v1/" -> "https://qxecwloxupgcprpbwpme.supabase.co"
 */
export function sanitizeSupabaseUrl(candidate: unknown): string {
  if (!candidate || typeof candidate !== 'string') return '';
  let trimmed = candidate.trim();
  // Strip /rest/v1/ or /rest/v1 or /auth/v1/ or /auth/v1
  trimmed = trimmed.replace(/\/(rest|auth)\/v[0-9]+\/?$/i, '');
  // Strip any trailing slashes
  trimmed = trimmed.replace(/\/+$/, '');
  return trimmed;
}

/**
 * Validates whether a candidate string is a well-formed HTTP or HTTPS URL.
 * Prevents "@supabase/supabase-js" from crashing on invalid values like numbers,
 * empty strings, or unformatted strings.
 */
export function isValidHttpUrl(candidate: unknown): candidate is string {
  if (!candidate || typeof candidate !== 'string') return false;
  const clean = sanitizeSupabaseUrl(candidate);
  if (!clean.startsWith('https://') && !clean.startsWith('http://')) {
    return false;
  }
  try {
    const parsed = new URL(clean);
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
 * Retrieve credentials from localStorage (if configured via in-app UI) or Vite env.
 * Automatically cleans /rest/v1/ if user previously saved the REST endpoint by mistake.
 */
function resolveCredentials() {
  let customUrl: string | null = null;
  let customKey: string | null = null;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedUrl = localStorage.getItem('vinea_custom_supabase_url');
      if (storedUrl) {
        const cleanedUrl = sanitizeSupabaseUrl(storedUrl);
        // Auto-heal localStorage if the user previously saved with /rest/v1
        if (cleanedUrl !== storedUrl && isValidHttpUrl(cleanedUrl)) {
          localStorage.setItem('vinea_custom_supabase_url', cleanedUrl);
        }
        customUrl = cleanedUrl;
      }
      customKey = localStorage.getItem('vinea_custom_supabase_key');
    } catch {
      // Ignore localStorage errors
    }
  }

  const metaEnv = import.meta.env as Record<string, string | undefined>;
  const rawEnvUrl = (
    metaEnv.VITE_SUPABASE_URL ||
    metaEnv.SUPABASE_URL ||
    metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).toString().trim();

  const rawEnvKey = (
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    metaEnv.SUPABASE_ANON_KEY ||
    metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_KEY ||
    metaEnv.SUPABASE_KEY ||
    ''
  ).toString().trim();
  const envUrl = sanitizeSupabaseUrl(rawEnvUrl);
  const envKey = rawEnvKey;

  const chosenUrl = isValidHttpUrl(customUrl)
    ? sanitizeSupabaseUrl(customUrl!)
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
    rawEnvUrl,
    rawEnvKey,
    isCustom: Boolean(isValidHttpUrl(customUrl) && isValidAnonKey(customKey)),
  };
}

const initialCreds = resolveCredentials();

export const isSupabaseConfigured = initialCreds.isConfigured;

/**
 * Safely creates a Supabase client without ever throwing an unhandled exception.
 */
function createSafeSupabaseClient(url: string, key: string): SupabaseClient {
  const safeUrl = isValidHttpUrl(url) ? sanitizeSupabaseUrl(url) : DEFAULT_FALLBACK_URL;
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
 * Helper to update Supabase credentials dynamically from the UI.
 * Automatically sanitizes any trailing /rest/v1 or slashes.
 */
export function setCustomSupabaseCredentials(url: string, key: string): boolean {
  const cleanUrl = sanitizeSupabaseUrl(url);
  if (!isValidHttpUrl(cleanUrl)) {
    return false;
  }
  if (!isValidAnonKey(key)) {
    return false;
  }
  try {
    localStorage.setItem('vinea_custom_supabase_url', cleanUrl);
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
    rawEnvKey: creds.rawEnvKey,
    envUrl: creds.rawEnvUrl,
    envKey: creds.rawEnvKey,
    isUrlValid: isValidHttpUrl(creds.rawEnvUrl),
    isKeyValid: isValidAnonKey(creds.rawEnvKey),
  };
}

export interface SupabaseTestResult {
  success: boolean;
  status: 'connected' | 'connected_missing_tables' | 'invalid_url' | 'invalid_key' | 'unauthorized' | 'error';
  message: string;
  sanitizedUrl: string;
}

/**
 * Test connectivity with Supabase dynamically against either custom input or active credentials.
 * Automatically sanitizes any /rest/v1 path.
 */
export async function testSupabaseConnection(
  candidateUrl?: string,
  candidateKey?: string
): Promise<SupabaseTestResult> {
  const activeCreds = resolveCredentials();
  const rawUrl = candidateUrl !== undefined ? candidateUrl : activeCreds.url;
  const rawKey = candidateKey !== undefined ? candidateKey : activeCreds.key;

  const targetUrl = sanitizeSupabaseUrl(rawUrl);
  const targetKey = (rawKey || '').trim();

  if (!isValidHttpUrl(targetUrl)) {
    return {
      success: false,
      status: 'invalid_url',
      message: 'Invalid Supabase Project URL. It must start with https:// (e.g. https://xyz.supabase.co)',
      sanitizedUrl: targetUrl
    };
  }

  if (!isValidAnonKey(targetKey)) {
    return {
      success: false,
      status: 'invalid_key',
      message: 'Missing or invalid Supabase Anon / Public Key (must be at least 20 characters).',
      sanitizedUrl: targetUrl
    };
  }

  try {
    const testClient = createClient(targetUrl, targetKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await testClient.from('products').select('product_id').limit(1);

    if (error) {
      const msg = error.message || '';

      // Check if credentials are valid, but SQL tables haven't been created yet
      if (
        (msg.includes('relation') && msg.includes('does not exist')) ||
        error.code === '42P01' ||
        error.code === 'PGRST204'
      ) {
        return {
          success: true,
          status: 'connected_missing_tables',
          message: 'Project connected! Note: Database tables (products) have not been created in Supabase yet. Run the SQL schema from the guide tab.',
          sanitizedUrl: targetUrl
        };
      }

      // Check if API key is invalid/unauthorized
      if (
        msg.includes('JWT') ||
        msg.includes('apikey') ||
        msg.includes('unauthorized') ||
        msg.includes('Invalid API key') ||
        error.code === 'PGRST301'
      ) {
        return {
          success: false,
          status: 'unauthorized',
          message: 'Authentication failed. Please check the "anon public" key in your Supabase Dashboard → Settings → API.',
          sanitizedUrl: targetUrl
        };
      }

      return {
        success: false,
        status: 'error',
        message: `Supabase returned: ${error.message}`,
        sanitizedUrl: targetUrl
      };
    }

    return {
      success: true,
      status: 'connected',
      message: 'Supabase connection verified! Products table accessible.',
      sanitizedUrl: targetUrl
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'error',
      message: err?.message || 'Unable to establish connection to Supabase endpoint.',
      sanitizedUrl: targetUrl
    };
  }
}

export type { SupabaseClient, SupabaseUser, Session };
export default supabase;

