# Portfolio Stack

This repository is the primary product repo for the portfolio application
stack. It owns the frontend (Next.js) and local orchestration helpers.

Quick demo (frontend only): `make demo-up` (stop with `make demo-down`).

Backend services live in dedicated repositories:

- `portfolio-bff` (content/dashboard BFF)
- `portfolio-calendar` (calendar API producer)
- `notifier_service` (Kafka broker + notifier worker runtime)

## Ecosystem Repositories

- `portfolio` (this repo): product code and primary local workflow
- `portfolio-bff`: content + dashboard backend for the portfolio UI
- `portfolio-calendar`: C# minimal calendar API producer
- `portfolio-infra-messaging`: Kafka broker + topic bootstrap definitions
- `portfolio-notifier-contracts`: versioned event contract schemas
- `notifier_microservice` (separate repo): notifier consumer/worker service

## Port Map (Defaults)

- Frontend (Next.js): `3000`
- BFF (Django): `8001`
- Calendar API: `8002`
- Kafka (host, localhost-only): `9092`
- MySQL (host): `3306`

## Architecture At A Glance

```text
User Browser
    |
    v
frontend (portfolio/frontend)
    |
    v
portfolio-bff (content + dashboard API)
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

## Development

There are three supported modes:
1. Demo (frontend only): `make demo-up`
2. Full stack (local)
3. Full stack (Docker)

### Full Stack (Local)

1. Start Kafka:
```bash
cd ../notifier_service
docker compose up -d kafka kafka-init
```

2. Start the calendar API (producer):
```bash
cd ../portfolio-calendar
export KAFKA_PRODUCER_ENABLED=true
export KAFKA_BOOTSTRAP_SERVERS=localhost:9092
dotnet run
```

3. Start the BFF (MySQL + Django):
```bash
cd ../portfolio-bff
make db-up
make install
make migrate
make dev
```

4. Start the frontend:
```bash
make dev
```

Local ports:
- Frontend: `http://localhost:3000`
- BFF: `http://localhost:8001`
- Calendar API: `http://localhost:8002`

Ports are fixed by default. If you need to change one, set the explicit
environment variable (e.g., `PORTFOLIO_PORT`, `PORTFOLIO_BFF_PORT`,
`CALENDAR_API_PORT`) and update `NEXT_PUBLIC_API_BASE_URL` accordingly.

### Full Stack (Docker)

Start the BFF in Docker:
```bash
cd ../portfolio-bff
docker compose up -d --build
```

Optional: start the calendar API in Docker:
```bash
cd ../portfolio-calendar
docker compose up --build
```

Optional: enable Kafka publishing (appointments.created) in Docker:
```bash
cd ../notifier_service
docker compose up -d kafka kafka-init

cd ../portfolio-calendar
docker build -t portfolio-calendar:local .
docker run -d --name portfolio-calendar \
  --network notifier_service_default \
  -p 8002:8002 \
  -e KAFKA_PRODUCER_ENABLED=true \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka:19092 \
  -e KAFKA_TOPIC_APPOINTMENTS_CREATED=appointments.created \
  -e KAFKA_NOTIFY_EMAIL_DEFAULT=true \
  -e KAFKA_NOTIFY_SMS_DEFAULT=false \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  portfolio-calendar:local
```

If you intentionally publish the calendar API on a different port, update
`NEXT_PUBLIC_API_BASE_URL` to match.

Start the frontend container:
```bash
make docker-up
```

The frontend container resolves the BFF as `http://portfolio-bff:8000` on the
shared `portfolio_net` network.

## Environment Configuration

This repo uses a single runtime env file at `.env` for local and Docker flows.

- Run `make env-init` to create `.env` from `.env.example` if missing.
- Update `.env` values for your machine/runtime.
- `make docker-*` commands provide Docker-based workflows.

TODO: document the master compose tree in `docs/` once the stack is finalized.

## Environment Variables

Root `.env` drives frontend runtime values.

Frequently edited:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DISPLAY_NAME`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_BFF_REPO_URL`
- `PORTFOLIO_PORT`
- `DEMO_MODE` (demo compose only)

See `.env.example` for full defaults and comments.
