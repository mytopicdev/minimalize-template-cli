# ADR: Add PWA Support to the Template via vite-plugin-pwa

- Status: Accepted
- Date: 2026-06-17
- Owner: repository maintainers

## Context

The template (`template/`) produced a plain SPA with no installability or offline
support. Users wanted scaffolded apps to be installable on devices and to handle
new deployments gracefully. A separate, long-standing packaging bug also surfaced:
npm strips files named `.gitignore` from published packages, so every scaffolded
project shipped without one.

## Decision

Adopt **`vite-plugin-pwa`** (official Vite PWA plugin, Workbox-based, Vite 7 / React 19
compatible) with:

- **Update strategy `prompt`**: a `ReloadPrompt` component (`useRegisterSW` from
  `virtual:pwa-register/react`) notifies the user when a new version is available and
  on offline-ready, instead of silently auto-reloading.
- **Manifest from `package.json.name`**: `vite.config.ts` reads the name via `node:fs`,
  so the CLI's existing name rewrite flows into the manifest with no extra templating.
- **Icons via `@vite-pwa/assets-generator`**: the `pwaAssets` integration generates the
  icon set from a placeholder `public/logo.svg`; `generate-pwa-assets` script regenerates.
- **CLI name templating**: `cli.js` now also injects the project name into the
  `index.html` `<title>` (previously only `package.json`).
- **`.gitignore` packaging fix**: the template file is committed as `gitignore` (no dot)
  so npm includes it, and `cli.js` renames it back to `.gitignore` on scaffold.
- **Custom install affordance**: an `InstallPrompt` component (`install-prompt.tsx`)
  listens for the `beforeinstallprompt` event and surfaces an "Install app" banner,
  mirroring `ReloadPrompt`'s structure, so installability isn't left to the browser's
  default UI alone.

## Consequences

- Positive: scaffolded apps are installable and offline-capable out of the box;
  manifest stays in sync with the project name; generated projects finally keep a
  `.gitignore`.
- Note: the install button (and installability in general) only appear in a production
  `build && preview` or a deployed HTTPS host — `pnpm dev` won't trigger
  `beforeinstallprompt`.
- Tradeoffs: adds `vite-plugin-pwa`, `@vite-pwa/assets-generator`, and `workbox-window`
  (explicit peer required under pnpm strict linking) as devDependencies; the placeholder
  `logo.svg` must be replaced for real branding.

## Alternatives Considered

- **`registerType: 'autoUpdate'`** — rejected: silent mid-session reloads; the prompt
  flow gives the user control.
- **Manual service worker / Workbox config** — rejected: more boilerplate, no upside over
  the plugin's zero-config defaults.
- **Commit committed PNG icons instead of generating** — rejected: binary churn; the
  generator keeps icons derivable from a single source SVG.

## Migration and Impact

**Created**: `template/pwa-assets.config.ts`, `template/public/logo.svg`,
`template/src/common/pwa/reload-prompt.tsx`, `template/src/common/pwa/install-prompt.tsx`.

**Modified**: `template/vite.config.ts`, `template/package.json`, `template/index.html`,
`template/src/main.tsx`, `template/src/vite-env.d.ts`, `cli.js`, root `README.md`/`package.json`.

**Renamed**: `template/.gitignore` → `template/gitignore`.

**Validation**: `node cli.js <app>` (name + `<title>` + `.gitignore` correct),
`pnpm type-check`, `pnpm lint`, `pnpm build` (verify `dist/` has `sw.js`,
`manifest.webmanifest`, generated icons). Requires a minor version bump (→ 1.5.0)
before publishing.

## References

- PR #3 (`feat/pwa-support`)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
- [Prompt for update guide](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html)
