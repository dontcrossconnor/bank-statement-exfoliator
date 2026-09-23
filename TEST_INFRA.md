# Test Infrastructure & Specification Matrix

## 1. Overview & Test Philosophy
The StatementGen test suite provides an opaque-box, requirement-driven end-to-end verification framework. All test cases are derived strictly from user requirements [ORIGINAL_REQUEST.md](file:///e:/StatementGen/.agents/ORIGINAL_REQUEST.md) and project architecture [PROJECT.md](file:///e:/StatementGen/PROJECT.md), independent of internal implementation code.

### Core Principles
1. **Zero Mocks / Stubs Policy**: No test doubles, mocks, or synthetic stubs are permitted. Tests operate on real PDF documents, real binary byte streams, authentic 2550 x 3300 8-bit DeviceRGB frame buffers (25,245,000 bytes), and true OpenCV / PyMuPDF rasterizations.
2. **Zero-Tolerance Pixel-Based Measuring Rule**: All visual alignment, margins, table header flushness, card borders, and element dimensions are measured down to the individual pixel level at 300 DPI using OpenCV contour detection and PyMuPDF vector inspection.
3. **Progressive Testability**: The harness dynamically discovers implemented modules (`uluro_pdf_container.py`, `native_vector_reencoder.py`, `export_pdfs.py`, `compare_uluro_container_forensics.py`). Tests against external oracles ([11-30-24.pdf](file:///H:/USFCU/usfederalcu/Target/William%20Newman%20-%20LENDINGCLUB%20ROBERTSHARPE/statements/11-30-24.pdf)) and existing statements execute immediately; unit-level consumer tests skip cleanly until milestone workers deliver the implementation.

---

## 2. Test Architecture & Code Layout

```
tests/
├── [__init__.py](file:///e:/StatementGen/tests/__init__.py)
├── [conftest.py](file:///e:/StatementGen/tests/conftest.py)             # Shared fixtures, oracles, and pixel measuring utilities
└── e2e/
    ├── [__init__.py](file:///e:/StatementGen/tests/e2e/__init__.py)
    ├── [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py)     # Tier 1: Feature Coverage (R1, R2, R3, R4)
    ├── [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py)   # Tier 2: Boundary & Corner Cases
    ├── [test_tier3_combinations.py](file:///e:/StatementGen/tests/e2e/test_tier3_combinations.py) # Tier 3: Cross-Feature Interactions
    └── [test_tier4_scenarios.py](file:///e:/StatementGen/tests/e2e/test_tier4_scenarios.py)    # Tier 4: Real-World Statement Scenarios
```

### Shared Fixtures & Helpers ([conftest.py](file:///e:/StatementGen/tests/conftest.py))
- `canonical_uluro_pdf`: Session fixture locating canonical reference statement [`11-30-24.pdf`](file:///H:/USFCU/usfederalcu/Target/William%20Newman%20-%20LENDINGCLUB%20ROBERTSHARPE/statements/11-30-24.pdf).
- `quadient_spool_pdf`: Session fixture locating Quadient Inspire master spool [`Regular Statements_2024-01-31.pdf`](file:///H:/USFCU/Federal_Credit_Union/data/STATEMENTS/Monthly%20Statements/2024/01-January/Regular%20Statements_2024-01-31.pdf).
- `existing_statements`: Session fixture mapping all 4 statement PDF artifacts on disk.
- `synthetic_frame_bytes`: Generates a real uncompressed 2550 x 3300 8-bit DeviceRGB buffer of length exactly 25,245,000 bytes with authentic header pixels (`#1129a2`).
- `synthetic_frame_numpy`: Generates a real `(3300, 2550, 3)` uint8 NumPy frame.
- `synthetic_frame_pil`: Generates a real `2550 x 3300` PIL Image.
- `sample_vector_pdf`: Generates a real 2-page vector PDF containing text, vector rectangles, and fonts.
- `measure_page_edges_at_300dpi`: Script-driven OpenCV contour analysis computing left and right edge coordinates and deltas at 300 DPI.

---

## 3. 4-Tier Test Suite Specification

### Tier 1: Feature Coverage (26 Test Cases)
Validates core requirements R1, R2, R3, and R4 with at least 5 test cases per feature:
- **R1: Authentic 1:1 ULURO Container Engine**:
  - `test_r1_pdf_header_and_binary_marker`: Exact 15-byte header `%PDF-1.4\n%\xd2\xe5\xd1\xf2\n`.
  - `test_r1_image_xobject_geometry_and_compression`: 2550 x 3300, 8-bit DeviceRGB, FlateDecode, 25,245,000 uncompressed bytes.
  - `test_r1_content_stream_1to1_scaling`: Exact clean 1:1 drawing commands `612 0 0 792 0 0 cm` and `/Img0 Do`.
  - `test_r1_utf16be_metadata_encoding`: UTF-16BE hex `<FEFF...>` or BOM `\xfe\xff` encoding for Producer, Creator, Author, CreationDate.
  - `test_r1_dynamic_4n_plus_3_object_scaling_2page`: Exact 11 objects for N=2 pages (scaling to 4N+3), xref size 12.
  - `test_r1_xref_and_trailer_id_syntax`: 20-byte formatted xref lines and matching 32-hex `/ID [<MD5><MD5>]`.
  - `test_r1_zero_fonts_and_engine_markers`: 0 embedded fonts and complete absence of Skia/Chromium/WebKit/Cairo byte markers.
- **R2: Native Vector Stream Re-Encoder Normalizer**:
  - `test_r2_skia_matrix_removal`: Stripping `.23999999 0 0 -.23999999 0 792 cm` and `1 0 0 -1 0 792 cm`.
  - `test_r2_bottom_left_cartesian_normalization`: Coordinates normalized to bottom-left (0,0) where Y increases upwards to 792 pt.
  - `test_r2_adobe_type1_font_normalization`: Normalizing Type 0 composite CIDFonts to Adobe Type 1 (`Arial-BoldMT`, `ArialMT`).
  - `test_r2_text_operator_defragmentation`: Flattening fragmented CID glyphs into cohesive string drawing operators `(...)Tj`.
  - `test_r2_zero_inverted_matrices_in_content_stream`: Zero negative vertical scaling matrices in page content streams.
  - `test_r2_visual_text_fidelity_preservation`: 100% text character preservation after re-encoding.
- **R3: Selectable Generation Pipeline**:
  - `test_r3_vector_export_mode`: Exporting with `mode='vector'` generates vector PDF with ULURO metadata.
  - `test_r3_uluro_container_export_mode`: Exporting with `mode='uluro-image-wrapped'` generates 1:1 ULURO container.
  - `test_r3_native_vector_reencoded_export_mode`: Exporting with `mode='native-vector-reencoded'` generates normalized vector PDF.
  - `test_r3_export_all_modes`: Exporting with `mode='all'` generates all three route variants.
  - `test_r3_cli_mode_flag_parsing`: CLI argument parsing supports `--mode` with choices `vector`, `uluro-image-wrapped`, `native-vector-reencoded`, `all`.
  - `test_r3_web_ui_route_selector_contract`: UI contract in [Header.jsx](file:///e:/StatementGen/src/components/Header.jsx) / [App.jsx](file:///e:/StatementGen/src/App.jsx) for route selection dropdown.
- **R4: Exhaustive 6-Layer Forensic Auditor**:
  - `test_r4_layer1_object_count_and_keys`: Object count (11 objects for N=2) and dictionary key parity.
  - `test_r4_layer2_image_geometry`: Image stream geometry (2550 x 3300, 8-bit DeviceRGB, 25,245,000 bytes).
  - `test_r4_layer3_zero_fonts_and_inversions`: Zero fonts, zero font descriptors, zero Skia inversion operators.
  - `test_r4_layer4_metadata_and_trailer_id`: UTF-16BE hex metadata encoding parity and trailer `/ID` format.
  - `test_r4_layer5_engine_marker_absence`: Absence of `Skia`, `Chromium`, `WebKit`, `Cairo`.
  - `test_r4_layer6_opencv_pixel_diff`: OpenCV pixel diff mapping at 300 DPI verifying visual alignment.
  - `test_r4_auditor_clean_exit_on_canonical`: Full execution of `compare_uluro_container_forensics.py` on `11-30-24.pdf` exiting with 0.

### Tier 2: Boundary & Corner Cases (24 Test Cases)
- **Boundary R1**:
  - `test_t2_r1_empty_frames_raises_value_error`: Empty list raises `ValueError`.
  - `test_t2_r1_invalid_frame_buffer_size`: Truncated or corrupt frame buffer raises `ValueError`.
  - `test_t2_r1_single_page_container`: N=1 page produces 7 objects (xref size 8).
  - `test_t2_r1_multipage_3plus_pages`: N=3 pages produces 15 objects; N=4 produces 19 objects.
  - `test_t2_r1_metadata_special_characters`: Accents, quotes, backslashes, XML entities handled cleanly.
  - `test_t2_r1_custom_creation_date_formats`: Validates custom date string formatting.
  - `test_t2_r1_buffer_type_compatibility`: Accepts raw `bytes`, NumPy `ndarray`, and PIL `Image`.
- **Boundary R2**:
  - `test_t2_r2_nonexistent_input_file_raises_error`: Missing file raises `FileNotFoundError`.
  - `test_t2_r2_single_page_vector_pdf`: 1-page vector PDF re-encodes without off-by-one errors.
  - `test_t2_r2_idempotent_reencoding`: Re-encoding already normalized PDF is idempotent.
  - `test_t2_r2_special_typographic_characters`: Currency (`$`), percent (`%`), ampersand (`&`), hash (`#`) preserved.
  - `test_t2_r2_page_with_no_text_shapes_only`: Re-encoding vector shapes without text runs cleanly.
  - `test_t2_r2_edge_boundary_coordinates`: Coordinates at physical page borders (0.0 pt, 612.0 pt, 792.0 pt).
- **Boundary R3**:
  - `test_t2_r3_invalid_mode_raises_value_error`: Unsupported mode raises `ValueError`.
  - `test_t2_r3_invalid_scenario_id_raises_value_error`: Unknown scenario ID raises error.
  - `test_t2_r3_nonexistent_output_dir_auto_creation`: Output in nested non-existent directory creates parent paths.
  - `test_t2_r3_cli_invalid_arguments`: CLI invocation with invalid flags exits non-zero.
  - `test_t2_r3_custom_port_parameter`: Custom port configuration parameter handling.
- **Boundary R4**:
  - `test_t2_r4_layer1_fails_on_wrong_object_count`: Auditor fails Layer 1 on non-11 object count.
  - `test_t2_r4_layer2_fails_on_wrong_image_dimensions`: Auditor fails Layer 2 on non-300 DPI images.
  - `test_t2_r4_layer3_fails_on_embedded_font`: Auditor fails Layer 3 when fonts are present.
  - `test_t2_r4_layer4_fails_on_corrupt_trailer_id`: Auditor fails Layer 4 on corrupt trailer `/ID`.
  - `test_t2_r4_layer5_fails_on_injected_skia_marker`: Auditor fails Layer 5 on detected `Skia` bytes.
  - `test_t2_r4_nonexistent_target_pdf_raises_error`: Auditor raises `FileNotFoundError` on missing target PDF.

### Tier 3: Cross-Feature Combinations (6 Test Cases)
- `test_t3_vector_to_uluro_container_pipeline`: Vector PDF -> 300 DPI rasterization -> ULURO container assembly -> 11 objects, 0 fonts, 0 Skia markers.
- `test_t3_vector_to_native_reencoder_pipeline`: Vector PDF -> stream re-encoder -> Skia matrix stripped, Adobe Type 1 fonts, identical text.
- `test_t3_reencoded_to_uluro_container_pipeline`: Re-encoded vector -> 300 DPI rasterization -> ULURO container assembly -> valid container output.
- `test_t3_metadata_consistency_across_all_routes`: Producer, Creator, Author, and CreationDate verified consistent across all 3 routes.
- `test_t3_multi_mode_all_export_pipeline`: Calling `export_statement(..., mode='all')` generates all 3 distinct output formats.
- `test_t3_forensic_auditor_route_discrimination`: Forensic auditor correctly passes ULURO containers while distinguishing standard vector output.

### Tier 4: Real-World Application Scenarios (5 Test Cases)
- `test_t4_scenario_us1364_november_canonical`: Validates canonical November 2024 statement (2 pages, $363,729.58 total share balances, $28.75 dividend, promo vector & raster alignment).
- `test_t4_scenario_us1364_heavy_3page`: Validates expanded heavy statement multi-page flow, balance continuity, and text content.
- `test_t4_scenario_us1364_massive_42tx`: Validates massive 42-transaction 3-page statement, continuation headers, and balance ledger accuracy.
- `test_t4_scenario_us1364_aziz_july_2026`: Validates member statement for Aziz Berjis, statement date July 2026, 2-page pagination.
- `test_t4_zero_tolerance_pixel_delta_all_statements`: Script-driven OpenCV contour analysis verifying left edge delta <= 1px and right edge delta <= 1px across all pages at 300 DPI.

---

## 4. Requirements to Test Matrix

| Requirement | Description | Primary Test Function | Test File |
|---|---|---|---|
| **R1.1** | 15-byte PDF Header & Marker | `test_r1_pdf_header_and_binary_marker` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R1.2** | Image XObject Geometry & Flate Compression | `test_r1_image_xobject_geometry_and_compression` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R1.3** | Clean 1:1 Content Stream Scaling | `test_r1_content_stream_1to1_scaling` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R1.4** | UTF-16BE Metadata Encoding | `test_r1_utf16be_metadata_encoding` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R1.5** | Dynamic 4N+3 Object Scaling | `test_r1_dynamic_4n_plus_3_object_scaling_2page`, `test_t2_r1_single_page_container`, `test_t2_r1_multipage_3plus_pages` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R1.6** | 20-byte XREF & Trailer /ID Array | `test_r1_xref_and_trailer_id_syntax` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R1.7** | Zero Fonts & Absence of Engine Markers | `test_r1_zero_fonts_and_engine_markers` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.1** | Skia Inverted Matrix Stripping | `test_r2_skia_matrix_removal` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.2** | Bottom-Left Cartesian Normalization | `test_r2_bottom_left_cartesian_normalization` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.3** | Adobe Type 1 Font Mapping | `test_r2_adobe_type1_font_normalization` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.4** | Text Operator Defragmentation | `test_r2_text_operator_defragmentation` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.5** | Zero Inverted Matrices in Stream | `test_r2_zero_inverted_matrices_in_content_stream` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R2.6** | Text Content & Character Fidelity | `test_r2_visual_text_fidelity_preservation` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R3.1** | Vector Export Route | `test_r3_vector_export_mode` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R3.2** | ULURO Container Export Route | `test_r3_uluro_container_export_mode` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R3.3** | Native Vector Re-Encoded Export Route | `test_r3_native_vector_reencoded_export_mode` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R3.4** | Multi-Mode 'all' Export | `test_r3_export_all_modes`, `test_t3_multi_mode_all_export_pipeline` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier3_combinations.py](file:///e:/StatementGen/tests/e2e/test_tier3_combinations.py) |
| **R3.5** | CLI `--mode` Argument Support | `test_r3_cli_mode_flag_parsing`, `test_t2_r3_cli_invalid_arguments` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R3.6** | Web UI Route Selector Dropdown | `test_r3_web_ui_route_selector_contract` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |
| **R4.1** | Layer 1: Object & Key Parity | `test_r4_layer1_object_count_and_keys`, `test_t2_r4_layer1_fails_on_wrong_object_count` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R4.2** | Layer 2: Image Stream Geometry | `test_r4_layer2_image_geometry`, `test_t2_r4_layer2_fails_on_wrong_image_dimensions` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R4.3** | Layer 3: Zero Fonts & Inversions | `test_r4_layer3_zero_fonts_and_inversions`, `test_t2_r4_layer3_fails_on_embedded_font` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R4.4** | Layer 4: Metadata & Trailer /ID | `test_r4_layer4_metadata_and_trailer_id`, `test_t2_r4_layer4_fails_on_corrupt_trailer_id` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R4.5** | Layer 5: Absence of Engine Markers | `test_r4_layer5_engine_marker_absence`, `test_t2_r4_layer5_fails_on_injected_skia_marker` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier2_boundaries.py](file:///e:/StatementGen/tests/e2e/test_tier2_boundaries.py) |
| **R4.6** | Layer 6: OpenCV Pixel Difference | `test_r4_layer6_opencv_pixel_diff`, `test_t4_zero_tolerance_pixel_delta_all_statements` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py), [test_tier4_scenarios.py](file:///e:/StatementGen/tests/e2e/test_tier4_scenarios.py) |
| **R4.7** | Full Forensic Auditor Execution | `test_r4_auditor_clean_exit_on_canonical` | [test_tier1_features.py](file:///e:/StatementGen/tests/e2e/test_tier1_features.py) |

---

## 5. Test Execution Commands

### Execute Entire E2E Test Suite
```bash
python -m pytest tests/e2e -v
```

### Execute by Specific Tier
```bash
# Tier 1: Feature Coverage
python -m pytest tests/e2e/test_tier1_features.py -v

# Tier 2: Boundary & Corner Cases
python -m pytest tests/e2e/test_tier2_boundaries.py -v

# Tier 3: Cross-Feature Combinations
python -m pytest tests/e2e/test_tier3_combinations.py -v

# Tier 4: Real-World Scenarios & Zero-Tolerance Pixel Delta
python -m pytest tests/e2e/test_tier4_scenarios.py -v
```

### Execute with Fail-Fast on First Error
```bash
python -m pytest tests/e2e -x
```
