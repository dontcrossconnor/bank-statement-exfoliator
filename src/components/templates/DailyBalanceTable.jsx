import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DailyBalanceTable({ transactions, startingBalance }) {
  // Map end-of-day balances
  const dailyBalances = {};
  let running = startingBalance;

  // Group transactions by date
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedTx.forEach(tx => {
    running += parseFloat(tx.amount);
    dailyBalances[tx.date] = running;
  });

  const entries = Object.entries(dailyBalances);

  if (entries.length === 0) return null;

  return (
    <div className="mt-6 border border-slate-200 rounded bg-white p-3 text-xs">
      <h4 className="font-bold text-xs uppercase text-slate-800 tracking-wider mb-2 border-b border-slate-200 pb-1 flex justify-between">
        <span>Daily Ledger Balance Summary</span>
        <span className="text-[10px] text-slate-500 font-mono">Closing Ledger Balances</span>
      </h4>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-[10px] font-mono">
        {entries.map(([dateStr, bal]) => (
          <div key={dateStr} className="bg-slate-50 p-1.5 rounded border border-slate-200 text-center">
            <div className="text-slate-500 font-sans text-[9px]">{formatDate(dateStr)}</div>
            <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(bal)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
