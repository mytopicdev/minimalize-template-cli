---
name: minimalize-architecture
description: 'Use when the user asks to organize or refactor a project by feature/domain (Screaming Architecture, feature-first, vertical slices). Apply incremental migration, strict import boundaries, and minimal churn conventions.'
---

# Minimalize Architecture

## Purpose

Make the codebase communicate business intent first.
Prefer feature and domain structure over framework layer structure.

## Source of Truth

- `docs/architecture/conventions.md` contains active architecture rules.
- `docs/architecture/decisions/README.md` indexes ADR status and files.
- If guidance conflicts, accepted ADRs take precedence.

## Use When

- The user asks to reorganize folders by feature or domain.
- The user mentions Screaming Architecture, feature-first, or vertical slices.
- The user wants clearer ownership boundaries between modules.
- The user wants a scalable structure for growing product areas.

## Do Not Use When

- The user asks for a small isolated bug fix without structural impact.
- Existing architecture constraints must remain untouched.
- A large refactor would create high churn without clear benefit.

## Core Rules

- Group by feature or domain, not by technical type.
- Keep each feature self-contained: ui, hooks, state, api, tests, and types.
- Move code to common only when reused by 3 or more features.
- Import from other features only through each feature public barrel.
- Never import another feature internals directly.
- Avoid deep nesting unless it improves discoverability.

## Recommended Structure

```text
src/
  features/
    auth/
    todos/
    dashboard/
  common/
    ui/
    hooks/
    utils/
    types/
    providers/
  lib/
  config/
```

## Feature Template

```text
features/<feature-name>/
  <component-a>/
  <component-b>/
  api/
  state/          (optional)
  hooks/          (optional)
  types.ts
  index.ts
  README.md       (optional)
```

## Naming Conventions

- Folders: kebab-case.
- Files: kebab-case.
- Component symbols: PascalCase inside files.
- Hooks: use- prefix.
- Feature barrel: index.ts at feature root only.

## Dependency Boundaries

Allowed:

- feature -> own internal modules
- feature -> common/\*
- feature -> other-feature/index.ts

Not allowed:

- feature -> other-feature/internal/\*
- common -> feature
- circular dependencies between features

## Migration Strategy

1. Audit current structure and identify feature domains.
2. Propose a target tree and path mapping old -> new.
3. Migrate one feature at a time.
4. Update imports to use only public barrels.
5. Run lint, typecheck, and tests after each batch.
6. Stop and report blockers before broad moves.

## Output Contract

When applying this skill, always provide:

1. A short before and after structure summary.
2. Exact moved and created paths.
3. Import boundary fixes performed.
4. Validation status (lint, typecheck, tests when available).
5. Remaining risks and the next migration batch.

## Anti-Patterns

- Big-bang rewrites of the entire src tree.
- Generic folders with unclear business meaning.
- Feature-specific business logic inside common.
- Deep component trees with low signal.
