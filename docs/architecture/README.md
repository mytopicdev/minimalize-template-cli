# Architecture Governance

This folder is the source of truth for architecture rules and structural decisions.

## Goals

- Keep architecture guidance short, explicit, and agent-friendly.
- Preserve consistency across refactors and feature growth.
- Record important decisions with lightweight ADRs.

## Scope

- Folder strategy and module boundaries.
- Naming conventions for feature-first structure.
- Decision log for architecture changes.

## Read Order

1. `conventions.md` for active structure rules.
2. `decisions/README.md` for ADR index and statuses.
3. Decision files in `decisions/` for accepted or proposed exceptions.

## Rule Precedence

1. Accepted ADRs.
2. `conventions.md`.
3. Project defaults and tool conventions.

If rules conflict, propose a new ADR instead of improvising.

## Ownership

- Primary owner: repository maintainers.
- Contributors: update docs when changing boundaries or structure.

## Maintenance Cadence

- Monthly review of accepted and superseded ADRs.
- Remove stale guidance that no longer applies.
- Keep each document concise to reduce agent context cost.
