"""
Adversarial Stress Test Suite - Challenger 2 (Empirical Adversarial Testing - R3 & R4)
[tests/test_adversarial_challenger2.py](file:///e:/StatementGen/tests/test_adversarial_challenger2.py)

Empirically tests:
1. Forensic Auditor (compare_uluro_container_forensics.py) against adversarial mutations:
   - Layer 5: Binary injection of b"Skia" or b"Chromium" (plus WebKit, Cairo, PDFium)
   - Layer 2: Image stream mutations (wrong raw byte size, mutated width, mutated height)
   - Layer 3: Dummy font injection into PDF page
   - Layer 4: Mutated trailer /ID (mismatched IDs, malformed hex, missing /ID)
   - Overall auditor runner behavior on mutated containers
2. Exporter pipeline and CLI (export_pdfs.py):
   - Unsupported mode raises ValueError
   - CLI --mode validation with unsupported mode raises argparse SystemExit
   - Invalid scenario raises ValueError
   - CLI --scenario validation with invalid scenario exits non-zero
   - Valid scenario across all routes ('vector', 'uluro-image-wrapped', 'native-vector-reencoded', 'all')
3. Visual Verification Script (verify_all_statement_pages.py):
   - All 4 statements pass with 0px edge delta at 300 DPI
"""

import os
import re
import shutil
import subprocess
import sys
import tempfile
import pytest
import pymupdf

import compare_uluro_container_forensics as cucf
from export_pdfs import export_statement, SUPPORTED_MODES
from verify_all_statement_pages import verify_pdf, PDF_LIST


@pytest.fixture(scope="module")
def valid_uluro_candidate_path():
    """Provides path to an authentic valid ULURO candidate container PDF."""
    path = cucf.resolve_default_candidate()
    assert os.path.exists(path), f"Candidate PDF not found: {path}"
    return path


# =============================================================================
# 1. ADVERSARIAL MUTATION TESTS AGAINST 6-LAYER FORENSIC AUDITOR
# =============================================================================

def test_layer5_adversarial_skia_injection(valid_uluro_candidate_path, tmp_path):
    """
    Mutate valid ULURO PDF bytes to inject b"Skia" -> verify Layer 5 catches and rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    mutated_pdf = str(tmp_path / "injected_skia.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(data + b"\n% Adversarial injection: Skia engine marker\n")

    # Layer 5 audit directly
    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_5_engine_marker_absence(mutated_pdf)
    assert "Layer 5 Fail" in str(excinfo.value)
    assert "Skia" in str(excinfo.value)

    # 6-layer audit runner
    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_5_engine_markers"]["pass"] is False
    assert "Skia" in report["layers"]["layer_5_engine_markers"]["error"]


def test_layer5_adversarial_chromium_injection(valid_uluro_candidate_path, tmp_path):
    """
    Mutate valid ULURO PDF bytes to inject b"Chromium" -> verify Layer 5 catches and rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    mutated_pdf = str(tmp_path / "injected_chromium.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(data + b"\n% Adversarial injection: Chromium engine marker\n")

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_5_engine_marker_absence(mutated_pdf)
    assert "Layer 5 Fail" in str(excinfo.value)
    assert "Chromium" in str(excinfo.value)

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_5_engine_markers"]["pass"] is False
    assert "Chromium" in report["layers"]["layer_5_engine_markers"]["error"]


@pytest.mark.parametrize("prohibited_marker", [b"WebKit", b"Cairo", b"PDFium"])
def test_layer5_adversarial_other_engine_markers(valid_uluro_candidate_path, tmp_path, prohibited_marker):
    """
    Mutate valid ULURO PDF bytes to inject WebKit, Cairo, or PDFium -> verify Layer 5 rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    mutated_pdf = str(tmp_path / f"injected_{prohibited_marker.decode('ascii')}.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(data + b"\n% Marker: " + prohibited_marker + b"\n")

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_5_engine_marker_absence(mutated_pdf)
    assert "Layer 5 Fail" in str(excinfo.value)
    assert prohibited_marker.decode("ascii") in str(excinfo.value)


def test_layer2_adversarial_wrong_raw_stream_size(valid_uluro_candidate_path, tmp_path):
    """
    Mutate image stream to wrong raw byte size -> verify Layer 2 rejects.
    """
    mutated_pdf = str(tmp_path / "wrong_raw_size.pdf")
    doc = pymupdf.open(valid_uluro_candidate_path)
    # Truncate image stream on object 1 to short corrupted buffer
    doc.update_stream(1, b"corrupted_short_stream")
    doc.save(mutated_pdf)
    doc.close()

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_2_image_geometry(mutated_pdf)
    assert "Layer 2 Fail" in str(excinfo.value)
    assert "uncompressed stream size" in str(excinfo.value)

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_2_image_geometry"]["pass"] is False


def test_layer2_adversarial_mutated_width(valid_uluro_candidate_path, tmp_path):
    """
    Mutate image XObject width from 2550 to non-2550 (e.g. 2000) -> verify Layer 2 rejects.
    """
    mutated_pdf = str(tmp_path / "mutated_width.pdf")
    doc = pymupdf.open(valid_uluro_candidate_path)
    doc.xref_set_key(1, "Width", "2000")
    doc.save(mutated_pdf)
    doc.close()

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_2_image_geometry(mutated_pdf)
    assert "Layer 2 Fail" in str(excinfo.value)
    assert "image width 2000 != 2550" in str(excinfo.value)

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_2_image_geometry"]["pass"] is False


def test_layer2_adversarial_mutated_height(valid_uluro_candidate_path, tmp_path):
    """
    Mutate image XObject height from 3300 to non-3300 (e.g. 3000) -> verify Layer 2 rejects.
    """
    mutated_pdf = str(tmp_path / "mutated_height.pdf")
    doc = pymupdf.open(valid_uluro_candidate_path)
    doc.xref_set_key(1, "Height", "3000")
    doc.save(mutated_pdf)
    doc.close()

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_2_image_geometry(mutated_pdf)
    assert "Layer 2 Fail" in str(excinfo.value)
    assert "image height 3000 != 3300" in str(excinfo.value)

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_2_image_geometry"]["pass"] is False


def test_layer3_adversarial_dummy_font_injection(valid_uluro_candidate_path, tmp_path):
    """
    Add a dummy font into the PDF container -> verify Layer 3 rejects.
    """
    mutated_pdf = str(tmp_path / "injected_dummy_font.pdf")
    doc = pymupdf.open(valid_uluro_candidate_path)
    page = doc[0]
    page.insert_text((72, 72), "Adversarial Font Text", fontname="helv")
    doc.save(mutated_pdf)
    doc.close()

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_3_zero_fonts_and_inversions(mutated_pdf)
    assert "Layer 3 Fail" in str(excinfo.value)
    assert ("embedded font" in str(excinfo.value) or "/Type /Font" in str(excinfo.value))

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_3_zero_fonts"]["pass"] is False


def test_layer4_adversarial_mismatched_trailer_ids(valid_uluro_candidate_path, tmp_path):
    """
    Mutate trailer ID array so id1 != id2 -> verify Layer 4 rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    m = re.search(rb"(/ID\s*\[<[0-9A-Fa-f]{32}>)<([0-9A-Fa-f]{32})>(\])", data)
    assert m is not None, "Trailer /ID array not found in candidate PDF"
    mutated_bytes = data[:m.start(2)] + (b"0" * 32) + data[m.end(2):]

    mutated_pdf = str(tmp_path / "mismatched_trailer_id.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(mutated_bytes)

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_4_metadata_and_trailer_id(mutated_pdf)
    assert "Layer 4 Fail" in str(excinfo.value)
    assert "Trailer /ID array entries do not match" in str(excinfo.value)

    report = cucf.run_6layer_forensics(mutated_pdf)
    assert report["overall_pass"] is False
    assert report["layers"]["layer_4_metadata_trailer"]["pass"] is False


def test_layer4_adversarial_malformed_trailer_id(valid_uluro_candidate_path, tmp_path):
    """
    Mutate trailer ID array into non-hex syntax -> verify Layer 4 rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    m = re.search(rb"/ID\s*\[<[0-9A-Fa-f]{32}><[0-9A-Fa-f]{32}>\]", data)
    assert m is not None
    # Replace with malformed non-hex string
    mutated_bytes = data[:m.start()] + b"/ID [<MALFORMED_NON_HEX><MALFORMED_NON_HEX>]" + data[m.end():]

    mutated_pdf = str(tmp_path / "malformed_trailer_id.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(mutated_bytes)

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_4_metadata_and_trailer_id(mutated_pdf)
    assert "Layer 4 Fail" in str(excinfo.value)
    assert "specification" in str(excinfo.value) or "Trailer /ID" in str(excinfo.value)


def test_layer4_adversarial_missing_trailer_id(valid_uluro_candidate_path, tmp_path):
    """
    Strip trailer /ID completely -> verify Layer 4 rejects.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    m = re.search(rb"/ID\s*\[<[0-9A-Fa-f]{32}><[0-9A-Fa-f]{32}>\]", data)
    assert m is not None
    mutated_bytes = data[:m.start()] + (b" " * len(m.group(0))) + data[m.end():]

    mutated_pdf = str(tmp_path / "missing_trailer_id.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(mutated_bytes)

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_layer_4_metadata_and_trailer_id(mutated_pdf)
    assert "Layer 4 Fail" in str(excinfo.value)
    assert "missing" in str(excinfo.value)


# =============================================================================
# 2. CLI AND PIPELINE ADVERSARIAL AND VALIDATION TESTS
# =============================================================================

def test_cli_unsupported_mode_raises_value_error(tmp_path):
    """
    Calling export_statement with an unsupported mode raises ValueError.
    """
    out_pdf = str(tmp_path / "out.pdf")
    with pytest.raises(ValueError) as excinfo:
        export_statement("us1364_november_scenario", out_pdf, mode="unsupported_route_xyz")
    assert "Unsupported mode" in str(excinfo.value)
    assert "unsupported_route_xyz" in str(excinfo.value)


def test_cli_unsupported_mode_subprocess_error():
    """
    CLI export_pdfs.py with invalid --mode terminates with exit code 2.
    """
    cmd = [sys.executable, "export_pdfs.py", "--mode=unsupported_route_xyz"]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode != 0
    assert "invalid choice" in res.stderr


def test_cli_invalid_scenario_raises_value_error(tmp_path):
    """
    Calling export_statement with an unknown/invalid scenario raises ValueError.
    """
    out_pdf = str(tmp_path / "out.pdf")
    with pytest.raises(ValueError) as excinfo:
        export_statement("completely_fictional_scenario_9999", out_pdf, mode="vector")
    assert "Invalid or unknown scenario_id" in str(excinfo.value)
    assert "completely_fictional_scenario_9999" in str(excinfo.value)


def test_cli_invalid_scenario_subprocess_error():
    """
    CLI export_pdfs.py with invalid --scenario terminates with exit code 1.
    """
    cmd = [sys.executable, "export_pdfs.py", "--scenario=nonexistent_scenario_xyz"]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode != 0
    assert "ValueError" in res.stderr
    assert "nonexistent_scenario_xyz" in res.stderr


def test_export_pipeline_valid_scenario_across_all_modes(tmp_path):
    """
    Verify valid scenario executes cleanly across all 4 modes:
    'vector', 'uluro-image-wrapped', 'native-vector-reencoded', 'all'.
    """
    scenario = "us1364_november_scenario"

    # Mode 1: vector
    p_vec = str(tmp_path / "nov_vector.pdf")
    res_vec = export_statement(scenario, p_vec, mode="vector")
    assert os.path.exists(res_vec)
    assert os.path.getsize(res_vec) > 100000
    doc_vec = pymupdf.open(res_vec)
    assert len(doc_vec) == 2
    assert doc_vec.metadata.get("producer") == "ULURO (www.uluro.com)"
    doc_vec.close()

    # Mode 2: uluro-image-wrapped
    p_uluro = str(tmp_path / "nov_uluro.pdf")
    res_uluro = export_statement(scenario, p_uluro, mode="uluro-image-wrapped")
    assert os.path.exists(res_uluro)
    assert os.path.getsize(res_uluro) > 500000
    doc_uluro = pymupdf.open(res_uluro)
    assert len(doc_uluro) == 2
    # Verify zero fonts in ULURO container
    for p in doc_uluro:
        assert len(p.get_fonts()) == 0
    doc_uluro.close()
    # Verify Layer 5 passes on the exported container
    assert cucf.audit_layer_5_engine_marker_absence(res_uluro)["pass"] is True

    # Mode 3: native-vector-reencoded
    p_reenc = str(tmp_path / "nov_reenc.pdf")
    res_reenc = export_statement(scenario, p_reenc, mode="native-vector-reencoded")
    assert os.path.exists(res_reenc)
    assert os.path.getsize(res_reenc) > 100000
    with open(res_reenc, "rb") as f:
        reenc_bytes = f.read()
    assert b"-.23999999" not in reenc_bytes
    assert b"1 0 0 -1" not in reenc_bytes

    # Mode 4: all
    p_all = str(tmp_path / "nov_bundle.pdf")
    res_all = export_statement(scenario, p_all, mode="all")
    assert isinstance(res_all, list)
    assert len(res_all) == 3
    for p in res_all:
        assert os.path.exists(p)
        assert os.path.getsize(p) > 100000


# =============================================================================
# 3. OPENCV EDGE DELTA VERIFICATION SCRIPT (verify_all_statement_pages.py)
# =============================================================================

def test_verify_all_statement_pages_script_passes():
    """
    Empirically runs verify_all_statement_pages.py and asserts all 4 statements pass with 0px edge delta at 300 DPI.
    """
    for pdf_path in PDF_LIST:
        assert os.path.exists(pdf_path), f"Target statement file missing: {pdf_path}"
        # verify_pdf returns True and raises AssertionError on any delta > 1px at 300 DPI
        passed = verify_pdf(pdf_path)
        assert passed is True, f"Verification failed for {pdf_path}"


def test_verify_all_statement_pages_subprocess():
    """
    Verifies that running python verify_all_statement_pages.py exits 0 and prints completion banner.
    """
    cmd = [sys.executable, "verify_all_statement_pages.py"]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode == 0, f"Script failed with output:\n{res.stdout}\n{res.stderr}"
    assert "ALL 4 STATEMENTS VERIFIED WITH 0px EDGE DELTA!" in res.stdout


# =============================================================================
# 4. FORENSIC AUDITOR CLI & STRICT MODE TESTS
# =============================================================================

def test_forensic_auditor_cli_clean_candidate():
    """
    Running python compare_uluro_container_forensics.py with default clean candidate exits 0.
    """
    cmd = [sys.executable, "compare_uluro_container_forensics.py"]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode == 0
    assert "All 6 forensic audit layers passed" in res.stdout


def test_forensic_auditor_cli_mutated_candidate_fails(valid_uluro_candidate_path, tmp_path):
    """
    Running python compare_uluro_container_forensics.py on an adversarial mutated candidate exits 1.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    mutated_pdf = str(tmp_path / "cli_adversarial_skia.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(data + b"\n% Prohibited Skia marker\n")

    cmd = [sys.executable, "compare_uluro_container_forensics.py", mutated_pdf]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode == 1
    assert "Forensic audit failed" in res.stderr
    assert "Skia" in res.stderr


def test_forensic_auditor_cli_file_not_found():
    """
    Running python compare_uluro_container_forensics.py on a non-existent file exits 2.
    """
    cmd = [sys.executable, "compare_uluro_container_forensics.py", "does_not_exist_file.pdf"]
    res = subprocess.run(cmd, cwd=cucf.PROJECT_ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    assert res.returncode == 2
    assert "not found" in res.stderr or "Error:" in res.stderr


def test_forensic_auditor_strict_mode_raises(valid_uluro_candidate_path, tmp_path):
    """
    audit_uluro_statement with strict=True raises AssertionError immediately when a layer fails.
    """
    with open(valid_uluro_candidate_path, "rb") as f:
        data = f.read()

    mutated_pdf = str(tmp_path / "strict_fail.pdf")
    with open(mutated_pdf, "wb") as f:
        f.write(data + b"\n% Prohibited Chromium marker\n")

    with pytest.raises(AssertionError) as excinfo:
        cucf.audit_uluro_statement(mutated_pdf, strict=True)
    assert "Chromium" in str(excinfo.value)

