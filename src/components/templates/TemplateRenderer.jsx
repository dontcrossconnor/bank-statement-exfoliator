import React from 'react';
import CommercialBankTemplate from './CommercialBankTemplate';
import CreditUnionTemplate from './CreditUnionTemplate';
import WealthManagementTemplate from './WealthManagementTemplate';

export default function TemplateRenderer({ templateId, ...props }) {
  switch (templateId) {
    case 'chase_style':
      return <ChaseStyleTemplate {...props} />;
    case 'bofa_style':
      return <BofaStyleTemplate {...props} />;
    case 'wells_style':
      return <WellsStyleTemplate {...props} />;
    case 'credit_union':
      return <CreditUnionTemplate {...props} />;
    case 'wealth_management':
      return <WealthManagementTemplate {...props} />;
    case 'commercial_standard':
    default:
      return <CommercialBankTemplate {...props} />;
  }
}

// 1:1 Chase Specific Layout Template
export function ChaseStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  const cardLast4 = account.accountNumber.slice(-4);

  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#114b78]">
      {/* Chase Top Brand Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-300 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-[#114b78] rounded flex items-center justify-center font-black text-white text-xs">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#114b78]">CHASE</span>
        </div>
        <div className="text-right text-[10px] text-slate-600 font-mono">
          <div>Page 1 of 2</div>
          <div>Statement Period: {statementMeta.startDate} - {statementMeta.endDate}</div>
        </div>
      </div>

      {/* Chase Account Info Banner */}
      <div className="bg-[#114b78]/5 p-3 rounded border border-[#114b78]/20 mb-4 flex justify-between">
        <div>
          <div className="text-[10px] font-bold text-[#114b78] uppercase">Account Summary</div>
          <div className="text-xs font-bold text-slate-900">{customerInfo.name}</div>
          <div className="text-[11px] text-slate-600 font-mono">Account #{account.fullAccountNumber}</div>
        </div>
        <div className="text-right font-mono text-xs">
          <div className="text-slate-500 text-[10px]">Ending Balance</div>
          <div className="text-base font-bold text-[#114b78]">${totals.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Embedded Component Standard Table */}
      <CommercialBankTemplate institution={institution} customerInfo={customerInfo} statementMeta={statementMeta} account={account} totals={totals} transactions={transactions} />
    </div>
  );
}

// 1:1 Bank of America Specific Layout Template
export function BofaStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#dc2626]">
      <div className="flex justify-between items-start border-b-2 border-[#dc2626] pb-3 mb-4">
        <div>
          <span className="font-extrabold text-2xl tracking-tighter text-[#dc2626]">BANK OF AMERICA</span>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Preferred Rewards e-Statement</div>
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <div>{customerInfo.name}</div>
          <div className="font-mono text-[10px]">Account #{account.fullAccountNumber}</div>
        </div>
      </div>
      <CommercialBankTemplate institution={institution} customerInfo={customerInfo} statementMeta={statementMeta} account={account} totals={totals} transactions={transactions} />
    </div>
  );
}

// 1:1 Wells Fargo Specific Layout Template
export function WellsStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#b91c1c]">
      <div className="flex justify-between items-center bg-[#b91c1c] text-white p-3 rounded-t mb-4">
        <span className="font-black text-lg tracking-wider">WELLS FARGO</span>
        <span className="text-xs font-mono">Everyday Checking Summary</span>
      </div>
      <CommercialBankTemplate institution={institution} customerInfo={customerInfo} statementMeta={statementMeta} account={account} totals={totals} transactions={transactions} />
    </div>
  );
}
