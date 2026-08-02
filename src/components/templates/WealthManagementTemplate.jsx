import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import RegulatoryDisclosures from './RegulatoryDisclosures';

export default function WealthManagementTemplate({
  institution,
  customerInfo,
  statementMeta,
  account,
  totals,
  transactions
}) {
  return (
    <div 
      className="bg-slate-900 text-slate-100 p-8 max-w-[210mm] mx-auto shadow-2xl rounded-sm print:bg-white print:text-slate-900 print:shadow-none print:max-w-none print:p-0"
      style={{ fontFamily: institution.fontFamily || 'Cinzel, Georgia, serif' }}
    >
      
      {/* 1. LUXURY WEALTH HEADER */}
      <div className="flex justify-between items-start border-b border-indigo-500/30 pb-6 print:border-slate-800">
        
        {/* Left Branding */}
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white text-base shadow-lg">
              {institution.logoText[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest text-indigo-300 print:text-slate-900 uppercase">{institution.name}</h1>
              <p className="text-[10px] tracking-widest text-slate-400 print:text-slate-600 uppercase font-semibold">{institution.tagline}</p>
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="text-right text-xs text-slate-400 print:text-slate-600">
          <div className="font-semibold text-slate-200 print:text-slate-800">Private Banking Portfolio Statement</div>
          <div>Statement Period: <strong className="text-indigo-300 print:text-slate-900 font-mono">{formatDate(statementMeta.startDate)} - {formatDate(statementMeta.endDate)}</strong></div>
          <div className="text-[10px] font-mono">Routing: {institution.routingNumber}</div>
        </div>

      </div>

      {/* 2. PORTFOLIO SUMMARY CARDS */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        
        <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-500 font-bold">Client Account</div>
          <div className="text-sm font-bold text-white print:text-slate-900 mt-0.5">{customerInfo.name}</div>
          <div className="text-xs text-slate-400 print:text-slate-600 font-mono mt-1">{account.fullAccountNumber}</div>
          <div className="text-xs text-indigo-400 print:text-indigo-700 font-medium">{account.type}</div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-500 font-bold">Portfolio Net Asset Value</div>
          <div className="text-lg font-mono font-bold text-sky-400 print:text-blue-900 mt-0.5">{formatCurrency(totals.endingBalance)}</div>
          <div className="text-xs text-emerald-400 print:text-emerald-700 font-medium mt-1">
            Net Change: {formatCurrency(totals.netChange)}
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-500 font-bold">Yield & Tax Metrics</div>
          <div className="text-xs text-slate-300 print:text-slate-700 mt-1">
            Current APY: <strong className="font-mono text-white print:text-slate-900">{account.apy || '4.50%'}</strong>
          </div>
          <div className="text-xs text-slate-300 print:text-slate-700 mt-0.5">
            Interest YTD: <strong className="font-mono text-emerald-400 print:text-emerald-700">{formatCurrency(account.interestYtd || 840.90)}</strong>
          </div>
        </div>

      </div>

      {/* 3. TRANSACTION LEDGER */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-xs uppercase text-indigo-300 print:text-slate-900 tracking-wider">
            Treasury & Cash Activity Ledger
          </h3>
          <span className="text-xs text-slate-400 print:text-slate-600 font-mono">
            Starting Cash: {formatCurrency(account.startingBalance)}
          </span>
        </div>

        <table className="w-full text-left border-collapse text-xs bg-slate-800/50 print:bg-white rounded border border-slate-700/50 print:border-slate-200">
          <thead>
            <tr className="bg-slate-800 print:bg-slate-100 text-slate-300 print:text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700 print:border-slate-300">
              <th className="py-2.5 px-3">Valuation Date</th>
              <th className="py-2.5 px-3">Description / Counterparty</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Cash Flow ($)</th>
              <th className="py-2.5 px-3 text-right">Portfolio NAV ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 print:divide-slate-200">
            {totals.processedTransactions.map((tx, idx) => (
              <tr key={tx.id || idx} className="hover:bg-slate-800/80 print:hover:bg-slate-50">
                <td className="py-2 px-3 font-mono text-slate-400 print:text-slate-600 whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="py-2 px-3 font-medium text-slate-100 print:text-slate-900">
                  {tx.description}
                </td>
                <td className="py-2 px-3 text-slate-400 print:text-slate-600 text-[11px]">
                  {tx.category}
                </td>
                <td className={`py-2 px-3 text-right font-mono font-semibold whitespace-nowrap ${
                  tx.amount >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-slate-300 print:text-slate-800'
                }`}>
                  {tx.amount >= 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-sky-300 print:text-blue-900 font-bold whitespace-nowrap">
                  {formatCurrency(tx.runningBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* 4. REGULATORY DISCLOSURES */}
      <RegulatoryDisclosures institution={institution} />

    </div>
  );
}
