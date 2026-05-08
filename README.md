# 🚀 Create Minimalize Template

> Un CLI moderno para inicializar proyectos React con Vite, TypeScript, Tailwind CSS v4, Wouter y Zustand pre-configurados.

[![npm version](https://img.shields.io/npm/v/create-minimalize-template.svg)](https://www.npmjs.com/package/create-minimalize-template)
[![License](https://img.shields.io/npm/l/create-minimalize-template.svg)](https://github.com/yourusername/minimalize-template-cli/blob/main/LICENSE)

## ✨ Características

- ⚡️ **Vite 7** - Build tool ultra-rápido con HMR
- ⚛️ **React 19** - La última versión de React
- 🎨 **Tailwind CSS v4** - Framework CSS utility-first (última versión)
- 📦 **TypeScript** - Tipado estático para mayor seguridad
- 🛣️ **Wouter** - Router minimalista para React (~1.3KB)
- 🐻 **Zustand** - Gestión de estado simple y escalable
- 🔍 **ESLint** - Linting configurado con reglas modernas
- 📱 **Estructura pre-configurada** - Router y store de autenticación listos

## 🏗️ Arquitectura y Decisiones

Este repositorio usa una guía de arquitectura optimizada para agentes y mantenible para equipos:

- Reglas activas: `docs/architecture/conventions.md`
- Registro de decisiones (ADR): `docs/architecture/decisions/README.md`
- Skill de ejecución estructural: `.github/skills/minimalize-architecture/SKILL.md`

## 🎯 Stack Tecnológico

### Dependencias Principales

| Librería         | Versión | Propósito                   |
| ---------------- | ------- | --------------------------- |
| **React**        | ^19.1.0 | Framework UI                |
| **React DOM**    | ^19.1.0 | React para web              |
| **Vite**         | ^7.0.0  | Build tool y dev server     |
| **TypeScript**   | ~5.8.3  | Tipado estático             |
| **Tailwind CSS** | ^4.1.11 | Framework CSS utility-first |
| **Wouter**       | ^3.7.1  | Router ligero (1.3KB)       |
| **Zustand**      | ^5.0.6  | Gestión de estado           |

### Herramientas de Desarrollo

- **ESLint 9** con soporte para React Hooks y React Refresh
- **TypeScript ESLint** para reglas de linting específicas
- **Vite Plugin React** para Fast Refresh
- Configuración de path aliases (`@/`) pre-configurada

## 🚀 Uso Rápido

### Crear un nuevo proyecto

```bash
npx create-minimalize-template mi-proyecto
```

### Comandos disponibles

```bash
# Instalación y desarrollo
cd mi-proyecto
npm install
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 📁 Estructura del Proyecto Generado

```
mi-proyecto/
├── public/
│   └── vite.svg
├── src/
│   ├── pages/
│   │   ├── Home.tsx      # Página principal
│   │   └── Login.tsx     # Página de login
│   ├── stores/
│   │   └── auth.ts       # Store de autenticación con Zustand
│   ├── App.tsx           # Componente principal
│   ├── router.tsx        # Configuración de rutas con Wouter
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globales con Tailwind
├── index.html
├── vite.config.ts        # Configuración de Vite
├── tsconfig.json         # TypeScript config
├── eslint.config.js      # ESLint config
└── package.json
```

## 🛠️ Características Pre-configuradas

### Router con Wouter

El template incluye un router básico configurado con dos rutas:

- `/` - Página principal (Home)
- `/login` - Página de login

```typescript
// src/router.tsx
import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import Login from './pages/Login'

export const Router = () => (
  <Switch>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
  </Switch>
)
```

### Store de Autenticación con Zustand

Store global pre-configurado para manejar autenticación:

```typescript
// src/stores/auth.ts
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // ... implementation
}))
```

### Path Aliases

El proyecto viene con path aliases configurados:

```typescript
import Component from '@/pages/Home' // En vez de '../../../pages/Home'
```

## 📋 Scripts Disponibles en el CLI

### Para Desarrollo del Template

Si estás desarrollando o contribuyendo a este CLI:

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/minimalize-template-cli.git
cd minimalize-template-cli

# Instalar dependencias
npm install

# Probar el CLI localmente
node cli.js test-project

# Publicar nueva versión
npm run release:patch  # 1.0.4 -> 1.0.5
npm run release:minor  # 1.0.4 -> 1.1.0
npm run release:major  # 1.0.4 -> 2.0.0
```

## 🔄 Sistema de Versionado

Este proyecto sigue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Cambios que rompen compatibilidad
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Corrección de bugs compatible con versiones anteriores

### Comandos de Release

```bash
npm run release:patch  # Bug fixes
npm run release:minor  # Nuevas features
npm run release:major  # Breaking changes
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para el historial de cambios.

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](./LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [@tuhandle](https://twitter.com/tuhandle)

---

**¿Disfrutando del template?** ⭐️ Dale una estrella en GitHub!
