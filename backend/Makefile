.PHONY: help install run test docker-build docker-run docker-stop clean

help:
	@echo "VOC Agent Backend - Available Commands"
	@echo ""
	@echo "  make install       - Install dependencies"
	@echo "  make run           - Run development server"
	@echo "  make test          - Run API tests"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker container"
	@echo "  make docker-stop   - Stop Docker container"
	@echo "  make clean         - Clean cache and temporary files"
	@echo ""

install:
	@echo "Installing dependencies..."
	pip install --upgrade pip
	pip install -r requirements.txt

run:
	@echo "Starting development server..."
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	@echo "Running API tests..."
	python test_api.py

docker-build:
	@echo "Building Docker image..."
	docker build -t voc-agent-backend .

docker-run:
	@echo "Starting Docker container..."
	docker-compose up -d
	@echo "Server running at http://localhost:8000"
	@echo "View logs: docker logs -f voc-agent-backend"

docker-stop:
	@echo "Stopping Docker container..."
	docker-compose down

clean:
	@echo "Cleaning cache and temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo "Clean complete"
