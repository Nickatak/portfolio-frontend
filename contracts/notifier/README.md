# Notifier Contracts (Split Boundary)

This directory defines event contracts shared between the portfolio producer
(`calendar-api`) and notifier consumers.

## Purpose

- Keep event payload contracts explicit and versionable.
- Provide a clean extraction path to `portfolio-notifier-contracts`.
- Reduce producer/consumer drift by documenting expected schema.

## Current Contracts

- `events/appointments.created.schema.json`
- `events/appointments.created.dlq.schema.json`

## Versioning Guidance

- Treat contract changes as semver changes in the contracts repository.
- Backward-compatible additive changes should not break existing consumers.
- Breaking changes require coordinated producer/consumer rollout.
