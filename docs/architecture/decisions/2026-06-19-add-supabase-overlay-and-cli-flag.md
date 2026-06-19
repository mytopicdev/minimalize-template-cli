# ADR: Distribute the Supabase Integration as an Optional CLI Overlay (`--supabase`)

- Status: Accepted
- Date: 2026-06-19
- Owner: repository maintainers

## Context

We want to offer Supabase preconfigured (auth + client + env scaffolding) as a
first-class option without breaking the "minimalize" promise of the default
template. Four distribution paths were on the table:

1. **CLI flag** — `pnpx create-minimalize-template my-app --supabase`. Default
   stays minimal; opt-in.
2. **Interactive prompt** — `Quieres Supabase? (y/N)`. Friendlier for newcomers
   but breaks non-interactive use (CI, scripts).
3. **Always included** — every scaffold ships Supabase wiring. Fastest to ship,
   but forces every user to delete code they don't want.
4. **Separate package** — publish `create-minimalize-supabase` as its own CLI.
   Cleanest separation but doubles maintenance.

We picked (1). This ADR documents how the integration is **shaped on disk** and
**applied by the CLI**, and the consequences of that shape — including a real
distribution bug (`pnpm dlx` dist-tag resolution) we hit on the first end-to-end
test from npm.

This ADR depends on the auth abstraction in
`2026-06-19-introduce-auth-provider-abstraction.md` — that abstraction is what
makes the overlay a one-file swap rather than a fork.

## Decision

### On-disk layout: overlay folder sibling to the base template

```
template/             # base scaffold (unchanged when --supabase is absent)
template-supabase/    # overlay: ONLY the files that change or are added
  src/common/providers/
    auth/
      supabase-auth-provider.ts   # AuthProvider impl using supabase.auth.*
      index.ts                    # exports supabaseAuthProvider as authProvider
    supabase-client.ts            # createClient(...) singleton
  src/features/auth/ui/login-page.tsx  # adds a commented OAuth block; same form
  package.json.patch.json         # deep-merged into target package.json
  .env.example.append             # appended to target .env.example
```

Rationale: the base template has zero conditionals — anyone reading it sees a
plain React app. The overlay is just a normal directory of real files. New
backends (Firebase, custom API, none) can be added as siblings of
`template-supabase/` with the exact same CLI plumbing.

### CLI behavior (`cli.js`)

- Parses `--supabase` from any argv position (`pnpx create-minimalize-template my-app --supabase`
  and `pnpx create-minimalize-template --supabase my-app` both work).
  Unknown flags are rejected with a clear error.
- Without `--supabase`: byte-identical to pre-1.7.0 behavior.
- With `--supabase`:
  1. Validates `template-supabase/` exists in the package; errors clearly if
     not (defends against partial publishes).
  2. Copies `template/` → target (as before).
  3. Renames `gitignore` → `.gitignore` (npm strips top-level `.gitignore`).
  4. Walks `template-supabase/` and copies every file to the target with
     `overwrite: true`, **except** the two special files (`package.json.patch.json`
     and `.env.example.append`).
  5. Deep-merges `package.json.patch.json` into the target's `package.json`,
     key-by-key at the top level (so `dependencies`, `devDependencies`, etc.
     compose with what the base already declared).
  6. Appends `.env.example.append` to `.env.example`.
- Final success message gains a `Supabase (auth + client preconfigured)` bullet
  and a `🔐 Supabase setup` block with the 4-step config recipe.

### Packaging

- `package.json` `files` field includes `template-supabase/**/*` and the
  negation `!template-supabase/node_modules/**`, consistent with the precedent
  set by `2026-06-17-fix-package-exclude-template-node-modules.md`. `npm pack --dry-run`
  must list the overlay files; the published tarball must contain them.

### Install recommendation (operational, see "Consequences" below)

- The README recommends `npx --yes create-minimalize-template@latest …` as the
  primary install command, **not** `pnpx`/`pnpm dlx`. See the consequences
  section for why.

## Consequences

- Positive
  - The base scaffold stays minimal — no `if (supabase) {...}` branches in
    template source files.
  - Adding another backend in the future is purely additive (a new sibling
    folder + a new flag in `cli.js`), no edits to existing overlays.
  - The overlay is editable as plain TypeScript — IDEs, linters, formatters
    all work normally.
  - The auth abstraction means the only file the overlay needs to flip is
    `common/providers/auth/index.ts`; features stay untouched.
- Tradeoffs / known issues
  - **`pnpm dlx <pkg>@latest` does not resolve to the latest published
    version of this package on pnpm 9.15.4.** It consistently pulls v1.6.2 even
    after a full nuclear cache purge (`rm -rf ~/Library/Caches/pnpm`,
    `pnpm store prune`, removal of `~/.npmrc`). Other packages (`cowsay`,
    `create-react-app`) resolve correctly; `npm view`, `pnpm view`, and direct
    `curl https://registry.npmjs.org/create-minimalize-template/latest` all
    return `1.7.1` in every endpoint variant tested (normal, abbreviated,
    `/latest`). Workarounds that **do** work:
    - `npx --yes create-minimalize-template@latest …` (npm exec)
    - `pnpx create-minimalize-template@<exact-version> …` (pin the version)
    - `pnpm dlx --package=create-minimalize-template@latest create-minimalize-template …`
      (the explicit `--package` form)
    The README leads with `npx` and documents the pnpm-compatible workarounds.
    No reproduction with another package was found that explains it; suspected
    edge case in `pnpm dlx`'s dist-tag handling for this package. Worth filing
    upstream against pnpm.
  - The two "special files" (`package.json.patch.json`, `.env.example.append`)
    are CLI-internal conventions, not standard tooling. They must be excluded
    from the file-walk copy and handled explicitly. Adding new file types with
    merge semantics requires CLI changes.
  - The overlay relative imports (`./auth-provider`) only resolve correctly
    **after** the overlay sits on top of the base. The overlay is not a
    type-checkable standalone project; CI for it has to scaffold first, then
    typecheck.

## Alternatives Considered

- **Conditional rendering inside `template/`** — `if (process.env.HAS_SUPABASE)`
  branches in the same template files. Rejected: opaque to readers, fragile
  across editors, breaks the "what you see is what you scaffold" mental model.
- **Always-on Supabase** — drops the flag and ships Supabase by default.
  Rejected: violates the "minimalize" promise; punishes the majority of users
  who try the CLI without a backend.
- **Separate npm package** (`create-minimalize-supabase`). Rejected:
  duplicates 90% of the CLI plumbing and the base template; doubles the
  release surface.
- **Prompt for Supabase interactively.** Rejected: breaks non-interactive
  invocations (CI scripts, automated scaffolding).

## Migration and Impact

- Files added (new in 1.7.0)
  - `cli.js` (`--supabase` parsing + overlay application + setup message)
  - `package.json` (`files` array gains `template-supabase/**/*` and
    `!template-supabase/node_modules/**`)
  - `template-supabase/src/common/providers/supabase-client.ts`
  - `template-supabase/src/common/providers/auth/supabase-auth-provider.ts`
  - `template-supabase/src/common/providers/auth/index.ts`
  - `template-supabase/src/features/auth/ui/login-page.tsx`
  - `template-supabase/package.json.patch.json`
  - `template-supabase/.env.example.append`
- Validation
  - Scaffold both flavors into `/tmp`, run `pnpm install`, then `pnpm run lint`,
    `pnpm run build` (which executes `tsc -b && vite build`, the
    authoritative typecheck). Both must be clean.
  - Inspect `.env.example` of the supabase variant: must contain both the base
    vars and the appended `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
  - Inspect `package.json` of the supabase variant: `@supabase/supabase-js`
    must appear in `dependencies` while base deps are preserved.
- Rollout: shipped in 1.7.0; README updates and operational notes shipped in
  1.7.1.

## References

- `2026-06-19-introduce-auth-provider-abstraction.md` — the abstraction this
  overlay plugs into.
- `2026-06-17-fix-package-exclude-template-node-modules.md` — precedent for the
  `package.json` `files` allowlist with negations.
- PR #4 (overlay + flag), PR #5 (initial docs).
- Package versions 1.7.0 / 1.7.1.
