/**
 * VÍNEA Input Validation & Error Handling Suite
 * Enforces strict error handlings:
 * - 11-digit mobile phone number (e.g. 09XXXXXXXXX)
 * - Emails strictly in @gmail.com (e.g. name@gmail.com)
 * - Complete delivery addresses (street min 5 chars, city, province, 4-digit postal code)
 * - Full names, passwords, and form field sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Validates that an email ends specifically with @gmail.com
 * Rules:
 * - Cannot be empty
 * - Must end with '@gmail.com' (case-insensitive)
 * - Local part (before @gmail.com) must contain at least 2 alphanumeric/valid characters
 */
export function validateGmail(email: string): ValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }

  const lower = trimmed.toLowerCase();
  if (!lower.endsWith('@gmail.com')) {
    return {
      isValid: false,
      error: 'Email must be a valid @gmail.com address (e.g. username@gmail.com).'
    };
  }

  // Ensure there is a valid local part before @gmail.com
  const localPart = lower.slice(0, -10); // length of '@gmail.com' is 10
  if (localPart.length < 3) {
    return {
      isValid: false,
      error: 'Gmail username must be at least 3 characters before @gmail.com.'
    };
  }

  const validGmailRegex = /^[a-z0-9](\.?[a-z0-9_-]){1,}@gmail\.com$/i;
  if (!validGmailRegex.test(lower)) {
    return {
      isValid: false,
      error: 'Please enter a valid Gmail address (letters, numbers, dots, dashes).'
    };
  }

  return { isValid: true, normalized: lower };
}

/**
 * Validates that a phone number is an 11-digit mobile number.
 * Normalizes inputs:
 * - 09171234567 -> 09171234567 (11 digits)
 * - +63 917 123 4567 -> 09171234567
 * - 639171234567 -> 09171234567
 * - 0917-123-4567 -> 09171234567
 */
export function validatePhone11Digit(phone: string): ValidationResult {
  const raw = (phone || '').trim();
  if (!raw) {
    return { isValid: false, error: '11-digit phone number is required.' };
  }

  // Extract all digits
  const digitsOnly = raw.replace(/\D/g, '');

  let normalized = digitsOnly;

  // Handle +63 / 63 prefix (12 digits starting with 639 -> converts to 09...)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('63')) {
    normalized = '0' + digitsOnly.slice(2);
  } else if (digitsOnly.length === 10 && digitsOnly.startsWith('9')) {
    normalized = '0' + digitsOnly;
  }

  // Must be exactly 11 digits
  if (normalized.length !== 11) {
    return {
      isValid: false,
      error: `Phone number must be exactly 11 digits (currently ${normalized.length} digits). E.g., 09171234567.`
    };
  }

  // Must begin with 09 (Philippine mobile standard) or 0
  if (!normalized.startsWith('09')) {
    return {
      isValid: false,
      error: 'Phone number must start with 09 (e.g., 09171234567).'
    };
  }

  return { isValid: true, normalized };
}

/**
 * Validates delivery address fields
 */
export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export function validateAddress(address: AddressInput): {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
} {
  const errors: Record<string, string> = {};

  const street = (address.street || '').trim();
  if (!street) {
    errors.street = 'Street address is required.';
  } else if (street.length < 5) {
    errors.street = 'Street address must be at least 5 characters (include unit, building, and street).';
  }

  const city = (address.city || '').trim();
  if (!city) {
    errors.city = 'City is required (e.g. Davao City).';
  } else if (city.length < 2) {
    errors.city = 'City name must be at least 2 characters.';
  }

  const state = (address.state || '').trim();
  if (!state) {
    errors.state = 'Province / district is required (e.g. Davao del Sur).';
  }

  const postalCode = (address.postalCode || '').trim();
  const postalDigits = postalCode.replace(/\D/g, '');
  if (!postalCode) {
    errors.postalCode = 'Postal code is required (e.g. 8000 for Davao City).';
  } else if (postalDigits.length !== 4) {
    errors.postalCode = 'Postal code must be a 4-digit code (e.g. 8000 for Davao City).';
  }

  const firstError = Object.values(errors)[0];

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError
  };
}

/**
 * Validates full name
 */
export function validateFullName(name: string): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Full name must be at least 3 characters.' };
  }
  return { isValid: true, normalized: trimmed };
}

/**
 * Validates password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters in length.' };
  }
  return { isValid: true };
}
