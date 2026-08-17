import React from 'react';

/**
 * Enterprise-grade 100% pure Vector SVG Logo for Equal Housing Lender (EHL).
 * Faithful replica of official EHL emblem: House outline with chimney, equal sign bar, and stacked EQUAL / HOUSING / LENDER.
 */
export default function EqualHousingLenderLogo({
  className = 'h-8',
  width,
  height,
  color = '#274D7E'
}) {
  return (
    <svg
      viewBox="0 0 54 64"
      width={width}
      height={height}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Equal Housing Lender Logo"
    >
      {/* Thick Roof & House Silhouette */}
      <path
        d="M 27 2 L 4 20 L 7.5 23.5 L 11 20.5 V 36 H 43 V 20.5 L 46.5 23.5 L 50 20 L 27 2 Z M 37 6.5 H 41.5 V 14.5 L 37 10.5 V 6.5 Z"
        fill={color}
      />

      {/* Internal Equal Sign Bars */}
      <rect x="17" y="23" width="20" height="3.5" rx="0.5" fill={color} />
      <rect x="17" y="29.5" width="20" height="3.5" rx="0.5" fill={color} />

      {/* 3 Lines of Text: EQUAL / HOUSING / LENDER */}
      <text x="27" y="44" fill={color} fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontWeight="800" fontSize="7" textAnchor="middle" letterSpacing="0.4px">EQUAL</text>
      <text x="27" y="52" fill={color} fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontWeight="800" fontSize="7" textAnchor="middle" letterSpacing="0.4px">HOUSING</text>
      <text x="27" y="60" fill={color} fontFamily="-apple-system, BlinkMacSystemFont, Arial, sans-serif" fontWeight="800" fontSize="7" textAnchor="middle" letterSpacing="0.4px">LENDER</text>
    </svg>
  );
}


