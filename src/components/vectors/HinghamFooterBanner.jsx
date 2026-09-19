import React from 'react';
import HinghamLogo from './HinghamLogo';
import FdicLogo from './FdicLogo';

/**
 * Authentic 1:1 Vector Footer Banner for Hingham Institution for Savings
 * Layout:
 * - Left: Hingham Institution for Savings Logo
 * - Center: "Simple Banking. Honest Value." in italic serif
 * - Right: Pure Vector FDIC seal / logo
 */
export default function HinghamFooterBanner({ className = '' }) {
  return (
    <div className={`flex justify-between items-center w-full pt-4 pb-2 border-t border-transparent select-none ${className}`}>
      {/* Left Hingham Logo */}
      <div className="flex items-center">
        <HinghamLogo className="h-10 text-black" />
      </div>

      {/* Center Tagline */}
      <div className="text-center font-serif italic text-[15px] tracking-wide text-black select-none">
        Simple Banking. Honest Value.
      </div>

      {/* Right FDIC Logo */}
      <div className="flex items-center">
        <FdicLogo className="h-7 w-auto text-black" />
      </div>
    </div>
  );
}
