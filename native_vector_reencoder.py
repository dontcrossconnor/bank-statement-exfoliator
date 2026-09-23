"""
Native Vector Stream Re-Encoder Normalizer (Requirement R2)
[native_vector_reencoder.py](file:///e:/StatementGen/native_vector_reencoder.py)

Normalizes Skia/Chromium Playwright vector PDF outputs to Quadient Inspire-compliant Adobe Type 1 streams:
1. Strips top-level inverted transformation matrices (.23999999 0 0 -.23999999 0 792 cm / 1 0 0 -1 0 792 cm).
2. Re-orients all drawing and text coordinates to standard bottom-left Cartesian (0, 0) where Y increases upwards.
3. Normalizes font dictionaries from Skia Type 0 composite CIDFonts with subset prefixes (AAAAAA+Arial-BoldMT, BAAAAA+ArialMT)
   to standard Adobe Type 1 font structures (/F -> Arial-BoldMT, /F0 -> ArialMT) matching the Quadient Inspire master spool profile.
4. Normalizes graphics state calls and flattens micro-fragmented text operators into cohesive string drawing operators (text) Tj.
5. Preserves image XObjects and graphics state with strictly positive transformation matrices.
"""

import io
import os
import re
import sys
import base64
import hashlib
from datetime import datetime, timezone
import argparse
import pymupdf
import pypdf
from pypdf.generic import ArrayObject, ByteStringObject
from fontTools.cffLib import CFFFontSet
from fontTools.agl import UV2AGL


def sync_filesystem_timestamp(file_path: str, timestamp_str: str) -> None:
    """
    Parses PDF date string (D:YYYYMMDDHHmmSS or D:YYYYMMDDHHmmSSZ) or ISO/human date string
    ('YYYY-MM-DD HH:MM:SS') and synchronizes the OS filesystem modified/accessed timestamp via os.utime.
    """
    if not os.path.exists(file_path) or not timestamp_str:
        return
    try:
        if "-" in timestamp_str:
            dt = datetime.strptime(timestamp_str.strip(), "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        else:
            clean_date = timestamp_str.replace("D:", "").replace("Z", "")
            clean_date = re.sub(r"[+-]\d{2}'\d{2}'?", "", clean_date)
            dt = datetime.strptime(clean_date[:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
        epoch = dt.timestamp()
        os.utime(file_path, (epoch, epoch))
    except Exception as e:
        print(f"Warning: Failed to sync filesystem timestamp for {file_path}: {e}")


# Canonical Quadient Inspire master spool path
QUADIENT_MASTER_SPOOL_PATH = (
    "H:/USFCU/Federal_Credit_Union/data/STATEMENTS/Monthly Statements/2024/01-January/Regular Statements_2024-01-31.pdf"
)


def load_cff_streams() -> tuple[bytes, bytes]:
    """
    Loads complete 256-glyph CFF font streams for Arial-BoldMT and ArialMT.
    Uses embedded canonical CFF streams synthesized from Quadient master spool + TrueType metrics,
    or synthesizes dynamically if available.
    Returns (bold_cff_bytes, regular_cff_bytes).
    """
    try:
        from src.assets.cff_fonts import EMBEDDED_FULL_BOLD_CFF_B64, EMBEDDED_FULL_REG_CFF_B64
        bold_cff = base64.b64decode(EMBEDDED_FULL_BOLD_CFF_B64)
        reg_cff = base64.b64decode(EMBEDDED_FULL_REG_CFF_B64)
        if bold_cff and reg_cff:
            return bold_cff, reg_cff
    except Exception as e:
        print(f"Warning: Failed to load from cff_fonts: {e}")

    # Fallback to master spool if available
    if os.path.exists(QUADIENT_MASTER_SPOOL_PATH):
        try:
            doc = pymupdf.open(QUADIENT_MASTER_SPOOL_PATH)
            bold_cff = doc.xref_stream(61210)
            reg_cff = doc.xref_stream(61212)
            doc.close()
            if bold_cff and reg_cff:
                return bold_cff, reg_cff
        except Exception:
            pass

    return b"", b""


def get_standard_type1_widths():
    """
    Returns standard Adobe Type 1 / Arial widths arrays for characters 32 to 255.
    Calculated from standard AFM metrics matching Helvetica/Arial.
    """
    font_helv = pymupdf.Font("helv")
    font_hebo = pymupdf.Font("hebo")
    widths_reg = [round(font_helv.text_length(chr(c), fontsize=1000)) for c in range(32, 256)]
    widths_bold = [round(font_hebo.text_length(chr(c), fontsize=1000)) for c in range(32, 256)]
    return widths_bold, widths_reg


class _DummyOTFont:
    recalcBBoxes = False


def subset_cff(base_cff_bytes: bytes, used_chars: set[str]) -> bytes:
    """
    Subsets a CFF font stream to the exact set of used characters plus required baseline characters
    (digits 0-9, letters, punctuation, pipe |).
    Prunes CharStrings, charStringsIndex, and charset to ~70-85 glyphs, matching Quadient Inspire server behavior.
    """
    if not base_cff_bytes:
        return b""

    # Baseline required characters: digits 0-9, letters A-Z, a-z, common financial punctuation, pipe |
    baseline_chars = (
        "0123456789"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        " .,-$%/:|#*()&'\"\\+;=@!?[]{}<>"
    )
    all_chars = set(used_chars) | set(baseline_chars)

    # Collect wanted glyph names via Adobe Glyph List
    wanted_glyphs = [".notdef"]
    for c in sorted(all_chars):
        code = ord(c)
        gname = UV2AGL.get(code)
        if not gname:
            if code == 160:  # non-breaking space
                gname = "space"
            else:
                gname = f"uni{code:04X}"
        if gname and gname not in wanted_glyphs:
            wanted_glyphs.append(gname)

    cff = CFFFontSet()
    cff.decompile(io.BytesIO(base_cff_bytes), None)
    top = cff[0]
    cs = top.CharStrings

    new_mapping = {}
    new_items = []
    valid_glyphs = []

    for g in wanted_glyphs:
        if g in cs.charStrings:
            old_idx = cs.charStrings[g]
            new_mapping[g] = len(new_items)
            new_items.append(cs.charStringsIndex[old_idx])
            valid_glyphs.append(g)

    cs.charStrings = new_mapping
    cs.charStringsIndex.items = new_items
    top.charset = valid_glyphs

    buf = io.BytesIO()
    cff.compile(buf, _DummyOTFont())
    return buf.getvalue()


def get_subset_type1_widths(font_name: str, used_chars: set[str]) -> tuple[int, int, list[int]]:
    """
    Computes FirstChar, LastChar, and subsetted Widths array for an Adobe Type 1 font.
    Unused character positions have width 0.
    Used character positions have authentic AFM metrics matching Helvetica/Arial-Bold.
    """
    font = pymupdf.Font(font_name)
    baseline_chars = (
        "0123456789"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        " .,-$%/:|#*()&'\"\\+;=@!?[]{}<>"
    )
    all_chars = set(used_chars) | set(baseline_chars)

    first_char = 32
    valid_codes = [ord(c) for c in all_chars if 32 <= ord(c) < 256]
    last_char = max(valid_codes) if valid_codes else 126
    if last_char < 124:
        last_char = 124

    widths = []
    for code in range(first_char, last_char + 1):
        char = chr(code)
        if char in all_chars:
            widths.append(round(font.text_length(char, fontsize=1000)))
        else:
            widths.append(0)

    return first_char, last_char, widths


def parse_cmap(cmap_str: str) -> dict[int, str]:
    """Parses a PDF ToUnicode CMap stream into a dictionary mapping integer CID to unicode char."""
    cid_to_char = {}
    for block in re.finditer(r"(\d+)\s+beginbfchar\s+(.*?)\s+endbfchar", cmap_str, re.DOTALL):
        for line in block.group(2).strip().splitlines():
            parts = line.strip().split()
            if len(parts) >= 2:
                cid = int(parts[0].strip("<>"), 16)
                char = chr(int(parts[1].strip("<>"), 16))
                cid_to_char[cid] = char

    for block in re.finditer(r"(\d+)\s+beginbfrange\s+(.*?)\s+endbfrange", cmap_str, re.DOTALL):
        for line in block.group(2).strip().splitlines():
            parts = line.strip().split()
            if len(parts) >= 3:
                src_start = int(parts[0].strip("<>"), 16)
                src_end = int(parts[1].strip("<>"), 16)
                if parts[2].startswith("<"):
                    dst_start = int(parts[2].strip("<>"), 16)
                    for i in range(src_end - src_start + 1):
                        cid_to_char[src_start + i] = chr(dst_start + i)
    return cid_to_char


UNICODE_TO_ASCII_MAP = {
    "\u2018": "'",   # left single curly quote
    "\u2019": "'",   # right single curly quote (smart apostrophe)
    "\u201a": "'",   # single low-9 quote
    "\u201c": '"',   # left double curly quote
    "\u201d": '"',   # right double curly quote
    "\u201e": '"',   # double low-9 quote
    "\u2013": "-",   # en dash
    "\u2014": "-",   # em dash
    "\u2015": "-",   # horizontal bar
    "\u2022": "*",   # bullet
    "\u2026": "...", # horizontal ellipsis
    "\u00a0": " ",   # non-breaking space
    "\u200b": "",    # zero width space
    "\u2122": "TM",  # trade mark
    "\u00ae": "(R)", # registered sign
    "\u00a9": "(C)", # copyright
}


def escape_pdf_string(s: str) -> str:
    """
    Escapes a python string for safe inclusion in PDF (text) Tj literals.
    Normalizes common typographic unicode characters (smart quotes, em-dashes, bullets)
    to prevent invalid >3-digit octal literals (e.g. \\20031) that corrupt PDF text streams.
    Guarantees standard 7-bit ASCII or bounded 8-bit octal escapes (strictly <= \\377).
    """
    res = []
    for c in s:
        mapped = UNICODE_TO_ASCII_MAP.get(c, c)
        for ch in mapped:
            code = ord(ch)
            if ch == "\\":
                res.append("\\\\")
            elif ch == "(":
                res.append("\\(")
            elif ch == ")":
                res.append("\\)")
            elif 32 <= code <= 126:
                res.append(ch)
            elif 128 <= code <= 255:
                res.append(f"\\{code:03o}")
            elif code < 32:
                if ch in ("\n", "\r", "\t"):
                    res.append(" ")
            else:
                # Unmapped code point >= 256; fallback to '?' to prevent multi-digit octal corruption
                res.append("?")
    return "".join(res)


def mat_mult(m1: list[float], m2: list[float]) -> list[float]:
    """Multiplies two 2D affine transformation matrices in PDF convention [x', y', 1] = [x, y, 1] * M."""
    a = m1[0] * m2[0] + m1[1] * m2[2]
    b = m1[0] * m2[1] + m1[1] * m2[3]
    c = m1[2] * m2[0] + m1[3] * m2[2]
    d = m1[2] * m2[1] + m1[3] * m2[3]
    e = m1[4] * m2[0] + m1[5] * m2[2] + m2[4]
    f = m1[4] * m2[1] + m1[5] * m2[3] + m2[5]
    return [a, b, c, d, e, f]


def transform_point(x: float, y: float, m: list[float]) -> list[float]:
    """Transforms a point (x, y) through affine matrix m."""
    return [x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]]


def tokenize_stream(data: bytes) -> list[bytes]:
    """Tokenizes a PDF content stream into a list of byte tokens."""
    token_pattern = re.compile(
        rb"(<<|>>|\[|\]|"
        rb"/[^\s/()<>\[\]{}]+|"
        rb"<[0-9A-Fa-f\s]*>|"
        rb"\((?:[^()\\]|\\.)*\)|"
        rb"%[^\r\n]*|"
        rb"[^\s/()<>\[\]{}]+)"
    )
    tokens = []
    for m in token_pattern.finditer(data):
        t = m.group(0)
        if not t.startswith(b"%"):
            tokens.append(t)
    return tokens


def unescape_pdf_literal(raw_bytes: bytes) -> str:
    """Unescapes a PDF literal string bytes like b'(hello\\(world\\))' to python string."""
    s = raw_bytes
    if s.startswith(b'(') and s.endswith(b')'):
        s = s[1:-1]
    res = []
    i = 0
    while i < len(s):
        if s[i:i+1] == b'\\' and i + 1 < len(s):
            nxt = s[i+1:i+2]
            if nxt == b'n':
                res.append('\n'); i += 2
            elif nxt == b'r':
                res.append('\r'); i += 2
            elif nxt == b't':
                res.append('\t'); i += 2
            elif nxt == b'(':
                res.append('('); i += 2
            elif nxt == b')':
                res.append(')'); i += 2
            elif nxt == b'\\':
                res.append('\\'); i += 2
            elif nxt.isdigit():
                oct_str = s[i+1:i+4]
                try:
                    res.append(chr(int(oct_str, 8)))
                    i += 1 + len(oct_str)
                except Exception:
                    res.append(s[i:i+1].decode('latin1', errors='replace'))
                    i += 1
            else:
                res.append(nxt.decode('latin1', errors='replace'))
                i += 2
        else:
            res.append(s[i:i+1].decode('latin1', errors='replace'))
            i += 1
    return ''.join(res)


def decode_hex_string(hex_bytes: bytes, cmap: dict[int, str]) -> str:
    """Decodes a PDF hex string token <...> handling both 2-byte CIDs and 1-byte WinAnsi ASCII."""
    h = hex_bytes.strip(b'<>').decode('ascii', errors='replace').replace(' ', '').replace('\n', '').replace('\r', '')
    if cmap:
        matched = True
        chars = []
        for k in range(0, len(h), 4):
            cid_hex = h[k:k+4]
            if len(cid_hex) == 4:
                cid = int(cid_hex, 16)
                if cid in cmap:
                    chars.append(cmap[cid])
                else:
                    matched = False
                    break
            else:
                matched = False
                break
        if matched and chars:
            return ''.join(chars)
    
    try:
        if len(h) % 2 == 0:
            return bytes.fromhex(h).decode('latin1', errors='replace')
    except Exception:
        pass
    
    chars = []
    for k in range(0, len(h), 4):
        cid_hex = h[k:k+4]
        if len(cid_hex) == 4:
            cid = int(cid_hex, 16)
            chars.append(cmap.get(cid, '?'))
    return ''.join(chars)


def normalize_page_content(
    raw_bytes: bytes,
    font_cmaps: dict[str, dict[int, str]],
    font_names: dict[str, str],
    page_height: float = 792.0,
    bold_chars: set[str] | None = None,
    reg_chars: set[str] | None = None,
) -> bytes:
    """
    Normalizes a single page content stream:
    - Strips Skia inverted transformation matrix.
    - Normalizes drawing coordinates to bottom-left Cartesian (0, 0).
    - Flattens micro-fragmented text operators into cohesive string operators (text) Tj.
    - Uses strictly non-inverted transformation matrices for images and text.
    """
    tokens = tokenize_stream(raw_bytes)

    ctm = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]
    ctm_stack = []

    out = []
    stack = []

    i = 0
    while i < len(tokens):
        tok = tokens[i]

        if tok == b"q":
            ctm_stack.append(list(ctm))
            out.append("q\n")
            i += 1
            stack.clear()
        elif tok == b"Q":
            if ctm_stack:
                ctm = ctm_stack.pop()
            out.append("Q\n")
            i += 1
            stack.clear()
        elif tok == b"cm":
            if len(stack) >= 6:
                m_op = [
                    float(stack[-6]),
                    float(stack[-5]),
                    float(stack[-4]),
                    float(stack[-3]),
                    float(stack[-2]),
                    float(stack[-1]),
                ]
                stack = stack[:-6]

                # Look ahead until next Q to see if this cm is for an XObject image
                has_do = False
                for k in range(i + 1, min(i + 25, len(tokens))):
                    if tokens[k] == b"Do":
                        has_do = True
                        break
                    if tokens[k] == b"Q":
                        break

                if has_do:
                    # Image matrix: transform through ctm
                    m_net = mat_mult(m_op, ctm)
                    a_img = abs(m_net[0])
                    d_img = abs(m_net[3])
                    e_img = m_net[4]
                    f_img = m_net[5]
                    out.append(f"{a_img:.4f} 0.0000 0.0000 {d_img:.4f} {e_img:.4f} {f_img:.4f} cm\n")
                else:
                    # Coordinate transform matrix (Skia root or CSS scale)
                    # Absorb into ctm without emitting inverted cm
                    ctm = mat_mult(m_op, ctm)
            i += 1
        elif tok == b"BT":
            # Collect entire text block until ET
            bt_tokens = [tok]
            i += 1
            while i < len(tokens) and tokens[i] != b"ET":
                bt_tokens.append(tokens[i])
                i += 1
            if i < len(tokens):
                bt_tokens.append(tokens[i])
                i += 1

            # Process BT block
            font_res = "F10"
            font_size = 12.0
            for j in range(len(bt_tokens)):
                if bt_tokens[j] == b"Tf" and j >= 2:
                    font_res = bt_tokens[j - 2].decode("ascii", errors="replace").lstrip("/")
                    font_size = float(bt_tokens[j - 1])

            # Map font name to Type 1: /F (bold) or /F0 (regular)
            base_font_name = font_names.get(font_res, "")
            if "Bold" in base_font_name or "bold" in base_font_name.lower() or font_res in ("F10", "F"):
                out_font = "/F"
            else:
                out_font = "/F0"

            # Scale font size by ctm scale
            scale_y = abs(ctm[3]) if ctm[3] != 0 else 1.0
            scaled_size = font_size * scale_y

            # Find text position from Tm or Td
            xt, yt = 0.0, 0.0
            has_pos = False
            for j in range(len(bt_tokens)):
                if bt_tokens[j] == b"Tm" and j >= 6:
                    xt = float(bt_tokens[j - 2])
                    yt = float(bt_tokens[j - 1])
                    has_pos = True
                    break
                elif bt_tokens[j] in (b"Td", b"TD") and j >= 2:
                    xt = float(bt_tokens[j - 2])
                    yt = float(bt_tokens[j - 1])
                    has_pos = True
                    break

            # Transform baseline point through ctm
            if has_pos:
                X_base, Y_base = transform_point(xt, yt, ctm)
            else:
                X_base, Y_base = 0.0, 0.0

            # Extract and decode text string from Tj or TJ
            cmap = font_cmaps.get(font_res, {})
            text_chars = []
            for j in range(len(bt_tokens)):
                tok_j = bt_tokens[j]
                if tok_j == b"Tj" and j >= 1:
                    str_tok = bt_tokens[j - 1]
                    if str_tok.startswith(b"<") and str_tok.endswith(b">"):
                        text_chars.append(decode_hex_string(str_tok, cmap))
                    elif str_tok.startswith(b"(") and str_tok.endswith(b")"):
                        text_chars.append(unescape_pdf_literal(str_tok))
                elif tok_j == b"TJ" and j >= 1:
                    k = j - 1
                    while k >= 0 and bt_tokens[k] != b"[":
                        k -= 1
                    if k >= 0:
                        for atok in bt_tokens[k + 1 : j]:
                            if atok.startswith(b"<") and atok.endswith(b">"):
                                text_chars.append(decode_hex_string(atok, cmap))
                            elif atok.startswith(b"(") and atok.endswith(b")"):
                                text_chars.append(unescape_pdf_literal(atok))

            text_str = "".join(text_chars)
            escaped_str = escape_pdf_string(text_str)

            clean_str = "".join(UNICODE_TO_ASCII_MAP.get(c, c) for c in text_str)
            if out_font == "/F" and bold_chars is not None:
                bold_chars.update(clean_str)
            elif out_font == "/F0" and reg_chars is not None:
                reg_chars.update(clean_str)

            # Emit normalized, upright text block
            out.append("BT\n")
            out.append(f"{out_font} {scaled_size:.2f} Tf\n")
            out.append(f"1 0 0 1 {X_base:.4f} {Y_base:.4f} Tm\n")
            out.append(f"({escaped_str}) Tj\n")
            out.append("ET\n")
            stack.clear()
        elif tok == b"re":
            if len(stack) >= 4:
                rx = float(stack[-4])
                ry = float(stack[-3])
                rw = float(stack[-2])
                rh = float(stack[-1])
                stack = stack[:-4]

                p1 = transform_point(rx, ry, ctm)
                p2 = transform_point(rx + rw, ry + rh, ctm)
                xmin = min(p1[0], p2[0])
                ymin = min(p1[1], p2[1])
                w = abs(p2[0] - p1[0])
                h = abs(p2[1] - p1[1])
                out.append(f"{xmin:.4f} {ymin:.4f} {w:.4f} {h:.4f} re\n")
            i += 1
        elif tok == b"m":
            if len(stack) >= 2:
                mx = float(stack[-2])
                my = float(stack[-1])
                stack = stack[:-2]
                pt = transform_point(mx, my, ctm)
                out.append(f"{pt[0]:.4f} {pt[1]:.4f} m\n")
            i += 1
        elif tok == b"l":
            if len(stack) >= 2:
                lx = float(stack[-2])
                ly = float(stack[-1])
                stack = stack[:-2]
                pt = transform_point(lx, ly, ctm)
                out.append(f"{pt[0]:.4f} {pt[1]:.4f} l\n")
            i += 1
        elif tok == b"c":
            if len(stack) >= 6:
                c_pts = [float(x) for x in stack[-6:]]
                stack = stack[:-6]
                p1 = transform_point(c_pts[0], c_pts[1], ctm)
                p2 = transform_point(c_pts[2], c_pts[3], ctm)
                p3 = transform_point(c_pts[4], c_pts[5], ctm)
                out.append(f"{p1[0]:.4f} {p1[1]:.4f} {p2[0]:.4f} {p2[1]:.4f} {p3[0]:.4f} {p3[1]:.4f} c\n")
            i += 1
        elif tok == b"w":
            if len(stack) >= 1:
                lw = float(stack[-1]) * abs(ctm[0])
                stack = stack[:-1]
                out.append(f"{lw:.4f} w\n")
            i += 1
        elif tok in (b"f", b"f*", b"S", b"s", b"B", b"B*", b"b", b"b*", b"h", b"n", b"W", b"W*"):
            out.append(f"{tok.decode('ascii')}\n")
            i += 1
            stack.clear()
        elif tok in (b"rg", b"RG"):
            if len(stack) >= 3:
                out.append(
                    f"{stack[-3].decode('ascii')} {stack[-2].decode('ascii')} {stack[-1].decode('ascii')} {tok.decode('ascii')}\n"
                )
                stack = stack[:-3]
            i += 1
        elif tok in (b"g", b"G"):
            if len(stack) >= 1:
                out.append(f"{stack[-1].decode('ascii')} {tok.decode('ascii')}\n")
                stack = stack[:-1]
            i += 1
        elif tok in (b"k", b"K"):
            if len(stack) >= 4:
                out.append(
                    f"{stack[-4].decode('ascii')} {stack[-3].decode('ascii')} {stack[-2].decode('ascii')} {stack[-1].decode('ascii')} {tok.decode('ascii')}\n"
                )
                stack = stack[:-4]
            i += 1
        elif tok == b"gs":
            if len(stack) >= 1:
                out.append(f"{stack[-1].decode('ascii')} gs\n")
                stack = stack[:-1]
            i += 1
        elif tok == b"Do":
            if len(stack) >= 1:
                out.append(f"{stack[-1].decode('ascii')} Do\n")
                stack = stack[:-1]
            i += 1
        elif tok in (b"BDC", b"BMC", b"EMC"):
            if tok == b"EMC":
                out.append("EMC\n")
            elif tok == b"BDC":
                args_str = " ".join(t.decode("latin1") for t in stack)
                out.append(f"{args_str} BDC\n")
                stack.clear()
            i += 1
        else:
            stack.append(tok)
            i += 1

    return "".join(out).encode("latin1")


def reencode_vector_stream(
    input_pdf_path: str,
    output_pdf_path: str,
    metadata: dict[str, str] | None = None,
    profile: str = "quadient",
    creation_date: str = "D:20241211102447",
    download_time: str | None = None,
) -> str:
    """
    Normalizes a vector PDF:
    - Strips Skia inverted transformation matrices.
    - Normalizes all drawing and text coordinates to standard bottom-left Cartesian (0,0).
    - Replaces Type 0 composite CIDFonts with Adobe Type 1 ArialMT / Arial-BoldMT.
    - Embeds complete 256-glyph CFF font streams (/FontFile3 /Subtype /Type1C).
    - Defragments text runs into cohesive string drawing operators.
    Returns output_pdf_path.
    """
    if not os.path.exists(input_pdf_path):
        raise FileNotFoundError(f"Input PDF does not exist: {input_pdf_path}")

    # Load complete base CFF font streams
    base_bold_cff_bytes, base_reg_cff_bytes = load_cff_streams()

    doc = pymupdf.open(input_pdf_path)

    bold_used_chars: set[str] = set()
    reg_used_chars: set[str] = set()
    page_normalized_contents = []

    # Pass 1: Normalize all page contents and gather used character sets for /F and /F0
    for pno in range(len(doc)):
        page = doc[pno]
        font_cmaps = {}
        font_names = {}
        for f in page.get_fonts():
            fx = f[0]
            fo = doc.xref_object(fx)
            fr = f[4]
            fn = f[3]
            font_names[fr] = fn
            m = re.search(r"/ToUnicode\s+(\d+)\s+0\s+R", fo)
            if m:
                cx = int(m.group(1))
                cs = doc.xref_stream(cx).decode("latin1", errors="replace")
                font_cmaps[fr] = parse_cmap(cs)

        contents_list = page.get_contents()
        if not contents_list:
            page_normalized_contents.append(None)
            continue

        raw_content = b"".join(doc.xref_stream(c) for c in contents_list)
        normalized_content = normalize_page_content(
            raw_content,
            font_cmaps,
            font_names,
            page_height=page.rect.height,
            bold_chars=bold_used_chars,
            reg_chars=reg_used_chars,
        )
        page_normalized_contents.append(normalized_content)

    # Dynamic CFF Font Subsetting: Prune CharStrings, Charset, and Widths to ~70-85 used glyphs
    bold_cff_bytes = subset_cff(base_bold_cff_bytes, bold_used_chars)
    reg_cff_bytes = subset_cff(base_reg_cff_bytes, reg_used_chars)

    fc_b, lc_b, widths_bold = get_subset_type1_widths("hebo", bold_used_chars)
    fc_r, lc_r, widths_reg = get_subset_type1_widths("helv", reg_used_chars)

    bold_widths_str = " ".join(str(w) for w in widths_bold)
    reg_widths_str = " ".join(str(w) for w in widths_reg)

    # Embed Standard Type 1 Font: Arial-BoldMT (dynamically subsetted CFF stream)
    bold_ff_xref = doc.get_new_xref()
    doc.update_object(bold_ff_xref, "<< /Subtype /Type1C >>")
    doc.update_stream(bold_ff_xref, bold_cff_bytes)

    bold_fd_xref = doc.get_new_xref()
    doc.update_object(
        bold_fd_xref,
        f"""<<
  /Type /FontDescriptor
  /FontName /Arial-BoldMT
  /FontBBox [ -2 -210 941 773 ]
  /Flags 32
  /CapHeight 0
  /Ascent 0
  /Descent 0
  /StemV 50
  /ItalicAngle 0
  /FontFile3 {bold_ff_xref} 0 R
>>""",
    )

    bold_font_xref = doc.get_new_xref()
    doc.update_object(
        bold_font_xref,
        f"""<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Arial-BoldMT
  /FirstChar {fc_b}
  /LastChar {lc_b}
  /Widths [ {bold_widths_str} ]
  /FontDescriptor {bold_fd_xref} 0 R
>>""",
    )

    # Embed Standard Type 1 Font: ArialMT (dynamically subsetted CFF stream)
    reg_ff_xref = doc.get_new_xref()
    doc.update_object(reg_ff_xref, "<< /Subtype /Type1C >>")
    doc.update_stream(reg_ff_xref, reg_cff_bytes)

    reg_fd_xref = doc.get_new_xref()
    doc.update_object(
        reg_fd_xref,
        f"""<<
  /Type /FontDescriptor
  /FontName /ArialMT
  /FontBBox [ -46 -210 980 782 ]
  /Flags 32
  /CapHeight 0
  /Ascent 0
  /Descent 0
  /StemV 50
  /ItalicAngle 0
  /FontFile3 {reg_ff_xref} 0 R
>>""",
    )

    reg_font_xref = doc.get_new_xref()
    doc.update_object(
        reg_font_xref,
        f"""<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /ArialMT
  /FirstChar {fc_r}
  /LastChar {lc_r}
  /Widths [ {reg_widths_str} ]
  /FontDescriptor {reg_fd_xref} 0 R
>>""",
    )

    # Strip any /SMask references from image XObjects
    for xref in range(1, doc.xref_length()):
        try:
            if doc.xref_is_image(xref):
                smask = doc.xref_get_key(xref, "SMask")
                if smask and smask[0] != "null":
                    doc.xref_set_key(xref, "SMask", "null")
        except Exception:
            pass

    # Pass 2: Update primary contents stream and /Resources /Font with normalized content
    for pno in range(len(doc)):
        normalized_content = page_normalized_contents[pno]
        if normalized_content is None:
            continue

        page = doc[pno]
        contents_list = page.get_contents()
        contents_xref = contents_list[0]
        doc.update_stream(contents_xref, normalized_content)

        # If there were multiple content streams, point page to only the first one
        page_obj_str = doc.xref_object(page.xref)
        if len(contents_list) > 1:
            page_obj_str = re.sub(r"/Contents\s*\[[\s\S]*?\]", f"/Contents {contents_xref} 0 R", page_obj_str)

        # Update /Resources /Font to Quadient Inspire Type 1 fonts
        new_font_dict = f"/Font << /F {bold_font_xref} 0 R /F0 {reg_font_xref} 0 R >>"
        if re.search(r"/Font\s*<<[\s\S]*?>>", page_obj_str):
            page_obj_str = re.sub(r"/Font\s*<<[\s\S]*?>>", new_font_dict, page_obj_str)
        else:
            # Insert into /Resources
            page_obj_str = re.sub(r"/Resources\s*<<", f"/Resources << {new_font_dict}", page_obj_str)

        doc.update_object(page.xref, page_obj_str)

    # Initial save through PyMuPDF
    abs_output = os.path.abspath(output_pdf_path)
    os.makedirs(os.path.dirname(abs_output), exist_ok=True)
    temp_raw = abs_output + ".raw.tmp.pdf"

    doc.save(temp_raw, garbage=3, deflate=True)
    doc.close()

    # Post-process with pypdf to:
    # 1. Eliminate '% Written by MuPDF' header comments and rebuild pristine xref table
    # 2. Inject authentic Quadient Inspire or ULURO metadata
    # 3. Ensure no trailing XMP streams with virtual printer signatures
    reader = pypdf.PdfReader(temp_raw)
    writer = pypdf.PdfWriter()

    for p in reader.pages:
        writer.add_page(p)

    if metadata:
        clean_metadata = {
            (k if k.startswith("/") else f"/{k[0].upper()}{k[1:]}"): v
            for k, v in metadata.items()
        }
        writer.add_metadata(clean_metadata)
    elif profile == "quadient":
        writer.add_metadata({
            "/Creator": "Quadient Group AG~Inspire~12.0.85.0",
            "/Producer": "",
            "/CreationDate": creation_date,
            "/ModDate": "",
        })
    else:
        writer.add_metadata({
            "/Title": "",
            "/Author": "ULURO PDF 4.0.1.17",
            "/Subject": "None",
            "/Keywords": "ULURO",
            "/Creator": "ULURO",
            "/Producer": "ULURO (www.uluro.com)",
            "/CreationDate": creation_date,
            "/ModDate": "",
        })

    # Generate authentic cryptographic trailer /ID
    # ID1: document identity hash, ID2: revision hash
    id_seed = f"{os.path.basename(output_pdf_path)}:{creation_date}"
    id1_bytes = hashlib.md5(id_seed.encode("utf-8") + b":doc").digest()
    id2_bytes = hashlib.md5(id_seed.encode("utf-8") + b":rev1").digest()
    writer._ID = ArrayObject([ByteStringObject(id1_bytes), ByteStringObject(id2_bytes)])

    temp_clean = abs_output + ".clean.tmp.pdf"
    with open(temp_clean, "wb") as f_out:
        writer.write(f_out)

    if os.path.exists(temp_raw):
        try:
            os.remove(temp_raw)
        except Exception:
            pass

    # Post-process with pikepdf to generate authentic enterprise compressed XRef and object streams
    try:
        import pikepdf
        pdf = pikepdf.open(temp_clean)
        if metadata:
            for k, v in metadata.items():
                clean_k = k if k.startswith("/") else f"/{k[0].upper()}{k[1:]}"
                pdf.docinfo[clean_k] = v
        elif profile == "quadient":
            pdf.docinfo['/Creator'] = 'Quadient Group AG~Inspire~12.0.85.0'
            pdf.docinfo['/Producer'] = ''
        temp_qpdf = abs_output + ".qpdf.tmp.pdf"
        pdf.save(temp_qpdf, linearize=True, object_stream_mode=pikepdf.ObjectStreamMode.generate, min_version="1.5")
        pdf.close()
        if os.path.exists(temp_clean):
            try:
                os.remove(temp_clean)
            except Exception:
                pass
        temp_clean = temp_qpdf
    except Exception as e:
        print(f"Warning: pikepdf post-processing skipped: {e}")

    # Replace destination with retry for transient Windows file locks (e.g. indexers, AV, viewers)
    success = False
    for attempt in range(5):
        try:
            if os.path.exists(abs_output):
                try:
                    os.remove(abs_output)
                except Exception:
                    pass
            if not os.path.exists(abs_output):
                os.rename(temp_clean, abs_output)
                success = True
                break
            else:
                import shutil
                shutil.copyfile(temp_clean, abs_output)
                try:
                    os.remove(temp_clean)
                except Exception:
                    pass
                success = True
                break
        except Exception as e:
            if attempt < 4:
                import time
                time.sleep(0.5)
            else:
                raise e

    # Synchronize physical OS filesystem timestamp to download session timestamp or PDF CreationDate
    sync_filesystem_timestamp(abs_output, download_time or creation_date)

    return output_pdf_path



def main():
    parser = argparse.ArgumentParser(description="Native Vector Stream Re-Encoder Normalizer")
    parser.add_argument("input_pdf", help="Path to input vector PDF")
    parser.add_argument("output_pdf", help="Path to destination re-encoded PDF")
    args = parser.parse_args()

    out = reencode_vector_stream(args.input_pdf, args.output_pdf)
    print(f"Successfully re-encoded vector stream: {out}")


if __name__ == "__main__":
    main()
