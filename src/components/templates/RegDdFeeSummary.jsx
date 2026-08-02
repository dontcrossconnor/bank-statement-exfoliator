import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function RegDdFeeSummary({ totals }) {
  const periodFees = totals.totalFees || 0;
  const ytdFees = totals.ytdFees || periodFees;
  const periodOverdraft = totals.totalOverdraftFees || 0;
  const ytdOverdraft = totals.ytdOverdraftFees || periodOverdraft;

  return (
    <div className="mt-6 border border-slate-300 rounded bg-slate-50 p-3 text-xs">
      <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-300 pb-1 mb-2 flex justify-between">
        <span>Federal Regulation DD — Summary of Fees & Overdraft Charges</span>
        <span className="text-slate-500 font-mono">12 CFR § 1030.11 Compliance</span>
      </div>

      <table className="w-full text-left border-collapse text-[11px]">
        <thead>
          <tr className="text-slate-600 border-b border-slate-200 font-semibold text-[10px] uppercase">
            <th className="py-1 px-2">Fee Category</th>
            <th className="py-1 px-2 text-right">Total This Period ($)</th>
            <th className="py-1 px-2 text-right">Total Year-to-Date ($)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-mono">
          <tr>
            <td className="py-1.5 px-2 font-sans font-medium text-slate-800">Total Overdraft Fees</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(periodOverdraft)}</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(ytdOverdraft)}</td>
          </tr>
          <tr>
            <td className="py-1.5 px-2 font-sans font-medium text-slate-800">Total Returned Item Fees</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(0)}</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(0)}</td>
          </tr>
          <tr>
            <td className="py-1.5 px-2 font-sans font-medium text-slate-800">Account Maintenance / Monthly Service Fees</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(periodFees)}</td>
            <td className="py-1.5 px-2 text-right text-slate-900">{formatCurrency(ytdFees)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
