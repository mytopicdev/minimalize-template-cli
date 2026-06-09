# Mi Proyecto

Generado con [create-minimalize-template](https://github.com/mytopicdev/minimalize-template-cli).

## Stack

- **React 19** + **TypeScript**
- **Vite 7** — build tool y dev server
- **Tailwind CSS v4** — utility-first CSS
- **React Router v6** — routing con loaders, actions y guards
- **Zustand** — state management con persistencia
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
```

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
