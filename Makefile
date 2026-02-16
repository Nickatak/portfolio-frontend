VENV ?= .venv
FRONTEND_DIR ?= frontend
BACKEND_DIR ?= backend
PORTFOLIO_PORT ?= 3000
CALENDAR_API_PORT ?= 8000
LOCAL_KILL_PORTS ?= 8000 3000 9092

ENV_FILE ?= .env
REQUIRED_ENV_KEYS ?= \
	NEXT_PUBLIC_API_BASE_URL \
	NEXT_PUBLIC_DISPLAY_NAME \
	NEXT_PUBLIC_CONTACT_EMAIL \
	PORTFOLIO_PORT \
	CALENDAR_API_PORT \
	SECRET_KEY \
	DEBUG \
	ALLOWED_HOSTS \
	TIME_ZONE \
	CORS_ALLOWED_ORIGINS \
	CSRF_TRUSTED_ORIGINS \
	KAFKA_PRODUCER_ENABLED \
	KAFKA_NOTIFY_EMAIL_DEFAULT \
	KAFKA_NOTIFY_SMS_DEFAULT \
	KAFKA_BOOTSTRAP_SERVERS \
	KAFKA_BOOTSTRAP_SERVERS_DOCKER \
	KAFKA_TOPIC_APPOINTMENTS_CREATED \
	KAFKA_TOPIC_APPOINTMENTS_CREATED_DLQ

COMPOSE_BASE_FILE ?= docker-compose.yml
COMPOSE_MESSAGING_FILE ?= infra/messaging/docker-compose.yml
COMPOSE_FILES ?= -f $(COMPOSE_BASE_FILE) -f $(COMPOSE_MESSAGING_FILE)
DEV_COMPOSE ?= docker compose --env-file $(ENV_FILE) $(COMPOSE_FILES)
DEV_CORE_COMPOSE ?= docker compose --env-file $(ENV_FILE) -f $(COMPOSE_BASE_FILE)

.PHONY: help \
	env-init env-status env-validate prepare-portfolio-data \
	frontend-setup frontend frontend-build frontend-start \
	backend-setup backend backend-test backend-shell backend-migrate \
	local-install local-install-frontend local-install-backend \
	local-up local-run local-run-frontend local-run-backend local-kill-ports local-migrate local-test local-shell local-seed local-reset-db local-build local-lint local-lint-fix local-clean local-clean-all \
	dev-build dev-up dev-up-core dev-down dev-logs dev-ps dev-config dev-seed \
	up up-core compose-build down logs ps config \
	install run build start lint lint-fix clean clean-all kill reset-db

help:
	@echo "Portfolio Monorepo"
	@echo "================="
	@echo ""
	@echo "Environment file:"
	@echo "  Active: $(ENV_FILE)"
	@echo "  make env-init          Create $(ENV_FILE) from .env.example if missing"
	@echo "  make env-status        Show whether $(ENV_FILE) is present"
	@echo "  make env-validate      Validate required keys in $(ENV_FILE)"
	@echo ""
	@echo "Local (no Docker):"
	@echo "  make local-install     Install frontend + backend dependencies"
	@echo "  make local-up          Run frontend + backend locally"
	@echo "  make local-kill-ports  Stop listeners on common local ports"
	@echo "  make local-run-frontend Start frontend with $(ENV_FILE)"
	@echo "  make local-run-backend  Start backend with $(ENV_FILE)"
	@echo "  make local-migrate     Run backend migrations with $(ENV_FILE)"
	@echo "  make local-test        Run backend tests with $(ENV_FILE)"
	@echo "  make local-shell       Open backend shell with $(ENV_FILE)"
	@echo "  make local-seed        Seed local DB with development seed data"
	@echo "  make local-reset-db    Reset local SQLite DB and rerun migrations"
	@echo "  make local-build       Build frontend assets"
	@echo "  make local-lint        Lint frontend"
	@echo "  make local-clean       Clean build/cache artifacts"
	@echo ""
	@echo "Dev Docker (uses $(ENV_FILE)):"
	@echo "  make dev-build         Build app + messaging images"
	@echo "  make dev-up            Run full stack (frontend + backend + messaging)"
	@echo "  make dev-up-core       Run app-only stack (frontend + backend)"
	@echo "  make dev-down          Stop dev stack"
	@echo "  make dev-logs          Follow dev logs"
	@echo "  make dev-ps            Show dev services"
	@echo "  make dev-config        Render merged dev compose config"
	@echo "  make dev-seed          Seed running dev DB with development seed data"
	@echo ""
	@echo "Legacy aliases remain available:"
	@echo "  frontend/backend/up/down/etc. and install/run/build/start/lint/lint-fix/clean/clean-all/kill"

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

backend-setup:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	cd $(BACKEND_DIR); \
	[ -x $(VENV)/bin/python ] || python3 -m venv $(VENV); \
	$(MAKE) install migrate

backend:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	$(MAKE) -C $(BACKEND_DIR) runserver

backend-test:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	$(MAKE) -C $(BACKEND_DIR) test

backend-shell:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	$(MAKE) -C $(BACKEND_DIR) shell

backend-migrate:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	$(MAKE) -C $(BACKEND_DIR) migrate

# ---------- Local (no Docker) ----------
local-install: local-install-frontend local-install-backend

local-install-frontend:
	$(MAKE) frontend-setup ENV_FILE=$(ENV_FILE)

local-install-backend:
	$(MAKE) backend-setup ENV_FILE=$(ENV_FILE)

local-up: local-kill-ports
	@echo "Starting local frontend + backend (Ctrl+C to stop both)..."
	@set -e; \
	$(MAKE) local-run-frontend & frontend_pid=$$!; \
	$(MAKE) local-run-backend & backend_pid=$$!; \
	cleanup() { \
		echo "Stopping local services..."; \
		kill $$frontend_pid $$backend_pid 2>/dev/null || true; \
		pkill -TERM -P $$frontend_pid 2>/dev/null || true; \
		pkill -TERM -P $$backend_pid 2>/dev/null || true; \
		wait $$frontend_pid $$backend_pid 2>/dev/null || true; \
	}; \
	trap 'cleanup; exit 130' INT TERM; \
	wait $$frontend_pid $$backend_pid || true; \
	cleanup

local-run: local-run-frontend

local-run-frontend:
	$(MAKE) frontend ENV_FILE=$(ENV_FILE)

local-run-backend:
	$(MAKE) backend ENV_FILE=$(ENV_FILE)

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

local-migrate:
	$(MAKE) backend-migrate ENV_FILE=$(ENV_FILE)

local-test:
	$(MAKE) backend-test ENV_FILE=$(ENV_FILE)

local-shell:
	$(MAKE) backend-shell ENV_FILE=$(ENV_FILE)

local-seed:
	@backend_python="$(BACKEND_DIR)/.venv/bin/python"; \
	if [ ! -x "$$backend_python" ]; then \
		echo "Missing $$backend_python (run 'make backend-setup' first)."; \
		exit 1; \
	fi; \
	"$$backend_python" $(BACKEND_DIR)/manage.py migrate; \
	"$$backend_python" $(BACKEND_DIR)/manage.py seed_dev_data

local-reset-db:
	@backend_python="$(BACKEND_DIR)/.venv/bin/python"; \
	if [ ! -x "$$backend_python" ]; then \
		echo "Missing $$backend_python (run 'make backend-setup' first)."; \
		exit 1; \
	fi; \
	rm -f $(BACKEND_DIR)/db.sqlite3; \
	"$$backend_python" $(BACKEND_DIR)/manage.py migrate; \
	echo "Local DB reset complete."

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

dev-up-core: prepare-portfolio-data
	$(DEV_CORE_COMPOSE) up --build

dev-down:
	$(DEV_COMPOSE) down --remove-orphans

dev-logs:
	$(DEV_COMPOSE) logs -f --tail=200

dev-ps:
	$(DEV_COMPOSE) ps

dev-config:
	$(DEV_COMPOSE) config

dev-seed:
	$(DEV_COMPOSE) exec calendar-api python manage.py seed_dev_data

up: dev-up

up-core: dev-up-core

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

reset-db: local-reset-db

.DEFAULT_GOAL := help
