# ADR: Adopt React Router Data API and Feature-First Structure for Template

- Status: Accepted
- Date: 2026-05-08
- Owner: repository maintainers

## Context

The template (`template/src/`) had two converging problems:

1. **Routing limitation**: Used wouter with declarative `<Switch><Route />` pattern without support for data-router features (loaders, actions, `<Outlet />`). This limited scalability for features requiring data fetching coordination.

2. **Structure mismatch**: Organized by technical layers (`pages/`, `stores/`, `utils/`) contradicting the Minimalize Architecture ADR (`2026-05-08-adopt-minimalize-architecture.md`) and `docs/architecture/conventions.md`, which mandate organization by business feature/domain.

The template needed a routing solution that supports:

- Loader/action pattern for data fetching
- Layout composition with nested routes
- Authentication guards at route level
- Type-safe path constants

And a structure that demonstrates:

- Feature boundaries with public barrels
- Explicit import rules (no internal cross-feature access)
- Common utilities only when truly cross-cutting

## Decision

Adopt `react-router-dom@^6` with data-router API (`createBrowserRouter` + `RouterProvider`) and simultaneously reorganize template source into feature modules:

### Routing Architecture

- **Router configuration**: Centralized in `src/features/routing/router.tsx` using `createBrowserRouter`
- **Path constants**: Type-safe paths in `src/features/routing/paths.ts` exported via barrel
- **Layouts**: Separate `AppLayout` (private) and `AuthLayout` (public) with `<Outlet />` for nested routes
- **Auth enforcement**: Loader functions (`requireAuth`, `redirectIfAuth`) applied at layout level, eliminating need for wrapper components
- **Data fetching pattern**: Each feature exposes `loader.ts` and `action.ts` files, published via public barrel

### Feature Organization

- **Domain features**: `src/features/auth/` and `src/features/home/` with internal folders (`ui/`, `state/`, `loaders/`, `actions/`)
- **Transversal feature**: `src/features/routing/` encapsulates routing infrastructure (paths, layouts, guards, config)
- **Common utilities**: `src/common/utils/cn.ts` for truly cross-cutting helpers
- **Public barrels**: Each feature exports through `index.ts` enforcing boundary

### Migration Strategy

Executed in 6 incremental batches:

1. Dependency swap (wouter → react-router-dom)
2. Routing skeleton (paths, layouts)
3. Auth feature migration
4. Home feature migration
5. Common utilities relocation
6. Data-router wiring and ADR creation

Each batch validated independently (lint + type-check), with separate commits following repository emoji convention.

## Consequences

### Positive Outcomes

- **Scalable routing**: Loaders/actions pattern supports complex data requirements without prop drilling
- **Clearer intent**: URL-driven navigation with auth state reflected in actual routes (no `/` rendering login)
- **Better boundaries**: Feature modules with explicit public surface prevent internal coupling
- **Template education**: Generated projects start with proper architecture patterns built-in
- **Type safety**: Centralized path constants prevent routing string typos

### Tradeoffs and Risks

- **Initial reorganization scope**: All 7 `src/` files changed location/imports — mitigated by incremental batches with validation
- **Routing feature exception**: `features/routing/` is infrastructure not business domain — accepted because it cohesively encapsulates UI (layouts), logic (guards), and config (paths)
- **Learning curve**: Developers unfamiliar with data-router API need documentation — mitigated by inline comments in `router.tsx`
- **Zustand hydration timing**: Loaders execute pre-hydration with async storage — documented in `require-auth.ts` comment for future consideration

## Alternatives Considered

### Keep wouter + custom data-fetching

**Rejected**: No standard pattern; each feature would implement fetching differently. Ergonomics poor compared to loader/action convention.

### Use TanStack Router

**Rejected**: More type-safe but higher learning curve and more opinionated. Too heavyweight for template scaffolding purpose.

### Maintain layer-based structure (pages/, stores/, utils/)

**Rejected**: Directly contradicts accepted Minimalize Architecture ADR. Would perpetuate technical-layer organization anti-pattern.

### Extract routing to common/

**Rejected**: Routing feature includes UI components (layouts) which should not live in `common/`. Feature-level organization better encapsulates cohesive routing concerns.

### Defer migration (wouter + layers as separate decisions)

**Rejected**: Both problems interlock — routing guards need store access, and feature-based structure clarifies routing config ownership. Solving together prevents double migration.

## Migration and Impact

### Files Affected

**Created**:

- `src/features/routing/{paths.ts, router.tsx, index.ts}`
- `src/features/routing/ui/{app-layout.tsx, auth-layout.tsx}`
- `src/features/routing/guards/{require-auth.ts, redirect-if-auth.ts}`
- `src/features/auth/{ui/login-page.tsx, state/use-auth-store.ts, loaders/login-loader.ts, actions/login-action.ts, index.ts}`
- `src/features/home/{ui/home-page.tsx, loaders/home-loader.ts, actions/home-action.ts, index.ts}`
- `src/common/utils/cn.ts`

**Modified**:

- `src/main.tsx` (App → RouterProvider)
- `package.json` (wouter → react-router-dom, tailwind-merge version correction)

**Deleted**:

- `src/App.tsx`
- `src/router.tsx`
- `src/pages/{Login.tsx, Home.tsx}`
- `src/stores/auth.ts`
- `src/utils/cn.ts`

### Rollout Strategy

Six sequential commits on `release/1.0.0`:

1. `📦 chore(template): replace wouter with react-router-dom`
2. `✨ feat(template/routing): scaffold routing feature with paths and layouts`
3. `♻️ refactor(template/auth): move auth into feature module`
4. `♻️ refactor(template/home): move home into feature module`
5. `♻️ refactor(template/common): relocate cn util into common/utils`
6. `✨ feat(template/routing): wire data router and document ADR`

### Validation Plan

**Per-batch**:

- `pnpm lint` (ESLint passes)
- `pnpm type-check` (TypeScript compiles without errors)

**Final (batch 6)**:

- `pnpm build` (Vite production build succeeds)
- `pnpm dev` (manual smoke test: login flow, logout flow, persistence, guards)
- Residual audit: `grep -rn "wouter|@/pages|@/stores|@/utils" src/` returns empty

**Smoke test checklist**:

1. Clear localStorage → visit `/` → redirects to `/login`
2. Click login → stores session → navigates to `/` → HomePage renders
3. Click logout → clears session → navigates to `/login`
4. Refresh at `/` with persisted session → stays at `/`
5. Navigate to `/login` with active session → redirects to `/`
6. Navigate to non-existent route → redirects to `/`

### Exception Justification

This migration reorganizes the entire `template/src/` tree in a single PR, which appears to violate the Minimalize Architecture convention: "Avoid big-bang rewrites of the whole `src` tree."

**Exception rationale**:

- **Template scope**: Only 7 source files exist; this is scaffolding not production codebase
- **Incremental execution**: 6 verifiable batches with separate commits, not atomic refactor
- **One-time foundation**: Sets correct patterns before user extends template; delaying would require users to migrate their own features
- **Pre-feature state**: No business logic exists yet; moving empty structure is low-risk
- **ADR documentation**: This decision explicitly records the exception to protect the general rule

Future structural changes in generated projects (post-scaffold) must follow incremental migration rules.

## References

- `docs/architecture/conventions.md` (Minimalize Architecture rules)
- `docs/architecture/decisions/2026-05-08-adopt-minimalize-architecture.md` (Base ADR)
- `WOUTER_MIGRATION_PLAN.md` (Detailed implementation plan)
- [React Router v6 Data APIs](https://reactrouter.com/en/main/routers/create-browser-router)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
