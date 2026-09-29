"""
StatementGen Portable Archive Builder
[package_portable_archive.py](file:///e:/StatementGen/package_portable_archive.py)

Creates a clean, portable distribution package of StatementGen:
- Source code, React components, fonts, vector templates
- Python re-encoder, exporter, and verification scripts
- 128-test automated regression suite
- Pre-compiled 3-month canonical PDF statement deliverables
- Turnkey execution scripts and comprehensive documentation
- Excludes node_modules, .git, __pycache__, and temporary scratch files
"""

import os
import shutil
import zipfile
from pathlib import Path

BASE_DIR = Path("E:/StatementGen").resolve()
PORTABLE_DIR = BASE_DIR / "StatementGen_Portable"
ARCHIVE_ZIP = BASE_DIR / "StatementGen_Portable_Package.zip"

INCLUDE_DIRS = ["src", "public", "tests"]

INCLUDE_FILES = [
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html",
    ".gitignore",
    ".oxlintrc.json",
    "requirements.txt",
    "export_pdfs.py",
    "native_vector_reencoder.py",
    "uluro_pdf_container.py",
    "verify_session_forensics.py",
    "verify_all_statement_pages.py",
    "compare_uluro_container_forensics.py",
    "run_pipeline.ps1",
    "run_pipeline.bat",
    "AGENTS.md",
    "GEMINI.md",
    "PROJECT.md",
    "README.md",
    "TEST_INFRA.md",
    "TEST_READY.md",
    "FONTS_REFERENCE_GUIDE.md",
    "US_1364_FCU_Statement_June_2026_Aziz_Berjis.pdf",
    "US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf",
    "US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf",
]


def clean_dir(target: Path):
    for root, dirs, files in os.walk(target, topdown=False):
        for name in files:
            if name.endswith(".pyc") or name.endswith(".tmp") or name == ".DS_Store":
                try:
                    os.remove(os.path.join(root, name))
                except Exception:
                    pass
        for name in dirs:
            if name == "__pycache__" or name == ".pytest_cache":
                try:
                    shutil.rmtree(os.path.join(root, name))
                except Exception:
                    pass


def main():
    print(f"Building portable directory at: {PORTABLE_DIR}")
    if PORTABLE_DIR.exists():
        shutil.rmtree(PORTABLE_DIR)
    PORTABLE_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Copy directories
    for d in INCLUDE_DIRS:
        src = BASE_DIR / d
        dst = PORTABLE_DIR / d
        if src.exists():
            print(f"Copying directory: {d} -> {dst}")
            shutil.copytree(src, dst)

    # 2. Copy individual files
    for f in INCLUDE_FILES:
        src = BASE_DIR / f
        dst = PORTABLE_DIR / f
        if src.exists():
            print(f"Copying file: {f}")
            shutil.copy2(src, dst)
        else:
            print(f"WARNING: File not found: {src}")

    # 3. Clean any cache artifacts inside portable dir
    clean_dir(PORTABLE_DIR)

    # 4. Create ZIP archive
    print(f"\nCompressing to archive: {ARCHIVE_ZIP}")
    if ARCHIVE_ZIP.exists():
        try:
            os.remove(ARCHIVE_ZIP)
        except Exception:
            pass

    file_count = 0
    with zipfile.ZipFile(ARCHIVE_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for root, dirs, files in os.walk(PORTABLE_DIR):
            for file in files:
                full_path = Path(root) / file
                rel_path = full_path.relative_to(PORTABLE_DIR)
                zipf.write(full_path, arcname=str(rel_path))
                file_count += 1

    zip_size_mb = os.path.getsize(ARCHIVE_ZIP) / (1024 * 1024)
    print(f"\nSuccessfully created portable archive!")
    print(f"Archive Path : {ARCHIVE_ZIP}")
    print(f"Total Files  : {file_count}")
    print(f"Archive Size : {zip_size_mb:.2f} MB")


if __name__ == "__main__":
    main()
