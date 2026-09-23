# Pixel-Identical Vectorization & Dynamic CFF Font Subsetting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vectorize Credit Union Logo and Background Watermark into native pixel-identical SVG components in [US1364CreditUnionTemplate.jsx](file:///e:/StatementGen/src/components/templates/US1364CreditUnionTemplate.jsx) (making the promotional banner the only raster Image XObject), and implement dynamic CFF font subsetting for Arial-BoldMT and ArialMT in [native_vector_reencoder.py](file:///e:/StatementGen/native_vector_reencoder.py).

**Architecture:** 
1. Convert the Quadient Inspire master vector spool paths (Object 5, drawings 1-22 in [Regular Statements_2024-01-31.pdf](file:///H:/USFCU/Federal_Credit_Union/data/STATEMENTS/Monthly%20Statements/2024/01-January/Regular%20Statements_2024-01-31.pdf)) into pure SVG components ([Us1364Logo.jsx](file:///e:/StatementGen/src/components/vectors/Us1364Logo.jsx) and [Us1364Watermark.jsx](file:///e:/StatementGen/src/components/vectors/Us1364Watermark.jsx)), replacing all raster template framing in [US1364CreditUnionTemplate.jsx](file:///e:/StatementGen/src/components/templates/US1364CreditUnionTemplate.jsx).
2. Enhance [native_vector_reencoder.py](file:///e:/StatementGen/native_vector_reencoder.py) with dynamic CFF font subsetting using `fontTools.cffLib` and standard AFM metrics to prune CFF CharStrings, Charset, and Widths arrays to ~70-80 used characters while guaranteeing digits, letters, punctuation, and pipe `|` are fully preserved.
3. Validate 100% parity across `verify_session_forensics.py`, `verify_all_statement_pages.py`, and `pytest tests/`.

**Tech Stack:** React 19, Vite, Tailwind CSS, Playwright, PyMuPDF, fontTools, OpenCV, PyPDF.

## Global Constraints
- ZERO-TOLERANCE PIXEL-BASED MEASURING RULE: Exact 0px edge delta at 300 DPI across all cards and tables.
- All links must use format `[filename](file:///e:/path/to/file)` with exact 3 slashes `file:///`.
- NO MOCKS, STUBS, or TODOs.
- The 1,125 × 780 promotional banner must be the ONLY raster Image XObject in the document.

---

### Task 1: Vectorization of Logo and Watermark

**Files:**
- Create: `src/components/vectors/Us1364Watermark.jsx`
- Modify: `src/components/vectors/Us1364Logo.jsx`
- Modify: `src/components/vectors/index.js`
- Modify: `src/components/templates/US1364CreditUnionTemplate.jsx`

**Interfaces:**
- Consumes: Authentic vector drawing coordinates extracted from [Regular Statements_2024-01-31.pdf](file:///H:/USFCU/Federal_Credit_Union/data/STATEMENTS/Monthly%20Statements/2024/01-January/Regular%20Statements_2024-01-31.pdf).
- Produces: `<Us1364Logo />` and `<Us1364Watermark />` pure SVG React components.

- [ ] **Step 1: Update `Us1364Logo.jsx` with exact Quadient master spool vector Bézier paths**
- [ ] **Step 2: Create `Us1364Watermark.jsx` with exact Quadient master spool vector Bézier paths and #f2f2f2 fill**
- [ ] **Step 3: Export both components from `src/components/vectors/index.js`**
- [ ] **Step 4: Update `US1364CreditUnionTemplate.jsx` to replace raster `authenticLogo` and `authenticWatermark` with vector components**
- [ ] **Step 5: Verify raster equivalence down to 0px edge delta at 300 DPI against master spool and authentic assets**

---

### Task 2: Dynamic CFF Font Subsetting

**Files:**
- Modify: `native_vector_reencoder.py`
- Test: `tests/test_native_vector_reencoder_unit.py`

**Interfaces:**
- Consumes: Raw text strings extracted during PDF stream normalization.
- Produces: `subset_cff(base_cff_bytes, used_chars)` and `get_subset_type1_widths(font_name, used_chars)`.

- [ ] **Step 1: Write unit tests in `tests/test_native_vector_reencoder_unit.py` asserting dynamic CFF subsetting, glyph count reduction (~70-80 glyphs), and presence of digits, letters, punctuation, pipe `|`**
- [ ] **Step 2: Run test to verify failure before implementation**
- [ ] **Step 3: Implement `subset_cff` and `get_subset_type1_widths` in `native_vector_reencoder.py` using `fontTools.cffLib` and `pymupdf.Font`**
- [ ] **Step 4: Integrate character collection in `reencode_vector_stream` across `/F` and `/F0` and embed subsetted CFF streams with dynamically bounded `/FirstChar`, `/LastChar`, and `/Widths`**
- [ ] **Step 5: Run unit tests to verify they pass**

---

### Task 3: Production Pipeline Export & Full Forensic Verification

**Files:**
- Run: `npm run build`
- Run: `export_pdfs.py`
- Verify: `verify_session_forensics.py`
- Verify: `verify_all_statement_pages.py`
- Verify: `pytest tests/`

- [ ] **Step 1: Run `npm run build` to verify frontend builds cleanly**
- [ ] **Step 2: Export all statements via `python export_pdfs.py`**
- [ ] **Step 3: Verify Image XObjects on all pages - promotional banner is the ONLY raster image**
- [ ] **Step 4: Run `python verify_session_forensics.py`**
- [ ] **Step 5: Run `python verify_all_statement_pages.py`**
- [ ] **Step 6: Run `pytest tests/`**
