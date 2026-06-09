# 🚀 Create Minimalize Template

> Un CLI moderno para inicializar proyectos React con Vite, TypeScript, Tailwind CSS v4, React Router v6 y Zustand pre-configurados.

[![npm version](https://img.shields.io/npm/v/create-minimalize-template.svg)](https://www.npmjs.com/package/create-minimalize-template)
[![License](https://img.shields.io/npm/l/create-minimalize-template.svg)](https://github.com/yourusername/minimalize-template-cli/blob/main/LICENSE)

## ✨ Características

- ⚡️ **Vite 7** - Build tool ultra-rápido con HMR
- ⚛️ **React 19** - La última versión de React
- 🎨 **Tailwind CSS v4** - Framework CSS utility-first (última versión)
- 📦 **TypeScript** - Tipado estático para mayor seguridad
- 🛣️ **React Router v6** - Routing con loaders, actions y layouts anidados
- 🐻 **Zustand** - Gestión de estado simple y escalable con persistencia
- 🔍 **ESLint** - Linting configurado con reglas modernas
- 🏗️ **Feature-first architecture** - Estructura por dominio lista para escalar

## 🏗️ Arquitectura y Decisiones

Este repositorio usa una guía de arquitectura optimizada para agentes y mantenible para equipos:

- Reglas activas: `docs/architecture/conventions.md`
- Registro de decisiones (ADR): `docs/architecture/decisions/README.md`
- Skill de ejecución estructural: `.github/skills/minimalize-architecture/SKILL.md`

## 🤖 Comportamiento de Agentes

Para requests de implementación (agregar/corregir), este repositorio define que el agente debe commitear los cambios del request usando la convención de commits con emoji.

- Instrucción de commit para agentes: `.github/instructions/commit.instructions.md`

## 🎯 Stack Tecnológico

### Dependencias Principales

| Librería         | Versión | Propósito                   |
| ---------------- | ------- | --------------------------- |
| **React**          | ^19.1.0 | Framework UI                |
| **React DOM**       | ^19.1.0 | React para web              |
| **Vite**            | ^7.0.0  | Build tool y dev server     |
| **TypeScript**      | ~5.8.3  | Tipado estático             |
| **Tailwind CSS**    | ^4.1.11 | Framework CSS utility-first |
| **React Router DOM**| ^6.28.0 | Routing con loaders/actions |
| **Zustand**         | ^5.0.6  | Gestión de estado           |

### Herramientas de Desarrollo

- **ESLint 9** con soporte para React Hooks y React Refresh
- **TypeScript ESLint** para reglas de linting específicas
- **Vite Plugin React** para Fast Refresh
- Configuración de path aliases (`@/`) pre-configurada

## 🚀 Uso Rápido

### Crear un nuevo proyecto

```bash
pnpx create-minimalize-template mi-proyecto
```

### Comandos disponibles

```bash
# Instalación y desarrollo
cd mi-proyecto
pnpm install
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Linting
pnpm lint
```

## 📁 Estructura del Proyecto Generado

```
mi-proyecto/
├── public/
├── src/
│   ├── common/
│   │   └── utils/
│   │       └── cn.ts          # Utility: clsx + tailwind-merge
│   ├── features/
│   │   ├── auth/              # Feature: autenticación
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── actions/
│   │   │   ├── loaders/
│   │   │   ├── state/
│   │   │   │   └── use-auth-store.ts
│   │   │   └── ui/
│   │   │       └── login-page.tsx
│   │   ├── home/              # Feature: página principal
│   │   │   ├── index.ts
│   │   │   ├── actions/
│   │   │   ├── loaders/
│   │   │   └── ui/
│   │   │       └── home-page.tsx
│   │   └── routing/           # Feature: configuración de rutas
│   │       ├── index.ts
│   │       ├── paths.ts
│   │       ├── router.tsx
│   │       ├── guards/
│   │       └── ui/
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

## 🛠️ Características Pre-configuradas

### Routing con React Router v6

El template incluye routing con loaders, actions y layouts anidados:

```typescript
// src/features/routing/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PATHS } from './paths'

export const appRouter = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: redirectIfAuth,
    children: [{ path: PATHS.LOGIN, element: <LoginPage /> }],
  },
  {
    element: <AppLayout />,
    loader: requireAuth,
    children: [{ path: PATHS.ROOT, element: <HomePage /> }],
  },
  { path: '*', element: <Navigate to={PATHS.ROOT} replace /> },
])
```

### Store de Autenticación con Zustand

Store global con persistencia en localStorage:

```typescript
// src/features/auth/state/use-auth-store.ts
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

### Path Aliases

El proyecto viene con path aliases configurados:

```typescript
import Component from '@/pages/Home' // En vez de '../../../pages/Home'
```

## 📋 Desarrollo del CLI

Si estás trabajando en el CLI:

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/minimalize-template-cli.git
cd minimalize-template-cli

# Instalar dependencias
pnpm install

# Probar el CLI localmente
node cli.js test-project

# Publicar nueva versión
pnpm release:patch    # 1.0.4 -> 1.0.5
pnpm release:minor    # 1.0.4 -> 1.1.0
pnpm release:major    # 1.0.4 -> 2.0.0
```

## 🔄 Sistema de Versionado

Este proyecto sigue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios que rompen compatibilidad
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Corrección de bugs compatible con versiones anteriores

### Comandos de Release

```bash
pnpm release:patch    # Bug fixes
pnpm release:minor    # Nuevas features
pnpm release:major    # Breaking changes
```

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para el historial de cambios.

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](./LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [@tuhandle](https://twitter.com/tuhandle)

---

**¿Disfrutando del template?** ⭐️ Dale una estrella en GitHub!
