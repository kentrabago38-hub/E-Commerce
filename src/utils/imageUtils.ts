import React from 'react';

// Default luxury wine image fallback (100% reliable local bottle asset)
export const DEFAULT_WINE_FALLBACK = '/images/product_chateau_lumiere_cabernet.jpg';
export const DEFAULT_CELLAR_FALLBACK = '/images/hero_wine_cellar_1791213186963.jpg';

// Pure inline SVG vector fallback that never requires network or disk access
export const SVG_WINE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%"><defs><radialGradient id="amb" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="%234A121F"/><stop offset="60%" stop-color="%23210D12"/><stop offset="100%" stop-color="%230D0407"/></radialGradient></defs><rect width="800" height="600" fill="url(%23amb)"/><circle cx="400" cy="270" r="140" fill="%23C6A15B" opacity="0.12"/><path d="M380 160 L420 160 L416 320 Q416 390 400 405 Q384 390 384 320 Z" fill="%23861F32" stroke="%23C6A15B" stroke-width="3"/><line x1="400" y1="405" x2="400" y2="465" stroke="%23C6A15B" stroke-width="5"/><ellipse cx="400" cy="470" rx="36" ry="8" fill="%23C6A15B"/><text x="400" y="530" font-family="serif" font-size="22" fill="%23C6A15B" letter-spacing="4" text-anchor="middle">VÍNEA HAUTE SOMMELERIE</text></svg>';

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
    // If current src is already the local fallback, advance straight to SVG
    if (target.src.endsWith(fallback.replace(/^\//, ''))) {
      target.src = SVG_WINE_FALLBACK;
      return;
    }
    target.src = fallback;
    return;
  }

  if (attempts === 1) {
    target.dataset.errorAttempts = '2';
    // Try embedded SVG vector fallback that requires zero network requests
    target.src = SVG_WINE_FALLBACK;
    return;
  }

  // Final fail-safe: hide broken image completely so no broken icons or alt text bleed through
  target.style.opacity = '0';
  target.style.display = 'none';
}
