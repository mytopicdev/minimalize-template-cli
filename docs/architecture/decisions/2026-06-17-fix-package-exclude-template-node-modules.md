# ADR: Exclude `template/node_modules` from the Published Package

- Status: Accepted
- Date: 2026-06-17
- Owner: repository maintainers

## Context

A scaffolded project created from the published npm package had no working PWA service
worker. Investigation showed the PWA configuration was correct — the real cause was a
packaging bug: the published package was shipping `template/node_modules`
(~134–178 MB, ~6460 files).

It was included because `package.json` `files: ["template/**/*"]` is a greedy allowlist
that **overrides `.npmignore`**. This was verified empirically: even adding an explicit
`template/node_modules` line to `.npmignore` did not exclude it from `npm pack`. As a
result, every scaffold pulled in a corrupted/partial dependency tree (packing mangles
pnpm's symlinked store); a subsequent `pnpm install` over that broken tree failed to
resolve `vite-plugin-pwa`, so no service worker was generated or registered. A clean,
local build always worked, which is why the bug only reproduced from the npm install.

This decision extends the PWA work — see `2026-06-17-add-pwa-support.md`, during which
`template/node_modules` first appeared locally.

## Decision

- Add negation globs to `package.json` `files` so build/install artifacts are never
  packed: `!template/node_modules/**`, `!template/dist/**`, `!template/dev-dist/**`.
  This produces a clean tarball under **both** `npm pack` and `pnpm pack`, and
  `pnpm publish` (used by the `release:*` scripts) is what actually ships.
- Add a `filter` to `cli.js`'s `copy(templateDir, targetDir, …)` that skips
  `node_modules` / `dist` / `dev-dist` anywhere under the template, so scaffolding never
  drags local artifacts even if they exist on the maintainer's machine.
- Keep `template/node_modules` deleted; it is fully regenerable via `pnpm install`.

## Consequences

- Positive: the published tarball is tiny and correct (~16 KB, ~41 files); scaffolded
  projects install reliably and the service worker registers as intended.
- Tradeoff / note: while a `files` allowlist exists, `.npmignore`'s `node_modules` rule
  is ineffective for nested paths — the `files` negations are the source of truth and
  must be kept in sync if new generated directories appear.

## Alternatives Considered

- **Rely on `.npmignore`** — rejected: empirically overridden by the `files` allowlist.
- **Harden `prepublishOnly` to `rm -rf` the dirs** — viable as belt-and-suspenders, but
  the `files` negations already yield a deterministically clean tarball, so it was not
  required.
- **Drop the `files` field, use `.npmignore` only** — rejected: larger blast radius and
  easier to accidentally over- or under-include files.

## Migration and Impact

- Files changed: `package.json` (`files` negations); `cli.js` (copy `filter` + `relative`
  import).
- Validation: `npm pack --dry-run` and `pnpm pack` report 0 `template/node_modules`
  entries; `node cli.js <app> && pnpm install && pnpm build` emits `dist/sw.js`,
  `dist/manifest.webmanifest`, and the generated PWA icons; `pnpm preview` serves them.
- Rollout: republished as **1.6.2**. The broken **1.6.1** should not be used.

## References

- `2026-06-17-add-pwa-support.md` (PWA support ADR)
- npm `files` field and `.npmignore` precedence behavior
- Package version 1.6.2
