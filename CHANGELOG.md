# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2025-05-14

### ⚠️ Breaking Changes

- Replaced Wouter with React Router DOM for routing
- Restructured template with Minimalize Architecture (feature-based organization)

### Added

- React Router DOM with data router pattern and layouts
- Feature-based architecture: auth, home, routing modules
- Common utilities module with `cn()` helper (clsx + tailwind-merge)
- Prettier with Tailwind CSS plugin
- Environment variables example (.env.example) with TypeScript types
- Lint, format, and type-check scripts in template
- Agent guidance documentation (AGENTS.md)
- ADR for Minimalize Architecture adoption
- Emoji commit validation flow and policy

### Changed

- Migrated routing from Wouter to React Router DOM
- Reorganized template structure by feature/domain
- Moved auth store to feature module
- Relocated cn utility to common/utils
- Improved template maintainability and scalability

### Fixed

- CLI: corrected package.json name in generated projects
- Dependencies: removed unused 'path' package
- Dependencies: moved tailwind to devDependencies
- Hooks: renamed authStore → useAuthStore for consistency

### Removed

- Wouter routing library
- Redundant jsconfig.json
- PROJECT_SUMMARY.md and WOUTER_MIGRATION_PLAN.md files

## [1.2.0] - 2025-05-14

### Added

- Enhanced template structure with improved organization
- Comprehensive project documentation (PLAN.md, PROJECT_SUMMARY.md, QUICK_REFERENCE.md)
- Setup guides and contribution guidelines
- Dynamic versioning in CLI
- Improved error handling in CLI

### Changed

- Updated template dependencies to latest stable versions
- Restructured configuration files for better maintainability
- Enhanced console messages for better user experience
- Improved CLI validation and error messages

### Fixed

- Template path resolution issues
- Configuration consistency across files

## [1.0.4] - 2024-XX-XX

### Changed

- Previous release (add details from your git history if needed)

## [1.0.3] - 2024-XX-XX

### Changed

- Previous release

## [1.0.2] - 2024-XX-XX

### Changed

- Previous release

## [1.0.1] - 2024-XX-XX

### Changed

- Previous release

## [1.0.0] - 2024-XX-XX

### Added

- Initial release of create-minimalize-template
- Vite 7 + React 19 template
- TypeScript configuration
- Tailwind CSS v4 integration
- Wouter router pre-configured
- Zustand store for authentication
- ESLint configuration with React rules
- Path aliases support (@/)
- Basic project structure with Home and Login pages

---

## Tipos de Cambios

- **Added** - para nuevas funcionalidades
- **Changed** - para cambios en funcionalidades existentes
- **Deprecated** - para funcionalidades que pronto se eliminarán
- **Removed** - para funcionalidades eliminadas
- **Fixed** - para corrección de bugs
- **Security** - para vulnerabilidades de seguridad

## Guía de Versionado

### Patch (1.0.X)

- Corrección de bugs
- Actualizaciones menores de dependencias
- Mejoras en documentación
- Typos y errores menores

### Minor (1.X.0)

- Nuevas features en el template
- Nuevas dependencias no-breaking
- Mejoras significativas en la estructura
- Nuevos componentes o páginas

### Major (X.0.0)

- Cambios que rompen compatibilidad
- Actualización de React a nueva versión major
- Cambios estructurales significativos
- Eliminación de features existentes
- Cambios en la API del CLI

## Workflow de Release

```bash
# 1. Actualizar este CHANGELOG.md con los cambios
# 2. Ejecutar el comando de release apropiado:
pnpm release:patch    # Para bug fixes
pnpm release:minor    # Para nuevas features
pnpm release:major    # Para breaking changes

# 3. Hacer push del tag:
git push --follow-tags
```
