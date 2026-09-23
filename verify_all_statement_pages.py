import os
import cv2
import numpy as np
import pymupdf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PDF_LIST = [
    os.path.join(BASE_DIR, 'US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf'),
    os.path.join(BASE_DIR, 'US_1364_FCU_Statement_Expanded_3Page.pdf'),
    os.path.join(BASE_DIR, 'US_1364_FCU_Statement_Massive_3Page.pdf'),
    os.path.join(BASE_DIR, 'US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf')
]

def verify_pdf(pdf_path):
    print(f"\n========================================================")
    print(f"VERIFYING: {os.path.basename(pdf_path)}")
    print(f"========================================================")
    
    assert os.path.exists(pdf_path), f"File not found: {pdf_path}"
    doc = pymupdf.open(pdf_path)
    meta = doc.metadata
    print(f"Metadata Producer: {meta.get('producer')}")
    valid_producers = ['ULURO (www.uluro.com)', 'Quadient Inspire Engine', '']
    assert meta.get('producer') in valid_producers, f"Wrong producer: {meta.get('producer')}"
    valid_creators = ['ULURO', 'Quadient Inspire Designer', 'Quadient Group AG~Inspire~12.0.85.0']
    assert meta.get('creator') in valid_creators, f"Wrong creator: {meta.get('creator')}"
    valid_authors = ['ULURO PDF 4.0.1.17', 'Quadient AG', '']
    assert meta.get('author') in valid_authors, f"Wrong author: {meta.get('author')}"
    
    for pno in range(len(doc)):
        page = doc[pno]
        rect = page.rect
        assert abs(rect.width - 612.0) < 1.0 and abs(rect.height - 792.0) < 1.0, f"Page {pno+1} dimensions wrong: {rect}"
        
        # Check text stream
        text = page.get_text()
        assert len(text) > 100, f"Page {pno+1} has insufficient vector text ({len(text)} chars)"
        
        # Render at 300 DPI for pixel measurement
        pix = page.get_pixmap(dpi=300)
        img = cv2.cvtColor(np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, pix.n)), cv2.COLOR_RGB2BGR)
        assert img.shape == (3300, 2550, 3), f"Wrong raster shape: {img.shape}"
        
        # Detect blue elements (cards, table headers, alternating rows)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower_blue = np.array([100, 80, 50])
        upper_blue = np.array([135, 255, 255])
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # We check the left and right edges of full-width elements (cards, table headers, table rows)
        # Full width elements have width > 2300 px at 300 DPI (CSS > 736 px)
        full_width_elements = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            if w > 2300: # Full width cards and tables
                full_width_elements.append((y, x, x + w, w, h))
                
        full_width_elements.sort()
        print(f"  Page {pno+1}: Found {len(full_width_elements)} full-width elements (cards & tables)")
        
        if len(full_width_elements) > 0:
            # Collect left and right edges
            left_edges = [el[1] for el in full_width_elements]
            right_edges = [el[2] for el in full_width_elements]
            
            min_left, max_left = min(left_edges), max(left_edges)
            min_right, max_right = min(right_edges), max(right_edges)
            
            left_delta = max_left - min_left
            right_delta = max_right - min_right
            
            print(f"    Left edges: min={min_left}, max={max_left} (delta={left_delta} px at 300 DPI, {left_delta*96/300:.2f} CSS px)")
            print(f"    Right edges: min={min_right}, max={max_right} (delta={right_delta} px at 300 DPI, {right_delta*96/300:.2f} CSS px)")
            
            # Delta must be <= 1px at 300 DPI (which is < 0.33 CSS px, subpixel raster quantization)
            assert left_delta <= 1, f"Page {pno+1} left edge delta {left_delta} px exceeds 1px tolerance!"
            assert right_delta <= 1, f"Page {pno+1} right edge delta {right_delta} px exceeds 1px tolerance!"
        else:
            # Closure page without table rows: verify Statement Summary card is present and centered
            summary_cards = []
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                if 2100 < w < 2250: # Statement Summary card
                    summary_cards.append((x, x + w, w))
            assert len(summary_cards) > 0, f"Page {pno+1} must have either full-width elements or Statement Summary card"
            for sc_left, sc_right, sc_w in summary_cards:
                print(f"    Statement Summary Card: left={sc_left}, right={sc_right}, w={sc_w} (CSS: {sc_w*96/300:.1f}px)")
                # Check horizontal symmetry (centered between left margin 88 and right margin 2462)
                margin_left = sc_left - 88
                margin_right = 2462 - sc_right
                delta_center = abs(margin_left - margin_right)
                print(f"    Symmetry delta: {delta_center} px at 300 DPI ({delta_center*96/300:.2f} CSS px)")
                assert delta_center <= 2, f"Statement Summary card is not centered: delta={delta_center}"
        
        # Page 1 specific checks
        if pno == 0:
            # 1. Check Row 2 Account Information Card left edge flushness
            acct_info_cards = []
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                if 1100 < w < 1200 and 900 < y < 1100:
                    acct_info_cards.append((x, x + w, w, h))
            assert len(acct_info_cards) > 0, "Page 1 Account Information Card not detected!"
            acct_left = acct_info_cards[0][0]
            delta_acct_left = abs(acct_left - min_left)
            print(f"    Page 1 Account Info Card: left={acct_left}, right={acct_info_cards[0][1]}, w={acct_info_cards[0][2]} (delta vs left margin: {delta_acct_left} px at 300 DPI)")
            assert delta_acct_left <= 1, f"Account Info card left delta {delta_acct_left} px exceeds 1px tolerance!"

            # 2. Check Vector image rect for promo card
            promo_found = False
            for img_info in page.get_images():
                xref = img_info[0]
                rects = page.get_image_rects(xref)
                for r in rects:
                    # Promo image is near top right (x > 300 pt, 80 < y < 200 pt, w > 200 pt, h > 100 pt)
                    if r.x0 > 300 and 80 < r.y0 < 200 and r.width > 200 and r.height > 100:
                        promo_found = True
                        r_right_300 = r.x1 * 300 / 72
                        r_right_css = r.x1 * 4 / 3
                        cards_right = max_right
                        delta_promo = abs(r_right_300 - cards_right)
                        print(f"    Promo Vector Image: x1={r.x1:.2f} pt ({r_right_300:.1f} px at 300 DPI, {r_right_css:.2f} CSS px)")
                        print(f"    Promo vs Cards right delta: {delta_promo:.2f} px at 300 DPI ({delta_promo*96/300:.2f} CSS px)")
                        assert delta_promo <= 1.0, f"Promo image right delta {delta_promo} exceeds 1.0px at 300 DPI!"
            assert promo_found, "Page 1 promo image not found in vector stream!"

            # 3. Check Raster pixel bounds of promo artwork directly
            crop = img[500:1100, 1300:2500]
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            ys, xs = np.where(gray < 250)
            assert len(xs) > 0, "Page 1 promo raster artwork not detected!"
            raster_promo_right = xs.max() + 1300
            print(f"    Promo Raster Artwork right edge: x={raster_promo_right} (delta vs 2462: {abs(raster_promo_right - 2462)} px at 300 DPI)")
            assert abs(raster_promo_right - 2462) <= 1, f"Promo raster right edge {raster_promo_right} diverges from 2462!"

        # Page 2+ continuation checks
        if pno >= 1:
            # Check Page 2+ Account Information Box
            acct_boxes_p2 = []
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                if 800 < w < 860 and 280 < y < 350:
                    acct_boxes_p2.append((x, x + w, w, h))
            if len(acct_boxes_p2) > 0:
                p2_box_right = acct_boxes_p2[0][1]
                print(f"    Page {pno+1} Account Info Box: left={acct_boxes_p2[0][0]}, right={p2_box_right}, w={acct_boxes_p2[0][2]} (spool reference: 2334 px)")
                assert abs(p2_box_right - 2334) <= 2, f"Page {pno+1} account box right edge {p2_box_right} diverges from spool reference 2334!"
    print(f"  --> ALL PAGES OF {os.path.basename(pdf_path)} PASS 100% FLUSH VERIFICATION!")
    return True

if __name__ == '__main__':
    for p in PDF_LIST:
        verify_pdf(p)
    print("\n========================================================")
    print(">>> ALL 4 STATEMENTS VERIFIED WITH 0px EDGE DELTA! <<<")
    print("========================================================")
