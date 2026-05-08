# Auditoría Arquitectónica: minimalize-template-cli
> Rol: Arquitecto Senior de Software Frontend — 10+ años en SPAs con React

---

## Contexto

Este repositorio es un CLI scaffolding que genera proyectos React + Vite + TypeScript + Tailwind v4 + Wouter + Zustand. El objetivo del usuario es reformar este template para que sea su base definitiva en todos los proyectos futuros. El informe cubre bugs críticos, mejoras de arquitectura, estructura de carpetas, dependencias, y oportunidades de modernización.

---

## 1. BUGS CRÍTICOS — Corregir antes de cualquier otra cosa

### 1.1 `path` en `dependencies` (debe eliminarse)
**Archivo:** `template/package.json`

```json
"dependencies": {
  "path": "^0.12.7",  // ❌ INCORRECTO
```

`path` es un módulo built-in de Node.js. El paquete npm `path` es un polyfill obsoleto (~2013) que en un contexto de browser/Vite no tiene efecto útil. El `vite.config.ts` usa `path` de Node, no este paquete. **Eliminarlo.**

### 1.2 `tailwindcss` y `@tailwindcss/vite` en `dependencies` (deben estar en `devDependencies`)
**Archivo:** `template/package.json`

```json
// ❌ INCORRECTO - son build tools, no runtime
"dependencies": {
  "@tailwindcss/vite": "^4.1.11",
  "tailwindcss": "^4.1.11",
```

Estas librerías solo actúan en build-time. Ponerlas en `dependencies` aumenta el bundle de producción y confunde a cualquier desarrollador que lea el proyecto.

### 1.3 Nomenclatura de stores viola las reglas de los hooks de React
**Archivo:** `template/src/stores/auth.ts`

```typescript
// ❌ INCORRECTO - nombre no sigue la convención de hooks
const authStore = create<AuthStore>()(...)
export default authStore

// ✅ CORRECTO
const useAuthStore = create<AuthStore>()(...)
export default useAuthStore
```

Zustand retorna un hook. Nombrarlo sin el prefijo `use` rompe las reglas de linting de React hooks y confunde al IDE y a futuros desarrolladores.

---

## 2. DEPENDENCIAS — Análisis completo y recomendaciones

### Stack actual (valoración)

| Paquete | Versión | Veredicto | Notas |
|---------|---------|-----------|-------|
| React | 19.1.0 | ✅ Excelente | Concurrent features, Server Components ready |
| Vite | 7.0.0 | ✅ Excelente | Build tool de referencia en 2025 |
| TypeScript | ~5.8.3 | ✅ Excelente | Versión muy moderna |
| Tailwind CSS | 4.1.11 | ✅ Excelente | v4 con Vite plugin es la integración más limpia |
| Zustand | 5.0.6 | ✅ Excelente | Estado global simple, performante |
| Wouter | 3.7.1 | ⚠️ Aceptable | Ver consideraciones abajo |
| ESLint | 9.29.0 | ✅ Excelente | Flat config, última gen |
| path (npm) | 0.12.7 | ❌ Eliminar | Polyfill obsoleto innecesario |

### Dependencias faltantes críticas para una base definitiva

**Para agregar al template:**

```json
// devDependencies — testing
"vitest": "^3.x",
"@vitest/ui": "^3.x",
"@testing-library/react": "^16.x",
"@testing-library/user-event": "^14.x",
"jsdom": "^25.x",

// devDependencies — formateo
"prettier": "^3.x",
"prettier-plugin-tailwindcss": "^0.6.x",

// devDependencies — type-check standalone
// (ya cubierto con tsc -b en build script)

// dependencies — formularios y validación
"react-hook-form": "^7.x",
"zod": "^3.x",
"@hookform/resolvers": "^3.x",

// dependencies — data fetching (opcional pero muy recomendado)
"@tanstack/react-query": "^5.x",
"@tanstack/react-query-devtools": "^5.x",

// dependencies — HTTP client
"axios": "^1.x",
```

### Decisión sobre Wouter vs React Router vs TanStack Router

| Router | Tamaño | Features | Recomendación |
|--------|--------|----------|---------------|
| Wouter | ~1.3KB | Básico, sin lazy, sin loaders | Para apps muy simples |
| React Router v7 | ~15KB | Completo, data loaders, actions | Apps medianas/grandes |
| TanStack Router | ~30KB | Type-safe end-to-end, loaders | Apps con fuerte tipado |

**Recomendación:** Si el objetivo es una base definitiva para muchas apps, **React Router v7** o **TanStack Router** son más adecuados. Wouter carece de: lazy loading nativo, route loaders, search params type-safe, y layouts anidados. Para apps de producción esto se siente rápidamente.

---

## 3. ARQUITECTURA — Problemas y mejoras

### 3.1 Patrón de routing con dos routers separados

**Problema actual:**
```typescript
// App.tsx - ❌ Anti-pattern
function App() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <PrivateRouter />
  return <PublicRouter />
}
```

**Problemas:**
- No preserva la URL a la que el usuario quería ir (redirect after login)
- No maneja estados intermedios (loading, checking session)
- No escala: con roles/permisos múltiples, la lógica explota
- Cuando el usuario navega a `/dashboard` sin auth, la URL se queda igual pero muestra Login — confuso

**Patrón correcto: `<ProtectedRoute>` component:**
```typescript
// components/ProtectedRoute.tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

// router.tsx - rutas declarativas con guards inline
export function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      </Route>
    </Switch>
  )
}
```

### 3.2 Falta de sistema de layouts

Para cualquier app real necesitas layouts (sidebar, navbar, footer) que se compartan entre páginas. El template no tiene esto.

**Estructura recomendada:**
```
src/layouts/
├── RootLayout.tsx      // Error boundary + QueryClient + providers
├── AuthLayout.tsx      // Layout para páginas de login/register
└── DashboardLayout.tsx // Sidebar + header + main content
```

### 3.3 Falta de capa de servicios / API

Toda app de producción necesita una capa de abstracción para HTTP. Metter `fetch` o `axios` directamente en componentes es el principal antipatrón que dificulta testing y mantenimiento.

**Estructura recomendada:**
```
src/services/
├── http.ts         // Instancia axios con interceptors (base URL, auth headers, refresh token)
├── auth.service.ts // Funciones de auth (login, logout, refresh)
└── user.service.ts // CRUD de usuarios
```

### 3.4 Falta de Error Boundaries

React no captura errores en renderizado por defecto. Sin error boundaries, cualquier error JavaScript crashea toda la app en producción.

```
src/components/
└── ErrorBoundary.tsx  // class component que captura errores + fallback UI
```

### 3.5 Zustand sin `devtools` middleware

En desarrollo, sin devtools no puedes inspeccionar el estado en Redux DevTools. Es una línea de código que cambia radicalmente el DX.

```typescript
// ✅ Con devtools para desarrollo
const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({...}),
      { name: 'auth-storage' }
    ),
    { name: 'AuthStore' }  // nombre que aparece en Redux DevTools
  )
)
```

---

## 4. ESTRUCTURA DE CARPETAS — Propuesta definitiva

### Estructura actual (minimalista pero incompleta)
```
src/
├── pages/
├── stores/
└── [root files]
```

### Estructura recomendada para una base definitiva

```
src/
├── assets/               # Imágenes, fuentes, íconos SVG
│   └── icons/
├── components/           # Componentes reutilizables de UI
│   ├── ui/               # Primitivos: Button, Input, Modal, Badge...
│   ├── forms/            # Componentes de formularios complejos
│   └── ErrorBoundary.tsx
├── constants/            # Constantes de app (rutas, keys, config)
│   └── routes.ts         # Rutas como constantes tipadas
├── hooks/                # Custom hooks reutilizables
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── layouts/              # Layouts de página
│   ├── RootLayout.tsx
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── lib/                  # Wrappers de librerías externas
│   ├── http.ts           # Instancia axios configurada
│   └── queryClient.ts    # TanStack Query client config
├── pages/                # Páginas/vistas
│   ├── auth/
│   │   └── LoginPage.tsx
│   └── dashboard/
│       └── HomePage.tsx
├── services/             # Llamadas a API
│   └── auth.service.ts
├── stores/               # Zustand stores
│   └── useAuthStore.ts
├── types/                # Tipos TypeScript globales
│   ├── api.types.ts      # Respuestas de API
│   └── auth.types.ts
├── utils/                # Funciones utilitarias puras
│   ├── cn.ts             # clsx + tailwind-merge helper
│   └── format.ts
├── App.tsx
├── main.tsx
├── router.tsx
├── index.css
└── vite-env.d.ts
```

---

## 5. CONFIGURACIÓN — Mejoras específicas

### 5.1 Agregar Prettier

Sin Prettier, en equipos o con múltiples proyectos el estilo varía. La integración con `prettier-plugin-tailwindcss` ordena automáticamente las clases de Tailwind.

**Archivo:** `template/.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 5.2 Agregar scripts faltantes en package.json

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "type-check": "tsc --noEmit",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### 5.3 Agregar `.env.example` al template

```bash
# template/.env.example
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=My App
VITE_APP_VERSION=1.0.0
```

### 5.4 Extender `vite-env.d.ts` con env vars tipadas

```typescript
// template/src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 5.5 Agregar `cn` utility (imprescindible con Tailwind)

`clsx` + `tailwind-merge` es el utility más usado en cualquier proyecto Tailwind serio. Sin él, merge de clases condicionales produce duplicados y bugs visuales.

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Dependencias a agregar:** `clsx`, `tailwind-merge`

### 5.6 Rutas como constantes tipadas

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]
```

---

## 6. TYPESCRIPT — Optimizaciones

### 6.1 `jsconfig.json` es redundante

El `jsconfig.json` en la raíz del template duplica rutas ya definidas en `tsconfig.app.json`. Al ser un proyecto TypeScript puro, el `jsconfig.json` es innecesario. Eliminarlo reduce confusión.

### 6.2 Path aliases adicionales recomendados

```json
// tsconfig.app.json — paths más granulares
"paths": {
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"],
  "@pages/*": ["src/pages/*"],
  "@hooks/*": ["src/hooks/*"],
  "@stores/*": ["src/stores/*"],
  "@utils/*": ["src/utils/*"],
  "@types/*": ["src/types/*"],
  "@services/*": ["src/services/*"],
  "@constants/*": ["src/constants/*"]
}
```

Y reflejarlos en `vite.config.ts`.

---

## 7. CONSIDERACIONES DE SEGURIDAD

### 7.1 Estado de auth en localStorage — riesgo XSS

El persist middleware de Zustand guarda `isAuthenticated: true` en localStorage. Esto significa:
- Si hay un XSS, el atacante puede leer el estado de auth
- La sesión nunca expira automáticamente

**Recomendación:** Para apps reales, el estado de auth debería venir de un token httpOnly cookie o de una verificación de sesión con el backend, no de localStorage. El template puede mantener localStorage para simplicidad, pero documentar este trade-off claramente.

### 7.2 Validación de input en CLI

El CLI actual valida `/^[a-z0-9-_]+$/i` — correcto. No hay path traversal posible.

---

## 8. DX (Developer Experience) — Mejoras de calidad de vida

### 8.1 Agregar `lint-staged` + `husky` (opcional pero recomendado)

Para asegurar que todo código commiteado pase linting y formateo:

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

### 8.2 Configurar VS Code settings para el template

```json
// template/.vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]]
}
```

```json
// template/.vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 9. CLI — Mejoras sugeridas

### 9.1 Flags interactivos (nice-to-have)

Con `@clack/prompts` (~3KB) se puede convertir el CLI en interactivo:
- `--with-query` / sin query para TanStack Query
- `--with-forms` para react-hook-form + zod
- `--router react-router|wouter|tanstack`

### 9.2 Rename post-scaffolding

Actualmente el `template/package.json` tiene `"name": "minimalize-template"`. El CLI debería reemplazar ese nombre con el `projectName` dado por el usuario.

```javascript
// En cli.js después de copiar
await fse.readJSON(`${targetDir}/package.json`).then(pkg => {
  pkg.name = projectName
  return fse.writeJSON(`${targetDir}/package.json`, pkg, { spaces: 2 })
})
```

---

## 10. RESUMEN EJECUTIVO — Prioridades

### Crítico (hacer ya)
1. ❌ Eliminar `path` de `dependencies`
2. ❌ Mover `tailwindcss` y `@tailwindcss/vite` a `devDependencies`
3. ❌ Renombrar `authStore` → `useAuthStore` (convención de hooks)
4. ❌ Eliminar `jsconfig.json` (redundante con tsconfig)
5. ❌ Fix en CLI: actualizar `name` en `package.json` del proyecto generado

### Alta prioridad (base definitiva)
6. Agregar Prettier + `prettier-plugin-tailwindcss`
7. Agregar `clsx` + `tailwind-merge` + utility `cn()`
8. Agregar scripts: `lint:fix`, `format`, `type-check`
9. Agregar `.env.example` + tipos en `vite-env.d.ts`
10. Crear estructura de carpetas completa (hooks/, components/, utils/, types/, etc.)
11. Agregar `devtools` middleware a Zustand stores
12. Agregar `ProtectedRoute` component (patrón de routing más escalable)
13. Agregar path aliases granulares en tsconfig + vite.config

### Media prioridad (para apps de producción)
14. Agregar Vitest + React Testing Library
15. Agregar TanStack Query
16. Agregar `lib/http.ts` (instancia axios con interceptors)
17. Agregar `src/layouts/` con RootLayout
18. Agregar `ROUTES` constantes tipadas
19. Configurar `.vscode/settings.json` y `extensions.json`

### Baja prioridad (cuando el proyecto crezca)
20. React Router v7 o TanStack Router (si Wouter no alcanza)
21. `lint-staged` + `husky` para pre-commit hooks
22. Flags interactivos en CLI
23. `src/constants/routes.ts`

---

## Valoración final del stack actual

El stack base es **excelente**. React 19 + Vite 7 + TypeScript strict + Tailwind v4 + Zustand 5 es una combinación moderna, performante y minimal. Los bugs son corregibles en minutos. Las oportunidades de mejora son principalmente de DX y estructura — no hay nada fundamentalmente roto. Con las correcciones críticas y las mejoras de alta prioridad, este template se convierte en una base sólida y profesional.
