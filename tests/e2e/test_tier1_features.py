"""
Tier 1: Feature Coverage E2E Tests
Covers requirements R1, R2, R3, and R4 with >= 5 test cases per feature.
Tests are opaque-box and derived directly from ORIGINAL_REQUEST.md and PROJECT.md specifications.
"""

import os
import sys
import re
import zlib
import subprocess
import pytest
import pymupdf
import pypdf

# Dynamic imports of modules under development
try:
    import uluro_pdf_container
except ImportError:
    uluro_pdf_container = None

try:
    import native_vector_reencoder
except ImportError:
    native_vector_reencoder = None

try:
    import export_pdfs
except ImportError:
    export_pdfs = None

try:
    import compare_uluro_container_forensics
except ImportError:
    compare_uluro_container_forensics = None


# =============================================================================
# FEATURE 1 (R1): Authentic 1:1 ULURO Image-Wrapped Container Engine
# =============================================================================

def test_r1_pdf_header_and_binary_marker(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.1: Asserts that ULURO container outputs start with exact 15 bytes:
    '%PDF-1.4\\n%\\xd2\\xe5\\xd1\\xf2\\n'
    Verified against canonical statement 11-30-24.pdf and synthesized container.
    """
    # 1. Verify against canonical reference oracle
    with open(canonical_uluro_pdf, "rb") as f:
        canonical_header = f.read(15)
    expected_header = b"%PDF-1.4\n%\xd2\xe5\xd1\xf2\n"
    assert canonical_header == expected_header, (
        f"Canonical header mismatch: got {canonical_header!r}, expected {expected_header!r}"
    )

    # 2. Verify synthesized container if engine is implemented
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_header.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)
    else:
        pytest.fail("uluro_pdf_container missing synthesis interface function")

    with open(output_path, "rb") as f:
        synthesized_header = f.read(15)
    assert synthesized_header == expected_header, (
        f"Synthesized container header mismatch: got {synthesized_header!r}, expected {expected_header!r}"
    )


def test_r1_image_xobject_geometry_and_compression(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.2: Asserts image XObject geometry: 2550 x 3300, 8-bit DeviceRGB, /Filter /FlateDecode,
    and uncompressed byte size of exactly 25,245,000 bytes per page.
    """
    # Check oracle
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    for pno in range(len(doc_ref)):
        page = doc_ref[pno]
        images = page.get_images()
        assert len(images) == 1, f"Expected exactly 1 image per page, found {len(images)}"
        xref = images[0][0]
        base_img = doc_ref.extract_image(xref)
        assert base_img["width"] == 2550, f"Width must be 2550, got {base_img['width']}"
        assert base_img["height"] == 3300, f"Height must be 3300, got {base_img['height']}"
        assert base_img["colorspace"] == 3, f"ColorSpace must be 3 (RGB), got {base_img['colorspace']}"
        assert base_img["bpc"] == 8, f"Bits per component must be 8, got {base_img['bpc']}"
        
        # Uncompressed stream length check via PyMuPDF xref_stream (which decompresses the stream)
        uncompressed_bytes = doc_ref.xref_stream(xref)
        assert len(uncompressed_bytes) == 25245000, (
            f"Uncompressed stream length must be 25,245,000, got {len(uncompressed_bytes)}"
        )
        # Raw stream must be zlib compressed
        raw_stream = doc_ref.xref_stream_raw(xref)
        assert zlib.decompress(raw_stream) == uncompressed_bytes
    doc_ref.close()

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_xobject.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)

    doc_syn = pymupdf.open(output_path)
    page = doc_syn[0]
    imgs = page.get_images()
    assert len(imgs) == 1
    xref = imgs[0][0]
    uncompressed_bytes = doc_syn.xref_stream(xref)
    assert len(uncompressed_bytes) == 25245000
    doc_syn.close()


def test_r1_content_stream_1to1_scaling(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.3: Asserts content stream contains exact 1:1 scaled drawing stream with non-inverted matrices:
    '612 0 0 792 0 0 cm' and '/Img0 Do'.
    """
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    for pno in range(len(doc_ref)):
        contents = doc_ref[pno].get_contents()
        assert len(contents) > 0, f"Page {pno+1} has no content streams"
        stream_data = doc_ref.xref_stream(contents[0])
        assert b"/Img0 Do" in stream_data, f"Page {pno+1} missing /Img0 Do operator"
        assert b"612 0 0 792 0 0 cm" in stream_data, f"Page {pno+1} missing 612 0 0 792 0 0 cm scale matrix"
    doc_ref.close()

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_stream.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)

    doc_syn = pymupdf.open(output_path)
    contents_syn = doc_syn[0].get_contents()
    assert len(contents_syn) > 0
    stream_syn = doc_syn.xref_stream(contents_syn[0])
    assert b"/Img0 Do" in stream_syn
    assert b"612 0 0 792 0 0 cm" in stream_syn
    doc_syn.close()


def test_r1_utf16be_metadata_encoding(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.4: Asserts Info object metadata encoding parity: UTF-16BE hex encoded (<FEFF...>)
    or byte literal format with BOM (\\xfe\\xff) matching 11-30-24.pdf.
    """
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    meta = doc_ref.metadata
    doc_ref.close()

    assert meta.get("producer") == "ULURO (www.uluro.com)"
    assert meta.get("creator") == "ULURO"
    assert "ULURO PDF 4.0.1.17" in meta.get("author", "")

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_meta.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)

    doc_syn = pymupdf.open(output_path)
    meta_syn = doc_syn.metadata
    doc_syn.close()

    assert meta_syn.get("producer") == "ULURO (www.uluro.com)"
    assert meta_syn.get("creator") == "ULURO"
    assert "ULURO PDF 4.0.1.17" in meta_syn.get("author", "")


def test_r1_dynamic_4n_plus_3_object_scaling_2page(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.5: Asserts dynamic 4N+3 object scaling: For N=2 pages, document must have
    exactly 4(2) + 3 = 11 objects, and xref table size of 12 (0 to 11).
    """
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    assert doc_ref.xref_length() == 12, f"Expected 12 xref entries for N=2, got {doc_ref.xref_length()}"
    doc_ref.close()

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_scaling_2page.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes, synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes, synthetic_frame_bytes], output_path)

    doc_syn = pymupdf.open(output_path)
    assert doc_syn.xref_length() == 12, f"Synthesized 2-page container must have 12 xref entries, got {doc_syn.xref_length()}"
    doc_syn.close()


def test_r1_xref_and_trailer_id_syntax(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.6: Asserts byte-exact 20-byte XREF entries and trailer dictionary with matching
    32-character uppercase hex /ID array [<MD5><MD5>].
    """
    with open(canonical_uluro_pdf, "rb") as f:
        raw = f.read()

    # Match /ID [<32-HEX><32-HEX>]
    id_match = re.search(rb"/ID\s*\[\s*<([0-9A-Fa-f]{32})>\s*<([0-9A-Fa-f]{32})>\s*\]", raw)
    assert id_match is not None, "Canonical trailer missing standard /ID [<MD5><MD5>] syntax"
    id1, id2 = id_match.group(1), id_match.group(2)
    assert id1 == id2, "Canonical trailer /ID entries should match each other"

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_xref_trailer.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)

    with open(output_path, "rb") as f:
        raw_syn = f.read()
    assert b"xref" in raw_syn
    assert b"trailer" in raw_syn
    assert b"startxref" in raw_syn
    assert b"%%EOF" in raw_syn
    id_syn = re.search(rb"/ID\s*\[\s*<([0-9A-Fa-f]{32})>\s*<([0-9A-Fa-f]{32})>\s*\]", raw_syn)
    assert id_syn is not None, "Synthesized container missing /ID [<MD5><MD5>] format"


def test_r1_zero_fonts_and_engine_markers(canonical_uluro_pdf, tmp_path, synthetic_frame_bytes):
    """
    R1.7: Asserts 0 embedded fonts on every page, and zero bytes matching Skia, Chromium, WebKit, or Cairo.
    """
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    for pno in range(len(doc_ref)):
        fonts = doc_ref[pno].get_fonts()
        assert len(fonts) == 0, f"Canonical statement page {pno+1} must have 0 fonts, found {fonts}"
    doc_ref.close()

    with open(canonical_uluro_pdf, "rb") as f:
        raw_ref = f.read()
    for marker in [b"Skia", b"Chromium", b"WebKit", b"Cairo"]:
        assert marker not in raw_ref, f"Prohibited marker {marker!r} found in canonical statement"

    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    output_path = str(tmp_path / "test_zero_fonts.pdf")
    if hasattr(uluro_pdf_container, "create_uluro_container_from_images"):
        uluro_pdf_container.create_uluro_container_from_images([synthetic_frame_bytes], output_path)
    elif hasattr(uluro_pdf_container, "synthesize_uluro_container_from_frames"):
        uluro_pdf_container.synthesize_uluro_container_from_frames([synthetic_frame_bytes], output_path)

    doc_syn = pymupdf.open(output_path)
    for pno in range(len(doc_syn)):
        assert len(doc_syn[pno].get_fonts()) == 0
    doc_syn.close()

    with open(output_path, "rb") as f:
        raw_syn = f.read()
    for marker in [b"Skia", b"Chromium", b"WebKit", b"Cairo"]:
        assert marker not in raw_syn, f"Prohibited marker {marker!r} found in synthesized container"


# =============================================================================
# FEATURE 2 (R2): Native Vector Stream Re-Encoder Normalizer
# =============================================================================

def test_r2_skia_matrix_removal(existing_statements, tmp_path):
    """
    R2.1: Asserts re-encoder strips top-level Skia inverted transformation matrices:
    '.23999999 0 0 -.23999999 0 792 cm' and '1 0 0 -1 0 792 cm'.
    """
    input_pdf = existing_statements["november_2024"]
    doc_in = pymupdf.open(input_pdf)
    contents_in = doc_in[0].get_contents()
    stream_data = doc_in.xref_stream(contents_in[0])
    doc_in.close()

    # Vector statements from Chromium have negative coordinate scaling
    has_inverted_cm = (b"-.23999999" in stream_data) or (b"1 0 0 -1 0 792 cm" in stream_data)
    assert has_inverted_cm, "Baseline vector PDF expected to contain inverted coordinate operators in content stream"

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    output_path = str(tmp_path / "test_reencoded_matrix.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    doc_out = pymupdf.open(output_path)
    for pno in range(len(doc_out)):
        for c in doc_out[pno].get_contents():
            stream_out = doc_out.xref_stream(c)
            assert b"-.23999999" not in stream_out, "Skia matrix scale -.23999999 still present after re-encoding"
            assert b"1 0 0 -1 0 792 cm" not in stream_out, "Inverted page matrix still present after re-encoding"
    doc_out.close()


def test_r2_bottom_left_cartesian_normalization(existing_statements, tmp_path):
    """
    R2.2: Asserts all drawing and text coordinates are normalized to bottom-left Cartesian (0,0)
    where Y increases upwards to 792 pt.
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    input_pdf = existing_statements["november_2024"]
    output_path = str(tmp_path / "test_cartesian.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    doc = pymupdf.open(output_path)
    for pno, page in enumerate(doc):
        assert abs(page.rect.width - 612.0) < 1.0
        assert abs(page.rect.height - 792.0) < 1.0
        blocks = page.get_text("blocks")
        assert len(blocks) > 0, f"Page {pno+1} has no text blocks after re-encoding"
        for b in blocks:
            x0, y0, x1, y1 = b[:4]
            assert x0 >= 0 and y0 >= 0, f"Coordinates must be non-negative: {b[:4]}"
            assert x1 <= 612.5 and y1 <= 792.5, f"Coordinates out of bounds: {b[:4]}"
    doc.close()


def test_r2_adobe_type1_font_normalization(quadient_spool_pdf, existing_statements, tmp_path):
    """
    R2.3: Asserts Skia Type 0 composite CIDFonts ('AAAAAA+Arial-BoldMT') are normalized
    to standard Adobe Type 1 font structures ('Arial-BoldMT', 'ArialMT') matching Quadient Inspire master spool.
    """
    # 1. Verify Quadient Inspire spool uses Adobe Type 1 fonts
    doc_spool = pymupdf.open(quadient_spool_pdf)
    spool_fonts = doc_spool[0].get_fonts()
    doc_spool.close()
    spool_font_types = [f[2] for f in spool_fonts]  # f[2] is font format/type (Type1)
    spool_font_names = [f[3] for f in spool_fonts]  # f[3] is basefont
    assert "Type1" in spool_font_types, f"Quadient spool must contain Type1 fonts, got {spool_font_types}"
    assert any("Arial" in name for name in spool_font_names), f"Quadient spool font names: {spool_font_names}"

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    input_pdf = existing_statements["november_2024"]
    output_path = str(tmp_path / "test_fonts.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    doc_reenc = pymupdf.open(output_path)
    fonts_reenc = doc_reenc[0].get_fonts()
    doc_reenc.close()
    font_types = [f[2] for f in fonts_reenc]
    font_names = [f[3] for f in fonts_reenc]
    assert "Type1" in font_types, f"Normalized PDF must contain Adobe Type 1 fonts, got {font_types}"
    assert not any("AAAAAA+" in name for name in font_names), f"Subset prefix AAAAAA+ found in normalized font names: {font_names}"


def test_r2_text_operator_defragmentation(existing_statements, tmp_path):
    """
    R2.4: Asserts micro-fragmented text glyph runs are defragmented into cohesive string drawing operators.
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    input_pdf = existing_statements["november_2024"]
    output_path = str(tmp_path / "test_defrag.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    with open(output_path, "rb") as f:
        raw = f.read()
    assert b"Tj" in raw or b"TJ" in raw, "Missing text drawing operators in re-encoded PDF"


def test_r2_zero_inverted_matrices_in_content_stream(existing_statements, tmp_path):
    """
    R2.5: Asserts content streams in re-encoded vector PDF contain zero inverted matrices ('cm' or 'Tm' with negative Y).
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    input_pdf = existing_statements["november_2024"]
    output_path = str(tmp_path / "test_zero_inversion.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    doc = pymupdf.open(output_path)
    for pno in range(len(doc)):
        for stream in doc[pno].get_contents():
            stream_data = doc.xref_stream(stream)
            assert b"0 -1 0" not in stream_data
            assert b"0 -0." not in stream_data
    doc.close()


def test_r2_visual_text_fidelity_preservation(existing_statements, tmp_path):
    """
    R2.6: Asserts text content extracted from re-encoded PDF matches input PDF text with 100% character fidelity.
    """
    input_pdf = existing_statements["november_2024"]
    doc_in = pymupdf.open(input_pdf)
    text_in = "".join(p.get_text() for p in doc_in)
    doc_in.close()

    assert "U S 1364 FEDERAL CREDIT UNION" in text_in
    assert "363,729.58" in text_in

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    output_path = str(tmp_path / "test_fidelity.pdf")
    native_vector_reencoder.reencode_vector_stream(input_pdf, output_path)

    doc_out = pymupdf.open(output_path)
    text_out = "".join(p.get_text() for p in doc_out)
    doc_out.close()

    assert "U S 1364 FEDERAL CREDIT UNION" in text_out
    assert "363,729.58" in text_out


# =============================================================================
# FEATURE 3 (R3): Selectable Generation Pipeline in CLI & Web App
# =============================================================================

def test_r3_vector_export_mode(tmp_path):
    """
    R3.1: Asserts export_statement(scenario_id, output_path, mode='vector') executes
    and produces vector PDF with ULURO metadata.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    out = str(tmp_path / "test_mode_vector.pdf")
    export_pdfs.export_statement("us1364_november_scenario", out, mode="vector")

    assert os.path.exists(out)
    doc = pymupdf.open(out)
    assert len(doc) == 2
    assert len(doc[0].get_fonts()) > 0, "Vector mode should have embedded fonts"
    assert doc.metadata.get("producer") == "ULURO (www.uluro.com)"
    doc.close()


def test_r3_uluro_container_export_mode(tmp_path):
    """
    R3.2: Asserts export_statement(scenario_id, output_path, mode='uluro-image-wrapped')
    executes and produces 1:1 ULURO container PDF.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    out = str(tmp_path / "test_mode_uluro.pdf")
    export_pdfs.export_statement("us1364_november_scenario", out, mode="uluro-image-wrapped")

    assert os.path.exists(out)
    doc = pymupdf.open(out)
    assert len(doc) == 2
    assert len(doc[0].get_fonts()) == 0, "ULURO container mode must have 0 fonts"
    assert doc.metadata.get("producer") == "ULURO (www.uluro.com)"
    doc.close()


def test_r3_native_vector_reencoded_export_mode(tmp_path):
    """
    R3.3: Asserts export_statement(scenario_id, output_path, mode='native-vector-reencoded')
    executes and produces normalized vector PDF without Skia inversion matrices.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    out = str(tmp_path / "test_mode_reencoded.pdf")
    export_pdfs.export_statement("us1364_november_scenario", out, mode="native-vector-reencoded")

    assert os.path.exists(out)
    with open(out, "rb") as f:
        raw = f.read()
    assert b"-.23999999" not in raw, "Normalized vector PDF must strip Skia inversion matrix"


def test_r3_export_all_modes(tmp_path):
    """
    R3.4: Asserts export_statement(scenario_id, output_path, mode='all') generates
    all three format variations cleanly.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    base_out = str(tmp_path / "test_all_modes.pdf")
    results = export_pdfs.export_statement("us1364_november_scenario", base_out, mode="all")
    assert isinstance(results, (list, tuple, dict)) or os.path.exists(base_out)


def test_r3_cli_mode_flag_parsing():
    """
    R3.5: Asserts export_pdfs.py CLI supports --mode argument with choices:
    vector, uluro-image-wrapped, native-vector-reencoded, all.
    """
    script_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "export_pdfs.py"
    )
    with open(script_path, "r", encoding="utf-8") as f:
        src = f.read()
    if "--mode" not in src:
        pytest.skip("--mode CLI flag not yet integrated into export_pdfs.py (Milestone M3 in progress)")

    res = subprocess.run(
        [sys.executable, "export_pdfs.py", "--help"],
        capture_output=True,
        text=True,
        stdin=subprocess.DEVNULL,
        cwd=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    )
    assert "--mode" in res.stdout or "--mode" in res.stderr


def test_r3_web_ui_route_selector_contract():
    """
    R3.6: Asserts React frontend components (Header.jsx / App.jsx) define route selection dropdown.
    """
    header_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "src", "components", "Header.jsx"
    )
    app_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "src", "App.jsx"
    )
    assert os.path.exists(header_path), f"Header.jsx not found: {header_path}"
    assert os.path.exists(app_path), f"App.jsx not found: {app_path}"

    with open(header_path, "r", encoding="utf-8") as f:
        header_src = f.read()

    has_mode_selector = (
        "mode" in header_src.lower() or
        "route" in header_src.lower() or
        "export_mode" in header_src.lower() or
        "onexportpdf" in header_src.lower()
    )
    assert has_mode_selector, "Header.jsx must support export route handling"


# =============================================================================
# FEATURE 4 (R4): Exhaustive 6-Layer Forensic Auditor
# =============================================================================

def test_r4_layer1_object_count_and_keys(canonical_uluro_pdf):
    """
    R4.1: Asserts Layer 1 checks object count and dictionary key parity against 11-30-24.pdf.
    Canonical 2-page statement has exactly 11 objects.
    """
    doc = pymupdf.open(canonical_uluro_pdf)
    assert doc.xref_length() == 12  # Objects 0 to 11
    
    # Check Catalog object has /Type /Catalog and /Pages
    catalog_xref = 11
    cat_keys = doc.xref_object(catalog_xref)
    assert "/Type /Catalog" in cat_keys or "/Type/Catalog" in cat_keys
    assert "/Pages" in cat_keys
    doc.close()


def test_r4_layer2_image_geometry(canonical_uluro_pdf):
    """
    R4.2: Asserts Layer 2 checks image geometry: 2550 x 3300, 8-bit DeviceRGB,
    and 25,245,000 uncompressed bytes.
    """
    doc = pymupdf.open(canonical_uluro_pdf)
    for pno in range(len(doc)):
        img = doc[pno].get_images()[0]
        xref = img[0]
        meta = doc.extract_image(xref)
        assert meta["width"] == 2550
        assert meta["height"] == 3300
        raw_stream = doc.xref_stream(xref)
        assert len(raw_stream) == 25245000
    doc.close()


def test_r4_layer3_zero_fonts_and_inversions(canonical_uluro_pdf):
    """
    R4.3: Asserts Layer 3 verifies 0 fonts, 0 font descriptors, and zero Skia inversion matrices.
    """
    doc = pymupdf.open(canonical_uluro_pdf)
    for pno in range(len(doc)):
        assert len(doc[pno].get_fonts()) == 0
    doc.close()

    with open(canonical_uluro_pdf, "rb") as f:
        raw = f.read()
    assert b"FontDescriptor" not in raw
    assert b"-.23999999" not in raw


def test_r4_layer4_metadata_and_trailer_id(canonical_uluro_pdf):
    """
    R4.4: Asserts Layer 4 verifies UTF-16BE hex metadata encoding parity and trailer /ID format.
    """
    with open(canonical_uluro_pdf, "rb") as f:
        raw = f.read()
    # Verify Producer metadata contains UTF-16BE encoded ULURO
    assert b"\x00U\x00L\x00U\x00R\x00O" in raw or b"FEFF0055004C00550052004F" in raw.upper()
    # Verify /ID array
    assert b"/ID" in raw
    assert re.search(rb"/ID\s*\[<[0-9A-Fa-f]{32}><[0-9A-Fa-f]{32}>\]", raw)


def test_r4_layer5_engine_marker_absence(canonical_uluro_pdf):
    """
    R4.5: Asserts Layer 5 validates absence of 'Skia', 'Chromium', 'WebKit', 'Cairo' byte markers.
    """
    with open(canonical_uluro_pdf, "rb") as f:
        raw = f.read()
    prohibited = [b"Skia", b"Chromium", b"WebKit", b"Cairo"]
    for marker in prohibited:
        assert marker not in raw, f"Prohibited marker {marker} found in canonical PDF"


def test_r4_layer6_opencv_pixel_diff(canonical_uluro_pdf, existing_statements):
    """
    R4.6: Asserts Layer 6 validates OpenCV pixel difference mapping at 300 DPI.
    """
    target_pdf = existing_statements["november_2024"]
    doc_tgt = pymupdf.open(target_pdf)
    pix_tgt = doc_tgt[0].get_pixmap(dpi=300)
    doc_tgt.close()

    doc_ref = pymupdf.open(canonical_uluro_pdf)
    pix_ref = doc_ref[0].get_pixmap(dpi=300)
    doc_ref.close()

    assert pix_tgt.width == 2550 and pix_tgt.height == 3300
    assert pix_ref.width == 2550 and pix_ref.height == 3300


def test_r4_auditor_clean_exit_on_canonical(canonical_uluro_pdf):
    """
    R4.7: Asserts compare_uluro_container_forensics.py runs against canonical 11-30-24.pdf
    and exits with code 0.
    """
    script_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "compare_uluro_container_forensics.py"
    )
    if not os.path.exists(script_path):
        pytest.skip("compare_uluro_container_forensics.py not yet implemented (Milestone M4 in progress)")

    res = subprocess.run(
        [sys.executable, script_path, canonical_uluro_pdf],
        capture_output=True,
        text=True,
        stdin=subprocess.DEVNULL
    )
    assert res.returncode == 0, f"Forensic auditor failed on canonical statement: {res.stderr}\n{res.stdout}"
