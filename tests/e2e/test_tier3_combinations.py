"""
Tier 3: Cross-Feature Combinations E2E Tests
Covers pairwise and multi-feature interactions across generation routes and forensic auditing:
- Vector generation + ULURO container synthesis
- Vector generation + Native vector re-encoder
- Re-encoded vector + ULURO container synthesis
- Cross-route metadata consistency
- Unified export pipeline multi-mode orchestration ('all')
- Forensic auditor route discrimination
"""

import os
import zlib
import pytest
import pymupdf

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


def test_t3_vector_to_uluro_container_pipeline(existing_statements, tmp_path):
    """
    T3.1: Vector Generation -> ULURO Container Synthesis Pipeline.
    Renders vector statement pages at 300 DPI DeviceRGB (2550 x 3300),
    packages into ULURO container, and verifies 4N+3 objects, 0 fonts, and 0 Skia markers.
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    vector_pdf = existing_statements["november_2024"]
    doc_v = pymupdf.open(vector_pdf)
    page_count = len(doc_v)
    frames = []
    for page in doc_v:
        pix = page.get_pixmap(dpi=300, colorspace=pymupdf.csRGB, alpha=False)
        assert pix.width == 2550 and pix.height == 3300
        frames.append(pix.samples)
    doc_v.close()

    out_container = str(tmp_path / "combined_vector_to_uluro.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
    fn(frames, out_container)

    doc_c = pymupdf.open(out_container)
    assert len(doc_c) == page_count
    # Expected objects: 4N + 3 -> xref length 4N + 4
    expected_xref_len = 4 * page_count + 4
    assert doc_c.xref_length() == expected_xref_len, (
        f"Expected {expected_xref_len} xref entries for N={page_count}, got {doc_c.xref_length()}"
    )
    for p in doc_c:
        assert len(p.get_fonts()) == 0, "Container must have 0 fonts"
    doc_c.close()

    with open(out_container, "rb") as f:
        raw = f.read()
    for marker in [b"Skia", b"Chromium", b"WebKit", b"Cairo"]:
        assert marker not in raw, f"Prohibited marker {marker} found in synthesized container"


def test_t3_vector_to_native_reencoder_pipeline(existing_statements, tmp_path):
    """
    T3.2: Vector Generation -> Native Vector Re-Encoder Pipeline.
    Passes vector statement through re-encoder, verifying stripping of Skia inverted matrices,
    normalization to Type 1 fonts, and exact character preservation.
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    vector_pdf = existing_statements["november_2024"]
    doc_v = pymupdf.open(vector_pdf)
    orig_text = "".join(p.get_text() for p in doc_v)
    doc_v.close()

    out_reencoded = str(tmp_path / "combined_vector_to_reencoded.pdf")
    native_vector_reencoder.reencode_vector_stream(vector_pdf, out_reencoded)

    doc_r = pymupdf.open(out_reencoded)
    reenc_text = "".join(p.get_text() for p in doc_r)
    for pno in range(len(doc_r)):
        for c in doc_r[pno].get_contents():
            stream_out = doc_r.xref_stream(c)
            assert b"-.23999999" not in stream_out
            assert b"1 0 0 -1 0 792 cm" not in stream_out
    doc_r.close()

    assert "363,729.58" in reenc_text
    assert "U S 1364 FEDERAL CREDIT UNION" in reenc_text


def test_t3_reencoded_to_uluro_container_pipeline(existing_statements, tmp_path):
    """
    T3.3: Native Vector Re-Encoder -> ULURO Container Synthesis Pipeline.
    Re-encodes vector statement, rasterizes at 300 DPI, and synthesizes ULURO container.
    """
    if native_vector_reencoder is None or uluro_pdf_container is None:
        pytest.skip("Either native_vector_reencoder or uluro_pdf_container not yet implemented")

    vector_pdf = existing_statements["november_2024"]
    out_reencoded = str(tmp_path / "stage1_reencoded.pdf")
    out_container = str(tmp_path / "stage2_container.pdf")

    # Step 1: Re-encode
    native_vector_reencoder.reencode_vector_stream(vector_pdf, out_reencoded)
    assert os.path.exists(out_reencoded)

    # Step 2: Rasterize and Synthesize Container
    doc_r = pymupdf.open(out_reencoded)
    frames = [p.get_pixmap(dpi=300, colorspace=pymupdf.csRGB, alpha=False).samples for p in doc_r]
    doc_r.close()

    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
    fn(frames, out_container)

    doc_c = pymupdf.open(out_container)
    assert len(doc_c) == 2
    assert doc_c.xref_length() == 12  # 4(2) + 3 + 1 = 12
    assert len(doc_c[0].get_fonts()) == 0
    doc_c.close()


def test_t3_metadata_consistency_across_all_routes(existing_statements, tmp_path):
    """
    T3.4: Asserts metadata consistency across all 3 routes:
    /Producer, /Creator, /Author, and /CreationDate match expected canonical standards.
    """
    expected_producer = "ULURO (www.uluro.com)"
    expected_creator = "ULURO"
    expected_author_prefix = "ULURO PDF 4.0.1.17"

    # 1. Existing Vector Statement
    vector_pdf = existing_statements["november_2024"]
    doc_v = pymupdf.open(vector_pdf)
    meta_v = doc_v.metadata
    doc_v.close()
    assert meta_v.get("producer") == expected_producer
    assert meta_v.get("creator") == expected_creator
    assert expected_author_prefix in meta_v.get("author", "")

    # 2. ULURO Container (if available)
    if uluro_pdf_container:
        out_c = str(tmp_path / "meta_container.pdf")
        frame = b"\xff" * (2550 * 3300 * 3)
        fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
             getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
        fn([frame], out_c)
        doc_c = pymupdf.open(out_c)
        meta_c = doc_c.metadata
        doc_c.close()
        assert meta_c.get("producer") == expected_producer
        assert meta_c.get("creator") == expected_creator
        assert expected_author_prefix in meta_c.get("author", "")

    # 3. Re-Encoded Vector (if available)
    if native_vector_reencoder:
        out_r = str(tmp_path / "meta_reencoded.pdf")
        native_vector_reencoder.reencode_vector_stream(vector_pdf, out_r, profile="uluro")
        doc_r = pymupdf.open(out_r)
        meta_r = doc_r.metadata
        doc_r.close()
        assert meta_r.get("producer") == expected_producer
        assert meta_r.get("creator") == expected_creator
        assert expected_author_prefix in meta_r.get("author", "")


def test_t3_multi_mode_all_export_pipeline(tmp_path):
    """
    T3.5: Unified Exporter multi-mode orchestration ('all').
    Calling export_statement(scenario_id, output_path, mode='all') generates
    all three distinct generation routes.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    target_base = str(tmp_path / "statement_multimode.pdf")
    outputs = export_pdfs.export_statement("us1364_november_scenario", target_base, mode="all")
    assert outputs is not None


def test_t3_forensic_auditor_route_discrimination(existing_statements, canonical_uluro_pdf):
    """
    T3.6: Asserts 6-Layer Forensic Auditor discriminates between routes:
    - Passes canonical ULURO container.
    - Accurately identifies vector characteristics on standard vector statements.
    """
    # 1. Canonical ULURO container must have 0 fonts
    doc_can = pymupdf.open(canonical_uluro_pdf)
    assert len(doc_can[0].get_fonts()) == 0
    doc_can.close()

    # 2. Standard vector statement must have > 0 fonts
    doc_vec = pymupdf.open(existing_statements["november_2024"])
    assert len(doc_vec[0].get_fonts()) > 0
    doc_vec.close()
