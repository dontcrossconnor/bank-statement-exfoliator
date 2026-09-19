import React from 'react';
import {
  HinghamLogo,
  HinghamFooterBanner,
  HinghamPhoneIcon,
  HinghamMailboxIcon,
  HinghamLaptopIcon
} from '../vectors';

/**
 * 1:1 Pixel-Faithful Replica of Hingham Institution for Savings Checking Statement
 * Matches the authentic enterprise PDF source down to exact typography, alignments,
 * vector logos, iconography, table borders, and 2-page statutory disclosures.
 * Supports multi-month statement sequence (e.g. May -> June -> July) with full continuity.
 */
export default function HinghamSavingsTemplate({
  customerInfo = {
    name: 'One West Medical Group, Inc.',
    subName: 'GLENN MARSHAK',
    address: '8920 WILSHIRE BLVD STE 301',
    cityStateZip: 'BEVERLY HILLS CA 90211-3207'
  },
  statementMeta = {
    startDate: '2026-05-01',
    endDate: '2026-05-31'
  },
  account = {
    accountNumber: '26130895',
    fullAccountNumber: '26130895',
    type: 'COMMERCIAL CHECKING ACCOUNT',
    startingBalance: 488342.18,
    endingBalance: 622226.80
  },
  totals = {
    startingBalance: 488342.18,
    totalDeposits: 150734.62,
    totalWithdrawals: 16850.00,
    endingBalance: 622226.80,
    netChange: 133884.62
  },
  transactions = [],
  statements = null
}) {
  // Format dates as MM/DD/YYYY
  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Format currency helper
  const fmt = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Derive YYMMDD OCR tracking code from statement end date
  const getOcrDateCode = (dateStr) => {
    if (!dateStr) return '260531';
    const clean = dateStr.includes('/') 
      ? `${dateStr.split('/')[2]}-${dateStr.split('/')[0]}-${dateStr.split('/')[1]}`
      : dateStr;
    const parts = clean.split('-');
    if (parts.length === 3) {
      return `${parts[0].slice(-2)}${parts[1].padStart(2, '0')}${parts[2].padStart(2, '0')}`;
    }
    return '260531';
  };

  // If statements array is provided (e.g., multi-month mode), render each month
  const statementList = (statements && Array.isArray(statements) && statements.length > 0)
    ? statements
    : [{
        statementMeta,
        startBalance: totals?.startingBalance !== undefined ? totals.startingBalance : (account.startingBalance || 488342.18),
        endBalance: totals?.endingBalance !== undefined ? totals.endingBalance : (account.endingBalance || 622226.80),
        transactions: transactions && transactions.length > 0 ? transactions : []
      }];

  return (
    <div className="hingham-statement-container text-black font-sans select-none bg-white">
      {statementList.map((stmt, sIdx) => {
        const curMeta = stmt.statementMeta || statementMeta;
        const startDateFormatted = formatDateStr(curMeta.startDate) || '05/01/2026';
        const endDateFormatted = formatDateStr(curMeta.endDate) || '05/31/2026';

        const curStartBalance = typeof stmt.startBalance === 'number'
          ? stmt.startBalance
          : (typeof totals?.startingBalance === 'number' ? totals.startingBalance : (account.startingBalance || 488342.18));

        // Derive transactions for this month
        let monthTx = [];
        if (stmt.transactions) {
          monthTx = stmt.transactions;
        } else if (stmt.deposits || stmt.debits) {
          monthTx = [...(stmt.deposits || []), ...(stmt.otherCredits || []), ...(stmt.debits || []), ...(stmt.otherDebits || [])];
        } else {
          monthTx = transactions || [];
        }

        // Sort chronologically
        const sortedTx = [...monthTx].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Filter credits and debits
        const creditsList = sortedTx.filter(tx => (parseFloat(tx.amount) || 0) > 0);
        const debitsList = sortedTx.filter(tx => (parseFloat(tx.amount) || 0) < 0);

        const totalCreditsCount = creditsList.length;
        const totalCreditsSum = creditsList.reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);

        const totalDebitsCount = debitsList.length;
        const totalDebitsSum = Math.abs(debitsList.reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0));

        const curEndBalance = typeof stmt.endBalance === 'number'
          ? stmt.endBalance
          : (curStartBalance + totalCreditsSum - totalDebitsSum);

        // Daily balances calculation
        const dailyBalances = [];
        let runningBal = curStartBalance;
        const dateGroups = {};

        sortedTx.forEach(tx => {
          const d = formatDateStr(tx.date);
          if (!dateGroups[d]) dateGroups[d] = [];
          dateGroups[d].push(tx);
        });

        Object.keys(dateGroups).forEach(d => {
          dateGroups[d].forEach(tx => {
            runningBal += (parseFloat(tx.amount) || 0);
          });
          dailyBalances.push({
            date: d,
            balance: runningBal
          });
        });

        if (dailyBalances.length === 0) {
          dailyBalances.push({
            date: endDateFormatted,
            balance: curEndBalance
          });
        }

        return (
          <React.Fragment key={sIdx}>
            {/* ========================================================================= */}
            {/* PAGE 1 */}
            {/* ========================================================================= */}
            <div className="statement-page-canvas relative w-full bg-white px-9 pt-6 pb-5 flex flex-col justify-between min-h-[1056px] text-black text-[12px] leading-tight">
              
              <div>
                {/* Top Header Grid: Left Bank & Recipient / Right Header & Managing Accounts */}
                <div className="grid grid-cols-12 gap-4 items-start mb-4">
                  
                  {/* Left Column (Logo + Bank Address + Mailing Window) */}
                  <div className="col-span-6 pl-3">
                    {/* Bank Logo - Larger & More Prominent */}
                    <div className="mb-2.5">
                      <HinghamLogo className="h-[56px] w-auto text-black" />
                    </div>
                    
                    {/* Bank Mailing Address */}
                    <div className="text-[12.5px] font-bold leading-[1.25] mb-5 text-black">
                      <div>55 Main Street</div>
                      <div>Hingham, MA 02043</div>
                    </div>

                    {/* Customer Mailing Address Window */}
                    <div className="text-[12.5px] leading-[1.3] font-normal tracking-tight text-black">
                      <div className="font-semibold">{customerInfo.name || 'One West Medical Group, Inc.'}</div>
                      {customerInfo.subName && <div>{customerInfo.subName}</div>}
                      <div>{customerInfo.address || '8920 WILSHIRE BLVD STE 301'}</div>
                      <div>{customerInfo.cityStateZip || 'BEVERLY HILLS CA 90211-3207'}</div>
                    </div>
                  </div>

                  {/* Right Column (Statement Ending + Page + Account + Managing Accounts) */}
                  <div className="col-span-6 pr-2">
                    
                    {/* Statement Ending Header */}
                    <div className="border-b-[2px] border-black pb-1 mb-1">
                      <h1 className="text-[20px] font-bold italic tracking-tight text-right text-black font-sans">
                        Statement Ending {endDateFormatted}
                      </h1>
                    </div>

                    {/* Header Sub-meta */}
                    <div className="flex justify-between items-center text-[10.5px] font-bold italic text-black mb-0.5">
                      <div>{customerInfo.name || 'One West Medical Group, Inc.'}</div>
                      <div>Page 1 of 2</div>
                    </div>
                    <div className="text-[10.5px] font-bold italic text-black mb-2">
                      Account Number: {account.accountNumber || '26130895'}
                    </div>

                    {/* Managing Your Accounts Section */}
                    <div className="mt-3">
                      <h2 className="text-[17px] font-bold italic tracking-tight text-black mb-1.5 font-sans">
                        Managing Your Accounts
                      </h2>

                      <div className="space-y-2 text-[11.5px]">
                        {/* Phone */}
                        <div className="flex items-center space-x-2.5">
                          <HinghamPhoneIcon className="w-[20px] h-[20px] flex-shrink-0" />
                          <div className="w-28 font-medium text-black">Phone Number</div>
                          <div className="font-normal text-black">781-749-2200</div>
                        </div>

                        {/* Mailing Address */}
                        <div className="flex items-start space-x-2.5">
                          <HinghamMailboxIcon className="w-[20px] h-[20px] flex-shrink-0 mt-0.5" />
                          <div className="w-28 font-medium text-black">Mailing Address</div>
                          <div className="font-normal text-black leading-tight">
                            <div>55 Main Street</div>
                            <div>Hingham, MA 02043</div>
                          </div>
                        </div>

                        {/* Online Access */}
                        <div className="flex items-center space-x-2.5">
                          <HinghamLaptopIcon className="w-[20px] h-[20px] flex-shrink-0" />
                          <div className="w-28 font-medium text-black">Online Access</div>
                          <div className="font-normal text-black">www.hinghamsavings.com</div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Section: Summary of Accounts */}
                <div className="mt-4 mb-4">
                  <h2 className="text-[17px] font-bold italic tracking-tight text-black mb-0.5 font-sans">
                    Summary of Accounts
                  </h2>
                  <div className="border-t-[2px] border-black pt-1">
                    <table className="w-full text-[11.5px] border-collapse">
                      <thead>
                        <tr className="text-black font-bold">
                          <th className="text-left font-bold py-0.5 w-[45%]">Account Type</th>
                          <th className="text-center font-bold py-0.5 w-[30%]">Account Number</th>
                          <th className="text-right font-bold py-0.5 w-[25%]">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-black font-normal">
                          <td className="py-0.5">{account.type || 'COMMERCIAL CHECKING ACCOUNT'}</td>
                          <td className="text-center py-0.5">{account.accountNumber || '26130895'}</td>
                          <td className="text-right py-0.5 font-normal">${fmt(curEndBalance)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section: Account Detail Breakdown */}
                <div className="mt-4">
                  <h2 className="text-[17px] font-bold tracking-tight text-black mb-0.5 font-sans">
                    {account.type || 'COMMERCIAL CHECKING ACCOUNT'} - {account.accountNumber || '26130895'}
                  </h2>
                  <div className="border-t-[2px] border-black pt-1.5">
                    
                    {/* Account Summary Subtable */}
                    <div className="mb-3">
                      <h3 className="text-[12.5px] font-bold text-black mb-0.5">Account Summary</h3>
                      <table className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="text-black font-bold">
                            <th className="text-left py-0.5 w-24">Date</th>
                            <th className="text-left py-0.5">Description</th>
                            <th className="text-right py-0.5 w-28">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-0.5">{startDateFormatted}</td>
                            <td className="py-0.5">Beginning Balance</td>
                            <td className="text-right py-0.5">${fmt(curStartBalance)}</td>
                          </tr>
                          <tr>
                            <td className="py-0.5"></td>
                            <td className="py-0.5">{totalCreditsCount} Credit(s) This Period</td>
                            <td className="text-right py-0.5">${fmt(totalCreditsSum)}</td>
                          </tr>
                          <tr>
                            <td className="py-0.5"></td>
                            <td className="py-0.5">{totalDebitsCount} Debit(s) This Period</td>
                            <td className="text-right py-0.5">-${fmt(totalDebitsSum)}</td>
                          </tr>
                          <tr>
                            <td className="py-0.5">{endDateFormatted}</td>
                            <td className="py-0.5 font-normal">Ending Balance</td>
                            <td className="text-right py-0.5 font-normal">${fmt(curEndBalance)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Account Activity Subtable */}
                    <div className="mb-3">
                      <h3 className="text-[12.5px] font-bold text-black mb-0.5">Account Activity</h3>
                      <table className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="text-black font-bold border-b border-black">
                            <th className="text-left py-0.5 w-24">Post Date</th>
                            <th className="text-left py-0.5">Description</th>
                            <th className="text-right py-0.5 w-24">Debits</th>
                            <th className="text-right py-0.5 w-24">Credits</th>
                            <th className="text-right py-0.5 w-24">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Beginning Balance row */}
                          <tr className="border-b border-transparent">
                            <td className="py-0.5 font-bold">{startDateFormatted}</td>
                            <td className="py-0.5 font-bold">Beginning Balance</td>
                            <td className="py-0.5"></td>
                            <td className="py-0.5"></td>
                            <td className="text-right py-0.5 font-normal">${fmt(curStartBalance)}</td>
                          </tr>

                          {/* Dynamic Transactions list */}
                          {sortedTx.map((tx, idx) => {
                            const amt = parseFloat(tx.amount) || 0;
                            const isDebit = amt < 0;
                            const isCredit = amt > 0;
                            const dateStr = formatDateStr(tx.date);

                            return (
                              <tr key={tx.id || idx} className="border-b border-transparent align-top">
                                <td className="py-0.5">{dateStr}</td>
                                <td className="py-0.5 pr-3">
                                  <div className="font-normal">{tx.rawDescription || tx.description?.split('\n')[0] || tx.description}</div>
                                  {tx.detailLine1 && (
                                    <div className="text-[9.5px] text-black italic mt-0.5">{tx.detailLine1}</div>
                                  )}
                                  {tx.detailLine2 && (
                                    <div className="text-[9.5px] text-black mt-0.5">{tx.detailLine2}</div>
                                  )}
                                  {!tx.detailLine1 && tx.description?.includes('\n') && (
                                    tx.description.split('\n').slice(1).map((line, lIdx) => (
                                      <div key={lIdx} className="text-[9.5px] text-black italic mt-0.5">{line}</div>
                                    ))
                                  )}
                                </td>
                                <td className="text-right py-0.5">{isDebit ? `$${fmt(Math.abs(amt))}` : ''}</td>
                                <td className="text-right py-0.5">{isCredit ? `$${fmt(amt)}` : ''}</td>
                                <td className="text-right py-0.5 font-normal">
                                  {tx.runningBalance !== undefined ? `$${fmt(tx.runningBalance)}` : ''}
                                </td>
                              </tr>
                            );
                          })}

                          {/* Ending Balance row */}
                          <tr className="border-t border-transparent">
                            <td className="py-0.5 font-bold">{endDateFormatted}</td>
                            <td className="py-0.5 font-bold">Ending Balance</td>
                            <td className="py-0.5"></td>
                            <td className="py-0.5"></td>
                            <td className="text-right py-0.5 font-normal">${fmt(curEndBalance)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Daily Balances Subtable */}
                    <div className="mb-2">
                      <h3 className="text-[12.5px] font-bold text-black mb-0.5">Daily Balances</h3>
                      <table className="w-52 text-[11px] border-collapse">
                        <thead>
                          <tr className="text-black font-bold border-b border-black">
                            <th className="text-left py-0.5 w-24">Date</th>
                            <th className="text-right py-0.5 w-28">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyBalances.map((db, idx) => (
                            <tr key={idx}>
                              <td className="py-0.5">{db.date}</td>
                              <td className="text-right py-0.5">${fmt(db.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>

              {/* Page 1 Footer Banner: Vector Logo + Tagline + FDIC Seal */}
              <div className="mt-auto pt-3">
                <HinghamFooterBanner />
                
                {/* Microprint OCR bottom line */}
                <div className="text-[8px] text-slate-400/80 font-mono flex justify-between mt-1 select-none">
                  <span>E6D28C980EF47D4ABE55543DCEF115E1</span>
                  <span>PED003FOS</span>
                  <span>{getOcrDateCode(curMeta.endDate)}</span>
                </div>
              </div>

            </div>

            {/* Page Break between Page 1 and Page 2 */}
            <div className="break-before-page border-t-8 border-slate-200 print:border-none my-6 print:my-0"></div>

            {/* ========================================================================= */}
            {/* PAGE 2 (Disclosures & Regulatory Notices) */}
            {/* ========================================================================= */}
            <div className="statement-page-canvas relative w-full bg-white px-9 pt-6 pb-5 flex flex-col justify-between min-h-[1056px] text-black text-[12px] leading-tight">
              
              <div>
                {/* Top Running Header */}
                <div className="border-b-[2px] border-black pb-1 mb-8">
                  <div className="flex justify-between items-center text-[12px] text-black font-normal">
                    <div className="font-bold whitespace-nowrap">{customerInfo.name || 'One West Medical Group, Inc.'}</div>
                    <div className="font-bold text-center px-3">{account.accountNumber || '26130895'}</div>
                    <div className="font-bold text-center px-3">Statement Ending {endDateFormatted}</div>
                    <div className="font-bold text-right">Page 2 of 2</div>
                  </div>
                </div>

                {/* Centered Notice Container matching exact margins (x=88.8 to 523.0) */}
                <div className="max-w-[620px] mx-auto px-4 text-[13.5px] leading-[1.38] text-black">
                  
                  {/* Section 1: ERROR RESOLUTION NOTICE */}
                  <div className="mb-9">
                    <h2 className="text-[14.5px] font-bold tracking-tight text-black mb-3 font-sans">
                      ERROR RESOLUTION NOTICE - CONSUMER ACCOUNTS ONLY
                    </h2>
                    
                    <p className="mb-4 text-justify font-normal">
                      In Case of Errors or Questions About Your Electronic Transfers Telephone us at 781-749-2200 or Write us at Hingham Institution for Savings 55 Main Street, Hingham, MA 02043 as soon as you can, if you think your statement or receipt is wrong or if you need more information about a transfer on the statement or receipt. We must hear from you no later than 60 days after we sent you the FIRST statement on which the error or problem appeared.
                    </p>

                    <ol className="list-none space-y-1.5 pl-4 mb-4 text-black font-normal">
                      <li className="flex">
                        <span className="w-5 font-bold flex-shrink-0">1.</span>
                        <span>Tell us your name and account number (if any).</span>
                      </li>
                      <li className="flex">
                        <span className="w-5 font-bold flex-shrink-0">2.</span>
                        <span>
                          Describe the error or the transfer you are unsure about, and explain as clearly as you can why you believe it is an error or why you need more information.
                        </span>
                      </li>
                      <li className="flex">
                        <span className="w-5 font-bold flex-shrink-0">3.</span>
                        <span>Tell us the dollar amount of the suspected error.</span>
                      </li>
                    </ol>

                    <p className="text-justify font-normal">
                      We will investigate your complaint and will correct any error promptly. If we take more than 10 business days to do this, we will credit your account for the amount you think is in error, so that you will have the use of the money during the time it takes us to complete our investigation.
                    </p>
                  </div>

                  {/* Section 2: IMPORTANT NOTICE FOR PERSONS 65+ OR 18- */}
                  <div>
                    <h2 className="text-[14.5px] font-bold tracking-tight text-black mb-3 font-sans uppercase">
                      IMPORTANT NOTICE FOR PERSONS 65 YEARS OF AGE OR OLDER OR 18 YEARS OF AGE OR YOUNGER
                    </h2>

                    <p className="text-justify font-normal">
                      Massachusetts law allows a natural person 18 years of age or under or 65 years of age or older to choose one Checking Account and one Savings Account for family or household purposes upon which no service, maintenance or similar charge shall be imposed. However, fees may be assessed in accordance with the Bank’s fee schedule for wire transfers, stop payments and return deposited items as well as a reasonable charge, as determined by the Commissioner of Banks, when payment has been refused because of insufficient funds on any checks or other transactions drawn on such accounts. Eligible persons should contact a Client Service Representative at any one of our branch locations for assistance.
                    </p>
                  </div>

                </div>
              </div>

              {/* Page 2 Footer with Microprint code */}
              <div className="mt-auto pt-4">
                <div className="text-[8px] text-slate-400/80 font-mono flex justify-between select-none">
                  <span>E6D28C980EF47D4ABE55543DCEF115E1</span>
                  <span>PED003FOS</span>
                  <span>{getOcrDateCode(curMeta.endDate)}</span>
                </div>
              </div>

            </div>

            {/* Inter-month Page Break if more months follow */}
            {sIdx < statementList.length - 1 && (
              <div className="break-before-page border-t-8 border-slate-300 print:border-none my-8 print:my-0"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
