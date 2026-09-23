import { US1364_HASHMI_2MONTH_DATA } from './us1364Hashmi2MonthData.js';
import { US1364_CREDIT_UNION_DATA, US1364_TEST_SCENARIOS } from './us1364CreditUnionData.js';
import { US1364_AZIZ_BERJIS_JULY_2026_DATA, US1364_AZIZ_BERJIS_AUGUST_2026_DATA, US1364_AZIZ_BERJIS_JUNE_2026_DATA } from './us1364AzizBerjisData.js';

export const INSTITUTIONS = {
  // Commercial Banks
  apex_national: {
    id: 'apex_national',
    name: 'APEX NATIONAL BANK',
    shortName: 'Apex Bank',
    tagline: 'America\'s Trusted Financial Partner',
    type: 'Bank',
    charter: 'FDIC Insured Charter #48921',
    routingNumber: '121000358',
    customerServicePhone: '1-800-555-2739',
    website: 'www.apexnationalbank.com',
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    secondaryColor: '#38bdf8',
    logoText: 'APEX',
    logoSubtext: 'NATIONAL BANK',
    fontFamily: 'Helvetica, Arial, sans-serif',
    headingFont: 'Helvetica, Arial, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'FDIC',
    regulatoryNotice: 'Equal Housing Lender. Member FDIC. Funds in Apex National Bank deposit accounts are insured up to $250,000 per depositor.',
    address: '100 Financial Center Blvd, Suite 400, Charlotte, NC 28202',
    pdfMetadata: {
      title: 'Apex National Bank Monthly Account Statement',
      subject: 'Monthly Financial Account Statement',
      author: 'Apex National Bank Core Enterprise Reporting Engine (v8.4)',
      creator: 'Apex Core Bank DocEngine / PDFlib 15.0',
      producer: 'Adobe PDF Library 15.0 / Core Financial Exporter',
      keywords: 'Apex Bank, Statement, Checking, FDIC, Reg DD'
    }
  },
  chase_sim: {
    id: 'chase_sim',
    name: 'CHASE MANHATTAN BANK N.A.',
    shortName: 'Chase Bank',
    tagline: 'Make More of What\'s Yours',
    type: 'Bank',
    charter: 'OCC Charter #00002',
    routingNumber: '021000021',
    customerServicePhone: '1-800-935-9935',
    website: 'www.chase.com',
    primaryColor: '#114b78',
    accentColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    logoText: 'CHASE',
    logoSubtext: 'BANK N.A.',
    fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
    headingFont: 'Open Sans, Arial, Helvetica, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'FDIC',
    regulatoryNotice: 'Member FDIC. Equal Housing Lender. Deposits insured up to $250,000.',
    address: '270 Park Avenue, New York, NY 10017',
    pdfMetadata: {
      title: 'Chase Total Checking Statement',
      subject: 'Monthly Account Statement',
      author: 'JPMorgan Chase Bank, N.A. Automated Document Services',
      creator: 'Chase Online Statement Generator System (v24.1)',
      producer: 'OpenText Exstream PDF Engine v16.6'
    }
  },
  bofa_sim: {
    id: 'bofa_sim',
    name: 'BANK OF AMERICA N.A.',
    shortName: 'Bank of America',
    tagline: 'What Would You Like the Power to Do?',
    type: 'Bank',
    charter: 'OCC Charter #13044',
    routingNumber: '053000196',
    customerServicePhone: '1-800-432-1000',
    website: 'www.bankofamerica.com',
    primaryColor: '#d97706',
    accentColor: '#dc2626',
    secondaryColor: '#1e40af',
    logoText: 'BOFA',
    logoSubtext: 'BANK OF AMERICA',
    // 1:1 Authentic Bank of America Proprietary Brand Font Specs ("Connections" / Connections Sans)
    fontFamily: '"Connections Sans", "Connections", Arial, sans-serif',
    headingFont: '"Connections", "Connections Sans", Arial, sans-serif',
    monoFont: '"Connections Mono", "Courier New", Courier, monospace',
    pdfFontName: 'Connections-Regular', // Embedded PDF Font Name
    regulatoryBody: 'FDIC',
    regulatoryNotice: 'Bank of America, N.A. Member FDIC. Equal Housing Lender.',
    address: '100 North Tryon Street, Charlotte, NC 28255',
    pdfMetadata: {
      title: 'Bank of America e-Statement',
      author: 'Bank of America Consumer Document Processing Center',
      creator: 'BofA Digital Statement Publishing Platform (v12.8)',
      producer: 'Adobe Distiller 21.0 for Windows',
      keywords: 'Bank of America, Advantage Banking, Statement, FDIC'
    }
  },
  wells_sim: {
    id: 'wells_sim',
    name: 'WELLS FARGO BANK N.A.',
    shortName: 'Wells Fargo',
    tagline: 'Together We\'ll Go Far',
    type: 'Bank',
    charter: 'OCC Charter #00001',
    routingNumber: '121000248',
    customerServicePhone: '1-800-869-3557',
    website: 'www.wellsfargo.com',
    primaryColor: '#b91c1c',
    accentColor: '#d97706',
    secondaryColor: '#fbbf24',
    logoText: 'WELLS',
    logoSubtext: 'FARGO BANK',
    // 1:1 Authentic Wells Fargo Proprietary Font Specs ("Wells Fargo Sans")
    fontFamily: '"Wells Fargo Sans", Arial, Helvetica, sans-serif',
    headingFont: '"Wells Fargo Serif", Georgia, serif',
    monoFont: 'Courier, monospace',
    pdfFontName: 'WellsFargoSans',
    regulatoryBody: 'FDIC',
    regulatoryNotice: 'Wells Fargo Bank, N.A. Member FDIC.',
    address: '420 Montgomery Street, San Francisco, CA 94104',
    pdfMetadata: {
      author: 'Wells Fargo Enterprise Information Solutions',
      creator: 'Wells Fargo Online Document Output Manager (v9.2)',
      producer: 'GMC PrintNet T System v7.1'
    }
  },

  // Credit Unions
  heritage_cu: {
    id: 'heritage_cu',
    name: 'HERITAGE FIRST CREDIT UNION',
    shortName: 'Heritage First FCU',
    tagline: 'Member-Owned. Service-Driven.',
    type: 'Credit Union',
    charter: 'NCUA Charter #24109',
    routingNumber: '325081142',
    customerServicePhone: '1-888-555-4328',
    website: 'www.heritagefirstcu.org',
    primaryColor: '#064e3b',
    accentColor: '#059669',
    secondaryColor: '#34d399',
    logoText: 'HERITAGE',
    logoSubtext: 'CREDIT UNION',
    fontFamily: 'Roboto, Arial, sans-serif',
    headingFont: 'Roboto, Arial, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'NCUA',
    regulatoryNotice: 'Federally insured by NCUA. Equal Housing Opportunity. Membership eligibility required. Dividends are declared periodically by the Board of Directors.',
    address: '450 Federal Parkway, Building B, Austin, TX 78701',
    pdfMetadata: {
      title: 'Member Account Statement',
      author: 'Heritage First Credit Union Member Processing System',
      creator: 'Symitar Episys Document Publishing Engine',
      producer: 'PDFlib Personalization Server 9.3',
      keywords: 'Heritage FCU, Credit Union, Member Statement, NCUA'
    }
  },
  navy_fed_sim: {
    id: 'navy_fed_sim',
    name: 'NAVY FEDERAL CREDIT UNION',
    shortName: 'Navy Federal',
    tagline: 'Our Members Are the Mission',
    type: 'Credit Union',
    charter: 'NCUA Charter #05536',
    routingNumber: '256074974',
    customerServicePhone: '1-888-842-6328',
    website: 'www.navyfederal.org',
    primaryColor: '#1e3a8a',
    accentColor: '#0284c7',
    secondaryColor: '#38bdf8',
    logoText: 'NAVY',
    logoSubtext: 'FEDERAL CU',
    fontFamily: 'Montserrat, Arial, sans-serif',
    headingFont: 'Montserrat, Arial, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'NCUA',
    regulatoryNotice: 'Federally insured by NCUA. Equal Housing Lender.',
    address: '820 Follin Lane, Vienna, VA 22180',
    pdfMetadata: {
      title: 'Navy Federal Credit Union Statement',
      author: 'Navy Federal Credit Union Automated Member Services',
      creator: 'NFCU Electronic Statement Generator (v19.4)',
      producer: 'Quadient Inspire Designer v14.0'
    }
  },
  penfed_sim: {
    id: 'penfed_sim',
    name: 'PENTAGON FEDERAL CREDIT UNION',
    shortName: 'PenFed CU',
    tagline: 'Great Rates for Everyone',
    type: 'Credit Union',
    charter: 'NCUA Charter #00302',
    routingNumber: '256078381',
    customerServicePhone: '1-800-247-5626',
    website: 'www.penfed.org',
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    secondaryColor: '#e11d48',
    logoText: 'PENFED',
    logoSubtext: 'CREDIT UNION',
    fontFamily: 'Open Sans, Arial, sans-serif',
    headingFont: 'Open Sans, Arial, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'NCUA',
    regulatoryNotice: 'Federally Insured by NCUA. Equal Housing Opportunity.',
    address: '7940 Jones Branch Drive, McLean, VA 22102',
    pdfMetadata: {
      author: 'Pentagon Federal Credit Union Information Technology',
      creator: 'PenFed Member Document Processing System',
      producer: 'Adobe PDF Library 15.0'
    }
  },

  // Wealth Management & Online Fintechs
  vanguard_horizon: {
    id: 'vanguard_horizon',
    name: 'VANGUARD HORIZON WEALTH & TREASURY',
    shortName: 'Vanguard Horizon',
    tagline: 'Private Banking & Treasury Solutions',
    type: 'Wealth Management',
    charter: 'OCC Charter #11054',
    routingNumber: '021000021',
    customerServicePhone: '1-877-555-9325',
    website: 'www.vanguardhorizon.com',
    primaryColor: '#312e81',
    accentColor: '#6366f1',
    secondaryColor: '#818cf8',
    logoText: 'VANGUARD',
    logoSubtext: 'HORIZON WEALTH',
    fontFamily: 'Cinzel, Georgia, serif',
    headingFont: 'Cinzel, Georgia, serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'FDIC / SIPC',
    regulatoryNotice: 'Private Wealth Management products may involve investment risk including possible loss of principal. Banking services provided by Vanguard Horizon Bank, N.A., Member FDIC.',
    address: '500 Park Avenue, 28th Floor, New York, NY 10022',
    pdfMetadata: {
      title: 'Private Wealth & Treasury Account Statement',
      subject: 'Monthly Treasury Portfolio Statement',
      author: 'Vanguard Horizon Private Wealth Reporting Engine',
      creator: 'Vanguard Horizon Enterprise Treasury Engine (v31.0)',
      producer: 'Adobe PDF Library 15.0 / Private Client Publisher',
      keywords: 'Vanguard Horizon, Private Banking, Treasury, Portfolio, SIPC'
    }
  },
  schwab_sim: {
    id: 'schwab_sim',
    name: 'CHARLES SCHWAB BANK SSB',
    shortName: 'Charles Schwab',
    tagline: 'Own Your Tomorrow',
    type: 'Wealth Management',
    charter: 'FDIC Insured Charter #57489',
    routingNumber: '121142270',
    customerServicePhone: '1-888-403-9000',
    website: 'www.schwab.com',
    primaryColor: '#0284c7',
    accentColor: '#0369a1',
    secondaryColor: '#bae6fd',
    logoText: 'SCHWAB',
    logoSubtext: 'BANK SSB',
    // 1:1 Authentic Charles Schwab Brand Font Specs ("Charles Schwab Sans" / Schwab Sans)
    fontFamily: '"Schwab Sans", "Charles Schwab Sans", Arial, sans-serif',
    headingFont: '"Schwab Sans", Arial, sans-serif',
    monoFont: 'Courier, monospace',
    pdfFontName: 'SchwabSans',
    regulatoryBody: 'FDIC / SIPC',
    regulatoryNotice: 'Charles Schwab Bank, SSB, Member FDIC and Equal Housing Lender.',
    address: '3000 Schwab Way, Westlake, TX 76262',
    pdfMetadata: {
      title: 'Charles Schwab Bank Statement',
      author: 'Charles Schwab & Co., Inc. Client Reporting System',
      creator: 'Schwab Electronic Client Statement Generator (v22.4)',
      producer: 'OpenText StreamServe 5.6'
    }
  },
  fidelity_sim: {
    id: 'fidelity_sim',
    name: 'FIDELITY CASH MANAGEMENT',
    shortName: 'Fidelity Investments',
    tagline: 'Turn What You Have into What You Want',
    type: 'Wealth Management',
    charter: 'UMB Bank Partner Charter',
    routingNumber: '101000695',
    customerServicePhone: '1-800-343-3548',
    website: 'www.fidelity.com',
    primaryColor: '#15803d',
    accentColor: '#16a34a',
    secondaryColor: '#86efac',
    logoText: 'FIDELITY',
    logoSubtext: 'INVESTMENTS',
    // 1:1 Authentic Fidelity Brand Font Specs ("Fidelity Sans")
    fontFamily: '"Fidelity Sans", Arial, Helvetica, sans-serif',
    headingFont: '"Fidelity Sans", Arial, sans-serif',
    monoFont: 'Courier, monospace',
    pdfFontName: 'FidelitySans',
    regulatoryBody: 'FDIC / SIPC',
    regulatoryNotice: 'Fidelity Cash Management Account is provided by Fidelity Brokerage Services LLC, Member NYSE, SIPC.',
    address: '245 Summer Street, Boston, MA 02210',
    pdfMetadata: {
      title: 'Fidelity Cash Management Account Statement',
      subject: 'Monthly Brokerage Cash Statement',
      author: 'Fidelity Investments Account Statement Processing Center',
      creator: 'Fidelity Customer Document System (v18.2)',
      producer: 'Adobe Distiller 22.0 for Linux'
    }
  },
  us_metro_bank: {
    id: 'us_metro_bank',
    name: 'US METRO BANK',
    shortName: 'US Metro Bank',
    tagline: 'Personal & Business Banking Solutions',
    type: 'Bank',
    charter: 'FDIC Insured Charter #58379',
    routingNumber: '122244247',
    customerServicePhone: '714-620-8888',
    website: 'www.usmetrobank.com',
    primaryColor: '#1e3a68',
    accentColor: '#b83232',
    secondaryColor: '#2b5288',
    logoText: 'US METRO',
    logoSubtext: 'BANK',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headingFont: 'Arial, Helvetica, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'FDIC',
    regulatoryNotice: 'Equal Housing Lender. Member FDIC.',
    address: '3580 Wilshire Blvd. Ste 1800, Los Angeles, CA 90010',
    branchName: 'Wilshire',
    branchAddress: '3580 Wilshire Blvd Suite 101, Los Angeles CA 90010',
    branchPhone: '213-201-3300',
    pdfMetadata: {
      title: 'US Metro Bank Account Statement',
      subject: 'Monthly Account Statement',
      author: 'US Metro Bank Core Banking System',
      creator: 'Microsoft: Print To PDF',
      producer: 'Microsoft: Print To PDF',
      keywords: 'US Metro Bank, Analyzed Business Checking, Statement, FDIC'
    }
  },
  hingham_savings: {
    id: 'hingham_savings',
    name: 'HINGHAM INSTITUTION FOR SAVINGS',
    shortName: 'Hingham Savings',
    tagline: 'Simple Banking. Honest Value.',
    type: 'Savings Bank',
    charter: 'FDIC Insured Charter #90176',
    routingNumber: '211370545',
    customerServicePhone: '781-749-2200',
    website: 'www.hinghamsavings.com',
    primaryColor: '#000000',
    accentColor: '#111827',
    secondaryColor: '#4b5563',
    logoText: 'HINGHAM',
    logoSubtext: 'INSTITUTION FOR SAVINGS',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headingFont: 'Arial, Helvetica, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'FDIC / DIF',
    regulatoryNotice: 'Member FDIC. Member DIF. Equal Housing Lender.',
    address: '55 Main Street, Hingham, MA 02043',
    pdfMetadata: {
      title: '',
      subject: '',
      author: '',
      creator: '',
      producer: 'iText® 7.1.19 ©2000-2022 iText Group NV (Fiserv; licensed version)',
      keywords: ''
    }
  },
  us_1364_cu: {
    id: 'us_1364_cu',
    name: 'US 1364 FEDERAL CREDIT UNION',
    shortName: 'US 1364 FCU',
    tagline: 'Your Community Credit Union',
    type: 'Credit Union',
    charter: 'NCUA Charter #01364',
    routingNumber: '271987654',
    customerServicePhone: '219-769-1700',
    website: 'www.usfederalcu.org',
    primaryColor: '#003892',
    accentColor: '#0e64ff',
    secondaryColor: '#1129a2',
    logoText: 'US FEDERAL',
    logoSubtext: '1364 CREDIT UNION',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headingFont: 'Arial, Helvetica, sans-serif',
    monoFont: 'Courier, monospace',
    regulatoryBody: 'NCUA',
    regulatoryNotice: 'Federally insured by NCUA. Equal Housing Opportunity.',
    address: '8400 Broadway, Merrillville, IN 46410',
    pdfMetadata: {
      title: '',
      author: 'ULURO PDF 4.0.1.17',
      creator: 'ULURO',
      producer: 'ULURO (www.uluro.com)',
      subject: 'None',
      keywords: 'ULURO',
      creationDate: 'D:20241211102447'
    }
  }
};

export const PRESET_SCENARIOS = [
  {
    id: 'us1364_november_scenario',
    name: 'US 1364 Federal Credit Union - November 2024 (1:1 Reference Replica)',
    description: 'November 2024 statement for William J Newman featuring Regular Savings ($360,666.60) and Share Draft ($3,062.98) across 2 pages matching reference PDF.',
    institutionId: 'us_1364_cu',
    customerInfo: {
      name: 'WILLIAM J NEWMAN',
      address: '404 STURDY RD APT A7',
      cityStateZip: 'VALPARAISO IN 46383-5302',
      memberNumber: '*******680',
      microCode: '691'
    },
    statementMeta: {
      startDate: '2024-11-01',
      endDate: '2024-11-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 302250.45,
        endingBalance: 360666.60,
        apy: '0.10%',
        interestYtd: 277.87
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 50731.57,
        endingBalance: 3062.98,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_CREDIT_UNION_DATA]
  },
  {
    id: 'us1364_heavy_3page_scenario',
    name: 'US 1364 Federal Credit Union - Expanded High Volume (3-Page Stress Test)',
    description: 'Expanded statement with 28 Share Draft transactions testing seamless 3-page dynamic flow, continuation headers, and clean placement of Statement Summary and Inquiries.',
    institutionId: 'us_1364_cu',
    customerInfo: {
      name: 'WILLIAM J NEWMAN',
      address: '404 STURDY RD APT A7',
      cityStateZip: 'VALPARAISO IN 46383-5302',
      memberNumber: '*******680',
      microCode: '691'
    },
    statementMeta: {
      startDate: '2024-11-01',
      endDate: '2024-11-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 302250.45,
        endingBalance: 360666.60,
        apy: '0.10%',
        interestYtd: 277.87
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 50731.57,
        endingBalance: 1542.18,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_TEST_SCENARIOS.heavyVolume3Page]
  },
  {
    id: 'us1364_massive_42tx_scenario',
    name: 'US 1364 Federal Credit Union - Massive 42-Transaction Volume (Strict 3-Page Flow)',
    description: '42 transactions across Share Draft testing multi-page continuation and final closure block placement on Page 3.',
    institutionId: 'us_1364_cu',
    customerInfo: {
      name: 'WILLIAM J NEWMAN',
      address: '404 STURDY RD APT A7',
      cityStateZip: 'VALPARAISO IN 46383-5302',
      memberNumber: '*******680',
      microCode: '691'
    },
    statementMeta: {
      startDate: '2024-11-01',
      endDate: '2024-11-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 302250.45,
        endingBalance: 360666.60,
        apy: '0.10%',
        interestYtd: 277.87
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 50731.57,
        endingBalance: 812.45,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_TEST_SCENARIOS.massiveVolume42Tx]
  },
  {
    id: 'us1364_aziz_june_2026_scenario',
    name: 'US 1364 Federal Credit Union - June 2026 (AZIZ BERJIS)',
    description: 'June 2026 statement for AZIZ BERJIS featuring Regular Savings ($302,250.45) and Share Draft ($50,731.57) across 2 pages matching authentic PDF.',
    institutionId: 'us_1364_cu',
    customerInfo: US1364_AZIZ_BERJIS_JUNE_2026_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-06-01',
      endDate: '2026-06-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 299361.25,
        endingBalance: 302250.45,
        apy: '0.10%',
        interestYtd: 149.88
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 48012.04,
        endingBalance: 50731.57,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_AZIZ_BERJIS_JUNE_2026_DATA]
  },
  {
    id: 'us1364_aziz_july_2026_scenario',
    name: 'US 1364 Federal Credit Union - July 2026 (AZIZ BERJIS)',
    description: 'July 2026 statement for AZIZ BERJIS featuring Regular Savings ($350,144.42) and Share Draft ($10,141.31) across 2 pages matching authentic PDF.',
    institutionId: 'us_1364_cu',
    customerInfo: US1364_AZIZ_BERJIS_JULY_2026_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-07-01',
      endDate: '2026-07-31'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 302250.45,
        endingBalance: 350144.42,
        apy: '0.10%',
        interestYtd: 179.41
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 50731.57,
        endingBalance: 10141.31,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_AZIZ_BERJIS_JULY_2026_DATA]
  },
  {
    id: 'us1364_aziz_august_2026_scenario',
    name: 'US 1364 Federal Credit Union - August 2026 (AZIZ BERJIS)',
    description: 'August 2026 (+1 month incremented) statement for AZIZ BERJIS featuring Regular Savings ($353,038.76) and Share Draft ($12,161.20) across 2 pages matching authentic PDF.',
    institutionId: 'us_1364_cu',
    customerInfo: US1364_AZIZ_BERJIS_AUGUST_2026_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-08-01',
      endDate: '2026-08-31'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '1',
        fullAccountNumber: '1',
        type: 'REGULAR SAVINGS',
        startingBalance: 350144.42,
        endingBalance: 353038.76,
        apy: '0.10%',
        interestYtd: 209.31
      },
      {
        accountNumber: '2',
        fullAccountNumber: '2',
        type: 'SHARE DRAFT',
        startingBalance: 10141.31,
        endingBalance: 12161.20,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    multiMonthStatements: [US1364_AZIZ_BERJIS_AUGUST_2026_DATA]
  },
  {
    id: 'us1364_hashmi_august_scenario',
    name: 'US 1364 Federal Credit Union - August 2026 (SEAN HASAN HASHMI)',
    description: 'August 2026 statement for SEAN HASAN HASHMI starting at $213,719.05 with SCPMG payroll direct deposit Advice #5218492, ending at $221,536.65.',
    institutionId: 'us_1364_cu',
    isMultiMonthUS1364: true,
    customerInfo: US1364_HASHMI_2MONTH_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-08-01',
      endDate: '2026-08-31'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '8378',
        fullAccountNumber: '8378',
        type: 'SHARE DRAFT',
        startingBalance: 213719.05,
        endingBalance: 221536.65,
        apy: '0.00%',
        interestYtd: 0.00
      },
      {
        accountNumber: '8752',
        fullAccountNumber: '8752',
        type: 'REGULAR SAVINGS',
        startingBalance: 50000.00,
        endingBalance: 60005.12,
        apy: '0.10%',
        interestYtd: 24.08
      }
    ],
    multiMonthStatements: [US1364_HASHMI_2MONTH_DATA.statements[0]]
  },
  {
    id: 'us1364_hashmi_september_scenario',
    name: 'US 1364 Federal Credit Union - September 2026 (SEAN HASAN HASHMI)',
    description: 'September 2026 statement for SEAN HASAN HASHMI starting at $221,536.65 with SCPMG payroll direct deposits Advice #5223918 & #5229344, ending exactly at $231,312.57.',
    institutionId: 'us_1364_cu',
    isMultiMonthUS1364: true,
    customerInfo: US1364_HASHMI_2MONTH_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-09-01',
      endDate: '2026-09-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '8378',
        fullAccountNumber: '8378',
        type: 'SHARE DRAFT',
        startingBalance: 221536.65,
        endingBalance: 231312.57,
        apy: '0.00%',
        interestYtd: 0.00
      },
      {
        accountNumber: '8752',
        fullAccountNumber: '8752',
        type: 'REGULAR SAVINGS',
        startingBalance: 60005.12,
        endingBalance: 70011.04,
        apy: '0.10%',
        interestYtd: 30.00
      }
    ],
    multiMonthStatements: [US1364_HASHMI_2MONTH_DATA.statements[1]]
  },
  {
    id: 'us1364_hashmi_2month_scenario',
    name: 'US 1364 Federal Credit Union - 2-Month Continuity (Aug-Sept 2026, SEAN HASAN HASHMI)',
    description: '2 consecutive months (August & September 2026) for SEAN HASAN HASHMI starting at $213,719.05 with bi-weekly Southern California Permanente Medical Group (SCPMG) payroll direct deposits (Advice #5218492 & #5223918), ending exactly at $231,312.57.',
    institutionId: 'us_1364_cu',
    isMultiMonthUS1364: true,
    customerInfo: US1364_HASHMI_2MONTH_DATA.customerInfo,
    statementMeta: {
      startDate: '2026-08-01',
      endDate: '2026-09-30'
    },
    monthsCount: '2',
    accounts: [
      {
        accountNumber: '8378',
        fullAccountNumber: '8378',
        type: 'SHARE DRAFT',
        startingBalance: 213719.05,
        endingBalance: 231312.57,
        apy: '0.00%',
        interestYtd: 0.00
      },
      {
        accountNumber: '8752',
        fullAccountNumber: '8752',
        type: 'REGULAR SAVINGS',
        startingBalance: 50000.00,
        endingBalance: 70011.04,
        apy: '0.10%',
        interestYtd: 48.10
      }
    ],
    multiMonthStatements: US1364_HASHMI_2MONTH_DATA.statements
  },
  {
    id: 'hingham_3month_scenario',
    name: 'Hingham Savings - 3-Month Continuity (May-July 2026, May $488,342.18 Start)',
    description: '3 consecutive months (May, June, July 2026) for One West Medical Group starting at $488,342.18 in May with recurring $150,000.00 monthly incoming transfers matching US Metro transfer dates.',
    institutionId: 'hingham_savings',
    customerInfo: {
      name: 'One West Medical Group, Inc.',
      subName: 'GLENN MARSHAK',
      address: '8920 WILSHIRE BLVD STE 301',
      cityStateZip: 'BEVERLY HILLS CA 90211-3207'
    },
    statementMeta: {
      startDate: '2026-05-01',
      endDate: '2026-07-31'
    },
    monthsCount: '3',
    accounts: [
      {
        accountNumber: '26130895',
        fullAccountNumber: '26130895',
        type: 'COMMERCIAL CHECKING ACCOUNT',
        startingBalance: 488342.18,
        endingBalance: 876002.74,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    isMultiMonthHingham: true
  },
  {
    id: 'hingham_scenario',
    name: 'Hingham Savings - May 2026 ($488,342.18 Start + $150K Transfer)',
    description: 'May 2026 statement for One West Medical Group starting at $488,342.18 with $150,000.00 credit transfer on May 26th matching US Metro.',
    institutionId: 'hingham_savings',
    customerInfo: {
      name: 'One West Medical Group, Inc.',
      subName: 'GLENN MARSHAK',
      address: '8920 WILSHIRE BLVD STE 301',
      cityStateZip: 'BEVERLY HILLS CA 90211-3207'
    },
    statementMeta: {
      startDate: '2026-05-01',
      endDate: '2026-05-31'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '26130895',
        fullAccountNumber: '26130895',
        type: 'COMMERCIAL CHECKING ACCOUNT',
        startingBalance: 488342.18,
        endingBalance: 622226.80,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    sampleTransactions: [
      {
        id: 'h-m0-d1',
        date: '2026-05-04',
        description: 'NORCAL INSURANCE COMPANY MED MALPRACTICE POLICY #88201\nPOLICY DIRECT PMT    SAN FRANCISCO CA',
        rawDescription: 'NORCAL INSURANCE COMPANY MED MALPRACTICE POLICY #88201',
        detailLine1: 'POLICY DIRECT PMT    SAN FRANCISCO CA',
        amount: -3450.00,
        type: 'debit',
        runningBalance: 484892.18
      },
      {
        id: 'h-m0-d2',
        date: '2026-05-08',
        description: 'EVOLUS INC MEDICAL AESTHETICS INV# 541098\nINV# 541098-CA    NEWPORT BEACH CA',
        rawDescription: 'EVOLUS INC MEDICAL AESTHETICS INV# 541098',
        detailLine1: 'INV# 541098-CA    NEWPORT BEACH CA',
        amount: -7420.00,
        type: 'debit',
        runningBalance: 477472.18
      },
      {
        id: 'h-m0-d3',
        date: '2026-05-15',
        description: 'CANDELA CORPORATION LASER SERVICE CONTRACT #91024\nREF# 91024-MA    MARLBOROUGH MA',
        rawDescription: 'CANDELA CORPORATION LASER SERVICE CONTRACT #91024',
        detailLine1: 'REF# 91024-MA    MARLBOROUGH MA',
        amount: -4600.00,
        type: 'debit',
        runningBalance: 472872.18
      },
      {
        id: 'h-m0-d4',
        date: '2026-05-22',
        description: 'CARDINAL HEALTH 110 INC RX DISTRIBUTION INV# 601948\nINV# 601948-OH    DUBLIN OH',
        rawDescription: 'CARDINAL HEALTH 110 INC RX DISTRIBUTION INV# 601948',
        detailLine1: 'INV# 601948-OH    DUBLIN OH',
        amount: -1380.00,
        type: 'debit',
        runningBalance: 471492.18
      },
      {
        id: 'h-m0-c1',
        date: '2026-05-26',
        description: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 6720194830\nINTERBANK SETTLEMENT TR# 6720194830\nFBO ONE WEST MEDICAL GROUP INC',
        rawDescription: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 6720194830',
        detailLine1: 'INTERBANK SETTLEMENT TR# 6720194830',
        detailLine2: 'FBO ONE WEST MEDICAL GROUP INC',
        amount: 150000.00,
        type: 'credit',
        runningBalance: 621492.18
      },
      {
        id: 'h-m0-c2',
        date: '2026-05-29',
        description: 'INTEREST CREDIT',
        rawDescription: 'INTEREST CREDIT',
        amount: 734.62,
        type: 'credit',
        runningBalance: 622226.80
      }
    ]
  },
  {
    id: 'hingham_june_scenario',
    name: 'Hingham Savings - June 2026 ($150K Transfer)',
    description: 'June 2026 statement for One West Medical Group starting at $622,226.80 with $150,000 credit transfer on June 25th.',
    institutionId: 'hingham_savings',
    customerInfo: {
      name: 'One West Medical Group, Inc.',
      subName: 'GLENN MARSHAK',
      address: '8920 WILSHIRE BLVD STE 301',
      cityStateZip: 'BEVERLY HILLS CA 90211-3207'
    },
    statementMeta: {
      startDate: '2026-06-01',
      endDate: '2026-06-30'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '26130895',
        fullAccountNumber: '26130895',
        type: 'COMMERCIAL CHECKING ACCOUNT',
        startingBalance: 622226.80,
        endingBalance: 750253.83,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    sampleTransactions: [
      {
        id: 'h-m1-d1',
        date: '2026-06-05',
        description: 'RODERICK MANAGEMENT GROUP WILSHIRE MEDICAL SUITE LEASE\nTR# 90184201    LOS ANGELES CA',
        rawDescription: 'RODERICK MANAGEMENT GROUP WILSHIRE MEDICAL SUITE LEASE',
        detailLine1: 'TR# 90184201    LOS ANGELES CA',
        amount: -5200.00,
        type: 'debit',
        runningBalance: 617026.80
      },
      {
        id: 'h-m1-d2',
        date: '2026-06-08',
        description: 'REVANCE THERAPEUTICS DIRECT PHARMA TR# 88120\nTR# 88120-TN    NASHVILLE TN',
        rawDescription: 'REVANCE THERAPEUTICS DIRECT PHARMA TR# 88120',
        detailLine1: 'TR# 88120-TN    NASHVILLE TN',
        amount: -7840.25,
        type: 'debit',
        runningBalance: 609186.55
      },
      {
        id: 'h-m1-d3',
        date: '2026-06-12',
        description: 'STRYKER SUSTAINABILITY SOLUTIONS INV# 440192\nINV# 440192-AZ    TEMPE AZ',
        rawDescription: 'STRYKER SUSTAINABILITY SOLUTIONS INV# 440192',
        detailLine1: 'INV# 440192-AZ    TEMPE AZ',
        amount: -4350.00,
        type: 'debit',
        runningBalance: 604836.55
      },
      {
        id: 'h-m1-d4',
        date: '2026-06-19',
        description: 'PROMETHEUS LABORATORIES CLINICAL ASSAY SVCS\nREF# 90184812    SAN DIEGO CA',
        rawDescription: 'PROMETHEUS LABORATORIES CLINICAL ASSAY SVCS',
        detailLine1: 'REF# 90184812    SAN DIEGO CA',
        amount: -2100.00,
        type: 'debit',
        runningBalance: 602736.55
      },
      {
        id: 'h-m1-c1',
        date: '2026-06-25',
        description: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 7819024165\nINTERBANK SETTLEMENT TR# 7819024165\nFBO ONE WEST MEDICAL GROUP INC',
        rawDescription: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 7819024165',
        detailLine1: 'INTERBANK SETTLEMENT TR# 7819024165',
        detailLine2: 'FBO ONE WEST MEDICAL GROUP INC',
        amount: 150000.00,
        type: 'credit',
        runningBalance: 752736.55
      },
      {
        id: 'h-m1-d5',
        date: '2026-06-28',
        description: 'B. BRAUN MEDICAL INC IV THERAPY & INFUSION SYSTEMS\nORDER #4910284    BETHLEHEM PA',
        rawDescription: 'B. BRAUN MEDICAL INC IV THERAPY & INFUSION SYSTEMS',
        detailLine1: 'ORDER #4910284    BETHLEHEM PA',
        amount: -3420.00,
        type: 'debit',
        runningBalance: 749316.55
      },
      {
        id: 'h-m1-c2',
        date: '2026-06-30',
        description: 'INTEREST CREDIT',
        rawDescription: 'INTEREST CREDIT',
        amount: 937.28,
        type: 'credit',
        runningBalance: 750253.83
      }
    ]
  },
  {
    id: 'hingham_july_scenario',
    name: 'Hingham Savings - July 2026 ($150K Transfer)',
    description: 'July 2026 statement for One West Medical Group starting at $750,253.83 with $150,000 credit transfer on July 28th.',
    institutionId: 'hingham_savings',
    customerInfo: {
      name: 'One West Medical Group, Inc.',
      subName: 'GLENN MARSHAK',
      address: '8920 WILSHIRE BLVD STE 301',
      cityStateZip: 'BEVERLY HILLS CA 90211-3207'
    },
    statementMeta: {
      startDate: '2026-07-01',
      endDate: '2026-07-31'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '26130895',
        fullAccountNumber: '26130895',
        type: 'COMMERCIAL CHECKING ACCOUNT',
        startingBalance: 750253.83,
        endingBalance: 876002.74,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    sampleTransactions: [
      {
        id: 'h-m2-d1',
        date: '2026-07-06',
        description: 'CARL ZEISS MEDITEC INC OPTICAL SURGICAL MAINTENANCE\nREF# 90185102    DUBLIN CA',
        rawDescription: 'CARL ZEISS MEDITEC INC OPTICAL SURGICAL MAINTENANCE',
        detailLine1: 'REF# 90185102    DUBLIN CA',
        amount: -4800.00,
        type: 'debit',
        runningBalance: 745453.83
      },
      {
        id: 'h-m2-d2',
        date: '2026-07-08',
        description: 'EVOLUS INC MEDICAL AESTHETICS INV# 542911\nINV# 542911-CA    NEWPORT BEACH CA',
        rawDescription: 'EVOLUS INC MEDICAL AESTHETICS INV# 542911',
        detailLine1: 'INV# 542911-CA    NEWPORT BEACH CA',
        amount: -8250.00,
        type: 'debit',
        runningBalance: 737203.83
      },
      {
        id: 'h-m2-d3',
        date: '2026-07-13',
        description: 'BOSTON SCIENTIFIC SURGICAL DEVICES INV# 771290\nINV# 771290-MA    MARLBOROUGH MA',
        rawDescription: 'BOSTON SCIENTIFIC SURGICAL DEVICES INV# 771290',
        detailLine1: 'INV# 771290-MA    MARLBOROUGH MA',
        amount: -4620.00,
        type: 'debit',
        runningBalance: 732583.83
      },
      {
        id: 'h-m2-d4',
        date: '2026-07-20',
        description: 'MODERNIZING MEDICINE EMA DERMATOLOGY EHR CLOUD\nREF# 90185901    BOCA RATON FL',
        rawDescription: 'MODERNIZING MEDICINE EMA DERMATOLOGY EHR CLOUD',
        detailLine1: 'REF# 90185901    BOCA RATON FL',
        amount: -2400.00,
        type: 'debit',
        runningBalance: 730183.83
      },
      {
        id: 'h-m2-d5',
        date: '2026-07-23',
        description: 'CARDINAL HEALTH 110 INC RX DISTRIBUTION INV# 603184\nINV# 603184-OH    DUBLIN OH',
        rawDescription: 'CARDINAL HEALTH 110 INC RX DISTRIBUTION INV# 603184',
        detailLine1: 'INV# 603184-OH    DUBLIN OH',
        amount: -1420.50,
        type: 'debit',
        runningBalance: 728763.33
      },
      {
        id: 'h-m2-d6',
        date: '2026-07-27',
        description: 'REVANCE THERAPEUTICS DIRECT PHARMA TR# 88390\nORDER #88390-TN    NASHVILLE TN',
        rawDescription: 'REVANCE THERAPEUTICS DIRECT PHARMA TR# 88390',
        detailLine1: 'ORDER #88390-TN    NASHVILLE TN',
        amount: -3890.00,
        type: 'debit',
        runningBalance: 724873.33
      },
      {
        id: 'h-m2-c1',
        date: '2026-07-28',
        description: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 8642019430\nINTERBANK SETTLEMENT TR# 8642019430\nFBO ONE WEST MEDICAL GROUP INC',
        rawDescription: 'ONLINE BANKING TRANSFER FROM US METRO CHK ...8501 CONFIRMATION# 8642019430',
        detailLine1: 'INTERBANK SETTLEMENT TR# 8642019430',
        detailLine2: 'FBO ONE WEST MEDICAL GROUP INC',
        amount: 150000.00,
        type: 'credit',
        runningBalance: 874873.33
      },
      {
        id: 'h-m2-c2',
        date: '2026-07-31',
        description: 'INTEREST CREDIT',
        rawDescription: 'INTEREST CREDIT',
        amount: 1129.41,
        type: 'credit',
        runningBalance: 876002.74
      }
    ]
  },
  {
    id: 'hingham_original_pdf',
    name: 'Hingham Savings - Original PDF Sample (Robert Sharpe)',
    description: '1:1 authentic replica of original source PDF (Robert Sharpe, Uber Eats transaction, $65.64 balance).',
    institutionId: 'hingham_savings',
    customerInfo: {
      name: 'ROBERT SHARPE',
      address: '2118 WILSHIRE BLVD UNIT 289',
      cityStateZip: 'SANTA MONICA CA 90403-5704'
    },
    statementMeta: {
      startDate: '2025-11-01',
      endDate: '2025-11-28'
    },
    monthsCount: '1',
    accounts: [
      {
        accountNumber: '26130895',
        fullAccountNumber: '26130895',
        type: 'REGULAR CHECKING ACCOUNT',
        startingBalance: 97.30,
        endingBalance: 65.64,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ],
    sampleTransactions: [
      {
        id: 'tx_hingham_orig_1',
        date: '11/10/2025',
        description: 'UBER * EATS POS\n8005928996    CA US    648070\n************3125 27854851',
        rawDescription: 'UBER * EATS POS',
        detailLine1: '8005928996    CA US    648070',
        detailLine2: '************3125 27854851',
        amount: -31.66,
        type: 'debit',
        runningBalance: 65.64
      }
    ]
  },
  {
    id: 'us_metro_scenario',
    name: 'US Metro Bank Analyzed Business Checking',
    description: '1:1 authentic replica of US Metro Bank commercial business statement with branch details and service charge ledger.',
    institutionId: 'us_metro_bank',
    accounts: [
      {
        accountNumber: 'XXXXXX8501',
        fullAccountNumber: 'XXXXXX8501',
        type: 'ANALYZED BUSINESS CHECKING',
        startingBalance: 4901.83,
        apy: '0.00%',
        interestYtd: 0.00
      }
    ]
  },
  {
    id: 'personal_checking',
    name: 'Standard Personal Checking & High-Yield Savings',
    description: 'Typical bi-weekly payroll deposits, subscription services, groceries, dining, and savings transfers.',
    institutionId: 'apex_national',
    accounts: [
      {
        accountNumber: '**** **** 4821',
        fullAccountNumber: '4821-9034-1182-4821',
        type: 'Standard Commercial Checking',
        startingBalance: 4250.80,
        apy: '0.01%',
        interestYtd: 0.42
      }
    ]
  },
  {
    id: 'chase_scenario',
    name: 'Chase Total Checking & Freedom Card',
    description: 'Direct deposits, merchant card debits, ATM cash withdrawals, and Zelle transfers.',
    institutionId: 'chase_sim',
    accounts: [
      {
        accountNumber: '**** **** 9081',
        fullAccountNumber: '9081-3321-4491-9081',
        type: 'Chase Total Checking',
        startingBalance: 6120.50,
        apy: '0.01%',
        interestYtd: 0.61
      }
    ]
  },
  {
    id: 'bofa_scenario',
    name: 'Bank of America Advantage Banking',
    description: 'Preferred Rewards checking, direct bill pay, and recurring mortgage disbursements.',
    institutionId: 'bofa_sim',
    accounts: [
      {
        accountNumber: '**** **** 1042',
        fullAccountNumber: '1042-8833-2211-1042',
        type: 'Advantage Plus Banking',
        startingBalance: 9850.00,
        apy: '0.02%',
        interestYtd: 1.97
      }
    ]
  },
  {
    id: 'credit_union_dividends',
    name: 'Credit Union Share Savings & Auto Loan',
    description: 'Includes monthly share dividends, mortgage escrow balance, checking, and an auto loan repayment breakdown.',
    institutionId: 'heritage_cu',
    accounts: [
      {
        accountNumber: '**** **** 3319',
        fullAccountNumber: '3319-7700-1122-3319',
        type: 'Member Advantage Checking',
        startingBalance: 3120.45,
        apy: '0.15%',
        interestYtd: 2.30
      }
    ]
  },
  {
    id: 'navy_fed_scenario',
    name: 'Navy Federal Active Duty Checking',
    description: 'Military direct deposit payroll, share dividends, and car loan disbursements.',
    institutionId: 'navy_fed_sim',
    accounts: [
      {
        accountNumber: '**** **** 7741',
        fullAccountNumber: '7741-0099-3322-7741',
        type: 'Active Duty Checking Account',
        startingBalance: 5410.20,
        apy: '0.20%',
        interestYtd: 10.82
      }
    ]
  },
  {
    id: 'schwab_scenario',
    name: 'Charles Schwab High-Yield Investor Checking',
    description: 'Worldwide ATM rebate refunds, wire transfers, and brokerage sweep balances.',
    institutionId: 'schwab_sim',
    accounts: [
      {
        accountNumber: '**** **** 5520',
        fullAccountNumber: '5520-9944-1100-5520',
        type: 'High-Yield Investor Checking',
        startingBalance: 12450.00,
        apy: '0.45%',
        interestYtd: 56.02
      }
    ]
  }
];

