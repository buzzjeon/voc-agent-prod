@echo off
REM VOC Agent Backend Quick Start Script for Windows

echo ======================================
echo   VOC Agent Backend - Quick Start
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install --upgrade pip -q
pip install -r requirements.txt -q

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo Warning: .env file not found
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo Please edit .env file and add your ANTHROPIC_API_KEY
    echo Then run this script again.
    pause
    exit /b 1
)

REM Start the server
echo.
echo ======================================
echo   Starting VOC Agent Backend Server
echo ======================================
echo.
echo Server will be available at:
echo   - API: http://localhost:8000
echo   - Docs: http://localhost:8000/docs
echo   - Health: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
