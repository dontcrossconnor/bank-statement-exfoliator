export function formatCurrency(amount) {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(abs);
  
  return isNegative ? `-${formatted}` : formatted;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function generateId(prefix = 'TX') {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function calculateAccountTotals(transactions, startingBalance) {
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let currentBalance = startingBalance;

  const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  const updatedTx = sortedTx.map(tx => {
    const amount = parseFloat(tx.amount);
    if (amount >= 0) {
      totalDeposits += amount;
    } else {
      totalWithdrawals += Math.abs(amount);
    }
    currentBalance += amount;
    return {
      ...tx,
      runningBalance: currentBalance
    };
  });

  return {
    endingBalance: currentBalance,
    totalDeposits,
    totalWithdrawals,
    netChange: totalDeposits - totalWithdrawals,
    processedTransactions: updatedTx
  };
}
