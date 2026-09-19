import React from 'react';

/**
 * Authentic 1:1 Vector SVG icons for Hingham Institution for Savings "Managing Your Accounts" section.
 * Recreated with resolution-independent pure vector curves.
 */

export function HinghamPhoneIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 40 40" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle Ring */}
      <circle cx="20" cy="20" r="18" stroke="#000000" strokeWidth="2" fill="#FFFFFF" />
      {/* Bottom Shadow Hemisphere Crescent */}
      <path d="M 2 20 A 18 18 0 0 0 38 20 A 15 15 0 0 1 2 20 Z" fill="#000000" />
      {/* Inner Circle Border */}
      <circle cx="20" cy="20" r="15" stroke="#000000" strokeWidth="1.2" fill="none" />
      
      {/* Mobile Phone Device Body */}
      <rect x="14" y="14" width="9" height="15" rx="1.5" stroke="#000000" strokeWidth="1.6" fill="#FFFFFF" />
      {/* Screen */}
      <rect x="15.5" y="16" width="6" height="8" rx="0.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8" />
      {/* Bottom Button */}
      <circle cx="18.5" cy="26" r="0.8" fill="#000000" />
      {/* Antenna */}
      <rect x="21" y="12" width="1.2" height="2.5" fill="#000000" />
      {/* Radio Wave Arcs */}
      <path d="M 23 15 C 25 13.5, 26.5 13.5, 27.5 15" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 24.5 12 C 27 10, 29.5 10.5, 30.5 13" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function HinghamMailboxIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 40 40" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle Ring */}
      <circle cx="20" cy="20" r="18" stroke="#000000" strokeWidth="2" fill="#FFFFFF" />
      {/* Bottom Shadow Hemisphere Crescent */}
      <path d="M 2 20 A 18 18 0 0 0 38 20 A 15 15 0 0 1 2 20 Z" fill="#000000" />
      {/* Inner Circle Border */}
      <circle cx="20" cy="20" r="15" stroke="#000000" strokeWidth="1.2" fill="none" />
      
      {/* Mailbox Dome & Body */}
      <path d="M 14 17 C 14 13.5, 26 13.5, 26 17 L 26 25 L 14 25 Z" fill="#000000" />
      {/* Mail Slot / Opening */}
      <rect x="16" y="16.5" width="4.5" height="1.8" rx="0.4" fill="#FFFFFF" />
      {/* Mailbox Stand / Legs */}
      <rect x="15.5" y="25" width="1.8" height="4" fill="#000000" />
      <rect x="22.7" y="25" width="1.8" height="4" fill="#000000" />
    </svg>
  );
}

export function HinghamLaptopIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 40 40" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle Ring */}
      <circle cx="20" cy="20" r="18" stroke="#000000" strokeWidth="2" fill="#FFFFFF" />
      {/* Bottom Shadow Hemisphere Crescent */}
      <path d="M 2 20 A 18 18 0 0 0 38 20 A 15 15 0 0 1 2 20 Z" fill="#000000" />
      {/* Inner Circle Border */}
      <circle cx="20" cy="20" r="15" stroke="#000000" strokeWidth="1.2" fill="none" />
      
      {/* Laptop Screen Bezel */}
      <rect x="12" y="14" width="16" height="11" rx="0.8" stroke="#000000" strokeWidth="1.4" fill="#000000" />
      {/* Screen Display */}
      <rect x="13.5" y="15.5" width="13" height="8" rx="0.4" fill="#000000" />
      {/* Laptop Base / Keyboard Deck */}
      <path d="M 10 25.5 L 30 25.5 L 29 27.5 L 11 27.5 Z" fill="#000000" />
      {/* Trackpad notch */}
      <rect x="18.5" y="25.8" width="3" height="0.8" rx="0.2" fill="#FFFFFF" />
    </svg>
  );
}
