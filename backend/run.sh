#!/bin/bash

# VOC Agent Backend Quick Start Script

set -e

echo "======================================"
echo "  VOC Agent Backend - Quick Start"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "Python version: $PYTHON_VERSION"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "Warning: .env file not found"
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo ""
    echo "Please edit .env file and add your ANTHROPIC_API_KEY"
    echo "Then run this script again."
    exit 1
fi

# Check if API key is set
if ! grep -q "ANTHROPIC_API_KEY=sk-ant" .env; then
    echo ""
    echo "Warning: ANTHROPIC_API_KEY not configured in .env"
    echo "The /generate endpoint will not work without a valid API key."
    echo "Press Enter to continue anyway, or Ctrl+C to exit..."
    read
fi

# Start the server
echo ""
echo "======================================"
echo "  Starting VOC Agent Backend Server"
echo "======================================"
echo ""
echo "Server will be available at:"
echo "  - API: http://localhost:8000"
echo "  - Docs: http://localhost:8000/docs"
echo "  - Health: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
