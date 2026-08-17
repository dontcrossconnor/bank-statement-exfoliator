import React from 'react';
import UsMetroLogo from './UsMetroLogo';
import { DataMatrix2DBarcode } from './Barcodes';

/**
 * Enterprise 100% Pure Vector Promotional Banner.
 * Replaces the 457KB raster screenshot with a pixel-perfect,
 * print-ready vector layout with SVG vector illustration and crisp typography.
 */
export default function UsMetroPromoBanner({
  phone = '714-620-8888',
  website = 'www.usmetrobank.com'
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded border border-slate-200 select-none">
      {/* 2D Barcode on the far left */}
      <div className="flex-shrink-0">
        <DataMatrix2DBarcode size={26} color="#222222" />
      </div>

      {/* Vector Illustration Card (Replacing the raster photo) */}
      <div className="relative w-36 h-28 bg-[#f5dfd6] rounded overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-[#e8cbbe]">
        {/* Abstract vector backdrop */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ebcfc2] rounded-full transform translate-x-6 -translate-y-6 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#fdeee7] rounded-full transform -translate-x-4 translate-y-4 opacity-70"></div>

        {/* Vector SVG Tablet & Online Banking Interface Graphic */}
        <svg viewBox="0 0 100 80" className="w-full h-full relative z-10" fill="none">
          {/* Tablet Frame */}
          <rect x="15" y="6" width="70" height="54" rx="4" fill="#2d3748" stroke="#1a202c" strokeWidth="1.5" />
          {/* Screen Glass */}
          <rect x="18" y="9" width="64" height="48" rx="2" fill="#ffffff" />
          
          {/* Screen Content - Statement Summary Card */}
          <rect x="22" y="13" width="56" height="8" rx="1.5" fill="#1e3a68" />
          <rect x="25" y="16" width="20" height="2" rx="0.5" fill="#ffffff" />
          <rect x="62" y="16" width="12" height="2" rx="0.5" fill="#93c5fd" />

          {/* Bar Chart / Analytics Graph */}
          <rect x="24" y="25" width="4" height="14" rx="1" fill="#3b82f6" />
          <rect x="31" y="29" width="4" height="10" rx="1" fill="#60a5fa" />
          <rect x="38" y="23" width="4" height="16" rx="1" fill="#2563eb" />
          <rect x="45" y="27" width="4" height="12" rx="1" fill="#93c5fd" />

          {/* Statement Lines */}
          <rect x="53" y="26" width="23" height="2.5" rx="0.5" fill="#cbd5e1" />
          <rect x="53" y="31" width="18" height="2.5" rx="0.5" fill="#e2e8f0" />
          <rect x="53" y="36" width="21" height="2.5" rx="0.5" fill="#e2e8f0" />

          {/* Coffee Mug & Stylized Desk Accessories */}
          <circle cx="20" cy="67" r="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="20" cy="67" r="4" fill="#b45309" />
          <rect x="30" y="66" width="55" height="3" rx="1" fill="#e2e8f0" />
        </svg>
      </div>

      {/* Copywriting & Contact Details */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="font-serif text-lg font-normal text-[#111111] leading-tight tracking-tight mb-1.5">
          Introducing your <span className="font-bold">NEW</span> monthly statement
        </h3>

        <p className="text-[10px] leading-relaxed text-[#333333] mb-2 font-sans">
          We are pleased to introduce a new look to your monthly statement from US Metro Bank. The new statement is designed to make it easier for you to review your accounts, whether you receive it by mail or via eStatement. Please visit our website to learn more about our online and mobile banking solutions.
        </p>

        <div className="flex items-center justify-between text-[10px] text-[#111111]">
          <div>
            Visit us online at{' '}
            <a href={`https://${website}`} className="font-bold text-[#b83232] hover:underline">
              {website}
            </a>
            {' '}or call{' '}
            <strong className="text-[#b83232] font-bold">{phone}</strong> to learn more.
          </div>

          {/* Mini Vector US Metro Bank Logo */}
          <div className="flex-shrink-0 pl-2">
            <UsMetroLogo className="h-4" showText={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
