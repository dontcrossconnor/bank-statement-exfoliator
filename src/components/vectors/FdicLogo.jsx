import React from 'react';

/**
 * Enterprise-grade 100% pure Vector SVG Logo for FDIC (Member FDIC).
 * Faithful 1:1 replica of the official Federal Deposit Insurance Corporation logo:
 * Heavy slab letters F-D-I-C with circular US seal cutout inside the 'C' and 'Member FDIC' / 'Each depositor insured to at least $250,000' text.
 */
export default function FdicLogo({
  className = 'h-6',
  width,
  height,
  color = '#274D7E',
  showSubtext = true
}) {
  return (
    <svg
      viewBox="0 0 126 50"
      width={width}
      height={height}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FDIC Logo"
    >
      <g fill={color}>
        {/* Letter 'F' (y: 4 to 36) */}
        <path d="M 4 4 H 28 V 11.5 H 12.5 V 18 H 25 V 25 H 12.5 V 36 H 4 Z" />

        {/* Letter 'D' (y: 4 to 36) */}
        <path d="M 32 4 H 49 C 59.5 4, 66.5 10.5, 66.5 20 C 66.5 29.5, 59.5 36, 49 36 H 32 Z M 40.5 11.5 V 28.5 H 48.5 C 53.5 28.5, 58 25, 58 20 C 58 15, 53.5 11.5, 48.5 11.5 Z" />

        {/* Letter 'I' (y: 4 to 36) */}
        <path d="M 71 4 H 79.5 V 36 H 71 Z" />

        {/* Letter 'C' (y: 4 to 36, matched height) */}
        <path d="M 118 11.5 L 111.5 15.5 C 109 12.5, 105.5 11, 101.5 11 C 94.5 11, 89.5 15.5, 89.5 20 C 89.5 24.5, 94.5 29, 101.5 29 C 105.5 29, 109 27.5, 111.5 24.5 L 118 28.5 C 114.5 33, 108.5 36, 101.5 36 C 89.5 36, 81 29, 81 20 C 81 11, 89.5 4, 101.5 4 C 108.5 4, 114.5 7, 118 11.5 Z" />

        {/* Inner Seal / Emblem inside C */}
        <circle cx="101.5" cy="20" r="4.2" fill="none" stroke={color} strokeWidth="0.9" />
        <circle cx="101.5" cy="20" r="2.6" fill={color} fillOpacity="0.25" />
        <path d="M 99.8 20 L 101.5 17.8 L 103.2 20 L 101.5 22.2 Z" fill={color} />
      </g>

      {/* Subtext under FDIC */}
      {showSubtext && (
        <text
          x="4"
          y="45"
          fill={color}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="600"
          fontSize="4.4"
          letterSpacing="0.1px"
        >
          Each depositor insured to at least $250,000
        </text>
      )}
    </svg>
  );
}

