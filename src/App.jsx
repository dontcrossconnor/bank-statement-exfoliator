import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import GeneratorControls from './components/GeneratorControls';
import StatementViewer from './components/StatementViewer';
import AnalyticsPanel from './components/AnalyticsPanel';
import QuickstartModal from './components/QuickstartModal';
import { INSTITUTIONS, PRESET_SCENARIOS } from './data/institutions';
import { MEDICAL_PRACTICE_DATA } from './data/medicalPracticeData';
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
  const [customerInfo, setCustomerInfo] = useState(MEDICAL_PRACTICE_DATA.customerInfo);

  // Statement Metadata & Multi-Month Controls
  const [statementMeta, setStatementMeta] = useState({
    startDate: '2026-06-01',
    endDate: '2026-07-31'
  });
  const [monthsCount, setMonthsCount] = useState('2');

  // Balance Target Engine Inputs
  const [startBalanceInput, setStartBalanceInput] = useState(String(MEDICAL_PRACTICE_DATA.account.startingBalance));
  const [endBalanceInput, setEndBalanceInput] = useState(String(MEDICAL_PRACTICE_DATA.month2.endBalance));

  // Fixed Recurring Bills Rules
  const [recurringRules, setRecurringRules] = useState([]);

  // Configured Locales
  const [locales, setLocales] = useState(['Los Angeles, CA', 'Beverly Hills, CA']);

  // Accounts State
  const [accounts, setAccounts] = useState([MEDICAL_PRACTICE_DATA.account]);

  // Combined Multi-Month Statements Array (Month 1: June 2026, Month 2: July 2026)
  const [multiMonthStatements, setMultiMonthStatements] = useState([
    MEDICAL_PRACTICE_DATA.month1,
    MEDICAL_PRACTICE_DATA.month2
  ]);

  // Transactions State (Combined for Analytics Panel)
  const [transactions, setTransactions] = useState([
    ...MEDICAL_PRACTICE_DATA.month1.deposits,
    ...MEDICAL_PRACTICE_DATA.month1.otherCredits,
    ...MEDICAL_PRACTICE_DATA.month1.debits,
    ...MEDICAL_PRACTICE_DATA.month1.otherDebits,
    ...MEDICAL_PRACTICE_DATA.month2.deposits,
    ...MEDICAL_PRACTICE_DATA.month2.otherCredits,
    ...MEDICAL_PRACTICE_DATA.month2.debits,
    ...MEDICAL_PRACTICE_DATA.month2.otherDebits
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
    const title = `${institution.name.replace(/\s+/g, '_')}_Statement_${statementMeta.startDate}_to_${statementMeta.endDate}.pdf`;
    exportVectorizedPdf('printable-statement', title);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Quickstart Guided Modal */}
      <QuickstartModal
        isOpen={isQuickstartOpen}
        onClose={() => setIsQuickstartOpen(false)}
        onApplyScenario={(scenarioId) => {
          handleApplyPreset(scenarioId);
          setIsQuickstartOpen(false);
        }}
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
          statements={multiMonthStatements}
        />
      </main>

      {/* Financial Analytics Footer Panel */}
      <AnalyticsPanel totals={totals} transactions={transactions} />

    </div>
  );
}
