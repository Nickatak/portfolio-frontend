VENV ?= .venv
BACKEND_DIR ?= calendar
PORTFOLIO_PORT ?= 3000
CALENDAR_API_PORT ?= 8000

.PHONY: help \
	prepare-portfolio-data \
	frontend-setup frontend frontend-build frontend-start \
	backend-setup backend backend-test backend-shell backend-migrate \
	up compose-build down logs ps config \
	install run build start lint lint-fix clean clean-all kill

help:
	@echo "Portfolio Monorepo"
	@echo "================="
	@echo ""
	@echo "Frontend (Next.js):"
	@echo "  make frontend-setup   Install frontend dependencies"
	@echo "  make frontend         Run frontend dev server (localhost:$(PORTFOLIO_PORT))"
	@echo "  make frontend-build   Build frontend"
	@echo "  make frontend-start   Start production frontend"
	@echo ""
	@echo "Backend (Django):"
	@echo "  make backend-setup    Create venv, install deps, and migrate"
	@echo "  make backend          Run backend dev server (localhost:$(CALENDAR_API_PORT))"
	@echo "  make backend-test     Run backend tests"
	@echo "  make backend-shell    Open Django shell"
	@echo "  make backend-migrate  Apply migrations"
	@echo ""
	@echo "Full Stack (Docker Compose):"
	@echo "  make up               Build and run frontend + backend"
	@echo "  make compose-build    Build compose images"
	@echo "  make down             Stop and remove containers"
	@echo "  make logs             Follow compose logs"
	@echo "  make ps               Show compose services"
	@echo "  make config           Render merged compose config"
	@echo ""
	@echo "Legacy aliases (frontend): install run build start lint lint-fix clean clean-all kill"

prepare-portfolio-data:
	@if [ ! -f src/data/portfolio.json ] && [ -f src/data/portfolio.example.json ]; then \
		cp src/data/portfolio.example.json src/data/portfolio.json; \
	fi
	@if [ ! -f src/data/social.json ] && [ -f src/data/social.example.json ]; then \
		cp src/data/social.example.json src/data/social.json; \
	fi

frontend-setup: prepare-portfolio-data
	npm ci

frontend: prepare-portfolio-data
	@set -a; [ -f .env ] && . ./.env; set +a; \
	NEXT_PUBLIC_API_BASE_URL=$${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000} \
	NEXT_PUBLIC_GOOGLE_CLIENT_ID=$${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-} \
	NEXT_PUBLIC_DISPLAY_NAME=$${NEXT_PUBLIC_DISPLAY_NAME:-Your Name} \
	NEXT_PUBLIC_CONTACT_EMAIL=$${NEXT_PUBLIC_CONTACT_EMAIL:-hello@example.com} \
	npm run dev -- --hostname 0.0.0.0 --port $${PORTFOLIO_PORT:-$(PORTFOLIO_PORT)}

frontend-build: prepare-portfolio-data
	npm run build

frontend-start:
	npm run start

backend-setup:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	cd $(BACKEND_DIR); \
	[ -x $(VENV)/bin/python ] || python3 -m venv $(VENV); \
	$(MAKE) install migrate

backend:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	$(MAKE) -C $(BACKEND_DIR) runserver

backend-test:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	$(MAKE) -C $(BACKEND_DIR) test

backend-shell:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	$(MAKE) -C $(BACKEND_DIR) shell

backend-migrate:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	$(MAKE) -C $(BACKEND_DIR) migrate

up: prepare-portfolio-data
	docker compose up --build

compose-build: prepare-portfolio-data
	docker compose build

down:
	docker compose down --remove-orphans

logs:
	docker compose logs -f --tail=200

ps:
	docker compose ps

config:
	docker compose config

# ---------- Legacy frontend aliases ----------
install: frontend-setup
run: frontend
build: frontend-build
start: frontend-start

lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

clean:
	rm -rf .next dist
	find . -type d -name ".turbo" -exec rm -rf {} + 2>/dev/null || true

clean-all: clean
	rm -rf node_modules

kill:
	@lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"

.DEFAULT_GOAL := help
