# Migración wouter → react-router-dom + reorganización Minimalize del template

## Context

El template (`template/src/`) usa hoy una estrategia ad-hoc: `App.tsx` decide entre `<PrivateRouter />` y `<PublicRouter />` por `isAuthenticated`, ambos definidos con `<Switch><Route />` de wouter. La estructura es por capas (`pages/`, `stores/`, `utils/`) y el ruteo es declarativo simple, sin loaders, sin layouts, sin guards a nivel de ruta.

Dos problemas convergentes:

1. **Wouter no soporta el patrón data-router** (loaders/actions/`<Outlet />`) que se quiere fijar como convención del template para escalar a features con fetching de datos.
2. **La estructura por capas contradice** la ADR `2026-05-08-adopt-minimalize-architecture.md` y `docs/architecture/conventions.md`, que mandan organizar por feature de negocio.

La migración alinea ambos ejes: cambiar a `react-router-dom@^6` con `createBrowserRouter` y simultáneamente reubicar el código en `src/features/*` con una feature transversal `routing` que centraliza paths, layouts, guard y configuración del router.

Único uso actual de wouter: `template/src/router.tsx` (imports `Route, Switch`). No hay `useLocation`, `Link`, `navigate`, etc. en el resto del código — la migración no toca pages a nivel de hooks de wouter.

---

## Estructura final propuesta

```
template/
├── package.json                          # react-router-dom in, wouter out
└── src/
    ├── main.tsx                          # monta <RouterProvider router={appRouter} />
    ├── index.css                         # sin cambios
    ├── vite-env.d.ts                     # sin cambios
    ├── common/
    │   └── utils/
    │       └── cn.ts                     # movido desde src/utils/cn.ts
    └── features/
        ├── routing/
        │   ├── ui/
        │   │   ├── app-layout.tsx        # layout privado con <Outlet />
        │   │   └── auth-layout.tsx       # layout público con <Outlet />
        │   ├── guards/
        │   │   ├── require-auth.ts       # loader: redirige a /login si no auth
        │   │   └── redirect-if-auth.ts   # loader: redirige a / si ya hay sesión
        │   ├── paths.ts                  # constantes tipadas
        │   ├── router.tsx                # createBrowserRouter + tree
        │   └── index.ts                  # barrel: appRouter, PATHS, AppPath
        ├── auth/
        │   ├── ui/
        │   │   └── login-page.tsx        # antes pages/Login.tsx
        │   ├── state/
        │   │   └── use-auth-store.ts     # antes stores/auth.ts
        │   ├── loaders/
        │   │   └── login-loader.ts       # placeholder LoaderFunction
        │   ├── actions/
        │   │   └── login-action.ts       # placeholder ActionFunction
        │   └── index.ts                  # barrel: LoginPage, useAuthStore, loginLoader, loginAction
        └── home/
            ├── ui/
            │   └── home-page.tsx         # antes pages/Home.tsx
            ├── loaders/
            │   └── home-loader.ts        # placeholder
            ├── actions/
            │   └── home-action.ts        # placeholder
            └── index.ts                  # barrel: HomePage, homeLoader, homeAction
```

### Justificación de ubicaciones

- **`cn.ts` → `common/utils/`**: utilidad de styling universal en proyectos Tailwind. Aunque hoy no la usa nadie, es scaffolding y se la promueve a `common` desde el día uno para evitar reubicarla en el primer PR del usuario final. Cumple el espíritu de "common solo si lo usan 3+ features" considerando el rol de template.
- **`useAuthStore` → `features/auth/state/`**: dominio puro de auth.
- **`features/home/`**: el componente actual se llama `HomePage`. Nombre genérico pero honesto; el usuario final renombra cuando defina la feature real.
- **`features/routing/`**: feature transversal de **infraestructura**, no de dominio. Es excepción aceptada al principio "feature = business intent" porque encapsula UI (layouts), state (guards) y config (paths) coherentes. Rechazado `common/routing/` porque tiene UI de página/layout y `common` no debería tenerlas.
- **Eliminar `App.tsx`**: su única responsabilidad (decidir router por auth) pasa a los loaders de las layout-routes. `main.tsx` monta `<RouterProvider />` directo.
- **Eliminar carpetas `pages/`, `stores/`, `utils/`**: regla Minimalize literal.

### Naming compliance

- Carpetas y archivos en **kebab-case** (`login-page.tsx`, `use-auth-store.ts`, `app-layout.tsx`).
- Symbols en **PascalCase** (`LoginPage`, `AppLayout`).
- Hooks: prefijo `use-` en archivo, `useX` en symbol.
- `index.ts` (no `index.tsx`) para barrels — permitido.

---

## Diseño del router

`createBrowserRouter` + `<RouterProvider />` (data-router API, requerido para loaders/actions).

```
[
  {
    element: <AuthLayout />,
    loader: redirectIfAuth,        // si hay sesión → redirect('/')
    children: [
      { path: '/login', element: <LoginPage />, loader: loginLoader, action: loginAction },
    ],
  },
  {
    element: <AppLayout />,
    loader: requireAuth,           // si no hay sesión → redirect('/login')
    children: [
      { path: '/', element: <HomePage />, loader: homeLoader, action: homeAction },
    ],
  },
  { path: '*', element: <Navigate to='/' replace /> },
]
```

El guard de auth es un **loader que llama `useAuthStore.getState()`** y devuelve `null` o `redirect(PATHS.LOGIN)`. Reemplaza el `if (isAuthenticated)` actual de `App.tsx`. Beneficio: la URL refleja el estado real, no se renderiza Login en `/`.

Rechazado: componente `<RequireAuth>` wrapper — funciona pero rompe el patrón data-router puro.

---

## Snippets clave

### `features/routing/paths.ts`

```typescript
export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

// Para rutas con params (patrón a seguir cuando existan):
// export const userDetailPath = (id: string) => `/users/${id}` as const
```

### `features/routing/guards/require-auth.ts`

```typescript
import { redirect, type LoaderFunction } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing/paths'

export const requireAuth: LoaderFunction = () => {
  if (!useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.LOGIN)
  }
  return null
}
```

### `features/routing/guards/redirect-if-auth.ts`

```typescript
import { redirect, type LoaderFunction } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing/paths'

export const redirectIfAuth: LoaderFunction = () => {
  if (useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.ROOT)
  }
  return null
}
```

### `features/routing/router.tsx`

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage, loginLoader, loginAction } from '@/features/auth'
import { HomePage, homeLoader, homeAction } from '@/features/home'
import { AppLayout } from './ui/app-layout'
import { AuthLayout } from './ui/auth-layout'
import { requireAuth } from './guards/require-auth'
import { redirectIfAuth } from './guards/redirect-if-auth'
import { PATHS } from './paths'

export const appRouter = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: redirectIfAuth,
    children: [
      { path: PATHS.LOGIN, element: <LoginPage />, loader: loginLoader, action: loginAction },
    ],
  },
  {
    element: <AppLayout />,
    loader: requireAuth,
    children: [
      { path: PATHS.ROOT, element: <HomePage />, loader: homeLoader, action: homeAction },
    ],
  },
  { path: '*', element: <Navigate to={PATHS.ROOT} replace /> },
])
```

### Layouts (`app-layout.tsx` y `auth-layout.tsx`)

```typescript
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className='min-h-screen'>
      <Outlet />
    </div>
  )
}
```

(`AuthLayout` mismo shape — placeholder para diferenciar styling después.)

### Loader/action placeholder (mismo shape para todas las features)

```typescript
// features/auth/loaders/login-loader.ts
import type { LoaderFunction } from 'react-router-dom'
export const loginLoader: LoaderFunction = () => null
```

```typescript
// features/auth/actions/login-action.ts
import type { ActionFunction } from 'react-router-dom'
export const loginAction: ActionFunction = () => null
```

(Idem `home-loader.ts`, `home-action.ts`.)

### Barrels

```typescript
// features/routing/index.ts
export { appRouter } from './router'
export { PATHS, type AppPath } from './paths'
```

```typescript
// features/auth/index.ts
export { LoginPage } from './ui/login-page'
export { useAuthStore } from './state/use-auth-store'
export { loginLoader } from './loaders/login-loader'
export { loginAction } from './actions/login-action'
```

```typescript
// features/home/index.ts
export { HomePage } from './ui/home-page'
export { homeLoader } from './loaders/home-loader'
export { homeAction } from './actions/home-action'
```

### `main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/features/routing'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
)
```

### `login-page.tsx` y `home-page.tsx` (con navegación explícita)

```typescript
// features/auth/ui/login-page.tsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../state/use-auth-store'
import { PATHS } from '@/features/routing'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const handleLogin = () => {
    login()
    navigate(PATHS.ROOT)
  }
  return (
    <div>
      <p>Hi! I'm the LoginPage component!</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
```

```typescript
// features/home/ui/home-page.tsx
import { useNavigate } from 'react-router-dom'
import { useAuthStore, PATHS } from '@/features/auth' // PATHS no se exporta desde auth — corregido abajo
```

**Corrección**: `home-page.tsx` importa `PATHS` desde `@/features/routing` (no desde auth). `auth/ui/login-page.tsx` también importa `PATHS` desde `@/features/routing`. Esto es legal porque ambas features cruzan a `routing` solo por barrel público.

```typescript
// features/home/ui/home-page.tsx (versión final)
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PATHS } from '@/features/routing'

export function HomePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const handleLogout = () => {
    logout()
    navigate(PATHS.LOGIN)
  }
  return (
    <div>
      <p>Hi! I'm the HomePage component!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### `use-auth-store.ts`

Mismo contenido que `stores/auth.ts` actual, con export nombrado:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
)
```

---

## Lotes de migración

Orden pensado para que cada lote deje el repo en estado verificable (lint + type-check pasan); el `build` end-to-end con react-router-dom solo pasa al final del lote 6.

### Lote 1 — Dependencias

**Archivos**: [template/package.json](template/package.json), `template/package-lock.json`.

- Quitar `"wouter": "^3.7.1"`.
- Agregar `"react-router-dom": "^6.28.0"`.
- `cd template && npm install`.

**Validación**: `npm run type-check` (build aún rompe en `router.tsx` por imports de wouter — esperado).

### Lote 2 — Esqueleto `features/routing` (sin guards)

**Crear**:

- `src/features/routing/paths.ts`
- `src/features/routing/ui/app-layout.tsx`
- `src/features/routing/ui/auth-layout.tsx`
- `src/features/routing/index.ts` (solo `export { PATHS, type AppPath } from './paths'`)

**No tocar nada existente.**

**Validación**: `npm run lint && npm run type-check`.

### Lote 3 — Mover feature `auth`

**Crear**:

- `src/features/auth/ui/login-page.tsx` (migrado de [template/src/pages/Login.tsx](template/src/pages/Login.tsx), export nombrado, sin `useNavigate` aún)
- `src/features/auth/state/use-auth-store.ts` (migrado de [template/src/stores/auth.ts](template/src/stores/auth.ts), export nombrado)
- `src/features/auth/loaders/login-loader.ts` (placeholder)
- `src/features/auth/actions/login-action.ts` (placeholder)
- `src/features/auth/index.ts` (barrel completo)

**Borrar**: `src/pages/Login.tsx`, `src/stores/auth.ts` (carpeta `stores/` queda vacía y se borra).

**Editar**:

- [template/src/App.tsx](template/src/App.tsx): `import { useAuthStore } from '@/features/auth'`.
- [template/src/pages/Home.tsx](template/src/pages/Home.tsx): `import { useAuthStore } from '@/features/auth'`.
- [template/src/router.tsx](template/src/router.tsx): `import { LoginPage } from '@/features/auth'`.

**Validación**: `npm run lint && npm run type-check`.

### Lote 4 — Mover feature `home`

**Crear**:

- `src/features/home/ui/home-page.tsx` (migrado de `pages/Home.tsx`, export nombrado, sin `useNavigate` aún)
- `src/features/home/loaders/home-loader.ts` (placeholder)
- `src/features/home/actions/home-action.ts` (placeholder)
- `src/features/home/index.ts` (barrel)

**Borrar**: `src/pages/Home.tsx` (carpeta `pages/` queda vacía y se borra).

**Editar**: [template/src/router.tsx](template/src/router.tsx) → `import { HomePage } from '@/features/home'`.

**Validación**: `npm run lint && npm run type-check`.

### Lote 5 — Mover `cn.ts` a `common/utils`

**Crear**: `src/common/utils/cn.ts` (mismo contenido).

**Borrar**: `src/utils/cn.ts` (carpeta `utils/` queda vacía y se borra).

**Verificar**: `grep -r "from '@/utils" template/src` → vacío (nadie lo importa).

**Validación**: `npm run lint && npm run type-check`.

### Lote 6 — Wirear data-router y eliminar legacy

**Crear**:

- `src/features/routing/guards/require-auth.ts`
- `src/features/routing/guards/redirect-if-auth.ts`
- `src/features/routing/router.tsx`

**Editar**:

- `src/features/routing/index.ts` → agregar `export { appRouter } from './router'`.
- `src/features/auth/ui/login-page.tsx` → agregar `useNavigate` + redirección a `PATHS.ROOT` tras login.
- `src/features/home/ui/home-page.tsx` → agregar `useNavigate` + redirección a `PATHS.LOGIN` tras logout.
- [template/src/main.tsx](template/src/main.tsx) → reemplazar `<App />` por `<RouterProvider router={appRouter} />`.

**Borrar**:

- [template/src/App.tsx](template/src/App.tsx)
- [template/src/router.tsx](template/src/router.tsx) (legacy con wouter)

**Validación**:

```bash
cd template
npm run lint
npm run type-check
npm run build
npm run dev      # verificar manualmente
grep -rn "wouter" src && echo "FAIL" || echo "OK"
grep -n "wouter" package.json && echo "FAIL" || echo "OK"
```

---

## Verificación final

### Comandos

```bash
cd template
npm install
npm run lint
npm run type-check
npm run build
npm run dev
```

### Auditoría de residuos

```bash
grep -rn "wouter" template/src                                # vacío
grep -n  "wouter" template/package.json                       # vacío
grep -rn "from '@/pages"  template/src                        # vacío
grep -rn "from '@/stores" template/src                        # vacío
grep -rn "from '@/utils"  template/src                        # vacío
ls template/src/pages template/src/stores template/src/utils  # No such file
ls template/src/App.tsx template/src/router.tsx               # No such file
```

### Smoke test manual (en `npm run dev`)

1. Borrar `localStorage` (`localStorage.clear()` en consola).
2. Visitar `/` → redirige a `/login` (`requireAuth`).
3. Click "Login" → store cambia, `useNavigate(PATHS.ROOT)` lleva a `/`, `requireAuth` valida, `<HomePage />` se monta.
4. Click "Logout" → store cambia, `useNavigate(PATHS.LOGIN)` lleva a `/login`.
5. Refresh en `/` con sesión persistida → permanece (zustand persist hidrata sync desde localStorage).
6. Navegar manualmente a `/login` con sesión activa → `redirectIfAuth` redirige a `/`.
7. Navegar a `/ruta-inexistente` → catch-all redirige a `/`.

---

## Riesgos y mitigaciones

1. **Hidratación de zustand persist**: storage default es síncrono (`localStorage`). Si en algún build aparece async, los loaders pueden ejecutarse pre-hidratación. **Mitigación**: documentar en comentario en `require-auth.ts` que si se cambia a `createJSONStorage` async hay que usar `useAuthStore.persist.hasHydrated()` y un `<HydrateGate />` antes de `<RouterProvider />`. No implementar hoy.

2. **Ciclo lógico `routing` ↔ `auth`**: `routing/guards` importa `useAuthStore`; `auth/ui` importa `PATHS`. Es legal por barrels, pero crea ciclo conceptual que ESLint no detecta. No hay ciclo de runtime hoy porque `PATHS` es constante (no requiere init de `routing`). **Mitigación**: si crece, extraer `PATHS` a `src/common/routing/paths.ts`. Documentar en comentario del barrel `routing`.

3. **Versión de react-router-dom**: pin `^6.28.0` (data-router API estable, ampliamente documentada). v7 unifica el paquete pero hay breaking changes en exports. Migración a v7 queda como follow-up trivial.

4. **Reorganización completa puede leerse como big-bang**: el template tiene 7 archivos en `src/`, todos cambian. **Mitigación**: 6 lotes secuenciales con validación entre cada uno; commits separados por lote (no único commit), revisable incrementalmente. El ADR documenta la excepción.

5. **Pérdida del patrón "App decide router"**: developers acostumbrados pueden no entender dónde vive la lógica auth. **Mitigación**: comentario de 1 línea en `router.tsx`. README del template fuera del alcance de este plan.

---

## ADR nuevo (decisión: SÍ crear)

**Archivo**: `docs/architecture/decisions/2026-05-08-routing-and-template-feature-layout.md`.

**Por qué**: La convención dice "Avoid big-bang rewrites of the whole `src` tree" como anti-patrón, y aunque acá son 7 archivos, _toda_ la estructura cambia. Documentar la excepción protege la regla. Además se fija el **patrón canónico de routing del template** (react-router-dom v6 + data-router API + paths centralizado + loaders/actions por feature + layouts con `<Outlet />` + guards como loaders) — sin ADR el próximo agente reverse-engineer leyendo código.

**Base**: usar `docs/architecture/decisions/ADR-TEMPLATE.md`.

**Contenido**:

- **Status**: Accepted.
- **Context**: template usa estructura por capas + wouter; repo adoptó Minimalize; necesidad de patrón de routing escalable.
- **Decision**:
  1. `react-router-dom@^6` con `createBrowserRouter` + `RouterProvider`.
  2. Config centralizada en `src/features/routing/` (paths, router, layouts, guards).
  3. Cada feature expone `loader.ts`/`action.ts` en archivos separados, publicados vía barrel.
  4. Auth se enforza en loaders de layouts (no wrappers).
  5. Reorganización del template inicial es excepción al anti-patrón big-bang, justificada por ser scaffolding pre-features.
- **Alternatives**: TanStack Router (más type-safe pero más opinated/overhead para template), wouter + custom data-fetching (no ergonómico), mantener layout por capas (rechazado por ADR previa).
- **Migration and Impact**: lista de los 6 lotes; áreas afectadas: todo `template/src/`.

**Cuándo crearlo**: en el commit del lote 6 (mismo PR), o como PR previo. Recomendación práctica: incluirlo en el commit final.

---

## Critical files

- [template/package.json](template/package.json) (lote 1)
- `template/src/features/routing/router.tsx` (a crear, lote 6)
- `template/src/features/routing/paths.ts` (a crear, lote 2)
- `template/src/features/auth/index.ts` (a crear, lote 3)
- [template/src/main.tsx](template/src/main.tsx) (lote 6)
- `docs/architecture/decisions/2026-05-08-routing-and-template-feature-layout.md` (a crear, lote 6)

## Commits esperados (formato emoji policy del repo)

Un commit por lote, siguiendo `<emoji> <type>(<scope>): <subject>`:

1. `📦 chore(template): replace wouter with react-router-dom`
2. `✨ feat(template/routing): scaffold routing feature with paths and layouts`
3. `♻️ refactor(template/auth): move auth into feature module`
4. `♻️ refactor(template/home): move home into feature module`
5. `♻️ refactor(template/common): relocate cn util into common/utils`
6. `✨ feat(template/routing): wire data router and document ADR`
