.PHONY: help install dev build lint lint-fix clean clean-all kill

help:
	@echo "Modern Portfolio - Next.js Development Makefile"
	@echo "=============================================="
	@echo ""
	@echo "Installation & Setup:"
	@echo "  make install      Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev          Start development server (port 3000)"
	@echo "  make build        Build for production"
	@echo "  make start        Start production server"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint         Run ESLint"
	@echo "  make lint-fix     Fix ESLint issues"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        Remove build artifacts and cache"
	@echo "  make clean-all    Clean + remove node_modules"
	@echo "  make kill         Kill process on port 3000"
	@echo ""

# ==================== Installation & Setup ====================

install:
	@echo "Installing dependencies..."
	npm install
	@echo "✓ Dependencies installed"

# ==================== Development ====================

dev:
	@echo "Starting development server on http://localhost:3000"
	@echo "Press Ctrl+C to stop"
	npm run dev

build:
	@echo "Building for production..."
	npm run build
	@echo "✓ Build complete"

start: build
	@echo "Starting production server on http://localhost:3000"
	npm run start

# ==================== Code Quality ====================

lint:
	@echo "Running ESLint..."
	npm run lint

lint-fix:
	@echo "Fixing ESLint issues..."
	npm run lint -- --fix

# ==================== Cleanup ====================

clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf dist
	find . -type d -name ".turbo" -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Build artifacts cleaned"

clean-all: clean
	@echo "Removing node_modules..."
	rm -rf node_modules
	rm -f package-lock.json
	@echo "✓ All cleaned"

# ==================== Utilities ====================

kill:
	@echo "Killing process on port 3000..."
	@lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"
	@echo "✓ Process terminated"

.DEFAULT_GOAL := help
