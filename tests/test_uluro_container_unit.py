"""
Unit and Integration Tests for ULURO PDF Container Engine (uluro_pdf_container.py)
Validates Requirement R1 down to individual bytes, objects, and pixel dimensions.
"""

import hashlib
import io
import os
import re
import zlib
import pytest
import pymupdf
import numpy as np
from PIL import Image

import uluro_pdf_container
from uluro_pdf_container import (
    create_uluro_container_from_images,
    convert_pdf_to_uluro_container,
    synthesize_uluro_container,
    synthesize_uluro_container_from_frames,
    encode_utf16be_hex,
    normalize_frame_to_rgb24,
    ULURO_HEADER,
    CANONICAL_WIDTH,
    CANONICAL_HEIGHT,
    RAW_FRAME_SIZE,
    CANONICAL_CREATION_DATE,
    CANONICAL_DRAWING_STREAM_RAW,
    CANONICAL_DRAWING_STREAM_COMPRESSED,
)


def test_header_byte_exact():
    """Asserts PDF header is exactly 15 bytes: %PDF-1.4\\n%\\xd2\\xe5\\xd1\\xf2\\n."""
    assert ULURO_HEADER == b"%PDF-1.4\n%\xd2\xe5\xd1\xf2\n"
    assert len(ULURO_HEADER) == 15


def test_canonical_dimensions_and_frame_size():
    """Asserts 300 DPI US Letter dimensions and raw RGB24 buffer size."""
    assert CANONICAL_WIDTH == 2550
    assert CANONICAL_HEIGHT == 3300
    assert RAW_FRAME_SIZE == 2550 * 3300 * 3  # 25,245,000 bytes


def test_content_stream_compression_parity():
    """Asserts drawing stream matches canonical 11-30-24.pdf Object 9 decompressed and compressed."""
    assert len(CANONICAL_DRAWING_STREAM_COMPRESSED) == 75
    decompressed = zlib.decompress(CANONICAL_DRAWING_STREAM_COMPRESSED)
    assert decompressed == CANONICAL_DRAWING_STREAM_RAW
    assert b"/Img0 Do" in decompressed
    assert b"612 0 0 792 0 0 cm" in decompressed


def test_utf16be_hex_encoding():
    """Asserts UTF-16BE hex encoding with BOM matches canonical ULURO metadata strings."""
    assert encode_utf16be_hex("ULURO") == "<FEFF0055004C00550052004F>"
    assert encode_utf16be_hex("") == "<FEFF>"
    assert encode_utf16be_hex("None") == "<FEFF004E006F006E0065>"
    
    prod_hex = encode_utf16be_hex("ULURO (www.uluro.com)")
    assert prod_hex.startswith("<FEFF")
    assert prod_hex.endswith(">")
    # Decode back to verify lossless roundtrip
    prod_bytes = bytes.fromhex(prod_hex[1:-1])
    assert prod_bytes[:2] == b"\xfe\xff"
    assert prod_bytes[2:].decode("utf-16-be") == "ULURO (www.uluro.com)"


def test_frame_normalizer_all_types(tmp_path, synthetic_frame_bytes, synthetic_frame_numpy, synthetic_frame_pil):
    """Asserts normalize_frame_to_rgb24 handles bytes, numpy array, PIL Image, and file path."""
    # 1. Raw bytes
    norm_b = normalize_frame_to_rgb24(synthetic_frame_bytes)
    assert len(norm_b) == RAW_FRAME_SIZE
    assert isinstance(norm_b, bytes)

    # 2. Numpy array
    norm_n = normalize_frame_to_rgb24(synthetic_frame_numpy)
    assert len(norm_n) == RAW_FRAME_SIZE
    assert isinstance(norm_n, bytes)

    # 3. PIL Image
    norm_p = normalize_frame_to_rgb24(synthetic_frame_pil)
    assert len(norm_p) == RAW_FRAME_SIZE
    assert isinstance(norm_p, bytes)

    # 4. File path (PNG)
    png_path = str(tmp_path / "test_frame.png")
    synthetic_frame_pil.save(png_path)
    norm_f = normalize_frame_to_rgb24(png_path)
    assert len(norm_f) == RAW_FRAME_SIZE

    # 5. Encoded bytes (PNG in memory)
    buf = io.BytesIO()
    synthetic_frame_pil.save(buf, format="PNG")
    norm_enc = normalize_frame_to_rgb24(buf.getvalue())
    assert len(norm_enc) == RAW_FRAME_SIZE

    # 6. Invalid buffer raises ValueError
    with pytest.raises(ValueError):
        normalize_frame_to_rgb24(b"\x00" * 50)


def test_2page_exact_11_object_structure(tmp_path, synthetic_frame_bytes):
    """
    Asserts exact 11-object structure for N=2 matching 11-30-24.pdf:
    Obj 1: Page 1 Image XObject
    Obj 2: Page 1 Resources
    Obj 3: Page 1 Content Stream
    Obj 4: Page 1 Page Object
    Obj 6: Page 2 Image XObject
    Obj 7: Info Object
    Obj 8: Page 2 Resources
    Obj 9: Page 2 Content Stream
    Obj 10: Page 2 Page Object
    Obj 5: Pages Root
    Obj 11: Catalog Root
    """
    out_pdf = str(tmp_path / "exact_11_obj.pdf")
    create_uluro_container_from_images(
        [synthetic_frame_bytes, synthetic_frame_bytes],
        out_pdf,
        creation_date=CANONICAL_CREATION_DATE
    )

    with open(out_pdf, "rb") as f:
        raw = f.read()

    # Verify Header
    assert raw[:15] == b"%PDF-1.4\n%\xd2\xe5\xd1\xf2\n"

    # Verify Object 1 begins immediately at offset 15
    assert raw[15:].startswith(b"1 0 obj<<\n/Type /XObject\n/Subtype /Image\n")

    # Verify physical serialization sequence
    order = [1, 2, 3, 4, 6, 7, 8, 9, 10, 5, 11]
    last_pos = 0
    for oid in order:
        marker = f"{oid} 0 obj".encode("ascii")
        pos = raw.find(marker, last_pos)
        assert pos != -1, f"Object {oid} not found after offset {last_pos}"
        last_pos = pos

    # Verify Obj 2: Page 1 Resources
    assert b"2 0 obj<<\n/ProcSet [/PDF /ImageC ]\n/XObject <<\n/Img0 1 0 R\n>>\n>>\nendobj\n" in raw

    # Verify Obj 4: Page 1
    assert b"4 0 obj<<\n/Type /Page\n/Parent 5 0 R\n/MediaBox [0 0 612 792]\n/Resources 2 0 R\n/Contents [3 0 R]\n>>\nendobj\n" in raw

    # Verify Obj 7: Info Object with UTF-16BE hex metadata
    assert b"7 0 obj<<" in raw
    assert b"/Creator <FEFF0055004C00550052004F>" in raw
    assert b"/CreationDate (D:20241211102447)" in raw
    assert b"/Producer <FEFF0055004C00550052004F" in raw

    # Verify Obj 8: Page 2 Resources
    assert b"8 0 obj<<\n/ProcSet [/PDF /ImageC ]\n/XObject <<\n/Img0 6 0 R\n>>\n>>\nendobj\n" in raw

    # Verify Obj 10: Page 2
    assert b"10 0 obj<<\n/Type /Page\n/Parent 5 0 R\n/MediaBox [0 0 612 792]\n/Resources 8 0 R\n/Contents [9 0 R]\n>>\nendobj\n" in raw

    # Verify Obj 5: Pages Root
    assert b"5 0 obj<<\n/Type /Pages\n/Kids [\n4 0 R \n10 0 R \n]\n/Count 2\n>>\nendobj\n" in raw

    # Verify Obj 11: Catalog
    assert b"11 0 obj<<\n/Type /Catalog\n/Pages 5 0 R\n/PageLayout /SinglePage\n/ViewerPreferences <<\n/FitWindow true\n>>\n/PageMode /UseNone\n>>\nendobj\n" in raw

    # Verify XREF table
    xref_pos = raw.find(b"xref\n0 12\n")
    assert xref_pos != -1
    xref_chunk = raw[xref_pos + len(b"xref\n0 12\n") : raw.find(b"trailer\n", xref_pos)]
    assert len(xref_chunk) == 12 * 20  # Exactly 12 entries of 20 bytes each
    assert xref_chunk.startswith(b"0000000000 65535 f \n0000000015 00000 n \n")

    # Verify Trailer
    assert b"trailer\n<<\n/Size 12\n/Root 11 0 R\n/Info 7 0 R\n/ID [" in raw
    assert raw.endswith(b"%%EOF\n\r\n")


def test_dynamic_scaling_n_pages(tmp_path, synthetic_frame_bytes):
    """
    Asserts dynamic scaling across N=1, 2, 3, 4, 5 pages:
    Total objects = 4N + 3.
    Trailer /Size = 4N + 4.
    XREF entries = 4N + 4.
    """
    for n in [1, 2, 3, 4, 5]:
        out_n = str(tmp_path / f"scale_{n}page.pdf")
        synthesize_uluro_container_from_frames([synthetic_frame_bytes] * n, out_n)

        doc = pymupdf.open(out_n)
        assert len(doc) == n
        expected_objs = 4 * n + 3
        expected_xref = 4 * n + 4
        assert doc.xref_length() == expected_xref, f"N={n}: expected {expected_xref} xref, got {doc.xref_length()}"

        # All pages must have 0 fonts, exactly 1 image
        for pno in range(n):
            assert len(doc[pno].get_fonts()) == 0
            imgs = doc[pno].get_images()
            assert len(imgs) == 1
            assert imgs[0][2] == 2550
            assert imgs[0][3] == 3300
        doc.close()

        # Check raw trailer /Size
        with open(out_n, "rb") as f:
            raw = f.read()
        assert f"/Size {expected_xref}\n".encode("ascii") in raw
        assert f"xref\n0 {expected_xref}\n".encode("ascii") in raw


def test_convert_pdf_to_uluro_container_real_statement(tmp_path):
    """
    Asserts convert_pdf_to_uluro_container converts a real statement PDF
    (US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf) into a byte-exact
    ULURO container matching all 6 forensic criteria.
    """
    src_pdf = "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf"
    assert os.path.exists(src_pdf), f"Source statement missing: {src_pdf}"

    out_pdf = str(tmp_path / "converted_nov_statement.pdf")
    convert_pdf_to_uluro_container(src_pdf, out_pdf)

    assert os.path.exists(out_pdf)
    assert os.path.getsize(out_pdf) > 500_000

    doc = pymupdf.open(out_pdf)
    assert len(doc) == 2
    assert doc.xref_length() == 12  # 11 objects + entry 0

    # Layer 2: Image geometry
    for pno in range(2):
        assert len(doc[pno].get_fonts()) == 0  # Layer 3: 0 fonts
        assert len(doc[pno].get_text()) == 0   # Layer 3: 0 text
        imgs = doc[pno].get_images()
        assert len(imgs) == 1
        xref = imgs[0][0]
        base_img = doc.extract_image(xref)
        assert base_img["width"] == 2550
        assert base_img["height"] == 3300
        assert base_img["bpc"] == 8
        uncompressed = doc.xref_stream(xref)
        assert len(uncompressed) == RAW_FRAME_SIZE
    doc.close()

    # Layer 4 & 5: Raw binary checks
    with open(out_pdf, "rb") as f:
        raw = f.read()

    assert raw[:15] == b"%PDF-1.4\n%\xd2\xe5\xd1\xf2\n"
    assert re.search(rb"/ID\s*\[<[0-9A-Fa-f]{32}><[0-9A-Fa-f]{32}>\]", raw)

    # Layer 5: Absence of prohibited markers
    for marker in [b"Skia", b"Chromium", b"WebKit", b"Cairo", b"PDFium"]:
        assert marker not in raw, f"Prohibited marker {marker} found in converted ULURO container"


def test_roundtrip_fidelity_with_canonical_uluro_pdf(canonical_uluro_pdf, tmp_path):
    """
    Extracts 25,245,000-byte frames directly from canonical statement 11-30-24.pdf,
    synthesizes a new container, and compares structure, metadata, and stream properties.
    """
    doc_ref = pymupdf.open(canonical_uluro_pdf)
    frames = [doc_ref.xref_stream(doc_ref[pno].get_images()[0][0]) for pno in range(len(doc_ref))]
    doc_ref.close()

    assert len(frames) == 2
    for f in frames:
        assert len(f) == RAW_FRAME_SIZE

    out_pdf = str(tmp_path / "resynthesized_from_canonical.pdf")
    create_uluro_container_from_images(frames, out_pdf, creation_date=CANONICAL_CREATION_DATE)

    doc_syn = pymupdf.open(out_pdf)
    assert len(doc_syn) == 2
    assert doc_syn.xref_length() == 12

    # Verify visual raster parity: extract pixmaps from both and assert absdiff == 0
    doc_ref2 = pymupdf.open(canonical_uluro_pdf)
    for pno in range(2):
        pix_ref = doc_ref2[pno].get_pixmap(dpi=300)
        pix_syn = doc_syn[pno].get_pixmap(dpi=300)
        assert pix_ref.width == pix_syn.width == 2550
        assert pix_ref.height == pix_syn.height == 3300
        # Compare raw pixel samples
        diff = np.abs(
            np.frombuffer(pix_ref.samples, dtype=np.uint8).astype(int) -
            np.frombuffer(pix_syn.samples, dtype=np.uint8).astype(int)
        )
        assert np.max(diff) == 0, f"Page {pno+1} pixel difference detected between ref and synthesized!"
    doc_ref2.close()
    doc_syn.close()
