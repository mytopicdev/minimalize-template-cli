# ADR: Introduce an `AuthProvider` Abstraction Between Features and the Auth Backend

- Status: Accepted
- Date: 2026-06-19
- Owner: repository maintainers

## Context

Up to and including 1.6.x, the template's auth surface was a Zustand store with a
single boolean (`isAuthenticated`) persisted to `localStorage` via the `persist`
middleware, plus an empty `loginAction` and a placeholder `LoginPage` with a button
that called `useAuthStore().login()`. The store was the de-facto source of truth.

We want to support a real backend (starting with Supabase, see
`2026-06-19-add-supabase-overlay-and-cli-flag.md`) without coupling every feature
to a specific SDK. Two paths existed:

1. Wire features directly against the chosen SDK (`supabase.auth.*`). Fast to ship,
   but every future migration (Firebase, a custom backend, an in-memory test
   double) touches every consumer.
2. Define a thin contract that features depend on, and swap the active
   implementation. Adds one layer of indirection; isolates the SDK to a single
   adapter file.

The template is called "minimalize", so the abstraction had to stay tiny — no
provider registries, no DI containers, no event buses.

A second constraint came from React Router: guards (`requireAuth`,
`redirectIfAuth`) are synchronous loaders that read state at navigation time. A
real auth backend resolves the current session asynchronously. Either guards
become async (which forces Suspense at the route level), or the session is
hydrated before the router mounts.

## Decision

- Define a single contract at
  `template/src/common/providers/auth/auth-provider.ts`:

  ```ts
  interface AuthSession {
    userId: string
    email: string | null
  }
  interface AuthProvider {
    getSession(): Promise<AuthSession | null>
    signInWithPassword(email: string, password: string): Promise<AuthSession>
    signUp(email: string, password: string): Promise<AuthSession>
    signOut(): Promise<void>
    onAuthChange(callback: (session: AuthSession | null) => void): () => void
  }
  ```

  Errors are propagated via `throw` (no `Result<T,E>` wrapper); UI catches at the
  form boundary. The session shape is the minimum common denominator — providers
  may attach more internally but the contract only exposes `userId` + `email`.

- `template/src/common/providers/auth/index.ts` re-exports the active provider as
  `authProvider`. This is the single swap point.

- The base template ships `mock-auth-provider.ts` (in-memory + `localStorage`
  persistence under key `auth-session`). Sign-in/up always succeed with a fake
  `crypto.randomUUID()`. This preserves the pre-1.7.0 UX exactly when no backend
  flag is passed.

- The Zustand store becomes a **reactive cache** of the provider, not a source of
  truth. The `persist` middleware is removed — persistence is now the provider's
  job. New shape:

  ```ts
  { session: AuthSession | null; isAuthenticated: boolean; setSession(...) }
  ```

  `isAuthenticated` is derived inside `setSession` so guards keep their existing
  read pattern.

- `main.tsx` hydrates before mount:

  ```ts
  const session = await authProvider.getSession()
  useAuthStore.getState().setSession(session)
  authProvider.onAuthChange((s) => useAuthStore.getState().setSession(s))
  createRoot(...).render(...)
  ```

  Top-level await is supported because `tsconfig.app.json` already targets
  `ES2022` with `module: "ESNext"`. Guards stay synchronous; no Suspense is
  introduced.

- Features and UI never import the SDK. They call `authProvider.signOut()`,
  `authProvider.signInWithPassword(...)`, etc.

## Consequences

- Positive
  - Swapping the auth backend is a one-file change
    (`common/providers/auth/index.ts` exports a different implementation). All
    features keep working untouched.
  - Guards stay synchronous → no Suspense boundary, no flicker, no async router
    loaders.
  - The mock keeps the "no-backend" experience identical to 1.6.x. Newcomers
    aren't forced to provision Supabase to try the template.
  - The contract is intentionally small (5 methods, 2 types). Easy to audit, easy
    to implement.
- Tradeoffs / notes
  - One extra layer of indirection. For people new to the codebase, the path
    from `signIn` button → `authProvider.signInWithPassword` → concrete
    implementation is one hop longer than calling the SDK directly.
  - Top-level await in `main.tsx` means the page is blocked on `getSession()`
    before first paint. For the mock that's a `localStorage` read (microseconds);
    for Supabase it's the in-memory session restore (also fast, no network
    round-trip in the common case). Acceptable.
  - The contract is auth-only. A symmetric `DataProvider` was considered for DB
    access but **deliberately deferred** — DB queries benefit from full SDK
    surface (filters, joins, RPC), and abstracting them prematurely would lose
    typings and ergonomics. Features will import `supabase` directly for DB
    work; only auth crosses the abstraction.

## Alternatives Considered

- **Direct SDK access from features.** Less code initially; chosen against
  because future backend changes ripple through every consumer.
- **Hybrid (auth abstracted, DB direct).** This is the path we picked overall,
  but expressed as "abstract auth now, don't abstract DB at all" rather than
  "abstract both with different rules". Cleaner.
- **Async guards + Suspense.** Avoids the top-level await but introduces a
  suspense boundary at the router root and a brief flicker on first navigation.
  Top-level await is simpler.
- **Keep Zustand `persist` and also wire the provider.** Two sources of truth
  guarantee drift bugs. Rejected.

## Migration and Impact

- Files added
  - `template/src/common/providers/auth/auth-provider.ts`
  - `template/src/common/providers/auth/mock-auth-provider.ts`
  - `template/src/common/providers/auth/index.ts`
- Files modified
  - `template/src/main.tsx` (top-level await + hydration + subscription)
  - `template/src/features/auth/state/use-auth-store.ts` (drop `persist`, new
    shape)
  - `template/src/features/auth/ui/login-page.tsx` (controlled email/password
    form, calls `authProvider.signInWithPassword`)
  - `template/src/features/home/ui/home-page.tsx` (calls
    `authProvider.signOut()` instead of the old `useAuthStore().logout()` — the
    `logout` method was removed from the store)
- Unchanged (intentional)
  - `template/src/features/routing/guards/require-auth.ts` and `redirect-if-auth.ts`
    keep reading `useAuthStore.getState().isAuthenticated` synchronously.
  - `loginLoader`, `loginAction` remain no-ops; the form submits via React state
    rather than via the router action, since we want client-side error display
    without a navigation.
- Validation
  - `tsc -b` (full build, not just `tsc --noEmit`) is the authoritative
    typecheck. The `home-page.tsx` regression in PR #4 was caught by `tsc -b` but
    silently passed `tsc --noEmit`.
  - `pnpm run lint && pnpm run build` pass cleanly on a scaffolded project.
- Rollout: shipped in 1.7.0.

## References

- `2026-06-19-add-supabase-overlay-and-cli-flag.md` — the consumer of this
  abstraction.
- PR #4 — initial implementation and review.
- Package versions 1.7.0 / 1.7.1.
