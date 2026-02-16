FRONTEND_DIR ?= frontend
PORTFOLIO_PORT ?= 3000

ENV_FILE ?= .env

COMPOSE_BASE_FILE ?= docker-compose.yml
DOCKER_COMPOSE ?= docker compose --env-file $(ENV_FILE) -f $(COMPOSE_BASE_FILE)

.PHONY: help \
	env-init prepare-portfolio-data \
	install dev build start lint clean \
	docker-build docker-up docker-down docker-logs

help:
	@echo "Portfolio Frontend"
	@echo "================="
	@echo ""
	@echo "Environment file:"
	@echo "  Active: $(ENV_FILE)"
	@echo "  make env-init          Create $(ENV_FILE) from .env.example if missing"
	@echo ""
	@echo "Local (no Docker):"
	@echo "  make install           Install frontend dependencies"
	@echo "  make dev               Run Next.js dev server"
	@echo "  make build             Build frontend assets"
	@echo "  make start             Start production server"
	@echo "  make lint              Lint frontend"
	@echo "  make clean             Clean build/cache artifacts"
	@echo ""
	@echo "Docker (uses $(ENV_FILE)):"
	@echo "  make docker-build      Build frontend image"
	@echo "  make docker-up         Run frontend container"
	@echo "  make docker-down       Stop dev stack"
	@echo "  make docker-logs       Follow dev logs"

env-init:
	@if [ ! -f $(ENV_FILE) ]; then cp .env.example $(ENV_FILE); echo "Created $(ENV_FILE) from .env.example"; fi

prepare-portfolio-data:
	@if [ ! -f $(FRONTEND_DIR)/src/data/portfolio.json ] && [ -f $(FRONTEND_DIR)/src/data/portfolio.example.json ]; then \
		cp $(FRONTEND_DIR)/src/data/portfolio.example.json $(FRONTEND_DIR)/src/data/portfolio.json; \
	fi
	@if [ ! -f $(FRONTEND_DIR)/src/data/social.json ] && [ -f $(FRONTEND_DIR)/src/data/social.example.json ]; then \
		cp $(FRONTEND_DIR)/src/data/social.example.json $(FRONTEND_DIR)/src/data/social.json; \
	fi

install: prepare-portfolio-data
	cd $(FRONTEND_DIR) && npm ci

dev: prepare-portfolio-data
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	cd $(FRONTEND_DIR); \
	NEXT_PUBLIC_API_BASE_URL=$${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000} \
	NEXT_PUBLIC_GOOGLE_CLIENT_ID=$${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-} \
	NEXT_PUBLIC_DISPLAY_NAME=$${NEXT_PUBLIC_DISPLAY_NAME:-Your Name} \
	NEXT_PUBLIC_CONTACT_EMAIL=$${NEXT_PUBLIC_CONTACT_EMAIL:-hello@example.com} \
	npm run dev -- --hostname 0.0.0.0 --port $${PORTFOLIO_PORT:-$(PORTFOLIO_PORT)}

build: prepare-portfolio-data
	cd $(FRONTEND_DIR) && npm run build

start:
	cd $(FRONTEND_DIR) && npm run start

lint:
	cd $(FRONTEND_DIR) && npm run lint

clean:
	rm -rf $(FRONTEND_DIR)/.next $(FRONTEND_DIR)/dist
	find $(FRONTEND_DIR) -type d -name ".turbo" -exec rm -rf {} + 2>/dev/null || true

# ---------- Dev Docker ----------
docker-build: prepare-portfolio-data
	$(DOCKER_COMPOSE) build

docker-up: prepare-portfolio-data
	$(DOCKER_COMPOSE) up --build

docker-down:
	$(DOCKER_COMPOSE) down --remove-orphans

docker-logs:
	$(DOCKER_COMPOSE) logs -f --tail=200

.DEFAULT_GOAL := help
