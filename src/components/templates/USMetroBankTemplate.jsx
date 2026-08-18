import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  UsMetroLogo,
  FdicLogo,
  EqualHousingLenderLogo,
  BranchVectorIcon,
  PhoneVectorIcon,
  MailboxVectorIcon,
  LaptopVectorIcon,
  UspsIntelligentMailBarcode,
  DataMatrix2DBarcode
} from '../vectors';
import couplePhoto from '../../assets/us_metro_couple_photo.png';

export default function USMetroBankTemplate({
  institution = {},
  customerInfo = {},
  statementMeta = {},
  account = {},
  totals = {},
  transactions = [],
  statements = null
}) {
  // If statements array is provided, render each month sequentially
  const statementsList = statements && Array.isArray(statements) && statements.length > 0
    ? statements
    : [{ statementMeta, startBalance: account.startingBalance || 389218.13, endBalance: totals.endingBalance, transactions }];

  // Format date MM/DD/YYYY
  const formatMDY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="us-metro-statement font-sans text-[#111111] bg-white selection:bg-blue-100 print:m-0 print:p-0">
      {statementsList.map((stmt, sIdx) => {
        const currentMeta = stmt.statementMeta || statementMeta;
        const statementEndDate = currentMeta.endDate || '2026-07-31';
        const statementStartDate = currentMeta.startDate || '2026-07-01';
        const formattedEndDate = formatMDY(statementEndDate);
        const formattedStartDate = formatMDY(statementStartDate);

        // Derive batch run code YYYYMMDD from statementEndDate (e.g. 2026-06-30 -> 20260701, 2026-07-31 -> 20260801)
        const [eY, eM, eD] = statementEndDate.split('-').map(Number);
        const nextDay = new Date(eY, eM - 1, eD + 1);
        const batchCode = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;

        // Get categorized transaction lists
        const deposits = stmt.deposits || (stmt.transactions ? stmt.transactions.filter(t => t.amount > 0 && t.type !== 'Interest') : []);
        const otherCredits = stmt.otherCredits || (stmt.transactions ? stmt.transactions.filter(t => t.amount > 0 && (t.type === 'Interest' || t.category === 'otherCredit')) : []);
        const debits = stmt.debits || (stmt.transactions ? stmt.transactions.filter(t => t.amount < 0 && t.category !== 'otherDebit') : []);
        const otherDebits = stmt.otherDebits || (stmt.transactions ? stmt.transactions.filter(t => t.amount < 0 && t.category === 'otherDebit') : []);

        const allCredits = [...deposits, ...otherCredits];
        const allDebits = [...debits, ...otherDebits];

        const totalCredits = allCredits.reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const totalDebits = allDebits.reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const startingBal = stmt.startBalance ?? (account.startingBalance || 389218.13);
        const endingBal = stmt.endBalance ?? (startingBal + totalCredits - totalDebits);

        // Combined ordered list for daily balances
        const allTx = [...allCredits, ...allDebits].sort((a, b) => a.date.localeCompare(b.date));
        const dailyBalances = {};
        let running = startingBal;
        allTx.forEach(tx => {
          running += parseFloat(tx.amount);
          dailyBalances[tx.date] = running;
        });
        const dailyEntries = Object.entries(dailyBalances);
        if (dailyEntries.length === 0) {
          dailyEntries.push([statementEndDate, endingBal]);
        }

        const totalCreditsCount = allCredits.length;
        const totalDebitsCount = allDebits.length;

        return (
          <React.Fragment key={sIdx}>
            {/* ========================================================
                PAGE 1: EXACT 8.5" x 11" LETTER CANVAS (816px x 1056px)
                HEADER, BANNER, SUMMARY, CREDITS & OTHER CREDITS
                ======================================================== */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden select-none"
              style={{ width: '816px', height: '1056px' }}
            >
              {/* Bank Logo */}
              <div style={{ position: 'absolute', left: '64px', top: '15px' }}>
                <UsMetroLogo className="h-[46px] w-auto" />
              </div>

              {/* Right Header: Statement Ending & Page 1 of 4 */}
              <div style={{ position: 'absolute', right: '48px', top: '22px', textAlign: 'right' }}>
                <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-[20px] font-bold italic tracking-tight text-[#111111]">
                  Statement Ending {formattedEndDate}
                </div>
                <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-[11px] text-[#222222] font-semibold italic mt-[2px]">
                  Page 1 of 4
                </div>
              </div>

              {/* Top Header Divider Line */}
              <div style={{ position: 'absolute', left: '468px', top: '50px', width: '304px', height: '2px', backgroundColor: '#111111' }}></div>

              {/* Bank Wilshire Origin Address (under logo) */}
              <div style={{ position: 'absolute', left: '64px', top: '76px', fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-[11px] text-[#111111] leading-[15px] font-bold">
                <div>3580 Wilshire Blvd. Ste 1800</div>
                <div>Los Angeles, CA 90010</div>
              </div>

              {/* Vertical side micro tracking code (left of recipient block) */}
              <div
                style={{ position: 'absolute', left: '38px', top: '184px', transform: 'rotate(-90deg)', transformOrigin: 'top left', fontFamily: '"Courier New", Courier, monospace' }}
                className="text-[8px] text-[#333333] font-bold whitespace-nowrap"
              >
                01026215 MSP 1318
              </div>

              {/* Mail Routing String */}
              <div style={{ position: 'absolute', left: '64px', top: '138px', fontFamily: '"Courier New", Courier, monospace' }} className="text-[11px] font-bold text-[#111111] tracking-wider">
                &gt;001833 7020553 0001 93707 10Z 3
              </div>

              {/* Customer Address Block */}
              <div style={{ position: 'absolute', left: '64px', top: '160px', fontFamily: '"Courier New", Courier, monospace' }} className="text-[11px] leading-[15px] text-[#111111] uppercase font-bold tracking-tight">
                <div>{customerInfo.name || 'ONE WEST MEDICAL GROUP, INC.'}</div>
                {customerInfo.subName && <div>{customerInfo.subName}</div>}
                <div>{customerInfo.address || '8920 WILSHIRE BLVD STE 301'}</div>
                <div>{customerInfo.cityStateZip || 'BEVERLY HILLS CA 90211-3207'}</div>
              </div>

              {/* USPS Intelligent Mail Barcode */}
              <div style={{ position: 'absolute', left: '64px', top: '246px' }}>
                <UspsIntelligentMailBarcode className="h-[15px] w-[238px]" color="#111111" />
              </div>

              {/* Managing Your Accounts Rounded Card */}
              <div
                style={{ position: 'absolute', left: '468px', top: '92px', width: '304px', height: '166px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                className="border-[1.8px] border-[#1e3a68] rounded-[22px] p-[13px] bg-white"
              >
                <div className="text-[16px] font-bold italic text-[#1e3a68] mb-[8px]">
                  Managing Your Accounts
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className="text-[11.5px]">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', flexShrink: 0 }}>
                      <BranchVectorIcon className="w-[19px] h-[19px]" />
                    </div>
                    <div style={{ width: '92px', color: '#111111', flexShrink: 0, fontWeight: 600 }}>Branch</div>
                    <div style={{ color: '#111111', fontWeight: 500 }}>{institution.branchName || 'Wilshire'}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', flexShrink: 0 }}>
                      <PhoneVectorIcon className="w-[19px] h-[19px]" />
                    </div>
                    <div style={{ width: '92px', color: '#111111', flexShrink: 0, fontWeight: 600 }}>Phone Number</div>
                    <div style={{ color: '#111111', fontWeight: 500 }}>{institution.branchPhone || '213-201-3300'}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', flexShrink: 0, paddingTop: '1px' }}>
                      <MailboxVectorIcon className="w-[19px] h-[19px]" />
                    </div>
                    <div style={{ width: '92px', color: '#111111', flexShrink: 0, fontWeight: 600 }}>Mailing Address</div>
                    <div style={{ color: '#111111', lineHeight: '1.25', fontWeight: 500 }}>
                      <div>3580 Wilshire Blvd Suite 101</div>
                      <div>Los Angeles CA 90010</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '32px', flexShrink: 0 }}>
                      <LaptopVectorIcon className="w-[19px] h-[19px]" />
                    </div>
                    <div style={{ width: '92px', color: '#111111', flexShrink: 0, fontWeight: 600 }}>Online Access</div>
                    <div style={{ color: '#111111', fontWeight: 500 }}>{institution.website || 'www.usmetrobank.com'}</div>
                  </div>
                </div>
              </div>

              {/* 2D DataMatrix Tracking Barcode */}
              <div style={{ position: 'absolute', left: '18px', top: '324px' }}>
                <DataMatrix2DBarcode size={26} color="#111111" />
              </div>

              {/* Promotional Banner Box */}
              <div
                style={{ position: 'absolute', left: '54px', top: '320px', width: '722px', height: '270px', display: 'flex', alignItems: 'center' }}
              >
                <div style={{ width: '195px', height: '260px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={couplePhoto} alt="" className="w-full h-full object-cover" />
                </div>

                <div style={{ flex: 1, paddingLeft: '28px', paddingRight: '20px' }}>
                  <div style={{ fontFamily: 'Georgia, serif' }} className="text-[26px] leading-[30px] text-[#111111] mb-[12px]">
                    Introducing your <span className="font-bold">NEW</span><br />monthly statement
                  </div>

                  <p style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-[12px] leading-[17px] text-[#111111] font-medium mb-[16px]">
                    We are pleased to introduce a new look to your monthly statement from US Metro Bank. The new statement is designed to make it easier for you to review your accounts, whether you receive it by mail or via eStatement. Please visit our website to learn more about our online and mobile banking solutions.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Arial, Helvetica, sans-serif' }} className="text-[12px] text-[#111111] font-medium">
                    <div>
                      Visit us online at <span className="text-[#b83232] font-bold">{institution.website || 'www.usmetrobank.com'}</span><br />
                      or call <span className="text-[#b83232] font-bold">714-620-8888</span> to learn more.
                    </div>
                    <div style={{ flexShrink: 0, paddingRight: '8px' }}>
                      <UsMetroLogo className="h-[16px]" />
                    </div>
                  </div>
                </div>

                <div style={{ width: '8px', height: '255px', backgroundColor: '#1e293b', flexShrink: 0, borderRadius: '1px' }}></div>
              </div>

              {/* Summary of Accounts Box */}
              <div
                style={{ position: 'absolute', left: '56px', top: '614px', width: '708px', height: '82px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                className="border-[1.8px] border-[#1e3a68] rounded-[16px] p-[10px] bg-white"
              >
                <div className="text-[15px] font-bold italic text-[#1e3a68] mb-[4px]">
                  Summary of Accounts
                </div>
                <div className="grid grid-cols-12 font-bold text-[#1e3a68] border-b border-[#1e3a68]/40 pb-[3px] mb-[4px] text-[11px]">
                  <div className="col-span-6 tracking-wide">Account Type</div>
                  <div className="col-span-3 text-center tracking-wide">Account Number</div>
                  <div className="col-span-3 text-right tracking-wide">Ending Balance</div>
                </div>
                <div className="grid grid-cols-12 text-[11px] text-[#111111] pt-[2px]">
                  <div className="col-span-6 font-bold uppercase tracking-tight">{account.type || 'ANALYZED BUSINESS CHECKING'}</div>
                  <div className="col-span-3 text-center font-bold tracking-tight">{account.accountNumber || 'XXXXXX8501'}</div>
                  <div className="col-span-3 text-right font-bold tracking-tight">${endingBal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>

              {/* Account Title Header Bar */}
              <div
                style={{ position: 'absolute', left: '56px', top: '710px', width: '708px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                className="pb-[2px] border-b-[2.5px] border-[#1e3a68]"
              >
                <span className="font-bold text-[15px] uppercase tracking-normal text-[#1e3a68]">
                  {account.type || 'ANALYZED BUSINESS CHECKING'} - {account.accountNumber || 'XXXXXX8501'}
                </span>
              </div>

              {/* Account Summary Section (Left Half Width) */}
              <div style={{ position: 'absolute', left: '56px', top: '736px', width: '400px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                <div className="text-[12px] font-bold text-[#111111] mb-[2px]">
                  Account Summary
                </div>
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#111111] text-[#111111] font-bold">
                      <th className="py-[1.5px] w-[100px] font-bold">Date</th>
                      <th className="py-[1.5px] font-bold">Description</th>
                      <th className="py-[1.5px] text-right w-[110px] font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-medium text-[#111111]">
                      <td className="py-[1.5px] font-bold">{formattedStartDate}</td>
                      <td className="py-[1.5px]">Beginning Balance</td>
                      <td className="py-[1.5px] text-right font-bold">${startingBal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="text-[#111111]">
                      <td className="py-[1.5px]"></td>
                      <td className="py-[1.5px]">{totalCreditsCount} Credit(s) This Period</td>
                      <td className="py-[1.5px] text-right font-bold">${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="text-[#111111]">
                      <td className="py-[1.5px]"></td>
                      <td className="py-[1.5px]">{totalDebitsCount} Debit(s) This Period</td>
                      <td className="py-[1.5px] text-right font-bold">${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="font-bold text-[#111111]">
                      <td className="py-[1.5px]">{formattedEndDate}</td>
                      <td className="py-[1.5px]">Ending Balance</td>
                      <td className="py-[1.5px] text-right">${endingBal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transaction Detail: Deposits / Credits on Page 1 */}
              <div style={{ position: 'absolute', left: '56px', top: '850px', width: '708px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                <div className="text-[12px] font-bold text-[#111111] mb-[2px]">
                  Deposits
                </div>
                <table className="w-full text-left text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#111111] text-[#111111] font-bold">
                      <th className="py-[1.5px] w-[100px] font-bold">Date</th>
                      <th className="py-[1.5px] font-bold">Description</th>
                      <th className="py-[1.5px] text-right w-[130px] font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((tx, idx) => (
                      <tr key={idx} className="font-medium text-[#111111]">
                        <td className="py-[1px] font-bold">{formatMDY(tx.date)}</td>
                        <td className="py-[1px] uppercase truncate max-w-[430px]">{tx.description}</td>
                        <td className="py-[1px] text-right font-bold">${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right text-[10px] text-[#111111] font-medium border-t border-[#111111] pt-[1px]">
                  {deposits.length} item(s) totaling ${deposits.reduce((a, t) => a + Math.abs(t.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Page 1 Footer: FDIC & Equal Housing Lender Logos */}
              <div style={{ position: 'absolute', left: '72px', top: '978px' }}>
                <FdicLogo className="h-[20px]" color="#274D7E" showSubtext={true} />
              </div>
              <div style={{ position: 'absolute', left: '592px', top: '970px' }}>
                <EqualHousingLenderLogo className="h-[30px]" color="#274D7E" />
              </div>
            </div>

            {/* ========================================================
                PAGE 2: EXACT 8.5" x 11" LETTER CANVAS (816px x 1056px)
                TRANSACTIONS CONTINUATION: OTHER CREDITS, DEBITS, OTHER DEBITS, DAILY BALANCES, FEES
                ======================================================== */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden select-none"
              style={{ width: '816px', height: '1056px', fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              {/* Top Header */}
              <div style={{ position: 'absolute', right: '48px', top: '38px', textAlign: 'right' }}>
                <span className="text-[12.5px] font-bold text-[#111111] mr-[68px]">
                  Statement Ending {formattedEndDate}
                </span>
                <span className="text-[12.5px] font-bold text-[#111111]">
                  Page 2 of 4
                </span>
              </div>

              {/* Top Header Divider Line */}
              <div style={{ position: 'absolute', left: '56px', top: '64px', width: '708px', height: '2px', backgroundColor: '#111111' }}></div>

              {/* Account Title Continuation Bar */}
              <div
                style={{ position: 'absolute', left: '56px', top: '78px', width: '708px' }}
                className="pb-[4px] border-b-[2.5px] border-[#1e3a68]"
              >
                <span className="font-bold text-[15px] uppercase tracking-normal text-[#1e3a68]">
                  {account.type || 'ANALYZED BUSINESS CHECKING'} - {account.accountNumber || 'XXXXXX8501'} <span className="font-bold text-[13px] text-[#1e3a68] lowercase">(continued)</span>
                </span>
              </div>

              {/* Other Credits (ACH Payouts, Patient Financing, Interest) */}
              {otherCredits.length > 0 && (
                <div style={{ position: 'absolute', left: '56px', top: '116px', width: '708px' }}>
                  <div className="text-[11.5px] font-bold text-[#111111] mb-[3px]">
                    Other Credits
                  </div>
                  <table className="w-full text-left text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#111111] text-[#111111] font-bold">
                        <th className="py-[1px] w-[95px] font-bold">Date</th>
                        <th className="py-[1px] font-bold">Description</th>
                        <th className="py-[1px] text-right w-[120px] font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherCredits.map((tx, idx) => (
                        <tr key={idx} className="font-medium text-[#111111]">
                          <td className="py-[1px] font-bold">{formatMDY(tx.date)}</td>
                          <td className="py-[1px] uppercase truncate max-w-[450px]">{tx.description}</td>
                          <td className="py-[1px] text-right font-bold">${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right text-[9.5px] text-[#111111] font-medium border-t border-[#111111] pt-[1px]">
                    {otherCredits.length} item(s) totaling ${otherCredits.reduce((a, t) => a + Math.abs(t.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {/* Primary Debits (Lease, Malpractice, Direct Vendors) */}
              {debits.length > 0 && (
                <div style={{ position: 'absolute', left: '56px', top: '298px', width: '708px' }}>
                  <div className="text-[11.5px] font-bold text-[#111111] mb-[3px]">
                    Debits
                  </div>
                  <table className="w-full text-left text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#111111] text-[#111111] font-bold">
                        <th className="py-[1px] w-[95px] font-bold">Date</th>
                        <th className="py-[1px] font-bold">Description</th>
                        <th className="py-[1px] text-right w-[120px] font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debits.map((tx, idx) => (
                        <tr key={idx} className="font-medium text-[#111111]">
                          <td className="py-[1px] font-bold">{formatMDY(tx.date)}</td>
                          <td className="py-[1px] uppercase truncate max-w-[450px]">{tx.description}</td>
                          <td className="py-[1px] text-right font-bold">${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right text-[9.5px] text-[#111111] font-medium border-t border-[#111111] pt-[1px]">
                    {debits.length} item(s) totaling ${debits.reduce((a, t) => a + Math.abs(t.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {/* Other Debits (SaaS, Biohazard Waste, Lab Services, Utilities) */}
              {otherDebits.length > 0 && (
                <div style={{ position: 'absolute', left: '56px', top: '430px', width: '708px' }}>
                  <div className="text-[11.5px] font-bold text-[#111111] mb-[3px]">
                    Other Debits
                  </div>
                  <table className="w-full text-left text-[9.5px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#111111] text-[#111111] font-bold">
                        <th className="py-[1px] w-[95px] font-bold">Date</th>
                        <th className="py-[1px] font-bold">Description</th>
                        <th className="py-[1px] text-right w-[120px] font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherDebits.map((tx, idx) => (
                        <tr key={idx} className="font-medium text-[#111111]">
                          <td className="py-[1px] font-bold">{formatMDY(tx.date)}</td>
                          <td className="py-[1px] uppercase truncate max-w-[450px]">{tx.description}</td>
                          <td className="py-[1px] text-right font-bold">${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right text-[9.5px] text-[#111111] font-medium border-t border-[#111111] pt-[1px]">
                    {otherDebits.length} item(s) totaling ${otherDebits.reduce((a, t) => a + Math.abs(t.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {/* Daily Balances Section */}
              <div style={{ position: 'absolute', left: '56px', top: '562px', width: '335px' }}>
                <div className="text-[11.5px] font-bold text-[#111111] mb-[3px]">
                  Daily Balances
                </div>
                <table className="w-full text-left text-[9.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#111111] text-[#111111] font-bold">
                      <th className="py-[1.5px] w-[130px] font-bold">Date</th>
                      <th className="py-[1.5px] text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyEntries.slice(0, 10).map(([d, b], idx) => (
                      <tr key={idx} className="font-medium text-[#111111]">
                        <td className="py-[1px] font-bold">{formatMDY(d)}</td>
                        <td className="py-[1px] text-right font-bold">${Number(b).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overdraft and Returned Item Fees Framed Grid */}
              <div style={{ position: 'absolute', left: '56px', top: '780px', width: '708px' }}>
                <div className="text-[11.5px] font-bold text-[#111111] mb-[3px]">
                  Overdraft and Returned Item Fees
                </div>
                <table className="w-full border-[1.8px] border-[#1e3a68] text-left text-[10.5px] border-collapse">
                  <thead>
                    <tr className="border-b-[1.8px] border-[#1e3a68] bg-white font-bold text-[#111111]">
                      <th className="py-[3px] px-[8px] border-r-[1.8px] border-[#1e3a68]"></th>
                      <th className="py-[3px] px-[8px] text-center border-r-[1.8px] border-[#1e3a68] w-[200px] font-bold">Total for this period</th>
                      <th className="py-[3px] px-[8px] text-center w-[200px] font-bold">Total year-to-date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-[1.8px] divide-[#1e3a68]">
                    <tr>
                      <td className="py-[3px] px-[8px] border-r-[1.8px] border-[#1e3a68] font-bold text-[#111111]">Total Overdraft Fees</td>
                      <td className="py-[3px] px-[8px] text-right border-r-[1.8px] border-[#1e3a68] font-bold text-[#111111] pr-4">$0.00</td>
                      <td className="py-[3px] px-[8px] text-right font-bold text-[#111111] pr-4">$0.00</td>
                    </tr>
                    <tr>
                      <td className="py-[3px] px-[8px] border-r-[1.8px] border-[#1e3a68] font-bold text-[#111111]">Total Returned Item Fees</td>
                      <td className="py-[3px] px-[8px] text-right border-r-[1.8px] border-[#1e3a68] font-bold text-[#111111] pr-4">$0.00</td>
                      <td className="py-[3px] px-[8px] text-right font-bold text-[#111111] pr-4">$0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2D DataMatrix Tracking Barcode on Page 2 */}
              <div style={{ position: 'absolute', left: '26px', top: '880px' }}>
                <DataMatrix2DBarcode size={28} color="#111111" />
              </div>
            </div>

            {/* ========================================================
                PAGE 3: EXACT 8.5" x 11" LETTER CANVAS (816px x 1056px)
                CHECKBOOK RECONCILIATION LEDGER, 30-DAY NOTICE, CHECKBOXES & DISCLOSURES
                ======================================================== */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden select-none"
              style={{ width: '816px', height: '1056px', fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              {/* Side vertical print run tracking string */}
              <div
                style={{ position: 'absolute', left: '32px', top: '394px', transform: 'rotate(-90deg)', transformOrigin: 'bottom left', fontFamily: '"Courier New", Courier, monospace', width: '280px' }}
                className="text-[7.5px] font-bold text-[#111111] whitespace-nowrap"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>CSTMTADV 1071 0001 124 07 {batchCode} PG 1 OF 2</span>
                  <span>0-0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1px' }}>
                  <span>01026215</span>
                  <span>56707624.14</span>
                </div>
              </div>

              {/* Top Header */}
              <div style={{ position: 'absolute', right: '48px', top: '38px', textAlign: 'right' }}>
                <span className="text-[12.5px] font-bold text-[#111111] mr-[68px]">
                  Statement Ending {formattedEndDate}
                </span>
                <span className="text-[12.5px] font-bold text-[#111111]">
                  Page 3 of 4
                </span>
              </div>

              {/* Top Header Divider Line */}
              <div style={{ position: 'absolute', left: '56px', top: '64px', width: '708px', height: '2px', backgroundColor: '#111111' }}></div>

              {/* Checkbook Reconciliation Grid (Top Box) */}
              <div
                style={{ position: 'absolute', left: '56px', top: '78px', width: '708px' }}
                className="border-[1.8px] border-[#1e3a68] text-[9px]"
              >
                {/* Header Row */}
                <div className="grid grid-cols-12 border-b-[1.8px] border-[#1e3a68] bg-white text-[#1e3a68]">
                  <div className="col-span-8 font-extrabold text-center py-[2px] border-r-[1.8px] border-[#1e3a68] text-[10px] tracking-wide">
                    CHECKS OUTSTANDING
                  </div>
                  <div className="col-span-4 font-extrabold text-center py-[2px] text-[10px] tracking-wide">
                    CHECKBOOK RECONCILIATION
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  {/* Left: Checks Outstanding columns */}
                  <div className="col-span-8 border-r-[1.8px] border-[#1e3a68]">
                    <div className="grid grid-cols-3 border-b-[1.8px] border-[#1e3a68] font-bold text-[8.5px] text-[#111111]">
                      <div className="grid grid-cols-2 border-r-[1.8px] border-[#1e3a68] px-1 py-[1.5px]">
                        <div>DATE OR #</div>
                        <div className="text-right">AMOUNT</div>
                      </div>
                      <div className="grid grid-cols-2 border-r-[1.8px] border-[#1e3a68] px-1 py-[1.5px]">
                        <div>DATE OR #</div>
                        <div className="text-right">AMOUNT</div>
                      </div>
                      <div className="grid grid-cols-2 px-1 py-[1.5px]">
                        <div>DATE OR #</div>
                        <div className="text-right">AMOUNT</div>
                      </div>
                    </div>

                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="grid grid-cols-3 border-b border-[#1e3a68]/40 h-[17px]">
                        <div className="grid grid-cols-2 border-r-[1.8px] border-[#1e3a68] h-full">
                          <div className="border-r border-dashed border-[#1e3a68]/50"></div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-2 border-r-[1.8px] border-[#1e3a68] h-full">
                          <div className="border-r border-dashed border-[#1e3a68]/50"></div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-2 h-full">
                          <div className="border-r border-dashed border-[#1e3a68]/50"></div>
                          <div></div>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 h-[20px] bg-white">
                      <div className="border-r-[1.8px] border-[#1e3a68]"></div>
                      <div className="grid grid-cols-2 border-r-[1.8px] border-[#1e3a68] items-center">
                        <div></div>
                        <div className="text-right font-extrabold pr-1 text-[9px] text-[#111111]">TOTAL</div>
                      </div>
                      <div className="px-1 text-[9px] font-bold text-[#111111] flex items-center">
                        $
                      </div>
                    </div>
                  </div>

                  {/* Right: Checkbook Reconciliation math rows */}
                  <div className="col-span-4 flex flex-col justify-between text-[9px] text-[#111111]">
                    <div className="px-[6px] py-[4px] border-b-[1.8px] border-[#1e3a68] flex justify-between items-center h-[42px]">
                      <div className="font-bold leading-[11px] w-[130px] uppercase">
                        <span className="font-extrabold">ENTER</span> BALANCE THIS STATEMENT
                      </div>
                      <div className="font-bold flex items-center pr-2">$</div>
                    </div>

                    <div className="px-[6px] py-[4px] border-b-[1.8px] border-[#1e3a68] flex justify-between items-start h-[56px]">
                      <div className="font-bold leading-[11px] w-[130px] uppercase">
                        <span className="font-extrabold">ADD</span> RECENT DEPOSITS<br />
                        <span className="font-semibold text-[8px]">(NOT CREDITED ON THIS STATEMENT)</span>
                      </div>
                      <div className="font-bold pt-[18px] pr-2">$</div>
                    </div>

                    <div className="px-[6px] py-[3px] border-b-[1.8px] border-[#1e3a68] font-extrabold text-center text-[10px] uppercase tracking-wider h-[22px] flex items-center justify-center">
                      SUBTOTAL
                    </div>

                    <div className="px-[6px] py-[4px] border-b-[1.8px] border-[#1e3a68] flex justify-between items-center h-[44px]">
                      <div className="font-bold leading-[11px] w-[130px] uppercase flex items-center gap-1">
                        <span className="text-[12px]">&#x21E8;</span>
                        <div>
                          <span className="font-extrabold block text-[8px]">SUBTRACT</span>
                          TOTAL CHECKS OUTSTANDING
                        </div>
                      </div>
                      <div className="font-bold flex items-center pr-2">$</div>
                    </div>

                    <div className="px-[6px] py-[4px] flex justify-between items-center h-[44px]">
                      <div className="font-extrabold text-[10.5px] uppercase tracking-wide">
                        BALANCE
                      </div>
                      <div className="font-bold flex items-center pr-2">$</div>
                    </div>
                  </div>
                </div>

                <div className="border-t-[1.8px] border-[#1e3a68] p-[4px] text-[8px] leading-[11px] text-[#111111] bg-white">
                  <div>
                    <span className="font-extrabold">BALANCE</span> should agree with your checkbook balance after deducting charges and adding credits not shown in your checkbook but included on this statement as follows:
                  </div>
                  <div className="font-bold mt-[2px]">
                    Interest–ADD &nbsp;&nbsp;&nbsp;&nbsp; Overdraft–DEDUCT &nbsp;&nbsp;&nbsp;&nbsp; Automatic Payment–DEDUCT &nbsp;&nbsp;&nbsp;&nbsp; Service charge–DEDUCT
                  </div>
                </div>
              </div>

              {/* 30-Day Notice */}
              <div style={{ position: 'absolute', left: '56px', top: '372px', width: '708px' }} className="text-[8px] font-bold leading-[11.5px] text-[#111111]">
                <div>PLEASE REPORT ANY ERRORS OR OMISSIONS WITHIN 30 DAYS, OTHERWISE STATEMENT WILL BE CONSIDERED CORRECT AND CHECKS GENUINE.</div>
                <div>ALL DEPOSITS AND CREDITS ARE SUBJECT TO FINAL PAYMENT.</div>
                <div className="text-[7.5px] font-medium text-[#444444] mt-[1px]">* Printed check charges include tax and shipping.</div>
              </div>

              {/* 4 Balancing Checkboxes */}
              <div
                style={{ position: 'absolute', left: '56px', top: '410px', width: '708px' }}
                className="flex items-start justify-between text-[8px] leading-[10.5px] text-[#111111]"
              >
                <div style={{ width: '130px', fontWeight: 600 }}>
                  If your checkbook and statement<br />do not balance, have you:
                </div>
                <div className="flex items-center gap-[6px]" style={{ width: '130px' }}>
                  <div className="w-[12px] h-[12px] border-[1.2px] border-[#111111] flex-shrink-0"></div>
                  <div>Accounted for<br />bank charges?</div>
                </div>
                <div className="flex items-center gap-[6px]" style={{ width: '145px' }}>
                  <div className="w-[12px] h-[12px] border-[1.2px] border-[#111111] flex-shrink-0"></div>
                  <div>Verified additions and sub-<br />tractions in your checkbook?</div>
                </div>
                <div className="flex items-center gap-[6px]" style={{ width: '135px' }}>
                  <div className="w-[12px] h-[12px] border-[1.2px] border-[#111111] flex-shrink-0"></div>
                  <div>Compared cancelled<br />checks to check stub?</div>
                </div>
                <div className="flex items-center gap-[6px]" style={{ width: '145px' }}>
                  <div className="w-[12px] h-[12px] border-[1.2px] border-[#111111] flex-shrink-0"></div>
                  <div>Compared deposit amounts on<br />statement to your checkbook?</div>
                </div>
              </div>

              {/* Electronic Transfers Error Notice & Funds Availability */}
              <div
                style={{ position: 'absolute', left: '56px', top: '456px', width: '708px', height: '264px' }}
                className="border-[1.8px] border-[#1e3a68] p-[10px] text-[8.5px] leading-[12px] text-[#111111] bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="font-extrabold text-center text-[10px] mb-[6px] text-[#1e3a68] uppercase tracking-wide">
                    IN CASE OF ERRORS OR QUESTIONS ABOUT YOUR ELECTRONIC TRANSFERS
                  </div>
                  
                  <p className="mb-[6px]">
                    Telephone us at <span className="font-bold">(714) 620-8888</span> or write us at <span className="font-bold">9866 Garden Grove Blvd, Garden Grove, CA 92844</span> as soon as you can, if you think your statement or receipt is wrong or if you need more information about a transfer on the statement or receipt. We must hear from you no later than 60 days after we sent you the FIRST statement on which the error or problem appears.
                  </p>

                  <div className="pl-[24px] space-y-[2px] mb-[6px]">
                    <div>(1) Tell us your name and account number (if any).</div>
                    <div>(2) Describe the error or the transfer you are unsure about and explain as clearly as you can why you believe it is an error or why you need more information.</div>
                    <div>(3) Tell us the dollar amount of the suspected error.</div>
                  </div>

                  <p>
                    For consumer account used primarily for personal, family or household purposes, we will investigate your complaint and will correct any error promptly. If we take more than 10 business day to do this (or 20 days for new accounts), we will credit your account for the amount you think is in error, so that you will have the use of the money during the time it takes us to complete our investigation.
                  </p>
                </div>

                <div className="border-t-[1.8px] border-[#1e3a68] pt-[6px]">
                  <div className="font-extrabold text-center text-[10px] mb-[3px] text-[#1e3a68] uppercase tracking-wide">
                    FUNDS AVAILABILITY
                  </div>
                  <p>
                    A hold for uncollected funds may be placed on funds deposited by check or similar instruments. This could delay your ability to withdraw such funds. The delay, if any, would not exceed the period of time permitted by law. For a complete copy of US Metro Bank's Funds Availability Policy, please contact our office or write to us at the address shown on the front of this statement.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================
                PAGE 4: EXACT 8.5" x 11" LETTER CANVAS (816px x 1056px)
                FINAL BACK PAGE: THIS PAGE LEFT INTENTIONALLY BLANK
                ======================================================== */}
            <div
              className="statement-page relative bg-white mx-auto print:border-none overflow-hidden select-none"
              style={{ width: '816px', height: '1056px', fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              {/* Side vertical tracking code on Page 4 */}
              <div
                style={{ position: 'absolute', left: '32px', top: '394px', transform: 'rotate(-90deg)', transformOrigin: 'bottom left', fontFamily: '"Courier New", Courier, monospace', width: '280px' }}
                className="text-[7.5px] font-bold text-[#111111] whitespace-nowrap"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>CSTMTADV 1071 0001 124 07 {batchCode} PG 2 OF 2</span>
                  <span>0-0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1px' }}>
                  <span>01026215</span>
                  <span>56707624.14</span>
                </div>
              </div>

              {/* Top Header */}
              <div style={{ position: 'absolute', right: '48px', top: '38px', textAlign: 'right' }}>
                <span className="text-[12.5px] font-bold text-[#111111] mr-[68px]">
                  Statement Ending {formattedEndDate}
                </span>
                <span className="text-[12.5px] font-bold text-[#111111]">
                  Page 4 of 4
                </span>
              </div>

              {/* Top Header Divider Line */}
              <div style={{ position: 'absolute', left: '56px', top: '64px', width: '708px', height: '2px', backgroundColor: '#111111' }}></div>

              {/* Centered Notice matching exact position from master scan */}
              <div style={{ position: 'absolute', left: '0px', top: '331px', width: '100%', textAlign: 'center' }}>
                <div className="text-[13.5px] font-normal tracking-[0.04em] text-[#111111] uppercase font-sans">
                  THIS PAGE LEFT INTENTIONALLY BLANK
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}


