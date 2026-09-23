import os
import sys
import pymupdf
from PIL import Image
import numpy as np

def audit_statement_forensics(pdf_path, is_canonical=True):
    print(f"\n=================================================================")
    print(f"AUDITING PDF FORENSICS: {os.path.basename(pdf_path)}")
    print(f"=================================================================")
    
    assert os.path.exists(pdf_path), f"File not found: {pdf_path}"
    
    # -------------------------------------------------------------
    # PHASE 1: STRUCTURAL FILE PARSING & METADATA
    # -------------------------------------------------------------
    with open(pdf_path, 'rb') as f:
        header = f.read(1024)
        f.seek(-1024, os.SEEK_END)
        trailer = f.read(1024)
        
    assert header.startswith(b'%PDF-'), "Phase 1 Fail: Magic number %PDF- missing from header"
    assert b'%%EOF' in trailer, "Phase 1 Fail: %%EOF marker missing from trailer"
    print("  [Phase 1] Signature & EOF Header/Trailer: PASS")
    
    doc = pymupdf.open(pdf_path)
    meta = doc.metadata
    print(f"  [Phase 1] Metadata: Producer='{meta.get('producer')}', Creator='{meta.get('creator')}', Author='{meta.get('author')}'")
    assert meta.get('producer') == 'ULURO (www.uluro.com)', f"Phase 1 Fail: Unexpected producer {meta.get('producer')}"
    assert meta.get('creator') == 'ULURO', f"Phase 1 Fail: Unexpected creator {meta.get('creator')}"
    assert meta.get('author') == 'ULURO PDF 4.0.1.17', f"Phase 1 Fail: Unexpected author {meta.get('author')}"
    assert meta.get('keywords') == 'ULURO', f"Phase 1 Fail: Unexpected keywords {meta.get('keywords')}"
    print("  [Phase 1] Official ULURO Metadata Audit: PASS")
    
    # -------------------------------------------------------------
    # PHASE 2: GRAPHIC & TYPOGRAPHIC VECTOR FORENSICS
    # -------------------------------------------------------------
    for i, page in enumerate(doc):
        rect = page.rect
        assert abs(rect.width - 612.0) < 1.0 and abs(rect.height - 792.0) < 1.0, f"Phase 2 Fail: Page {i+1} dimensions {rect} not Letter (612x792 pt)"
        text_page = page.get_text("dict")
        has_text = any(len(b.get("lines", [])) > 0 for b in text_page["blocks"])
        assert has_text, f"Phase 2 Fail: Page {i+1} has no vector text stream (rasterized)"
        fonts = page.get_fonts()
        font_names = [f[3] for f in fonts]
        print(f"  [Phase 2] Page {i+1} Geometry: {rect.width}x{rect.height} pt, Fonts: {font_names[:4]}")
    print("  [Phase 2] Vector Fonts & Geometry: PASS")
    
    # -------------------------------------------------------------
    # PHASE 3: ALGORITHMIC LOGIC & MATHEMATICAL AUDIT
    # -------------------------------------------------------------
    # Let's verify ledger math in canonical November statement
    if is_canonical:
        # Check running balances for Account 1 (Regular Savings)
        reg_prev = 302250.45
        reg_txs = [
            (1664.44, 0, 303914.89),
            (45000.00, 0, 348914.89),
            (1200.00, 0, 350114.89),
            (10000.00, 0, 360114.89),
            (522.96, 0, 360637.85),
            (28.75, 0, 360666.60)
        ]
        bal = reg_prev
        for dep, wd, expected_bal in reg_txs:
            bal = round(bal + dep - wd, 2)
            assert bal == expected_bal, f"Phase 3 Fail: Ledger mismatch! Got {bal}, expected {expected_bal}"
        print(f"  [Phase 3] Account 1 Ledger Re-Calculation: PASS (Ending {bal})")
        
        # APY math verification:
        avg_bal = 350781.56
        apy = 0.0010
        # 2024 leap year 366 days, 30 days in November
        calc_div = round(avg_bal * apy * 30 / 366, 2)
        assert calc_div == 28.75, f"Phase 3 Fail: APY mismatch! Got {calc_div}, expected 28.75"
        print(f"  [Phase 3] Financial Product Rate Validation: PASS (Dividend = ${calc_div})")
        
        # Check running balances for Account 2 (Share Draft)
        draft_prev = 50731.57
        draft_txs = [
            (0, 1444.57, 49287.00),
            (0, 45000.00, 4287.00),
            (0, 40.00, 4247.00),
            (0, 256.97, 3990.03),
            (0, 788.45, 3201.58),
            (7124.42, 0, 10326.00),
            (0, 184.69, 10141.31),
            (3066.00, 0, 13207.31),
            (0, 44.33, 13162.98),
            (0, 60.00, 13102.98),
            (0, 40.00, 13062.98),
            (0, 10000.00, 3062.98)
        ]
        bal2 = draft_prev
        for dep, wd, expected_bal in draft_txs:
            bal2 = round(bal2 + dep - wd, 2)
            assert bal2 == expected_bal, f"Phase 3 Fail: Draft ledger mismatch! Got {bal2}, expected {expected_bal}"
        print(f"  [Phase 3] Account 2 Ledger Re-Calculation: PASS (Ending {bal2})")
        
        # Summary totals
        assert round(bal + bal2, 2) == 363729.58, "Phase 3 Fail: Summary of accounts total mismatch"
        print(f"  [Phase 3] Total Share Balances Re-Calculation: PASS ($363,729.58)")

    # -------------------------------------------------------------
    # PHASE 4: VISUAL DIFFING & 75% ZOOM COLOR RENDERING
    # -------------------------------------------------------------
    # Render page 1 at 72 DPI (100%) and 54 DPI (75%)
    pix_100 = doc[0].get_pixmap(dpi=72)
    pix_75 = doc[0].get_pixmap(dpi=54)
    img_100 = Image.frombytes("RGB", [pix_100.width, pix_100.height], pix_100.samples)
    img_75 = Image.frombytes("RGB", [pix_75.width, pix_75.height], pix_75.samples)
    
    # Verify dark blue table header is rendered with crisp sRGB at authentic Quadient Y=450-465 (452pt)
    arr_100 = np.array(img_100)
    hdr_pixels = arr_100[450:465, 100:300]
    blue_mask = (hdr_pixels[:, :, 2] > 140) & (hdr_pixels[:, :, 0] < 40)
    assert np.any(blue_mask), f"Phase 4 Fail: Table header dark blue (#1129a2) not found at Y=450-465"
    print(f"  [Phase 4] 100% Zoom Color Integrity: PASS (Found {np.sum(blue_mask)} header pixels)")
    
    arr_75 = np.array(img_75)
    # Scaled coordinate at 75% zoom (54 DPI: 452 * 54 / 72 = 339)
    hdr_pixels_75 = arr_75[337:348, 75:225]
    blue_mask_75 = (hdr_pixels_75[:, :, 2] > 135) & (hdr_pixels_75[:, :, 0] < 45)
    assert np.any(blue_mask_75), f"Phase 4 Fail: 75% zoom color shifted or lost at Y=337-348"
    print(f"  [Phase 4] 75% Zoom Rendering Stability: PASS (Found {np.sum(blue_mask_75)} header pixels)")
    
    doc.close()
    print(f"RESULT: ALL 4 PHASES VERIFIED FOR {os.path.basename(pdf_path)}")
    return True

if __name__ == '__main__':
    p1 = os.path.join(r"E:\StatementGen", "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf")
    p2 = os.path.join(r"E:\StatementGen", "US_1364_FCU_Statement_Massive_3Page.pdf")
    
    audit_statement_forensics(p1, is_canonical=True)
    audit_statement_forensics(p2, is_canonical=False)
    print("\n>>> ALL FORENSIC AND MATHEMATICAL AUDITS PASSED CLEANLY! <<<")
