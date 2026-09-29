@echo off
setlocal
echo ================================================================================
echo  STATEMENTGEN TURNKEY PIPELINE EXECUTION (BATCH)
echo ================================================================================

echo.
echo [1/5] Executing Statement Compilation (June 2026)...
python export_pdfs.py --scenario=us1364_aziz_june_2026_scenario
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo [2/5] Executing Statement Compilation (July 2026)...
python export_pdfs.py --scenario=us1364_aziz_july_2026_scenario
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo [3/5] Executing Statement Compilation (August 2026)...
python export_pdfs.py --scenario=us1364_aziz_august_2026_scenario
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo [4/5] Running 11-Layer Forensic Audit...
python verify_session_forensics.py
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo [5/5] Running OpenCV Pixel Verification and Test Suite...
python verify_all_statement_pages.py
if %ERRORLEVEL% NEQ 0 goto error

pytest tests/
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo ================================================================================
echo  ALL STATEMENTS SUCCESSFULLY GENERATED, RE-ENCODED, AND VERIFIED!
echo ================================================================================
goto end

:error
echo.
echo [ERROR] Pipeline execution encountered a failure! Check output above.
exit /b 1

:end
endlocal
