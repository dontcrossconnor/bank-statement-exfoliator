import React from 'react';
import TemplateRenderer from './templates/TemplateRenderer';

export default function StatementViewer({
  institution,
  customerInfo,
  statementMeta,
  account,
  totals,
  transactions
}) {
  // Map institution ID to specific 1:1 design template layout
  const getTemplateId = () => {
    if (institution.id === 'us_metro_bank') return 'us_metro_style';
    if (institution.id === 'chase_sim') return 'chase_style';
    if (institution.id === 'bofa_sim') return 'bofa_style';
    if (institution.id === 'wells_sim') return 'wells_style';
    if (institution.type === 'Credit Union') return 'credit_union';
    if (institution.type === 'Wealth Management') return 'wealth_management';
    return 'commercial_standard';
  };

  return (
    <div id="printable-statement" className="py-6 px-4 flex justify-center w-full overflow-x-auto">
      {/* Standard Letter (8.5in / 816px) canvas constrained container */}
      <div className="w-full max-w-[816px] bg-white shadow-2xl rounded-sm border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none print:p-0">
        <TemplateRenderer
          templateId={getTemplateId()}
          institution={institution}
          customerInfo={customerInfo}
          statementMeta={statementMeta}
          account={account}
          totals={totals}
          transactions={transactions}
        />
      </div>
    </div>
  );
}
