# Messaging Infra (Split Boundary)

This directory contains Kafka infrastructure compose definitions that were
split from the root stack definition.

## Purpose

- Keep messaging infrastructure concerns isolated from app runtime concerns.
- Make extraction to `portfolio-infra-messaging` straightforward.
- Preserve local full-stack developer experience via merged compose files.

## Files

- `docker-compose.messaging.yml`: Kafka broker + topic bootstrap services.

## Local Usage

From repo root, compose commands are wired through the `Makefile` and include:

- `docker-compose.yml`
- `infra/messaging/docker-compose.messaging.yml`

Run:

```bash
make up
```

To run app services only (no Kafka infra):

```bash
make up-core
```
