import React from 'react';
import CommercialBankTemplate from './templates/CommercialBankTemplate';
import CreditUnionTemplate from './templates/CreditUnionTemplate';
import WealthManagementTemplate from './templates/WealthManagementTemplate';

export default function StatementViewer({
  institution,
  customerInfo,
  statementMeta,
  account,
  totals,
  transactions
}) {
  const renderTemplate = () => {
    switch (institution.type) {
      case 'Credit Union':
        return (
          <CreditUnionTemplate
            institution={institution}
            customerInfo={customerInfo}
            statementMeta={statementMeta}
            account={account}
            totals={totals}
            transactions={transactions}
          />
        );
      case 'Wealth Management':
        return (
          <WealthManagementTemplate
            institution={institution}
            customerInfo={customerInfo}
            statementMeta={statementMeta}
            account={account}
            totals={totals}
            transactions={transactions}
          />
        );
      case 'Bank':
      default:
        return (
          <CommercialBankTemplate
            institution={institution}
            customerInfo={customerInfo}
            statementMeta={statementMeta}
            account={account}
            totals={totals}
            transactions={transactions}
          />
        );
    }
  };

  return (
    <div id="printable-statement" className="py-6 px-4 flex justify-center w-full overflow-x-auto">
      {/* Standard Letter (8.5in / 816px) canvas constrained container */}
      <div className="w-full max-w-[816px] bg-white shadow-2xl rounded-sm border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none print:p-0">
        {renderTemplate()}
      </div>
    </div>
  );
}
