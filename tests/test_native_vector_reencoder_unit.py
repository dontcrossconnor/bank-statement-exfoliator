"""
Unit and Forensic Parity Tests for Native Vector Stream Re-Encoder Normalizer (native_vector_reencoder.py)
[test_native_vector_reencoder_unit.py](file:///e:/StatementGen/tests/test_native_vector_reencoder_unit.py)

Validates Requirement R2:
- Zero inverted cm matrices.
- Standard bottom-left Cartesian coordinates (0, 0).
- Normalization to Quadient Inspire Adobe Type 1 fonts (Arial-BoldMT, ArialMT).
- Flattening of micro-fragmented CID glyphs into cohesive (text) Tj string operators.
- Pixel-level alignment (<0.001 pt delta) of vector drawings and image XObjects.
- Multi-page statement scaling and metadata normalization.
"""

import os
import re
import pytest
import pymupdf
from native_vector_reencoder import reencode_vector_stream

SRC_STATEMENT_PATH = "e:/StatementGen/US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf"
MASSIVE_3PAGE_PATH = "e:/StatementGen/US_1364_FCU_Statement_Massive_3Page.pdf"


@pytest.fixture
def temp_output_dir(tmp_path):
    return str(tmp_path)


def test_reencode_vector_stream_basic(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_basic.pdf")
    res = reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)
    assert res == out_pdf
    assert os.path.exists(out_pdf)
    assert os.path.getsize(out_pdf) > 0


def test_zero_inverted_cm_matrices(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_zero_inverted.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc = pymupdf.open(out_pdf)
    assert len(doc) == 2

    for pno in range(len(doc)):
        page = doc[pno]
        stream_str = doc.xref_stream(page.get_contents()[0]).decode("latin1")

        # Find all cm matrices
        all_cms = re.findall(
            r"([-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+cm)", stream_str
        )
        # Any negative number in the 2x2 linear portion (a, b, c, d) indicates an inverted coordinate matrix
        inverted_cms = [cm for cm in all_cms if any(float(n) < 0 for n in cm.split()[:4])]
        assert len(inverted_cms) == 0, f"Page {pno} has inverted cm matrices: {inverted_cms}"


def test_type1_fonts_present(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_type1_fonts.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc = pymupdf.open(out_pdf)
    for pno in range(len(doc)):
        page = doc[pno]
        fonts = page.get_fonts()
        assert len(fonts) > 0, f"Page {pno} has no fonts"
        for f in fonts:
            font_type = f[2]
            font_name = f[3]
            assert font_type == "Type1", f"Page {pno} font {font_name} has non-Type1 subtype: {font_type}"
            assert font_name in ("Arial-BoldMT", "ArialMT"), f"Unexpected Type 1 font: {font_name}"


def test_cohesive_string_tj_operators(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_cohesive_tj.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc = pymupdf.open(out_pdf)
    for pno in range(len(doc)):
        page = doc[pno]
        stream_str = doc.xref_stream(page.get_contents()[0]).decode("latin1")

        # Must have cohesive (text) Tj operators
        cohesive_tjs = re.findall(r"\((?:[^()\\]|\\.)*\)\s*Tj", stream_str)
        assert len(cohesive_tjs) > 0, f"Page {pno} has no cohesive (text) Tj operators"

        # Must NOT have micro-fragmented hex <CID> Tj operators
        cid_tjs = re.findall(r"<[0-9A-Fa-f]+>\s*Tj", stream_str)
        assert len(cid_tjs) == 0, f"Page {pno} contains {len(cid_tjs)} fragmented CID operators"


def test_pixel_level_vector_alignment(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_vector_align.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc_src = pymupdf.open(SRC_STATEMENT_PATH)
    doc_out = pymupdf.open(out_pdf)

    for pno in range(len(doc_src)):
        d_src = doc_src[pno].get_drawings()
        d_out = doc_out[pno].get_drawings()
        assert len(d_src) == len(d_out), f"Page {pno} drawings count mismatch: {len(d_src)} != {len(d_out)}"

        max_delta = 0.0
        for i in range(len(d_src)):
            r_s = d_src[i]["rect"]
            r_o = d_out[i]["rect"]
            delta = max(
                abs(r_s[0] - r_o[0]),
                abs(r_s[1] - r_o[1]),
                abs(r_s[2] - r_o[2]),
                abs(r_s[3] - r_o[3]),
            )
            if delta > max_delta:
                max_delta = delta

        # Assert sub-pixel precision down to 0.001 pt
        assert max_delta < 0.001, f"Page {pno} vector rect delta exceeds threshold: {max_delta:.6f} pt"


def test_pixel_level_image_alignment(temp_output_dir):
    out_pdf = os.path.join(temp_output_dir, "test_image_align.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc_src = pymupdf.open(SRC_STATEMENT_PATH)
    doc_out = pymupdf.open(out_pdf)

    for pno in range(len(doc_src)):
        img_s = doc_src[pno].get_image_info()
        img_o = doc_out[pno].get_image_info()
        assert len(img_s) == len(img_o), f"Page {pno} image count mismatch"

        max_img_delta = 0.0
        for i in range(len(img_s)):
            b_s = img_s[i]["bbox"]
            b_o = img_o[i]["bbox"]
            delta = max(
                abs(b_s[0] - b_o[0]),
                abs(b_s[1] - b_o[1]),
                abs(b_s[2] - b_o[2]),
                abs(b_s[3] - b_o[3]),
            )
            if delta > max_img_delta:
                max_img_delta = delta

        assert max_img_delta < 0.001, f"Page {pno} image bbox delta exceeds threshold: {max_img_delta:.6f} pt"


def test_multipage_scaling(temp_output_dir):
    out_3p = os.path.join(temp_output_dir, "test_3p_reencoded.pdf")
    reencode_vector_stream(MASSIVE_3PAGE_PATH, out_3p)

    doc = pymupdf.open(out_3p)
    assert len(doc) == 3, f"Expected 3 pages, got {len(doc)}"

    for pno in range(3):
        p = doc[pno]
        assert all(f[2] == "Type1" for f in p.get_fonts())
        s = doc.xref_stream(p.get_contents()[0]).decode("latin1")
        inv = [
            x
            for x in re.findall(
                r"([-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+cm)", s
            )
            if any(float(n) < 0 for n in x.split()[:4])
        ]
        assert len(inv) == 0, f"Page {pno} in 3-page statement has inverted cm: {inv}"


def test_metadata_normalization(temp_output_dir):
    custom_meta = {
        "producer": "ULURO PDF 4.0.1.17",
        "creator": "ULURO",
        "author": "Quadient AG",
        "title": "USFCU Statement",
    }
    out_meta = os.path.join(temp_output_dir, "test_meta.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_meta, metadata=custom_meta)

    doc = pymupdf.open(out_meta)
    meta = doc.metadata
    assert meta["producer"] == custom_meta["producer"]
    assert meta["creator"] == custom_meta["creator"]
    assert "Skia" not in meta.get("producer", "")
    assert "Chromium" not in meta.get("producer", "")


def test_in_place_rewrite_safety(temp_output_dir):
    import shutil
    copy_path = os.path.join(temp_output_dir, "in_place_target.pdf")
    shutil.copyfile(SRC_STATEMENT_PATH, copy_path)

    # In-place re-encode (input == output)
    res = reencode_vector_stream(copy_path, copy_path)
    assert res == copy_path

    doc = pymupdf.open(copy_path)
    assert len(doc) == 2
    assert all(f[2] == "Type1" for f in doc[0].get_fonts())


def test_complete_cff_font_embedding(temp_output_dir):
    """Validates that fonts are embedded as /Subtype /Type1C CFF font streams (ext == 'cff')."""
    out_pdf = os.path.join(temp_output_dir, "test_cff_embed.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc = pymupdf.open(out_pdf)
    fonts = doc[0].get_fonts()
    assert len(fonts) >= 2
    for f in fonts:
        assert f[1] == "cff", f"Font {f[3]} is not embedded as CFF: {f}"
        assert f[2] == "Type1"
        extracted = doc.extract_font(f[0])
        assert extracted[1] == "cff"
        assert len(extracted[3]) > 5000, f"Font buffer unexpectedly small: {len(extracted[3])}"
    doc.close()


def test_quadient_spool_metadata_default(temp_output_dir):
    """Validates that Quadient profile defaults to production master spool profile."""
    out_pdf = os.path.join(temp_output_dir, "test_quadient_meta.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf, profile="quadient")

    doc = pymupdf.open(out_pdf)
    assert doc.metadata["creator"] == "Quadient Group AG~Inspire~12.0.85.0"
    assert doc.metadata["producer"] == ""
    doc.close()


def test_decoupled_timestamps(temp_output_dir):
    """Validates that PDF CreationDate reflects cycle batch while st_mtime reflects download time."""
    from datetime import datetime, timezone
    out_pdf = os.path.join(temp_output_dir, "test_decoupled.pdf")
    cycle_date = "D:20260701031422Z"
    dl_time = "2026-09-21 13:12:15"

    reencode_vector_stream(
        SRC_STATEMENT_PATH,
        out_pdf,
        creation_date=cycle_date,
        download_time=dl_time,
        profile="quadient",
    )

    doc = pymupdf.open(out_pdf)
    assert doc.metadata["creationDate"] == cycle_date
    doc.close()

    mtime = os.path.getmtime(out_pdf)
    dt_mtime = datetime.fromtimestamp(mtime, tz=timezone.utc)
    dt_expected = datetime.strptime(dl_time, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
    assert abs((dt_mtime - dt_expected).total_seconds()) <= 2.0


def test_zero_soft_masks_and_vector_purity(temp_output_dir):
    """Validates that re-encoded stream has 0 /SMask occurrences."""
    out_pdf = os.path.join(temp_output_dir, "test_zero_smask.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    with open(out_pdf, "rb") as f:
        raw = f.read()
    assert raw.count(b"/SMask") == 0


def test_dynamic_cff_subsetting_unit():
    """Validates dynamic CFF subsetting prunes glyphs to ~70-80 while guaranteeing required characters."""
    import base64
    import io
    from fontTools.cffLib import CFFFontSet
    from native_vector_reencoder import subset_cff, get_subset_type1_widths
    from src.assets.cff_fonts import EMBEDDED_FULL_BOLD_CFF_B64, EMBEDDED_FULL_REG_CFF_B64

    base_bold = base64.b64decode(EMBEDDED_FULL_BOLD_CFF_B64)
    used_text = "US 1364 Federal Credit Union $1,234.56 Account Summary | Inquiries 01/31/2026"
    subset_bytes = subset_cff(base_bold, set(used_text))

    cff = CFFFontSet()
    cff.decompile(io.BytesIO(subset_bytes), None)
    top = cff[0]

    # Verify glyph count is pruned to ~70-85 glyphs (not full 181 glyphs)
    glyph_count = len(top.CharStrings)
    assert 60 <= glyph_count <= 95, f"Expected 60-95 glyphs, got {glyph_count}"

    # Verify required characters are present: digits 0-9, letters, punctuation, pipe |
    required_glyphs = [
        ".notdef", "space", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "A", "B", "C", "D", "E", "F", "G", "a", "b", "c", "d", "e", "f", "dollar", "period", "comma",
        "slash", "colon", "bar", "hyphen", "percent"
    ]
    for rg in required_glyphs:
        assert rg in top.CharStrings, f"Required glyph '{rg}' missing from subset CharStrings"
        assert rg in top.charset, f"Required glyph '{rg}' missing from subset charset"

    # Verify widths pruning: unused chars have width 0, used chars have nonzero width
    fc, lc, widths = get_subset_type1_widths("hebo", set(used_text))
    assert fc == 32
    assert lc >= 124
    # 'A' is 65 -> index 65 - 32 = 33
    assert widths[65 - 32] > 0
    # '0' is 48 -> index 48 - 32 = 16
    assert widths[48 - 32] > 0


def test_reencode_embeds_subset_cff_streams(temp_output_dir):
    """Validates that re-encoded statement embeds dynamically subsetted CFF streams."""
    import io
    from fontTools.cffLib import CFFFontSet

    out_pdf = os.path.join(temp_output_dir, "test_subsetted_statement.pdf")
    reencode_vector_stream(SRC_STATEMENT_PATH, out_pdf)

    doc = pymupdf.open(out_pdf)
    assert len(doc) == 2

    # Check font CFF streams on page 0
    fonts = doc[0].get_fonts()
    for f in fonts:
        xref = f[0]
        ext = f[1]
        assert ext == "cff"
        font_data = doc.extract_font(xref)[3]
        cff = CFFFontSet()
        cff.decompile(io.BytesIO(font_data), None)
        top = cff[0]
        # Pruned subset should have between 60 and 95 glyphs, matching Quadient Inspire server profile
        assert 60 <= len(top.CharStrings) <= 95, f"Font {f[3]} has {len(top.CharStrings)} glyphs, expected 60-95"
    doc.close()


def test_escape_pdf_string_unicode_punctuation_safety():
    """Validates that escape_pdf_string normalizes unicode punctuation and produces zero invalid octal literals."""
    from native_vector_reencoder import escape_pdf_string

    raw_text = "Member\u2019s Account \u201cChecking\u201d \u2014 Rate: 5.25% \u2022 Details\u2026 \u00a0"
    escaped = escape_pdf_string(raw_text)

    # Must convert smart quotes to ASCII straight quotes
    assert "Member's Account" in escaped
    assert '"Checking"' in escaped
    assert " - Rate: 5.25%" in escaped
    assert " * Details..." in escaped

    # Must NOT have any invalid multi-digit octal sequences (backslash followed by >3 octal digits)
    corrupted_octals = re.findall(r"\\[0-7]{4,}", escaped)
    assert len(corrupted_octals) == 0, f"Found corrupted >3-digit octal literals: {corrupted_octals}"

    # Any octal sequence must be valid byte (000 to 377)
    for oct_match in re.finditer(r"\\([0-7]{3})", escaped):
        byte_val = int(oct_match.group(1), 8)
        assert 0 <= byte_val <= 255, f"Octal escape out of byte range: {oct_match.group(0)}"


def test_cff_subsetting_with_special_characters():
    """Validates that CFF subsetter handles strings containing unicode punctuation without compile errors."""
    import base64
    import io
    from fontTools.cffLib import CFFFontSet
    from native_vector_reencoder import subset_cff
    from src.assets.cff_fonts import EMBEDDED_FULL_BOLD_CFF_B64, EMBEDDED_FULL_REG_CFF_B64

    for font_b64 in (EMBEDDED_FULL_BOLD_CFF_B64, EMBEDDED_FULL_REG_CFF_B64):
        base_cff = base64.b64decode(font_b64)
        used_text = "Member\u2019s \u2014 \u201cBalance\u201d \u2022 \u2026 \u00a0 \u20ac \u00a9 \u00ae $100.00"
        subset = subset_cff(base_cff, set(used_text))
        assert len(subset) > 0

        cff = CFFFontSet()
        cff.decompile(io.BytesIO(subset), None)
        assert len(cff[0].CharStrings) >= 60


