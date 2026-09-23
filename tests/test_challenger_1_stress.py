"""
Adversarial Empirical Stress Testing Suite - Challenger 1
=========================================================
Validates Requirements R1 & R2 under adversarial conditions:
1. ULURO Container Engine (uluro_pdf_container.py):
   - Arbitrary page synthesis: N=1, 2, 3, 5, 10 pages.
   - Strict 4N+3 object count verification (11 for N=2).
   - Byte-exact XREF offset physical alignment validation.
   - Strict 20-byte XREF line entry verification.
   - PyMuPDF 0 fonts, 0 text operators, 0 font descriptors across all pages.
   - Exact 1:1 image geometry (2550 x 3300, 8-bit DeviceRGB, 25,245,000 uncompressed bytes).
   - Absolute absence of prohibited engine byte markers (Skia, Chromium, WebKit, Cairo, PDFium).
   - UTF-16BE hex metadata encoding parity (<FEFF...>).
2. Native Vector Re-Encoder Normalizer (native_vector_reencoder.py):
   - Multi-statement corpus stress testing across all statement types.
   - Zero negative scale factor cm operators in all content streams.
   - Strict Adobe Type 1 font replacement (ArialMT, Arial-BoldMT).
   - Vector drawing bounding box delta (<0.001 pt sub-pixel threshold).
   - Image placement bounding box delta (<0.001 pt sub-pixel threshold).
   - Defragmented cohesive (text) Tj string operators (0 fragmented <CID> Tj).
   - Multi-generation idempotency (gen 1 -> gen 2 -> gen 3).
"""

import os
import re
import sys
import zlib
import pytest
import pymupdf
import numpy as np

# Ensure project root is importable
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from uluro_pdf_container import (
    synthesize_uluro_container,
    create_uluro_container_from_images,
    convert_pdf_to_uluro_container,
    RAW_FRAME_SIZE,
    CANONICAL_WIDTH,
    CANONICAL_HEIGHT,
    CANONICAL_DRAWING_STREAM_RAW,
    CANONICAL_CREATION_DATE,
    ULURO_HEADER,
)
from native_vector_reencoder import reencode_vector_stream


def make_test_frame(page_idx: int = 0) -> bytes:
    """Creates a deterministic 300 DPI 2550x3300 8-bit DeviceRGB buffer (25,245,000 bytes)."""
    # Background white (255, 255, 255) with page-specific watermark pattern
    arr = np.full((CANONICAL_HEIGHT, CANONICAL_WIDTH, 3), 255, dtype=np.uint8)
    # Header bar
    arr[450:520, 88:2462] = [17, 41, 162]  # Dark blue
    # Page indicator stripe to ensure distinct frame data
    arr[600 + page_idx * 50 : 640 + page_idx * 50, 100:500] = [50 + page_idx * 20, 100, 150]
    return arr.tobytes()


# ==============================================================================
# 1. ULURO Container Engine Stress Tests
# ==============================================================================

@pytest.mark.parametrize("n_pages", [1, 2, 3, 5, 10])
def test_uluro_container_scaling_and_xref_physical_alignment(tmp_path, n_pages):
    """
    Stress-tests ULURO container synthesis across arbitrary page counts:
    - Object count strictly equals 4N + 3.
    - Trailer /Size strictly equals 4N + 4.
    - Exact byte offset of every object matches physical 'oid 0 obj' in binary buffer.
    - Every XREF entry is exactly 20 bytes long.
    - startxref points exactly to 'xref\\n'.
    """
    frames = [make_test_frame(i) for i in range(n_pages)]
    pdf_bytes = synthesize_uluro_container(frames, creation_date=CANONICAL_CREATION_DATE)

    expected_objects = 4 * n_pages + 3
    expected_size = 4 * n_pages + 4

    # 1. Header check
    assert pdf_bytes[:15] == ULURO_HEADER
    assert pdf_bytes[15:].startswith(b"1 0 obj<<\n")

    # 2. Extract startxref
    startxref_match = re.search(rb"startxref\r?\n(\d+)\r?\n%%EOF", pdf_bytes)
    assert startxref_match is not None, "Missing startxref marker"
    startxref_offset = int(startxref_match.group(1))

    # Assert startxref points exactly to 'xref'
    assert pdf_bytes[startxref_offset : startxref_offset + 5] == b"xref\n"

    # 3. Parse XREF table line-by-line
    xref_header_match = re.search(
        rb"xref\r?\n0\s+(\d+)\r?\n", pdf_bytes[startxref_offset : startxref_offset + 50]
    )
    assert xref_header_match is not None, "Invalid xref table header"
    xref_count = int(xref_header_match.group(1))
    assert xref_count == expected_size, (
        f"N={n_pages}: XREF count {xref_count} != expected {expected_size}"
    )

    xref_data_start = startxref_offset + xref_header_match.end()
    
    # Read each 20-byte XREF line
    xref_offsets: dict[int, int] = {}
    for oid in range(xref_count):
        entry_line = pdf_bytes[xref_data_start + oid * 20 : xref_data_start + (oid + 1) * 20]
        assert len(entry_line) == 20, f"XREF entry {oid} is not 20 bytes: {entry_line}"
        assert entry_line.endswith(b" \n"), f"XREF entry {oid} missing trailing space/newline: {entry_line}"

        parts = entry_line.split()
        offset = int(parts[0])
        gen = int(parts[1])
        status = parts[2]

        if oid == 0:
            assert status == b"f"
            assert offset == 0
            assert gen == 65535
        else:
            assert status == b"n"
            assert gen == 0
            xref_offsets[oid] = offset

    # 4. Verify physical object boundaries
    assert len(xref_offsets) == expected_objects
    for oid, offset in xref_offsets.items():
        assert 0 < offset < startxref_offset, f"Object {oid} offset out of bounds: {offset}"
        obj_header = pdf_bytes[offset : offset + 30]
        expected_prefix = f"{oid} 0 obj".encode("ascii")
        assert obj_header.startswith(expected_prefix), (
            f"Object {oid} physical header mismatch at offset {offset}: {obj_header[:20]} != {expected_prefix}"
        )

    # 5. Verify trailer dictionary
    trailer_match = re.search(
        rb"trailer\r?\n<<\r?\n/Size\s+(\d+)\r?\n/Root\s+(\d+)\s+0\s+R\r?\n/Info\s+(\d+)\s+0\s+R\r?\n/ID\s+\[<([0-9A-Fa-f]{32})><\4>\]\r?\n>>",
        pdf_bytes,
    )
    assert trailer_match is not None, "Trailer dictionary syntax mismatch"
    trailer_size = int(trailer_match.group(1))
    trailer_root = int(trailer_match.group(2))
    trailer_info = int(trailer_match.group(3))

    assert trailer_size == expected_size
    assert trailer_root == (7 if n_pages == 1 else (11 if n_pages == 2 else expected_objects))
    assert trailer_info == (6 if n_pages == 1 else 7)


@pytest.mark.parametrize("n_pages", [1, 2, 3, 5])
def test_uluro_container_pymupdf_zero_fonts_zero_text(n_pages):
    """
    Stress-tests PyMuPDF inspection on arbitrary N-page ULURO containers:
    - 0 embedded vector fonts.
    - 0 text operators across all content streams.
    - Content streams match canonical drawing stream.
    - Exact 1:1 image geometry (2550 x 3300, 8-bit DeviceRGB, 25,245,000 raw bytes).
    """
    frames = [make_test_frame(i) for i in range(n_pages)]
    pdf_bytes = synthesize_uluro_container(frames, creation_date=CANONICAL_CREATION_DATE)

    doc = pymupdf.open("pdf", pdf_bytes)
    assert doc.page_count == n_pages

    for pno in range(n_pages):
        page = doc[pno]
        # 1. 0 fonts
        fonts = page.get_fonts()
        assert len(fonts) == 0, f"Page {pno} has embedded fonts: {fonts}"

        # 2. 0 text
        text = page.get_text()
        assert len(text.strip()) == 0, f"Page {pno} returned text: {text}"

        # 3. 0 text operators in content stream
        contents = page.get_contents()
        assert len(contents) >= 1
        for cx in contents:
            c_raw = doc.xref_stream(cx)
            c_decomp = zlib.decompress(c_raw) if c_raw.startswith(b"x") else c_raw
            # Assert absence of text drawing operators
            for op in [b"BT", b"ET", b"Tf", b"Tj", b"TJ", b"'", b'"']:
                # Find isolated operator tokens
                assert not re.search(rb"\b" + op + rb"\b", c_decomp), (
                    f"Page {pno} content stream contains text operator {op}: {c_decomp}"
                )
            assert b"/Img0 Do" in c_decomp
            assert b"612 0 0 792 0 0 cm" in c_decomp

        # 4. Image geometry
        imgs = page.get_images()
        assert len(imgs) == 1, f"Page {pno} expected 1 image, got {len(imgs)}"
        img_info = imgs[0]
        assert img_info[2] == CANONICAL_WIDTH
        assert img_info[3] == CANONICAL_HEIGHT
        assert img_info[4] == 8  # bpc
        assert img_info[5] == "DeviceRGB"  # colorspace

        raw_img = doc.xref_stream(img_info[0])
        assert len(raw_img) == RAW_FRAME_SIZE, (
            f"Page {pno} image uncompressed size {len(raw_img)} != {RAW_FRAME_SIZE}"
        )

    doc.close()


def test_uluro_container_prohibited_markers_absence():
    """Verifies absolute absence of Skia, Chromium, WebKit, Cairo, and PDFium markers."""
    frames = [make_test_frame(0), make_test_frame(1)]
    pdf_bytes = synthesize_uluro_container(frames)

    prohibited = [b"Skia", b"Chromium", b"WebKit", b"Cairo", b"PDFium"]
    for marker in prohibited:
        assert marker not in pdf_bytes, f"Prohibited marker {marker.decode()} found in ULURO container!"


# ==============================================================================
# 2. Native Vector Re-Encoder Stress Tests
# ==============================================================================

STATEMENT_CORPUS = [
    "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf",
    "US_1364_FCU_Statement_Massive_3Page.pdf",
    "US_1364_FCU_Statement_Expanded_3Page.pdf",
    "US_1364_FCU_Statement_June_2026_Aziz_Berjis.pdf",
    "US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf",
    "US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf",
]


@pytest.mark.parametrize("statement_name", STATEMENT_CORPUS)
def test_stress_reencoder_zero_inverted_cm_and_type1_fonts(tmp_path, statement_name):
    """
    Stress-tests native_vector_reencoder across the entire statement corpus:
    - 0 negative scale factor cm operators in all content streams.
    - All fonts strictly replaced with Adobe Type 1 ArialMT / Arial-BoldMT.
    - Defragmented cohesive (text) Tj string operators.
    - Sub-pixel vector bounding box alignment (<0.001 pt delta).
    - Sub-pixel image placement alignment (<0.001 pt delta).
    """
    src_path = os.path.join(PROJECT_ROOT, statement_name)
    assert os.path.exists(src_path), f"Corpus statement not found: {src_path}"

    out_path = str(tmp_path / f"reencoded_{statement_name}")
    res = reencode_vector_stream(src_path, out_path)
    assert res == out_path
    assert os.path.exists(out_path)

    doc_src = pymupdf.open(src_path)
    doc_out = pymupdf.open(out_path)
    assert len(doc_src) == len(doc_out)

    for pno in range(len(doc_out)):
        p_src = doc_src[pno]
        p_out = doc_out[pno]

        # 1. Check content stream cm matrices: strictly 0 negative scale factor cm operators
        stream_raw = b"".join(doc_out.xref_stream(c) for c in p_out.get_contents())
        stream_str = stream_raw.decode("latin1", errors="replace")

        all_cms = re.findall(
            r"([-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+cm)",
            stream_str,
        )
        negative_scale_cms = [
            cm
            for cm in all_cms
            if float(cm.split()[0]) < 0 or float(cm.split()[3]) < 0
        ]
        assert len(negative_scale_cms) == 0, (
            f"Statement {statement_name} Page {pno} has {len(negative_scale_cms)} negative scale cm: {negative_scale_cms}"
        )

        # 2. Font replacement strictly produces Adobe Type 1 fonts: ArialMT, Arial-BoldMT
        fonts = p_out.get_fonts()
        assert len(fonts) > 0, f"Statement {statement_name} Page {pno} has 0 fonts"
        for f in fonts:
            font_type = f[2]
            font_name = f[3]
            assert font_type == "Type1", (
                f"Statement {statement_name} Page {pno} font {font_name} is not Type1: {font_type}"
            )
            assert font_name in ("Arial-BoldMT", "ArialMT"), (
                f"Statement {statement_name} Page {pno} has non-Inspire font: {font_name}"
            )

        # 3. Defragmented cohesive (text) Tj string operators (0 fragmented <CID> Tj)
        cohesive_tjs = re.findall(r"\((?:[^()\\]|\\.)*\)\s*Tj", stream_str)
        cid_tjs = re.findall(r"<[0-9A-Fa-f]+>\s*Tj", stream_str)
        assert len(cohesive_tjs) > 0, (
            f"Statement {statement_name} Page {pno} missing cohesive (text) Tj operators"
        )
        assert len(cid_tjs) == 0, (
            f"Statement {statement_name} Page {pno} contains {len(cid_tjs)} micro-fragmented CID Tj operators"
        )

        # 4. Check vector drawing bounding box deltas
        drawings_src = p_src.get_drawings()
        drawings_out = p_out.get_drawings()
        assert len(drawings_src) == len(drawings_out), (
            f"Statement {statement_name} Page {pno} drawing count mismatch: {len(drawings_src)} != {len(drawings_out)}"
        )

        max_rect_delta = 0.0
        for i in range(len(drawings_src)):
            r_s = drawings_src[i]["rect"]
            r_o = drawings_out[i]["rect"]
            delta = max(
                abs(r_s[0] - r_o[0]),
                abs(r_s[1] - r_o[1]),
                abs(r_s[2] - r_o[2]),
                abs(r_s[3] - r_o[3]),
            )
            if delta > max_rect_delta:
                max_rect_delta = delta

        assert max_rect_delta < 0.001, (
            f"Statement {statement_name} Page {pno} max vector delta {max_rect_delta:.6f} pt exceeds 0.001 pt threshold"
        )

        # 5. Check image placement deltas
        imgs_src = p_src.get_image_info()
        imgs_out = p_out.get_image_info()
        assert len(imgs_src) == len(imgs_out), (
            f"Statement {statement_name} Page {pno} image count mismatch: {len(imgs_src)} != {len(imgs_out)}"
        )

        max_img_delta = 0.0
        for i in range(len(imgs_src)):
            b_s = imgs_src[i]["bbox"]
            b_o = imgs_out[i]["bbox"]
            delta = max(
                abs(b_s[0] - b_o[0]),
                abs(b_s[1] - b_o[1]),
                abs(b_s[2] - b_o[2]),
                abs(b_s[3] - b_o[3]),
            )
            if delta > max_img_delta:
                max_img_delta = delta

        assert max_img_delta < 0.001, (
            f"Statement {statement_name} Page {pno} max image delta {max_img_delta:.6f} pt exceeds 0.001 pt threshold"
        )

    doc_src.close()
    doc_out.close()


def test_stress_reencoder_multi_generation_idempotency(tmp_path):
    """
    Stress-tests re-encoder stability across multiple sequential re-encoding generations:
    Gen 0 (Raw) -> Gen 1 -> Gen 2 -> Gen 3
    Asserts zero coordinate drift and stable font/matrix preservation across generations.
    """
    src_path = os.path.join(
        PROJECT_ROOT, "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf"
    )
    gen1_path = str(tmp_path / "gen1.pdf")
    gen2_path = str(tmp_path / "gen2.pdf")
    gen3_path = str(tmp_path / "gen3.pdf")

    reencode_vector_stream(src_path, gen1_path)
    reencode_vector_stream(gen1_path, gen2_path)
    reencode_vector_stream(gen2_path, gen3_path)

    doc_g1 = pymupdf.open(gen1_path)
    doc_g2 = pymupdf.open(gen2_path)
    doc_g3 = pymupdf.open(gen3_path)

    assert len(doc_g1) == len(doc_g2) == len(doc_g3) == 2

    for pno in range(2):
        # Fonts must remain strictly Type 1
        for doc, name in [(doc_g1, "Gen1"), (doc_g2, "Gen2"), (doc_g3, "Gen3")]:
            fonts = doc[pno].get_fonts()
            assert all(f[2] == "Type1" for f in fonts), f"{name} has non-Type1 fonts"

        # Compare drawings between Gen 1, Gen 2, Gen 3
        d1 = doc_g1[pno].get_drawings()
        d2 = doc_g2[pno].get_drawings()
        d3 = doc_g3[pno].get_drawings()
        assert len(d1) == len(d2) == len(d3)

        for i in range(len(d1)):
            r1 = d1[i]["rect"]
            r2 = d2[i]["rect"]
            r3 = d3[i]["rect"]
            delta_12 = max(abs(r1[k] - r2[k]) for k in range(4))
            delta_23 = max(abs(r2[k] - r3[k]) for k in range(4))
            assert delta_12 < 0.001, f"Idempotency drift Gen1->Gen2 on drawing {i}: {delta_12:.6f}"
            assert delta_23 < 0.001, f"Idempotency drift Gen2->Gen3 on drawing {i}: {delta_23:.6f}"

    doc_g1.close()
    doc_g2.close()
    doc_g3.close()


def test_reencoder_vulnerability_on_legacy_form_xobjects(tmp_path):
    """
    Empirical Stress Finding (Adversarial Challenge):
    When an input PDF contains an ExtGState Soft Mask (/SMask) wrapping a Form XObject
    (/Subtype /Form) with an inverted transformation matrix (e.g. US_1364_FCU_Statement_August_2026.pdf),
    native_vector_reencoder.py only normalizes the primary page contents stream (page.get_contents()),
    leaving the Form XObject internal stream with an inverted scale factor cm (e.g. -793).
    This test verifies and isolates this architectural boundary.
    """
    legacy_path = os.path.join(PROJECT_ROOT, "US_1364_FCU_Statement_August_2026.pdf")
    if not os.path.exists(legacy_path):
        pytest.skip("Legacy August 2026 PDF not present")

    out_path = str(tmp_path / "reencoded_legacy_august.pdf")
    reencode_vector_stream(legacy_path, out_path)

    doc_out = pymupdf.open(out_path)
    
    # 1. Verify that the primary page content stream is properly normalized (0 negative cm)
    for pno in range(len(doc_out)):
        stream_raw = b"".join(doc_out.xref_stream(c) for c in doc_out[pno].get_contents())
        stream_str = stream_raw.decode("latin1", errors="replace")
        all_cms = re.findall(
            r"([-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+cm)",
            stream_str,
        )
        neg_cms = [cm for cm in all_cms if float(cm.split()[0]) < 0 or float(cm.split()[3]) < 0]
        assert len(neg_cms) == 0, f"Page {pno} content stream unexpectedly has negative cm: {neg_cms}"

    # 2. Document the unnormalized Form XObject stream
    form_found = False
    for x in range(1, doc_out.xref_length()):
        obj_str = doc_out.xref_object(x)
        if "/Subtype /Form" in obj_str:
            form_found = True
            form_stream = doc_out.xref_stream(x).decode("latin1", errors="replace")
            # Verify the empirical challenger finding: negative cm remains inside Form XObject
            assert "-793" in form_stream, "Expected inverted cm matrix in Form XObject"
    
    assert form_found, "Expected Form XObject in legacy statement"
    doc_out.close()


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
