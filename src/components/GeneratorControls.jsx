import React, { useState } from 'react';
import { Settings, Plus, Trash2, Calendar, User, Building, FileSpreadsheet, RefreshCw, Sparkles, MapPin, Repeat, Sliders } from 'lucide-react';
import { INSTITUTIONS, PRESET_SCENARIOS } from '../data/institutions';
import { generateSmartMultiMonthTransactions } from '../utils/smartGenerator';

export default function GeneratorControls({
  statementMeta,
  setStatementMeta,
  institution,
  setInstitution,
  customerInfo,
  setCustomerInfo,
  accounts,
  setAccounts,
  transactions,
  setTransactions,
  onApplyPreset,
  recurringRules,
  setRecurringRules,
  locales,
  setLocales,
  startBalanceInput,
  setStartBalanceInput,
  endBalanceInput,
  setEndBalanceInput,
  monthsCount,
  setMonthsCount
}) {
  const [activeTab, setActiveTab] = useState('smart_solver'); // smart_solver, recurring, locales, customer, institution, raw_tx

  // State for adding new recurring rule
  const [newRecurring, setNewRecurring] = useState({
    description: 'NETFLIX DIGITAL SUBSCRIPTION',
    amount: -19.99,
    day: 12,
    category: 'Subscriptions'
  });

  const [newLocale, setNewLocale] = useState('');

  const handleRunSmartSolver = () => {
    const startBal = parseFloat(startBalanceInput) || 5000;
    const endBal = parseFloat(endBalanceInput) || 7500;

    const generatedTx = generateSmartMultiMonthTransactions({
      startDateStr: statementMeta.startDate,
      monthsCount: parseInt(monthsCount, 10) || 1,
      startBalance: startBal,
      endBalance: endBal,
      recurringRules,
      locales
    });

    // Update account starting balance
    const updatedAccounts = [...accounts];
    if (updatedAccounts[0]) {
      updatedAccounts[0].startingBalance = startBal;
    }
    setAccounts(updatedAccounts);

    setTransactions(generatedTx);
  };

  const handleAddRecurring = () => {
    if (!newRecurring.description) return;
    setRecurringRules([...recurringRules, { ...newRecurring, amount: parseFloat(newRecurring.amount) || 0 }]);
    setNewRecurring({
      description: '',
      amount: -25.00,
      day: 1,
      category: 'General'
    });
  };

  const handleRemoveRecurring = (idx) => {
    const updated = [...recurringRules];
    updated.splice(idx, 1);
    setRecurringRules(updated);
  };

  const handleAddLocale = () => {
    if (!newLocale.trim()) return;
    if (!locales.includes(newLocale.trim())) {
      setLocales([...locales, newLocale.trim()]);
    }
    setNewLocale('');
  };

  const handleRemoveLocale = (loc) => {
    setLocales(locales.filter(l => l !== loc));
  };

  return (
    <div className="no-print bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-800 pb-2.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('smart_solver')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'smart_solver' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-300" />
            <span>Balance Solver & Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('recurring')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'recurring' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Fixed Recurring Bills ({recurringRules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('locales')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'locales' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Geographic Locales ({locales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customer')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Holder</span>
          </button>

          <button
            onClick={() => setActiveTab('institution')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'institution' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Institution Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('raw_tx')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'raw_tx' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Raw Tx ({transactions.length})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-3">
          
          {/* TAB 1: Smart Solver Engine */}
          {activeTab === 'smart_solver' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Start Date</label>
                  <input
                    type="date"
                    value={statementMeta.startDate}
                    onChange={(e) => setStatementMeta({ ...statementMeta, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Multi-Month Range</label>
                  <select
                    value={monthsCount}
                    onChange={(e) => setMonthsCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-100"
                  >
                    <option value="1">1 Month Statement</option>
                    <option value="2">2 Months Statement</option>
                    <option value="3">3 Months Statement</option>
                    <option value="6">6 Months Statement</option>
                    <option value="12">12 Months (Full Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Exact Start Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={startBalanceInput}
                    onChange={(e) => setStartBalanceInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Ending Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={endBalanceInput}
                    onChange={(e) => setEndBalanceInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRunSmartSolver}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded shadow transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Run Smart Generator</span>
                  </button>
                </div>

              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span>
                  The solver guarantees exact mathematical matching: <strong>Beginning Balance + Deposits - Withdrawals = Ending Balance</strong>.
                </span>
                <span className="text-emerald-400 font-mono font-medium">
                  Configured Locales: {locales.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Fixed Recurring Bills */}
          {activeTab === 'recurring' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Merchant / Bill Name (e.g. NETFLIX)"
                  value={newRecurring.description}
                  onChange={(e) => setNewRecurring({ ...newRecurring, description: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 flex-1"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount (+ for Income, - for Expense)"
                  value={newRecurring.amount}
                  onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 w-36 font-mono"
                />
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Day of Month (1-31)"
                  value={newRecurring.day}
                  onChange={(e) => setNewRecurring({ ...newRecurring, day: parseInt(e.target.value, 10) || 1 })}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 w-28 font-mono"
                />
                <button
                  onClick={handleAddRecurring}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fixed Bill</span>
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-800 rounded bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2">Day of Month</th>
                      <th className="p-2 text-right">Amount ($)</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {recurringRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="p-1.5 font-medium">{rule.description}</td>
                        <td className="p-1.5">Day {rule.day} of every month</td>
                        <td className={`p-1.5 text-right font-mono font-semibold ${rule.amount >= 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {rule.amount >= 0 ? `+${rule.amount}` : rule.amount}
                        </td>
                        <td className="p-1.5 text-center">
                          <button onClick={() => handleRemoveRecurring(idx)} className="text-slate-500 hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Geographic Locales */}
          {activeTab === 'locales' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter City, State (e.g. Atlanta, GA)"
                  value={newLocale}
                  onChange={(e) => setNewLocale(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-100 flex-1"
                />
                <button
                  onClick={handleAddLocale}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Locale</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {locales.map((loc, idx) => (
                  <span
                    key={loc}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs border font-medium ${
                      idx === 0
                        ? 'bg-blue-950 text-blue-300 border-blue-700'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{loc} {idx === 0 ? '(Primary Home)' : '(Travel Destination)'}</span>
                    {locales.length > 1 && (
                      <button onClick={() => handleRemoveLocale(loc)} className="text-slate-400 hover:text-rose-400 ml-1">
                        &times;
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Customer Details */}
          {activeTab === 'customer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name / Business Name</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">City, State ZIP</label>
                <input
                  type="text"
                  value={customerInfo.cityStateZip}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, cityStateZip: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Member / Account Number</label>
                <input
                  type="text"
                  value={accounts[0]?.fullAccountNumber || ''}
                  onChange={(e) => {
                    const updated = [...accounts];
                    if (updated[0]) updated[0].fullAccountNumber = e.target.value;
                    setAccounts(updated);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Institution Details */}
          {activeTab === 'institution' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Institution Preset</label>
                <select
                  value={institution.id}
                  onChange={(e) => {
                    const selected = INSTITUTIONS[e.target.value];
                    if (selected) setInstitution(selected);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                >
                  <optgroup label="Commercial Banks">
                    <option value="us_metro_bank">US Metro Bank (1:1)</option>
                    <option value="apex_national">Apex National Bank</option>
                    <option value="chase_sim">Chase Bank N.A.</option>
                    <option value="bofa_sim">Bank of America N.A.</option>
                    <option value="wells_sim">Wells Fargo Bank N.A.</option>
                  </optgroup>
                  <optgroup label="Credit Unions">
                    <option value="heritage_cu">Heritage First FCU</option>
                    <option value="navy_fed_sim">Navy Federal Credit Union</option>
                    <option value="penfed_sim">Pentagon Federal Credit Union</option>
                  </optgroup>
                  <optgroup label="Wealth & Cash Management">
                    <option value="vanguard_horizon">Vanguard Horizon Wealth</option>
                    <option value="schwab_sim">Charles Schwab Bank SSB</option>
                    <option value="fidelity_sim">Fidelity Cash Management</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Institution Full Name</label>
                <input
                  type="text"
                  value={institution.name}
                  onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Routing Number (ABA)</label>
                <input
                  type="text"
                  value={institution.routingNumber}
                  onChange={(e) => setInstitution({ ...institution, routingNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Regulatory Seal</label>
                <select
                  value={institution.regulatoryBody}
                  onChange={(e) => setInstitution({ ...institution, regulatoryBody: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                >
                  <option value="FDIC">FDIC (Bank)</option>
                  <option value="NCUA">NCUA (Credit Union)</option>
                  <option value="FDIC / SIPC">FDIC / SIPC (Wealth)</option>
                </select>
              </div>

              {/* Custom PDF Metadata Editor Controls */}
              <div className="col-span-full pt-2 border-t border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                  <span>Custom PDF Metadata Controls (1:1 Document Properties)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium text-[11px]">PDF Author Metadata</label>
                    <input
                      type="text"
                      value={institution.pdfMetadata?.author || ''}
                      onChange={(e) => setInstitution({
                        ...institution,
                        pdfMetadata: { ...institution.pdfMetadata, author: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium text-[11px]">PDF Creator Metadata</label>
                    <input
                      type="text"
                      value={institution.pdfMetadata?.creator || ''}
                      onChange={(e) => setInstitution({
                        ...institution,
                        pdfMetadata: { ...institution.pdfMetadata, creator: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium text-[11px]">PDF Producer Metadata</label>
                    <input
                      type="text"
                      value={institution.pdfMetadata?.producer || ''}
                      onChange={(e) => setInstitution({
                        ...institution,
                        pdfMetadata: { ...institution.pdfMetadata, producer: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Raw Tx Data */}
          {activeTab === 'raw_tx' && (
            <div className="max-h-48 overflow-y-auto border border-slate-800 rounded bg-slate-950 text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Type</th>
                    <th className="p-2 text-right">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-1.5 font-mono">{tx.date}</td>
                      <td className="p-1.5 font-medium">{tx.description}</td>
                      <td className="p-1.5 text-slate-400">{tx.type}</td>
                      <td className={`p-1.5 text-right font-mono font-semibold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
