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
  }
};

export const PRESET_SCENARIOS = [
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
