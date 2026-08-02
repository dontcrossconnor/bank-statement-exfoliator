import React from 'react';

export default function DocumentBarcode({ documentId = 'DOC-908421-2026' }) {
  return (
    <div className="flex flex-col items-start space-y-1 my-2">
      {/* Simulated 1D Barcode Lines using CSS flex */}
      <div className="flex items-center space-x-0.5 h-6 bg-white px-1 py-0.5 border border-slate-300 rounded-sm">
        {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2].map((width, idx) => (
          <div
            key={idx}
            className="bg-slate-900 h-full"
            style={{ width: `${width}px` }}
          />
        ))}
      </div>
      <div className="text-[8px] font-mono text-slate-500 tracking-widest uppercase">
        *{documentId}*
      </div>
    </div>
  );
}
