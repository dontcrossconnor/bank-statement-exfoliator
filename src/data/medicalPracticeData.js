export const MEDICAL_PRACTICE_DATA = {
  customerInfo: {
    name: 'ONE WEST MEDICAL GROUP, INC.',
    subName: 'GLENN MARSHAK',
    address: '8920 WILSHIRE BLVD STE 301',
    cityStateZip: 'BEVERLY HILLS CA 90211-3207'
  },
  account: {
    accountNumber: 'XXXXXX8501',
    fullAccountNumber: 'XXXXXX8501',
    type: 'ANALYZED BUSINESS CHECKING',
    startingBalance: 238450.18,
    apy: '1.75%',
    interestYtd: 4049.29
  },
  month1: {
    statementMeta: {
      startDate: '2026-06-01',
      endDate: '2026-06-30'
    },
    startBalance: 238450.18,
    endBalance: 238364.63,
    deposits: [
      { id: 'm1-c1', date: '2026-06-04', description: 'FDMS / CLOVER SETTLEMENT BATCH 0892 4891028302 CCD', amount: 14890.00, category: 'credit' },
      { id: 'm1-c2', date: '2026-06-11', description: 'FDMS / CLOVER SETTLEMENT BATCH 0899 4891028302 CCD', amount: 15310.80, category: 'credit' },
      { id: 'm1-c3', date: '2026-06-18', description: 'FDMS / CLOVER SETTLEMENT BATCH 0907 4891028302 CCD', amount: 16110.00, category: 'credit' },
      { id: 'm1-c4', date: '2026-06-25', description: 'FDMS / CLOVER SETTLEMENT BATCH 0914 4891028302 CCD', amount: 15840.00, category: 'credit' }
    ],
    otherCredits: [
      { id: 'm1-oc1', date: '2026-06-03', description: 'STRIPE TRANSFER / PAYOUT ST-98214A DES:PAYOUT ID:1800293411 CCD', amount: 16240.50, category: 'otherCredit' },
      { id: 'm1-oc2', date: '2026-06-05', description: 'SYF/CARECREDIT DIR DEP SETTLE 48102 SYNCHRONY BANK PPD', amount: 12450.00, category: 'otherCredit' },
      { id: 'm1-oc3', date: '2026-06-10', description: 'STRIPE TRANSFER / PAYOUT ST-98288B DES:PAYOUT ID:1800293411 CCD', amount: 18920.00, category: 'otherCredit' },
      { id: 'm1-oc4', date: '2026-06-12', description: 'SYF/CARECREDIT DIR DEP SETTLE 48155 SYNCHRONY BANK PPD', amount: 11780.00, category: 'otherCredit' },
      { id: 'm1-oc5', date: '2026-06-17', description: 'STRIPE TRANSFER / PAYOUT ST-98361C DES:PAYOUT ID:1800293411 CCD', amount: 17450.25, category: 'otherCredit' },
      { id: 'm1-oc6', date: '2026-06-19', description: 'SYF/CARECREDIT DIR DEP SETTLE 48210 SYNCHRONY BANK PPD', amount: 13290.50, category: 'otherCredit' },
      { id: 'm1-oc7', date: '2026-06-24', description: 'STRIPE TRANSFER / PAYOUT ST-98440D DES:PAYOUT ID:1800293411 CCD', amount: 19150.00, category: 'otherCredit' },
      { id: 'm1-oc8', date: '2026-06-26', description: 'SYF/CARECREDIT DIR DEP SETTLE 48278 SYNCHRONY BANK PPD', amount: 14210.00, category: 'otherCredit' },
      { id: 'm1-oc9', date: '2026-06-30', description: 'INTEREST CREDIT', amount: 388.90, category: 'otherCredit' }
    ],
    debits: [
      { id: 'm1-d1', date: '2026-06-01', description: 'WILSHIRE PROPERTIES LLC COMMERCIAL LEASE PMT TR# 98214', amount: -11500.00, category: 'debit' },
      { id: 'm1-d2', date: '2026-06-02', description: 'THE DOCTORS COMPANY MALPRACTICE INS POLICY #491028-CA', amount: -3450.00, category: 'debit' },
      { id: 'm1-d3', date: '2026-06-08', description: 'ALLERGAN USA INC PHARMACEUTICALS & AESTHETICS INV# 88219', amount: -7840.25, category: 'debit' },
      { id: 'm1-d4', date: '2026-06-15', description: 'BEVERLY HILLS SURGICENTER AMBULATORY FACILITY FEE', amount: -5200.00, category: 'debit' },
      { id: 'm1-d5', date: '2026-06-23', description: 'MEDLINE INDUSTRIES INC SURGICAL DRAPES & PPE INV# 49201', amount: -1640.75, category: 'debit' },
      { id: 'm1-d6', date: '2026-06-25', description: 'ONLINE BANKING TRANSFER TO CHK ...4946 CONFIRMATION# 7819024165', amount: -150000.00, category: 'debit' }
    ],
    otherDebits: [
      { id: 'm1-od1', date: '2026-06-09', description: 'MCKESSON MEDICAL-SURGICAL SUPPLY ACH DEBIT INV# 40192', amount: -3180.50, category: 'otherDebit' },
      { id: 'm1-od2', date: '2026-06-16', description: 'NEXTECH SYSTEMS EMR EHR SOFTWARE SUBSCRIPTION', amount: -1250.00, category: 'otherDebit' },
      { id: 'm1-od3', date: '2026-06-22', description: 'STERICYCLE INC MEDICAL BIOHAZARD REG DISPOSAL SVCS', amount: -485.00, category: 'otherDebit' },
      { id: 'm1-od4', date: '2026-06-29', description: 'QUEST DIAGNOSTICS CLINICAL PATHOLOGY LAB SVCS', amount: -890.00, category: 'otherDebit' },
      { id: 'm1-od5', date: '2026-06-30', description: 'SOUTHERN CALIFORNIA EDISON COMMERCIAL UTILITY PMT', amount: -680.00, category: 'otherDebit' }
    ]
  },
  month2: {
    statementMeta: {
      startDate: '2026-07-01',
      endDate: '2026-07-31'
    },
    startBalance: 238364.63,
    endBalance: 223214.70,
    deposits: [
      { id: 'm2-c1', date: '2026-07-06', description: 'FDMS / CLOVER SETTLEMENT BATCH 0921 4891028302 CCD', amount: 15420.50, category: 'credit' },
      { id: 'm2-c2', date: '2026-07-13', description: 'FDMS / CLOVER SETTLEMENT BATCH 0928 4891028302 CCD', amount: 16280.00, category: 'credit' },
      { id: 'm2-c3', date: '2026-07-20', description: 'FDMS / CLOVER SETTLEMENT BATCH 0935 4891028302 CCD', amount: 15750.80, category: 'credit' },
      { id: 'm2-c4', date: '2026-07-27', description: 'FDMS / CLOVER SETTLEMENT BATCH 0942 4891028302 CCD', amount: 16330.00, category: 'credit' }
    ],
    otherCredits: [
      { id: 'm2-oc1', date: '2026-07-03', description: 'STRIPE TRANSFER / PAYOUT ST-98512A DES:PAYOUT ID:1800293411 CCD', amount: 17110.00, category: 'otherCredit' },
      { id: 'm2-oc2', date: '2026-07-07', description: 'SYF/CARECREDIT DIR DEP SETTLE 48330 SYNCHRONY BANK PPD', amount: 13150.00, category: 'otherCredit' },
      { id: 'm2-oc3', date: '2026-07-10', description: 'STRIPE TRANSFER / PAYOUT ST-98589B DES:PAYOUT ID:1800293411 CCD', amount: 18340.25, category: 'otherCredit' },
      { id: 'm2-oc4', date: '2026-07-14', description: 'SYF/CARECREDIT DIR DEP SETTLE 48398 SYNCHRONY BANK PPD', amount: 12890.00, category: 'otherCredit' },
      { id: 'm2-oc5', date: '2026-07-17', description: 'STRIPE TRANSFER / PAYOUT ST-98664C DES:PAYOUT ID:1800293411 CCD', amount: 16920.00, category: 'otherCredit' },
      { id: 'm2-oc6', date: '2026-07-21', description: 'SYF/CARECREDIT DIR DEP SETTLE 48462 SYNCHRONY BANK PPD', amount: 11940.00, category: 'otherCredit' },
      { id: 'm2-oc7', date: '2026-07-24', description: 'STRIPE TRANSFER / PAYOUT ST-98741D DES:PAYOUT ID:1800293411 CCD', amount: 19450.00, category: 'otherCredit' },
      { id: 'm2-oc8', date: '2026-07-28', description: 'SYF/CARECREDIT DIR DEP SETTLE 48530 SYNCHRONY BANK PPD', amount: 13850.00, category: 'otherCredit' },
      { id: 'm2-oc9', date: '2026-07-31', description: 'INTEREST CREDIT', amount: 629.42, category: 'otherCredit' }
    ],
    debits: [
      { id: 'm2-d1', date: '2026-07-01', description: 'WILSHIRE PROPERTIES LLC COMMERCIAL LEASE PMT TR# 98390', amount: -11500.00, category: 'debit' },
      { id: 'm2-d2', date: '2026-07-02', description: 'THE DOCTORS COMPANY MALPRACTICE INS POLICY #491028-CA', amount: -3450.00, category: 'debit' },
      { id: 'm2-d3', date: '2026-07-06', description: 'BEVERLY HILLS SURGICENTER AMBULATORY FACILITY FEE', amount: -4800.00, category: 'debit' },
      { id: 'm2-d4', date: '2026-07-08', description: 'ALLERGAN USA INC PHARMACEUTICALS & AESTHETICS INV# 89044', amount: -8250.00, category: 'debit' },
      { id: 'm2-d5', date: '2026-07-13', description: 'GALDERMA LABORATORIES RESTYLANE / DYSPORT ORDER 77210', amount: -4620.00, category: 'debit' },
      { id: 'm2-d6', date: '2026-07-15', description: 'CEDARS-SINAI SURGICAL PATHOLOGY REFERENCE LAB SVCS', amount: -1840.00, category: 'debit' },
      { id: 'm2-d7', date: '2026-07-20', description: 'BEVERLY HILLS SURGICENTER OR SUITE OVERTIME CHARGES', amount: -2400.00, category: 'debit' },
      { id: 'm2-d8', date: '2026-07-23', description: 'MEDLINE INDUSTRIES INC SURGICAL DRAPES & PPE INV# 49388', amount: -1420.50, category: 'debit' },
      { id: 'm2-d9', date: '2026-07-27', description: 'MERZ NORTH AMERICA RADIESSE / XEOMIN DIRECT SHIP', amount: -3890.00, category: 'debit' },
      { id: 'm2-d10', date: '2026-07-28', description: 'ONLINE BANKING TRANSFER TO CHK ...4946 CONFIRMATION# 8642019430', amount: -150000.00, category: 'debit' }
    ],
    otherDebits: [
      { id: 'm2-od1', date: '2026-07-07', description: 'CANON FINANCIAL SERVICES MEDICAL LASER EQUIPMENT LEASE', amount: -1650.00, category: 'otherDebit' },
      { id: 'm2-od2', date: '2026-07-09', description: 'HENRY SCHEIN MEDICAL CLINICAL INSTRUMENTS & RX INV# 33910', amount: -2890.40, category: 'otherDebit' },
      { id: 'm2-od3', date: '2026-07-14', description: 'SHRED-IT / STERICYCLE HIPAA DOCUMENT & SHARPS DISPOSAL', amount: -485.00, category: 'otherDebit' },
      { id: 'm2-od4', date: '2026-07-16', description: 'NEXTECH SYSTEMS EMR EHR SOFTWARE SUBSCRIPTION', amount: -1250.00, category: 'otherDebit' },
      { id: 'm2-od5', date: '2026-07-21', description: 'BEVERLY HILLS ANESTHESIA ASSOCIATES MEDICAL GROUP', amount: -1950.00, category: 'otherDebit' },
      { id: 'm2-od6', date: '2026-07-24', description: 'QUEST DIAGNOSTICS CLINICAL PATHOLOGY LAB SVCS', amount: -740.00, category: 'otherDebit' },
      { id: 'm2-od7', date: '2026-07-28', description: 'DOCTOR.COM / PRESS GANEY REPUTATION & PATIENT PORTAL', amount: -650.00, category: 'otherDebit' },
      { id: 'm2-od8', date: '2026-07-29', description: 'CINTAS MEDICAL SCRUBS & LINEN HYGIENE SERVICE', amount: -380.00, category: 'otherDebit' },
      { id: 'm2-od9', date: '2026-07-30', description: 'SPECTRUM BUSINESS DEDICATED FIBER INTERNET PMT', amount: -320.00, category: 'otherDebit' },
      { id: 'm2-od10', date: '2026-07-31', description: 'SOUTHERN CALIFORNIA EDISON COMMERCIAL UTILITY PMT', amount: -725.00, category: 'otherDebit' }
    ]
  }
};
