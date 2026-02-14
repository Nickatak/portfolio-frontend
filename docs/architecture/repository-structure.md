# Repository Structure and Boundaries

## Purpose

Define the current architecture boundaries across the portfolio ecosystem and
document where each concern should live.

## Repositories

### 1. `portfolio` (this repository)

Primary product repo for portfolio-facing apps and local orchestration.

- Owns:
  - `frontend/` (Next.js web app)
  - `backend/` (Django calendar API producer)
  - Root app orchestration (`docker-compose.yml`, `Makefile`)
- Contains submodule boundaries:
  - `infra/messaging/` (submodule to `portfolio-infra-messaging`)
  - `contracts/notifier/` (submodule to `portfolio-notifier-contracts`)

### 2. `portfolio-infra-messaging`

Target home for shared Kafka runtime infrastructure.

- Owns:
  - Kafka broker compose definitions
  - Topic bootstrap/init logic
  - Messaging-specific operational docs

### 3. `portfolio-notifier-contracts`

Target home for notifier event contracts.

- Owns:
  - Versioned JSON schemas for notifier events
  - Compatibility and contract release guidance

### 4. `notifier_microservice` (existing repo, future rename candidate)

Consumer/worker implementation for notification processing.

- Consumes:
  - Event schemas from contracts repo
  - Kafka infra from messaging repo

## Boundary Rules

- Product/runtime code stays in `portfolio` app directories (`frontend/`, `backend/`).
- Messaging runtime infrastructure is treated as a separate boundary (`infra/messaging/`).
- Event contracts are treated as integration artifacts, not implicit code details.
- App orchestration and messaging orchestration are layered and composable.

## Compose Layering Model

The local full stack is composed from two files:

1. `docker-compose.yml` (app services)
2. `infra/messaging/docker-compose.yml` (messaging services)

`Makefile` binds both by default so `make up` preserves one-command startup.

## Contract Source of Truth

Current source files in this repo:

- `contracts/notifier/events/appointments.created.schema.json`
- `contracts/notifier/events/appointments.created.dlq.schema.json`

Target canonical location:

- `portfolio-notifier-contracts`

## Directory Map (Current)

```text
portfolio/
├── frontend/                         # product web app
├── backend/                          # product API + producer logic
├── docker-compose.yml                # app-only compose layer
├── infra/
│   └── messaging/
│       ├── docker-compose.yml
│       └── README.md
├── contracts/
│   └── notifier/
│       ├── README.md
│       └── events/
│           ├── appointments.created.schema.json
│           └── appointments.created.dlq.schema.json
└── docs/
    ├── adr/
    ├── architecture/
    └── runbooks/
```
