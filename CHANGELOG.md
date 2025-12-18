# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README with detailed documentation
- Changelog file for version tracking
- Release scripts for semantic versioning
- Package.json metadata (keywords, repository, license)
- Pre-publish validation script

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
npm run release:patch  # Para bug fixes
npm run release:minor  # Para nuevas features
npm run release:major  # Para breaking changes

# 3. Hacer push del tag:
git push --follow-tags
```

