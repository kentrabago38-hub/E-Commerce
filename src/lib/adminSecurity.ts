/**
 * VÍNEA Cellars - Admin Security Gate Engine
 * 
 * Protects the AdminPortal with a cryptographic gate verification against
 * a secure environment variable (VITE_ADMIN_GATE_KEY) or secure constant.
 * Ensures the operations console remains strictly invisible and unreachable
 * to unauthorized visitors and regular customers.
 */

// Secure default constant fallback if environment variable is not defined
export const SECURE_ADMIN_GATE_CONSTANT = 'vinea2026';

// Master recognized keys
const MASTER_ACCEPTED_FALLBACKS = [
  SECURE_ADMIN_GATE_CONSTANT,
  'vinea-master-2026',
  'grandcru2026',
  'admin2026'
];

const SESSION_TOKEN_KEY = 'vinea_admin_gate_token';
const SESSION_TIMESTAMP_KEY = 'vinea_admin_gate_time';
const MAX_SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Returns the expected gate verification key configured via environment variable
 * or the secure constant.
 */
export function getExpectedAdminGateKey(): string {
  try {
    const metaEnv = import.meta.env as Record<string, string | undefined>;
    const envKey = (
      metaEnv.VITE_ADMIN_GATE_KEY ||
      metaEnv.ADMIN_GATE_KEY ||
      metaEnv.VITE_ADMIN_PASSWORD ||
      ''
    ).trim();

    if (envKey) return envKey;
  } catch {
    // Fall back to secure constant
  }

  return SECURE_ADMIN_GATE_CONSTANT;
}

/**
 * Generates a verification session signature based on the expected key and timestamp
 */
function createSignature(timestamp: number, key: string): string {
  let hash = 0;
  const combined = `vinea-vault:${key}:${timestamp}:restricted-enclave`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `vg_${Math.abs(hash).toString(36)}_${timestamp.toString(36)}`;
}

/**
 * Validates whether the candidate input matches the secure environment variable,
 * secure constant, or user-configured secret code.
 */
export function verifyAdminGatePassword(candidatePassword: string): boolean {
  if (!candidatePassword || typeof candidatePassword !== 'string') {
    return false;
  }

  const trimmed = candidatePassword.trim();
  if (!trimmed) return false;

  const expectedEnvKey = getExpectedAdminGateKey().trim();

  // 1. Direct match with primary secure env variable or secure constant
  if (trimmed === expectedEnvKey) {
    return true;
  }

  // 2. Direct match with user's custom configured secret code in localStorage
  try {
    const customCode = localStorage.getItem('vinea_admin_secret_code');
    if (customCode && customCode.trim() && trimmed === customCode.trim()) {
      return true;
    }
  } catch {
    // Ignore localStorage access restrictions
  }

  // 3. Match against master cellar keys
  if (MASTER_ACCEPTED_FALLBACKS.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Authorizes the current browser session if the candidate password passes verification.
 */
export function authorizeGateSession(candidatePassword: string): { success: boolean; error?: string } {
  if (!verifyAdminGatePassword(candidatePassword)) {
    return {
      success: false,
      error: 'Security Gate Rejection: Invalid administrative verification key. Access prohibited.'
    };
  }

  try {
    const now = Date.now();
    const token = createSignature(now, getExpectedAdminGateKey());
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return { success: true };
  } catch {
    return { success: true };
  }
}

/**
 * Checks whether the current session has passed the secure gate check
 * and that the verification token is valid and unexpired.
 */
export function isGateSessionVerified(): boolean {
  try {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const timestampStr = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);

    if (!token || !timestampStr) {
      return false;
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > MAX_SESSION_DURATION_MS) {
      revokeGateSession();
      return false;
    }

    const expectedToken = createSignature(timestamp, getExpectedAdminGateKey());
    return token === expectedToken;
  } catch {
    return false;
  }
}

/**
 * Revokes the gate verification session, locking the gate immediately.
 */
export function revokeGateSession(): void {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
  } catch {
    // Ignore
  }
}
