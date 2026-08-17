import React from 'react';
import CommercialBankTemplate from './CommercialBankTemplate';
import CreditUnionTemplate from './CreditUnionTemplate';
import WealthManagementTemplate from './WealthManagementTemplate';
import USMetroBankTemplate from './USMetroBankTemplate';
import { ChaseLogo, BofaLogo, WellsFargoLogo, UsMetroLogo } from '../vectors';

export default function TemplateRenderer({ templateId, ...props }) {
  switch (templateId) {
    case 'us_metro_style':
      return <USMetroBankTemplate {...props} />;
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

// 1:1 Chase Specific Layout Template (Pure Vector Logos)
export function ChaseStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#114b78]">
      {/* Chase Top Brand Header Bar with Pure Vector Logo */}
      <div className="flex justify-between items-center border-b border-slate-300 pb-3 mb-4">
        <div className="flex items-center">
          <ChaseLogo className="h-8" showText={true} />
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

// 1:1 Bank of America Specific Layout Template (Pure Vector Logos)
export function BofaStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#dc2626]">
      <div className="flex justify-between items-start border-b-2 border-[#dc2626] pb-3 mb-4">
        <div>
          <BofaLogo className="h-7" showText={true} />
          <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">Preferred Rewards e-Statement</div>
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

// 1:1 Wells Fargo Specific Layout Template (Pure Vector Logos)
export function WellsStyleTemplate({ institution, customerInfo, statementMeta, account, totals, transactions }) {
  return (
    <div className="statement-page-canvas text-slate-900 p-6 font-sans border-t-8 border-[#b91c1c]">
      <div className="flex justify-between items-center bg-[#b91c1c] text-white p-3 rounded-t mb-4">
        <WellsFargoLogo className="h-7" showText={true} />
        <span className="text-xs font-mono">Everyday Checking Summary</span>
      </div>
      <CommercialBankTemplate institution={institution} customerInfo={customerInfo} statementMeta={statementMeta} account={account} totals={totals} transactions={transactions} />
    </div>
  );
}
