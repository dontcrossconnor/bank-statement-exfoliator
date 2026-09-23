/**
 * Authentic 1:1 Dataset for US 1364 Federal Credit Union
 * Statement Period: 07-01-26 THRU 07-31-26
 * Member: AZIZ BERJIS
 * Extracted from: US_1364_FCU_Statement_July_2026_Aziz_Berjis (2) (2).pdf
 */

export const US1364_AZIZ_BERJIS_JULY_2026_DATA = {
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
    name: 'AZIZ BERJIS',
    address: '15729  SUTTON ST',
    cityStateZip: 'ENCINO, CA 91436-3406',
    memberNumber: '********680',
    microCode: '692'
  },
  statementMeta: {
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    displayPeriod: '07-01-26 THRU 07-31-26',
    displayEndingDate: '07-31-26',
    creationDate: 'D:20260921131313Z'
  },
  accounts: {
    regularSavings: {
      accountNumber: '1',
      title: 'REGULAR SAVINGS',
      previousBalance: 302250.45,
      newBalance: 350144.42,
      apy: '0.10%',
      avgDailyBalance: 347695.54,
      dividendsYtd: 179.41,
      transactions: [
        {
          date: '07/01',
          line1: 'DEPOSIT',
          line2: 'NATIONWIDE, CHASE# 1026858194, BERJIS, AFFINITY PLUS CU#131',
          deposit: 1664.44,
          withdrawal: null,
          balance: 303914.89
        },
        {
          date: '07/02',
          line1: 'TRANSFER 1',
          line2: null,
          deposit: 45000.00,
          withdrawal: null,
          balance: 348914.89
        },
        {
          date: '07/27',
          line1: 'DEPOSIT affinity plus cu 999016',
          line2: null,
          deposit: 1200.00,
          withdrawal: null,
          balance: 350114.89
        },
        {
          date: '07/31',
          line1: 'DIVIDEND',
          line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 07-01-26 THRU 07-31-26 ON AVG. DAILY BALANCE OF 347,695.54 WAS 0.10%',
          deposit: 29.53,
          withdrawal: null,
          balance: 350144.42
        }
      ]
    },
    shareDraft: {
      accountNumber: '2',
      title: 'SHARE DRAFT',
      previousBalance: 50731.57,
      newBalance: 10141.31,
      dividendsYtd: 0.00,
      page1Transactions: [
        {
          date: '07/01',
          line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT ACH PMT 260701',
          line2: null,
          deposit: null,
          withdrawal: -1444.57,
          balance: 49287.00
        },
        {
          date: '07/02',
          line1: 'TRANSFER 1',
          line2: null,
          deposit: null,
          withdrawal: -45000.00,
          balance: 4287.00
        },
        {
          date: '07/06',
          line1: 'WITHDRAWAL',
          line2: '0706 1125 912892 405 PORTERS VALE BL VALPARAISO IN',
          deposit: null,
          withdrawal: -40.00,
          balance: 4247.00
        },
        {
          date: '07/13',
          line1: 'EFT ACH TRANSACTION H & J Real EstatWEB PMTS 071326',
          line2: null,
          deposit: null,
          withdrawal: -256.97,
          balance: 3990.03
        },
        {
          date: '07/13',
          line1: 'EFT DISCOVER DISCOVER E-PAYMENT 260711',
          line2: null,
          deposit: null,
          withdrawal: -788.45,
          balance: 3201.58
        }
      ],
      page2Transactions: [
        {
          date: '07/14',
          line1: 'DEPOSIT',
          line2: 'CHRLES SCHWAB TRUST BANK CHK0010264432',
          deposit: 7124.42,
          withdrawal: null,
          balance: 10326.00
        },
        {
          date: '07/17',
          line1: 'EFT CHASE CHASE CREDIT CRDAUTOPAY 260717',
          line2: null,
          deposit: null,
          withdrawal: -184.69,
          balance: 10141.31
        }
      ]
    }
  },
  summaryOfAccounts: {
    regularSavings: 350144.42,
    shareDraft: 10141.31,
    totalShareBalances: 360285.73
  },
  statementSummary: [
    {
      acct: '1',
      newBalance: 350144.42,
      dividendsYtd: 179.41,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    },
    {
      acct: '2',
      newBalance: 10141.31,
      dividendsYtd: 0.00,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    }
  ],
  totalDividendsYtd: 179.41
};

export const US1364_AZIZ_BERJIS_AUGUST_2026_DATA = {
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
    name: 'AZIZ BERJIS',
    address: '15729  SUTTON ST',
    cityStateZip: 'ENCINO, CA 91436-3406',
    memberNumber: '********680',
    microCode: '693'
  },
  statementMeta: {
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    displayPeriod: '08-01-26 THRU 08-31-26',
    displayEndingDate: '08-31-26',
    creationDate: 'D:20260921131427Z'
  },
  accounts: {
    regularSavings: {
      accountNumber: '1',
      title: 'REGULAR SAVINGS',
      previousBalance: 350144.42,
      newBalance: 353038.76,
      apy: '0.10%',
      avgDailyBalance: 352041.12,
      dividendsYtd: 209.31,
      transactions: [
        {
          date: '08/03',
          line1: 'DEPOSIT',
          line2: 'NATIONWIDE, CHASE# 1026858194, BERJIS, AFFINITY PLUS CU#131',
          deposit: 1664.44,
          withdrawal: null,
          balance: 351808.86
        },
        {
          date: '08/26',
          line1: 'DEPOSIT affinity plus cu 999016',
          line2: null,
          deposit: 1200.00,
          withdrawal: null,
          balance: 353008.86
        },
        {
          date: '08/31',
          line1: 'DIVIDEND',
          line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 08-01-26 THRU 08-31-26 ON AVG. DAILY BALANCE OF 352,041.12 WAS 0.10%',
          deposit: 29.90,
          withdrawal: null,
          balance: 353038.76
        }
      ]
    },
    shareDraft: {
      accountNumber: '2',
      title: 'SHARE DRAFT',
      previousBalance: 10141.31,
      newBalance: 12161.20,
      dividendsYtd: 0.00,
      page1Transactions: [
        {
          date: '08/03',
          line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT ACH PMT 260801',
          line2: null,
          deposit: null,
          withdrawal: -3184.52,
          balance: 6956.79
        },
        {
          date: '08/13',
          line1: 'EFT ACH TRANSACTION H & J Real EstatWEB PMTS 081326',
          line2: null,
          deposit: null,
          withdrawal: -256.97,
          balance: 6699.82
        },
        {
          date: '08/13',
          line1: 'EFT DISCOVER DISCOVER E-PAYMENT 260811',
          line2: null,
          deposit: null,
          withdrawal: -1478.35,
          balance: 5221.47
        }
      ],
      page2Transactions: [
        {
          date: '08/14',
          line1: 'DEPOSIT',
          line2: 'CHRLES SCHWAB TRUST BANK CHK0010264432',
          deposit: 7124.42,
          withdrawal: null,
          balance: 12345.89
        },
        {
          date: '08/18',
          line1: 'EFT CHASE CHASE CREDIT CRDAUTOPAY 260817',
          line2: null,
          deposit: null,
          withdrawal: -184.69,
          balance: 12161.20
        }
      ]
    }
  },
  summaryOfAccounts: {
    regularSavings: 353038.76,
    shareDraft: 12161.20,
    totalShareBalances: 365199.96
  },
  statementSummary: [
    {
      acct: '1',
      newBalance: 353038.76,
      dividendsYtd: 209.31,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    },
    {
      acct: '2',
      newBalance: 12161.20,
      dividendsYtd: 0.00,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    }
  ],
  totalDividendsYtd: 209.31
};

export const US1364_AZIZ_BERJIS_JUNE_2026_DATA = {
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
    name: 'AZIZ BERJIS',
    address: '15729  SUTTON ST',
    cityStateZip: 'ENCINO, CA 91436-3406',
    memberNumber: '********680',
    microCode: '691'
  },
  statementMeta: {
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    displayPeriod: '06-01-26 THRU 06-30-26',
    displayEndingDate: '06-30-26',
    creationDate: 'D:20260921131215Z'
  },
  accounts: {
    regularSavings: {
      accountNumber: '1',
      title: 'REGULAR SAVINGS',
      previousBalance: 299361.25,
      newBalance: 302250.45,
      apy: '0.10%',
      avgDailyBalance: 301225.69,
      dividendsYtd: 149.88,
      transactions: [
        {
          date: '06/01',
          line1: 'DEPOSIT',
          line2: 'NATIONWIDE, CHASE# 1026858194, BERJIS, AFFINITY PLUS CU#131',
          deposit: 1664.44,
          withdrawal: null,
          balance: 301025.69
        },
        {
          date: '06/26',
          line1: 'DEPOSIT affinity plus cu 999016',
          line2: null,
          deposit: 1200.00,
          withdrawal: null,
          balance: 302225.69
        },
        {
          date: '06/30',
          line1: 'DIVIDEND',
          line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 06-01-26 THRU 06-30-26 ON AVG. DAILY BALANCE OF 301,225.69 WAS 0.10%',
          deposit: 24.76,
          withdrawal: null,
          balance: 302250.45
        }
      ]
    },
    shareDraft: {
      accountNumber: '2',
      title: 'SHARE DRAFT',
      previousBalance: 48012.04,
      newBalance: 50731.57,
      dividendsYtd: 0.00,
      page1Transactions: [
        {
          date: '06/01',
          line1: 'EFT AMERICAN EXPRESS AMEX EPAYMENT ACH PMT 260601',
          line2: null,
          deposit: null,
          withdrawal: -2185.34,
          balance: 45826.70
        },
        {
          date: '06/12',
          line1: 'EFT ACH TRANSACTION H & J Real EstatWEB PMTS 061326',
          line2: null,
          deposit: null,
          withdrawal: -256.97,
          balance: 45569.73
        },
        {
          date: '06/12',
          line1: 'EFT DISCOVER DISCOVER E-PAYMENT 260611',
          line2: null,
          deposit: null,
          withdrawal: -1643.18,
          balance: 43926.55
        }
      ],
      page2Transactions: [
        {
          date: '06/15',
          line1: 'DEPOSIT',
          line2: 'CHRLES SCHWAB TRUST BANK CHK0010264432',
          deposit: 7124.42,
          withdrawal: null,
          balance: 51050.97
        },
        {
          date: '06/18',
          line1: 'EFT CHASE CHASE CREDIT CRDAUTOPAY 260617',
          line2: null,
          deposit: null,
          withdrawal: -319.40,
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
      dividendsYtd: 149.88,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    },
    {
      acct: '2',
      newBalance: 50731.57,
      dividendsYtd: 0.00,
      taxName: 'AZIZ BERJIS',
      loan: null,
      loanBalance: null
    }
  ],
  totalDividendsYtd: 149.88
};
