import os
import pymupdf
import numpy as np
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Paths
REF_PDF_PATH = os.environ.get('US_FCU_REF_PDF', r'H:\USFCU\usfederalcu\Target\William Newman - LENDINGCLUB ROBERTSHARPE\statements\11-30-24.pdf')
PROMO_PATH = os.path.join(BASE_DIR, 'src', 'assets', 'us_fed_youth_promo_authentic.png')
CLEAN_BG_PATH = os.path.join(BASE_DIR, 'src', 'assets', 'crop_name_Mitchell.png')

JULY_PDF_OUT = os.path.join(BASE_DIR, 'US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf')
AUGUST_PDF_OUT = os.path.join(BASE_DIR, 'US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf')

# 2. Fonts
FONT_REGULAR = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 33)
FONT_BOLD_INFO = ImageFont.truetype('C:/Windows/Fonts/HelveticaWorld-Bold.ttf', 47)
FONT_BOLD_HDR = ImageFont.truetype('C:/Windows/Fonts/HelveticaWorld-Bold.ttf', 45)

# Colors
COLOR_WHITE = (255, 255, 255)
COLOR_ALT_BLUE = (173, 203, 255)  # #ADCBFF
COLOR_BLACK = (0, 0, 0)

# Customer Info
NAME = 'AZIZ BERJIS'
ADDR_LINES = [
    'AZIZ BERJIS',
    '15729  SUTTON ST',
    'ENCINO, CA 91436-3406'
]

def generate_statement(month_name, start_date_str, end_date_str, ending_date_short, month_prefix, next_month_prefix, creation_date, output_path):
    print(f'=== Generating Statement: {month_name} 2026 ===')
    doc = pymupdf.open(REF_PDF_PATH)
    
    # Extract raw 2550 x 3300 DeviceRGB rasters
    raw_p0 = bytearray(doc.xref_stream(1))
    raw_p1 = bytearray(doc.xref_stream(6))
    
    img0 = Image.frombytes('RGB', (2550, 3300), bytes(raw_p0))
    img1 = Image.frombytes('RGB', (2550, 3300), bytes(raw_p1))
    
    draw0 = ImageDraw.Draw(img0)
    draw1 = ImageDraw.Draw(img1)
    
    # ================= PAGE 0 MODIFICATIONS =================
    
    # 1. Paste authentic Youth Savings Promo card
    youth_promo = Image.open(PROMO_PATH)
    img0.paste(youth_promo, (1357, 425))
    
    # 2. Member Address Box
    # Clear Newman address (exact baseline alignment)
    draw0.rectangle([280, 620, 950, 755], fill=COLOR_WHITE)
    draw0.text((301, 659), ADDR_LINES[0], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    draw0.text((301, 698), ADDR_LINES[1], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    draw0.text((301, 736), ADDR_LINES[2], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # 3. Account Information Box (Ending Date)
    # Right-aligned at X=1202, Base=1103
    draw0.rectangle([1040, 1060, 1220, 1110], fill=COLOR_WHITE)
    draw0.text((1202, 1103), ending_date_short, fill=COLOR_BLACK, font=FONT_BOLD_INFO, anchor='rs')
    
    # 4. Regular Savings Table Header (07-01-26 THRU 07-31-26)
    # Base=1875, Left=1692
    draw0.rectangle([1680, 1835, 2220, 1878], fill=COLOR_WHITE)
    hdr_date_str = f'{start_date_str} THRU {end_date_str}'
    draw0.text((1692, 1875), hdr_date_str, fill=COLOR_BLACK, font=FONT_BOLD_HDR, anchor='ls')
    
    # 5. Regular Savings Transactions (dates in col 1)
    # Row 1: Left=139, Base=2006 (blue)
    draw0.rectangle([135, 1980, 220, 2010], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2006), f'{month_prefix}/01', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 2: Left=139, Base=2096 (white)
    draw0.rectangle([135, 2070, 220, 2100], fill=COLOR_WHITE)
    draw0.text((139, 2096), f'{month_prefix}/01', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 3: Left=139, Base=2141 (blue)
    draw0.rectangle([135, 2115, 225, 2145], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2141), f'{month_prefix}/26', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 4: Left=139, Base=2186 (white)
    draw0.rectangle([135, 2160, 225, 2190], fill=COLOR_WHITE)
    draw0.text((139, 2186), f'{month_prefix}/26', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 5: Left=139, Base=2231 (blue)
    draw0.rectangle([135, 2205, 245, 2235], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2231), f'{next_month_prefix}/02E', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 6: Left=139, Base=2276 (white)
    draw0.rectangle([135, 2250, 225, 2280], fill=COLOR_WHITE)
    draw0.text((139, 2276), f'{month_prefix}/31', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # 6. Regular Savings APY text line
    # Left=1042, Base=2321
    draw0.rectangle([1040, 2295, 1420, 2325], fill=COLOR_WHITE)
    draw0.text((1042, 2321), hdr_date_str, fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # 7. Share Draft Table Header (07-01-26 THRU 07-31-26)
    # Base=2490, Left=1692
    draw0.rectangle([1680, 2455, 2220, 2495], fill=COLOR_WHITE)
    draw0.text((1692, 2490), hdr_date_str, fill=COLOR_BLACK, font=FONT_BOLD_HDR, anchor='ls')
    
    # 8. Share Draft Transactions (Page 0)
    # Row 1: Left=139, Base=2628 (blue)
    draw0.rectangle([135, 2602, 220, 2632], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2628), f'{month_prefix}/01', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 1 embedded date: Left=1159, Base=2628 (blue)
    draw0.rectangle([1155, 2602, 1270, 2632], fill=COLOR_ALT_BLUE)
    draw0.text((1159, 2628), f'26{month_prefix}01', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 2: Left=139, Base=2673 (white)
    draw0.rectangle([135, 2647, 220, 2677], fill=COLOR_WHITE)
    draw0.text((139, 2673), f'{month_prefix}/01', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 3: Left=139, Base=2718 (blue)
    draw0.rectangle([135, 2692, 225, 2722], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2718), f'{month_prefix}/05', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 3 embedded timestamp: Left=282, Base=2763 (blue)
    draw0.rectangle([278, 2737, 355, 2767], fill=COLOR_ALT_BLUE)
    draw0.text((282, 2763), f'{month_prefix}05', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 4: Left=139, Base=2808 (white)
    draw0.rectangle([135, 2782, 225, 2812], fill=COLOR_WHITE)
    draw0.text((139, 2808), f'{month_prefix}/13', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 4 embedded date: Left=1113, Base=2808 (white)
    draw0.rectangle([1110, 2782, 1225, 2812], fill=COLOR_WHITE)
    draw0.text((1113, 2808), f'{month_prefix}1326', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 5: Left=139, Base=2853 (blue)
    draw0.rectangle([135, 2827, 225, 2857], fill=COLOR_ALT_BLUE)
    draw0.text((139, 2853), f'{month_prefix}/13', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 5 embedded date: Left=922, Base=2853 (blue)
    draw0.rectangle([918, 2827, 1030, 2857], fill=COLOR_ALT_BLUE)
    draw0.text((922, 2853), f'26{month_prefix}11', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    
    # ================= PAGE 1 MODIFICATIONS =================
    
    # 1. Account Information Box (Ending Date)
    # Right-aligned at X=2301, Base=441
    draw1.rectangle([2145, 415, 2315, 445], fill=COLOR_WHITE)
    draw1.text((2301, 441), ending_date_short, fill=COLOR_BLACK, font=FONT_REGULAR, anchor='rs')
    
    # 2. Member Address Box
    draw1.rectangle([280, 620, 950, 755], fill=COLOR_WHITE)
    draw1.text((301, 659), ADDR_LINES[0], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    draw1.text((301, 698), ADDR_LINES[1], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    draw1.text((301, 736), ADDR_LINES[2], fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # 3. Share Draft continuation transactions (Page 1)
    # Row 1: Left=124, Base=1058 (blue)
    draw1.rectangle([120, 1032, 210, 1062], fill=COLOR_ALT_BLUE)
    draw1.text((124, 1058), f'{month_prefix}/14', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 2: Left=124, Base=1148 (white)
    draw1.rectangle([120, 1122, 210, 1152], fill=COLOR_WHITE)
    draw1.text((124, 1148), f'{month_prefix}/18', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 2 embedded date: Left=961, Base=1148 (white)
    draw1.rectangle([957, 1122, 1075, 1152], fill=COLOR_WHITE)
    draw1.text((961, 1148), f'26{month_prefix}17', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 3: Left=124, Base=1193 (blue)
    draw1.rectangle([120, 1167, 235, 1197], fill=COLOR_ALT_BLUE)
    draw1.text((124, 1193), f'{month_prefix}/20E', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 3 embedded date: Left=1068, Base=1193 (blue)
    draw1.rectangle([1064, 1167, 1180, 1197], fill=COLOR_ALT_BLUE)
    draw1.text((1068, 1193), f'{month_prefix}2026', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 4: Left=124, Base=1238 (white)
    draw1.rectangle([120, 1212, 210, 1242], fill=COLOR_WHITE)
    draw1.text((124, 1238), f'{month_prefix}/20', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 4 embedded date: Left=1145, Base=1238 (white)
    draw1.rectangle([1141, 1212, 1260, 1242], fill=COLOR_WHITE)
    draw1.text((1145, 1238), f'26{month_prefix}19', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 5: Left=124, Base=1283 (blue)
    draw1.rectangle([120, 1257, 210, 1287], fill=COLOR_ALT_BLUE)
    draw1.text((124, 1283), f'{month_prefix}/21', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 5 embedded timestamp: Left=269, Base=1328 (blue)
    draw1.rectangle([265, 1302, 342, 1332], fill=COLOR_ALT_BLUE)
    draw1.text((269, 1328), f'{month_prefix}21', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 6: Left=124, Base=1373 (white)
    draw1.rectangle([120, 1347, 210, 1377], fill=COLOR_WHITE)
    draw1.text((124, 1373), f'{month_prefix}/26', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    # Row 6 embedded timestamp: Left=269, Base=1418 (white)
    draw1.rectangle([265, 1392, 345, 1422], fill=COLOR_WHITE)
    draw1.text((269, 1418), f'{month_prefix}26', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # Row 7: Left=124, Base=1463 (blue)
    draw1.rectangle([120, 1437, 210, 1467], fill=COLOR_ALT_BLUE)
    draw1.text((124, 1463), f'{month_prefix}/26', fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # 4. Statement Summary Table:
    # Paste clean watermark background from Mitchell source
    clean_watermark_bg = Image.open(CLEAN_BG_PATH)
    img1.paste(clean_watermark_bg, (1070, 1775))
    
    # Draw AZIZ BERJIS on both rows: Left=1088, Base=1804 & 1841
    draw1.text((1088, 1804), NAME, fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    draw1.text((1088, 1841), NAME, fill=COLOR_BLACK, font=FONT_REGULAR, anchor='ls')
    
    # ================= UPDATE STREAM & SAVE PDF =================
    doc.update_stream(1, img0.tobytes(), compress=True)
    doc.update_stream(6, img1.tobytes(), compress=True)
    
    # Calibrate metadata
    doc.set_metadata({
        'format': 'PDF 1.4',
        'title': '',
        'author': 'ULURO PDF 4.0.1.17',
        'subject': 'None',
        'keywords': 'ULURO',
        'creator': 'ULURO',
        'producer': 'ULURO (www.uluro.com)',
        'creationDate': creation_date,
        'modDate': ''
    })
    
    doc.save(output_path, deflate=True)
    doc.close()
    print(f'Successfully saved: {output_path}')

if __name__ == '__main__':
    # July 2026: 07-01-26 THRU 07-31-26
    generate_statement(
        month_name='July',
        start_date_str='07-01-26',
        end_date_str='07-31-26',
        ending_date_short='07-31-26',
        month_prefix='07',
        next_month_prefix='08',
        creation_date='D:20260811102447',
        output_path=JULY_PDF_OUT
    )
    
    # August 2026: 08-01-26 THRU 08-31-26
    generate_statement(
        month_name='August',
        start_date_str='08-01-26',
        end_date_str='08-31-26',
        ending_date_short='08-31-26',
        month_prefix='08',
        next_month_prefix='09',
        creation_date='D:20260911102447',
        output_path=AUGUST_PDF_OUT
    )
