# Guía de Contribución

¡Gracias por considerar contribuir a create-minimalize-template! 🎉

## 🚀 Desarrollo Local

### Setup Inicial

```bash
# 1. Fork y clona el repositorio
git clone https://github.com/yourusername/minimalize-template-cli.git
cd minimalize-template-cli

# 2. Instala dependencias (si las hubiera en el futuro)
npm install

# 3. Prueba el CLI localmente
node cli.js test-project
cd test-project
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
minimalize-template-cli/
├── cli.js              # CLI principal - copia el template
├── template/           # Template que se copia a nuevos proyectos
│   ├── src/           # Código fuente del template
│   ├── public/        # Assets públicos
│   └── ...            # Configuraciones (vite, ts, eslint, etc)
├── package.json       # Metadata y scripts del CLI
├── README.md          # Documentación principal
├── CHANGELOG.md       # Historial de cambios
└── CONTRIBUTING.md    # Esta guía
```

## 🔄 Workflow de Cambios

### Tipos de Cambios

#### 1. Cambios en el Template (`/template`)

Si modificas archivos dentro de `/template`:

```bash
# Edita los archivos necesarios
vim template/src/pages/Home.tsx

# Prueba localmente
node cli.js test-project-local
cd test-project-local
npm install && npm run dev

# Si funciona, commit
git add template/
git commit -m "feat: add new feature to Home page"
```

**Estos cambios requieren:**

- ✅ Probar que el template genera proyectos funcionales
- ✅ Actualizar el README si afecta el uso
- ✅ Actualizar CHANGELOG.md
- ✅ Decidir el tipo de version (patch/minor/major)

#### 2. Cambios en el CLI (`cli.js`)

Si modificas la lógica del CLI:

```bash
# Edita cli.js
vim cli.js

# Prueba
node cli.js test-project-cli
# Verifica que se copie correctamente

# Commit
git commit -m "fix: improve error handling in CLI"
```

#### 3. Cambios en Documentación

```bash
# Edita README, CHANGELOG, etc
vim README.md

git commit -m "docs: update installation instructions"
```

## 📝 Estándares de Commit

Usamos una variante minimalista de Conventional Commits con emoji:

```text
<emoji> <type>(<scope>): <short subject>
```

Reglas:

- Subject breve (max 72 caracteres).
- Subject en imperativo y sin punto final.
- Scope opcional en kebab-case.

Tipos permitidos:

- `✨ feat`: Nueva funcionalidad.
- `🐛 fix`: Corrección de bugs.
- `📝 docs`: Documentación.
- `♻️ refactor`: Refactor sin cambio funcional.
- `✅ test`: Pruebas.
- `🔧 chore`: Mantenimiento, tooling y CI.

Ejemplos:

```bash
✨ feat(template): add auth guard for private routes
🐛 fix(cli): handle project names with dots
📝 docs(readme): add architecture governance section
🔧 chore(ci): validate commit emoji format
```

Mensajes permitidos sin formato (compatibilidad):

- `Merge ...`
- `Revert ...`
- `vX.Y.Z` (commits de versionado)

### Activar hooks locales

```bash
npm run commit:hooks
```

Esto configura `core.hooksPath` para usar `.githooks/commit-msg`.

### Comportamiento esperado para agentes

Cuando el usuario pide implementar un cambio (agregar/corregir/refactorizar) y el agente deja cambios nuevos en el working tree:

- Debe crear el commit correspondiente al cierre del request.
- Debe usar el formato emoji definido en esta guía.
- Debe incluir solo archivos relacionados al request.
- No debe usar `--no-verify`.

La política operativa está en `.github/instructions/commit.instructions.md`.

## 🏷️ Sistema de Versionado

### Semantic Versioning

Seguimos [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

#### PATCH (1.0.X) - Bug Fixes

```bash
# Ejemplos de cambios PATCH:
- Corregir typos en el template
- Actualizar dependencias patch (19.1.0 -> 19.1.1)
- Corregir configuración de ESLint
- Mejorar documentación

# Release:
npm run release:patch
```

#### MINOR (1.X.0) - Nuevas Features

```bash
# Ejemplos de cambios MINOR:
- Agregar nueva página al template
- Agregar nuevo store de Zustand
- Agregar nuevos componentes
- Actualizar dependencias minor (19.1.0 -> 19.2.0)

# Release:
npm run release:minor
```

#### MAJOR (X.0.0) - Breaking Changes

```bash
# Ejemplos de cambios MAJOR:
- Cambiar de React 18 a React 19
- Cambiar estructura de carpetas significativamente
- Eliminar features existentes
- Cambiar API del CLI

# Release:
npm run release:major
```

## 🚢 Proceso de Release

### 1. Preparar el Release

```bash
# 1. Asegúrate de estar en main y actualizado
git checkout main
git pull origin main

# 2. Actualiza CHANGELOG.md
vim CHANGELOG.md
# Mueve los cambios de [Unreleased] a una nueva versión
# Ejemplo:
## [1.1.0] - 2024-12-18
### Added
- New dark mode support

# 3. Commit el changelog
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.1.0"
```

### 2. Ejecutar Release

```bash
# Esto hace:
# - Incrementa la versión en package.json
# - Crea un git tag
# - Publica a npm
npm run release:minor  # o patch/major según corresponda
```

### 3. Push de Tags

```bash
# Pushear código y tags
git push origin main
git push origin --tags
```

### 4. Crear Release en GitHub

1. Ve a GitHub → Releases → "Draft a new release"
2. Selecciona el tag recién creado
3. Copia el contenido del CHANGELOG de esa versión
4. Publica el release

## ✅ Checklist Pre-Release

Antes de hacer release, verifica:

- [ ] El template genera proyectos que compilan sin errores
- [ ] `npm install` funciona en proyectos generados
- [ ] `npm run dev` funciona en proyectos generados
- [ ] `npm run build` funciona en proyectos generados
- [ ] El CHANGELOG.md está actualizado
- [ ] El README.md refleja todos los cambios
- [ ] Los commits siguen Conventional Commits
- [ ] La versión es la correcta (patch/minor/major)

## 🧪 Testing

### Test Manual

```bash
# 1. Genera un proyecto de prueba
node cli.js test-project-manual

# 2. Instala y corre
cd test-project-manual
npm install

# 3. Verifica todos los comandos
npm run dev      # ¿Arranca sin errores?
npm run build    # ¿Compila correctamente?
npm run lint     # ¿Pasa el linting?
npm run preview  # ¿Preview funciona?

# 4. Verifica funcionalidad
# - ¿Las rutas funcionan?
# - ¿El store de auth funciona?
# - ¿Los path aliases (@/) funcionan?
# - ¿Tailwind funciona?

# 5. Limpia
cd ..
rm -rf test-project-manual
```

### Script de Test Rápido

El package.json incluye:

```bash
npm test  # Genera y limpia un proyecto de prueba
```

## 📊 Actualizando Dependencias del Template

Cuando actualices dependencias en `/template/package.json`:

### Dependencias Patch/Minor (Safe)

```bash
cd template
npm update
cd ..

# Prueba que todo funciona
node cli.js test-deps
cd test-deps && npm install && npm run build

# Si funciona, commit
git add template/package.json template/package-lock.json
git commit -m "chore(deps): update dependencies"
```

### Dependencias Major (Cuidado)

```bash
# Actualiza una por una y prueba
cd template
npm install react@latest react-dom@latest
npm run build  # ¿Compila?

# Prueba el template completo
cd ..
node cli.js test-major-update
cd test-major-update
npm install && npm run dev

# Si funciona, esto es probablemente un MAJOR release
git add template/
git commit -m "feat!: upgrade to React 20"
```

## 🆘 ¿Necesitas Ayuda?

- 📖 Lee el [README.md](./README.md)
- 🐛 Reporta bugs en [Issues](https://github.com/yourusername/minimalize-template-cli/issues)
- 💬 Discusiones en [Discussions](https://github.com/yourusername/minimalize-template-cli/discussions)

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia MIT del proyecto.
