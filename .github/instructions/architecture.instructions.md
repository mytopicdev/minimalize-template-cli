---
applyTo: '**'
description: 'Use when work affects project structure, folder organization, feature boundaries, naming conventions, or cross-feature imports. Enforce architecture conventions and ADR precedence before making structural changes.'
---

# Architecture Instruction

## Required Inputs Before Structural Changes

- Read `docs/architecture/conventions.md`.
- Read `docs/architecture/decisions/README.md` and relevant ADR files.
- If no matching decision exists, follow conventions and note assumptions.

## Precedence Rules

1. Accepted ADRs override conventions.
2. Conventions override generic defaults.
3. If conflict remains, stop and propose a new ADR.

## Structural Change Contract

For refactors that move files, split features, or change boundaries, always include:

1. Before and after structure summary.
2. Exact moved and created paths.
3. Import boundary checks performed.
4. Validation status (lint, typecheck, tests if available).
5. Remaining risks and next incremental batch.

## Constraints

- Prefer incremental batches over broad rewrites.
- Do not import feature internals from other features.
- Do not move business logic to shared folders without reuse evidence.
