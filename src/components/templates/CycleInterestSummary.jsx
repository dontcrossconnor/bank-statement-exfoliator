import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function CycleInterestSummary({ account, totals, statementMeta }) {
  const startDate = new Date(statementMeta.startDate);
  const endDate = new Date(statementMeta.endDate);
  const cycleDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);

  // Compute exact average daily balance
  const dailyBalances = [];
  let running = account.startingBalance;
  const sortedTx = [...(totals.processedTransactions || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentTxIndex = 0;
  for (let d = 0; d < cycleDays; d++) {
    const currentDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];

    while (currentTxIndex < sortedTx.length && sortedTx[currentTxIndex].date === dateStr) {
      running += parseFloat(sortedTx[currentTxIndex].amount);
      currentTxIndex++;
    }
    dailyBalances.push(running);
  }

  const avgDailyBalance = dailyBalances.reduce((a, b) => a + b, 0) / cycleDays;
  const apyNum = parseFloat(account.apy) || 0.05;
  const interestEarnedThisPeriod = (avgDailyBalance * (apyNum / 100) * (cycleDays / 365));

  return (
    <div className="mt-5 border border-slate-300 rounded bg-slate-50 p-3 text-xs">
      <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-300 pb-1 mb-2 flex justify-between">
        <span>Statement Cycle Interest & APYE Summary</span>
        <span className="text-slate-500 font-mono">Days in Cycle: {cycleDays}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] font-mono">
        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-[9px] text-slate-500 font-sans uppercase">Average Daily Balance</div>
          <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(avgDailyBalance)}</div>
        </div>

        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-[9px] text-slate-500 font-sans uppercase">Interest Earned This Cycle</div>
          <div className="font-bold text-emerald-700 mt-0.5">+{formatCurrency(interestEarnedThisPeriod)}</div>
        </div>

        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-[9px] text-slate-500 font-sans uppercase">APYE (Annual Yield Earned)</div>
          <div className="font-bold text-slate-900 mt-0.5">{account.apy || '0.05%'}</div>
        </div>

        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-[9px] text-slate-500 font-sans uppercase">Interest Paid YTD</div>
          <div className="font-bold text-emerald-700 mt-0.5">{formatCurrency(account.interestYtd || 12.45)}</div>
        </div>
      </div>
    </div>
  );
}
