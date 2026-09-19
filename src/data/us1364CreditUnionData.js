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
    memberNumber: '*******680',
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
