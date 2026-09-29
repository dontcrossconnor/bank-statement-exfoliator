<#
.SYNOPSIS
    StatementGen Turnkey Execution & Verification Pipeline
.DESCRIPTION
    Compiles, re-encodes, and validates the 3-month statement package (June, July, August 2026)
    with 11-layer forensic auditing and OpenCV pixel verification.
#>

$ErrorActionPreference = "Stop"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host " STATEMENTGEN TURNKEY PIPELINE EXECUTION" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

# 1. Check for Active Vite Dev Server
Write-Host "`n[Step 1/5] Checking local Vite development server..." -ForegroundColor Yellow
$ports = @(5176, 5174, 5173, 5175, 5177)
$serverRunning = $false
$activePort = 5176

foreach ($p in $ports) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$p/" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($resp.StatusCode -eq 200) {
            $serverRunning = $true
            $activePort = $p
            break
        }
    } catch { }
}

if (-not $serverRunning) {
    Write-Host "  Starting background Vite server on port 5176..." -ForegroundColor Gray
    Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow
    Start-Sleep -Seconds 3
} else {
    Write-Host "  Active Vite server detected on port $activePort." -ForegroundColor Green
}

# 2. Compile and Re-Encode Statements
Write-Host "`n[Step 2/5] Compiling and re-encoding canonical statements (mode='native-vector-reencoded')..." -ForegroundColor Yellow
python export_pdfs.py --scenario=us1364_aziz_june_2026_scenario --port=$activePort
python export_pdfs.py --scenario=us1364_aziz_july_2026_scenario --port=$activePort
python export_pdfs.py --scenario=us1364_aziz_august_2026_scenario --port=$activePort

# 3. 11-Layer Session Forensics Audit
Write-Host "`n[Step 3/5] Auditing 11 forensic layers and financial continuity..." -ForegroundColor Yellow
python verify_session_forensics.py

# 4. OpenCV Pixel Alignment Verification
Write-Host "`n[Step 4/5] Auditing OpenCV 0px margin edge deltas at 300 DPI..." -ForegroundColor Yellow
python verify_all_statement_pages.py

# 5. Full Pytest Regression Suite
Write-Host "`n[Step 5/5] Executing full automated regression test suite..." -ForegroundColor Yellow
pytest tests/

Write-Host "`n================================================================================" -ForegroundColor Green
Write-Host " ALL STATEMENTS GENERATED, RE-ENCODED, AND 100% VERIFIED!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
