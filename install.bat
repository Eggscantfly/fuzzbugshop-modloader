@echo off
title Fuzz Bugs Factory Hop - Installer
cd /d "%~dp0"

:: Check for Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    python install.py
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    python3 install.py
    goto :end
)

:: Python not found - try py launcher
py --version >nul 2>&1
if %errorlevel% equ 0 (
    py install.py
    goto :end
)

:: No Python found
echo.
echo ============================================================
echo  Python is required to run the installer
echo ============================================================
echo.
echo  Please install Python from: https://www.python.org/downloads/
echo  Make sure to check "Add Python to PATH" during installation!
echo.
echo  After installing Python, run this installer again.
echo.
echo  Alternatively, follow the manual instructions in README.md
echo.
pause

:end
