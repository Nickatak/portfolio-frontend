# Portfolio Stack

This repository is the primary product repo for the portfolio application
stack.

It currently owns:

- `frontend/` (Next.js web app)
- app orchestration (`docker-compose.yml`, `Makefile`, `.env.example`)

The calendar API now lives in a dedicated repo and is referenced here as a
submodule:

- `backend/` -> `portfolio-calendar`

It also references two dedicated boundary repos as submodules:

- `infra/messaging` -> `portfolio-infra-messaging`
- `contracts/notifier` -> `portfolio-notifier-contracts`

## Repository Evolution

The architecture evolved in stages:

1. Legacy split repos (`calendar`, `portfolio_orchestration`, frontend repo)
2. Monorepo consolidation for fast iteration
3. Boundary extraction into dedicated repos for messaging infra and contracts

Net result: app code remains centralized here, while shared infra/contracts are
now source-of-truth in dedicated repos.

## Ecosystem Repositories

- `portfolio` (this repo): product code and primary local workflow
- `portfolio-calendar`: Django calendar API producer
- `portfolio-infra-messaging`: Kafka broker + topic bootstrap definitions
- `portfolio-notifier-contracts`: versioned event contract schemas
- `notifier_microservice` (separate repo): notifier consumer/worker service

## Architecture At A Glance

```text
User Browser
    |
    v
frontend (portfolio/frontend)
    |
    v
calendar-api producer (portfolio-calendar)
    |
    | emits appointments.created
    v
Kafka broker + topic bootstrap (portfolio-infra-messaging)
    |
    v
notifier consumer/worker (notifier_microservice)

Event payload contract source of truth:
portfolio-notifier-contracts
```

## Where To Make Changes

| Change Goal | Primary Repo | Also Usually Update | Why |
| --- | --- | --- | --- |
| UI, pages, copy, frontend behavior | `portfolio` | None | Product UI lives in `frontend/` |
| API logic, booking rules, producer behavior | `portfolio-calendar` | `portfolio-notifier-contracts` when payload shape changes | Producer implementation is in `backend/` submodule |
| Kafka broker settings, topic bootstrap, messaging compose | `portfolio-infra-messaging` | `portfolio` (submodule pointer update) | Infra source-of-truth is externalized |
| Event schema fields/validation semantics | `portfolio-notifier-contracts` | `portfolio` and `notifier_microservice` | Contracts drive producer/consumer compatibility |
| Notification delivery/runtime worker behavior | `notifier_microservice` | `portfolio-notifier-contracts` when schema changes | Consumer logic is outside product repo |

## Common Multi-Repo Workflows

1. Product-only change: edit in `portfolio`, run local checks, and commit only in `portfolio`.
2. Contract change: update `portfolio-notifier-contracts` first, then update producer/consumer repos to match, then update submodule pointer(s) in `portfolio`.
3. Messaging infra change: update `portfolio-infra-messaging`, validate compose/runtime, then update the `infra/messaging` submodule pointer in `portfolio`.
4. Cross-cutting change (contract + producer + consumer): update contracts first, then producer/consumer implementations, then sync submodule pointers in repos that pin those contracts.

## Layout

- `frontend/` - Next.js app
- `backend/` - submodule to `portfolio-calendar`
- `docker-compose.yml` - app-layer compose (`web` + `calendar-api`)
- `infra/messaging/` - submodule to `portfolio-infra-messaging`
- `contracts/notifier/` - submodule to `portfolio-notifier-contracts`
- `docs/` - ADRs, architecture docs, and runbooks

## Quick Start

1. Clone and initialize submodules:
   ```bash
   git submodule update --init --recursive
   ```
2. Create local env file:
   ```bash
   make env-init
   ```
3. Prepare frontend local data files:
   ```bash
   make prepare-portfolio-data
   ```

## Local Development (App Only, No Docker)

Uses `.env`.

Install dependencies:
```bash
make local-install
```

Run both apps together:
```bash
make local-up
```

Or run separately:

Terminal 1:
```bash
make local-run-backend
```

Terminal 2:
```bash
make local-run-frontend
```

Endpoints:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

Seed local development data:
```bash
make local-seed
```

Reset local DB (manual):
```bash
make local-reset-db
```

## Docker Workflows

### Dev Docker (`.env`)

Full stack (app + messaging infra):
```bash
make dev-up
```

App-only stack (no Kafka infra):
```bash
make dev-up-core
```

Other compose operations:
```bash
make dev-build
make dev-down
make dev-logs
make dev-ps
make dev-config
make dev-seed
```

`make dev-up` composes:

- `docker-compose.yml`
- `infra/messaging/docker-compose.yml`

Legacy aliases still work (`make up`, `make down`, etc.) and map to `dev-*` targets.

## Environment Configuration

This repo uses a single runtime env file at `.env` for local and Docker flows.

- Run `make env-init` to create `.env` from `.env.example` if missing.
- Run `make env-validate` to verify required keys are present and non-empty.
- Update `.env` values for your machine/runtime.
- `make dev-*` commands provide Docker-based local development workflows.

## Compose Layout

- `docker-compose.yml`
- `infra/messaging/docker-compose.yml`

## Environment Variables

Root `.env` drives frontend and backend runtime values.

Frequently edited:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DISPLAY_NAME`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `PORTFOLIO_PORT`
- `CALENDAR_API_PORT`
- `KAFKA_PRODUCER_ENABLED`
- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_BOOTSTRAP_SERVERS_DOCKER`
- `KAFKA_TOPIC_APPOINTMENTS_CREATED`
- `KAFKA_TOPIC_APPOINTMENTS_CREATED_DLQ`

See `.env.example` for full defaults and comments.

## Submodules

This repo expects all submodules to be available:

- `backend` (calendar API producer)
- `infra/messaging` (messaging compose/services)
- `contracts/notifier` (event schema definitions)

After pull/clone:
```bash
git submodule update --init --recursive
```

To move submodules to latest remote commits:
```bash
git submodule update --remote --merge
```

## App Documentation

- Backend details: `backend/README.md`
- Frontend details: `frontend/`

## Architecture and Decisions

- `docs/adr/0001-monorepo-adoption.md`
- `docs/adr/0002-retain-github-and-adopt-prefix-grouping.md`
- `docs/adr/0003-split-infra-and-contract-boundaries.md`
- `docs/architecture/repository-structure.md`
- `docs/runbooks/repository-split-process.md`
