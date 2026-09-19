import { generateId } from './formatters.js';

// Comprehensive, highly realistic, price-bounded merchants across 14 specialized categories
export const MERCHANT_CATALOG = [
  // 1. Rideshare, Parking & Public Transit (Strictly $4.50 - $48.00)
  {
    category: 'Rideshare & Transit',
    type: 'POS Debit',
    isOnline: false,
    min: 4.50,
    max: 48.00,
    names: [
      'UBER *TRIP HELP.UBER.COM',
      'LYFT *RIDE MON 08AM',
      'PARK MOBILE METER PMT',
      'SP PLUS PARKING GARAGE',
      'MTA METROCARD VENDING',
      'BIRD RIDE SCOOTER RENTAL',
      'LIME RIDE SAN FRANCISCO',
      'LAZ PARKING #94821',
      'EASYPARK AUTO PAY',
      'EZPASS TOLL COLLECTION',
      'SUNPASS AUTOMATIC TOLL',
      'CTA VENTRA TRANSIT TICKETS'
    ]
  },

  // 2. Coffee, Bakery & Quick Breakfast (Strictly $3.25 - $22.50)
  {
    category: 'Coffee & Breakfast',
    type: 'POS Debit',
    isOnline: false,
    min: 3.25,
    max: 22.50,
    names: [
      'STARBUCKS STORE #04921',
      'DUNKIN #382910 QSR',
      'PANERA BREAD #9481',
      'PEET\'S COFFEE & TEA #104',
      'DUTCH BROS COFFEE #892',
      'KRISPY KREME DOUGHNUTS #44',
      'LOCAL ROASTERS CAFE',
      'BLUE BOTTLE COFFEE #12',
      'CARIBOU COFFEE #4891',
      'TIM HORTONS #0912',
      'EINSTEIN BROS BAGELS #302',
      'CORNER BAKERY CAFE #104'
    ]
  },

  // 3. Fast Casual & Lunch Spots (Strictly $9.50 - $38.00)
  {
    category: 'Fast Casual Dining',
    type: 'POS Debit',
    isOnline: false,
    min: 9.50,
    max: 38.00,
    names: [
      'CHIPOTLE 2841 ONLINE',
      'SWEETGREEN #1042',
      'CAVA MEZZE GRILL #382',
      'SHAKE SHACK #0912',
      'FIVE GUYS BURGERS #489',
      'IN-N-OUT BURGER #204',
      'JERSEY MIKE\'S SUBS #309',
      'RAISING CANE\'S CHICKEN #12',
      'PORTILLO\'S HOT DOGS #44',
      'PANDA EXPRESS #0892',
      'MOD PIZZA #0491',
      'NOODLES & COMPANY #382'
    ]
  },

  // 4. Fine Dining & Dinner Restaurants (Strictly $42.00 - $240.00)
  {
    category: 'Dinner & Restaurants',
    type: 'POS Debit',
    isOnline: false,
    min: 42.00,
    max: 240.00,
    names: [
      'THE CAPITAL GRILLE #8012',
      'CHEESECAKE FACTORY #104',
      'FLEMING\'S PRIME STEAKHOUSE',
      'RUTH\'S CHRIS STEAK HOUSE',
      'BONEFISH GRILL #4821',
      'P.F. CHANG\'S #0942',
      'LOCAL CRAFT BISTRO & BAR',
      'EDDIE V\'S PRIME SEAFOOD',
      'MORTON\'S THE STEAKHOUSE',
      'OCEAN PRIME RESTAURANT',
      'MAGGIANO\'S LITTLE ITALY',
      'COOPER\'S HAWK WINERY'
    ]
  },

  // 5. Groceries & Supermarkets (Strictly $24.50 - $245.00)
  {
    category: 'Groceries',
    type: 'POS Debit',
    isOnline: false,
    min: 24.50,
    max: 245.00,
    names: [
      'WHOLE FOODS MARKET #10492',
      'TRADER JOE\'S #521 QFC',
      'KROGER GROCERY #892',
      'PUBLIX SUPER MARKET #492',
      'ALDI #04921 GROCERY',
      'HEB FOOD STORE #382',
      'SAFEWAY STORE #1892',
      'WEGMANS FOOD MARKET #04',
      'SPROUTS FARMERS MARKET #12',
      'HARRIS TEETER #0492',
      'MEIJER SUPERCENTER #89',
      'GIANT FOOD STORE #302'
    ]
  },

  // 6. Fuel & Gas Stations (Strictly $22.00 - $78.00)
  {
    category: 'Fuel & Convenience',
    type: 'POS Debit',
    isOnline: false,
    min: 22.00,
    max: 78.00,
    names: [
      'SHELL OIL 5738920192',
      'CHEVRON 00294812 PUMP',
      'EXXONMOBIL 482910 SPEEDPASS',
      'BP OIL 382910 FUEL',
      '7-ELEVEN 38291 CONVENIENCE',
      'WAWA #0892 GAS & FOOD',
      'BUC-EE\'S #0042 FUEL',
      'MARATHON PETRO #4892',
      'SPEEDWAY #0942 GAS',
      'CIRCLE K #4829 CONVENIENCE',
      'PILOT FLYING J #382',
      'VALERO PETROLEUM #042'
    ]
  },

  // 7. General Retail & Big Box Stores (Strictly $18.50 - $340.00)
  {
    category: 'Retail & Shopping',
    type: 'POS Debit',
    isOnline: false,
    min: 18.50,
    max: 340.00,
    names: [
      'TARGET STORES #1892',
      'WALMART SUPERCENTER #0421',
      'COSTCO WHOLESALE #0892',
      'BEST BUY #0941',
      'HOME DEPOT #1049',
      'LOWE\'S #0392 HOME IMPR',
      'TJ MAXX #0892 CLOTHING',
      'NORDSTROM #0492 RETAIL',
      'MARSHALLS #0942 STORE',
      'ROSS DRESS FOR LESS #38',
      'KOHL\'S #0492 DEPARTMENT',
      'DICK\'S SPORTING GOODS #12'
    ]
  },

  // 8. Pharmacies & Health (Strictly $12.50 - $115.00)
  {
    category: 'Pharmacy & Health',
    type: 'POS Debit',
    isOnline: false,
    min: 12.50,
    max: 115.00,
    names: [
      'CVS PHARMACY #04921',
      'WALGREENS #3920 DRUGSTORE',
      'RITE AID PHARMACY #089',
      'QUEST DIAGNOSTICS LAB',
      'MINUTECLINIC PAYMENT',
      'GNC HEALTH & NUTRITION #42'
    ]
  },

  // 9. Home & Hardware Supplies (Strictly $15.00 - $280.00)
  {
    category: 'Home Improvement',
    type: 'POS Debit',
    isOnline: false,
    min: 15.00,
    max: 280.00,
    names: [
      'ACE HARDWARE STORE #492',
      'TRACTOR SUPPLY CO #0892',
      'SHERWIN-WILLIAMS #3920',
      'BED BATH & BEYOND #104',
      'IKEA STORE #0892 FURNITURE'
    ]
  },

  // 10. Online Shopping & E-Commerce (Strictly $11.99 - $280.00 - No city tag)
  {
    category: 'Online Shopping',
    type: 'Online Purchase',
    isOnline: true,
    min: 11.99,
    max: 280.00,
    names: [
      'AMAZON.COM*MK93A11L3 AMZN.COM/BILL',
      'APPLE.COM/BILL CUPERTINO CA',
      'PAYPAL *EBAY INC',
      'EBAY O*18-94812 SAN JOSE CA',
      'NIKE.COM DIGITAL STORE',
      'CHEWY.COM PET SUPPLIES',
      'ETSY.COM*HANDMADE CRAFTS',
      'WAYFAIR.COM FURNITURE',
      'ZAPPOS.COM SHOE STORE',
      'ASOS ONLINE CLOTHING'
    ]
  },

  // 11. Digital Subscriptions & Streaming (Strictly $6.99 - $24.99 - No city tag)
  {
    category: 'Digital Subscriptions',
    type: 'Recurring Debit',
    isOnline: true,
    min: 6.99,
    max: 24.99,
    names: [
      'NETFLIX.COM DIGITAL SUBSCRIPTION',
      'SPOTIFY USA NYC PREMIUM',
      'HULU SUBSCRIPTION LOS ANGELES CA',
      'DISNEYPLUS DIGITAL PAY',
      'HBO MAX SUBSCRIPTION',
      'YOUTUBE PREMIUM SAN BRUNO CA',
      'NYTIMES DIGITAL SUBSCRIPTION',
      'AUDIBLE*AUDIOBOOKS AMZN',
      'CHATGPT PLUS SUBSCRIPTION',
      'ICLOUD STORAGE APPLE.COM'
    ]
  },

  // 12. Digital Entertainment & Gaming (Strictly $9.99 - $69.99 - No city tag)
  {
    category: 'Gaming & Software',
    type: 'Online Purchase',
    isOnline: true,
    min: 9.99,
    max: 69.99,
    names: [
      'PLAYSTATION NETWORK SAN MATEO CA',
      'XBOX LIVE MONTHLY SUBSCR',
      'STEAM PURCHASE VALVE CORP',
      'NINTENDO ESHOP DIGITAL',
      'MICROSOFT*365 SUBSCRIPTION',
      'ADOBE*CREATIVE CLOUD'
    ]
  },

  // 13. Utilities & Telecom (Strictly $45.00 - $260.00)
  {
    category: 'Utilities & Telecom',
    type: 'ACH Debit',
    isOnline: true,
    min: 45.00,
    max: 260.00,
    names: [
      'DUKE ENERGY UTILITY PPD ID 8920192',
      'VERIZON WIRELESS AUTOPAY PPD',
      'AT&T MONTHLY DIRECT PAY PPD',
      'COMCAST XFINITY CABLE PPD',
      'STATE FARM INSURANCE PREMIUM',
      'GEICO AUTO INSURANCE AUTOPAY',
      'WASTE MANAGEMENT UTILITY',
      'SPECTRUM CABLE & INTERNET'
    ]
  },

  // 14. Personal Care & Fitness (Strictly $15.00 - $120.00)
  {
    category: 'Fitness & Personal Care',
    type: 'POS Debit',
    isOnline: false,
    min: 15.00,
    max: 120.00,
    names: [
      'PLANET FITNESS MONTHLY DUES',
      'LA FITNESS MEMBERSHIP PPD',
      'GREAT CLIPS SALON #492',
      'ULTA BEAUTY #0892 STORE',
      'SEPHORA #0491 COSMETICS'
    ]
  },

  // 15. Mortgages & Housing Payments ($2,500.00 - $8,500.00)
  {
    category: 'Mortgage & Housing',
    type: 'ACH Debit',
    isOnline: true,
    min: 2500.00,
    max: 8500.00,
    names: [
      'CHASE HOME LENDING MORTGAGE AUTOPAY PPD',
      'WELLS FARGO HOME MTG PMT PPD',
      'FIRST REPUBLIC MTG DIRECT DEBIT',
      'U.S. BANK HOME MORTGAGE ACH PMT',
      'PENFED CREDIT UNION MORTGAGE ACH'
    ]
  },

  // 16. Major Credit Card Autopayments ($1,200.00 - $6,500.00)
  {
    category: 'Credit Card Payment',
    type: 'ACH Debit',
    isOnline: true,
    min: 1200.00,
    max: 6500.00,
    names: [
      'AMERICAN EXPRESS EPAYMENT ACH PMT',
      'CHASE SAPPHIRE CARD DIRECT AUTOPAY',
      'CITI CARD ONLINE PAYMENT ACH',
      'CAPITAL ONE ONLINE PMT AUTOPAY',
      'APPLE CARD / GOLDMAN SACHS ACH'
    ]
  },

  // 17. Automotive Finance & Leasing ($650.00 - $1,850.00)
  {
    category: 'Automotive Finance',
    type: 'ACH Debit',
    isOnline: true,
    min: 650.00,
    max: 1850.00,
    names: [
      'PORSCHE FINANCIAL SERVICES AUTOPAY',
      'MERCEDES-BENZ FINANCIAL SERVICES ACH',
      'BMW FINANCIAL SERVICES ACH PMT',
      'TESLA FINANCE DIRECT DEBIT',
      'AUDI FINANCIAL SERVICES LEASE PMT'
    ]
  },

  // 18. Medical & Professional Associations ($150.00 - $1,600.00)
  {
    category: 'Professional & Licensing',
    type: 'Online Purchase',
    isOnline: true,
    min: 150.00,
    max: 1600.00,
    names: [
      'CALIFORNIA MEDICAL ASSOCIATION DUES',
      'MEDICAL BOARD OF CA LICENSURE PPD',
      'AMERICAN MEDICAL ASSOCIATION DUES',
      'UPTODATE WOLTERS KLUWER HEALTH',
      'NEW ENGLAND JOURNAL OF MEDICINE'
    ]
  },

  // 19. Property Tax, Insurance & Wealth Advisory ($1,200.00 - $5,400.00)
  {
    category: 'Tax & Insurance',
    type: 'ACH Debit',
    isOnline: true,
    min: 1200.00,
    max: 5400.00,
    names: [
      'LOS ANGELES COUNTY TAX COLLECTOR PPD',
      'NORTHWESTERN MUTUAL LIFE INS AUTOPAY',
      'CHUBB PERSONAL INSURANCE AUTOPAY',
      'VANGUARD AUTO INVESTMENT ACH',
      'FIDELITY BROKERAGE DIRECT ACH'
    ]
  }
];

export function generateSmartMultiMonthTransactions({
  startDateStr = '2026-08-01',
  monthsCount = 2,
  startBalance = 213719.05,
  endBalance = 231312.57,
  recurringRules = [],
  locales = ['Redondo Beach, CA', 'Woodland Hills, CA', 'Pasadena, CA', 'Los Angeles, CA'],
  targetMonthlyCounts = null // Optional explicit transaction count per month [countM1, countM2, ...]
}) {
  const [startYear, startMonth] = startDateStr.split('-').map(Number);
  const primaryLocale = locales[0] || 'Redondo Beach, CA';
  const transactions = [];

  let totalRecurringNet = 0;

  // Process month by month to introduce authentic month-over-month volume variance
  for (let m = 0; m < monthsCount; m++) {
    const monthDate = new Date(startYear, (startMonth - 1) + m, 1);
    const curYear = monthDate.getFullYear();
    const curMonthNum = monthDate.getMonth() + 1;
    const daysInMonth = new Date(curYear, curMonthNum, 0).getDate();

    // 1. Process Fixed / Scheduled Recurring Rules (supports explicit date or day of month)
    recurringRules.forEach(rule => {
      let dateStr = '';
      if (rule.date) {
        const [rY, rM, rD] = rule.date.split('-').map(Number);
        if (rY === curYear && rM === curMonthNum) {
          dateStr = rule.date;
        } else {
          return; // Rule does not belong in this month
        }
      } else {
        let day = rule.day || 1;
        if (day > daysInMonth) day = daysInMonth;
        dateStr = `${curYear}-${String(curMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      const amt = parseFloat(rule.amount);
      totalRecurringNet += amt;

      transactions.push({
        id: generateId(amt >= 0 ? 'DEP' : 'ACH'),
        date: dateStr,
        description: rule.description,
        category: rule.category || (amt >= 0 ? 'Income' : 'Recurring Bill'),
        amount: amt,
        checkNumber: rule.checkNumber || '',
        type: rule.type || (amt >= 0 ? 'ACH Direct Deposit' : 'Recurring ACH')
      });
    });
  }

  // 2. Discretionary Target Calculation across total statement span
  const overallTargetDiscretionarySum = (endBalance - startBalance) - totalRecurringNet;

  // 3. Month-by-Month Dynamic Volume Allocation (stochastic variance or user-specified target counts)
  const monthlyDiscretionaryTx = [];
  let totalDiscretionaryCount = 0;

  for (let m = 0; m < monthsCount; m++) {
    const monthDate = new Date(startYear, (startMonth - 1) + m, 1);
    const curYear = monthDate.getFullYear();
    const curMonthNum = monthDate.getMonth() + 1;
    const daysInMonth = new Date(curYear, curMonthNum, 0).getDate();

    // Count how many recurring rules exist for this month
    const recurringInMonthCount = recurringRules.filter(rule => {
      if (rule.date) {
        const [rY, rM] = rule.date.split('-').map(Number);
        return rY === curYear && rM === curMonthNum;
      }
      return true;
    }).length;

    let monthTxCount;
    if (targetMonthlyCounts && Array.isArray(targetMonthlyCounts) && targetMonthlyCounts[m] !== undefined) {
      // Exact user-specified monthly target count
      const totalTarget = targetMonthlyCounts[m];
      monthTxCount = Math.max(1, totalTarget - recurringInMonthCount);
    } else {
      // Natural stochastic variance: ~0.80 - 1.05 tx/day, modulated randomly between 0.85x and 1.25x per month
      const monthVarianceFactor = 0.85 + Math.random() * 0.40;
      monthTxCount = Math.max(10, Math.floor(daysInMonth * 0.80 * monthVarianceFactor));
    }

    monthlyDiscretionaryTx.push({
      monthIndex: m,
      year: curYear,
      monthNum: curMonthNum,
      daysInMonth,
      count: monthTxCount
    });
    totalDiscretionaryCount += monthTxCount;
  }

  // 4. Generate Raw Discretionary Transactions for each Month with Locale Anchoring
  const rawDiscretionary = [];

  monthlyDiscretionaryTx.forEach(({ monthIndex, year, monthNum, daysInMonth, count }) => {
    // Generate day-by-day locales for this specific month (prevents mid-day city jumping)
    const dayLocales = [];
    let currentLoc = primaryLocale;
    let daysInCurrentLoc = 0;

    for (let d = 0; d < daysInMonth; d++) {
      if (daysInCurrentLoc > 4 && locales.length > 1 && Math.random() < 0.25) {
        const secondaryLocales = locales.filter(l => l !== primaryLocale);
        currentLoc = secondaryLocales[Math.floor(Math.random() * secondaryLocales.length)];
        daysInCurrentLoc = 0;
      } else if (currentLoc !== primaryLocale && Math.random() < 0.4) {
        currentLoc = primaryLocale;
        daysInCurrentLoc = 0;
      }
      dayLocales.push(currentLoc);
      daysInCurrentLoc++;
    }

    for (let i = 0; i < count; i++) {
      const day = Math.min(daysInMonth, Math.max(1, Math.floor(Math.random() * daysInMonth) + 1));
      const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const loc = dayLocales[day - 1] || primaryLocale;

      // Pick random category & merchant
      const catObj = MERCHANT_CATALOG[Math.floor(Math.random() * MERCHANT_CATALOG.length)];
      const merchantNameRaw = catObj.names[Math.floor(Math.random() * catObj.names.length)];
      
      const desc = (!catObj.isOnline && catObj.type === 'POS Debit') 
        ? `${merchantNameRaw} ${loc.toUpperCase()}` 
        : merchantNameRaw;
      
      const minAmt = catObj.min;
      const maxAmt = catObj.max;
      const rawAmt = minAmt + Math.random() * (maxAmt - minAmt);

      rawDiscretionary.push({
        id: generateId('TX'),
        date: dateStr,
        description: desc,
        category: catObj.category,
        amount: -parseFloat(rawAmt.toFixed(2)),
        checkNumber: '',
        type: catObj.type
      });
    }
  });

  // 5. Mathematical Balance Scaling & Exact Residual Cent Adjustment
  const rawSum = rawDiscretionary.reduce((acc, t) => acc + t.amount, 0);

  let scaleFactor = 1;
  if (rawSum !== 0 && overallTargetDiscretionarySum < 0) {
    scaleFactor = overallTargetDiscretionarySum / rawSum;
  }

  let adjustedDiscretionarySum = 0;
  const scaledDiscretionary = rawDiscretionary.map((tx, idx) => {
    if (idx === rawDiscretionary.length - 1) return tx;
    let newAmt = parseFloat((tx.amount * scaleFactor).toFixed(2));
    if (newAmt > -1.50) newAmt = -2.50; // Minimum realistic debit
    adjustedDiscretionarySum += newAmt;
    return { ...tx, amount: newAmt };
  });

  // Final exact residual cent adjustment to hit endBalance down to the exact cent
  const finalNeeded = overallTargetDiscretionarySum - adjustedDiscretionarySum;
  const lastIndex = scaledDiscretionary.length - 1;
  if (scaledDiscretionary[lastIndex]) {
    scaledDiscretionary[lastIndex].amount = parseFloat(finalNeeded.toFixed(2));
  }

  // Combine fixed recurring and discretionary transactions, sorted chronologically (timezone-safe)
  const allTx = [...transactions, ...scaledDiscretionary].sort((a, b) => a.date.localeCompare(b.date));

  // 6. Build Multi-Month Reconciled Statements Structure
  let currentRunningBal = startBalance;
  const statements = [];

  for (let m = 0; m < monthsCount; m++) {
    const monthDate = new Date(startYear, (startMonth - 1) + m, 1);
    const curYear = monthDate.getFullYear();
    const curMonthNum = monthDate.getMonth() + 1;
    const daysInMonth = new Date(curYear, curMonthNum, 0).getDate();

    const mStartStr = `${curYear}-${String(curMonthNum).padStart(2, '0')}-01`;
    const mEndStr = `${curYear}-${String(curMonthNum).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    const mDisplayPeriod = `${String(curMonthNum).padStart(2, '0')}-01-${String(curYear).slice(2)} THRU ${String(curMonthNum).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}-${String(curYear).slice(2)}`;
    const mDisplayEndingDate = `${String(curMonthNum).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}-${String(curYear).slice(2)}`;

    const monthTx = allTx.filter(t => t.date >= mStartStr && t.date <= mEndStr);
    const mStartBal = currentRunningBal;

    let mDeposits = 0;
    let mWithdrawals = 0;
    const txWithRunning = monthTx.map(t => {
      const amt = parseFloat(t.amount);
      if (amt >= 0) {
        mDeposits += amt;
      } else {
        mWithdrawals += Math.abs(amt);
      }
      currentRunningBal = parseFloat((currentRunningBal + amt).toFixed(2));
      return {
        ...t,
        runningBalance: currentRunningBal
      };
    });

    const mEndBal = parseFloat((mStartBal + mDeposits - mWithdrawals).toFixed(2));

    statements.push({
      monthIndex: m,
      statementMeta: {
        startDate: mStartStr,
        endDate: mEndStr,
        displayPeriod: mDisplayPeriod,
        displayEndingDate: mDisplayEndingDate
      },
      startingBalance: mStartBal,
      totalDeposits: parseFloat(mDeposits.toFixed(2)),
      totalWithdrawals: parseFloat(mWithdrawals.toFixed(2)),
      endingBalance: mEndBal,
      transactions: txWithRunning
    });
  }

  // Attach statements array to allTx
  allTx.statements = statements;

  return allTx;
}

