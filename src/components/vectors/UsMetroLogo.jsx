import React from 'react';

/**
 * Enterprise-grade 100% pure Vector SVG Logo for US Metro Bank.
 * Faithful 1:1 replica of the official US Metro Bank logo:
 * - Two dynamic interlocking crescent blades (crimson red bottom-left to top-center, deep navy top-right to bottom-center)
 * - Interlocking tips swirling into an inner circular eye
 * - Heavy bold sans-serif text "US METRO BANK"
 */
export default function UsMetroLogo({
  className = 'h-10',
  width,
  height,
  showText = true,
  variant = 'full'
}) {
  const redColor = variant === 'monochrome' ? 'currentColor' : '#9E2A2B';
  const navyColor = variant === 'monochrome' ? 'currentColor' : '#224673';

  return (
    <svg
      viewBox={showText ? "0 0 1350 200" : "0 0 200 200"}
      width={width}
      height={height}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="US Metro Bank Logo"
    >
      {/* Dynamic Crescent Swirl Emblem */}
      <g transform="translate(-10, -15)">
        {/* Left Crimson Red Blade */}
        <path
          d="M 88 29 L 72 33 L 59 39 L 55 43 L 53 43 L 44 49 L 28 67 L 25 74 L 21 79 L 20 85 L 15 96 L 13 108 L 13 130 L 15 144 L 18 147 L 18 151 L 26 167 L 34 178 L 53 194 L 59 196 L 68 202 L 75 203 L 79 206 L 86 206 L 89 208 L 115 208 L 118 206 L 130 204 L 138 198 L 150 196 L 156 189 L 160 188 L 169 180 L 170 177 L 177 170 L 186 153 L 185 151 L 188 147 L 188 141 L 190 137 L 190 129 L 192 126 L 193 115 L 191 111 L 187 128 L 178 145 L 174 148 L 171 153 L 161 162 L 141 171 L 130 173 L 105 172 L 85 164 L 74 156 L 59 138 L 52 120 L 51 93 L 56 76 L 60 68 L 67 59 L 81 46 L 97 38 L 102 38 L 105 35 L 107 36 L 113 33 L 121 32 L 121 30 L 116 29 L 109 30 Z"
          fill={redColor}
        />

        {/* Right Deep Navy Blue Blade */}
        <path
          d="M 147 24 L 142 27 L 137 27 L 132 30 L 129 30 L 124 34 L 120 34 L 116 36 L 101 48 L 96 54 L 93 55 L 90 62 L 86 64 L 86 67 L 79 79 L 76 94 L 74 97 L 73 112 L 74 116 L 76 115 L 78 104 L 84 93 L 89 88 L 92 82 L 96 78 L 96 76 L 102 70 L 104 71 L 107 68 L 110 68 L 114 64 L 116 65 L 126 60 L 129 60 L 130 57 L 150 59 L 158 58 L 161 61 L 165 59 L 168 60 L 169 63 L 174 62 L 180 68 L 193 76 L 197 80 L 197 83 L 201 85 L 202 89 L 206 91 L 206 96 L 209 97 L 210 103 L 213 107 L 216 127 L 213 150 L 211 152 L 209 159 L 198 174 L 174 194 L 172 192 L 162 197 L 146 198 L 144 200 L 156 203 L 181 202 L 189 200 L 191 198 L 197 198 L 202 194 L 205 194 L 203 192 L 205 190 L 211 191 L 231 174 L 232 171 L 242 159 L 245 153 L 243 151 L 246 150 L 248 146 L 253 126 L 253 118 L 251 116 L 253 114 L 253 100 L 250 92 L 251 88 L 247 82 L 247 76 L 245 74 L 245 71 L 242 69 L 238 62 L 234 60 L 234 56 L 232 56 L 227 49 L 220 43 L 217 43 L 213 36 L 210 36 L 206 33 L 199 31 L 197 29 L 191 28 L 189 26 L 183 26 L 180 24 L 167 23 Z"
          fill={navyColor}
        />
      </g>

      {/* Brand Typography: US METRO BANK */}
      {showText && (
        <g fill={navyColor}>
          <text
            x="270"
            y="138"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="115"
            letterSpacing="0px"
          >
            US METRO BANK
          </text>
        </g>
      )}
    </svg>
  );
}


