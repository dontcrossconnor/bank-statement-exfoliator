/**
 * 1:1 Authentic Dataset for US 1364 Federal Credit Union
 * Statement Period: 11-01-24 THRU 11-30-24
 * Member: WILLIAM J NEWMAN
 */

export const US1364_CREDIT_UNION_DATA = {
  institution: {
    id: 'us_1364_cu',
    name: 'US 1364 FEDERAL CREDIT UNION',
    shortName: 'US 1364 FCU',
    charter: 'NCUA Charter #01364',
    routingNumber: '271987654',
    customerServicePhone: '219-769-1700',
    website: 'www.usfederalcu.org',
    primaryColor: '#003892',
    accentColor: '#0e64ff',
    tableHeaderColor: '#1129a2',
    altRowColor: '#adcbff',
    address: '8400 Broadway, Merrillville, IN 46410',
    supervisoryAddress: 'PO BOX 11342, MERRILLVILLE, IN 46411',
    type: 'Credit Union'
  },
  customerInfo: {
    name: 'WILLIAM J NEWMAN',
    address: '404 STURDY RD APT A7',
    cityStateZip: 'VALPARAISO IN 46383-5302',
    memberNumber: '********680',
    microCode: '691'
  },
  statementMeta: {
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    displayPeriod: '11-01-24 THRU 11-30-24',
    displayEndingDate: '11-30-24'
  },
  accounts: {
    regularSavings: {
      accountNumber: '1',
      title: 'REGULAR SAVINGS',
      previousBalance: 302250.45,
      newBalance: 360666.60,
      apy: '0.10%',
      avgDailyBalance: 350781.56,
      dividendsYtd: 277.87,
      transactions: [
        {
          date: '11/01',
          line1: 'DEPOSIT',
          line2: 'NATIONWIDE, CHASE#1026858194,MURPHY, AFFINITY PLUS CU#131',
          deposit: 1664.44,
          withdrawal: null,
          balance: 303914.89
        },
        {
          date: '11/01',
          line1: 'TRANSFER 2',
          line2: null,
          deposit: 45000.00,
          withdrawal: null,
          balance: 348914.89
        },
        {
          date: '11/26',
          line1: 'DEPOSIT affinity plus cu 999016',
          line2: null,
          deposit: 1200.00,
          withdrawal: null,
          balance: 350114.89
        },
        {
          date: '11/26',
          line1: 'TRANSFER 2',
          line2: null,
          deposit: 10000.00,
          withdrawal: null,
          balance: 360114.89
        },
        {
          date: '12/02E',
          line1: 'EFT BENEFIT PAYMENTS BENEFIT PAYMENTDEPOSIT',
          line2: null,
          deposit: 522.96,
          withdrawal: null,
          balance: 360637.85
        },
        {
          date: '11/30',
          line1: 'DIVIDEND',
          line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 11-01-24 THRU 11-30-24 ON AVG. DAILY BALANCE OF 350,781.56 WAS 0.10%',
          deposit: 28.75,
          withdrawal: null,
          balance: 360666.60
        }
      ]
    },
    shareDraft: {
      accountNumber: '2',
      title: 'SHARE DRAFT',
      previousBalance: 50731.57,
      newBalance: 3062.98,
      dividendsYtd: 0.00,
      page1Transactions: [
        {
          date: '11/01',
          line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT ACH PMT 241101',
          line2: null,
          deposit: null,
          withdrawal: -1444.57,
          balance: 49287.00
        },
        {
          date: '11/01',
          line1: 'TRANSFER 1',
          line2: null,
          deposit: null,
          withdrawal: -45000.00,
          balance: 4287.00
        },
        {
          date: '11/05',
          line1: 'WITHDRAWAL',
          line2: '1105 1125 912892 405 PORTERS VALE BL VALPARAISO IN',
          deposit: null,
          withdrawal: -40.00,
          balance: 4247.00
        },
        {
          date: '11/13',
          line1: 'EFT ACH TRANSACTION H & J Real EstatWEB PMTS 111324',
          line2: null,
          deposit: null,
          withdrawal: -256.97,
          balance: 3990.03
        },
        {
          date: '11/13',
          line1: 'EFT DISCOVER DISCOVER E-PAYMENT 241111',
          line2: null,
          deposit: null,
          withdrawal: -788.45,
          balance: 3201.58
        }
      ],
      page2Transactions: [
        {
          date: '11/14',
          line1: 'DEPOSIT',
          line2: 'CHRLES SCHWAB TRUST BANK CHK0010264432 BANK OF AMERICA',
          deposit: 7124.42,
          withdrawal: null,
          balance: 10326.00
        },
        {
          date: '11/18',
          line1: 'EFT CHASE CHASE CREDIT CRDAUTOPAY 241117',
          line2: null,
          deposit: null,
          withdrawal: -184.69,
          balance: 10141.31
        },
        {
          date: '11/20E',
          line1: 'EFT SSA TREAS 310 SSA TREAS 310 XXSOC SEC 112024',
          line2: null,
          deposit: 3066.00,
          withdrawal: null,
          balance: 13207.31
        },
        {
          date: '11/20',
          line1: 'EFT ACH TRANSACTION NIPSCO ACCOUNTS BILLPAY 241119',
          line2: null,
          deposit: null,
          withdrawal: -44.33,
          balance: 13162.98
        },
        {
          date: '11/21',
          line1: 'WITHDRAWAL',
          line2: '1121 1144 120691 405 PORTERS VALE BL VALPARAISO IN',
          deposit: null,
          withdrawal: -60.00,
          balance: 13102.98
        },
        {
          date: '11/26',
          line1: 'WITHDRAWAL',
          line2: '1126 0939 185968 405 PORTERS VALE BL VALPARAISO IN',
          deposit: null,
          withdrawal: -40.00,
          balance: 13062.98
        },
        {
          date: '11/26',
          line1: 'TRANSFER 1',
          line2: null,
          deposit: null,
          withdrawal: -10000.00,
          balance: 3062.98
        }
      ]
    }
  },
  summaryOfAccounts: {
    regularSavings: 360666.60,
    shareDraft: 3062.98,
    totalShareBalances: 363729.58
  },
  statementSummary: [
    {
      acct: '1',
      newBalance: 360666.60,
      dividendsYtd: 277.87,
      taxName: 'WILLIAM J NEWMAN',
      loan: null,
      loanBalance: null
    },
    {
      acct: '2',
      newBalance: 3062.98,
      dividendsYtd: 0.00,
      taxName: 'WILLIAM J NEWMAN',
      loan: null,
      loanBalance: null
    }
  ],
  totalDividendsYtd: 277.87
};

/**
 * Multi-scenario test presets for automated testing and manual entry validation
 */
export const US1364_TEST_SCENARIOS = {
  // Scenario 1: Canonical November 2024
  november2024: US1364_CREDIT_UNION_DATA,

  // Scenario 2: Light transaction volume
  lightVolume: {
    ...US1364_CREDIT_UNION_DATA,
    statementMeta: {
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      displayPeriod: '10-01-24 THRU 10-31-24',
      displayEndingDate: '10-31-24'
    },
    accounts: {
      regularSavings: {
        accountNumber: '1',
        title: 'REGULAR SAVINGS',
        previousBalance: 300000.00,
        newBalance: 302250.45,
        apy: '0.10%',
        avgDailyBalance: 301000.00,
        dividendsYtd: 249.12,
        transactions: [
          {
            date: '10/15',
            line1: 'DEPOSIT PAYROLL DIRECT DEP',
            line2: null,
            deposit: 2225.70,
            withdrawal: null,
            balance: 302225.70
          },
          {
            date: '10/31',
            line1: 'DIVIDEND',
            line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 10-01-24 THRU 10-31-24 ON AVG. DAILY BALANCE OF 301,000.00 WAS 0.10%',
            deposit: 24.75,
            withdrawal: null,
            balance: 302250.45
          }
        ]
      },
      shareDraft: {
        accountNumber: '2',
        title: 'SHARE DRAFT',
        previousBalance: 52431.57,
        newBalance: 50731.57,
        dividendsYtd: 0.00,
        transactions: [
          {
            date: '10/05',
            line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT ACH PMT 241005',
            line2: null,
            deposit: null,
            withdrawal: -1200.00,
            balance: 51231.57
          },
          {
            date: '10/12',
            line1: 'WITHDRAWAL',
            line2: '1012 1125 912892 405 PORTERS VALE BL VALPARAISO IN',
            deposit: null,
            withdrawal: -500.00,
            balance: 50731.57
          }
        ]
      }
    },
    summaryOfAccounts: {
      regularSavings: 302250.45,
      shareDraft: 50731.57,
      totalShareBalances: 352982.02
    },
    statementSummary: [
      {
        acct: '1',
        newBalance: 302250.45,
        dividendsYtd: 249.12,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      },
      {
        acct: '2',
        newBalance: 50731.57,
        dividendsYtd: 0.00,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      }
    ],
    totalDividendsYtd: 249.12
  },

  // Scenario 3: Heavy transaction volume (spills into Page 3 cleanly)
  heavyVolume3Page: {
    ...US1364_CREDIT_UNION_DATA,
    accounts: {
      ...US1364_CREDIT_UNION_DATA.accounts,
      shareDraft: {
        accountNumber: '2',
        title: 'SHARE DRAFT',
        previousBalance: 50731.57,
        newBalance: 1542.18,
        dividendsYtd: 0.00,
        // 28 transactions: Page 1 takes 5, Page 2 takes ~18, Page 3 takes remaining + Statement Summary
        transactions: [
          { date: '11/01', line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT', line2: null, deposit: null, withdrawal: -1444.57, balance: 49287.00 },
          { date: '11/01', line1: 'TRANSFER 1', line2: null, deposit: null, withdrawal: -20000.00, balance: 29287.00 },
          { date: '11/02', line1: 'WITHDRAWAL ATM VALPO', line2: '1102 405 PORTERS VALE BL VALPARAISO IN', deposit: null, withdrawal: -100.00, balance: 29187.00 },
          { date: '11/03', line1: 'EFT ACH TRANSACTION NIPSCO', line2: null, deposit: null, withdrawal: -84.20, balance: 29102.80 },
          { date: '11/04', line1: 'EFT DISCOVER E-PAYMENT', line2: null, deposit: null, withdrawal: -450.00, balance: 28652.80 },
          { date: '11/05', line1: 'DEPOSIT CHECK 8812', line2: 'MOBILE REMOTE DEPOSIT', deposit: 2500.00, withdrawal: null, balance: 31152.80 },
          { date: '11/06', line1: 'WITHDRAWAL POS MEIJER #142', line2: null, deposit: null, withdrawal: -164.32, balance: 30988.48 },
          { date: '11/07', line1: 'WITHDRAWAL POS STRACK & VAN TIL', line2: null, deposit: null, withdrawal: -89.15, balance: 30899.33 },
          { date: '11/08', line1: 'EFT COMCAST CABLE BILLPAY', line2: null, deposit: null, withdrawal: -125.00, balance: 30774.33 },
          { date: '11/09', line1: 'WITHDRAWAL ATM VALPO', line2: '1109 405 PORTERS VALE BL VALPARAISO IN', deposit: null, withdrawal: -60.00, balance: 30714.33 },
          { date: '11/10', line1: 'EFT CHASE CREDIT CRDAUTOPAY', line2: null, deposit: null, withdrawal: -850.00, balance: 29864.33 },
          { date: '11/12', line1: 'DEPOSIT ACH PAYROLL SSA', line2: null, deposit: 3066.00, withdrawal: null, balance: 32930.33 },
          { date: '11/13', line1: 'EFT AUTO INSURANCE GEICO', line2: null, deposit: null, withdrawal: -178.40, balance: 32751.93 },
          { date: '11/14', line1: 'WITHDRAWAL POS TARGET #089', line2: null, deposit: null, withdrawal: -64.18, balance: 32687.75 },
          { date: '11/15', line1: 'TRANSFER TO SAVINGS 1', line2: null, deposit: null, withdrawal: -15000.00, balance: 17687.75 },
          { date: '11/16', line1: 'WITHDRAWAL POS WALGREENS', line2: null, deposit: null, withdrawal: -32.50, balance: 17655.25 },
          { date: '11/17', line1: 'WITHDRAWAL POS SPEEDWAY #21', line2: null, deposit: null, withdrawal: -45.00, balance: 17610.25 },
          { date: '11/18', line1: 'EFT WATER UTILITY VALPARAISO', line2: null, deposit: null, withdrawal: -54.30, balance: 17555.95 },
          { date: '11/19', line1: 'WITHDRAWAL ATM VALPO', line2: '1119 405 PORTERS VALE BL VALPARAISO IN', deposit: null, withdrawal: -40.00, balance: 17515.95 },
          { date: '11/20', line1: 'EFT GAS UTILITY NIPSCO', line2: null, deposit: null, withdrawal: -98.15, balance: 17417.80 },
          { date: '11/21', line1: 'TRANSFER TO SHARES', line2: null, deposit: null, withdrawal: -10000.00, balance: 7417.80 },
          { date: '11/22', line1: 'WITHDRAWAL POS ALDI #44', line2: null, deposit: null, withdrawal: -76.20, balance: 7341.60 },
          { date: '11/23', line1: 'EFT HEALTH PMT LAB CORP', line2: null, deposit: null, withdrawal: -112.00, balance: 7229.60 },
          { date: '11/24', line1: 'WITHDRAWAL POS BP OIL', line2: null, deposit: null, withdrawal: -42.00, balance: 7187.60 },
          { date: '11/25', line1: 'WITHDRAWAL POS HOME DEPOT', line2: null, deposit: null, withdrawal: -234.50, balance: 6953.10 },
          { date: '11/26', line1: 'TRANSFER 1', line2: null, deposit: null, withdrawal: -5000.00, balance: 1953.10 },
          { date: '11/28', line1: 'WITHDRAWAL POS MENARDS', line2: null, deposit: null, withdrawal: -320.92, balance: 1632.18 },
          { date: '11/30', line1: 'WITHDRAWAL MONTHLY SERVICE FEE', line2: null, deposit: null, withdrawal: -90.00, balance: 1542.18 }
        ]
      }
    },
    summaryOfAccounts: {
      regularSavings: 360666.60,
      shareDraft: 1542.18,
      totalShareBalances: 362208.78
    },
    statementSummary: [
      {
        acct: '1',
        newBalance: 360666.60,
        dividendsYtd: 277.87,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      },
      {
        acct: '2',
        newBalance: 1542.18,
        dividendsYtd: 0.00,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      }
    ],
    totalDividendsYtd: 277.87
  },

  // Scenario 4: Massive 42-transaction volume (forces 3rd page cleanly)
  massiveVolume42Tx: {
    ...US1364_CREDIT_UNION_DATA,
    accounts: {
      ...US1364_CREDIT_UNION_DATA.accounts,
      shareDraft: {
        accountNumber: '2',
        title: 'SHARE DRAFT',
        previousBalance: 50731.57,
        newBalance: 812.45,
        dividendsYtd: 0.00,
        transactions: Array.from({ length: 42 }, (_, i) => {
          const day = String(Math.min(30, Math.floor(i / 1.5) + 1)).padStart(2, '0');
          const isDeposit = i % 8 === 0;
          const amt = isDeposit ? 1500.00 : 85.50;
          return {
            date: `11/${day}`,
            line1: isDeposit ? `DEPOSIT PAYROLL BATCH #${1000 + i}` : `EFT PURCHASE TRANSACTION #${2000 + i}`,
            line2: i % 4 === 0 ? `TRACE ID ${900000 + i} VALPARAISO IN` : null,
            deposit: isDeposit ? amt : null,
            withdrawal: isDeposit ? null : -amt,
            balance: 50731.57 - (i * 50)
          };
        })
      }
    },
    summaryOfAccounts: {
      regularSavings: 360666.60,
      shareDraft: 812.45,
      totalShareBalances: 361479.05
    },
    statementSummary: [
      {
        acct: '1',
        newBalance: 360666.60,
        dividendsYtd: 277.87,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      },
      {
        acct: '2',
        newBalance: 812.45,
        dividendsYtd: 0.00,
        taxName: 'WILLIAM J NEWMAN',
        loan: null,
        loanBalance: null
      }
    ],
    totalDividendsYtd: 277.87
  }
};

