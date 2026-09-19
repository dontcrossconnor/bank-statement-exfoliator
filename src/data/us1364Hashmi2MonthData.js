/**
 * Authentic 2-Month Continuous Dataset for Dr. Sean Hasan Hashmi M.D.
 * Period 1: 08-01-26 THRU 08-31-26 (12 Share Draft transactions, 3 Regular Savings transactions)
 * Period 2: 09-01-26 THRU 09-30-26 (12 Share Draft transactions, 3 Regular Savings transactions)
 * Beginning Balance (Month 1): $213,719.05
 * Ending Balance (Month 2): $231,312.57
 * Employer / Direct Deposit Basis: Southern California Permanente Medical Group (SCPMG)
 * Paychecks: Advice #5218492 (08/21/2026), Advice #5223918 (09/04/2026) & Advice #5229344 (09/18/2026)
 */

export const US1364_HASHMI_2MONTH_DATA = {
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
    name: 'SEAN HASAN HASHMI',
    address: '2908 FISK LANE',
    cityStateZip: 'REDONDO BEACH CA 90278',
    memberNumber: '*******8378',
    microCode: '691'
  },
  statements: [
    {
      monthIndex: 0,
      statementMeta: {
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        displayPeriod: '08-01-26 THRU 08-31-26',
        displayEndingDate: '08-31-26'
      },
      customerInfo: {
        name: 'SEAN HASAN HASHMI',
        address: '2908 FISK LANE',
        cityStateZip: 'REDONDO BEACH CA 90278',
        memberNumber: '*******8378',
        microCode: '691'
      },
      regularSavings: {
        accountNumber: '8752',
        title: 'REGULAR SAVINGS',
        previousBalance: 50000.00,
        newBalance: 60005.12,
        transactions: [
          {
            date: '08/07',
            line1: 'SCPMG PAYROLL SAVINGS ALLOC',
            line2: 'DIRECT DEPOSIT ACC #8752',
            deposit: 5000.00,
            withdrawal: null,
            balance: 55000.00
          },
          {
            date: '08/21',
            line1: 'SCPMG PAYROLL SAVINGS ALLOC',
            line2: 'DIRECT DEPOSIT ACC #8752',
            deposit: 5000.00,
            withdrawal: null,
            balance: 60000.00
          },
          {
            date: '08/31',
            line1: 'DIVIDEND',
            line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 08-01-26 THRU 08-31-26 ON AVG. DAILY BALANCE OF 56,129.03 WAS 0.10%',
            deposit: 5.12,
            withdrawal: null,
            balance: 60005.12
          }
        ]
      },
      shareDraft: {
        accountNumber: '8378',
        title: 'SHARE DRAFT',
        previousBalance: 213719.05,
        newBalance: 221536.65,
        page1Transactions: [
          {
            date: '08/01',
            line1: 'MOD PIZZA #0491 REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -15.30,
            balance: 213703.75
          },
          {
            date: '08/03',
            line1: 'TESLA FINANCE DIRECT DEBIT ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -967.50,
            balance: 212736.25
          },
          {
            date: '08/07',
            line1: 'SCPMG PAYROLL DIR DEP',
            line2: 'ADVICE #5213076',
            deposit: 13233.35,
            withdrawal: null,
            balance: 225969.60
          },
          {
            date: '08/10',
            line1: 'MERCEDES-BENZ FINANCIAL SERVICES ACH ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -1212.67,
            balance: 224756.93
          },
          {
            date: '08/14',
            line1: 'FIRST REPUBLIC MTG DIRECT DEBIT ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -5493.01,
            balance: 219263.92
          }
        ],
        page2Transactions: [
          {
            date: '08/18',
            line1: 'LA FITNESS MEMBERSHIP PPD REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -116.18,
            balance: 219147.74
          },
          {
            date: '08/21',
            line1: 'SCPMG PAYROLL DIR DEP',
            line2: 'ADVICE #5218492',
            deposit: 14091.25,
            withdrawal: null,
            balance: 233238.99
          },
          {
            date: '08/24',
            line1: "COOPER'S HAWK WINERY WOODLAND HILLS, CA",
            line2: null,
            deposit: null,
            withdrawal: -184.69,
            balance: 233054.30
          },
          {
            date: '08/25',
            line1: 'CVS PHARMACY #04921 REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -104.68,
            balance: 232949.62
          },
          {
            date: '08/26',
            line1: 'CITI CARD ONLINE PAYMENT ACH',
            line2: null,
            deposit: null,
            withdrawal: -5781.57,
            balance: 227168.05
          },
          {
            date: '08/28',
            line1: 'UPTODATE WOLTERS KLUWER HEALTH',
            line2: null,
            deposit: null,
            withdrawal: -1344.45,
            balance: 225823.60
          },
          {
            date: '08/29',
            line1: 'MEDICAL BOARD OF CA LICENSURE PPD',
            line2: null,
            deposit: null,
            withdrawal: -4286.95,
            balance: 221536.65
          }
        ]
      },
      summaryOfAccounts: {
        regularSavings: 60005.12,
        shareDraft: 221536.65,
        totalShareBalances: 281541.77
      },
      statementSummary: {
        accounts: [
          {
            acct: '8752',
            newBalance: 60005.12,
            dividendsYtd: 24.08,
            taxName: 'SEAN HASAN HASHMI'
          },
          {
            acct: '8378',
            newBalance: 221536.65,
            dividendsYtd: 0.00,
            taxName: 'SEAN HASAN HASHMI'
          }
        ],
        totalDividendsYtd: 24.08
      }
    },
    {
      monthIndex: 1,
      statementMeta: {
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        displayPeriod: '09-01-26 THRU 09-30-26',
        displayEndingDate: '09-30-26'
      },
      customerInfo: {
        name: 'SEAN HASAN HASHMI',
        address: '2908 FISK LANE',
        cityStateZip: 'REDONDO BEACH CA 90278',
        memberNumber: '*******8378',
        microCode: '691'
      },
      regularSavings: {
        accountNumber: '8752',
        title: 'REGULAR SAVINGS',
        previousBalance: 60005.12,
        newBalance: 70011.04,
        transactions: [
          {
            date: '09/04',
            line1: 'SCPMG PAYROLL SAVINGS ALLOC',
            line2: 'DIRECT DEPOSIT ACC #8752',
            deposit: 5000.00,
            withdrawal: null,
            balance: 65005.12
          },
          {
            date: '09/18',
            line1: 'SCPMG PAYROLL SAVINGS ALLOC',
            line2: 'DIRECT DEPOSIT ACC #8752',
            deposit: 5000.00,
            withdrawal: null,
            balance: 70005.12
          },
          {
            date: '09/30',
            line1: 'DIVIDEND',
            line2: 'ANNUAL PERCENTAGE YIELD EARNED FROM 09-01-26 THRU 09-30-26 ON AVG. DAILY BALANCE OF 66,333.33 WAS 0.10%',
            deposit: 5.92,
            withdrawal: null,
            balance: 70011.04
          }
        ]
      },
      shareDraft: {
        accountNumber: '8378',
        title: 'SHARE DRAFT',
        previousBalance: 221536.65,
        newBalance: 231312.57,
        page1Transactions: [
          {
            date: '09/01',
            line1: 'MINUTECLINIC PAYMENT REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -34.03,
            balance: 221502.62
          },
          {
            date: '09/03',
            line1: 'TESLA FINANCE DIRECT DEBIT ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -967.50,
            balance: 220535.12
          },
          {
            date: '09/04',
            line1: 'SCPMG PAYROLL DIR DEP',
            line2: 'ADVICE #5223918',
            deposit: 13233.35,
            withdrawal: null,
            balance: 233768.47
          },
          {
            date: '09/05',
            line1: 'MERCEDES-BENZ FINANCIAL SERVICES ACH ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -1212.67,
            balance: 232555.80
          },
          {
            date: '09/08',
            line1: 'MOD PIZZA #0491 REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -12.70,
            balance: 232543.10
          }
        ],
        page2Transactions: [
          {
            date: '09/14',
            line1: 'FIRST REPUBLIC MTG DIRECT DEBIT ACH PMT',
            line2: null,
            deposit: null,
            withdrawal: -5493.01,
            balance: 227050.09
          },
          {
            date: '09/16',
            line1: 'ROSS DRESS FOR LESS #38 REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -255.13,
            balance: 226794.96
          },
          {
            date: '09/18',
            line1: 'SCPMG PAYROLL DIR DEP',
            line2: 'ADVICE #5229344',
            deposit: 14091.25,
            withdrawal: null,
            balance: 240886.21
          },
          {
            date: '09/21',
            line1: 'LA FITNESS MEMBERSHIP PPD REDONDO BEACH, CA',
            line2: null,
            deposit: null,
            withdrawal: -116.18,
            balance: 240770.03
          },
          {
            date: '09/24',
            line1: 'UPTODATE WOLTERS KLUWER HEALTH',
            line2: null,
            deposit: null,
            withdrawal: -1344.45,
            balance: 239425.58
          },
          {
            date: '09/26',
            line1: 'CITI CARD ONLINE PAYMENT ACH',
            line2: null,
            deposit: null,
            withdrawal: -5781.57,
            balance: 233644.01
          },
          {
            date: '09/29',
            line1: 'AMERICAN COLLEGE OF PHYSICIANS DUES',
            line2: null,
            deposit: null,
            withdrawal: -2331.44,
            balance: 231312.57
          }
        ]
      },
      summaryOfAccounts: {
        regularSavings: 70011.04,
        shareDraft: 231312.57,
        totalShareBalances: 301323.61
      },
      statementSummary: {
        accounts: [
          {
            acct: '8752',
            newBalance: 70011.04,
            dividendsYtd: 30.00,
            taxName: 'SEAN HASAN HASHMI'
          },
          {
            acct: '8378',
            newBalance: 231312.57,
            dividendsYtd: 0.00,
            taxName: 'SEAN HASAN HASHMI'
          }
        ],
        totalDividendsYtd: 30.00
      }
    }
  ]
};
