# Portfolio Frontend

Next.js frontend for the portfolio stack.

Quick demo (frontend only): `make demo-up` (stop with `make demo-down`).

Full stack instructions live in the parent stack repo:
`../README.md`

## Local Development

```bash
make env-init
make install
make dev
```

## Docker

```bash
make docker-up
```

Stop:

```bash
make docker-down
```

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
