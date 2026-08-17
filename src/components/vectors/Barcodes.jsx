import React from 'react';

/**
 * Pure Vector SVG Barcodes for Enterprise Bank Statements.
 * Crisp at all print and vector zoom scales.
 */

// USPS Intelligent Mail Barcode (IMb) - 65 bars with 4 states:
// F: Full height (y: 0 to 14)
// T: Tracker (y: 4 to 10)
// A: Ascender (y: 0 to 10)
// D: Descender (y: 4 to 14)
const DEFAULT_IMB_PATTERN = 'FDAATDFTATDAFFDADTTFAAAFTDFTATDATFTFDFDFTTFADTTFFAATDATDFTATDFTTFA';

export function UspsIntelligentMailBarcode({
  pattern = DEFAULT_IMB_PATTERN,
  className = 'h-3.5',
  color = '#111111'
}) {
  const bars = pattern.split('').slice(0, 65);
  
  return (
    <svg
      viewBox="0 0 200 14"
      className={`inline-block select-none ${className}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="USPS Intelligent Mail Barcode"
    >
      {bars.map((char, idx) => {
        const x = idx * 3.05 + 1;
        const w = 1.3;
        let y = 4;
        let h = 6; // tracker height

        if (char === 'F') {
          y = 0;
          h = 14;
        } else if (char === 'A') {
          y = 0;
          h = 10;
        } else if (char === 'D') {
          y = 4;
          h = 10;
        } // T is default y=4, h=6

        return <rect key={idx} x={x} y={y} width={w} height={h} rx="0.1" />;
      })}
    </svg>
  );
}

// 2D DataMatrix Tracking Barcode Grid (14x14 matrix)
export function DataMatrix2DBarcode({
  size = 28,
  className = '',
  color = '#111111'
}) {
  // Deterministic 14x14 binary grid with L-finder pattern
  const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,1,1,0,1,0,0,1,0,1,0],
    [1,1,0,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [1,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,0,1,0,1,0],
    [1,1,0,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [1,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,0,1,0,1,0],
    [1,1,0,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,1,0,1,0,1,0],
    [1,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0]
  ];

  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="2D DataMatrix Tracking Barcode"
    >
      {matrix.map((row, r) =>
        row.map((val, c) =>
          val ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" /> : null
        )
      )}
    </svg>
  );
}

// 1D Code 128 / Code 39 Document Barcode
export function Code128Barcode({
  documentId = 'DOC-8501-2026',
  className = 'h-6',
  color = '#111111',
  showText = true
}) {
  const widths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 2, 1, 3, 1];
  let currentX = 2;

  return (
    <div className="flex flex-col items-start space-y-0.5 select-none">
      <svg
        viewBox="0 0 160 22"
        className={className}
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        {widths.map((w, idx) => {
          const x = currentX;
          currentX += w + 2;
          return <rect key={idx} x={x} y="0" width={w} height="22" rx="0.2" />;
        })}
      </svg>
      {showText && (
        <div className="text-[7.5px] font-mono text-slate-500 tracking-widest uppercase">
          *{documentId}*
        </div>
      )}
    </div>
  );
}
