import React, { useState } from 'react';
import { HelpCircle, X, Sparkles, Sliders, Repeat, MapPin, Download, Printer, CheckCircle2 } from 'lucide-react';

export default function QuickstartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Quickstart & Usage Guide</h3>
              <p className="text-xs text-slate-400">Enterprise Local Account Statement Generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 text-xs text-slate-300">
          
          {/* Step 1 */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-xs flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Configure Start & Target Ending Balances</span>
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Under the <strong>Balance Solver & Engine</strong> tab, enter your desired <em>Start Balance</em>, <em>Target Ending Balance</em>, and choose a time range (1 to 12 months). Click <strong>Run Smart Generator</strong> to solve for mathematically exact transaction data down to the cent.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-xs flex items-center space-x-1">
                <Repeat className="w-3.5 h-3.5 text-indigo-400" />
                <span>Set Fixed Monthly Bills & Direct Deposits</span>
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Use the <strong>Fixed Recurring Bills</strong> tab to add salary direct deposits (e.g. 1st & 15th), rent/mortgage, or subscriptions. The generator auto-repeats these on their assigned day of every month across your statement range.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-xs flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Set Geographic Locales & Travel Destinations</span>
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                In the <strong>Geographic Locales</strong> tab, add your primary city and travel cities. Physical card purchases will anchor strictly to one city per day, preventing mid-day location jumps.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-xs flex items-center space-x-1">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Switch Template & Export Vector PDF</span>
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Switch institution profiles between <strong>Commercial Bank</strong>, <strong>Credit Union</strong>, or <strong>Wealth Management</strong>. Click <strong>Download Official PDF</strong> for a 100% vectorized, searchable PDF document with standard margins and Reg DD compliance boxes.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Local & Private Execution</span>
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition-all shadow"
          >
            Got It, Let's Start
          </button>
        </div>

      </div>
    </div>
  );
}
