import React from 'react';
import authenticLogo from '../../assets/us_fed_logo_authentic.png';
import authenticYouthPromo from '../../assets/us_fed_youth_promo_authentic.png';
import { US1364_CREDIT_UNION_DATA } from '../../data/us1364CreditUnionData';

/**
 * 1:1 Pixel-Perfect Authentic Replica of US 1364 Federal Credit Union Statement
 * Faithfully matches US_1364_Federal_Credit_Union_Statement_November_2024.pdf.
 * Standard Letter Canvas (816px x 1056px per page canvas).
 */
export default function US1364CreditUnionTemplate({
  _institution = US1364_CREDIT_UNION_DATA.institution,
  customerInfo = US1364_CREDIT_UNION_DATA.customerInfo,
  statementMeta = US1364_CREDIT_UNION_DATA.statementMeta,
  _account = {},
  _totals = {},
  _transactions = [],
  statements = null
}) {
  const data = US1364_CREDIT_UNION_DATA;
  const statementsList = (statements && Array.isArray(statements) && statements.length > 0)
    ? statements
    : [{
        statementMeta,
        customerInfo,
        regularSavings: data.accounts.regularSavings,
        shareDraft: data.accounts.shareDraft,
        summaryOfAccounts: data.summaryOfAccounts,
        statementSummary: data.statementSummary
      }];

  // Currency helper
  const fmt = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '';
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="us1364-statement-container text-black font-sans select-none bg-white">
      {statementsList.map((stmt, sIdx) => {
        const curMeta = stmt.statementMeta || statementMeta;
        const curCustomer = stmt.customerInfo || customerInfo;
        const regSavings = stmt.regularSavings || data.accounts.regularSavings;
        const shareDraft = stmt.shareDraft || data.accounts.shareDraft;
        const summaryOfAccounts = stmt.summaryOfAccounts || data.summaryOfAccounts;
        const statementSummary = stmt.statementSummary || data.statementSummary;

        const summaryAccounts = Array.isArray(statementSummary)
          ? statementSummary
          : (statementSummary?.accounts || []);
        const totalDividendsVal = statementSummary?.totalDividendsYtd !== undefined
          ? statementSummary.totalDividendsYtd
          : (stmt.totalDividendsYtd !== undefined ? stmt.totalDividendsYtd : (regSavings.dividendsYtd || 0.00));

        const acct1Dividends = summaryAccounts[0]?.dividendsYtd ?? regSavings.dividendsYtd ?? 0.00;
        const acct2Dividends = summaryAccounts[1]?.dividendsYtd ?? shareDraft.dividendsYtd ?? 0.00;

        const allDraftTx = shareDraft.transactions || [];
        const p1Tx = shareDraft.page1Transactions || (allDraftTx.length > 0 ? allDraftTx.slice(0, 5) : []);
        const p2Tx = shareDraft.page2Transactions || (allDraftTx.length > 0 ? allDraftTx.slice(p1Tx.length) : []);

        const totalPages = statementsList.length * 2;
        const p1Label = `${sIdx * 2 + 1} of ${totalPages}`;
        const p2Label = `${sIdx * 2 + 2} of ${totalPages}`;

        return (
          <React.Fragment key={sIdx}>
            {/* ========================================================================= */}
            {/* PAGE 1 (816px x 1056px Letter Canvas) */}
            {/* ========================================================================= */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden"
              style={{ width: '816px', height: '1056px', position: 'relative', boxSizing: 'border-box' }}
            >
              {/* --- PAGE 1 CONTENT LAYER --- */}
              <div className="relative w-full h-full" style={{ padding: '0 28px' }}>
                
                {/* TOP HEADER ROW: Left Authentic Logo & Right STATEMENT OF ACCOUNTS pill */}
                <div style={{ paddingTop: '36px' }} className="flex justify-between items-start">
                  <div className="pl-1">
                    <img
                      src={authenticLogo}
                      alt="US 1364 Federal Credit Union"
                      style={{ height: '75.5px', width: 'auto', display: 'block' }}
                    />
                  </div>
                  <div style={{ paddingRight: '28px', paddingTop: '4px' }}>
                    <div
                      style={{
                        backgroundColor: '#003892',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        width: '307px',
                        height: '29.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}
                    >
                      STATEMENT OF ACCOUNTS
                    </div>
                  </div>
                </div>

                {/* SECOND ROW: 2-Column Section (Left: Address + Account Info, Right: Youth Promo) */}
                <div style={{ marginTop: '24px' }} className="flex justify-between items-start">
                  {/* Left Column: Member Mailing Address + Account Information Card */}
                  <div style={{ width: '368px', height: '248px' }} className="flex flex-col justify-between">
                    {/* Member Mailing Address - positioned for authentic window envelope visibility */}
                    <div style={{ paddingLeft: '40px', paddingTop: '28px' }}>
                      <div className="text-[10px] font-mono text-slate-400 mb-2" style={{ paddingLeft: '110px' }}>
                        {curCustomer.microCode || ''}
                      </div>
                      <div className="text-[11px] leading-[15px] font-normal text-black tracking-tight uppercase">
                        <div>{curCustomer.name || ''}</div>
                        <div>{curCustomer.address || ''}</div>
                        <div>{curCustomer.cityStateZip || ''}</div>
                      </div>
                    </div>

                    {/* ACCOUNT INFORMATION CARD - bottom aligned with Youth Promo card */}
                    <div style={{ width: '368px' }}>
                      <div
                        style={{
                          border: '1.5px solid #0e64ff',
                          borderRadius: '16px',
                          padding: '3px 12px 6px 12px',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#0e64ff',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: '10.5px',
                            letterSpacing: '0.4px',
                            padding: '2px 0',
                            marginBottom: '4px'
                          }}
                        >
                          ACCOUNT INFORMATION
                        </div>
                        <div className="text-[10.5px] leading-[16px] text-black">
                          <div className="flex justify-between">
                            <span className="font-normal">Member Number:</span>
                            <span className="font-bold">{curCustomer.memberNumber || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-normal">Ending Date:</span>
                            <span className="font-bold">{curMeta.displayEndingDate || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-normal">Page:</span>
                            <span className="font-bold">{p1Label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Authentic Youth Savings Advertising Card */}
                  <div>
                    <div
                      style={{
                        width: '354px',
                        height: '249.6px',
                        overflow: 'hidden',
                        borderRadius: '2px'
                      }}
                    >
                      <img
                        src={authenticYouthPromo}
                        alt="US 1364 Youth Savings Promotion"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'fill',
                          display: 'block'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* MESSAGE TO MEMBERS CARD (Full width) */}
                <div style={{ marginTop: '11px' }} className="w-full">
                  <div
                    style={{
                      border: '1.5px solid #0e64ff',
                      borderRadius: '16px',
                      padding: '3px 14px 6px 14px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#0e64ff',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '10.5px',
                        letterSpacing: '0.4px',
                        padding: '2px 0',
                        marginBottom: '4px'
                      }}
                    >
                      MESSAGE TO MEMBERS
                    </div>
                    <div className="text-center text-[10px] leading-[14px] text-black font-bold">
                      <div>Make your dream a reality</div>
                      <div>With a Home Equity Loan</div>
                      <div>Always .25% APR below prime</div>
                      <div>No closing costs or annual fees!</div>
                    </div>
                  </div>
                </div>

                {/* SUMMARY OF ACCOUNTS CARD (Full width, left-grouped content) */}
                <div style={{ marginTop: '7px' }} className="w-full">
                  <div
                    style={{
                      border: '1.5px solid #0e64ff',
                      borderRadius: '16px',
                      padding: '3px 14px 6px 14px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#0e64ff',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '10.5px',
                        letterSpacing: '0.4px',
                        padding: '2px 0',
                        marginBottom: '4px'
                      }}
                    >
                      SUMMARY OF ACCOUNTS
                    </div>
                    {/* Content grouped strictly in the left half, exactly matching authentic PDF */}
                    <div className="text-[10px] leading-[14px] text-black" style={{ maxWidth: '360px' }}>
                      <div className="flex justify-between px-2 font-normal">
                        <span>REGULAR SAVINGS</span>
                        <span className="w-28 text-right font-mono">{fmt(summaryOfAccounts.regularSavings)}</span>
                      </div>
                      <div className="flex justify-between px-2 font-normal">
                        <span>SHARE DRAFT</span>
                        <span className="w-28 text-right font-mono flex justify-end">
                          <span className="border-b border-black pb-[0.5px]">{fmt(summaryOfAccounts.shareDraft)}</span>
                        </span>
                      </div>
                      <div className="flex justify-between px-2 pt-[1px] font-bold">
                        <span>TOTAL SHARE BALANCES:</span>
                        <span className="w-28 text-right font-mono">{fmt(summaryOfAccounts.totalShareBalances)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- TABLE 1: REGULAR SAVINGS ACCT# --- */}
                <div style={{ marginTop: '10px' }} className="w-full">
                  {/* Account Banner Row */}
                  <div className="flex justify-between items-baseline font-bold text-[12px] tracking-tight pb-0.5 px-0.5 text-black">
                    <span className="font-bold">{regSavings.title}</span>
                    <span className="font-bold">ACCT# {regSavings.accountNumber}</span>
                    <span className="font-bold">{curMeta.displayPeriod || ''}</span>
                  </div>

                  {/* Table Header Bar */}
                  <div
                    style={{
                      backgroundColor: '#1129a2',
                      color: '#ffffff',
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: '700',
                      letterSpacing: '0.3px',
                      alignItems: 'center',
                      height: '15px'
                    }}
                  >
                    <div>DATE</div>
                    <div>TRANSACTION DESCRIPTION</div>
                    <div className="text-right">DEPOSIT</div>
                    <div className="text-right">WITHDRAWAL</div>
                    <div className="text-right">BALANCE</div>
                  </div>

                  {/* Previous Balance Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div></div>
                    <div>PREVIOUS BALANCE</div>
                    <div></div>
                    <div></div>
                    <div className="text-right font-mono">{fmt(regSavings.previousBalance)}</div>
                  </div>

                  {/* Regular Savings Transaction Rows */}
                  {regSavings.transactions.map((tx, idx) => {
                    const isAlt = idx % 2 === 0;
                    const isLast = idx === regSavings.transactions.length - 1;
                    return (
                      <React.Fragment key={idx}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '58px 1fr 95px 95px 95px',
                            padding: '1.5px 8px',
                            fontSize: '9.5px',
                            backgroundColor: isAlt ? '#adcbff' : '#ffffff',
                            alignItems: 'start'
                          }}
                        >
                          <div className="font-bold">{tx.date}</div>
                          <div className="pr-2 font-normal">
                            <div>{tx.line1}</div>
                            {tx.line2 && !isLast && (
                              <div className="text-[9px] font-normal">{tx.line2}</div>
                            )}
                          </div>
                          <div className="text-right font-mono font-normal">{tx.deposit ? fmt(tx.deposit) : ''}</div>
                          <div className="text-right font-mono font-normal">{tx.withdrawal ? fmt(tx.withdrawal) : ''}</div>
                          <div className="text-right font-mono font-normal">{tx.balance ? fmt(tx.balance) : ''}</div>
                        </div>

                        {/* Dividend APY Disclosure Row */}
                        {isLast && tx.line2 && (
                          <div
                            style={{
                              padding: '1px 8px 1px 66px',
                              fontSize: '8.5px',
                              fontWeight: 'normal',
                              backgroundColor: '#ffffff',
                              letterSpacing: '0.2px'
                            }}
                          >
                            {tx.line2}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* New Balance Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div></div>
                    <div>NEW BALANCE</div>
                    <div></div>
                    <div></div>
                    <div className="text-right font-mono">{fmt(regSavings.newBalance)}</div>
                  </div>
                </div>

                {/* --- TABLE 2: SHARE DRAFT (Page 1 Section) --- */}
                <div style={{ marginTop: '14px' }} className="w-full">
                  {/* Account Banner Row */}
                  <div className="flex justify-between items-baseline font-bold text-[13px] tracking-tight pb-0.5 px-0.5 text-black">
                    <span className="font-bold">{shareDraft.title}</span>
                    <span className="font-bold">ACCT# {shareDraft.accountNumber}</span>
                    <span className="font-bold">{curMeta.displayPeriod || ''}</span>
                  </div>

                  {/* Table Header Bar */}
                  <div
                    style={{
                      backgroundColor: '#1129a2',
                      color: '#ffffff',
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      letterSpacing: '0.3px',
                      alignItems: 'center',
                      height: '15px'
                    }}
                  >
                    <div>DATE</div>
                    <div>TRANSACTION DESCRIPTION</div>
                    <div className="text-right">DEPOSIT</div>
                    <div className="text-right">WITHDRAWAL</div>
                    <div className="text-right">BALANCE</div>
                  </div>

                  {/* Previous Balance Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div></div>
                    <div>PREVIOUS BALANCE</div>
                    <div></div>
                    <div></div>
                    <div className="text-right font-mono">{fmt(shareDraft.previousBalance)}</div>
                  </div>

                  {/* Share Draft Page 1 Transaction Rows */}
                  {p1Tx.map((tx, idx) => {
                    const isAlt = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '58px 1fr 95px 95px 95px',
                          padding: '1.5px 8px',
                          fontSize: '9.5px',
                          backgroundColor: isAlt ? '#adcbff' : '#ffffff',
                          alignItems: 'start'
                        }}
                      >
                        <div className="font-bold">{tx.date}</div>
                        <div className="pr-2 font-normal">
                          <div>{tx.line1}</div>
                          {tx.line2 && <div className="text-[9px] font-normal">{tx.line2}</div>}
                        </div>
                        <div className="text-right font-mono font-normal">{tx.deposit ? fmt(tx.deposit) : ''}</div>
                        <div className="text-right font-mono font-normal">{tx.withdrawal ? fmt(tx.withdrawal) : ''}</div>
                        <div className="text-right font-mono font-normal">{tx.balance ? fmt(tx.balance) : ''}</div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGE 1 FOOTER */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '22px',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    color: '#003892',
                    fontSize: '10.5px',
                    fontWeight: '700',
                    letterSpacing: '0.2px'
                  }}
                >
                  8400 Broadway, Merrillville, IN 46410 | 219-769-1700 | www.usfederalcu.org
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* PAGE 2 (816px x 1056px Letter Canvas) */}
            {/* ========================================================================= */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden mt-8 print:mt-0"
              style={{ width: '816px', height: '1056px', position: 'relative', boxSizing: 'border-box' }}
            >
              {/* --- PAGE 2 CONTENT LAYER --- */}
              <div className="relative w-full h-full" style={{ padding: '0 28px' }}>
                
                {/* TOP HEADER ROW: Left Authentic Logo & Right STATEMENT OF ACCOUNTS pill */}
                <div style={{ paddingTop: '36px' }} className="flex justify-between items-start">
                  <div className="pl-1">
                    <img
                      src={authenticLogo}
                      alt="US 1364 Federal Credit Union"
                      style={{ height: '75.5px', width: 'auto', display: 'block' }}
                    />
                  </div>
                  <div style={{ paddingRight: '28px', paddingTop: '4px' }}>
                    <div
                      style={{
                        backgroundColor: '#003892',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        width: '307px',
                        height: '29.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}
                    >
                      STATEMENT OF ACCOUNTS
                    </div>
                  </div>
                </div>

                {/* PAGE 2 UPPER SECTION: Account Info on Right (under pill), Member Address on Left (window envelope) */}
                <div className="relative w-full" style={{ height: '175px' }}>
                  {/* Right: Account Information Box - positioned under pill at canvas x=479.5px, y=92.5px */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '48px',
                      top: '-19px',
                      width: '268px'
                    }}
                  >
                    <div
                      style={{
                        border: '1.5px solid #0e64ff',
                        borderRadius: '16px',
                        padding: '3px 12px 6px 12px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#0e64ff',
                          color: '#ffffff',
                          borderRadius: '9999px',
                          textAlign: 'center',
                          fontWeight: '700',
                          fontSize: '10.5px',
                          letterSpacing: '0.4px',
                          padding: '2px 0',
                          marginBottom: '4px'
                        }}
                      >
                        ACCOUNT INFORMATION
                      </div>
                      <div className="text-[10.5px] leading-[16px] text-black">
                        <div className="flex justify-between">
                          <span className="font-normal">Member Number:</span>
                          <span className="font-bold">{curCustomer.memberNumber || ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal">Ending Date:</span>
                          <span className="font-bold">{curMeta.displayEndingDate || ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal">Page:</span>
                          <span className="font-bold">{p2Label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left: Member Address - aligned at canvas y ~ 203.5px matching Page 1 window envelope */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '40px',
                      top: '85px',
                      width: '360px'
                    }}
                  >
                    <div className="text-[10px] font-mono text-slate-400 mb-2" style={{ paddingLeft: '110px' }}>
                      {curCustomer.microCode || ''}
                    </div>
                    <div className="text-[11px] leading-[15px] font-normal text-black tracking-tight uppercase">
                      <div>{curCustomer.name || ''}</div>
                      <div>{curCustomer.address || ''}</div>
                      <div>{curCustomer.cityStateZip || ''}</div>
                    </div>
                  </div>
                </div>

                {/* --- TABLE 2 CONTINUATION: SHARE DRAFT --- */}
                <div style={{ marginTop: '10px' }} className="w-full">
                  {/* Account Title */}
                  <div className="font-bold text-[13px] tracking-tight pb-0.5 px-0.5 text-black">
                    {shareDraft.title}
                  </div>

                  {/* Table Header Bar */}
                  <div
                    style={{
                      backgroundColor: '#1129a2',
                      color: '#ffffff',
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      letterSpacing: '0.3px',
                      alignItems: 'center',
                      height: '15px'
                    }}
                  >
                    <div>DATE</div>
                    <div>TRANSACTION DESCRIPTION</div>
                    <div className="text-right">DEPOSIT</div>
                    <div className="text-right">WITHDRAWAL</div>
                    <div className="text-right">BALANCE</div>
                  </div>

                  {/* Page 2 Transaction Rows */}
                  {p2Tx.map((tx, idx) => {
                    const isAlt = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '58px 1fr 95px 95px 95px',
                          padding: '1.5px 8px',
                          fontSize: '9.5px',
                          backgroundColor: isAlt ? '#adcbff' : '#ffffff',
                          alignItems: 'start'
                        }}
                      >
                        <div className="font-bold">{tx.date}</div>
                        <div className="pr-2 font-normal">
                          <div>{tx.line1}</div>
                          {tx.line2 && <div className="text-[9px] font-normal">{tx.line2}</div>}
                        </div>
                        <div className="text-right font-mono font-normal">{tx.deposit ? fmt(tx.deposit) : ''}</div>
                        <div className="text-right font-mono font-normal">{tx.withdrawal ? fmt(tx.withdrawal) : ''}</div>
                        <div className="text-right font-mono font-normal">{tx.balance ? fmt(tx.balance) : ''}</div>
                      </div>
                    );
                  })}

                  {/* New Balance Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '58px 1fr 95px 95px 95px',
                      padding: '1.5px 8px',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div></div>
                    <div>NEW BALANCE</div>
                    <div></div>
                    <div></div>
                    <div className="text-right font-mono">{fmt(shareDraft.newBalance)}</div>
                  </div>
                </div>

                {/* --- STATEMENT SUMMARY CARD --- */}
                <div style={{ marginTop: '18px' }} className="flex justify-center w-full">
                  <div
                    style={{
                      width: '694px',
                      border: '1.5px solid #0e64ff',
                      borderRadius: '16px',
                      padding: '3px 14px 6px 14px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#0e64ff',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '10.5px',
                        letterSpacing: '0.4px',
                        padding: '2px 0',
                        marginBottom: '5px'
                      }}
                    >
                      STATEMENT SUMMARY
                    </div>

                    {/* Table of Accounts */}
                    <div className="text-[10px] text-black">
                      {/* Headers */}
                      <div className="grid grid-cols-12 font-bold pb-1 text-center text-[9.5px]">
                        <div className="col-span-1 flex justify-center"><span className="border-b border-black pb-[0.5px] px-1">Acct</span></div>
                        <div className="col-span-2 flex flex-col items-end pr-3"><span>New</span><span className="border-b border-black pb-[0.5px]">Balance</span></div>
                        <div className="col-span-2 flex flex-col items-end pr-3"><span>Dividends</span><span className="border-b border-black pb-[0.5px]">YTD</span></div>
                        <div className="col-span-3 flex flex-col items-start pl-2"><span>Tax</span><span className="border-b border-black pb-[0.5px] pr-8">Name</span></div>
                        <div className="col-span-2 flex justify-center"><span className="border-b border-black pb-[0.5px] px-1">Loan</span></div>
                        <div className="col-span-2 flex flex-col items-end pr-3"><span>New</span><span className="border-b border-black pb-[0.5px]">Balance</span></div>
                      </div>

                      {/* Account 1 */}
                      <div className="grid grid-cols-12 py-0.5 text-center font-normal text-[10px] leading-[14px]">
                        <div className="col-span-1">{summaryAccounts[0]?.acct || regSavings.accountNumber}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{fmt(summaryAccounts[0]?.newBalance ?? regSavings.newBalance)}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{fmt(acct1Dividends)}</div>
                        <div className="col-span-3 text-left pl-2">{summaryAccounts[0]?.taxName || curCustomer.name}</div>
                        <div className="col-span-2">{summaryAccounts[0]?.loan || ''}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{summaryAccounts[0]?.loanBalance ? fmt(summaryAccounts[0]?.loanBalance) : ''}</div>
                      </div>

                      {/* Account 2 */}
                      <div className="grid grid-cols-12 py-0.5 text-center font-normal text-[10px] leading-[14px]">
                        <div className="col-span-1">{summaryAccounts[1]?.acct || shareDraft.accountNumber}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{fmt(summaryAccounts[1]?.newBalance ?? shareDraft.newBalance)}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{fmt(acct2Dividends)}</div>
                        <div className="col-span-3 text-left pl-2">{summaryAccounts[1]?.taxName || curCustomer.name}</div>
                        <div className="col-span-2">{summaryAccounts[1]?.loan || ''}</div>
                        <div className="col-span-2 text-right font-mono pr-3">{summaryAccounts[1]?.loanBalance ? fmt(summaryAccounts[1]?.loanBalance) : ''}</div>
                      </div>

                      {/* Total Dividends YTD */}
                      <div className="grid grid-cols-12 pt-1 font-bold text-[10px]">
                        <div className="col-span-3 text-left pl-1">TOTAL DIVIDENDS YTD</div>
                        <div className="col-span-2 text-right font-mono pr-3">{fmt(totalDividendsVal)}</div>
                        <div className="col-span-7"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INQUIRIES ADDRESS BLOCK (Authentic 2-Column Layout) */}
                <div style={{ marginTop: '18px' }} className="flex justify-center text-[9.5px] leading-[13.5px] font-bold text-black">
                  <div style={{ display: 'grid', gridTemplateColumns: '220px auto', columnGap: '12px' }}>
                    <div className="whitespace-nowrap">
                      <div>SEND ALL ROUTINE BUSINESS INQUIRES TO:</div>
                      <div style={{ marginTop: '38px' }}>ALL OTHER INQUIRES TO:</div>
                    </div>
                    <div className="whitespace-nowrap">
                      <div style={{ height: '13.5px' }}></div>
                      <div>U S 1364 FEDERAL CREDIT UNION</div>
                      <div>8400 BROADWAY</div>
                      <div>MERRILLVILLE, IN 46410</div>
                      <div>SUPERVISORY COMMITTEE</div>
                      <div>U S 1364 FEDERAL CREDIT UNION</div>
                      <div>PO BOX 11342</div>
                      <div>MERRILLVILLE, IN 46411</div>
                    </div>
                  </div>
                </div>

                {/* PAGE 2 FOOTER */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '22px',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    color: '#003892',
                    fontSize: '10.5px',
                    fontWeight: '700',
                    letterSpacing: '0.2px'
                  }}
                >
                  8400 Broadway, Merrillville, IN 46410 | 219-769-1700 | www.usfederalcu.org
                </div>

              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

