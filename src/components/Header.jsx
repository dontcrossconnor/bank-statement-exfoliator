import React from 'react';
import { Building2, ShieldCheck, Download, Printer, RefreshCw, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ institution, onExportPdf, onPrint, onNewScenario, isReconciled, onOpenQuickstart }) {
  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: institution.accentColor || '#2563eb' }}
          >
            {institution.logoText?.[0] || 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight leading-none text-slate-100">{institution.name}</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                {institution.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{institution.charter}</span>
              <span>•</span>
              <span>Routing: <strong className="text-slate-300 font-mono">{institution.routingNumber}</strong></span>
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          <div className={`hidden md:flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${
            isReconciled 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80' 
              : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
          }`}>
            {isReconciled ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <span>{isReconciled ? 'Audit Passed: Balances Reconciled' : 'Audit Notice: Discrepancy Detected'}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local & Private Sandbox</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenQuickstart}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 px-3 py-2 rounded-lg border border-indigo-800 transition-colors shadow-sm"
            title="Open Quickstart Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quickstart</span>
          </button>

          <button
            onClick={onNewScenario}
            className="flex items-center space-x-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors shadow-sm"
            title="Load Presets or Regenerate Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Presets</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center space-x-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print View</span>
          </button>

          <button
            onClick={onExportPdf}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg shadow-md transition-all hover:shadow-blue-500/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
}
