# 🏷️ Guía de Versionado

Esta guía te ayudará a decidir qué tipo de versión incrementar según los cambios que hagas.

## 📊 Semantic Versioning Quick Reference

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─── Bug fixes, actualizaciones menores
  │     └───────── Nuevas features, cambios compatibles
  └─────────────── Breaking changes, incompatibilidades
```

---

## 🔢 Tipos de Versión

### PATCH (1.0.X) 🐛

**Cuándo usar:** Solo correcciones y mejoras menores que no afectan funcionalidad

#### ✅ Ejemplos de cambios PATCH:

```bash
# Correcciones de bugs
- Fix: corregir typo en mensaje de error del CLI
- Fix: path incorrecto en configuración
- Fix: componente que no renderiza correctamente

# Documentación
- Docs: actualizar README con ejemplos
- Docs: corregir typos en CONTRIBUTING.md
- Docs: agregar badges al README

# Actualizaciones menores de dependencias
- Chore: update React from 19.1.0 to 19.1.1
- Chore: update Vite from 7.0.0 to 7.0.1
- Chore: update dev dependencies (eslint, typescript patch)

# Mejoras internas sin cambio de funcionalidad
- Refactor: mejorar legibilidad del código
- Style: formatear código
- Perf: optimización menor sin cambio de API
```

#### 🚀 Comando:

```bash
pnpm release:patch
```

---

### MINOR (1.X.0) ✨

**Cuándo usar:** Nuevas features o mejoras que son compatibles hacia atrás

#### ✅ Ejemplos de cambios MINOR:

```bash
# Nuevas features en el template
- Feat: agregar página de Dashboard
- Feat: agregar componente de Navigation
- Feat: agregar store de temas (dark mode)
- Feat: agregar hook useLocalStorage

# Nuevas dependencias (sin breaking changes)
- Feat: agregar React Query al template
- Feat: agregar Framer Motion para animaciones
- Feat: agregar React Hook Form

# Mejoras significativas al CLI
- Feat: agregar opción --typescript o --javascript
- Feat: agregar flag --tailwind para incluir/excluir Tailwind
- Feat: agregar templates alternativos

# Actualizaciones minor de dependencias
- Chore: update React from 19.1.0 to 19.2.0
- Chore: update Tailwind from 4.1.0 to 4.2.0
- Chore: update Vite from 7.0.0 to 7.1.0

# Cambios estructurales compatibles
- Feat: reorganizar estructura de carpetas (manteniendo compatibilidad)
- Feat: agregar configuración de path aliases adicionales
```

#### 🚀 Comando:

```bash
pnpm release:minor
```

---

### MAJOR (X.0.0) 💥

**Cuándo usar:** Cambios que rompen compatibilidad o requieren cambios del usuario

#### ✅ Ejemplos de cambios MAJOR:

```bash
# Actualización major de dependencias críticas
- BREAKING: upgrade React from 18.x to 19.x
- BREAKING: upgrade Vite from 6.x to 7.x
- BREAKING: upgrade Node requirement from 16+ to 18+

# Cambios estructurales significativos
- BREAKING: cambiar estructura de carpetas de src/
- BREAKING: cambiar sistema de routing (Wouter → React Router)
- BREAKING: cambiar sistema de estado (Zustand → Redux)

# Eliminación de features
- BREAKING: remover soporte para JavaScript (solo TypeScript)
- BREAKING: remover páginas pre-incluidas
- BREAKING: remover auth store

# Cambios en la API del CLI
- BREAKING: cambiar nombre del comando
- BREAKING: cambiar estructura de argumentos
- BREAKING: cambiar formato de configuración

# Cambios incompatibles en configuración
- BREAKING: cambiar estructura de vite.config
- BREAKING: cambiar configuración de TypeScript
- BREAKING: nuevo sistema de temas incompatible
```

#### 🚀 Comando:

```bash
pnpm release:major
```

---

## 🎯 Workflow de Release Paso a Paso

### 1️⃣ Antes de Empezar

```bash
# Asegúrate de estar actualizado
git checkout main
git pull origin main

# Verifica que no haya cambios sin commitear
git status
```

### 2️⃣ Hacer tus Cambios

```bash
# Edita archivos
vim template/src/pages/NewPage.tsx

# Prueba localmente
node cli.js test-local
cd test-local && pnpm install && pnpm dev

# Si funciona, haz commit con Conventional Commits
git add .
git commit -m "feat: add NewPage component"
```

### 3️⃣ Actualizar CHANGELOG.md

Edita `CHANGELOG.md` y mueve los cambios de `[Unreleased]` a una nueva versión:

```markdown
## [Unreleased]

## [1.1.0] - 2024-12-18

### Added

- New Dashboard page with analytics
- Dark mode support with Zustand store
- useLocalStorage custom hook

### Changed

- Improved error messages in CLI
- Updated dependencies to latest patch versions

### Fixed

- Fixed routing issue on Login page
```

```bash
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.1.0"
```

### 4️⃣ Ejecutar Release

```bash
# Decide el tipo de versión y ejecuta:
pnpm release:patch     # 1.0.4 → 1.0.5
pnpm release:minor     # 1.0.4 → 1.1.0
pnpm release:major     # 1.0.4 → 2.0.0
```

**Esto automáticamente:**

1. ✅ Incrementa la versión en `package.json`
2. ✅ Crea un commit de versión
3. ✅ Crea un git tag (ej: `v1.1.0`)
4. ✅ Publica a npm

### 5️⃣ Push al Repositorio

```bash
# Push código y tags
git push origin main
git push origin --tags
```

**GitHub Actions automáticamente:**

1. ✅ Detecta el nuevo tag
2. ✅ Ejecuta tests
3. ✅ Crea un GitHub Release
4. ✅ Publica documentación

---

## 🎓 Ejemplos Prácticos

### Ejemplo 1: Bug Fix Simple

```bash
# Corriges un typo en el template
vim template/src/pages/Home.tsx

git add template/src/pages/Home.tsx
git commit -m "fix: correct typo in Home page title"

# Actualiza CHANGELOG
vim CHANGELOG.md
git add CHANGELOG.md
git commit -m "chore: update changelog"

# Release PATCH
pnpm release:patch
git push origin main --tags
```

### Ejemplo 2: Nueva Feature

```bash
# Agregas una nueva página
vim template/src/pages/About.tsx
vim template/src/router.tsx

git add template/src/
git commit -m "feat: add About page"

# Actualiza CHANGELOG y README
vim CHANGELOG.md README.md
git add .
git commit -m "docs: update changelog and readme for v1.1.0"

# Release MINOR
pnpm release:minor
git push origin main --tags
```

### Ejemplo 3: Breaking Change

```bash
# Actualizas React a una versión major
cd template
pnpm install react@20.0.0 react-dom@20.0.0

# Actualizas código si es necesario
vim src/main.tsx

cd ..
git add template/
git commit -m "feat!: upgrade to React 20"

# Actualiza CHANGELOG con sección BREAKING
vim CHANGELOG.md
git add CHANGELOG.md
git commit -m "chore: update changelog for v2.0.0"

# Release MAJOR
pnpm release:major
git push origin main --tags
```

---

## 📋 Checklist Pre-Release

Antes de hacer `pnpm release:*`, verifica:

- [ ] 🧪 El template genera proyectos que funcionan
- [ ] 📦 `pnpm install` funciona en proyectos generados
- [ ] 🚀 `pnpm dev` arranca sin errores
- [ ] 🏗️ `pnpm build` compila correctamente
- [ ] 📝 CHANGELOG.md está actualizado
- [ ] 📖 README.md refleja los cambios (si aplica)
- [ ] ✅ Commits siguen Conventional Commits
- [ ] 🔢 Tipo de versión es correcto (patch/minor/major)

---

## 🆘 ¿Cometiste un Error?

### Revertir un release local (antes de push)

```bash
# Deshacer el último commit y el tag
git reset --hard HEAD~1
git tag -d v1.1.0
```

### Un release ya se publicó a npm

```bash
# Deprecar la versión problemática
pnpm deprecate create-minimalize-template@1.1.0 "Esta versión tiene un bug, usa 1.1.1"

# Publicar una versión fixed
pnpm release:patch
```

---

## 📊 Histórico de Versiones

Siempre puedes ver el historial completo en:

- 📝 [CHANGELOG.md](./CHANGELOG.md) - Historial detallado
- 🏷️ [GitHub Releases](https://github.com/yourusername/minimalize-template-cli/releases) - Releases con notas
- 📦 [npm](https://www.npmjs.com/package/create-minimalize-template?activeTab=versions) - Versiones publicadas

---

## 🤝 ¿Preguntas?

Si tienes dudas sobre qué versión usar, pregúntate:

1. **¿Los usuarios existentes necesitan cambiar algo?**
   - ✅ SÍ → MAJOR
   - ❌ NO → Sigue preguntando

2. **¿Agregaste funcionalidad nueva?**
   - ✅ SÍ → MINOR
   - ❌ NO → Sigue preguntando

3. **¿Solo corregiste bugs o mejoras menores?**
   - ✅ SÍ → PATCH

**En caso de duda, pregunta en el PR o Issue.**
