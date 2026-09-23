import os
import sys
import zlib
import pytest
import numpy as np
import cv2
import pymupdf
from PIL import Image

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Canonical reference statement paths
CANONICAL_ULURO_PATH = r"H:\USFCU\usfederalcu\Target\William Newman - LENDINGCLUB ROBERTSHARPE\statements\11-30-24.pdf"
QUADIENT_SPOOL_PATH = r"H:\USFCU\Federal_Credit_Union\data\STATEMENTS\Monthly Statements\2024\01-January\Regular Statements_2024-01-31.pdf"

# Current project statement paths
NOV_2024_STATEMENT_PATH = os.path.join(PROJECT_ROOT, "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf")
EXPANDED_3PAGE_PATH = os.path.join(PROJECT_ROOT, "US_1364_FCU_Statement_Expanded_3Page.pdf")
MASSIVE_3PAGE_PATH = os.path.join(PROJECT_ROOT, "US_1364_FCU_Statement_Massive_3Page.pdf")
AZIZ_JULY_2026_PATH = os.path.join(PROJECT_ROOT, "US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf")


@pytest.fixture(scope="session")
def canonical_uluro_pdf():
    """Provides path to canonical ULURO statement 11-30-24.pdf."""
    assert os.path.exists(CANONICAL_ULURO_PATH), f"Canonical ULURO statement not found: {CANONICAL_ULURO_PATH}"
    return CANONICAL_ULURO_PATH


@pytest.fixture(scope="session")
def quadient_spool_pdf():
    """Provides path to Quadient Inspire master spool PDF."""
    assert os.path.exists(QUADIENT_SPOOL_PATH), f"Quadient spool PDF not found: {QUADIENT_SPOOL_PATH}"
    return QUADIENT_SPOOL_PATH


@pytest.fixture(scope="session")
def existing_statements():
    """Returns dictionary of all existing pre-generated statement PDFs."""
    statements = {
        "november_2024": NOV_2024_STATEMENT_PATH,
        "expanded_3page": EXPANDED_3PAGE_PATH,
        "massive_3page": MASSIVE_3PAGE_PATH,
        "aziz_july_2026": AZIZ_JULY_2026_PATH
    }
    for key, path in statements.items():
        assert os.path.exists(path), f"Required statement artifact not found: {path}"
    return statements


@pytest.fixture
def synthetic_frame_bytes():
    """Generates a real 2550 x 3300 8-bit DeviceRGB raw bytes buffer (25,245,000 bytes)."""
    # Real RGB pixel buffer (3300 rows x 2550 cols x 3 bytes)
    # Using white background with simulated blue header bar
    arr = np.full((3300, 2550, 3), 255, dtype=np.uint8)
    # Draw blue header bar at Y=450 to 520, X=88 to 2462
    arr[450:520, 88:2462] = [17, 41, 162]  # Authentic Quadient dark blue #1129a2 in RGB
    raw = arr.tobytes()
    assert len(raw) == 2550 * 3300 * 3, f"Unexpected buffer length: {len(raw)}"
    return raw


@pytest.fixture
def synthetic_frame_numpy():
    """Generates a real 3300 x 2550 x 3 uint8 numpy array."""
    arr = np.full((3300, 2550, 3), 255, dtype=np.uint8)
    arr[450:520, 88:2462] = [17, 41, 162]
    return arr


@pytest.fixture
def synthetic_frame_pil():
    """Generates a real PIL Image at 2550 x 3300."""
    return Image.new("RGB", (2550, 3300), color=(255, 255, 255))


@pytest.fixture
def sample_vector_pdf(tmp_path):
    """Generates a real 2-page vector PDF with text, rectangles, and fonts for testing."""
    pdf_path = str(tmp_path / "sample_vector.pdf")
    doc = pymupdf.open()
    
    # Page 1
    p1 = doc.new_page(width=612, height=792)
    p1.draw_rect(pymupdf.Rect(21.12, 108.0, 590.88, 125.0), color=(0.067, 0.161, 0.635), fill=(0.067, 0.161, 0.635))
    p1.insert_text((21.12, 50.0), "U.S. #1364 FEDERAL CREDIT UNION", fontname="helv", fontsize=14)
    p1.insert_text((21.12, 120.0), "STATEMENT OF ACCOUNT", fontname="helv", fontsize=10, color=(1, 1, 1))
    
    # Page 2
    p2 = doc.new_page(width=612, height=792)
    p2.draw_rect(pymupdf.Rect(21.12, 70.0, 590.88, 85.0), color=(0.067, 0.161, 0.635), fill=(0.067, 0.161, 0.635))
    p2.insert_text((21.12, 80.0), "TRANSACTION DETAIL CONTINUED", fontname="helv", fontsize=9, color=(1, 1, 1))
    
    doc.save(pdf_path)
    doc.close()
    return pdf_path


def measure_page_edges_at_300dpi(pdf_path, page_num=0):
    """
    Measures left and right edge coordinates of full-width elements at 300 DPI
    using script-driven OpenCV contour detection down to the individual pixel level.
    Returns:
        dict: {
            'left_edges': list[int],
            'right_edges': list[int],
            'min_left': int,
            'max_left': int,
            'min_right': int,
            'max_right': int,
            'left_delta': int,
            'right_delta': int,
            'count': int
        }
    """
    doc = pymupdf.open(pdf_path)
    page = doc[page_num]
    pix = page.get_pixmap(dpi=300)
    img = cv2.cvtColor(
        np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, pix.n)),
        cv2.COLOR_RGB2BGR
    )
    doc.close()
    
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
            
    full_width_elements.sort()
    if not full_width_elements:
        return {'count': 0, 'left_edges': [], 'right_edges': [], 'left_delta': 0, 'right_delta': 0}
        
    left_edges = [el[1] for el in full_width_elements]
    right_edges = [el[2] for el in full_width_elements]
    min_left, max_left = min(left_edges), max(left_edges)
    min_right, max_right = min(right_edges), max(right_edges)
    
    return {
        'count': len(full_width_elements),
        'left_edges': left_edges,
        'right_edges': right_edges,
        'min_left': min_left,
        'max_left': max_left,
        'min_right': min_right,
        'max_right': max_right,
        'left_delta': max_left - min_left,
        'right_delta': max_right - min_right
    }
