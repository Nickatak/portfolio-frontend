FRONTEND_DIR ?= frontend
PORTFOLIO_PORT ?= 3000
LOCAL_KILL_PORTS ?= 3000

ENV_FILE ?= .env
REQUIRED_ENV_KEYS ?= \
	NEXT_PUBLIC_API_BASE_URL \
	NEXT_PUBLIC_DISPLAY_NAME \
	NEXT_PUBLIC_CONTACT_EMAIL \
	PORTFOLIO_PORT

COMPOSE_BASE_FILE ?= docker-compose.yml
DEV_COMPOSE ?= docker compose --env-file $(ENV_FILE) -f $(COMPOSE_BASE_FILE)

.PHONY: help \
	env-init env-status env-validate prepare-portfolio-data \
	frontend-setup frontend frontend-build frontend-start \
	local-install local-install-frontend \
	local-up local-run local-run-frontend local-kill-ports local-build local-lint local-lint-fix local-clean local-clean-all \
	dev-build dev-up dev-down dev-logs dev-ps dev-config \
	up compose-build down logs ps config \
	install run build start lint lint-fix clean clean-all kill

help:
	@echo "Portfolio Frontend"
	@echo "================="
	@echo ""
	@echo "Environment file:"
	@echo "  Active: $(ENV_FILE)"
	@echo "  make env-init          Create $(ENV_FILE) from .env.example if missing"
	@echo "  make env-status        Show whether $(ENV_FILE) is present"
	@echo "  make env-validate      Validate required keys in $(ENV_FILE)"
	@echo ""
	@echo "Local (no Docker):"
	@echo "  make local-install     Install frontend dependencies"
	@echo "  make local-up          Run frontend locally"
	@echo "  make local-kill-ports  Stop listeners on common local ports"
	@echo "  make local-run-frontend Start frontend with $(ENV_FILE)"
	@echo "  make local-build       Build frontend assets"
	@echo "  make local-lint        Lint frontend"
	@echo "  make local-clean       Clean build/cache artifacts"
	@echo ""
	@echo "Dev Docker (uses $(ENV_FILE)):"
	@echo "  make dev-build         Build frontend image"
	@echo "  make dev-up            Run frontend container"
	@echo "  make dev-down          Stop dev stack"
	@echo "  make dev-logs          Follow dev logs"
	@echo "  make dev-ps            Show dev services"
	@echo "  make dev-config        Render merged dev compose config"
	@echo ""
	@echo "Legacy aliases remain available:"
	@echo "  frontend/up/down/etc. and install/run/build/start/lint/lint-fix/clean/clean-all/kill"

env-init:
	@if [ ! -f $(ENV_FILE) ]; then cp .env.example $(ENV_FILE); echo "Created $(ENV_FILE) from .env.example"; fi

env-status:
	@if [ -f $(ENV_FILE) ]; then \
		echo "$(ENV_FILE) is present"; \
	else \
		echo "$(ENV_FILE) is missing (run 'make env-init')"; \
	fi

env-validate:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "$(ENV_FILE) is missing (run 'make env-init')"; \
		exit 1; \
	fi
	@missing=0; \
	for key in $(REQUIRED_ENV_KEYS); do \
		line=$$(grep -E "^[[:space:]]*$$key[[:space:]]*=" $(ENV_FILE) | tail -n 1 || true); \
		if [ -z "$$line" ]; then \
			echo "Missing key: $$key"; \
			missing=1; \
			continue; \
		fi; \
		value=$${line#*=}; \
		value=$$(printf "%s" "$$value" | sed -e "s/^[[:space:]]*//" -e "s/[[:space:]]*$$//"); \
		if [ -z "$$value" ]; then \
			echo "Empty value: $$key"; \
			missing=1; \
		fi; \
	done; \
	if [ $$missing -ne 0 ]; then \
		echo "Environment validation failed."; \
		exit 1; \
	fi; \
	echo "Environment validation passed for $(ENV_FILE)."

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
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
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

# ---------- Local (no Docker) ----------
local-install: local-install-frontend

local-install-frontend:
	$(MAKE) frontend-setup ENV_FILE=$(ENV_FILE)

local-up: local-kill-ports
	@echo "Starting local frontend (Ctrl+C to stop)..."
	$(MAKE) local-run-frontend

local-run: local-run-frontend

local-run-frontend:
	$(MAKE) frontend ENV_FILE=$(ENV_FILE)

local-kill-ports:
	@echo "Stopping listeners on ports: $(LOCAL_KILL_PORTS)"
	@for port in $(LOCAL_KILL_PORTS); do \
		if command -v fuser >/dev/null 2>&1; then \
			echo "Port $$port: sending TERM"; \
			fuser -k -TERM $$port/tcp 2>/dev/null || true; \
			sleep 1; \
			if fuser $$port/tcp >/dev/null 2>&1; then \
				echo "Port $$port: still busy, sending KILL"; \
				fuser -k -KILL $$port/tcp 2>/dev/null || true; \
			fi; \
		elif command -v lsof >/dev/null 2>&1; then \
			pids="$$(lsof -tiTCP:$$port -sTCP:LISTEN 2>/dev/null || true)"; \
			if [ -n "$$pids" ]; then \
				echo "Port $$port: sending TERM to PID(s) $$pids"; \
				kill -TERM $$pids 2>/dev/null || true; \
				sleep 1; \
				pids="$$(lsof -tiTCP:$$port -sTCP:LISTEN 2>/dev/null || true)"; \
				if [ -n "$$pids" ]; then \
					echo "Port $$port: still busy, sending KILL to PID(s) $$pids"; \
					kill -KILL $$pids 2>/dev/null || true; \
				fi; \
			else \
				echo "Port $$port: no listener"; \
			fi; \
		else \
			echo "Port $$port: skipped (install fuser or lsof)"; \
		fi; \
	done
	@echo "--- verification ---"; \
	for port in $(LOCAL_KILL_PORTS); do \
		if ss -ltn "( sport = :$$port )" | tail -n +2 | grep -q .; then \
			echo "Port $$port: still in use"; \
		else \
			echo "Port $$port: free"; \
		fi; \
	done


local-build:
	$(MAKE) frontend-build ENV_FILE=$(ENV_FILE)

local-lint:
	$(MAKE) lint

local-lint-fix:
	$(MAKE) lint-fix

local-clean:
	$(MAKE) clean

local-clean-all:
	$(MAKE) clean-all

# ---------- Dev Docker ----------
dev-build: prepare-portfolio-data
	$(DEV_COMPOSE) build

dev-up: prepare-portfolio-data
	$(DEV_COMPOSE) up --build

dev-down:
	$(DEV_COMPOSE) down --remove-orphans

dev-logs:
	$(DEV_COMPOSE) logs -f --tail=200

dev-ps:
	$(DEV_COMPOSE) ps

dev-config:
	$(DEV_COMPOSE) config

up: dev-up

compose-build: dev-build

down: dev-down

logs: dev-logs

ps: dev-ps

config: dev-config

# ---------- Legacy frontend aliases ----------
install: local-install
run: local-run
build: local-build
start: local-run-frontend

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
	@for port in $(LOCAL_KILL_PORTS); do \
		lsof -ti:$$port | xargs kill -9 2>/dev/null || true; \
	done; \
	echo "Kill signal sent for ports: $(LOCAL_KILL_PORTS)"

.DEFAULT_GOAL := help
