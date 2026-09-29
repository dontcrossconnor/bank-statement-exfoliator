# StatementGen

High-fidelity financial statement generation engine and forensic parity pipeline. StatementGen produces authentic, audit-grade bank and credit union statement deliverables with byte-level document composition parity matching enterprise publishing platforms (**Quadient Inspire Enterprise 12.0.85.0**).

---

## Key Features

- **Native Vector Stream Re-Encoder (`native_vector_reencoder.py`)**:
  - Re-encodes Playwright/Chromium print streams to remove Skia matrix transformations.
  - Re-orients coordinate systems to standard bottom-left Cartesian `(0, 0)`.
  - Dynamically subsets and embeds CFF Type 1C fonts (`Arial-BoldMT`, `ArialMT` via `fontTools.cffLib`).
  - Produces clean, live searchable vector text without micro-fragmented CID operators.
  - Formats as Linearized PDF 1.5 with cross-reference streams (`/Type /XRef`) and compressed object streams (`/Type /ObjStm`).

- **Turnkey Multi-Month Financial Continuity**:
  - Exact balance equation integrity: $\text{Previous} + \text{Deposits} - \text{Withdrawals} = \text{Ending}$.
  - Daily Average Balance (ADB) schedules and APY dividend interest yield calculations verified with $0.00$ delta.
  - Monthly envelope micro-code tracking and human navigation download cadence decoupled from cycle batch dates.

- **Automated 11-Layer Forensic Validation & Regression Suite**:
  - **128 automated tests** spanning unit, boundary, combination, scenario, and adversarial stress tests.
  - Script-driven OpenCV 300 DPI individual pixel-level margin edge delta verifications ($0\,\text{px}$ tolerance).
  - Continuous validation against master document spools.

---

## Quickstart & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Setup
```pwsh
# 1. Install frontend dependencies
npm install

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start local development server
npm run dev
```

---

## Turnkey Pipeline Execution

Generate canonical statement packages and run full forensic regression verification:

```pwsh
# Run entire turnkey pipeline via script:
./run_pipeline.ps1     # or run_pipeline.bat

# Or run individual steps manually:
# Compile and re-encode statement packages
python export_pdfs.py --scenario=us1364_aziz_june_2026_scenario
python export_pdfs.py --scenario=us1364_aziz_july_2026_scenario
python export_pdfs.py --scenario=us1364_aziz_august_2026_scenario

# Audit 11 forensic layers and financial continuity
python verify_session_forensics.py

# Audit OpenCV individual pixel-level edge deltas at 300 DPI (0px tolerance)
python verify_all_statement_pages.py

# Run full automated regression suite (128 tests)
pytest tests/
```

---

## Repository Structure

```
StatementGen/
├── src/
│   ├── components/         # React statement layout components & vectors
│   │   ├── templates/      # Credit Union, US Metro Bank, Hingham Savings templates
│   │   └── vectors/        # Authentic SVGs, logos, and watermarks
│   ├── data/               # Client datasets and institution presets
│   └── utils/              # Calculation, formatting, and generation utilities
├── tests/
│   ├── e2e/                # End-to-end multi-tier test suites
│   ├── conftest.py         # Pytest fixtures and canonical PDF references
│   └── test_*.py           # Re-encoder unit, stress, and adversarial tests
├── native_vector_reencoder.py  # Production Quadient Inspire vector re-encoder
├── uluro_pdf_container.py      # Legacy container engine (reference/regression)
├── export_pdfs.py              # Multi-route CLI statement exporter
├── verify_all_statement_pages.py # OpenCV 300 DPI margin verifier
├── verify_session_forensics.py   # 11-layer session forensic auditor
├── pytest.ini                  # Pytest test discovery configuration
└── requirements.txt            # Python dependencies
```

---

## License

Private / Proprietary. All rights reserved.
