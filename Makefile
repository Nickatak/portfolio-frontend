VENV ?= .venv
FRONTEND_DIR ?= frontend
BACKEND_DIR ?= backend
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
	@echo "  make frontend-setup   Install frontend dependencies ($(FRONTEND_DIR)/)"
	@echo "  make frontend         Run frontend dev server (localhost:$(PORTFOLIO_PORT))"
	@echo "  make frontend-build   Build frontend ($(FRONTEND_DIR)/)"
	@echo "  make frontend-start   Start production frontend ($(FRONTEND_DIR)/)"
	@echo ""
	@echo "Backend (Django):"
	@echo "  make backend-setup    Create venv, install deps, and migrate ($(BACKEND_DIR)/)"
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
	@if [ ! -f $(FRONTEND_DIR)/src/data/portfolio.json ] && [ -f $(FRONTEND_DIR)/src/data/portfolio.example.json ]; then \
		cp $(FRONTEND_DIR)/src/data/portfolio.example.json $(FRONTEND_DIR)/src/data/portfolio.json; \
	fi
	@if [ ! -f $(FRONTEND_DIR)/src/data/social.json ] && [ -f $(FRONTEND_DIR)/src/data/social.example.json ]; then \
		cp $(FRONTEND_DIR)/src/data/social.example.json $(FRONTEND_DIR)/src/data/social.json; \
	fi

frontend-setup: prepare-portfolio-data
	cd $(FRONTEND_DIR) && npm ci

frontend: prepare-portfolio-data
	@set -a; [ -f .env ] && . ./.env; set +a; \
	cd $(FRONTEND_DIR); \
	NEXT_PUBLIC_API_BASE_URL=$${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000} \
	NEXT_PUBLIC_GOOGLE_CLIENT_ID=$${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-} \
	NEXT_PUBLIC_DISPLAY_NAME=$${NEXT_PUBLIC_DISPLAY_NAME:-Your Name} \
	NEXT_PUBLIC_CONTACT_EMAIL=$${NEXT_PUBLIC_CONTACT_EMAIL:-hello@example.com} \
	npm run dev -- --hostname 0.0.0.0 --port $${PORTFOLIO_PORT:-$(PORTFOLIO_PORT)}

frontend-build: prepare-portfolio-data
	cd $(FRONTEND_DIR) && npm run build

frontend-start:
	cd $(FRONTEND_DIR) && npm run start

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
	cd $(FRONTEND_DIR) && npm run lint

lint-fix:
	cd $(FRONTEND_DIR) && npm run lint -- --fix

clean:
	rm -rf $(FRONTEND_DIR)/.next $(FRONTEND_DIR)/dist
	find $(FRONTEND_DIR) -type d -name ".turbo" -exec rm -rf {} + 2>/dev/null || true

clean-all: clean
	rm -rf $(FRONTEND_DIR)/node_modules

kill:
	@lsof -ti:$${PORTFOLIO_PORT:-$(PORTFOLIO_PORT)} | xargs kill -9 2>/dev/null || echo "No process found on frontend port"

.DEFAULT_GOAL := help
