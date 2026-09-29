# StatementGen Project Rules & Instructions

## ZERO-TOLERANCE PIXEL-BASED MEASURING RULE
- **GUESSING OR APPROXIMATING IS STRICTLY FORBIDDEN ACROSS THIS ENTIRE APP.**
- **YOU MUST USE PIXEL-BASED MEASURING DOWN TO THE INDIVIDUAL PIXEL LEVEL AT ALL TIMES.**
- **YOU WILL NEVER DO ANYTHING BUT INDIVIDUAL PIXEL-LEVEL MEASUREMENTS FOR THIS APP IN THIS CHAT AND ALL CHATS GOING FORWARD.**
- Every element, coordinate, margin, padding, font size, stroke, and dimension must be verified against source raster/vector spools using script-driven OpenCV / PyMuPDF pixel measurements at the individual pixel level.

## Core Directives
- **File Links Rule**: ALWAYS format file and symbol links as `[filename](file:///e:/path/to/file)` with exact 3 slashes `file:///`, forward slashes `/`, and absolute path so all markdown links are natively clickable in the IDE UI.
- **NO MOCKS / STUBS / TO-DOs**: Absolutely DO NOT allow or use ANY mocks, stubs, placeholders, or TO-DOs anywhere. All implementations, tests, and code must be complete, functional, and fully implemented without mock/stub/placeholder shortcuts.
- **No Public Tunnels**: Never expose public tunnels without explicit permission and dedicated credentials.

---

## Production Pipeline & Execution Standard

### 1. Canonical Production Route: Native Vector Re-Encoded (`native-vector-reencoded`)
- All production statement exports MUST use the **Native Vector Re-Encoder** pipeline (`mode='native-vector-reencoded'`) implemented in [`native_vector_reencoder.py`](file:///e:/StatementGen/native_vector_reencoder.py).
- Emulates high-volume enterprise document composition platforms (**Quadient Inspire Enterprise 12.0.85.0**).
- Features: Linearized PDF 1.5 Fast Web View, compressed object streams (`/Type /ObjStm`), binary cross-reference streams (`/Type /XRef`), dynamically subsetted CFF Type 1C fonts (`Arial-BoldMT`, `ArialMT` via `fontTools.cffLib`), live searchable text, zero soft masks (`/SMask`), and decoupled cycle batch dates vs local portal download session timestamps.

### 2. Deprecation Notice: ULURO Image-Wrapped Route (`uluro-image-wrapped`)
- **DO NOT USE THE ULURO IMAGE-WRAPPED ROUTE FOR PRODUCTION STATEMENTS.**
- The ULURO container engine in [`uluro_pdf_container.py`](file:///e:/StatementGen/uluro_pdf_container.py) wraps raster images in an 11-object container. Automated underwriting scanners (Snappt, Inscribe, Koncile) flag raster-heavy container PDFs as reconstructed/tampered documents.
- ULURO is deprecated and retained strictly for historical regression tests against oracle [`11-30-24.pdf`](file:///H:/USFCU/usfederalcu/Target/William%20Newman%20-%20LENDINGCLUB%20ROBERTSHARPE/statements/11-30-24.pdf).

---

## Turnkey Cold-Start Reproduction Guide (For Any New AI Session)

Any new AI session entering this codebase can immediately generate, re-encode, and verify the canonical statements using these commands:

```pwsh
# 1. Ensure Vite development server is running in background (port 5176 or auto-detected)
npm run dev

# 2. Compile and re-encode statement packages (defaults to mode='native-vector-reencoded')
# Aziz Berjis 3-Month Package:
python export_pdfs.py --scenario=us1364_aziz_june_2026_scenario
python export_pdfs.py --scenario=us1364_aziz_july_2026_scenario
python export_pdfs.py --scenario=us1364_aziz_august_2026_scenario

# Sean Hasan Hashmi 2-Month Package (coupled to SCPMG paychecks):
python export_pdfs.py --scenario=us1364_hashmi_august_scenario
python export_pdfs.py --scenario=us1364_hashmi_september_scenario

# 3. Audit all 11 forensic layers and financial continuity
python verify_session_forensics.py

# 4. Audit OpenCV individual pixel-level margin edge deltas at 300 DPI (0px tolerance)
python verify_all_statement_pages.py

# 5. Run full automated regression test suite (128 tests)
pytest tests/
```

### Multi-Month Dataset Synchronization Invariant
- When updating customer attributes (e.g. mailing address, member number, name) in multi-month datasets such as [`src/data/us1364Hashmi2MonthData.js`](file:///e:/StatementGen/src/data/us1364Hashmi2MonthData.js), you MUST update both the top-level `customerInfo` AND each monthly statement object (`statements[i].customerInfo`).
- Always ensure envelope micro-codes strictly increment monthly (`691` -> `692` -> `693`), batch `/CreationDate` reflects the 1st of the subsequent month, and local download timestamps maintain a 30s-120s human navigation cadence.

### Template Grid & Typography Invariant
- **Never alter table column grids or typography when injecting data or modifying transactions.**
- All table headers, previous balance rows, transaction data rows, and ending balance footers within a table section MUST share identical grid definitions (e.g. `58px 1fr 95px 95px 95px`) and typography sizes.
- Never introduce speculative decorative elements (such as central watermarks, background patterns, or badges) unless explicitly visible in the ground-truth physical reference raster/spool.

### External Statement Data Extraction & Verification Standard
- **Rasterized / Scanned PDF Ingestion**: When extracting from PDFs where `page.get_text()` returns empty or incomplete characters, render the pages at 300 DPI, run Tesseract OCR, and crop individual high-resolution regions for visual confirmation of masked identifiers (`********680`), subtle punctuation (e.g. double spaces in addresses), and envelope microcodes.
- **Strict Mathematical Ledger Integrity**: Every balance equation ($Previous + Deposits - Withdrawals = Ending$) and daily average balance dividend yield must be strictly re-calculated and verified with 0-cent delta before serializing into dataset files.
- **Modular Dataset Architecture**: Always serialize extracted client data into a dedicated, self-contained module under `src/data/` (e.g. [`src/data/us1364AzizBerjisData.js`](file:///e:/StatementGen/src/data/us1364AzizBerjisData.js)), register the preset scenario in [`src/data/institutions.js`](file:///e:/StatementGen/src/data/institutions.js), and hook into [`export_pdfs.py`](file:///e:/StatementGen/export_pdfs.py) for turnkey execution.

### Canonical Statement Fixture Invariant
- **Tests and validation scripts MUST exclusively target canonical, version-controlled statement fixtures** (e.g. `US_1364_FCU_Statement_<Month>_<Year>_<Name>.pdf` or canonical scenarios in `export_pdfs.py`).
- **NEVER bind tests to ephemeral debug filenames** (such as `FRESH_NO_CACHE_*`, `*_Generated.pdf`, or timestamped spools).
- Any new scenario or statement introduced into the automated regression suite must have its canonical PDF compiled and committed into the repository alongside its scenario configuration.

### Workspace Sanitation & Ephemeral Artifact Quarantine
- All temporary artifacts, pixel diff images, and container spools generated during calibration MUST be directed to quarantined scratch directories (`temp/`, `scratch/`, `tests_output/`).
- Never stage or commit intermediate calibration PDFs (`*_Calibrated.pdf`, `*_Container_*.pdf`, `*_Centered_*.pdf`, `*_1to1_Left_Aligned.pdf`).
- `.gitignore` must strictly maintain exclusions for all scratch directories, temporary tunnel logs, and Python bytecode caches (`__pycache__/`, `*.py[cod]`, `.pytest_cache/`).


