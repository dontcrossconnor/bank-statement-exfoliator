# Financial Institution Fonts & PDF Vector Subsetting Guide

This reference guide documents the required corporate brand font files, their filenames, and how the automatic **Web & Native PDF Vector Font Subsetting Engine** registers and embeds them.

---

## 📁 Installation Directory
Drop all downloaded `.ttf` or `.woff2` font files into:
`E:\StatementGen\public\fonts\`

---

## 🏛️ Required Brand Fonts & Target Filenames

### 1. Bank of America (`bofa_sim`)
* **Primary Body Font**: `Connections Sans`
* **Headline Display Font**: `Connections`
* **Mono Reference Code Font**: `Connections Mono`
* **Target Filenames**:
  * `public/fonts/ConnectionsSans.ttf` *(Primary e-statement body text)*
  * `public/fonts/Connections.ttf` *(Bank header logo & titles)*
  * `public/fonts/ConnectionsSans.woff2` *(Web preview)*

---

### 2. Wells Fargo (`wells_sim`)
* **Primary Body Font**: `Wells Fargo Sans`
* **Header Serif Font**: `Wells Fargo Serif`
* **Target Filenames**:
  * `public/fonts/WellsFargoSans.ttf` *(Primary e-statement body text)*
  * `public/fonts/WellsFargoSans.woff2` *(Web preview)*

---

### 3. Charles Schwab (`schwab_sim`)
* **Primary Body Font**: `Schwab Sans` / `Charles Schwab Sans`
* **Target Filenames**:
  * `public/fonts/SchwabSans.ttf` *(Investor checking statement text)*
  * `public/fonts/SchwabSans.woff2` *(Web preview)*

---

### 4. Fidelity Investments (`fidelity_sim`)
* **Primary Body Font**: `Fidelity Sans`
* **Target Filenames**:
  * `public/fonts/FidelitySans.ttf` *(Cash management statement text)*
  * `public/fonts/FidelitySans.woff2` *(Web preview)*

---

### 5. JPMorgan Chase (`chase_sim`) & Credit Unions
* **Chase Bank**: `Open Sans` *(Regular & Semi-Bold)*
* **Navy Federal FCU**: `Montserrat` *(Regular & Bold)*
* **PenFed CU**: `Open Sans` *(Regular & Semi-Bold)*
* *Note: Google Fonts are automatically rendered via web fallback or can be dropped into `/public/fonts/` as `OpenSans.ttf` / `Montserrat.ttf`.*

---

## ⚙️ How Automatic Subsetting & PDF Vector Embedding Works

1. **System & Web Auto-Detection**:
   - The application inspects your OS (`C:\Windows\Fonts`) and the project directory `E:\StatementGen\public\fonts\`.
   - On the web preview, CSS `@font-face` rules seamlessly swap from web fallbacks to authentic brand fonts as soon as files are detected.

2. **Native PDF Virtual File System (VFS) Registration**:
   - When you click **Download Official PDF**, `exportVectorizedPdf()` executes an async pre-fetcher (`loadAndRegisterCustomFont`).
   - If the matching `.ttf` file exists in `/public/fonts/`, the raw font ArrayBuffer is loaded into `jsPDF` Virtual File System (`addFileToVFS`) and registered (`addFont`).

3. **Glyph Subsetting**:
   - The exporter sets `putOnlyUsedFonts: true` and `compress: true`.
   - The PDF generator automatically extracts and embeds **only the exact glyph characters used on the statement pages**, producing lightweight, 1:1 authentic vector PDFs.

4. **Fallback Behavior**:
   - If a specific `.ttf` font is not present in `/public/fonts/`, the engine safely falls back to standard embedded `Helvetica` vector text without crashing or generating blank documents.
