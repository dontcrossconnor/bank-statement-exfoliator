import React from 'react';
import { FdicLogo, EqualHousingLenderLogo } from '../vectors';

export default function RegulatoryDisclosures({ institution }) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-300 text-[10px] leading-tight text-slate-600 space-y-3 font-sans">
      
      {/* Important Notice Header */}
      <div className="bg-slate-100 p-2.5 rounded border border-slate-200">
        <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
          {institution.regulatoryBody} Regulatory Compliance & Billing Rights Summary
        </h5>
        <p>
          {institution.regulatoryNotice}
        </p>
      </div>

      {/* Grid of Standard Bank Disclosures */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h6 className="font-bold text-slate-800 uppercase mb-0.5">In Case of Errors or Questions About Electronic Transfers</h6>
          <p>
            Telephone us at <strong>{institution.customerServicePhone}</strong> or write us at {institution.address} as soon as you can if you think your statement or receipt is wrong or if you need more information about a transfer listed on the statement. We must hear from you no later than 60 days after we sent the FIRST statement on which the problem or error appeared.
          </p>
        </div>

        <div>
          <h6 className="font-bold text-slate-800 uppercase mb-0.5">Overdraft & Finance Charge Computations</h6>
          <p>
            Finance charges on loan accounts and overdraft credit lines are computed on the average daily principal balance during the billing cycle. To obtain the average daily balance, we take the beginning balance of your loan each day, add any new advances, and subtract any payments or credits.
          </p>
        </div>
      </div>

      {/* Footer Branding Seal with Vector Badges */}
      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-3 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <span>Official Monthly Account Statement • </span>
          <span className="font-semibold text-slate-700">{institution.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <FdicLogo className="h-4" color="#475569" showSubtext={false} />
          <EqualHousingLenderLogo className="h-5" color="#475569" />
        </div>
      </div>

    </div>
  );
}
