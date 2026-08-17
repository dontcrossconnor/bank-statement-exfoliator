import React from 'react';

/**
 * Enterprise 100% pure Vector SVG Badges for the "Managing Your Accounts" section.
 * Authentic 1:1 match with physical source scan:
 * 1. Branch: Direct Bank building with pediment and 4 pillars (no round frame)
 * 2. Phone: Circular button with metallic gradient rim, dark center, and mobile phone with signal waves
 * 3. Mailbox: Circular button with metallic gradient rim, dark center, and roadside curbside mailbox
 * 4. Laptop: Circular button with metallic gradient rim, dark center, and laptop computer display
 */

export function BranchVectorIcon({ className = 'w-5 h-5 text-[#1e3a68]' }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pediment Roof */}
      <polygon points="12,3 2,8 22,8" fill="#1e3a68" />
      <rect x="3" y="9" width="18" height="1.5" fill="#1e3a68" />
      {/* 4 Pillars */}
      <rect x="4" y="11.5" width="2.2" height="7.5" rx="0.3" fill="#1e3a68" />
      <rect x="8.6" y="11.5" width="2.2" height="7.5" rx="0.3" fill="#1e3a68" />
      <rect x="13.2" y="11.5" width="2.2" height="7.5" rx="0.3" fill="#1e3a68" />
      <rect x="17.8" y="11.5" width="2.2" height="7.5" rx="0.3" fill="#1e3a68" />
      {/* Base */}
      <rect x="2" y="20" width="20" height="2" rx="0.3" fill="#1e3a68" />
    </svg>
  );
}

export function PhoneVectorIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="metallicRimPhone" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
        <radialGradient id="innerDarkPhone" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>
      {/* Metallic Outer Ring */}
      <circle cx="12" cy="12" r="11" fill="url(#metallicRimPhone)" stroke="#334155" strokeWidth="0.8" />
      {/* Dark Inner Well */}
      <circle cx="12" cy="12" r="8.5" fill="url(#innerDarkPhone)" />
      {/* White Phone & Signal Waves */}
      <rect x="8.5" y="8" width="5.5" height="9.5" rx="1.2" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
      <rect x="9.5" y="9.5" width="3.5" height="5.5" fill="#FFFFFF" />
      <circle cx="11.25" cy="16.2" r="0.4" fill="#FFFFFF" />
      {/* Radio signal waves */}
      <path d="M 15 8 C 16.5 9.5, 16.5 11.5, 15 13" stroke="#FFFFFF" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 16.8 6.5 C 19 9, 19 12.5, 16.8 15" stroke="#FFFFFF" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

export function MailboxVectorIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="metallicRimMail" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
        <radialGradient id="innerDarkMail" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>
      {/* Metallic Outer Ring */}
      <circle cx="12" cy="12" r="11" fill="url(#metallicRimMail)" stroke="#334155" strokeWidth="0.8" />
      {/* Dark Inner Well */}
      <circle cx="12" cy="12" r="8.5" fill="url(#innerDarkMail)" />
      {/* White Curbside Mailbox */}
      <path d="M 8.5 10 C 8.5 7.5, 14.5 7.5, 14.5 10 L 14.5 14 L 8.5 14 Z" fill="#FFFFFF" />
      <rect x="10" y="9.5" width="4.5" height="1.2" rx="0.3" fill="#0f172a" />
      {/* Post */}
      <rect x="11" y="14" width="1.6" height="4.5" fill="#FFFFFF" />
      {/* Flag */}
      <path d="M 14.5 9.5 L 16.5 9.5 L 16.5 12" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />
    </svg>
  );
}

export function LaptopVectorIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="metallicRimLap" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
        <radialGradient id="innerDarkLap" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>
      {/* Metallic Outer Ring */}
      <circle cx="12" cy="12" r="11" fill="url(#metallicRimLap)" stroke="#334155" strokeWidth="0.8" />
      {/* Dark Inner Well */}
      <circle cx="12" cy="12" r="8.5" fill="url(#innerDarkLap)" />
      {/* White Laptop */}
      <rect x="7.5" y="7.5" width="9" height="6" rx="0.8" stroke="#FFFFFF" strokeWidth="0.9" fill="#FFFFFF" fillOpacity="0.2" />
      <rect x="8.5" y="8.5" width="7" height="4.2" fill="#FFFFFF" />
      <path d="M 6 14.5 L 18 14.5 L 17 16 L 7 16 Z" fill="#FFFFFF" />
    </svg>
  );
}


