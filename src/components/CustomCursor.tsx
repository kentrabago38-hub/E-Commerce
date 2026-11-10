import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device is touch-based or has reduced motion
    const touchCheck =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (touchCheck) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Inspect hovered target for contextual data-cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorElement = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorElement) {
        const type = cursorElement.getAttribute('data-cursor');
        if (type === 'view') {
          setCursorText('VIEW');
          setIsHovered(true);
        } else if (type === 'add') {
          setCursorText('ADD');
          setIsHovered(true);
        } else if (type === 'explore') {
          setCursorText('EXPLORE');
          setIsHovered(true);
        } else if (type === 'discover') {
          setCursorText('DISCOVER');
          setIsHovered(true);
        } else if (type === 'inspect') {
          setCursorText('INSPECT');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(true);
        }
      } else {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
        if (interactive) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth fluid physics animation loop for outer ring
    const render = () => {
      // Linear interpolation (lerp) for luxury mechanical glide
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const hasText = Boolean(cursorText);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Precision center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#C6A15B] transition-opacity duration-150 will-change-transform"
        style={{ opacity: hasText ? 0 : 0.9 }}
      />

      {/* Fluid outer ring with contextual micro-labels */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out will-change-transform ${
          hasText
            ? '-ml-7 -mt-7 w-14 h-14 bg-[#210D12]/85 border border-[#C6A15B] backdrop-blur-sm shadow-[0_0_20px_rgba(198,161,91,0.35)]'
            : isHovered
            ? '-ml-5 -mt-5 w-10 h-10 bg-[#C6A15B]/10 border border-[#C6A15B]/80'
            : '-ml-4 -mt-4 w-8 h-8 bg-transparent border border-[#C6A15B]/40'
        }`}
      >
        {hasText && (
          <span className="text-[9px] font-sans font-semibold tracking-wider text-[#C6A15B] uppercase animate-fade-in">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
