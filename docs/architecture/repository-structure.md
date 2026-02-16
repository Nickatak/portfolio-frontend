# Repository Structure and Boundaries

## Purpose

Define the current architecture boundaries across the portfolio ecosystem and
where each concern should live.

## Repositories

### 1. `portfolio` (this repository)

Frontend-only product repo for the portfolio UI and local frontend workflows.

- Owns:
  - `frontend/` (Next.js web app)
  - Frontend compose (`docker-compose.yml`, `Makefile`)

### 2. `portfolio-bff`

Content and dashboard backend (BFF).

- Owns:
  - Content models and admin workflows
  - Public API for frontend content

### 3. `portfolio-calendar`

Calendar API producer for appointments.

- Owns:
  - Booking rules and timeslot API
  - Kafka producer logic
- May include reference submodules:
  - `infra/messaging/` (submodule to `portfolio-infra-messaging`)
  - `contracts/notifier/` (submodule to `portfolio-notifier-contracts`)

### 4. `portfolio-infra-messaging`

Shared Kafka runtime infrastructure.

- Owns:
  - Broker compose definitions
  - Topic bootstrap/init logic
  - Messaging-specific operational docs

### 5. `portfolio-notifier-contracts`

Event contract source of truth.

- Owns:
  - Versioned JSON schemas for notifier events
  - Compatibility and contract release guidance

### 6. `notifier_microservice` (existing repo, future rename candidate)

Consumer/worker implementation for notification processing.

- Consumes:
  - Event schemas from contracts repo
  - Kafka infra from messaging repo

### 7. `ntakemori-deploy`

Host-level ingress and deployment orchestration for the portfolio stack.

- Owns:
  - Edge proxy + TLS termination
  - Environment-specific compose overrides
  - Host runbooks and deployment scripts

## Boundary Rules

- Frontend UI lives in `portfolio`.
- Content management and dashboard features live in `portfolio-bff`.
- Scheduling/booking logic lives in `portfolio-calendar`.
- Messaging infra and contracts remain dedicated boundaries.
- Host-level ingress and deploy overrides live in `ntakemori-deploy`.

## Compose Model

The `portfolio` repo compose file is frontend-only:

- `docker-compose.yml` (frontend service)

Messaging compose lives in `portfolio-infra-messaging`.
Ingress + production overrides live in `ntakemori-deploy`.

## Contract Source of Truth

Canonical location:

- `portfolio-notifier-contracts`

## Directory Map (Current)

```text
portfolio-stack/
├── portfolio/
│   ├── frontend/                     # product web app
│   ├── docker-compose.yml            # frontend-only compose
│   └── docs/
│       ├── adr/
│       ├── architecture/
│       └── runbooks/
├── portfolio-bff/
├── portfolio-calendar/
│   ├── infra/                        # optional submodule (messaging)
│   └── contracts/                    # optional submodule (schemas)
└── notifier_service/
```

`ntakemori-deploy` lives alongside this stack (outside `portfolio-stack/`) and
owns host-level ingress and overrides. The portfolio repo is the single source
of truth for architecture decisions and rationale.
