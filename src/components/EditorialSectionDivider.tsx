import React from 'react';

/**
 * Subtle, thin editorial horizontal divider designed for VÍNEA
 * using the signature #48151F merlot tone to create rhythmic section separation.
 */
export const EditorialSectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 pointer-events-none select-none ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Thin editorial divider using #48151F with soft edge taper */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#48151F] to-transparent opacity-90" />
        {/* Centered micro-accent diamond */}
        <div className="absolute w-1.5 h-1.5 rotate-45 bg-[#D5B15C]/35 border border-[#D5B15C]/50 shadow-[0_0_6px_rgba(213,177,92,0.25)]" />
      </div>
    </div>
  );
};
