# Project: Multi-Route Statement Generation & Forensic Parity

## Architecture
StatementGen is a high-fidelity financial statement generation engine. The architecture integrates three distinct generation routes:
1. **Standard Vector Export Route**: Chromium/Playwright print-to-PDF pipeline producing high-resolution vector PDF layouts with standard metadata.
2. **Authentic 1:1 ULURO Image-Wrapped Container Route (`uluro_pdf_container.py`)**: Byte-exact container synthesizer taking 300 DPI uncompressed 8-bit DeviceRGB frames (2550 x 3300, 25,245,000 bytes/page), zlib-compressing them, and packaging them into the canonical 11-object structure (scaling dynamically to 4N+3 objects) matching `11-30-24.pdf` with zero fonts and zero Skia markers.
3. **Native Vector Stream Re-Encoder Route (`native_vector_reencoder.py`)**: Vector stream normalizer stripping Skia inverted matrices (`.23999999 0 0 -.23999999 0 792 cm`), re-orienting all coordinates to bottom-left Cartesian (0,0), mapping Type 0 composite CIDFonts to Adobe Type 1 (`Arial-BoldMT`, `ArialMT`), and defragmenting text operators to match Quadient Inspire master spools.
4. **Unified CLI & Web UI Exporter (`export_pdfs.py`, `Header.jsx`, `App.jsx`)**: Exposes `export_statement(scenario_id, output_path, mode=...)`, CLI flags `--mode` and `--scenario`, and React UI dropdown for generation route selection.
5. **6-Layer Forensic Auditor (`compare_uluro_container_forensics.py`)**: Validates structural, stream, font, metadata, binary marker, and pixel-level visual alignment against canonical reference statement `11-30-24.pdf`.

```
                  ┌───────────────────────────────┐
                  │ Web UI (Header.jsx / App.jsx) │
                  │  CLI (export_pdfs.py --mode)  │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                     export_statement(..., mode)
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ (mode='vector')        │ (mode='uluro-image-    │ (mode='native-vector-
         ▼                        │        wrapped')       │        reencoded')
  Playwright / Vite               ▼                        ▼
  Headless Chromium       Render 300 DPI Frames    Playwright Vector Output
         │                (2550x3300 DeviceRGB)            │
         │                        │                        ▼
         │                        ▼                native_vector_reencoder.py
         │              uluro_pdf_container.py     - Strip inverted Skia cm
         │              - 4N+3 object graph        - Remap to (0,0) Cartesian
         │              - zlib FlateDecode         - Adobe Type 1 font mapping
         │              - UTF-16BE hex metadata    - Defragment text runs
         │              - 0 fonts, 0 Skia markers          │
         ▼                        ▼                        ▼
  [Vector Statement]       [ULURO Container]       [Normalized Vector]
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
           Verification Suite & 6-Layer Forensic Auditor
           - compare_uluro_container_forensics.py (6 layers)
           - verify_all_statement_pages.py (0px edge delta)
           - verify_statement_forensics.py
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | ULURO Header & Binary Marker | Exact `%PDF-1.4\n%\xd2\xe5\xd1\xf2\n` (15 bytes) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Image XObject Synthesis | 300 DPI 2550x3300 8-bit DeviceRGB `/FlateDecode` stream (25,245,000 raw bytes) | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Page Content Stream | Exact 1:1 scaled `/Img0 Do` drawing stream | M1 | ORIGINAL_REQUEST §R1 |
| 4 | UTF-16BE Metadata Encoding | `/Producer`, `/Creator`, `/Author`, `/CreationDate` hex-encoded metadata with `<FEFF...>` | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Dynamic 4N+3 Object Scaling | Exact 11-object structure for N=2, scaling to 4N+3 objects for arbitrary N pages | M1 | ORIGINAL_REQUEST §R1 |
| 6 | Exact XREF Table & Trailer | Byte-exact 20-byte XREF entries and trailer with matching `/ID` array | M1 | ORIGINAL_REQUEST §R1 |
| 7 | Zero Fonts & Zero Markers | Assert 0 embedded fonts and absolute absence of Skia/Chromium/WebKit/Cairo bytes | M1, M4 | ORIGINAL_REQUEST §R1, R4 |
| 8 | Skia Matrix Removal | Strip top-level `.23999999 0 0 -.23999999 0 792 cm` and `1 0 0 -1 0 792 cm` | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Cartesian Coordinate Normalization | Normalize all paths and text operators to bottom-left (0,0) where Y increases upwards | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Adobe Type 1 Font Normalization | Normalize Skia Type 0 composite CIDFonts to Adobe Type 1 (`Arial-BoldMT`, `ArialMT`) matching Quadient Inspire | M2 | ORIGINAL_REQUEST §R2 |
| 11 | Text Operator Defragmentation | Flatten micro-fragmented text glyph runs into cohesive string drawing operators | M2 | ORIGINAL_REQUEST §R2 |
| 12 | CLI Exporter `--mode` Support | `export_pdfs.py` supporting `--mode` (`vector`, `uluro-image-wrapped`, `native-vector-reencoded`, `all`) and `--scenario` | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Unified `export_statement` API | Python API routing cleanly to the chosen generation engine | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Web UI Route Selector Dropdown | Dropdown in `Header.jsx` / `App.jsx` allowing user to select export route | M3 | ORIGINAL_REQUEST §R3 |
| 15 | Layer 1 Forensic Check | Object count and dictionary key parity against `11-30-24.pdf` | M4 | ORIGINAL_REQUEST §R4 |
| 16 | Layer 2 Forensic Check | Image stream geometry (2550x3300, 8-bit DeviceRGB, 25,245,000 bytes) | M4 | ORIGINAL_REQUEST §R4 |
| 17 | Layer 3 Forensic Check | Zero fonts, zero font descriptors, zero Skia inversion operators | M4 | ORIGINAL_REQUEST §R4 |
| 18 | Layer 4 Forensic Check | UTF-16BE hex metadata encoding parity and trailer `/ID` format | M4 | ORIGINAL_REQUEST §R4 |
| 19 | Layer 5 Forensic Check | Absence of `Skia`, `Chromium`, `WebKit`, `Cairo` byte markers | M4 | ORIGINAL_REQUEST §R4 |
| 20 | Layer 6 Forensic Check | OpenCV pixel-by-pixel difference mapping at 300 DPI verifying visual alignment | M4 | ORIGINAL_REQUEST §R4 |
| 21 | Full Acceptance Suite Verification | Verify all statement pages pass with 0px edge delta (`verify_all_statement_pages.py`) and all modes run cleanly | M4 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Design 4-tier requirement-driven test harness and publish `TEST_READY.md` | none | DONE |
| M1 | ULURO Container Engine | Implement `uluro_pdf_container.py` (Features 1, 2, 3, 4, 5, 6, 7) | none | DONE |
| M2 | Native Vector Re-Encoder | Implement `native_vector_reencoder.py` (Features 8, 9, 10, 11) | none | DONE |
| M3 | CLI & Web UI Pipeline Integration | Refactor `export_pdfs.py` with `--mode`, unified `export_statement`, and update `Header.jsx` / `App.jsx` (Features 12, 13, 14) | M1, M2 | DONE |
| M4 | 6-Layer Forensic Auditor & Acceptance | Implement `compare_uluro_container_forensics.py` and run full acceptance suite (Features 15-21) | M1, M2, M3, E2E | DONE |

## Interface Contracts

### `uluro_pdf_container.py` ↔ Consumers (`export_pdfs.py`, tests)
```python
def create_uluro_container_from_images(
    images: list[bytes | np.ndarray | Image.Image],
    output_path: str,
    metadata: dict[str, str] | None = None,
    creation_date: str = "D:20241211102447"
) -> str:
    """
    Creates an authentic byte-exact ULURO PDF container.
    - images: List of 300 DPI uncompressed 8-bit DeviceRGB frames (shape: 3300x2550x3 or 25,245,000 bytes each).
    - output_path: Destination PDF filepath.
    - metadata: Optional dictionary of metadata values (/Producer, /Creator, /Author, etc.).
    - creation_date: PDF date string format (default matching 11-30-24.pdf).
    Returns output_path.
    """

def convert_pdf_to_uluro_container(
    input_pdf_path: str,
    output_pdf_path: str,
    metadata: dict[str, str] | None = None,
    creation_date: str = "D:20241211102447"
) -> str:
    """
    Renders input PDF pages at 300 DPI DeviceRGB and packages into an authentic ULURO container.
    """
```

### `native_vector_reencoder.py` ↔ Consumers (`export_pdfs.py`, tests)
```python
def reencode_vector_stream(
    input_pdf_path: str,
    output_pdf_path: str,
    metadata: dict[str, str] | None = None
) -> str:
    """
    Normalizes a vector PDF:
    - Strips Skia inverted transformation matrices.
    - Normalizes all drawing and text coordinates to standard bottom-left Cartesian (0,0).
    - Replaces Type 0 composite CIDFonts with Adobe Type 1 ArialMT / Arial-BoldMT.
    - Defragments text runs into cohesive string drawing operators.
    Returns output_pdf_path.
    """
```

### `export_pdfs.py` ↔ CLI / System
```python
def export_statement(
    scenario_id: str,
    output_path: str,
    mode: str = "vector",
    creation_date: str = "D:20241211102447",
    port: int = 5176
) -> str:
    """
    Unified export function.
    - mode: 'vector' | 'uluro-image-wrapped' | 'native-vector-reencoded' | 'all'
    Returns path of generated PDF (or list of paths if mode='all').
    """
```

### CLI Interface:
```bash
python export_pdfs.py --mode=[vector|uluro-image-wrapped|native-vector-reencoded|all] [--scenario=<scenario_id>] [--output=<path>]
```

## Code Layout
- `[uluro_pdf_container.py](file:///e:/StatementGen/uluro_pdf_container.py)`: Byte-exact ULURO PDF container synthesizer.
- `[native_vector_reencoder.py](file:///e:/StatementGen/native_vector_reencoder.py)`: Vector stream re-encoder normalizer.
- `[export_pdfs.py](file:///e:/StatementGen/export_pdfs.py)`: Unified CLI exporter and generation router.
- `[compare_uluro_container_forensics.py](file:///e:/StatementGen/compare_uluro_container_forensics.py)`: 6-layer forensic auditor.
- `[verify_all_statement_pages.py](file:///e:/StatementGen/verify_all_statement_pages.py)`: 0px edge delta OpenCV verification.
- `[src/components/Header.jsx](file:///e:/StatementGen/src/components/Header.jsx)`: Header component with route selector dropdown.
- `[src/App.jsx](file:///e:/StatementGen/src/App.jsx)`: Web application controller with route export handlers.
- `[tests/e2e/](file:///e:/StatementGen/tests/e2e/)`: E2E test suites (Tiers 1-4).
