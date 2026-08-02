import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import RegulatoryDisclosures from './RegulatoryDisclosures';

export default function CreditUnionTemplate({
  institution,
  customerInfo,
  statementMeta,
  account,
  totals,
  transactions
}) {
  return (
    <div 
      className="bg-emerald-950/5 text-slate-900 p-6 w-full mx-auto rounded-sm border-t-8 border-emerald-700 print:shadow-none print:max-w-none print:p-0 print:border-none"
      style={{ fontFamily: institution.fontFamily || 'Roboto, Arial, sans-serif' }}
    >
      
      {/* 1. CREDIT UNION HEADER BANNER */}
      <div className="flex justify-between items-center border-b-2 border-emerald-800 pb-4">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center font-black text-white text-xl shadow">
            {institution.logoText[0]}
          </div>
          <div>
            <h1 className="text-xl font-black text-emerald-950 tracking-wide uppercase">{institution.name}</h1>
            <p className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">{institution.tagline}</p>
          </div>
        </div>

        {/* Right Charter & NCUA */}
        <div className="text-right text-xs text-slate-600">
          <div className="font-bold text-emerald-900">{institution.charter}</div>
          <div>Federally Insured by NCUA</div>
          <div className="font-mono text-slate-700">Member Service: {institution.customerServicePhone}</div>
        </div>

      </div>

      {/* 2. MEMBER & STATEMENT SUMMARY */}
      <div className="mt-5 grid grid-cols-2 gap-6">
        
        {/* Member Details */}
        <div className="bg-white p-3.5 rounded border border-emerald-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Member Information</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{customerInfo.name}</div>
          <div className="text-xs text-slate-600">{customerInfo.address}</div>
          <div className="text-xs text-slate-600">{customerInfo.cityStateZip}</div>
        </div>

        {/* Statement Meta Details */}
        <div className="bg-emerald-900 text-white p-3.5 rounded shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Statement Cycle</div>
              <div className="text-xs font-semibold">
                {formatDate(statementMeta.startDate)} - {formatDate(statementMeta.endDate)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Share Account</div>
              <div className="text-xs font-mono font-bold">{account.fullAccountNumber}</div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-emerald-800 flex justify-between items-center text-xs">
            <span>Dividend Rate (APY): <strong>{account.apy || '3.85%'}</strong></span>
            <span>YTD Dividends Paid: <strong className="text-emerald-300">{formatCurrency(account.interestYtd || 180.50)}</strong></span>
          </div>
        </div>

      </div>

      {/* 3. SHARE ACCOUNT SUMMARY TABLE */}
      <div className="mt-6 bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 flex justify-between">
          <span>{account.type} Statement Summary</span>
          <span className="font-mono text-slate-600">Ending Balance: {formatCurrency(totals.endingBalance)}</span>
        </div>

        <div className="grid grid-cols-4 divide-x divide-slate-200 text-center py-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Beginning Balance</div>
            <div className="font-mono font-bold text-slate-800 mt-0.5">{formatCurrency(account.startingBalance)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Deposits / Credits</div>
            <div className="font-mono font-bold text-emerald-600 mt-0.5">+{formatCurrency(totals.totalDeposits)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Withdrawals / Debits</div>
            <div className="font-mono font-bold text-rose-600 mt-0.5">-{formatCurrency(totals.totalWithdrawals)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Ending Share Balance</div>
            <div className="font-mono font-bold text-emerald-800 mt-0.5 text-sm">{formatCurrency(totals.endingBalance)}</div>
          </div>
        </div>
      </div>

      {/* 4. TRANSACTION HISTORY TABLE */}
      <div className="mt-6">
        <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider mb-2">
          Member Share Transaction History
        </h3>

        <table className="w-full text-left border-collapse text-xs bg-white rounded border border-slate-200 overflow-hidden">
          <thead>
            <tr className="bg-emerald-900 text-white font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-2 px-2.5">Post Date</th>
              <th className="py-2 px-2.5">Transaction Detail</th>
              <th className="py-2 px-2.5 text-center">Channel</th>
              <th className="py-2 px-2.5 text-right">Amount ($)</th>
              <th className="py-2 px-2.5 text-right">Share Balance ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {totals.processedTransactions.map((tx, idx) => (
              <tr key={tx.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                <td className="py-2 px-2.5 font-mono text-slate-700 whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="py-2 px-2.5 font-medium text-slate-900">
                  {tx.description}
                </td>
                <td className="py-2 px-2.5 text-center text-slate-500 text-[11px]">
                  {tx.type}
                </td>
                <td className={`py-2 px-2.5 text-right font-mono font-semibold whitespace-nowrap ${
                  tx.amount >= 0 ? 'text-emerald-700' : 'text-slate-800'
                }`}>
                  {tx.amount >= 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </td>
                <td className="py-2 px-2.5 text-right font-mono text-emerald-950 font-bold whitespace-nowrap">
                  {formatCurrency(tx.runningBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* 5. REGULATORY DISCLOSURES */}
      <RegulatoryDisclosures institution={institution} />

    </div>
  );
}
