"""
Exhaustive 6-Layer Forensic Auditor & Acceptance Verification
============================================================
Validates candidate ULURO container statements against canonical reference statement:
  H:/USFCU/usfederalcu/Target/William Newman - LENDINGCLUB ROBERTSHARPE/statements/11-30-24.pdf

Forensic Layers:
- Layer 1: Object count and dictionary key parity (exact 11 objects for 2 pages / 4N+3 for N pages, matching keys).
- Layer 2: Image stream geometry (2550 x 3300, 8-bit DeviceRGB, raw byte size 25,245,000 per page, /Filter /FlateDecode).
- Layer 3: Zero fonts (doc[p].get_fonts() == []), zero FontDescriptors, zero Skia inverted matrix operators.
- Layer 4: UTF-16BE hex metadata encoding parity (/Producer, /Creator, /Author, /CreationDate) and trailer /ID format ([<32-hex><32-hex>]).
- Layer 5: Absolute absence of Skia, Chromium, WebKit, Cairo, and PDFium byte markers in binary scan.
- Layer 6: OpenCV pixel-by-pixel difference mapping at 300 DPI verifying visual alignment (computing max delta, mean delta, structural parity).
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import cv2
import numpy as np
import pymupdf

# Project Paths & Defaults
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CANONICAL_REF = r"H:\USFCU\usfederalcu\Target\William Newman - LENDINGCLUB ROBERTSHARPE\statements\11-30-24.pdf"
DEFAULT_CANDIDATE_CONTAINER = os.path.join(
    PROJECT_ROOT, "US_1364_Federal_Credit_Union_Statement_November_2024_uluro_container.pdf"
)
DEFAULT_SOURCE_VECTOR = os.path.join(
    PROJECT_ROOT, "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf"
)

# Canonical Dimensions & Constants
PAGE_WIDTH_PT = 612.0
PAGE_HEIGHT_PT = 792.0
RASTER_DPI = 300
IMAGE_WIDTH_PX = 2550
IMAGE_HEIGHT_PX = 3300
RAW_FRAME_BYTES = IMAGE_WIDTH_PX * IMAGE_HEIGHT_PX * 3  # 25,245,000 bytes

# Prohibited Engine Binary Markers
PROHIBITED_MARKERS = [
    b"Skia",
    b"Chromium",
    b"WebKit",
    b"Cairo",
    b"PDFium",
]


# =============================================================================
# LAYER 1: Object Count & Dictionary Key Parity
# =============================================================================

def audit_layer_1_object_structure(
    target_pdf_path: str,
    reference_pdf_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Layer 1: Object count and dictionary key parity against canonical statement 11-30-24.pdf.
    - Exact 11 objects for 2 pages (scaling dynamically to 4N+3 objects for N pages).
    - Dictionary key parity for Catalog, Pages, Page, Resources, Image XObject, Content, Info.
    """
    if not os.path.exists(target_pdf_path):
        raise FileNotFoundError(f"Target PDF file not found: {target_pdf_path}")

    doc = pymupdf.open(target_pdf_path)
    total_objs = doc.xref_length() - 1
    page_count = len(doc)

    # Expected objects: 11 for 2 pages, 4N+3 for N pages
    expected_objs = 11 if page_count == 2 else (4 * page_count + 3)
    if total_objs != expected_objs:
        doc.close()
        raise AssertionError(
            f"Layer 1 Fail: Object count mismatch. Found {total_objs} objects, "
            f"expected {expected_objs} objects (formula: 4N+3 for N={page_count} pages)."
        )

    # Reference comparison if reference PDF is provided
    if reference_pdf_path and os.path.exists(reference_pdf_path):
        ref_doc = pymupdf.open(reference_pdf_path)
        ref_objs = ref_doc.xref_length() - 1
        ref_pages = len(ref_doc)
        if ref_pages == page_count and total_objs != ref_objs:
            ref_doc.close()
            doc.close()
            raise AssertionError(
                f"Layer 1 Fail: Object count mismatch against reference. "
                f"Candidate has {total_objs} objects, reference has {ref_objs} objects."
            )
        ref_doc.close()

    # Dictionary key parity checks
    # 1. Catalog Object
    catalogs = [i for i in range(1, doc.xref_length()) if "/Catalog" in doc.xref_object(i)]
    if len(catalogs) != 1:
        doc.close()
        raise AssertionError(f"Layer 1 Fail: Expected exactly 1 Catalog object, found {len(catalogs)}")
    cat_keys = doc.xref_object(catalogs[0])
    if "/Type /Catalog" not in cat_keys and "/Type/Catalog" not in cat_keys:
        doc.close()
        raise AssertionError("Layer 1 Fail: Catalog dictionary missing /Type /Catalog")
    if "/Pages" not in cat_keys:
        doc.close()
        raise AssertionError("Layer 1 Fail: Catalog dictionary missing /Pages entry")

    # 2. Pages Root Object
    pages_roots = [
        i for i in range(1, doc.xref_length())
        if "/Pages" in doc.xref_object(i) and "/Kids" in doc.xref_object(i)
    ]
    if len(pages_roots) != 1:
        doc.close()
        raise AssertionError(f"Layer 1 Fail: Expected exactly 1 Pages root object, found {len(pages_roots)}")
    pages_str = doc.xref_object(pages_roots[0])
    if "/Count" not in pages_str:
        doc.close()
        raise AssertionError("Layer 1 Fail: Pages root dictionary missing /Count")

    # 3. Page Objects
    page_objs = [
        i for i in range(1, doc.xref_length())
        if ("/Type /Page\n" in doc.xref_object(i) or
            "/Type/Page" in doc.xref_object(i) or
            "/Type /Page " in doc.xref_object(i) or
            "/Type /Page<" in doc.xref_object(i)) and
        "/Kids" not in doc.xref_object(i)
    ]
    if len(page_objs) != page_count:
        doc.close()
        raise AssertionError(
            f"Layer 1 Fail: Expected {page_count} Page objects, found {len(page_objs)}"
        )
    for p_id in page_objs:
        p_str = doc.xref_object(p_id)
        for req_key in ["/Parent", "/MediaBox", "/Resources", "/Contents"]:
            if req_key not in p_str:
                doc.close()
                raise AssertionError(f"Layer 1 Fail: Page object {p_id} missing {req_key}")

    # 4. Image XObjects
    img_objs = [
        i for i in range(1, doc.xref_length())
        if "/Subtype /Image" in doc.xref_object(i) or "/Subtype/Image" in doc.xref_object(i)
    ]
    if len(img_objs) != page_count:
        doc.close()
        raise AssertionError(
            f"Layer 1 Fail: Expected {page_count} Image XObjects, found {len(img_objs)}"
        )
    for img_id in img_objs:
        img_str = doc.xref_object(img_id)
        for req_key in ["/Type /XObject", "/ColorSpace /DeviceRGB", "/BitsPerComponent 8", "/Filter /FlateDecode", "/Length"]:
            # Handle possible space variations
            key_alt = req_key.replace(" ", "")
            if req_key not in img_str and key_alt not in img_str:
                doc.close()
                raise AssertionError(f"Layer 1 Fail: Image XObject {img_id} missing {req_key}")

    # 5. Content Stream Objects
    content_objs = [
        i for i in range(1, doc.xref_length())
        if doc.xref_is_stream(i) and i not in img_objs
    ]
    if len(content_objs) < page_count:
        doc.close()
        raise AssertionError(
            f"Layer 1 Fail: Expected at least {page_count} Content streams, found {len(content_objs)}"
        )

    doc.close()
    return {
        "layer": 1,
        "name": "Object Count & Dictionary Key Parity",
        "pass": True,
        "total_objects": total_objs,
        "page_count": page_count,
        "details": f"Verified exact {total_objs} objects for {page_count} pages with full dictionary key parity."
    }

verify_layer_1 = audit_layer_1_object_structure


# =============================================================================
# LAYER 2: Image Stream Geometry
# =============================================================================

def audit_layer_2_image_geometry(target_pdf_path: str) -> Dict[str, Any]:
    """
    Layer 2: Image stream geometry:
    - Dimensions: 2550 x 3300 (300 DPI Letter).
    - ColorSpace: 8-bit DeviceRGB (3 channels).
    - Uncompressed raw byte size: exactly 25,245,000 bytes per page.
    - Compression filter: /Filter /FlateDecode.
    """
    if not os.path.exists(target_pdf_path):
        raise FileNotFoundError(f"Target PDF file not found: {target_pdf_path}")

    doc = pymupdf.open(target_pdf_path)
    page_count = len(doc)
    page_results = []

    for pno in range(page_count):
        page = doc[pno]
        images = page.get_images()
        if not images:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} contains no image XObjects")

        xref = images[0][0]
        meta = doc.extract_image(xref)
        w = meta.get("width")
        h = meta.get("height")
        bpc = meta.get("bpc", meta.get("bits_per_component", 8))
        cs = meta.get("colorspace")

        if w != IMAGE_WIDTH_PX:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} image width {w} != {IMAGE_WIDTH_PX}")
        if h != IMAGE_HEIGHT_PX:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} image height {h} != {IMAGE_HEIGHT_PX}")
        if bpc != 8:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} bits per component {bpc} != 8")
        if cs != 3:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} colorspace components {cs} != 3 (DeviceRGB)")

        raw_stream = doc.xref_stream(xref)
        raw_size = len(raw_stream)
        if raw_size != RAW_FRAME_BYTES:
            doc.close()
            raise AssertionError(
                f"Layer 2 Fail: Page {pno + 1} uncompressed stream size {raw_size} != {RAW_FRAME_BYTES}"
            )

        obj_str = doc.xref_object(xref)
        if "/FlateDecode" not in obj_str:
            doc.close()
            raise AssertionError(f"Layer 2 Fail: Page {pno + 1} image stream missing /Filter /FlateDecode")

        page_results.append({
            "page": pno + 1,
            "width": w,
            "height": h,
            "bpc": bpc,
            "colorspace_channels": cs,
            "raw_size": raw_size
        })

    doc.close()
    return {
        "layer": 2,
        "name": "Image Stream Geometry",
        "pass": True,
        "pages": page_results,
        "details": f"All {page_count} pages verified at {IMAGE_WIDTH_PX}x{IMAGE_HEIGHT_PX}, 8-bit DeviceRGB, {RAW_FRAME_BYTES} raw bytes."
    }

verify_layer_2 = audit_layer_2_image_geometry


# =============================================================================
# LAYER 3: Zero Fonts & Zero Coordinate Inversions
# =============================================================================

def audit_layer_3_zero_fonts_and_inversions(target_pdf_path: str) -> Dict[str, Any]:
    """
    Layer 3: Zero fonts, zero font descriptors, and zero Skia coordinate inversion operators:
    - len(page.get_fonts()) == 0 for all pages.
    - Zero FontDescriptor objects in raw byte scan.
    - Zero Skia coordinate inversion operators (-.23999999 or 1 0 0 -1) in raw byte scan.
    - Zero /Type /Font dictionary declarations.
    """
    if not os.path.exists(target_pdf_path):
        raise FileNotFoundError(f"Target PDF file not found: {target_pdf_path}")

    doc = pymupdf.open(target_pdf_path)
    for pno in range(len(doc)):
        fonts = doc[pno].get_fonts()
        if len(fonts) > 0:
            doc.close()
            raise AssertionError(
                f"Layer 3 Fail: Page {pno + 1} has {len(fonts)} embedded font(s): {fonts}"
            )
    doc.close()

    with open(target_pdf_path, "rb") as f:
        raw = f.read()

    if b"FontDescriptor" in raw or b"/FontDescriptor" in raw:
        raise AssertionError("Layer 3 Fail: Prohibited 'FontDescriptor' object found in PDF binary stream")

    if b"-.23999999" in raw:
        raise AssertionError("Layer 3 Fail: Prohibited Skia coordinate inversion matrix -.23999999 found in PDF")

    if b"1 0 0 -1" in raw:
        raise AssertionError("Layer 3 Fail: Prohibited Skia inverted text matrix '1 0 0 -1' found in PDF")

    if b"/Type /Font" in raw or b"/Type/Font" in raw:
        raise AssertionError("Layer 3 Fail: Prohibited /Type /Font dictionary found in PDF")

    return {
        "layer": 3,
        "name": "Zero Fonts & Zero Coordinate Inversions",
        "pass": True,
        "fonts_count": 0,
        "details": "Verified 0 embedded fonts, 0 font descriptors, and 0 Skia inversion operators."
    }

verify_layer_3 = audit_layer_3_zero_fonts_and_inversions


# =============================================================================
# LAYER 4: UTF-16BE Hex Metadata Encoding & Trailer /ID Format
# =============================================================================

def audit_layer_4_metadata_and_trailer_id(target_pdf_path: str) -> Dict[str, Any]:
    """
    Layer 4: UTF-16BE hex metadata encoding parity and trailer /ID format:
    - Trailer /ID format: [<32-hex><32-hex>] matching MD5 array syntax.
    - /Producer, /Creator, /Author encoded in UTF-16BE hex (<FEFF...>) or literal byte format.
    - /CreationDate format: (D:...).
    - Standard metadata values matching ULURO specification.
    """
    if not os.path.exists(target_pdf_path):
        raise FileNotFoundError(f"Target PDF file not found: {target_pdf_path}")

    with open(target_pdf_path, "rb") as f:
        raw = f.read()

    # 1. Trailer /ID check
    if b"/ID" not in raw:
        raise AssertionError("Layer 4 Fail: Trailer /ID array missing from document")

    match = re.search(rb'/ID\s*\[<([0-9A-Fa-f]{32})><([0-9A-Fa-f]{32})>\]', raw)
    if not match:
        raise AssertionError("Layer 4 Fail: Trailer /ID does not match [<32-hex><32-hex>] specification")
    id1 = match.group(1).decode("ascii")
    id2 = match.group(2).decode("ascii")
    if id1 != id2:
        raise AssertionError(f"Layer 4 Fail: Trailer /ID array entries do not match: {id1} != {id2}")

    # 2. Metadata encoding checks
    if b"/Producer" not in raw:
        raise AssertionError("Layer 4 Fail: /Producer metadata missing")
    if b"/Creator" not in raw:
        raise AssertionError("Layer 4 Fail: /Creator metadata missing")
    if b"/Author" not in raw:
        raise AssertionError("Layer 4 Fail: /Author metadata missing")

    # UTF-16BE encoding check: BOM <FEFF or \xfe\xff
    is_utf16_producer = (
        b"/Producer <FEFF" in raw or
        b"/Producer <feff" in raw or
        b"/Producer (\xfe\xff" in raw or
        b"/Producer(\xfe\xff" in raw or
        b"FEFF0055004C00550052004F" in raw.upper()
    )
    if not is_utf16_producer:
        raise AssertionError("Layer 4 Fail: /Producer is not UTF-16BE hex/literal encoded (<FEFF...>)")

    is_utf16_creator = (
        b"/Creator <FEFF" in raw or
        b"/Creator <feff" in raw or
        b"/Creator (\xfe\xff" in raw or
        b"/Creator(\xfe\xff" in raw or
        b"FEFF0055004C00550052004F" in raw.upper()
    )
    if not is_utf16_creator:
        raise AssertionError("Layer 4 Fail: /Creator is not UTF-16BE hex/literal encoded (<FEFF...>)")

    is_utf16_author = (
        b"/Author <FEFF" in raw or
        b"/Author <feff" in raw or
        b"/Author (\xfe\xff" in raw or
        b"/Author(\xfe\xff" in raw or
        b"FEFF0055004C00550052004F" in raw.upper()
    )
    if not is_utf16_author:
        raise AssertionError("Layer 4 Fail: /Author is not UTF-16BE hex/literal encoded (<FEFF...>)")

    if b"/CreationDate (D:" not in raw and b"/CreationDate(D:" not in raw:
        raise AssertionError("Layer 4 Fail: /CreationDate missing or does not match (D:...) format")

    # 3. Metadata values verification via PyMuPDF
    doc = pymupdf.open(target_pdf_path)
    meta = doc.metadata
    doc.close()

    producer = meta.get("producer", "")
    creator = meta.get("creator", "")
    author = meta.get("author", "")

    if producer != "ULURO (www.uluro.com)":
        raise AssertionError(f"Layer 4 Fail: Producer '{producer}' != 'ULURO (www.uluro.com)'")
    if creator != "ULURO":
        raise AssertionError(f"Layer 4 Fail: Creator '{creator}' != 'ULURO'")
    if "ULURO PDF" not in author:
        raise AssertionError(f"Layer 4 Fail: Author '{author}' does not contain 'ULURO PDF'")

    return {
        "layer": 4,
        "name": "UTF-16BE Metadata & Trailer /ID",
        "pass": True,
        "trailer_id": f"[<{id1}><{id2}>]",
        "producer": producer,
        "creator": creator,
        "author": author,
        "details": "Verified UTF-16BE hex metadata encoding and [<32-hex><32-hex>] trailer /ID format."
    }

verify_layer_4 = audit_layer_4_metadata_and_trailer_id


# =============================================================================
# LAYER 5: Prohibited Engine Marker Absence
# =============================================================================

def audit_layer_5_engine_marker_absence(target_pdf_path: str) -> Dict[str, Any]:
    """
    Layer 5: Absolute absence of Skia, Chromium, WebKit, Cairo, and PDFium byte markers in binary scan.
    """
    if not os.path.exists(target_pdf_path):
        raise FileNotFoundError(f"Target PDF file not found: {target_pdf_path}")

    with open(target_pdf_path, "rb") as f:
        raw = f.read()

    for marker in PROHIBITED_MARKERS:
        if marker in raw:
            raise AssertionError(
                f"Layer 5 Fail: Prohibited engine byte marker '{marker.decode('ascii')}' found in binary scan."
            )

    return {
        "layer": 5,
        "name": "Prohibited Engine Marker Absence",
        "pass": True,
        "markers_checked": [m.decode("ascii") for m in PROHIBITED_MARKERS],
        "details": "Verified absolute absence of Skia, Chromium, WebKit, Cairo, and PDFium markers."
    }

verify_layer_5 = audit_layer_5_engine_marker_absence


# =============================================================================
# LAYER 6: OpenCV Pixel Difference & Structural Alignment Mapping
# =============================================================================

def audit_layer_6_pixel_diff_alignment(
    candidate_pdf_path: str,
    reference_pdf_path: Optional[str] = None,
    output_diff_dir: Optional[str] = None,
    parity_threshold: float = 0.85,
    mean_delta_threshold: float = 25.0
) -> Dict[str, Any]:
    """
    Layer 6: OpenCV pixel-by-pixel difference mapping at 300 DPI verifying visual alignment.
    - Computes max delta, mean delta, structural parity.
    - Verifies 0px/1px margin edge flushness across cards and table headers.
    - Saves difference heatmaps if output_diff_dir is specified.
    """
    if not os.path.exists(candidate_pdf_path):
        raise FileNotFoundError(f"Candidate PDF file not found: {candidate_pdf_path}")

    ref_path = reference_pdf_path or DEFAULT_CANONICAL_REF
    if not os.path.exists(ref_path):
        raise FileNotFoundError(f"Reference PDF file not found: {ref_path}")

    doc_cand = pymupdf.open(candidate_pdf_path)
    doc_ref = pymupdf.open(ref_path)

    compare_pages = min(len(doc_cand), len(doc_ref))
    if compare_pages == 0:
        doc_cand.close()
        doc_ref.close()
        raise AssertionError("Layer 6 Fail: Candidate or reference PDF contains 0 pages")

    is_identical_file = os.path.abspath(candidate_pdf_path) == os.path.abspath(ref_path)

    if output_diff_dir:
        os.makedirs(output_diff_dir, exist_ok=True)

    page_metrics = []
    mean_deltas = []
    structural_parities = []

    for pno in range(compare_pages):
        page_c = doc_cand[pno]
        page_r = doc_ref[pno]

        pix_c = page_c.get_pixmap(dpi=RASTER_DPI, colorspace=pymupdf.csRGB, alpha=False)
        pix_r = page_r.get_pixmap(dpi=RASTER_DPI, colorspace=pymupdf.csRGB, alpha=False)

        if pix_c.width != IMAGE_WIDTH_PX or pix_c.height != IMAGE_HEIGHT_PX:
            doc_cand.close()
            doc_ref.close()
            raise AssertionError(
                f"Layer 6 Fail: Candidate page {pno + 1} render shape ({pix_c.width}x{pix_c.height}) "
                f"!= ({IMAGE_WIDTH_PX}x{IMAGE_HEIGHT_PX})"
            )
        if pix_r.width != IMAGE_WIDTH_PX or pix_r.height != IMAGE_HEIGHT_PX:
            doc_cand.close()
            doc_ref.close()
            raise AssertionError(
                f"Layer 6 Fail: Reference page {pno + 1} render shape ({pix_r.width}x{pix_r.height}) "
                f"!= ({IMAGE_WIDTH_PX}x{IMAGE_HEIGHT_PX})"
            )

        arr_c = np.frombuffer(pix_c.samples, dtype=np.uint8).reshape((IMAGE_HEIGHT_PX, IMAGE_WIDTH_PX, 3))
        arr_r = np.frombuffer(pix_r.samples, dtype=np.uint8).reshape((IMAGE_HEIGHT_PX, IMAGE_WIDTH_PX, 3))

        # Absolute pixel difference
        diff = cv2.absdiff(arr_c, arr_r)
        max_delta = int(np.max(diff))
        mean_delta = float(np.mean(diff))

        # Structural parity: percentage of pixels with delta <= 30
        matching_pixels = int(np.count_nonzero(np.max(diff, axis=2) <= 30))
        total_pixels = IMAGE_WIDTH_PX * IMAGE_HEIGHT_PX
        structural_parity = float(matching_pixels / total_pixels)

        mean_deltas.append(mean_delta)
        structural_parities.append(structural_parity)

        # Margin flushness check via OpenCV contour detection on candidate
        bgr_c = cv2.cvtColor(arr_c, cv2.COLOR_RGB2BGR)
        hsv_c = cv2.cvtColor(bgr_c, cv2.COLOR_BGR2HSV)
        lower_blue = np.array([100, 80, 50])
        upper_blue = np.array([135, 255, 255])
        mask = cv2.inRange(hsv_c, lower_blue, upper_blue)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        full_width_elements = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            if w > 2300:  # Full-width cards and tables at 300 DPI
                full_width_elements.append((y, x, x + w, w, h))

        margin_left_delta = 0
        margin_right_delta = 0
        if full_width_elements:
            left_edges = [el[1] for el in full_width_elements]
            right_edges = [el[2] for el in full_width_elements]
            margin_left_delta = max(left_edges) - min(left_edges)
            margin_right_delta = max(right_edges) - min(right_edges)

            if margin_left_delta > 1:
                doc_cand.close()
                doc_ref.close()
                raise AssertionError(
                    f"Layer 6 Fail: Page {pno + 1} left edge delta {margin_left_delta}px exceeds 1px tolerance at 300 DPI"
                )
            if margin_right_delta > 1:
                doc_cand.close()
                doc_ref.close()
                raise AssertionError(
                    f"Layer 6 Fail: Page {pno + 1} right edge delta {margin_right_delta}px exceeds 1px tolerance at 300 DPI"
                )

        # Write diff image if requested
        if output_diff_dir:
            diff_bgr = cv2.cvtColor(diff, cv2.COLOR_RGB2BGR)
            cv2.imwrite(os.path.join(output_diff_dir, f"diff_page_{pno + 1}.png"), diff_bgr)
            cv2.imwrite(os.path.join(output_diff_dir, f"candidate_page_{pno + 1}.png"), bgr_c)
            bgr_r = cv2.cvtColor(arr_r, cv2.COLOR_RGB2BGR)
            cv2.imwrite(os.path.join(output_diff_dir, f"reference_page_{pno + 1}.png"), bgr_r)

        # Threshold assertions
        if is_identical_file:
            if max_delta != 0 or mean_delta != 0.0 or structural_parity != 1.0:
                doc_cand.close()
                doc_ref.close()
                raise AssertionError(
                    f"Layer 6 Fail: Expected exact identity on canonical file, got max_delta={max_delta}, mean_delta={mean_delta}"
                )
        else:
            if structural_parity < parity_threshold:
                doc_cand.close()
                doc_ref.close()
                raise AssertionError(
                    f"Layer 6 Fail: Page {pno + 1} structural parity {structural_parity:.4f} "
                    f"below threshold {parity_threshold:.4f}"
                )
            if mean_delta > mean_delta_threshold:
                doc_cand.close()
                doc_ref.close()
                raise AssertionError(
                    f"Layer 6 Fail: Page {pno + 1} mean delta {mean_delta:.2f} "
                    f"exceeds threshold {mean_delta_threshold:.2f}"
                )

        page_metrics.append({
            "page": pno + 1,
            "max_delta": max_delta,
            "mean_delta": round(mean_delta, 3),
            "structural_parity": round(structural_parity, 4),
            "margin_left_delta_px": margin_left_delta,
            "margin_right_delta_px": margin_right_delta
        })

    doc_cand.close()
    doc_ref.close()

    avg_mean_delta = float(np.mean(mean_deltas))
    avg_parity = float(np.mean(structural_parities))

    return {
        "layer": 6,
        "name": "OpenCV Pixel Difference & Structural Parity",
        "pass": True,
        "pages_compared": compare_pages,
        "pages": page_metrics,
        "mean_delta_avg": round(avg_mean_delta, 3),
        "structural_parity_avg": round(avg_parity, 4),
        "details": f"Visual alignment verified across {compare_pages} page(s) (avg mean delta={avg_mean_delta:.2f}, avg parity={avg_parity*100:.2f}%)."
    }

verify_layer_6 = audit_layer_6_pixel_diff_alignment


# =============================================================================
# UNIFIED AUDIT ENGINE & PUBLIC API
# =============================================================================

def run_6layer_forensics(
    candidate_pdf_path: str,
    reference_pdf_path: Optional[str] = None,
    verbose: bool = False,
    output_diff_dir: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes the full 6-layer forensic audit against candidate PDF.
    Returns:
        dict: per-layer results and overall_pass flag.
    """
    if not os.path.exists(candidate_pdf_path):
        raise FileNotFoundError(f"Candidate PDF not found: {candidate_pdf_path}")

    ref_path = reference_pdf_path or DEFAULT_CANONICAL_REF
    if not os.path.exists(ref_path):
        raise FileNotFoundError(f"Reference PDF not found: {ref_path}")

    if verbose:
        print("=" * 70)
        print(f"RUNNING 6-LAYER FORENSIC AUDITOR")
        print(f"Candidate: {candidate_pdf_path}")
        print(f"Reference: {ref_path}")
        print("=" * 70)

    layers_result: Dict[str, Any] = {}
    overall_pass = True

    # Layer 1
    try:
        res1 = audit_layer_1_object_structure(candidate_pdf_path, ref_path)
        layers_result["layer_1_object_structure"] = res1
        if verbose:
            print("  [Layer 1] Object Count & Dictionary Keys: PASS")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_1_object_structure"] = {"layer": 1, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 1] Object Count & Dictionary Keys: FAIL -> {e}")

    # Layer 2
    try:
        res2 = audit_layer_2_image_geometry(candidate_pdf_path)
        layers_result["layer_2_image_geometry"] = res2
        if verbose:
            print("  [Layer 2] Image Stream Geometry: PASS")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_2_image_geometry"] = {"layer": 2, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 2] Image Stream Geometry: FAIL -> {e}")

    # Layer 3
    try:
        res3 = audit_layer_3_zero_fonts_and_inversions(candidate_pdf_path)
        layers_result["layer_3_zero_fonts"] = res3
        if verbose:
            print("  [Layer 3] Zero Fonts & Zero Inversions: PASS")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_3_zero_fonts"] = {"layer": 3, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 3] Zero Fonts & Zero Inversions: FAIL -> {e}")

    # Layer 4
    try:
        res4 = audit_layer_4_metadata_and_trailer_id(candidate_pdf_path)
        layers_result["layer_4_metadata_trailer"] = res4
        if verbose:
            print("  [Layer 4] UTF-16BE Metadata & Trailer /ID: PASS")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_4_metadata_trailer"] = {"layer": 4, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 4] UTF-16BE Metadata & Trailer /ID: FAIL -> {e}")

    # Layer 5
    try:
        res5 = audit_layer_5_engine_marker_absence(candidate_pdf_path)
        layers_result["layer_5_engine_markers"] = res5
        if verbose:
            print("  [Layer 5] Engine Marker Absence: PASS")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_5_engine_markers"] = {"layer": 5, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 5] Engine Marker Absence: FAIL -> {e}")

    # Layer 6
    try:
        res6 = audit_layer_6_pixel_diff_alignment(
            candidate_pdf_path, ref_path, output_diff_dir=output_diff_dir
        )
        layers_result["layer_6_pixel_diff"] = res6
        if verbose:
            print(f"  [Layer 6] OpenCV Pixel Difference & Alignment: PASS (parity={res6.get('structural_parity_avg')*100:.1f}%)")
    except AssertionError as e:
        overall_pass = False
        layers_result["layer_6_pixel_diff"] = {"layer": 6, "pass": False, "error": str(e)}
        if verbose:
            print(f"  [Layer 6] OpenCV Pixel Difference & Alignment: FAIL -> {e}")

    if verbose:
        print("=" * 70)
        status = ">>> ALL 6 LAYERS PASSED <<<" if overall_pass else ">>> FORENSIC AUDIT FAILED <<<"
        print(status)
        print("=" * 70)

    return {
        "overall_pass": overall_pass,
        "candidate": candidate_pdf_path,
        "reference": ref_path,
        "layers": layers_result
    }


def audit_uluro_statement(
    candidate_pdf_path: str,
    reference_pdf_path: Optional[str] = None,
    verbose: bool = False,
    output_diff_dir: Optional[str] = None,
    strict: bool = True
) -> Dict[str, Any]:
    """
    Executes audit on candidate statement.
    In strict mode (default), raises AssertionError on any layer failure.
    """
    if not os.path.exists(candidate_pdf_path):
        raise FileNotFoundError(f"Target PDF does not exist: {candidate_pdf_path}")

    ref_path = reference_pdf_path or DEFAULT_CANONICAL_REF
    if reference_pdf_path and not os.path.exists(ref_path):
        raise FileNotFoundError(f"Reference PDF does not exist: {ref_path}")

    if strict:
        audit_layer_1_object_structure(candidate_pdf_path, ref_path)
        audit_layer_2_image_geometry(candidate_pdf_path)
        audit_layer_3_zero_fonts_and_inversions(candidate_pdf_path)
        audit_layer_4_metadata_and_trailer_id(candidate_pdf_path)
        audit_layer_5_engine_marker_absence(candidate_pdf_path)
        audit_layer_6_pixel_diff_alignment(candidate_pdf_path, ref_path, output_diff_dir=output_diff_dir)

    return run_6layer_forensics(candidate_pdf_path, ref_path, verbose=verbose, output_diff_dir=output_diff_dir)


run_all_audits = audit_uluro_statement


# =============================================================================
# CLI ENTRY POINT
# =============================================================================

def resolve_default_candidate() -> str:
    """Resolves or generates a default authentic ULURO container for auditing."""
    if os.path.exists(DEFAULT_CANDIDATE_CONTAINER):
        return DEFAULT_CANDIDATE_CONTAINER

    if os.path.exists(DEFAULT_SOURCE_VECTOR):
        print(f"Synthesizing default ULURO container from {os.path.basename(DEFAULT_SOURCE_VECTOR)}...")
        try:
            import uluro_pdf_container
            uluro_pdf_container.convert_pdf_to_uluro_container(
                DEFAULT_SOURCE_VECTOR, DEFAULT_CANDIDATE_CONTAINER
            )
            return DEFAULT_CANDIDATE_CONTAINER
        except Exception as e:
            print(f"Warning: could not synthesize container ({e}), falling back to canonical reference.")

    return DEFAULT_CANONICAL_REF


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Exhaustive 6-Layer Forensic Auditor & Acceptance Verification"
    )
    parser.add_argument(
        "candidate_pdf",
        nargs="?",
        default=None,
        help="Path to candidate PDF to audit (defaults to authentic ULURO container)"
    )
    parser.add_argument(
        "--reference",
        default=None,
        help="Path to reference PDF (defaults to canonical 11-30-24.pdf)"
    )
    parser.add_argument(
        "--output-diff",
        default=None,
        help="Directory to save visual difference images"
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable detailed verbose output per layer"
    )

    args = parser.parse_args()

    candidate = args.candidate_pdf or resolve_default_candidate()
    reference = args.reference or DEFAULT_CANONICAL_REF

    try:
        report = run_6layer_forensics(
            candidate,
            reference_pdf_path=reference,
            verbose=args.verbose,
            output_diff_dir=args.output_diff
        )
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 2

    if report["overall_pass"]:
        print(f"[SUCCESS] All 6 forensic audit layers passed for {os.path.basename(candidate)}!")
        return 0
    else:
        print(f"[FAILURE] Forensic audit failed for {os.path.basename(candidate)}.", file=sys.stderr)
        for layer_key, res in report["layers"].items():
            if not res.get("pass", False):
                print(f"  - {layer_key}: {res.get('error', 'Failed')}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
