# Mi Proyecto

Generado con [create-minimalize-template](https://github.com/mytopicdev/minimalize-template-cli).

## Stack

- **React 19** + **TypeScript**
- **Vite 7** — build tool y dev server
- **Tailwind CSS v4** — utility-first CSS
- **React Router v6** — routing con loaders, actions y guards
- **Zustand** — state management con persistencia
- **vite-plugin-pwa** — PWA instalable, offline-ready y con prompt de actualización
- **ESLint 9** — linting configurado

## Comandos

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
pnpm lint         # Ejecutar linter
pnpm lint:fix     # Autofix de lint
pnpm format       # Formatear código
pnpm type-check   # Verificar tipos
pnpm generate-pwa-assets  # Regenerar iconos PWA desde public/logo.svg
```

## PWA

El proyecto es instalable y funciona offline gracias a `vite-plugin-pwa`:

- El manifest se genera automáticamente con el `name`/`short_name` desde `package.json`.
- Los iconos se generan desde `public/logo.svg` (reemplázalo y corre `pnpm generate-pwa-assets` o simplemente `pnpm build`/`pnpm dev`).
- Cuando hay una nueva versión desplegada, se muestra un aviso para recargar (`src/common/pwa/reload-prompt.tsx`).

## Estructura

```
src/
├── common/
│   └── utils/
│       └── cn.ts               # clsx + tailwind-merge
└── features/
    ├── auth/                   # Autenticación
    │   ├── index.ts
    │   ├── actions/
    │   ├── loaders/
    │   ├── state/
    │   │   └── use-auth-store.ts
    │   └── ui/
    │       └── login-page.tsx
    ├── home/                   # Página principal
    │   ├── index.ts
    │   ├── actions/
    │   ├── loaders/
    │   └── ui/
    │       └── home-page.tsx
    └── routing/                # Configuración de rutas
        ├── index.ts
        ├── paths.ts
        ├── router.tsx
        ├── guards/
        └── ui/
```

## Path Aliases

```typescript
import { cn } from '@/common/utils/cn'
import { useAuthStore } from '@/features/auth'
```
