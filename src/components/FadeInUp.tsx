import React, { useEffect, useRef, useState } from 'react';

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  distance?: number; // vertical translate distance in pixels, default 28px
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  className = '',
  delay = 0,
  distance = 28
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's reduced-motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const elem = domRef.current;
    if (elem) {
      observer.observe(elem);
    }

    return () => {
      if (elem) observer.unobserve(elem);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : `translateY(${distance}px)`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
