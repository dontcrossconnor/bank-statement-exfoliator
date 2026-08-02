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
  const [institution, setInstitution] = useState(INSTITUTIONS.apex_national);

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    name: 'SARAH M. JENKINS',
    address: '742 EVERGREEN TERRACE, SUITE 2B',
    cityStateZip: 'CHARLOTTE, NC 28202'
  });

  // Statement Metadata & Multi-Month Controls
  const [statementMeta, setStatementMeta] = useState({
    startDate: '2026-07-01',
    endDate: '2026-07-31'
  });
  const [monthsCount, setMonthsCount] = useState('1');

  // Balance Target Engine Inputs
  const [startBalanceInput, setStartBalanceInput] = useState('4250.80');
  const [endBalanceInput, setEndBalanceInput] = useState('6820.45');

  // Fixed Recurring Bills Rules
  const [recurringRules, setRecurringRules] = useState([
    { description: 'EMPLOYER DIRECT DEPOSIT PAYROLL PPD', amount: 3250.00, day: 1, category: 'Income' },
    { description: 'EMPLOYER DIRECT DEPOSIT PAYROLL PPD', amount: 3250.00, day: 15, category: 'Income' },
    { description: 'RESIDENTIAL MORTGAGE ESCROW AUTOPAY', amount: -1850.00, day: 1, category: 'Housing' },
    { description: 'DUKE ENERGY UTILITY PAY PPD', amount: -145.20, day: 8, category: 'Utilities' },
    { description: 'NETFLIX DIGITAL SUBSCRIPTION', amount: -19.99, day: 12, category: 'Subscriptions' }
  ]);

  // Configured Locales
  const [locales, setLocales] = useState(['Charlotte, NC', 'Raleigh, NC']);

  // Accounts State
  const [accounts, setAccounts] = useState([
    {
      accountNumber: '**** **** 4821',
      fullAccountNumber: '4821-9034-1182-4821',
      type: 'Premier Checking Account',
      startingBalance: 4250.80,
      apy: '0.05%',
      interestYtd: 4.82
    }
  ]);

  // Initial Transaction Load using Smart Generator
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const initialTx = generateSmartMultiMonthTransactions({
      startDateStr: '2026-07-01',
      monthsCount: 1,
      startBalance: 4250.80,
      endBalance: 6820.45,
      recurringRules,
      locales
    });
    setTransactions(initialTx);
  }, []);

  // Update End Date whenever start date or months change
  useEffect(() => {
    const start = new Date(statementMeta.startDate);
    const m = parseInt(monthsCount, 10) || 1;
    const end = new Date(start.getFullYear(), start.getMonth() + m, 0);
    const endStr = end.toISOString().split('T')[0];
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
