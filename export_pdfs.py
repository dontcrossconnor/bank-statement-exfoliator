"""
Multi-Route Statement PDF Exporter (Requirement R3)
[export_pdfs.py](file:///e:/StatementGen/export_pdfs.py)

Integrates three selectable PDF generation routes:
- 'vector': Standard Chromium vector print with official ULURO metadata.
- 'uluro-image-wrapped': Authentic 1:1 ULURO image-wrapped container matching 11-30-24.pdf (via uluro_pdf_container).
- 'native-vector-reencoded': Native vector stream normalized to Adobe Type 1 fonts without Skia matrices (via native_vector_reencoder).
- 'all': Generates all three variants.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
from typing import Sequence

import pymupdf
import pypdf
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from uluro_pdf_container import convert_pdf_to_uluro_container
from native_vector_reencoder import reencode_vector_stream, sync_filesystem_timestamp

# Core Scenarios and canonical configurations
CORE_SCENARIOS = {
    "us1364_november_scenario": {
        "creation_date": "D:20241211102447",
        "default_output": "US_1364_Federal_Credit_Union_Statement_November_2024_1to1.pdf",
        "mode": "vector",
    },
    "us1364_heavy_3page_scenario": {
        "creation_date": "D:20241211102447",
        "default_output": "US_1364_FCU_Statement_Expanded_3Page.pdf",
        "mode": "vector",
    },
    "us1364_massive_42tx_scenario": {
        "creation_date": "D:20241211102447",
        "default_output": "US_1364_FCU_Statement_Massive_3Page.pdf",
        "mode": "vector",
    },
    "us1364_aziz_june_2026_scenario": {
        "creation_date": "D:20260701031422Z",
        "download_time": "2026-09-21 13:12:15",
        "default_output": "US_1364_FCU_Statement_June_2026_Aziz_Berjis.pdf",
        "mode": "native-vector-reencoded",
    },
    "us1364_aziz_july_2026_scenario": {
        "creation_date": "D:20260801031845Z",
        "download_time": "2026-09-21 13:13:13",
        "default_output": "US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf",
        "mode": "native-vector-reencoded",
    },
    "us1364_aziz_august_2026_scenario": {
        "creation_date": "D:20260901032110Z",
        "download_time": "2026-09-21 13:14:27",
        "default_output": "US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf",
        "mode": "native-vector-reencoded",
    },
}

SUPPORTED_MODES = ["vector", "uluro-image-wrapped", "native-vector-reencoded", "all"]


def _is_valid_scenario(scenario_id: str) -> bool:
    """Validates if scenario_id is known or declared in preset data."""
    if scenario_id in CORE_SCENARIOS:
        return True
    known_other = {
        "us1364_hashmi_august_scenario",
        "us1364_hashmi_september_scenario",
        "us1364_hashmi_2month_scenario",
        "hingham_3month_scenario",
        "hingham_scenario",
        "us_metro_scenario",
        "personal_checking",
        "fictional_credit_union",
    }
    if scenario_id in known_other:
        return True
    institutions_path = os.path.join(BASE_DIR, "src", "data", "institutions.js")
    if os.path.exists(institutions_path):
        try:
            with open(institutions_path, "r", encoding="utf-8") as f:
                src = f.read()
            if f"id: '{scenario_id}'" in src or f'id: "{scenario_id}"' in src:
                return True
        except Exception:
            pass
    return False


def _detect_active_port(preferred_port: int = 5176) -> int:
    if preferred_port != 5176:
        return preferred_port
    import urllib.request
    candidate_ports = [preferred_port, 5174, 5173, 5175, 5177]
    for p in candidate_ports:
        try:
            with urllib.request.urlopen(f"http://localhost:{p}/", timeout=0.5) as resp:
                if resp.status == 200:
                    return p
        except Exception:
            pass
    return preferred_port


def _export_vector_pdf(
    scenario_id: str,
    output_path: str,
    creation_date: str = "D:20241211102447",
    profile: str = "uluro",
    port: int = 5176,
) -> str:
    """Generates Playwright vector PDF and injects official metadata."""
    abs_output = os.path.abspath(output_path)
    out_dir = os.path.dirname(abs_output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    active_port = _detect_active_port(port)
    print(f"=== Exporting Vector Scenario: {scenario_id} ===")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        url = f"http://localhost:{active_port}/?scenario={scenario_id}"
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="networkidle", timeout=15000)
        page.wait_for_timeout(2000)

        page.emulate_media(media="print")
        page.pdf(
            path=abs_output,
            format="Letter",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        browser.close()
        print(f"Playwright vector print saved: {abs_output}")

    # Inject authentic official statement metadata
    temp_meta_path = abs_output + ".meta.tmp.pdf"
    with open(abs_output, "rb") as f_in:
        reader = pypdf.PdfReader(f_in)
        writer = pypdf.PdfWriter()
        for pg in reader.pages:
            writer.add_page(pg)

        if profile == "quadient":
            meta = {
                "/Creator": "Quadient Group AG~Inspire~12.0.85.0",
                "/Producer": "",
                "/CreationDate": creation_date,
                "/ModDate": "",
            }
        else:
            meta = {
                "/Title": "",
                "/Author": "ULURO PDF 4.0.1.17",
                "/Subject": "None",
                "/Keywords": "ULURO",
                "/Creator": "ULURO",
                "/Producer": "ULURO (www.uluro.com)",
                "/CreationDate": creation_date,
                "/ModDate": "",
            }
        writer.add_metadata(meta)
        with open(temp_meta_path, "wb") as f_out:
            writer.write(f_out)

    if os.path.exists(abs_output):
        os.remove(abs_output)
    os.rename(temp_meta_path, abs_output)
    print(f"Injected authentic {profile} metadata into {abs_output}")

    # Verify with PyMuPDF
    doc = pymupdf.open(abs_output)
    print(
        f"Verified {abs_output}: {len(doc)} pages, text_chars={sum(len(p.get_text()) for p in doc)}, producer={doc.metadata.get('producer')}"
    )
    doc.close()

    return abs_output


def export_statement(
    scenario_id: str,
    output_path: str,
    mode: str = "native-vector-reencoded",
    creation_date: str = "D:20241211102447",
    download_time: str | None = None,
    port: int = 5176,
) -> str | list[str]:
    """
    Unified export function routing cleanly to the chosen generation engine.

    Args:
        scenario_id: Identifier of the financial statement scenario.
        output_path: Target output filepath.
        mode: Route choice ('vector', 'uluro-image-wrapped', 'native-vector-reencoded', 'all').
        creation_date: PDF date string (default canonical: D:20241211102447).
        download_time: Optional filesystem session download timestamp (e.g. '2026-09-21 13:12:15').
        port: Local dev server Vite port (default 5176).

    Returns:
        Path of generated PDF (str), or list of paths if mode='all'.
    """
    if not _is_valid_scenario(scenario_id):
        raise ValueError(
            f"Invalid or unknown scenario_id '{scenario_id}'. Expected one of core scenarios: "
            f"{list(CORE_SCENARIOS.keys())}"
        )

    if mode not in SUPPORTED_MODES:
        raise ValueError(
            f"Unsupported mode '{mode}'. Supported modes are: {SUPPORTED_MODES}"
        )

    # Use scenario-specific creation date if default was passed and scenario has specific date
    if creation_date == "D:20241211102447" and scenario_id in CORE_SCENARIOS:
        creation_date = CORE_SCENARIOS[scenario_id].get("creation_date", creation_date)

    if download_time is None and scenario_id in CORE_SCENARIOS:
        download_time = CORE_SCENARIOS[scenario_id].get("download_time", None)

    abs_output = os.path.abspath(output_path)
    out_dir = os.path.dirname(abs_output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    if mode == "vector":
        res = _export_vector_pdf(scenario_id, abs_output, creation_date=creation_date, port=port)
        sync_filesystem_timestamp(abs_output, download_time or creation_date)
        return res

    elif mode == "uluro-image-wrapped":
        temp_vec = abs_output + ".vec_tmp.pdf"
        try:
            _export_vector_pdf(scenario_id, temp_vec, creation_date=creation_date, port=port)
            convert_pdf_to_uluro_container(temp_vec, abs_output, creation_date=creation_date)
            sync_filesystem_timestamp(abs_output, download_time or creation_date)
        finally:
            if os.path.exists(temp_vec):
                try:
                    os.remove(temp_vec)
                except Exception:
                    pass
        return abs_output

    elif mode == "native-vector-reencoded":
        temp_vec = abs_output + ".vec_tmp.pdf"
        try:
            _export_vector_pdf(scenario_id, temp_vec, creation_date=creation_date, port=port)
            reencode_vector_stream(
                temp_vec,
                abs_output,
                creation_date=creation_date,
                download_time=download_time,
                profile="quadient"
            )
            sync_filesystem_timestamp(abs_output, download_time or creation_date)
        finally:
            if os.path.exists(temp_vec):
                try:
                    os.remove(temp_vec)
                except Exception:
                    pass
        return abs_output

    elif mode == "all":
        root, ext = os.path.splitext(abs_output)
        if not ext:
            ext = ".pdf"
        vec_path = f"{root}_vector{ext}"
        uluro_path = f"{root}_uluro{ext}"
        reencoded_path = f"{root}_reencoded{ext}"

        # 1. Vector export
        _export_vector_pdf(scenario_id, vec_path, creation_date=creation_date, port=port)

        # 2. 1:1 ULURO container
        convert_pdf_to_uluro_container(vec_path, uluro_path, creation_date=creation_date)

        # 3. Native vector re-encoded
        reencode_vector_stream(vec_path, reencoded_path, creation_date=creation_date, profile="quadient")

        # Ensure base output_path exists
        if os.path.abspath(output_path) != os.path.abspath(vec_path):
            shutil.copyfile(vec_path, abs_output)

        return [vec_path, uluro_path, reencoded_path]

    else:
        raise ValueError(f"Unhandled mode '{mode}'")


def export_scenario_pdf(scenario_id, output_path, creation_date="D:20241211102447", port=5176):
    """Backwards-compatible wrapper for export_scenario_pdf."""
    return export_statement(
        scenario_id=scenario_id,
        output_path=output_path,
        mode="vector",
        creation_date=creation_date,
        port=port,
    )


def main():
    parser = argparse.ArgumentParser(
        description="Selectable Multi-Route Financial Statement PDF Exporter"
    )
    parser.add_argument(
        "--mode",
        choices=["vector", "uluro-image-wrapped", "native-vector-reencoded", "all"],
        default=None,
        help="Export generation route mode (default: scenario-specific mode, e.g. vector for baseline, native-vector-reencoded for enterprise)",
    )
    parser.add_argument(
        "--scenario",
        default=None,
        help="Scenario ID to export (default: executes all 4 core scenarios)",
    )
    parser.add_argument(
        "--output",
        "-o",
        default=None,
        help="Custom output filepath (applicable when single scenario is specified)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=5176,
        help="Local dev server Vite port (default: 5176)",
    )
    args = parser.parse_args()

    if args.scenario:
        output_path = args.output
        if not output_path:
            info = CORE_SCENARIOS.get(args.scenario)
            if info:
                output_path = os.path.join(BASE_DIR, info["default_output"])
            else:
                output_path = os.path.join(BASE_DIR, f"{args.scenario}.pdf")

        info = CORE_SCENARIOS.get(args.scenario, {})
        creation_date = info.get("creation_date", "D:20241211102447")
        download_time = info.get("download_time")
        sc_mode = args.mode if args.mode is not None else info.get("mode", "native-vector-reencoded")
        print(f"Exporting scenario '{args.scenario}' with mode='{sc_mode}' to '{output_path}'...")
        res = export_statement(
            scenario_id=args.scenario,
            output_path=output_path,
            mode=sc_mode,
            creation_date=creation_date,
            download_time=download_time,
            port=args.port,
        )
        print(f"Export completed: {res}")
    else:
        print(f"Executing all core scenarios (mode override: {args.mode}) on port {args.port}...")
        for sc_id, sc_info in CORE_SCENARIOS.items():
            if args.output:
                root, ext = os.path.splitext(args.output)
                if not ext:
                    ext = ".pdf"
                out_path = f"{root}_{sc_id}{ext}"
            else:
                out_path = os.path.join(BASE_DIR, sc_info["default_output"])

            sc_mode = args.mode if args.mode is not None else sc_info.get("mode", "native-vector-reencoded")
            print(f"\n--> Scenario: {sc_id} (mode={sc_mode}) -> {out_path}")
            res = export_statement(
                scenario_id=sc_id,
                output_path=out_path,
                mode=sc_mode,
                creation_date=sc_info["creation_date"],
                download_time=sc_info.get("download_time"),
                port=args.port,
            )
            print(f"    Result: {res}")


if __name__ == "__main__":
    main()
