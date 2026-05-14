# ADR: Adopt Minimalize Architecture as Default Project Structure

- Status: Accepted
- Date: 2026-05-08
- Owner: repository maintainers

## Context

The repository needed a clear and reusable architecture standard that can be applied consistently by both humans and coding agents. Prior guidance existed but was fragmented and not always optimized for low-context execution.

We need a default structure that:

- Prioritizes business intent over technical layers.
- Scales across new features without broad rewrites.
- Defines strict dependency boundaries to reduce coupling.
- Is concise enough to be consumed reliably by agents.

## Decision

Adopt Minimalize Architecture as the default architectural model for this repository and future project evolution.

Core decision points:

- Organize source code by feature and domain intent.
- Keep feature modules self-contained.
- Restrict cross-feature access to public barrels only.
- Keep shared code in `common` only when reuse is proven.
- Apply migrations incrementally in small batches.

The canonical rules are defined in `docs/architecture/conventions.md`.

## Consequences

- Positive outcomes:
  - Faster onboarding with clearer project intent.
  - More predictable refactors with reduced structural drift.
  - Better agent consistency due to explicit constraints and precedence.
- Tradeoffs and risks:
  - Initial friction when converting legacy layer-based areas.
  - Requires discipline to keep `common` truly cross-cutting.
  - Team must maintain ADRs when exceptions are introduced.

## Alternatives Considered

- Keep framework-layer organization (`components`, `hooks`, `utils`) as default.
  - Rejected because ownership and feature boundaries become ambiguous as the codebase grows.
- Enforce architecture only through skill instructions without ADRs.
  - Rejected because exceptions and historical decisions would be hard to track.
- Big-bang migration of all directories immediately.
  - Rejected due to high risk, high churn, and low reviewability.

## Migration and Impact

- Files or areas affected:
  - `docs/architecture/conventions.md`
  - `.github/skills/minimalize-architecture/SKILL.md`
  - `.github/instructions/architecture.instructions.md`
  - Future structural changes in `template/src/`
- Rollout strategy:
  - Incremental by feature area.
  - Validate boundaries and imports in each batch.
- Validation plan:
  - Run lint, typecheck, and tests when structural changes are applied.

## References

- `docs/architecture/README.md`
- `docs/architecture/conventions.md`
- `docs/architecture/decisions/README.md`
- `.github/skills/minimalize-architecture/SKILL.md`
- `.github/instructions/architecture.instructions.md`
