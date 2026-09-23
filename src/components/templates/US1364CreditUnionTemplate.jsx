import React from 'react';
import { Us1364Logo, Us1364Watermark } from '../vectors';
import authenticYouthPromo from '../../assets/us_fed_youth_promo_authentic.png';
import authenticHolidayPromo from '../../assets/us_fed_holiday_card.png';
import { US1364_CREDIT_UNION_DATA } from '../../data/us1364CreditUnionData';

/**
 * 1:1 Authentic Reusable & Dynamically Expandable Template for US 1364 Federal Credit Union Statements.
 * Conforms fully to the canonical November 2024 statement (US_1364_Federal_Credit_Union_Statement_November_2024.pdf)
 * and the production Quadient variable data printing engine blueprint.
 * Standard Letter Canvas: 816px x 1056px per page (612pt x 792pt at 96 DPI).
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
  const rawStatementsList = (statements && Array.isArray(statements) && statements.length > 0)
    ? statements
    : [{
        statementMeta,
        customerInfo,
        regularSavings: data.accounts.regularSavings,
        shareDraft: data.accounts.shareDraft,
        summaryOfAccounts: data.summaryOfAccounts,
        statementSummary: data.statementSummary
      }];

  // Currency formatter
  const fmt = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === '') return '';
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="us1364-statement-container text-black select-none bg-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {rawStatementsList.map((stmt, sIdx) => {
        const curMeta = stmt.statementMeta || statementMeta;
        const curCustomer = stmt.customerInfo || customerInfo;
        const regSavings = stmt.regularSavings || stmt.accounts?.regularSavings || data.accounts.regularSavings;
        const shareDraft = stmt.shareDraft || stmt.accounts?.shareDraft || data.accounts.shareDraft;
        const summaryOfAccounts = stmt.summaryOfAccounts || data.summaryOfAccounts;
        const statementSummary = stmt.statementSummary || data.statementSummary;

        const summaryAccounts = Array.isArray(statementSummary)
          ? statementSummary
          : (statementSummary?.accounts || []);
        const totalDividendsVal = statementSummary?.totalDividendsYtd !== undefined
          ? statementSummary.totalDividendsYtd
          : (stmt.totalDividendsYtd !== undefined ? stmt.totalDividendsYtd : (regSavings.dividendsYtd || 0.00));

        // -------------------------------------------------------------
        // DYNAMIC PAGINATION ENGINE
        // -------------------------------------------------------------
        const allDraftTx = shareDraft.transactions || [
          ...(shareDraft.page1Transactions || []),
          ...(shareDraft.page2Transactions || [])
        ];
        let p1DraftTx = [];
        let remainingDraftTx = [];

        if (shareDraft.page1Transactions && shareDraft.page2Transactions) {
          p1DraftTx = shareDraft.page1Transactions;
          remainingDraftTx = shareDraft.page2Transactions;
        } else {
          // Dynamic calculation: Page 1 available height for transactions is ~408px
          // Regular Savings height: banner(20) + header(18) + prev(17) + newBal(18) + yield(16) + txList*17 = 89 + N*17
          const regTxList = regSavings.transactions || [];
          const regCost = 89 + (regTxList.length * 17);
          const p1AvailForDraft = 408 - regCost;
          // Draft header + previous balance costs ~55px
          if (p1AvailForDraft > 55 + 17) {
            const draftTxRoom = Math.floor((p1AvailForDraft - 55) / 17);
            const takeCount = Math.min(allDraftTx.length, Math.max(0, draftTxRoom));
            p1DraftTx = allDraftTx.slice(0, takeCount);
            remainingDraftTx = allDraftTx.slice(takeCount);
          } else {
            p1DraftTx = [];
            remainingDraftTx = allDraftTx;
          }
        }

        // Paginate remainingDraftTx across continuation pages
        // Continuation printable height: ~708px
        // Draft table continuation header: ~38px, new balance row: ~18px
        // Final closure (Statement Summary Card + Inquiries): ~245px
        const continuationPages = [];
        let txIndex = 0;
        while (txIndex < remainingDraftTx.length || continuationPages.length === 0) {
          const isFirstContPage = continuationPages.length === 0;
          const availHeight = 708 - 38 - 18;
          const txRemaining = remainingDraftTx.slice(txIndex);
          const txCost = txRemaining.length * 17;

          if (txCost + 245 <= availHeight) {
            continuationPages.push({
              draftTx: txRemaining,
              isContinued: !isFirstContPage || p1DraftTx.length > 0,
              hasNewBalance: true,
              hasClosure: true
            });
            break;
          } else {
            const txCapacity = Math.floor(availHeight / 17);
            if (txCapacity >= txRemaining.length) {
              continuationPages.push({
                draftTx: txRemaining,
                isContinued: !isFirstContPage || p1DraftTx.length > 0,
                hasNewBalance: true,
                hasClosure: false
              });
              continuationPages.push({
                draftTx: [],
                isContinued: false,
                hasNewBalance: false,
                hasClosure: true
              });
              break;
            } else {
              const batch = txRemaining.slice(0, txCapacity);
              continuationPages.push({
                draftTx: batch,
                isContinued: !isFirstContPage || p1DraftTx.length > 0,
                hasNewBalance: false,
                hasClosure: false
              });
              txIndex += txCapacity;
            }
          }
        }

        const totalPages = 1 + continuationPages.length;
        const p1Label = `1 of ${totalPages}`;
        const isHolidayMonth = curMeta.isHoliday || curMeta.displayEndingDate?.startsWith('11-') || curMeta.displayPeriod?.includes('11-01');
        const promoImgToUse = stmt.promoImage || (isHolidayMonth ? authenticHolidayPromo : authenticYouthPromo);

        return (
          <React.Fragment key={sIdx}>
            {/* ========================================================================= */}
            {/* PAGE 1 (816px x 1056px Letter Canvas) */}
            {/* ========================================================================= */}
            <div
              className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden"
              style={{ width: '816px', height: '1056px', position: 'relative', boxSizing: 'border-box' }}
            >
              {/* AUTHENTIC VECTOR WATERMARK LAYER (Page 1) */}
              <div
                style={{
                  position: 'absolute',
                  left: '191.67px',
                  top: '555.73px',
                  width: '433.73px',
                  height: '170.83px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              >
                <Us1364Watermark style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>

              {/* CONTENT LAYER */}
              <div className="relative w-full h-full" style={{ padding: '0 28px', zIndex: 1 }}>
                
                {/* Batch / Microcode stamp (Authentic 691) */}
                {curCustomer.microCode && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '393.9px',
                      top: '162.4px',
                      fontSize: '10px',
                      color: '#8e9aa8',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      letterSpacing: '0.5px',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}
                  >
                    {curCustomer.microCode}
                  </div>
                )}

                {/* TOP HEADER ROW: Left Authentic Logo & Right STATEMENT OF ACCOUNTS pill */}
                <div style={{ paddingTop: '36px' }} className="flex justify-between items-start">
                  <div style={{ paddingLeft: '44.2px' }}>
                    <Us1364Logo style={{ width: '232.24px', height: '93.79px', display: 'block' }} />
                  </div>
                  <div style={{ paddingRight: '28.6px', paddingTop: '8px' }}>
                    <div
                      style={{
                        width: '307.2px',
                        height: '29.7px',
                        backgroundColor: '#0e64ff',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        fontSize: '15px',
                        fontWeight: '700',
                        letterSpacing: '1.2px',
                        lineHeight: '1',
                        textTransform: 'uppercase',
                        userSelect: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      STATEMENT OF ACCOUNTS
                    </div>
                  </div>
                </div>

                {/* SECOND ROW: 2-Column Section (Left: Address + Account Info, Right: Promo Graphic) */}
                <div style={{ marginTop: '5.9px' }} className="flex justify-between items-start">
                  {/* Left Column: Member Mailing Address + Account Information Card */}
                  <div style={{ width: '367.4px' }} className="flex flex-col">
                    {/* Member Mailing Address - positioned for authentic window envelope visibility */}
                    <div style={{ paddingLeft: '68px', paddingTop: '66.1px' }}>
                      <div style={{ fontSize: '10.67px', lineHeight: '12.27px', fontFamily: 'Arial, Helvetica, sans-serif' }} className="font-normal text-black uppercase">
                        <div>{curCustomer.name || ''}</div>
                        <div>{curCustomer.address || ''}</div>
                        <div>{curCustomer.cityStateZip || ''}</div>
                      </div>
                    </div>

                    {/* ACCOUNT INFORMATION CARD */}
                    <div style={{ width: '367.4px', marginTop: '66.3px' }}>
                      <div
                        style={{
                          border: '1.44px solid #0e64ff',
                          borderRadius: '14.4px',
                          padding: '9.6px 8.6px',
                          backgroundColor: 'transparent',
                          height: '75.2px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#0e64ff',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '10.67px',
                            height: '12.0px',
                            lineHeight: '1',
                            paddingTop: '1.2px',
                            letterSpacing: '0.4px',
                            marginBottom: '3.7px',
                            boxSizing: 'border-box'
                          }}
                        >
                          ACCOUNT INFORMATION
                        </div>
                        <div style={{ fontSize: '12.0px', lineHeight: '13.41px' }} className="text-black font-bold">
                          <div className="flex justify-between">
                            <span className="font-bold">Member Number:</span>
                            <span className="font-bold">{curCustomer.memberNumber || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Ending Date:</span>
                            <span className="font-bold">{curMeta.displayEndingDate || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Page:</span>
                            <span className="font-bold">{p1Label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Promotion Card */}
                  <div>
                    <div
                      style={{
                        width: '360px',
                        height: '249.6px',
                        overflow: 'hidden',
                        borderRadius: '2px'
                      }}
                    >
                      <img
                        src={promoImgToUse}
                        alt="US 1364 Promotion"
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
                <div style={{ marginTop: '11.6px' }} className="w-full">
                  <div
                    style={{
                      border: '1.44px solid #0e64ff',
                      borderRadius: '14.4px',
                      padding: '9.6px',
                      backgroundColor: 'transparent',
                      height: '93.12px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#0e64ff',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14.67px',
                        height: '16.8px',
                        lineHeight: '1',
                        paddingTop: '1.0px',
                        letterSpacing: '0.2px',
                        marginBottom: '2.8px',
                        boxSizing: 'border-box'
                      }}
                    >
                      MESSAGE TO MEMBERS
                    </div>
                    <div style={{ fontSize: '12.0px', lineHeight: '13.41px' }} className="text-center text-black font-bold">
                      <div>Make your dream a reality</div>
                      <div>With a Home Equity Loan</div>
                      <div>Always .25% APR below prime</div>
                      <div>No closing costs or annual fees!</div>
                    </div>
                  </div>
                </div>

                {/* SUMMARY OF ACCOUNTS CARD (Full width, left-grouped content) */}
                <div style={{ marginTop: '7.4px' }} className="w-full">
                  <div
                    style={{
                      border: '1.44px solid #0e64ff',
                      borderRadius: '14.4px',
                      padding: '9.6px',
                      backgroundColor: 'transparent',
                      height: '80.0px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#0e64ff',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14.67px',
                        height: '16.4px',
                        lineHeight: '1',
                        paddingTop: '0.1px',
                        letterSpacing: '0.2px',
                        marginBottom: '3.6px',
                        boxSizing: 'border-box'
                      }}
                    >
                      SUMMARY OF ACCOUNTS
                    </div>
                    <div style={{ fontSize: '10.67px', lineHeight: '11.93px', width: '360px' }} className="text-black">
                      <div className="flex justify-between px-1 font-normal" style={{ height: '11.93px', alignItems: 'center' }}>
                        <span className="font-normal">REGULAR SAVINGS</span>
                        <span className="font-normal" style={{ width: '90px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(summaryOfAccounts.regularSavings)}</span>
                      </div>
                      <div className="flex justify-between px-1 font-normal" style={{ height: '11.93px', alignItems: 'center' }}>
                        <span className="font-normal">SHARE DRAFT</span>
                        <span className="font-normal" style={{ width: '90px', textAlign: 'right' }}>
                          <span className="inline-block border-b-[1.44px] border-black pb-[0.5px]" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(summaryOfAccounts.shareDraft)}</span>
                        </span>
                      </div>
                      <div className="flex justify-between px-1 font-bold" style={{ marginTop: '4.8px', height: '12.93px', alignItems: 'center' }}>
                        <span className="font-bold">TOTAL SHARE BALANCES:</span>
                        <span className="font-bold" style={{ width: '90px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(summaryOfAccounts.totalShareBalances)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- TABLE 1: REGULAR SAVINGS ACCT# --- */}
                <div style={{ marginTop: '11.7px', width: '100%' }}>
                  {/* Account Banner Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '334px 177px 1fr',
                      alignItems: 'baseline',
                      fontSize: '14.67px',
                      fontWeight: '700',
                      letterSpacing: '-0.2px',
                      paddingLeft: '1.3px',
                      height: '11.0px',
                      lineHeight: '11.0px',
                      marginBottom: '3.1px',
                      boxSizing: 'border-box',
                      color: '#000000'
                    }}
                  >
                    <div>{regSavings.title}</div>
                    <div>ACCT#&nbsp;&nbsp;{regSavings.accountNumber}</div>
                    <div>{curMeta.displayPeriod || ''}</div>
                  </div>

                  {/* Table Header Bar */}
                  <div
                    style={{
                      backgroundColor: '#1129a2',
                      color: '#ffffff',
                      display: 'grid',
                      gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                      padding: '0 14.4px',
                      fontSize: '10.67px',
                      fontWeight: '700',
                      letterSpacing: '0.3px',
                      alignItems: 'center',
                      height: '14.08px',
                      lineHeight: '14.08px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DATE</div>
                    <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>TRANSACTION DESCRIPTION</div>
                    <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DEPOSIT</div>
                    <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>WITHDRAWAL</div>
                    <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>BALANCE</div>
                  </div>

                  {/* Previous Balance Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                      padding: '0 14.4px',
                      fontSize: '10.67px',
                      fontWeight: '700',
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      height: '14.4px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div></div>
                    <div style={{ textAlign: 'left' }}>PREVIOUS BALANCE</div>
                    <div></div>
                    <div></div>
                    <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(regSavings.previousBalance)}</div>
                  </div>

                  {/* Regular Savings Transaction Rows */}
                  {regSavings.transactions.map((tx, idx) => {
                    const isAlt = idx % 2 === 0;
                    const isLast = idx === regSavings.transactions.length - 1;
                    const isDividend = tx.line1?.toUpperCase().includes('DIVIDEND');
                    const hasSubLine = Boolean(tx.line2 && !isDividend && !isLast);

                    return (
                      <React.Fragment key={idx}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                            padding: '0 14.4px',
                            fontSize: '10.67px',
                            backgroundColor: isAlt ? '#adcbff' : 'transparent',
                            alignItems: 'flex-start',
                            height: hasSubLine ? '28.8px' : '14.4px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div style={{ fontWeight: '400', textAlign: 'left', lineHeight: '14.4px' }}>{tx.date}</div>
                          <div style={{ textAlign: 'left', paddingRight: '8px' }}>
                            <div style={{ fontWeight: '400', lineHeight: '14.4px' }}>{tx.line1}</div>
                            {hasSubLine && (
                              <div style={{ fontSize: '10.67px', fontWeight: '400', lineHeight: '14.4px' }}>{tx.line2}</div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.deposit ? fmt(tx.deposit) : ''}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.withdrawal ? fmt(tx.withdrawal) : ''}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.balance ? fmt(tx.balance) : ''}
                          </div>
                        </div>

                        {/* Dividend APY Disclosure Row */}
                        {(isDividend || isLast) && tx.line2 && (
                          <div
                            style={{
                              padding: '0 14.4px 0 60.9px',
                              fontSize: '10.67px',
                              fontWeight: '400',
                              backgroundColor: 'transparent',
                              letterSpacing: '0.1px',
                              lineHeight: '14.4px',
                              height: '14.4px',
                              textAlign: 'left',
                              boxSizing: 'border-box'
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
                      gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                      padding: '0 14.4px',
                      fontSize: '10.67px',
                      fontWeight: '700',
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                      height: '14.4px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div></div>
                    <div style={{ textAlign: 'left' }}>NEW BALANCE</div>
                    <div></div>
                    <div></div>
                    <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(regSavings.newBalance)}</div>
                  </div>
                </div>

                {/* --- TABLE 2: SHARE DRAFT (Page 1 Section) --- */}
                {p1DraftTx.length > 0 && (
                  <div style={{ marginTop: '28.9px', width: '100%' }}>
                    {/* Account Banner Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '334px 177px 1fr',
                        alignItems: 'baseline',
                        fontSize: '14.67px',
                        fontWeight: '700',
                        letterSpacing: '-0.2px',
                        paddingLeft: '1.3px',
                        height: '11.0px',
                        lineHeight: '11.0px',
                        marginBottom: '3.1px',
                        boxSizing: 'border-box',
                        color: '#000000'
                      }}
                    >
                      <div>{shareDraft.title}</div>
                      <div>ACCT#&nbsp;&nbsp;{shareDraft.accountNumber}</div>
                      <div>{curMeta.displayPeriod || ''}</div>
                    </div>

                    {/* Table Header Bar */}
                    <div
                      style={{
                        backgroundColor: '#1129a2',
                        color: '#ffffff',
                        display: 'grid',
                        gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                        padding: '0 14.4px',
                        fontSize: '10.67px',
                        fontWeight: '700',
                        letterSpacing: '0.3px',
                        alignItems: 'center',
                        height: '14.08px',
                        lineHeight: '14.08px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DATE</div>
                      <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>TRANSACTION DESCRIPTION</div>
                      <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DEPOSIT</div>
                      <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>WITHDRAWAL</div>
                      <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>BALANCE</div>
                    </div>

                    {/* Previous Balance Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                        padding: '0 14.4px',
                        fontSize: '10.67px',
                        fontWeight: '700',
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        height: '14.4px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div></div>
                      <div style={{ textAlign: 'left' }}>PREVIOUS BALANCE</div>
                      <div></div>
                      <div></div>
                      <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(shareDraft.previousBalance)}</div>
                    </div>

                    {/* Page 1 Transactions */}
                    {p1DraftTx.map((tx, idx) => {
                      const isAlt = idx % 2 === 0;
                      const hasSubLine = Boolean(tx.line2);

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                            padding: '0 14.4px',
                            fontSize: '10.67px',
                            backgroundColor: isAlt ? '#adcbff' : 'transparent',
                            alignItems: 'flex-start',
                            height: hasSubLine ? '28.8px' : '14.4px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div style={{ fontWeight: '400', textAlign: 'left', lineHeight: '14.4px' }}>{tx.date}</div>
                          <div style={{ textAlign: 'left', paddingRight: '8px' }}>
                            <div style={{ fontWeight: '400', lineHeight: '14.4px' }}>{tx.line1}</div>
                            {hasSubLine && (
                              <div style={{ fontSize: '10.67px', fontWeight: '400', lineHeight: '14.4px' }}>{tx.line2}</div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.deposit ? fmt(tx.deposit) : ''}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.withdrawal ? fmt(tx.withdrawal) : ''}
                          </div>
                          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                            {tx.balance ? fmt(tx.balance) : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PAGE 1 FOOTER */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '36.0px',
                    left: '0px',
                    width: '816px',
                    height: '11.2px',
                    color: '#003892',
                    fontSize: '11.2px',
                    fontWeight: '700',
                    letterSpacing: '0.02px',
                    lineHeight: '11.2px',
                    pointerEvents: 'none'
                  }}
                >
                  <span style={{ position: 'absolute', left: '208.3px', whiteSpace: 'nowrap' }}>8400 Broadway, Merrillville, IN 46410</span>
                  <span style={{ position: 'absolute', left: '405.4px' }}>|</span>
                  <span style={{ position: 'absolute', left: '412.8px', whiteSpace: 'nowrap' }}>219-769-1700</span>
                  <span style={{ position: 'absolute', left: '490.2px' }}>|</span>
                  <span style={{ position: 'absolute', left: '497.6px', whiteSpace: 'nowrap' }}>www.usfederalcu.org</span>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* CONTINUATION PAGES (Page 2, 3, etc.) */}
            {/* ========================================================================= */}
            {continuationPages.map((cPage, cIdx) => {
              const curPageNum = cIdx + 2;
              const curPageLabel = `${curPageNum} of ${totalPages}`;

              return (
                <div
                  key={cIdx}
                  className="statement-page relative bg-white mx-auto border-b-8 border-slate-300 print:border-none overflow-hidden mt-8 print:mt-0"
                  style={{ width: '816px', height: '1056px', position: 'relative', boxSizing: 'border-box' }}
                >
                  {/* AUTHENTIC VECTOR WATERMARK LAYER */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '191.67px',
                      top: '555.73px',
                      width: '433.73px',
                      height: '170.83px',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    <Us1364Watermark style={{ width: '100%', height: '100%', display: 'block' }} />
                  </div>

                  {/* CONTENT LAYER */}
                  <div className="relative w-full h-full" style={{ padding: '0 28px', zIndex: 1 }}>
                    
                    {/* Batch / Microcode stamp (Authentic 691) */}
                    {curCustomer.microCode && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '393.9px',
                          top: '162.4px',
                          fontSize: '10px',
                          color: '#8e9aa8',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          letterSpacing: '0.5px',
                          pointerEvents: 'none',
                          zIndex: 2
                        }}
                      >
                        {curCustomer.microCode}
                      </div>
                    )}

                    {/* TOP HEADER ROW: Left Authentic Logo & Right STATEMENT OF ACCOUNTS pill */}
                    <div style={{ paddingTop: '36px' }} className="flex justify-between items-start">
                      <div style={{ paddingLeft: '44.2px' }}>
                        <Us1364Logo style={{ width: '232.24px', height: '93.79px', display: 'block' }} />
                      </div>
                      <div style={{ paddingRight: '28.6px', paddingTop: '8px' }}>
                        <div
                          style={{
                            width: '307.2px',
                            height: '29.7px',
                            backgroundColor: '#0e64ff',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '15px',
                            fontWeight: '700',
                            letterSpacing: '1.2px',
                            lineHeight: '1',
                            textTransform: 'uppercase',
                            userSelect: 'none',
                            boxSizing: 'border-box'
                          }}
                        >
                          STATEMENT OF ACCOUNTS
                        </div>
                      </div>
                    </div>

                    {/* UPPER SECTION: Account Info on Right, Member Address on Left */}
                    <div className="relative w-full" style={{ height: '145px' }}>
                      {/* Right: Account Information Box */}
                      <div
                        style={{
                          position: 'absolute',
                          right: '41.4px',
                          top: '-33.2px',
                          width: '266.6px'
                        }}
                      >
                        <div
                          style={{
                            border: '1.44px solid #0e64ff',
                            borderRadius: '14.4px',
                            padding: '9.6px 8.6px',
                            backgroundColor: 'transparent',
                            height: '75.2px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: '#0e64ff',
                              color: '#ffffff',
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '10.67px',
                              letterSpacing: '0.4px',
                              height: '12.0px',
                              lineHeight: '1',
                              paddingTop: '1.2px',
                              marginBottom: '3.7px',
                              boxSizing: 'border-box'
                            }}
                          >
                            ACCOUNT INFORMATION
                          </div>
                          <div style={{ fontSize: '12.0px', lineHeight: '13.41px' }} className="text-black font-bold">
                            <div className="flex justify-between">
                              <span className="font-bold">Member Number:</span>
                              <span className="font-bold">{curCustomer.memberNumber || ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-bold">Ending Date:</span>
                              <span className="font-bold">{curMeta.displayEndingDate || ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-bold">Page:</span>
                              <span className="font-bold">{curPageLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Left: Member Address */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '68px',
                          top: '71.6px',
                          width: '360px'
                        }}
                      >
                        <div style={{ fontSize: '10.67px', lineHeight: '12.27px', fontFamily: 'Arial, Helvetica, sans-serif' }} className="font-normal text-black uppercase">
                          <div>{curCustomer.name || ''}</div>
                          <div>{curCustomer.address || ''}</div>
                          <div>{curCustomer.cityStateZip || ''}</div>
                        </div>
                      </div>
                    </div>

                    {/* --- TABLE CONTINUATION: SHARE DRAFT --- */}
                    {cPage.draftTx.length > 0 && (
                      <div style={{ marginTop: '26.7px', width: '100%' }}>
                        {/* Account Title */}
                        <div
                          style={{
                            fontSize: '14.67px',
                            fontWeight: '700',
                            letterSpacing: '-0.2px',
                            paddingLeft: '1.3px',
                            height: '11.0px',
                            lineHeight: '11.0px',
                            marginBottom: '3.1px',
                            boxSizing: 'border-box'
                          }}
                          className="text-black"
                        >
                          {shareDraft.title}
                        </div>

                        {/* Table Header Bar */}
                        <div
                          style={{
                            backgroundColor: '#1129a2',
                            color: '#ffffff',
                            display: 'grid',
                            gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                            padding: '0 14.4px',
                            fontSize: '10.67px',
                            fontWeight: '700',
                            letterSpacing: '0.3px',
                            alignItems: 'center',
                            height: '14.08px',
                            lineHeight: '14.08px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DATE</div>
                          <div style={{ textAlign: 'left', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>TRANSACTION DESCRIPTION</div>
                          <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>DEPOSIT</div>
                          <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>WITHDRAWAL</div>
                          <div style={{ textAlign: 'right', lineHeight: '14.08px', height: '100%', boxSizing: 'border-box' }}>BALANCE</div>
                        </div>

                        {/* Transaction Rows */}
                        {cPage.draftTx.map((tx, idx) => {
                          const isAlt = idx % 2 === 0;
                          const hasSubLine = Boolean(tx.line2);

                          return (
                            <div
                              key={idx}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                                padding: '0 14.4px',
                                fontSize: '10.67px',
                                backgroundColor: isAlt ? '#adcbff' : 'transparent',
                                alignItems: 'flex-start',
                                height: hasSubLine ? '28.8px' : '14.4px',
                                boxSizing: 'border-box'
                              }}
                            >
                              <div style={{ fontWeight: '400', textAlign: 'left', lineHeight: '14.4px' }}>{tx.date}</div>
                              <div style={{ textAlign: 'left', paddingRight: '8px' }}>
                                <div style={{ fontWeight: '400', lineHeight: '14.4px' }}>{tx.line1}</div>
                                {hasSubLine && (
                                  <div style={{ fontSize: '10.67px', fontWeight: '400', lineHeight: '14.4px' }}>{tx.line2}</div>
                                )}
                              </div>
                              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                                {tx.deposit ? fmt(tx.deposit) : ''}
                              </div>
                              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                                {tx.withdrawal ? fmt(tx.withdrawal) : ''}
                              </div>
                              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '400', lineHeight: '14.4px' }}>
                                {tx.balance ? fmt(tx.balance) : ''}
                              </div>
                            </div>
                          );
                        })}

                        {/* New Balance Row (rendered on page where transactions end) */}
                        {cPage.hasNewBalance && (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '46.5px 1fr 103.6px 103.6px 95.3px',
                              padding: '0 14.4px',
                              fontSize: '10.67px',
                              fontWeight: '700',
                              backgroundColor: 'transparent',
                              alignItems: 'center',
                              height: '14.4px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <div></div>
                            <div style={{ textAlign: 'left' }}>NEW BALANCE</div>
                            <div></div>
                            <div></div>
                            <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(shareDraft.newBalance)}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* --- FINAL CLOSURE ELEMENTS (Statement Summary Card & Inquiries) --- */}
                    {cPage.hasClosure && (
                      <>
                        {/* STATEMENT SUMMARY CARD */}
                        <div style={{ marginTop: '24.4px' }} className="flex justify-center w-full">
                          <div
                            style={{
                              width: '693.12px',
                              height: '101.95px',
                              border: '1.44px solid #0e64ff',
                              borderRadius: '14.4px',
                              position: 'relative',
                              backgroundColor: 'transparent',
                              boxSizing: 'border-box'
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: '9.6px',
                                top: '9.6px',
                                width: '673.92px',
                                height: '18.13px',
                                backgroundColor: '#0e64ff',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14.67px',
                                lineHeight: '1',
                                paddingTop: '1.0px',
                                letterSpacing: '0.4px',
                                boxSizing: 'border-box'
                              }}
                            >
                              STATEMENT SUMMARY
                            </div>

                            {/* Table of Accounts */}
                            <div style={{ position: 'absolute', left: '0px', top: '30.97px', width: '100%', fontSize: '10.67px', lineHeight: '11.93px', fontWeight: '700', color: '#000000' }}>
                              {/* Headers Row with 6 authentic Quadient underlines */}
                              <div style={{ position: 'relative', height: '22.72px' }}>
                                {/* Acct */}
                                <div style={{ position: 'absolute', left: '38.4px', width: '29.6px', top: '11.92px', textAlign: 'center' }}>Acct</div>
                                {/* New Balance */}
                                <div style={{ position: 'absolute', left: '116.0px', width: '47.5px', top: '0px', textAlign: 'right' }}>New</div>
                                <div style={{ position: 'absolute', left: '116.0px', width: '47.5px', top: '11.92px', textAlign: 'right' }}>Balance</div>
                                {/* Dividends YTD */}
                                <div style={{ position: 'absolute', left: '201.9px', width: '62.5px', top: '0px', textAlign: 'right' }}>Dividends</div>
                                <div style={{ position: 'absolute', left: '201.9px', width: '62.5px', top: '11.92px', textAlign: 'right' }}>YTD</div>
                                {/* Tax Name */}
                                <div style={{ position: 'absolute', left: '283.6px', width: '175.9px', top: '0px', textAlign: 'left' }}>Tax</div>
                                <div style={{ position: 'absolute', left: '283.6px', width: '175.9px', top: '11.92px', textAlign: 'left' }}>Name</div>
                                {/* Loan */}
                                <div style={{ position: 'absolute', left: '488.3px', width: '21.9px', top: '11.92px', textAlign: 'center' }}>Loan</div>
                                {/* New Balance (Loan) */}
                                <div style={{ position: 'absolute', left: '577.4px', width: '67.7px', top: '0px', textAlign: 'left' }}>New</div>
                                <div style={{ position: 'absolute', left: '577.4px', width: '67.7px', top: '11.92px', textAlign: 'left' }}>Balance</div>

                                {/* Exact 6 authentic Quadient underlines */}
                                <div style={{ position: 'absolute', left: '38.4px', width: '29.6px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                                <div style={{ position: 'absolute', left: '116.0px', width: '47.5px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                                <div style={{ position: 'absolute', left: '201.9px', width: '62.5px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                                <div style={{ position: 'absolute', left: '283.6px', width: '175.9px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                                <div style={{ position: 'absolute', left: '488.3px', width: '21.9px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                                <div style={{ position: 'absolute', left: '577.4px', width: '67.7px', top: '22.72px', height: '1.44px', backgroundColor: '#000000' }} />
                              </div>

                              {/* Account Rows */}
                              {summaryAccounts.map((acc, aIdx) => {
                                const rowTop = 26.73 + (aIdx * 11.933);
                                return (
                                  <div key={aIdx} style={{ position: 'absolute', left: '0px', top: `${rowTop}px`, width: '100%', height: '11.93px', fontWeight: '400' }}>
                                    <div style={{ position: 'absolute', left: '38.4px', width: '29.6px', textAlign: 'right', paddingRight: '4.5px' }}>{acc.acct}</div>
                                    <div style={{ position: 'absolute', left: '63.5px', width: '100px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(acc.newBalance)}</div>
                                    <div style={{ position: 'absolute', left: '201.9px', width: '62.5px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(acc.dividendsYtd)}</div>
                                    <div style={{ position: 'absolute', left: '283.6px', width: '175.9px', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap' }}>{acc.taxName || curCustomer.name}</div>
                                    <div style={{ position: 'absolute', left: '488.3px', width: '21.9px', textAlign: 'center' }}>{acc.loan || ''}</div>
                                    <div style={{ position: 'absolute', left: '577.4px', width: '67.7px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{acc.loanBalance ? fmt(acc.loanBalance) : ''}</div>
                                  </div>
                                );
                              })}

                              {/* Total Dividends YTD */}
                              {(() => {
                                const totTop = 26.73 + (summaryAccounts.length * 11.933);
                                return (
                                  <div style={{ position: 'absolute', left: '0px', top: `${totTop}px`, width: '100%', height: '11.93px', fontWeight: '700' }}>
                                    <div style={{ position: 'absolute', left: '19.2px', textAlign: 'left' }}>TOTAL DIVIDENDS YTD</div>
                                    <div style={{ position: 'absolute', left: '201.9px', width: '62.5px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalDividendsVal)}</div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* INQUIRIES ADDRESS BLOCK */}
                        <div style={{ marginTop: '19.0px', paddingLeft: '178px', fontSize: '12.0px', lineHeight: '13.41px', fontWeight: '700', color: '#000000' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '171px auto', alignItems: 'start' }}>
                            <div className="whitespace-nowrap">
                              <div>SEND ALL ROUTINE BUSINESS INQUIRES TO:</div>
                              <div style={{ height: '40.23px' }}></div>
                              <div>ALL OTHER INQUIRES TO:</div>
                            </div>
                            <div className="whitespace-nowrap">
                              <div style={{ height: '13.41px' }}></div>
                              <div>U S 1364 FEDERAL CREDIT UNION</div>
                              <div>8400 BROADWAY</div>
                              <div>MERRILLVILLE, IN  46410</div>
                              <div>SUPERVISORY COMMITTEE</div>
                              <div>U S 1364 FEDERAL CREDIT UNION</div>
                              <div>PO BOX 11342</div>
                              <div>MERRILLVILLE, IN  46411</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* CONTINUATION PAGE FOOTER */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '36.0px',
                        left: '0px',
                        width: '816px',
                        height: '11.2px',
                        color: '#003892',
                        fontSize: '11.2px',
                        fontWeight: '700',
                        letterSpacing: '0.02px',
                        lineHeight: '11.2px',
                        pointerEvents: 'none'
                      }}
                    >
                      <span style={{ position: 'absolute', left: '208.3px', whiteSpace: 'nowrap' }}>8400 Broadway, Merrillville, IN 46410</span>
                      <span style={{ position: 'absolute', left: '405.4px' }}>|</span>
                      <span style={{ position: 'absolute', left: '412.8px', whiteSpace: 'nowrap' }}>219-769-1700</span>
                      <span style={{ position: 'absolute', left: '490.2px' }}>|</span>
                      <span style={{ position: 'absolute', left: '497.6px', whiteSpace: 'nowrap' }}>www.usfederalcu.org</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
