"""
ULURO PDF Container Synthesizer (Authentic 1:1 Image-Wrapped Container Engine)
==============================================================================
Produces byte-exact ULURO PDF containers matching canonical statement 11-30-24.pdf:
- Exact PDF 1.4 Header with binary comment marker (%PDF-1.4\\n%\\xd2\\xe5\\xd1\\xf2\\n, 15 bytes)
- 300 DPI uncompressed 8-bit DeviceRGB page frames (2550 x 3300, 25,245,000 bytes per page)
- Zlib FlateDecode compression (level=6)
- Exact 11-object structure for N=2 matching 11-30-24.pdf:
    Obj 1:  Page 1 Image XObject
    Obj 2:  Page 1 Resources (/ProcSet [/PDF /ImageC ] /XObject << /Img0 1 0 R >>)
    Obj 3:  Page 1 Content Stream (/Img0 Do drawing stream)
    Obj 4:  Page 1 Page Object (/Type /Page /Parent 5 0 R /MediaBox [0 0 612 792] ...)
    Obj 6:  Page 2 Image XObject
    Obj 7:  Info Object with UTF-16BE hex metadata (<FEFF...>)
    Obj 8:  Page 2 Resources (/ProcSet [/PDF /ImageC ] /XObject << /Img0 6 0 R >>)
    Obj 9:  Page 2 Content Stream (/Img0 Do drawing stream)
    Obj 10: Page 2 Page Object
    Obj 5:  Pages Root (/Type /Pages /Kids [4 0 R 10 0 R] /Count 2)
    Obj 11: Catalog Root (/Type /Catalog /Pages 5 0 R /PageLayout /SinglePage ...)
- Dynamic scaling to arbitrary N pages (4N+3 objects, trailer /Size 4N+4)
- 20-byte XREF entries and trailer with [<MD5><MD5>] /ID format
- Zero vector fonts, zero font descriptors, zero Skia coordinate inversion operators
- Absolute absence of Skia, Chromium, WebKit, or Cairo byte markers
"""

from __future__ import annotations

import argparse
import hashlib
import io
import os
from pathlib import Path
from typing import Any, Sequence
import zlib

import pymupdf
from PIL import Image

# Canonical Constants
ULURO_HEADER = b"%PDF-1.4\n%\xd2\xe5\xd1\xf2\n"  # Exactly 15 bytes
CANONICAL_WIDTH = 2550
CANONICAL_HEIGHT = 3300
RAW_FRAME_SIZE = CANONICAL_WIDTH * CANONICAL_HEIGHT * 3  # 25,245,000 bytes
CANONICAL_CREATION_DATE = "D:20241211102447"

# Canonical content stream drawing /Img0 at 1:1 page scale (612 x 792 pt)
CANONICAL_DRAWING_STREAM_RAW = (
    b"q\r\n\r\n"
    b"2 J\r\n"
    b"2 j\r\n"
    b"0.75 w\r\n"
    b"1 1 1 rg\r\n"
    b"q\r\n"
    b"1 0 0 1 0 0 cm\r\n"
    b"612 0 0 792 0 0 cm\r\n"
    b"/Img0 Do\r\n"
    b"Q\r\n"
    b"0 G\r\n"
    b"0.75 w\r\n"
    b"Q\r\n"
)
CANONICAL_DRAWING_STREAM_COMPRESSED = zlib.compress(CANONICAL_DRAWING_STREAM_RAW, level=6)

CANONICAL_METADATA = {
    "Creator": "ULURO",
    "CreationDate": CANONICAL_CREATION_DATE,
    "Producer": "ULURO (www.uluro.com)",
    "Author": "ULURO PDF 4.0.1.17",
    "Title": "",
    "Subject": "None",
    "Keywords": "ULURO",
}


def encode_utf16be_hex(text: str) -> str:
    """Encodes a string into UTF-16BE hex format with leading BOM (<FEFF...>)."""
    if text is None:
        text = ""
    utf16_bytes = b"\xfe\xff" + text.encode("utf-16-be")
    return f"<{utf16_bytes.hex().upper()}>"


def normalize_frame_to_rgb24(item: Any) -> bytes:
    """
    Normalizes an image frame into exactly 25,245,000 raw 8-bit DeviceRGB bytes (2550 x 3300).
    Accepts:
    - Raw bytes of length 25,245,000
    - Encoded image bytes (PNG, JPEG, etc.)
    - File path string or Path
    - PIL Image.Image
    - NumPy ndarray
    """
    if isinstance(item, (str, Path)):
        with Image.open(item) as img:
            return normalize_frame_to_rgb24(img)

    if isinstance(item, bytes):
        if len(item) == RAW_FRAME_SIZE:
            return item
        try:
            with Image.open(io.BytesIO(item)) as img:
                return normalize_frame_to_rgb24(img)
        except Exception as e:
            raise ValueError(
                f"Invalid frame buffer size ({len(item)} bytes, expected {RAW_FRAME_SIZE}) "
                f"or unrecognized image format: {e}"
            ) from e

    # Check for NumPy array
    if hasattr(item, "__array_interface__") or hasattr(item, "shape"):
        import numpy as np

        arr = np.asarray(item)
        if arr.shape == (CANONICAL_HEIGHT, CANONICAL_WIDTH, 3) and arr.dtype == np.uint8:
            return arr.tobytes()
        elif arr.shape == (CANONICAL_HEIGHT, CANONICAL_WIDTH, 4) and arr.dtype == np.uint8:
            return arr[:, :, :3].tobytes()
        else:
            img = Image.fromarray(arr)
            return normalize_frame_to_rgb24(img)

    # Check for PIL Image
    if hasattr(item, "size") and hasattr(item, "convert") and hasattr(item, "tobytes"):
        img = item
        if img.size != (CANONICAL_WIDTH, CANONICAL_HEIGHT):
            img = img.resize((CANONICAL_WIDTH, CANONICAL_HEIGHT), Image.Resampling.LANCZOS)
        if img.mode != "RGB":
            img = img.convert("RGB")
        raw = img.tobytes()
        if len(raw) != RAW_FRAME_SIZE:
            raise ValueError(
                f"Image raw byte length {len(raw)} does not match expected {RAW_FRAME_SIZE}"
            )
        return raw

    raise TypeError(f"Unsupported image frame type: {type(item)}")


def synthesize_uluro_container(
    frames: Sequence[bytes | Any],
    metadata: dict[str, str] | None = None,
    creation_date: str = CANONICAL_CREATION_DATE,
) -> bytes:
    """
    Synthesizes an authentic byte-exact ULURO PDF container in memory.
    
    Args:
        frames: Sequence of 300 DPI 8-bit DeviceRGB frames (2550 x 3300, 25,245,000 bytes each).
        metadata: Optional dictionary overriding default ULURO metadata fields.
        creation_date: PDF date string (default canonical: D:20241211102447).
        
    Returns:
        Exact synthesized PDF bytes.
    """
    raw_frames = [normalize_frame_to_rgb24(f) for f in frames]
    page_count = len(raw_frames)
    if page_count == 0:
        raise ValueError("At least one page frame is required to synthesize a container")

    # Determine object IDs based on page count
    total_objects = 4 * page_count + 3
    pages_root_id = 5

    page_object_map: list[dict[str, int]] = []
    if page_count == 1:
        # For N=1:
        # Obj 1: Image, Obj 2: Resources, Obj 3: Contents, Obj 4: Page
        # Obj 5: Pages Root, Obj 6: Info, Obj 7: Catalog
        page_object_map.append({
            "image": 1,
            "resources": 2,
            "content": 3,
            "page": 4,
        })
        info_id = 6
        catalog_id = 7
    elif page_count == 2:
        # Canonical 11-object structure matching 11-30-24.pdf:
        # Obj 1: Page 1 Image, Obj 2: Page 1 Res, Obj 3: Page 1 Cont, Obj 4: Page 1 Page
        # Obj 6: Page 2 Image, Obj 7: Info, Obj 8: Page 2 Res, Obj 9: Page 2 Cont, Obj 10: Page 2 Page
        # Obj 5: Pages Root, Obj 11: Catalog
        page_object_map.append({
            "image": 1,
            "resources": 2,
            "content": 3,
            "page": 4,
        })
        page_object_map.append({
            "image": 6,
            "resources": 8,
            "content": 9,
            "page": 10,
        })
        info_id = 7
        catalog_id = 11
    else:
        # General N >= 3:
        # Page 0: 1, 2, 3, 4
        # Page 1: 6, 8, 9, 10
        # Obj 7: Info, Obj 5: Pages Root
        # For p in 2..N-1: base = 11 + 4*(p-2) -> base, base+1, base+2, base+3
        # Obj 4N+3: Catalog
        page_object_map.append({
            "image": 1,
            "resources": 2,
            "content": 3,
            "page": 4,
        })
        page_object_map.append({
            "image": 6,
            "resources": 8,
            "content": 9,
            "page": 10,
        })
        info_id = 7
        for p in range(2, page_count):
            base_id = 11 + 4 * (p - 2)
            page_object_map.append({
                "image": base_id,
                "resources": base_id + 1,
                "content": base_id + 2,
                "page": base_id + 3,
            })
        catalog_id = total_objects

    # Merge metadata
    meta = dict(CANONICAL_METADATA)
    if metadata:
        meta.update(metadata)
    if creation_date:
        meta["CreationDate"] = (
            creation_date if creation_date.startswith("D:") else f"D:{creation_date}"
        )

    # Initialize PDF buffer with exact 15-byte header
    body = bytearray(ULURO_HEADER)
    offsets: dict[int, int] = {}

    def write_obj(obj_id: int, content: bytes) -> None:
        offsets[obj_id] = len(body)
        body.extend(content)

    # Compress page images
    compressed_images = [zlib.compress(f, level=6) for f in raw_frames]

    # Pre-render content stream
    content_stream_bytes = CANONICAL_DRAWING_STREAM_COMPRESSED

    def build_image_xobject(img_id: int, comp_bytes: bytes) -> bytes:
        hdr = (
            f"{img_id} 0 obj<<\n"
            f"/Type /XObject\n"
            f"/Subtype /Image\n"
            f"/ColorSpace /DeviceRGB\n"
            f"/BitsPerComponent 8\n"
            f"/Width {CANONICAL_WIDTH}\n"
            f"/Height {CANONICAL_HEIGHT}\n"
            f"/Filter /FlateDecode\n"
            f"/Length {len(comp_bytes)}\n"
            f">>\n"
            f"stream\n"
        ).encode("ascii")
        return hdr + comp_bytes + b"\nendstream\nendobj\n"

    def build_resources_object(res_id: int, img_id: int) -> bytes:
        return (
            f"{res_id} 0 obj<<\n"
            f"/ProcSet [/PDF /ImageC ]\n"
            f"/XObject <<\n"
            f"/Img0 {img_id} 0 R\n"
            f">>\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")

    def build_content_object(cont_id: int, comp_cont: bytes) -> bytes:
        hdr = (
            f"{cont_id} 0 obj<<\n"
            f"/Length {len(comp_cont)}\n"
            f"/Filter /FlateDecode\n"
            f">>\n"
            f"stream\n"
        ).encode("ascii")
        return hdr + comp_cont + b"\nendstream\nendobj\n"

    def build_page_object(page_id: int, res_id: int, cont_id: int) -> bytes:
        return (
            f"{page_id} 0 obj<<\n"
            f"/Type /Page\n"
            f"/Parent {pages_root_id} 0 R\n"
            f"/MediaBox [0 0 612 792]\n"
            f"/Resources {res_id} 0 R\n"
            f"/Contents [{cont_id} 0 R]\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")

    def build_info_object(i_id: int) -> bytes:
        lines = [f"{i_id} 0 obj<<"]
        # Maintain canonical key order: Creator, CreationDate, Producer, Author, Title, Subject, Keywords
        canonical_order = [
            "Creator",
            "CreationDate",
            "Producer",
            "Author",
            "Title",
            "Subject",
            "Keywords",
        ]
        remaining_keys = [k for k in meta if k not in canonical_order]
        for k in canonical_order + remaining_keys:
            if k not in meta:
                continue
            v = meta[k]
            if k in ("CreationDate", "ModDate"):
                val_str = str(v)
                if not val_str.startswith("D:"):
                    val_str = f"D:{val_str}"
                lines.append(f"/{k} ({val_str})")
            else:
                lines.append(f"/{k} {encode_utf16be_hex(str(v))}")
        lines.append(">>\nendobj\n")
        return "\n".join(lines).encode("ascii")

    # Serialize physical stream in exact canonical sequence
    if page_count == 1:
        # Page 0
        write_obj(1, build_image_xobject(1, compressed_images[0]))
        write_obj(2, build_resources_object(2, 1))
        write_obj(3, build_content_object(3, content_stream_bytes))
        write_obj(4, build_page_object(4, 2, 3))
        # Info Object
        write_obj(info_id, build_info_object(info_id))
        # Pages Root
        kids_str = "4 0 R \n"
        pages_content = (
            f"{pages_root_id} 0 obj<<\n"
            f"/Type /Pages\n"
            f"/Kids [\n"
            f"{kids_str}"
            f"]\n"
            f"/Count 1\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(pages_root_id, pages_content)
        # Catalog Root
        cat_content = (
            f"{catalog_id} 0 obj<<\n"
            f"/Type /Catalog\n"
            f"/Pages {pages_root_id} 0 R\n"
            f"/PageLayout /SinglePage\n"
            f"/ViewerPreferences <<\n"
            f"/FitWindow true\n"
            f">>\n"
            f"/PageMode /UseNone\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(catalog_id, cat_content)

    elif page_count == 2:
        # Canonical 11-object sequence matching 11-30-24.pdf
        # Page 1: Obj 1, 2, 3, 4
        write_obj(1, build_image_xobject(1, compressed_images[0]))
        write_obj(2, build_resources_object(2, 1))
        write_obj(3, build_content_object(3, content_stream_bytes))
        write_obj(4, build_page_object(4, 2, 3))

        # Page 2 Image: Obj 6
        write_obj(6, build_image_xobject(6, compressed_images[1]))

        # Info: Obj 7
        write_obj(7, build_info_object(7))

        # Page 2 Resources, Content, Page: Obj 8, 9, 10
        write_obj(8, build_resources_object(8, 6))
        write_obj(9, build_content_object(9, content_stream_bytes))
        write_obj(10, build_page_object(10, 8, 9))

        # Pages Root: Obj 5
        kids_str = "4 0 R \n10 0 R \n"
        pages_content = (
            f"{pages_root_id} 0 obj<<\n"
            f"/Type /Pages\n"
            f"/Kids [\n"
            f"{kids_str}"
            f"]\n"
            f"/Count 2\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(pages_root_id, pages_content)

        # Catalog Root: Obj 11
        cat_content = (
            f"{catalog_id} 0 obj<<\n"
            f"/Type /Catalog\n"
            f"/Pages {pages_root_id} 0 R\n"
            f"/PageLayout /SinglePage\n"
            f"/ViewerPreferences <<\n"
            f"/FitWindow true\n"
            f">>\n"
            f"/PageMode /UseNone\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(catalog_id, cat_content)

    else:
        # Page count >= 3
        # First write Page 1 (Obj 1, 2, 3, 4)
        write_obj(1, build_image_xobject(1, compressed_images[0]))
        write_obj(2, build_resources_object(2, 1))
        write_obj(3, build_content_object(3, content_stream_bytes))
        write_obj(4, build_page_object(4, 2, 3))

        # Page 2 Image: Obj 6
        write_obj(6, build_image_xobject(6, compressed_images[1]))

        # Info: Obj 7
        write_obj(7, build_info_object(7))

        # Page 2 Resources, Content, Page: Obj 8, 9, 10
        write_obj(8, build_resources_object(8, 6))
        write_obj(9, build_content_object(9, content_stream_bytes))
        write_obj(10, build_page_object(10, 8, 9))

        # Subsequent pages
        for p in range(2, page_count):
            p_map = page_object_map[p]
            write_obj(p_map["image"], build_image_xobject(p_map["image"], compressed_images[p]))
            write_obj(p_map["resources"], build_resources_object(p_map["resources"], p_map["image"]))
            write_obj(p_map["content"], build_content_object(p_map["content"], content_stream_bytes))
            write_obj(p_map["page"], build_page_object(p_map["page"], p_map["resources"], p_map["content"]))

        # Pages Root: Obj 5
        kids_lines = "".join(f"{p_map['page']} 0 R \n" for p_map in page_object_map)
        pages_content = (
            f"{pages_root_id} 0 obj<<\n"
            f"/Type /Pages\n"
            f"/Kids [\n"
            f"{kids_lines}"
            f"]\n"
            f"/Count {page_count}\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(pages_root_id, pages_content)

        # Catalog Root
        cat_content = (
            f"{catalog_id} 0 obj<<\n"
            f"/Type /Catalog\n"
            f"/Pages {pages_root_id} 0 R\n"
            f"/PageLayout /SinglePage\n"
            f"/ViewerPreferences <<\n"
            f"/FitWindow true\n"
            f">>\n"
            f"/PageMode /UseNone\n"
            f">>\n"
            f"endobj\n"
        ).encode("ascii")
        write_obj(catalog_id, cat_content)

    # Cross-Reference Table
    startxref = len(body)
    xref_lines = [f"xref\n0 {total_objects + 1}\n", "0000000000 65535 f \n"]
    for oid in range(1, total_objects + 1):
        if oid not in offsets:
            raise KeyError(f"Missing offset for object {oid}")
        offset = offsets[oid]
        xref_lines.append(f"{offset:010d} 00000 n \n")

    xref_bytes = "".join(xref_lines).encode("ascii")
    body.extend(xref_bytes)

    # Trailer Dictionary
    # Calculate deterministic MD5 file ID from body contents
    file_id = hashlib.md5(body).hexdigest().upper()
    trailer_str = (
        f"trailer\n"
        f"<<\n"
        f"/Size {total_objects + 1}\n"
        f"/Root {catalog_id} 0 R\n"
        f"/Info {info_id} 0 R\n"
        f"/ID [<{file_id}><{file_id}>]\n"
        f">>\n"
        f"startxref\n"
        f"{startxref}\n"
        f"%%EOF\n\r\n"
    )
    body.extend(trailer_str.encode("ascii"))

    return bytes(body)


def synthesize_uluro_container_from_frames(
    frames: Sequence[bytes | Any],
    output_path: str,
    metadata: dict[str, str] | None = None,
    creation_date: str = CANONICAL_CREATION_DATE,
) -> int:
    """
    Synthesizes a 1:1 byte-exact ULURO PDF container and writes it to disk.
    
    Args:
        frames: Sequence of raw 25,245,000-byte DeviceRGB frames or image objects.
        output_path: Target PDF filepath.
        metadata: Optional metadata dictionary.
        creation_date: PDF date string (default canonical: D:20241211102447).
        
    Returns:
        Total bytes written.
    """
    pdf_bytes = synthesize_uluro_container(
        frames=frames,
        metadata=metadata,
        creation_date=creation_date,
    )
    target_dir = os.path.dirname(os.path.abspath(output_path))
    if target_dir:
        os.makedirs(target_dir, exist_ok=True)

    with open(output_path, "wb") as f:
        f.write(pdf_bytes)

    return len(pdf_bytes)


def create_uluro_container_from_images(
    images: Sequence[bytes | Any],
    output_path: str,
    metadata: dict[str, str] | None = None,
    creation_date: str = CANONICAL_CREATION_DATE,
) -> str:
    """
    Public API: Creates an authentic byte-exact ULURO PDF container from a list of images.
    
    Args:
        images: List of 300 DPI uncompressed 8-bit DeviceRGB frames (2550x3300)
                or images convertible to this format.
        output_path: Destination PDF filepath.
        metadata: Optional dictionary of metadata values (/Producer, /Creator, /Author, etc.).
        creation_date: PDF date string format (default matching 11-30-24.pdf).
        
    Returns:
        output_path
    """
    if not isinstance(images, (list, tuple)):
        images = [images]

    synthesize_uluro_container_from_frames(
        frames=images,
        output_path=output_path,
        metadata=metadata,
        creation_date=creation_date,
    )
    return output_path


def convert_pdf_to_uluro_container(
    input_pdf_path: str,
    output_pdf_path: str,
    metadata: dict[str, str] | None = None,
    creation_date: str = CANONICAL_CREATION_DATE,
) -> str:
    """
    Public API: Renders input PDF pages at 300 DPI DeviceRGB and packages them
    into an authentic ULURO container.
    
    Args:
        input_pdf_path: Source vector or raster PDF file.
        output_pdf_path: Destination ULURO container PDF filepath.
        metadata: Optional dictionary of metadata values.
        creation_date: PDF date string format.
        
    Returns:
        output_pdf_path
    """
    if not os.path.exists(input_pdf_path):
        raise FileNotFoundError(f"Input PDF not found: {input_pdf_path}")

    doc = pymupdf.open(input_pdf_path)
    raw_frames: list[bytes] = []

    for page in doc:
        # Standard US Letter is 612 x 792 points. At 300 DPI, 612*(300/72) = 2550, 792*(300/72) = 3300.
        # Compute exact scaling factors relative to page geometry:
        scale_x = CANONICAL_WIDTH / page.rect.width
        scale_y = CANONICAL_HEIGHT / page.rect.height
        matrix = pymupdf.Matrix(scale_x, scale_y)
        pix = page.get_pixmap(matrix=matrix, colorspace=pymupdf.csRGB, alpha=False)

        if pix.width != CANONICAL_WIDTH or pix.height != CANONICAL_HEIGHT:
            with Image.frombytes("RGB", (pix.width, pix.height), pix.samples) as pil_img:
                resized = pil_img.resize((CANONICAL_WIDTH, CANONICAL_HEIGHT), Image.Resampling.LANCZOS)
                samples = resized.tobytes()
        else:
            samples = pix.samples

        if len(samples) != RAW_FRAME_SIZE:
            raise ValueError(
                f"Extracted sample byte size {len(samples)} does not match {RAW_FRAME_SIZE}"
            )
        raw_frames.append(samples)

    doc.close()

    create_uluro_container_from_images(
        images=raw_frames,
        output_path=output_pdf_path,
        metadata=metadata,
        creation_date=creation_date,
    )
    return output_pdf_path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Authentic 1:1 ULURO PDF Container Synthesizer"
    )
    parser.add_argument("input", help="Input PDF file or image file(s)", nargs="+")
    parser.add_argument("-o", "--output", help="Output PDF file path", required=True)
    parser.add_argument(
        "--creation-date",
        help="PDF CreationDate string (e.g. D:20241211102447)",
        default=CANONICAL_CREATION_DATE,
    )
    args = parser.parse_args()

    input_files = args.input
    if len(input_files) == 1 and input_files[0].lower().endswith(".pdf"):
        print(f"Converting PDF '{input_files[0]}' to ULURO container '{args.output}'...")
        convert_pdf_to_uluro_container(
            input_pdf_path=input_files[0],
            output_pdf_path=args.output,
            creation_date=args.creation_date,
        )
    else:
        print(f"Packaging {len(input_files)} frame(s) into ULURO container '{args.output}'...")
        create_uluro_container_from_images(
            images=input_files,
            output_path=args.output,
            creation_date=args.creation_date,
        )

    print(f"Successfully generated ULURO container: {args.output}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
