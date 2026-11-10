import React, { useEffect, useRef, useState } from 'react';

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  distance?: number; // vertical translate distance in pixels, default 24px
  duration?: number; // in milliseconds, default 900ms
  threshold?: number; // intersection observer threshold, default 0.08
  direction?: 'up' | 'none';
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  className = '',
  delay = 0,
  distance = 24,
  duration = 900,
  threshold = 0.08,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If running in environment without window or IntersectionObserver, reveal immediately
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const elem = domRef.current;
    if (!elem) return;

    // Check if element is already within the viewport on mount
    const rect = elem.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.92) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
    };
  }, [threshold]);

  const [hasFinishedTransition, setHasFinishedTransition] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setHasFinishedTransition(true);
      }, duration + delay + 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, delay]);

  const translateY = direction === 'up' ? (isVisible ? 0 : distance) : 0;

  return (
    <div
      ref={domRef}
      className={`${hasFinishedTransition ? '' : 'will-change-transform'} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translate3d(0, ${translateY}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
