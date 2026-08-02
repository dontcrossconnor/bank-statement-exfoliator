import React from 'react';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function AnalyticsPanel({ totals, transactions }) {
  // Compute category totals
  const categories = {};
  transactions.forEach(tx => {
    if (tx.amount < 0) {
      const cat = tx.category || 'General';
      categories[cat] = (categories[cat] || 0) + Math.abs(tx.amount);
    }
  });

  const categoryList = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalExpense = totals.totalWithdrawals || 1;

  return (
    <div className="no-print bg-slate-900 border-t border-slate-800 text-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        
        {/* Metric 1 */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Total Deposits / Credits</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              +{formatCurrency(totals.totalDeposits)}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/60">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Total Debits / Withdrawals</div>
            <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
              -{formatCurrency(totals.totalWithdrawals)}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Net Period Cash Flow</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${
              totals.netChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totals.netChange >= 0 ? `+${formatCurrency(totals.netChange)}` : formatCurrency(totals.netChange)}
            </div>
          </div>
        </div>

        {/* Top Expense Categories Breakdown */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-2">
            <span className="flex items-center space-x-1">
              <PieChart className="w-3.5 h-3.5 text-sky-400" />
              <span>Top Outflow Categories</span>
            </span>
          </div>

          <div className="space-y-1.5">
            {categoryList.map(([cat, amt]) => {
              const pct = Math.round((amt / totalExpense) * 100);
              return (
                <div key={cat} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-300 font-medium truncate max-w-[120px]">{cat}</span>
                    <span className="text-slate-400 font-mono">{formatCurrency(amt)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
