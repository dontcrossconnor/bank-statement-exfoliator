"""
Tier 2: Boundary & Corner Cases E2E Tests
Covers boundary conditions, edge cases, error handling, and resource stress
across features R1, R2, R3, and R4 with >= 5 test cases per feature.
Derived strictly from specifications in ORIGINAL_REQUEST.md and PROJECT.md.
"""

import os
import sys
import subprocess
import pytest
import pymupdf
import numpy as np
from PIL import Image

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
# BOUNDARY R1: Authentic ULURO Container Edge Cases
# =============================================================================

def test_t2_r1_empty_frames_raises_value_error(tmp_path):
    """
    T2.R1.1: Calling container engine with an empty frames list raises ValueError.
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    out = str(tmp_path / "empty_frames.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
    assert fn is not None

    with pytest.raises((ValueError, IndexError, AssertionError)):
        fn([], out)


def test_t2_r1_invalid_frame_buffer_size(tmp_path):
    """
    T2.R1.2: Calling container engine with corrupted or truncated frame buffer raises ValueError.
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    out = str(tmp_path / "corrupt_frame.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
    
    # 100 bytes buffer instead of 25,245,000 bytes
    corrupt_frame = b"\x00" * 100
    with pytest.raises((ValueError, AssertionError)):
        fn([corrupt_frame], out)


def test_t2_r1_single_page_container(tmp_path, synthetic_frame_bytes):
    """
    T2.R1.3: Asserts N=1 single-page container produces exactly 4(1) + 3 = 7 objects,
    with xref length 8 (0 to 7).
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    out = str(tmp_path / "single_page.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)
    fn([synthetic_frame_bytes], out)

    doc = pymupdf.open(out)
    assert len(doc) == 1, "Single-page container must contain 1 page"
    assert doc.xref_length() == 8, f"N=1 container must have 8 xref entries (7 objects), got {doc.xref_length()}"
    doc.close()


def test_t2_r1_multipage_3plus_pages(tmp_path, synthetic_frame_bytes):
    """
    T2.R1.4: Asserts N=3 multi-page container scales to 4(3) + 3 = 15 objects (xref size 16),
    and N=4 scales to 4(4) + 3 = 19 objects (xref size 20).
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)

    # Test N=3
    out3 = str(tmp_path / "three_pages.pdf")
    fn([synthetic_frame_bytes] * 3, out3)
    doc3 = pymupdf.open(out3)
    assert len(doc3) == 3
    assert doc3.xref_length() == 16, f"N=3 container must have 16 xref entries, got {doc3.xref_length()}"
    doc3.close()

    # Test N=4
    out4 = str(tmp_path / "four_pages.pdf")
    fn([synthetic_frame_bytes] * 4, out4)
    doc4 = pymupdf.open(out4)
    assert len(doc4) == 4
    assert doc4.xref_length() == 20, f"N=4 container must have 20 xref entries, got {doc4.xref_length()}"
    doc4.close()


def test_t2_r1_metadata_special_characters(tmp_path, synthetic_frame_bytes):
    """
    T2.R1.5: Asserts container engine handles unusual metadata characters (quotes, slashes, entities, unicode)
    without corrupting PDF dictionary syntax.
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    out = str(tmp_path / "special_meta.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)

    custom_meta = {
        "/Title": "Statement & Report: <Q3 \"2024\">",
        "/Author": "ULURO PDF (Special / Char \\ Test)",
        "/Subject": "Accented: éñü 100% Valid"
    }

    # Should synthesize cleanly without syntax error
    fn([synthetic_frame_bytes], out, metadata=custom_meta)
    assert os.path.exists(out)
    doc = pymupdf.open(out)
    assert doc.is_pdf
    doc.close()


def test_t2_r1_custom_creation_date_formats(tmp_path, synthetic_frame_bytes):
    """
    T2.R1.6: Asserts container engine accepts custom PDF date strings (e.g. D:20260811102447Z).
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    out = str(tmp_path / "custom_date.pdf")
    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None) or \
         getattr(uluro_pdf_container, "synthesize_uluro_container_from_frames", None)

    date_str = "D:20260811102447Z"
    fn([synthetic_frame_bytes], out, creation_date=date_str)

    with open(out, "rb") as f:
        raw = f.read()
    assert b"D:20260811102447" in raw, "Custom creation date not formatted into container"


def test_t2_r1_buffer_type_compatibility(tmp_path, synthetic_frame_bytes, synthetic_frame_numpy, synthetic_frame_pil):
    """
    T2.R1.7: Asserts container engine accepts raw bytes, numpy ndarray, and PIL Image objects.
    """
    if uluro_pdf_container is None:
        pytest.skip("uluro_pdf_container not yet implemented (Milestone M1 in progress)")

    fn = getattr(uluro_pdf_container, "create_uluro_container_from_images", None)
    if fn is None:
        pytest.skip("create_uluro_container_from_images not available")

    # 1. Raw bytes
    out_b = str(tmp_path / "buf_bytes.pdf")
    fn([synthetic_frame_bytes], out_b)
    assert os.path.exists(out_b)

    # 2. Numpy ndarray
    out_n = str(tmp_path / "buf_numpy.pdf")
    fn([synthetic_frame_numpy], out_n)
    assert os.path.exists(out_n)

    # 3. PIL Image
    out_p = str(tmp_path / "buf_pil.pdf")
    fn([synthetic_frame_pil], out_p)
    assert os.path.exists(out_p)


# =============================================================================
# BOUNDARY R2: Native Vector Re-Encoder Edge Cases
# =============================================================================

def test_t2_r2_nonexistent_input_file_raises_error(tmp_path):
    """
    T2.R2.1: Re-encoder raises FileNotFoundError when passed a non-existent input PDF.
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    out = str(tmp_path / "reencoded.pdf")
    with pytest.raises((FileNotFoundError, AssertionError)):
        native_vector_reencoder.reencode_vector_stream("nonexistent_path_xyz.pdf", out)


def test_t2_r2_single_page_vector_pdf(tmp_path):
    """
    T2.R2.2: Asserts re-encoder handles a 1-page vector PDF accurately.
    """
    # Create 1-page vector PDF
    doc = pymupdf.open()
    p = doc.new_page(width=612, height=792)
    p.insert_text((50, 100), "Single Page Normalization Test", fontsize=12)
    sample_pdf = str(tmp_path / "single_in.pdf")
    doc.save(sample_pdf)
    doc.close()

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    out = str(tmp_path / "single_out.pdf")
    native_vector_reencoder.reencode_vector_stream(sample_pdf, out)

    doc_out = pymupdf.open(out)
    assert len(doc_out) == 1
    assert "Single Page Normalization Test" in doc_out[0].get_text()
    doc_out.close()


def test_t2_r2_idempotent_reencoding(existing_statements, tmp_path):
    """
    T2.R2.3: Re-encoding an already re-encoded PDF is idempotent and does not corrupt content.
    """
    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    in_pdf = existing_statements["november_2024"]
    out1 = str(tmp_path / "pass1.pdf")
    out2 = str(tmp_path / "pass2.pdf")

    # Pass 1
    native_vector_reencoder.reencode_vector_stream(in_pdf, out1)
    # Pass 2 (re-encode the output of pass 1)
    native_vector_reencoder.reencode_vector_stream(out1, out2)

    doc1 = pymupdf.open(out1)
    doc2 = pymupdf.open(out2)
    assert len(doc1) == len(doc2)
    assert doc1[0].get_text().strip() == doc2[0].get_text().strip()
    doc1.close()
    doc2.close()


def test_t2_r2_special_typographic_characters(tmp_path):
    """
    T2.R2.4: Asserts text containing currency ($), percent (%), hashes (#), ampersands (&),
    and punctuation (@, comma, dot, hyphen) is preserved accurately after re-encoding.
    """
    doc = pymupdf.open()
    p = doc.new_page(width=612, height=792)
    test_chars = "Balance: $363,729.58 | APY: 0.10% | Acct #1 & #2 @ U.S. FCU - 11/30/24"
    p.insert_text((50, 100), test_chars, fontsize=10)
    in_pdf = str(tmp_path / "special_chars_in.pdf")
    doc.save(in_pdf)
    doc.close()

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    out_pdf = str(tmp_path / "special_chars_out.pdf")
    native_vector_reencoder.reencode_vector_stream(in_pdf, out_pdf)

    doc_out = pymupdf.open(out_pdf)
    text_out = doc_out[0].get_text()
    doc_out.close()

    for ch in ["$", "%", "#", "&", "@", "363,729.58", "0.10%"]:
        assert ch in text_out, f"Character sequence '{ch}' was corrupted or lost"


def test_t2_r2_page_with_no_text_shapes_only(tmp_path):
    """
    T2.R2.5: Re-encoding a vector page containing only rectangles/paths (zero text) executes cleanly.
    """
    doc = pymupdf.open()
    p = doc.new_page(width=612, height=792)
    p.draw_rect(pymupdf.Rect(50, 50, 550, 200), color=(0, 0, 1), fill=(0.9, 0.9, 0.9))
    p.draw_line((50, 300), (550, 300), color=(0, 0, 0), width=1.5)
    in_pdf = str(tmp_path / "shapes_only_in.pdf")
    doc.save(in_pdf)
    doc.close()

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    out_pdf = str(tmp_path / "shapes_only_out.pdf")
    native_vector_reencoder.reencode_vector_stream(in_pdf, out_pdf)

    doc_out = pymupdf.open(out_pdf)
    assert len(doc_out) == 1
    assert len(doc_out[0].get_text().strip()) == 0
    doc_out.close()


def test_t2_r2_edge_boundary_coordinates(tmp_path):
    """
    T2.R2.6: Asserts vector drawing at boundary coordinates (0.0 pt, 612.0 pt, 792.0 pt)
    does not generate negative values or out-of-bound overflow.
    """
    doc = pymupdf.open()
    p = doc.new_page(width=612, height=792)
    # Shapes spanning edges
    p.draw_rect(pymupdf.Rect(0, 0, 612, 10), fill=(0, 0, 0))
    p.draw_rect(pymupdf.Rect(0, 782, 612, 792), fill=(0, 0, 0))
    in_pdf = str(tmp_path / "boundary_coords_in.pdf")
    doc.save(in_pdf)
    doc.close()

    if native_vector_reencoder is None:
        pytest.skip("native_vector_reencoder not yet implemented (Milestone M2 in progress)")

    out_pdf = str(tmp_path / "boundary_coords_out.pdf")
    native_vector_reencoder.reencode_vector_stream(in_pdf, out_pdf)

    doc_out = pymupdf.open(out_pdf)
    assert abs(doc_out[0].rect.width - 612.0) < 1.0
    assert abs(doc_out[0].rect.height - 792.0) < 1.0
    doc_out.close()


# =============================================================================
# BOUNDARY R3: Selectable Routes & CLI Edge Cases
# =============================================================================

def test_t2_r3_invalid_mode_raises_value_error(tmp_path):
    """
    T2.R3.1: Calling export_statement with an unsupported mode string raises ValueError.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    out = str(tmp_path / "invalid_mode.pdf")
    with pytest.raises(ValueError):
        export_pdfs.export_statement("us1364_november_scenario", out, mode="unsupported_route_xyz")


def test_t2_r3_invalid_scenario_id_raises_value_error(tmp_path):
    """
    T2.R3.2: Calling export_statement with an invalid scenario ID raises ValueError or handles cleanly.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    out = str(tmp_path / "invalid_scenario.pdf")
    with pytest.raises((ValueError, KeyError, Exception)):
        export_pdfs.export_statement("completely_nonexistent_scenario_12345", out)


def test_t2_r3_nonexistent_output_dir_auto_creation(tmp_path):
    """
    T2.R3.3: Providing an output path in a deeply nested non-existent directory creates parent directories.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    deep_path = str(tmp_path / "nested" / "subfolder" / "output.pdf")
    # Test should succeed or create directories
    export_pdfs.export_statement("us1364_november_scenario", deep_path, mode="vector")
    assert os.path.exists(deep_path)


def test_t2_r3_cli_invalid_arguments():
    """
    T2.R3.4: Invoking export_pdfs.py with invalid flags exits with code != 0.
    """
    script_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "export_pdfs.py"
    )
    with open(script_path, "r", encoding="utf-8") as f:
        src = f.read()
    if "--mode" not in src:
        pytest.skip("CLI argument parser not yet integrated into export_pdfs.py (Milestone M3 in progress)")

    res = subprocess.run(
        [sys.executable, "export_pdfs.py", "--invalid-unknown-flag-xyz"],
        capture_output=True,
        text=True,
        stdin=subprocess.DEVNULL,
        cwd=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    )
    assert res.returncode != 0, "CLI with invalid arguments should return non-zero exit code"


def test_t2_r3_custom_port_parameter(tmp_path):
    """
    T2.R3.5: Verifies export_statement accepts a custom port parameter.
    """
    if export_pdfs is None or not hasattr(export_pdfs, "export_statement"):
        pytest.skip("export_statement not yet implemented in export_pdfs.py (Milestone M3 in progress)")

    # When port is unavailable, it should either attempt connection or raise cleanly
    out = str(tmp_path / "port_test.pdf")
    # Attempting to export with port 59999 (unused port) should raise connection error cleanly
    with pytest.raises(Exception):
        export_pdfs.export_statement("us1364_november_scenario", out, port=59999)


# =============================================================================
# BOUNDARY R4: 6-Layer Forensic Auditor Edge Cases
# =============================================================================

def test_t2_r4_layer1_fails_on_wrong_object_count(tmp_path):
    """
    T2.R4.1: Auditor fails Layer 1 check when an object is missing or extra object exists.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    # Create dummy PDF with non-11 object count
    dummy_pdf = str(tmp_path / "wrong_objs.pdf")
    doc = pymupdf.open()
    doc.new_page(width=612, height=792)
    doc.save(dummy_pdf)
    doc.close()

    fn = getattr(compare_uluro_container_forensics, "audit_layer_1_object_structure", None) or \
         getattr(compare_uluro_container_forensics, "verify_layer_1", None)
    if fn:
        with pytest.raises(AssertionError):
            fn(dummy_pdf)


def test_t2_r4_layer2_fails_on_wrong_image_dimensions(tmp_path):
    """
    T2.R4.2: Auditor fails Layer 2 when image dimensions are not 2550 x 3300.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    # Create PDF with 72 DPI image (612 x 792) instead of 300 DPI (2550 x 3300)
    dummy_pdf = str(tmp_path / "wrong_dim.pdf")
    doc = pymupdf.open()
    p = doc.new_page(width=612, height=792)
    pix = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, 612, 792), 0)
    p.insert_image(p.rect, pixmap=pix)
    doc.save(dummy_pdf)
    doc.close()

    fn = getattr(compare_uluro_container_forensics, "audit_layer_2_image_geometry", None) or \
         getattr(compare_uluro_container_forensics, "verify_layer_2", None)
    if fn:
        with pytest.raises(AssertionError):
            fn(dummy_pdf)


def test_t2_r4_layer3_fails_on_embedded_font(existing_statements):
    """
    T2.R4.3: Auditor fails Layer 3 when run on standard vector statement that has embedded fonts.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    vector_pdf = existing_statements["november_2024"]
    fn = getattr(compare_uluro_container_forensics, "audit_layer_3_zero_fonts_and_inversions", None) or \
         getattr(compare_uluro_container_forensics, "verify_layer_3", None)
    if fn:
        with pytest.raises(AssertionError):
            fn(vector_pdf)


def test_t2_r4_layer4_fails_on_corrupt_trailer_id(tmp_path):
    """
    T2.R4.4: Auditor fails Layer 4 when trailer /ID is missing or not 32-hex matching array.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    dummy_pdf = str(tmp_path / "no_id.pdf")
    doc = pymupdf.open()
    doc.new_page(width=612, height=792)
    doc.save(dummy_pdf)
    doc.close()

    fn = getattr(compare_uluro_container_forensics, "audit_layer_4_metadata_and_trailer_id", None) or \
         getattr(compare_uluro_container_forensics, "verify_layer_4", None)
    if fn:
        with pytest.raises(AssertionError):
            fn(dummy_pdf)


def test_t2_r4_layer5_fails_on_injected_skia_marker(canonical_uluro_pdf, tmp_path):
    """
    T2.R4.5: Auditor fails Layer 5 when prohibited byte marker 'Skia' is injected into PDF.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    with open(canonical_uluro_pdf, "rb") as f:
        data = bytearray(f.read())
    # Inject Skia marker as a comment
    data.extend(b"\n% Injected Skia Marker for testing\n")
    tainted_pdf = str(tmp_path / "tainted_skia.pdf")
    with open(tainted_pdf, "wb") as f:
        f.write(data)

    fn = getattr(compare_uluro_container_forensics, "audit_layer_5_engine_marker_absence", None) or \
         getattr(compare_uluro_container_forensics, "verify_layer_5", None)
    if fn:
        with pytest.raises(AssertionError):
            fn(tainted_pdf)


def test_t2_r4_nonexistent_target_pdf_raises_error():
    """
    T2.R4.6: Auditor raises FileNotFoundError when given non-existent target PDF path.
    """
    if compare_uluro_container_forensics is None:
        pytest.skip("compare_uluro_container_forensics not yet implemented (Milestone M4 in progress)")

    fn = getattr(compare_uluro_container_forensics, "audit_uluro_statement", None) or \
         getattr(compare_uluro_container_forensics, "run_all_audits", None)
    if fn:
        with pytest.raises(FileNotFoundError):
            fn("nonexistent_path_forensics.pdf")
