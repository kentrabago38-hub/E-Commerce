import React from 'react';

// Default luxury wine image fallback (100% reliable)
export const DEFAULT_WINE_FALLBACK = '/images/category_red_wine_curated.jpg';
export const DEFAULT_CELLAR_FALLBACK = '/images/hero_wine_cellar_1791213186963.jpg';

/**
 * Normalizes image paths to ensure consistent loading across Vite dev and production/Vercel.
 * Converts legacy `/src/assets/images/` to clean `/images/`.
 */
export function getWineImageUrl(path?: string | null): string {
  if (!path) return DEFAULT_WINE_FALLBACK;

  // External URLs (Unsplash, Supabase storage, etc.)
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Convert '/src/assets/images/' to '/images/'
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/images/');
  }

  // Ensure leading slash
  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  return path;
}

// High-availability CDN wine image if local assets are unreachable
export const CDN_WINE_FALLBACK = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop';

/**
 * Robust onError event handler for all <img> tags.
 * Multi-tiered retry & fail-safe so broken image icons NEVER appear.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = DEFAULT_WINE_FALLBACK
) {
  const target = e.currentTarget;
  const attempts = Number(target.dataset.errorAttempts || '0');

  if (attempts === 0) {
    target.dataset.errorAttempts = '1';
    // If it was trying legacy /src/assets/images/, convert to /images/
    if (target.src.includes('/src/assets/images/')) {
      target.src = target.src.replace('/src/assets/images/', '/images/');
      return;
    }
    // Otherwise try primary local fallback
    target.src = fallback;
    return;
  }

  if (attempts === 1) {
    target.dataset.errorAttempts = '2';
    // If primary local fallback failed or target is still broken, try Unsplash CDN
    target.src = CDN_WINE_FALLBACK;
    return;
  }

  // Stop after attempt 2 to prevent any potential loops
}
