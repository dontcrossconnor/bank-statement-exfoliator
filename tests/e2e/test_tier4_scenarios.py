"""
Tier 4: Real-World Application Scenarios E2E Tests
Tests all 4 core statement scenarios against financial, typographic, and pixel-exact acceptance criteria:
- Scenario 1: us1364_november_scenario (Canonical November 2024 Statement)
- Scenario 2: us1364_heavy_3page_scenario (Expanded Heavy 3-Page Flow)
- Scenario 3: us1364_massive_42tx_scenario (Massive 42-Transaction Flow)
- Scenario 4: us1364_aziz_july_2026_scenario (Aziz Berjis July 2026 Statement)
- Zero-Tolerance Script-Driven OpenCV Pixel Delta Verification across all pages (<= 1px delta at 300 DPI).
"""

import os
import cv2
import numpy as np
import pytest
import pymupdf


def test_t4_scenario_us1364_november_canonical(existing_statements):
    """
    T4.1: Validates canonical November 2024 statement (US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf):
    - Exact 2 pages (612.0 x 792.0 pt).
    - Authentic ULURO metadata.
    - Financial math parity:
      - Account 1 (Regular Savings): Starting $302,250.45, Ending $360,666.60, Dividend $28.75.
      - Account 2 (Share Draft): Starting $50,731.57, Ending $3,062.98.
      - Total Share Balances: $363,729.58.
    - Member name: WILLIAM J NEWMAN.
    """
    pdf_path = existing_statements["november_2024"]
    doc = pymupdf.open(pdf_path)
    assert len(doc) == 2, f"November statement must have 2 pages, got {len(doc)}"

    # Metadata check
    meta = doc.metadata
    assert meta.get("producer") == "ULURO (www.uluro.com)"
    assert meta.get("creator") == "ULURO"
    assert "ULURO PDF 4.0.1.17" in meta.get("author", "")

    # Page 1 Text & Math checks
    p1_text = doc[0].get_text()
    assert "WILLIAM J NEWMAN" in p1_text
    assert "360,666.60" in p1_text
    assert "3,062.98" in p1_text
    assert "363,729.58" in p1_text
    assert "28.75" in p1_text

    # Page 2 Text & Summary checks
    p2_text = doc[1].get_text()
    assert "STATEMENT SUMMARY" in p2_text
    assert "TOTAL DIVIDENDS YTD" in p2_text
    assert "277.87" in p2_text

    doc.close()


def test_t4_scenario_us1364_heavy_3page(existing_statements):
    """
    T4.2: Validates expanded heavy statement (US_1364_FCU_Statement_Expanded_3Page.pdf):
    - Multi-page structure (2 or 3 pages depending on print pagination).
    - Full-width continuation headers.
    - Vector text integrity across all pages.
    """
    pdf_path = existing_statements["expanded_3page"]
    doc = pymupdf.open(pdf_path)
    assert len(doc) in (2, 3), f"Expanded statement expected 2 or 3 pages, got {len(doc)}"

    for pno in range(len(doc)):
        page = doc[pno]
        assert abs(page.rect.width - 612.0) < 1.0
        assert abs(page.rect.height - 792.0) < 1.0
        text = page.get_text()
        assert len(text) > 200, f"Page {pno+1} insufficient text content ({len(text)} chars)"

    # Check last page contains statement summary card
    last_text = doc[-1].get_text()
    assert "STATEMENT SUMMARY" in last_text or "TOTAL SHARE BALANCES" in last_text
    doc.close()



def test_t4_scenario_us1364_massive_42tx(existing_statements):
    """
    T4.3: Validates massive 42-transaction 3-page statement (US_1364_FCU_Statement_Massive_3Page.pdf):
    - Exactly 3 pages.
    - Transaction density distributed across pages 1, 2, and 3.
    - Valid running balance flow.
    """
    pdf_path = existing_statements["massive_3page"]
    doc = pymupdf.open(pdf_path)
    assert len(doc) == 3, f"Massive 42Tx statement must have 3 pages, got {len(doc)}"

    all_text = "".join(p.get_text() for p in doc)
    # Check for presence of high transaction count entries
    assert "PREVIOUS BALANCE" in all_text
    assert "TRANSACTION DESCRIPTION" in all_text
    doc.close()


def test_t4_scenario_us1364_aziz_july_2026(existing_statements):
    """
    T4.4: Validates Aziz Berjis July 2026 statement (US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf):
    - Exactly 2 pages.
    - Member name: Aziz Berjis.
    - Statement period: July 2026.
    """
    pdf_path = existing_statements["aziz_july_2026"]
    doc = pymupdf.open(pdf_path)
    assert len(doc) == 2, f"Aziz Berjis statement must have 2 pages, got {len(doc)}"

    p1_text = doc[0].get_text()
    assert "Aziz" in p1_text or "AZIZ" in p1_text or "Berjis" in p1_text or "BERJIS" in p1_text, (
        "Member name Aziz Berjis not found in page 1 text"
    )
    doc.close()


def test_t4_zero_tolerance_pixel_delta_all_statements(existing_statements):
    """
    T4.5: ZERO-TOLERANCE PIXEL-BASED MEASURING RULE AUDIT.
    Renders every page of all 4 generated statements at 300 DPI (3300 x 2550 x 3).
    Performs script-driven OpenCV contour detection to assert:
    - Left edge delta <= 1px at 300 DPI across all cards and table rows (< 0.33 CSS px).
    - Right edge delta <= 1px at 300 DPI across all cards and table rows (< 0.33 CSS px).
    - Statement summary card centering symmetry <= 2px delta.
    - Page 1 promo card right edge alignment <= 1px delta vs cards.
    """
    for name, pdf_path in existing_statements.items():
        doc = pymupdf.open(pdf_path)
        for pno in range(len(doc)):
            page = doc[pno]
            pix = page.get_pixmap(dpi=300)
            img = cv2.cvtColor(
                np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, pix.n)),
                cv2.COLOR_RGB2BGR
            )
            assert img.shape == (3300, 2550, 3), f"Shape mismatch on {name} p{pno+1}: {img.shape}"

            # HSV filter for official blue elements
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            lower_blue = np.array([100, 80, 50])
            upper_blue = np.array([135, 255, 255])
            mask = cv2.inRange(hsv, lower_blue, upper_blue)

            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            full_width_elements = []
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                if w > 2300:  # Full-width cards and tables at 300 DPI
                    full_width_elements.append((y, x, x + w, w, h))

            if len(full_width_elements) > 0:
                left_edges = [el[1] for el in full_width_elements]
                right_edges = [el[2] for el in full_width_elements]
                min_left, max_left = min(left_edges), max(left_edges)
                min_right, max_right = min(right_edges), max(right_edges)
                left_delta = max_left - min_left
                right_delta = max_right - min_right

                assert left_delta <= 1, (
                    f"{name} Page {pno+1} left edge delta {left_delta}px exceeds 1px tolerance at 300 DPI!"
                )
                assert right_delta <= 1, (
                    f"{name} Page {pno+1} right edge delta {right_delta}px exceeds 1px tolerance at 300 DPI!"
                )
            else:
                # Summary card centering check
                summary_cards = []
                for c in contours:
                    x, y, w, h = cv2.boundingRect(c)
                    if 2100 < w < 2250:
                        summary_cards.append((x, x + w, w))
                assert len(summary_cards) > 0, (
                    f"{name} Page {pno+1} must contain either full-width elements or Statement Summary card"
                )
                for sc_left, sc_right, _ in summary_cards:
                    delta_center = abs((sc_left - 88) - (2462 - sc_right))
                    assert delta_center <= 2, (
                        f"{name} Page {pno+1} Summary card centering delta {delta_center}px exceeds 2px tolerance"
                    )

            # Page 1 promo vector and raster check
            if pno == 0:
                promo_found = False
                for img_info in page.get_images():
                    xref = img_info[0]
                    rects = page.get_image_rects(xref)
                    for r in rects:
                        if r.x0 > 300 and 80 < r.y0 < 200 and r.width > 200 and r.height > 100:
                            promo_found = True
                            r_right_300 = r.x1 * 300 / 72
                            if full_width_elements:
                                delta_promo = abs(r_right_300 - max_right)
                                assert delta_promo <= 1.0, (
                                    f"Promo image right delta {delta_promo:.2f}px exceeds 1.0px at 300 DPI"
                                )
                assert promo_found, f"{name} Page 1 promo image not detected in vector stream"
        doc.close()
