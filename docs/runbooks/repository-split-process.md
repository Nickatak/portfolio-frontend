# Runbook: Repository Split Process

## Objective

Split shared concerns out of the app monorepo into dedicated repository
boundaries while preserving local development flow.

## Scope

This runbook covers:

- Messaging infra split (`infra/messaging` -> `portfolio-infra-messaging`)
- Contract split (`contracts/notifier` -> `portfolio-notifier-contracts`)

## Preconditions

- GitHub repositories exist:
  - `portfolio-infra-messaging`
  - `portfolio-notifier-contracts`
- Maintainer has repo write/admin permissions.
- Local branch is clean before extraction.

## Step 1: Identify and Map Boundaries

Define ownership before moving files.

- App runtime: `frontend/`, `backend/`, root app compose
- Messaging infra: Kafka + topic bootstrap definitions
- Contracts: event schemas and compatibility docs

## Step 2: Extract Files into Boundary Directories

Move or create artifacts:

- `infra/messaging/docker-compose.messaging.yml`
- `contracts/notifier/events/*.schema.json`
- Boundary README files in each directory

## Step 3: Preserve Dev Workflow with Compose Layering

Ensure merged compose behavior remains one command:

- Base app compose: `docker-compose.yml`
- Messaging compose: `infra/messaging/docker-compose.messaging.yml`
- `Makefile` composes both for `make up`

Provide app-only fallback command:

- `make up-core`

## Step 4: Document Structure and Decision Rationale

Update docs:

- ADR for boundary decision
- Repository structure document
- README references to new boundaries and commands

## Step 5: Validate

Minimum checks:

- Compose config renders with merged files:
  - `make config`
- Backend tests still pass:
  - `cd backend && .venv/bin/python manage.py test -v 0`

## Step 6: Sync Boundary Directories to Dedicated Repositories

Use one of the approaches below.

### Option A: Copy into cloned target repo

1. Clone target repo locally.
2. Copy boundary directory contents.
3. Commit and push in target repo.

### Option B: Subtree split from this monorepo

Example commands:

```bash
git subtree split --prefix infra/messaging -b split/infra-messaging
git subtree split --prefix contracts/notifier -b split/notifier-contracts

git push <portfolio-infra-messaging-remote> split/infra-messaging:main
git push <portfolio-notifier-contracts-remote> split/notifier-contracts:main
```

If target repositories were auto-initialized and histories conflict, perform a
normal clone/copy flow instead of force pushing by default.

## Post-Split Governance

- Treat contracts as versioned interfaces.
- Keep app producer behavior aligned with schema updates.
- Keep infra changes isolated from app runtime changes unless interface changes require coordination.

## Rollback Strategy

If split causes workflow breakage:

1. Restore compose wiring to known-good state.
2. Revert boundary moves in a single rollback commit.
3. Re-run validation checks and reopen split in smaller phases.
