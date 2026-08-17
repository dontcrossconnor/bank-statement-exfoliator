import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import RegulatoryDisclosures from './RegulatoryDisclosures';
import DocumentBarcode from './DocumentBarcode';
import RegDdFeeSummary from './RegDdFeeSummary';
import DailyBalanceTable from './DailyBalanceTable';
import CycleInterestSummary from './CycleInterestSummary';
import StatementAdBanner from './StatementAdBanner';
import { ApexLogo, ChaseLogo, BofaLogo, WellsFargoLogo, UsMetroLogo } from '../vectors';

export default function CommercialBankTemplate({
  institution,
  customerInfo,
  statementMeta,
  account,
  totals,
  transactions
}) {
  const deposits = transactions.filter(t => t.amount > 0);
  const cardPurchases = transactions.filter(t => t.amount < 0 && !t.checkNumber && t.type !== 'ACH Debit');
  const checksCleared = transactions.filter(t => t.checkNumber);
  const achDebits = transactions.filter(t => t.amount < 0 && t.type === 'ACH Debit');

  const cardLast4 = account.accountNumber.slice(-4);

  return (
    <div 
      className="statement-page-canvas text-slate-900 print:shadow-none print:m-0 print:p-0"
      style={{ fontFamily: institution.fontFamily || 'Helvetica, Arial, sans-serif' }}
    >
      
      {/* 1. INSTITUTION & CUSTOMER HEADER BLOCK WITH BARCODE */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
        <div className="space-y-1">
          <DocumentBarcode documentId={`DOC-${cardLast4}-2026`} />
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Account Statement</div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{customerInfo.name}</h2>
          <p className="text-xs text-slate-600">{customerInfo.address}</p>
          <p className="text-xs text-slate-600">{customerInfo.cityStateZip}</p>
        </div>

        <div className="text-right space-y-1">
          <div className="flex items-center justify-end">
            {institution.id === 'apex_national' ? (
              <ApexLogo className="h-8" showText={true} />
            ) : institution.id === 'chase_sim' ? (
              <ChaseLogo className="h-7" showText={true} />
            ) : institution.id === 'bofa_sim' ? (
              <BofaLogo className="h-7" showText={true} />
            ) : institution.id === 'wells_sim' ? (
              <WellsFargoLogo className="h-7" showText={true} />
            ) : institution.id === 'us_metro_bank' ? (
              <UsMetroLogo className="h-8" showText={true} />
            ) : (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center font-black text-white text-xs"
                  style={{ backgroundColor: institution.accentColor }}
                >
                  {institution.logoText?.[0] || 'B'}
                </div>
                <span className="font-extrabold text-base tracking-wider text-slate-900 uppercase">
                  {institution.name}
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-600 font-mono">{institution.address}</p>
          <p className="text-[11px] text-slate-600">Customer Support: <strong>{institution.customerServicePhone}</strong></p>
          <p className="text-[11px] text-slate-600">Routing (ABA): <strong className="font-mono text-slate-900">{institution.routingNumber}</strong></p>
        </div>
      </div>

      {/* 2. STATEMENT PERIOD & SUMMARY BANNER */}
      <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Statement Period</div>
          <div className="text-xs font-semibold text-slate-900">
            {formatDate(statementMeta.startDate)} through {formatDate(statementMeta.endDate)}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Account Type: <strong className="text-slate-800">{account.type}</strong>
          </div>
          <div className="text-[11px] text-slate-600">
            Account Number: <strong className="font-mono text-slate-900">{account.fullAccountNumber}</strong>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-right border-l border-slate-200 pl-3">
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">Starting</div>
            <div className="text-xs font-mono font-semibold text-slate-800">{formatCurrency(account.startingBalance)}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">Deposits</div>
            <div className="text-xs font-mono font-semibold text-emerald-600">+{formatCurrency(totals.totalDeposits)}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">Ending Balance</div>
            <div className="text-xs font-mono font-bold text-blue-900">{formatCurrency(totals.endingBalance)}</div>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIZED SUB-LEDGERS WITH MULTI-LINE REFERENCE DETAILS */}
      
      {/* SECTION A: DEPOSITS & CREDITS */}
      {deposits.length > 0 && (
        <div className="mt-5">
          <h4 className="font-bold text-xs uppercase text-emerald-800 tracking-wider mb-1 border-b border-emerald-300 pb-0.5">
            Electronic Deposits & Direct Credits ({deposits.length})
          </h4>
          <table className="w-full text-left border-collapse text-xs mb-3">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 font-semibold uppercase text-[9px] tracking-wider">
                <th className="py-1 px-2">Date</th>
                <th className="py-1 px-2">Description & Reference</th>
                <th className="py-1 px-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {deposits.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-1 px-2 font-mono text-slate-700 align-top">{formatDate(tx.date)}</td>
                  <td className="py-1 px-2 font-medium text-slate-900">
                    <div>{tx.description}</div>
                    <div className="text-[9px] font-mono text-slate-500 font-normal">
                      Trace ID: {Math.floor(100000000 + Math.random() * 900000000)} • ACH PPD SEC
                    </div>
                  </td>
                  <td className="py-1 px-2 text-right font-mono font-semibold text-emerald-700 align-top">+{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION B: CHECKS CLEARED REGISTER */}
      {checksCleared.length > 0 && (
        <div className="mt-3">
          <h4 className="font-bold text-xs uppercase text-slate-800 tracking-wider mb-1 border-b border-slate-300 pb-0.5 flex justify-between">
            <span>Checks Cleared / Paid Register ({checksCleared.length})</span>
            <span className="text-[9px] text-slate-500 font-normal">* Indicates gap in check sequence</span>
          </h4>
          <table className="w-full text-left border-collapse text-xs mb-3">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold uppercase text-[9px]">
                <th className="py-1 px-2">Check #</th>
                <th className="py-1 px-2">Date Cleared</th>
                <th className="py-1 px-2">Description</th>
                <th className="py-1 px-2 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {checksCleared.map((tx, idx) => (
                <tr key={idx}>
                  <td className="py-1 px-2 font-bold text-slate-900">#{tx.checkNumber}</td>
                  <td className="py-1 px-2 text-slate-700">{formatDate(tx.date)}</td>
                  <td className="py-1 px-2 font-sans text-slate-800">{tx.description}</td>
                  <td className="py-1 px-2 text-right font-semibold text-slate-900">{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION C: CARD PURCHASES & DEBITS */}
      <div className="mt-3">
        <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider mb-1 border-b border-slate-300 pb-0.5">
          Card Purchases & Electronic Withdrawals ({cardPurchases.length + achDebits.length})
        </h4>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-y border-slate-300 text-slate-700 font-semibold uppercase text-[9px] tracking-wider">
              <th className="py-1.5 px-2">Date</th>
              <th className="py-1.5 px-2">Description & Card Ref</th>
              <th className="py-1.5 px-2 text-center">Type</th>
              <th className="py-1.5 px-2 text-right">Amount ($)</th>
              <th className="py-1.5 px-2 text-right">Balance ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px]">
            {totals.processedTransactions.map((tx, idx) => {
              const refNum = Math.floor(100000000000 + Math.random() * 900000000000);
              const mccCode = Math.floor(5000 + Math.random() * 900);

              return (
                <tr key={tx.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-1.5 px-2 font-mono text-slate-700 whitespace-nowrap align-top">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-1.5 px-2 font-medium text-slate-900">
                    <div>{tx.description}</div>
                    <div className="text-[9px] font-mono text-slate-500 font-normal">
                      Card *{cardLast4} • Ref #{refNum} • MCC: {mccCode}
                    </div>
                  </td>
                  <td className="py-1.5 px-2 text-center text-slate-500 text-[10px] align-top">
                    {tx.type}
                  </td>
                  <td className={`py-1.5 px-2 text-right font-mono font-semibold whitespace-nowrap align-top ${
                    tx.amount >= 0 ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {tx.amount >= 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono text-slate-900 font-semibold whitespace-nowrap align-top">
                    {formatCurrency(tx.runningBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MID-STATEMENT PROMOTIONAL ADVERTISING BANNER */}
      <StatementAdBanner institution={institution} />

      {/* 4. CYCLE INTEREST & AVERAGE DAILY BALANCE BOX */}
      <div className="page-break-inside-avoid">
        <CycleInterestSummary account={account} totals={totals} statementMeta={statementMeta} />
      </div>

      {/* 5. DAILY BALANCE LEDGER TABLE */}
      <div className="page-break-inside-avoid">
        <DailyBalanceTable transactions={transactions} startingBalance={account.startingBalance} />
      </div>

      {/* 6. REG DD FEE SUMMARY BOX */}
      <div className="page-break-inside-avoid">
        <RegDdFeeSummary totals={totals} />
      </div>

      {/* 7. REGULATORY DISCLOSURES & FOOTER */}
      <div className="page-break-inside-avoid">
        <RegulatoryDisclosures institution={institution} />
      </div>

    </div>
  );
}
