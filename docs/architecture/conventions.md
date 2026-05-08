# Architecture Conventions

## Objective

Organize by business feature and domain intent, not framework layers.

## Structure Rules

- Prefer `src/features/<feature-name>/` for domain-owned code.
- Use `src/common/` only for cross-cutting code reused by 3 or more features.
- Keep feature internals local: ui, hooks, state, api, tests, types.
- Use one public barrel per feature at `src/features/<feature-name>/index.ts`.

## Dependency Boundaries

Allowed:

- feature -> same feature internals
- feature -> `src/common/*`
- feature -> another feature public barrel only

Not allowed:

- feature -> another feature internal paths
- `src/common/*` -> `src/features/*`
- circular dependencies between features

## Naming Rules

- Folders: kebab-case.
- Files: kebab-case.
- Component symbols: PascalCase.
- Hooks: `use-` prefix in file name and `useX` symbol naming.
- Avoid `index.tsx`; use descriptive filenames.

## Migration Rules

1. Propose target tree and path mapping before moving files.
2. Migrate by small batches, one feature area at a time.
3. Update imports to public barrels during each batch.
4. Validate lint, typecheck, and tests after each batch.
5. Stop and escalate with ADR when conflicts appear.

## Anti-Patterns

- Big-bang rewrites of the whole `src` tree.
- Generic folders without clear business meaning.
- Feature-specific business logic moved into `src/common`.
- Deep nesting that harms discoverability.
