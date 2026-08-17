import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import GeneratorControls from './components/GeneratorControls';
import StatementViewer from './components/StatementViewer';
import AnalyticsPanel from './components/AnalyticsPanel';
import QuickstartModal from './components/QuickstartModal';
import { INSTITUTIONS, PRESET_SCENARIOS } from './data/institutions';
import { generateSmartMultiMonthTransactions } from './utils/smartGenerator';
import { calculateAccountTotals } from './utils/formatters';
import { exportVectorizedPdf } from './utils/vectorPdfExporter';
import { triggerPrintDialog } from './utils/pdfExporter';

export default function App() {
  // Quickstart Modal Overlay State
  const [isQuickstartOpen, setIsQuickstartOpen] = useState(false);

  // Institution & Branding State
  const [institution, setInstitution] = useState(INSTITUTIONS.us_metro_bank);

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    name: 'ONE WEST MEDICAL GROUP, INC.',
    subName: 'GLENN MARSHAK',
    address: '8920 WILSHIRE BLVD STE 301',
    cityStateZip: 'BEVERLY HILLS CA 90211-3207'
  });

  // Statement Metadata & Multi-Month Controls
  const [statementMeta, setStatementMeta] = useState({
    startDate: '2026-07-01',
    endDate: '2026-07-31'
  });
  const [monthsCount, setMonthsCount] = useState('1');

  // Balance Target Engine Inputs
  const [startBalanceInput, setStartBalanceInput] = useState('389218.13');
  const [endBalanceInput, setEndBalanceInput] = useState('389796.60');

  // Fixed Recurring Bills Rules
  const [recurringRules, setRecurringRules] = useState([]);

  // Configured Locales
  const [locales, setLocales] = useState(['Los Angeles, CA', 'Beverly Hills, CA']);

  // Accounts State
  const [accounts, setAccounts] = useState([
    {
      accountNumber: 'XXXXXX8501',
      fullAccountNumber: 'XXXXXX8501',
      type: 'ANALYZED BUSINESS CHECKING',
      startingBalance: 389218.13,
      apy: '1.75%',
      interestYtd: 4049.29
    }
  ]);

  // Initial Transaction Load (Only Interest Credit, 0 Debits)
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      date: '2026-07-31',
      description: 'INTEREST CREDIT',
      amount: 578.47,
      type: 'Interest'
    }
  ]);

  // Update End Date whenever start date or months change
  useEffect(() => {
    if (!statementMeta.startDate) return;
    const [y, m, d] = statementMeta.startDate.split('-').map(Number);
    const count = parseInt(monthsCount, 10) || 1;
    // Month is 0-indexed; month m + count - 1 with day 0 gives last day of the target month
    const end = new Date(y, (m - 1) + count, 0);
    const endYear = end.getFullYear();
    const endMonth = String(end.getMonth() + 1).padStart(2, '0');
    const endDay = String(end.getDate()).padStart(2, '0');
    const endStr = `${endYear}-${endMonth}-${endDay}`;
    setStatementMeta(prev => ({ ...prev, endDate: endStr }));
  }, [statementMeta.startDate, monthsCount]);

  // Calculated Totals & Running Balances
  const totals = useMemo(() => {
    const startBal = parseFloat(startBalanceInput) || 0;
    return calculateAccountTotals(transactions, startBal);
  }, [transactions, startBalanceInput]);

  const isReconciled = useMemo(() => {
    const expectedEnd = parseFloat(endBalanceInput);
    if (isNaN(expectedEnd)) return true;
    return Math.abs(totals.endingBalance - expectedEnd) < 0.02;
  }, [totals, endBalanceInput]);

  const handleApplyPreset = (scenarioId) => {
    const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    if (INSTITUTIONS[scenario.institutionId]) {
      setInstitution(INSTITUTIONS[scenario.institutionId]);
    }

    setAccounts(scenario.accounts);
    
    const startBal = scenario.accounts[0]?.startingBalance || 5000;
    const endBal = startBal + 1500;

    setStartBalanceInput(String(startBal));
    setEndBalanceInput(String(endBal));

    const newTx = generateSmartMultiMonthTransactions({
      startDateStr: statementMeta.startDate,
      monthsCount: parseInt(monthsCount, 10) || 1,
      startBalance: startBal,
      endBalance: endBal,
      recurringRules,
      locales
    });
    setTransactions(newTx);
  };

  const handleExportPdf = () => {
    const nameFormatted = customerInfo.name.replace(/[^a-zA-Z0-9]/g, '_');
    exportVectorizedPdf(
      institution,
      customerInfo,
      statementMeta,
      accounts[0],
      totals,
      `${institution.shortName}_VectorStatement_${nameFormatted}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Quickstart Overlay Modal */}
      <QuickstartModal
        isOpen={isQuickstartOpen}
        onClose={() => setIsQuickstartOpen(false)}
      />

      {/* Top Header */}
      <Header
        institution={institution}
        onExportPdf={handleExportPdf}
        onPrint={triggerPrintDialog}
        onNewScenario={() => handleApplyPreset('personal_checking')}
        isReconciled={isReconciled}
        onOpenQuickstart={() => setIsQuickstartOpen(true)}
      />

      {/* Generator Control Panel */}
      <GeneratorControls
        statementMeta={statementMeta}
        setStatementMeta={setStatementMeta}
        institution={institution}
        setInstitution={setInstitution}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        accounts={accounts}
        setAccounts={setAccounts}
        transactions={transactions}
        setTransactions={setTransactions}
        onApplyPreset={handleApplyPreset}
        recurringRules={recurringRules}
        setRecurringRules={setRecurringRules}
        locales={locales}
        setLocales={setLocales}
        startBalanceInput={startBalanceInput}
        setStartBalanceInput={setStartBalanceInput}
        endBalanceInput={endBalanceInput}
        setEndBalanceInput={setEndBalanceInput}
        monthsCount={monthsCount}
        setMonthsCount={setMonthsCount}
      />

      {/* Main Statement Canvas Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900/50 py-6">
        <StatementViewer
          institution={institution}
          customerInfo={customerInfo}
          statementMeta={statementMeta}
          account={accounts[0]}
          totals={totals}
          transactions={transactions}
        />
      </main>

      {/* Financial Analytics Footer Panel */}
      <AnalyticsPanel totals={totals} transactions={transactions} />

    </div>
  );
}
