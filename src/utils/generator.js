import { generateId } from './formatters';

const MERCHANTS_DEPOSIT = [
  { name: 'EMPLOYER DIRECT DEPOSIT PAYROLL', type: 'Deposit', category: 'Income', range: [2200, 4800] },
  { name: 'SQUARE INC MERCH PAYMENT PPD', type: 'Deposit', category: 'Business Income', range: [350, 1850] },
  { name: 'TREAS ED ACH PAY REAL ESTATE REFUND', type: 'Deposit', category: 'Government Refund', range: [120, 650] },
  { name: 'ZELLE TRANSFER FROM ROBERTS M', type: 'Deposit', category: 'Transfer', range: [50, 300] },
  { name: 'INTEREST DIVIDEND PAYMENT', type: 'Deposit', category: 'Interest', range: [15.20, 125.40] },
];

const MERCHANTS_WITHDRAWAL = [
  { name: 'WHOLE FOODS MARKET #10492 CHARLOTTE NC', type: 'POS Debit', category: 'Groceries', range: [45.20, 210.80] },
  { name: 'AMAZON.COM*MK93A11L3 SEATTLE WA', type: 'Online Purchase', category: 'Shopping', range: [12.99, 149.50] },
  { name: 'DUKE ENERGY UTILITY PAY PPD', type: 'ACH Debit', category: 'Utilities', range: [85.00, 240.00] },
  { name: 'TARGET STORES #1892 CHARLOTTE NC', type: 'POS Debit', category: 'Retail', range: [24.50, 118.90] },
  { name: 'STARBUCKS STORE #04921 CHARLOTTE NC', type: 'POS Debit', category: 'Dining', range: [4.85, 16.50] },
  { name: 'SHELL OIL 5738920192 CHARLOTTE NC', type: 'POS Debit', category: 'Fuel', range: [32.00, 68.50] },
  { name: 'NETFLIX.COM DIGITAL SUBSCRIPTION', type: 'Recurring Debit', category: 'Subscriptions', range: [15.99, 22.99] },
  { name: 'CHEVRON 00294812 AUSTIN TX', type: 'POS Debit', category: 'Fuel', range: [28.50, 58.00] },
  { name: 'VERIZON WIRELESS MONTHLY AUTOPAY', type: 'ACH Debit', category: 'Telecommunications', range: [75.00, 165.00] },
  { name: 'ATM WITHDRAWAL #9482 MAIN ST BRANCH', type: 'ATM Debit', category: 'Cash', range: [60.00, 200.00] },
  { name: 'STATE FARM INSURANCE PREMIUM', type: 'ACH Debit', category: 'Insurance', range: [110.00, 215.00] }
];

export function generateRealisticTransactions(startDateStr, endDateStr, count = 18) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const timeSpan = end.getTime() - start.getTime();

  const transactions = [];

  // Guarantee bi-weekly payroll deposit
  const midDate1 = new Date(start.getTime() + timeSpan * 0.15);
  const midDate2 = new Date(start.getTime() + timeSpan * 0.65);

  transactions.push({
    id: generateId('DEP'),
    date: midDate1.toISOString().split('T')[0],
    description: 'EMPLOYER DIRECT DEPOSIT PAYROLL PPD ID 901849201',
    category: 'Income',
    amount: 3250.00,
    checkNumber: '',
    type: 'ACH Direct Deposit'
  });

  transactions.push({
    id: generateId('DEP'),
    date: midDate2.toISOString().split('T')[0],
    description: 'EMPLOYER DIRECT DEPOSIT PAYROLL PPD ID 901849201',
    category: 'Income',
    amount: 3250.00,
    checkNumber: '',
    type: 'ACH Direct Deposit'
  });

  for (let i = 0; i < count - 2; i++) {
    const randomTime = start.getTime() + Math.random() * timeSpan;
    const txDate = new Date(randomTime).toISOString().split('T')[0];
    
    // 80% withdrawal, 20% deposit
    const isWithdrawal = Math.random() < 0.8;

    if (isWithdrawal) {
      const merchant = MERCHANTS_WITHDRAWAL[Math.floor(Math.random() * MERCHANTS_WITHDRAWAL.length)];
      const min = merchant.range[0];
      const max = merchant.range[1];
      const rawAmt = min + Math.random() * (max - min);
      const amount = -parseFloat(rawAmt.toFixed(2));

      transactions.push({
        id: generateId('TX'),
        date: txDate,
        description: merchant.name,
        category: merchant.category,
        amount,
        checkNumber: Math.random() < 0.1 ? String(Math.floor(1000 + Math.random() * 9000)) : '',
        type: merchant.type
      });
    } else {
      const merchant = MERCHANTS_DEPOSIT[Math.floor(Math.random() * MERCHANTS_DEPOSIT.length)];
      const min = merchant.range[0];
      const max = merchant.range[1];
      const amount = parseFloat((min + Math.random() * (max - min)).toFixed(2));

      transactions.push({
        id: generateId('DEP'),
        date: txDate,
        description: merchant.name,
        category: merchant.category,
        amount,
        checkNumber: '',
        type: merchant.type
      });
    }
  }

  // Sort chronologically
  return transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
}
