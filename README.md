# Portfolio Monorepo

This repository now contains both apps that power the portfolio stack:

- Frontend: Next.js app at `frontend/`
- Backend: Django calendar API at `backend/`

The previous standalone repos (`calendar`, `portfolio_orchestration`) were merged into this one.

## Layout

- `frontend/` - Next.js frontend app
- `backend/` - Django backend app
- `docker-compose.yml` - full-stack compose definition
- `.env.example` - shared root env template for local + compose
- `Makefile` - root commands for frontend, backend, and full stack

## Quick Start

1. Create your root env file:
   ```bash
   cp .env.example .env
   ```
2. Ensure frontend data files exist:
   ```bash
   make prepare-portfolio-data
   ```

## Local Development (No Docker)

Use two terminals.

### Terminal 1 (backend)
```bash
make backend-setup
make backend
```

### Terminal 2 (frontend)
```bash
make frontend-setup
make frontend
```

URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Full Stack With Docker

```bash
make up
```

Other useful compose commands:
```bash
make compose-build
make down
make logs
make ps
make config
```

SQLite persistence in Docker uses the named volume `portfolio_calendar_sqlite_data`.

## Environment Variables

Use root `.env` as your primary source of truth.

Commonly edited values:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DISPLAY_NAME`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `PORTFOLIO_PORT`
- `CALENDAR_API_PORT`
- `PORTFOLIO_CONTEXT` (default `./frontend`)
- `CALENDAR_CONTEXT` (default `./backend`)

Backend-specific vars are also in root `.env` (`DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, etc.) and are passed when running backend via root Makefile.

## App-Specific Notes

- Frontend details: see `frontend/`.
- Backend details: see `backend/README.md`.

## Architecture Decisions

- `docs/adr/0001-monorepo-adoption.md` - why this project moved from multi-repo orchestration to a monorepo.
