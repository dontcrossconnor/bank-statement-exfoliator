import React from 'react';

/**
 * Enterprise 100% pure Vector SVG of the Hingham Institution for Savings Logo.
 * Features:
 * - Authentic classical Greek Revival pediment / temple roof with double cornice lines
 * - Circular apex medallion
 * - Deep black architrave beam
 * - Bold serif "HINGHAM"
 * - Double horizontal rules enclosing "INSTITUTION FOR"
 * - Bold serif "SAVINGS"
 * - Double ground base rules
 */
export default function HinghamLogo({ className = 'h-12', style = {} }) {
  return (
    <svg
      viewBox="0 0 160 156"
      className={`inline-block select-none ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      {/* Top Pediment / Roof Triangle */}
      {/* Outer Triangle Outline */}
      <polygon points="80,6 6,50 154,50" fill="#000000" />
      {/* Inner White Tympanum cutout */}
      <polygon points="80,16 19,46 141,46" fill="#FFFFFF" />
      
      {/* Inner Pediment Moldings & Apex Medallion */}
      <polygon points="80,24 28,44 132,44" fill="#000000" />
      <polygon points="80,28 34,43 126,43" fill="#FFFFFF" />
      
      {/* Central Circular Medallion */}
      <circle cx="80" cy="34" r="6" fill="#000000" />

      {/* Cornice / Architrave Beams */}
      <rect x="6" y="52" width="148" height="6.5" fill="#000000" />

      {/* Primary Brand Typography */}
      {/* HINGHAM */}
      <text
        x="80"
        y="83"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, 'Playfair Display', Georgia, serif"
        fontWeight="bold"
        fontSize="25.5"
        letterSpacing="0.04em"
        fill="#000000"
      >
        HINGHAM
      </text>

      {/* Top Bar for Middle Line */}
      <rect x="6" y="90.5" width="148" height="2" fill="#000000" />

      {/* INSTITUTION FOR */}
      <text
        x="80"
        y="102.5"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, Georgia, serif"
        fontWeight="bold"
        fontSize="10.8"
        letterSpacing="0.06em"
        fill="#000000"
      >
        INSTITUTION FOR
      </text>

      {/* Bottom Bar for Middle Line */}
      <rect x="6" y="106" width="148" height="2" fill="#000000" />

      {/* SAVINGS */}
      <text
        x="80"
        y="134"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, 'Playfair Display', Georgia, serif"
        fontWeight="bold"
        fontSize="28"
        letterSpacing="0.05em"
        fill="#000000"
      >
        SAVINGS
      </text>

      {/* Bottom Double Base Lines */}
      <rect x="6" y="141" width="148" height="2" fill="#000000" />
      <rect x="4" y="146" width="152" height="5" fill="#000000" />
    </svg>
  );
}
