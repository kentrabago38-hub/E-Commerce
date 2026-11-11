import React, { useState, useEffect, useRef } from 'react';
import { getWineImageUrl, handleImageError } from '../utils/imageUtils';

export interface LazyWineImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  onErrorFallback?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * High-performance wine bottle image component featuring:
 * 1. Intersection-Observer based viewport detection (with rootMargin preloading)
 * 2. Native loading="lazy" attribute
 * 3. Blur-up placeholder effect with smooth opacity transition
 * 4. Memory optimization for mobile and low-power devices
 */
export const LazyWineImage: React.FC<LazyWineImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  onError,
  onErrorFallback,
  style,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If SSR or IntersectionObserver is unsupported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '180px 0px', // preload slightly before scrolling into viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const resolvedUrl = getWineImageUrl(src);

  const handleImgLoad = () => {
    setIsLoaded(true);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onErrorFallback) {
      onErrorFallback(e);
    } else if (onError) {
      onError(e);
    } else {
      handleImageError(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio, ...style } : style}
    >
      {/* Cellar warmth blur-up placeholder */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#160B0E] transition-opacity duration-700 pointer-events-none z-0"
        >
          <div className="w-full h-full bg-radial from-[#38141C]/50 via-[#180B0D] to-[#12070A] animate-pulse" />
        </div>
      )}

      {isInView ? (
        <img
          src={resolvedUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleImgLoad}
          onError={handleImgError}
          className={`relative z-1 transition-all duration-600 ease-out ${
            isLoaded
              ? 'blur-0 opacity-100 scale-100'
              : 'blur-sm opacity-30 scale-105'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      ) : null}
    </div>
  );
};
