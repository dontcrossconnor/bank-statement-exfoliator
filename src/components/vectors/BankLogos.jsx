import React from 'react';

/**
 * Enterprise 100% Vector SVG Logos for Major Financial Institutions.
 */

// Chase Logo (Authentic Octagon Symbol + Wordmark)
export function ChaseLogo({ className = 'h-7', showText = true }) {
  return (
    <svg viewBox={showText ? "0 0 200 48" : "0 0 48 48"} className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Octagon Emblem */}
      <g transform="translate(4, 4)">
        <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" fill="#114b78" />
        <polygon points="14,14 26,14 26,26 14,26" fill="#ffffff" />
        <polygon points="12,4 20,4 20,12 12,12" fill="#ffffff" />
        <polygon points="28,4 36,12 30,18 22,12" fill="#114b78" opacity="0.9" />
      </g>
      {showText && (
        <text x="56" y="32" fill="#114b78" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1px">
          CHASE
        </text>
      )}
    </svg>
  );
}

// Bank of America Logo (Authentic 6-Stripe Flag + Wordmark)
export function BofaLogo({ className = 'h-7', showText = true }) {
  return (
    <svg viewBox={showText ? "0 0 260 48" : "0 0 48 48"} className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 6-Stripe Flag Emblem */}
      <g transform="translate(2, 6)">
        {/* Red Stripes */}
        <path d="M 4 4 L 14 4 L 10 32 L 0 32 Z" fill="#dc2626" />
        <path d="M 17 4 L 27 4 L 23 32 L 13 32 Z" fill="#dc2626" />
        {/* Blue Stripes */}
        <path d="M 27 4 L 37 4 L 33 32 L 23 32 Z" fill="#1e40af" />
        <path d="M 40 4 L 50 4 L 46 32 L 36 32 Z" fill="#1e40af" />
      </g>
      {showText && (
        <text x="58" y="31" fill="#dc2626" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.3px">
          BANK OF AMERICA
        </text>
      )}
    </svg>
  );
}

// Wells Fargo Logo (Authentic Red Box + Golden Typography)
export function WellsFargoLogo({ className = 'h-7', showText = true }) {
  return (
    <svg viewBox={showText ? "0 0 240 48" : "0 0 48 48"} className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width={showText ? "236" : "44"} height="40" rx="4" fill="#b91c1c" />
      <rect x="4" y="6" width={showText ? "232" : "40"} height="36" rx="3" stroke="#f59e0b" strokeWidth="1" />
      {showText ? (
        <text x="120" y="30" fill="#ffffff" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="17" letterSpacing="2px">
          WELLS FARGO
        </text>
      ) : (
        <text x="24" y="30" fill="#ffffff" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="18">
          WF
        </text>
      )}
    </svg>
  );
}

// Apex National Bank Logo (Geometric Apex Pyramid + Typography)
export function ApexLogo({ className = 'h-7', showText = true }) {
  return (
    <svg viewBox={showText ? "0 0 220 48" : "0 0 48 48"} className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Apex Geometric Pyramid */}
      <g transform="translate(4, 4)">
        <polygon points="20,2 38,36 24,36" fill="#2563eb" />
        <polygon points="20,2 2,36 16,36" fill="#0f172a" />
        <polygon points="20,10 28,26 12,26" fill="#38bdf8" />
      </g>
      {showText && (
        <g fill="#0f172a">
          <text x="48" y="27" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="18" letterSpacing="1px">
            APEX
          </text>
          <text x="48" y="38" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2.5px" fill="#2563eb">
            NATIONAL BANK
          </text>
        </g>
      )}
    </svg>
  );
}

// Navy Federal Credit Union Logo
export function NavyFedLogo({ className = 'h-7', showText = true }) {
  return (
    <svg viewBox={showText ? "0 0 240 48" : "0 0 48 48"} className={`inline-block select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield Emblem */}
      <g transform="translate(4, 4)">
        <path d="M 20 2 L 36 8 V 22 C 36 32, 20 38, 20 38 C 20 38, 4 32, 4 22 V 8 Z" fill="#0f2942" />
        <path d="M 20 6 L 32 11 V 21 C 32 28, 20 33, 20 33 C 20 33, 8 28, 8 21 V 11 Z" fill="#006699" />
        <path d="M 20 10 L 26 24 H 14 Z" fill="#ffffff" />
      </g>
      {showText && (
        <g fill="#0f2942">
          <text x="48" y="26" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.5px">
            NAVY FEDERAL
          </text>
          <text x="48" y="37" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="2px" fill="#006699">
            CREDIT UNION
          </text>
        </g>
      )}
    </svg>
  );
}
