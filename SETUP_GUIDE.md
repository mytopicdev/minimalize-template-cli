# 🎯 Guía de Setup - Primeros Pasos

Esta guía te ayudará a configurar tu repositorio para publicar y mantener el CLI.

## ✅ Checklist de Setup Inicial

### 1. Actualizar información personal

#### En `package.json`:

```json
{
  "author": "Tu Nombre <tu@email.com>", // ← Actualiza esto
  "repository": {
    "url": "https://github.com/TU_USUARIO/minimalize-template-cli.git" // ← Y esto
  },
  "bugs": {
    "url": "https://github.com/TU_USUARIO/minimalize-template-cli/issues" // ← Y esto
  },
  "homepage": "https://github.com/TU_USUARIO/minimalize-template-cli#readme" // ← Y esto
}
```

#### En `README.md`:

- Actualiza el badge de npm (línea 5)
- Actualiza el link de licencia (línea 6)
- Actualiza la sección de autor (cerca del final)
- Reemplaza `yourusername` con tu usuario de GitHub en todos los links

#### En `LICENSE`:

- Actualiza `[Tu Nombre]` con tu nombre real

---

### 2. Configurar pnpm

```bash
# 1. Login al registro npm (pnpm usa el mismo registro)
pnpm login

# 2. Verificar que estés logueado
pnpm whoami

# 3. (Opcional) Verificar disponibilidad del nombre
pnpm view create-minimalize-template
# Si da error 404, el nombre está disponible
```

---

### 3. Configurar GitHub

#### A. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `minimalize-template-cli`
3. Descripción: "CLI to scaffold React + Vite + TypeScript + Tailwind projects"
4. Público
5. NO inicialices con README (ya tienes uno)

#### B. Conectar tu repo local

```bash
# Si aún no lo has hecho
git init
git add .
git commit -m "feat: initial CLI with complete documentation"

# Agregar remote (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/minimalize-template-cli.git

# Push inicial
git branch -M main
git push -u origin main
```

#### C. Configurar GitHub Secrets (para publicación automática)

1. Ve a tu repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Tu token de npm (ver cómo obtenerlo abajo)

**Cómo obtener NPM_TOKEN:**

```bash
# 1. Ir a https://www.npmjs.com/settings/[tu-usuario]/tokens
# 2. Click "Generate New Token" → "Classic Token"
# 3. Tipo: "Automation"
# 4. Copiar el token y agregarlo a GitHub Secrets
```

---

### 4. Primera Publicación al registro npm

```bash
# 1. Asegúrate de estar en main
git checkout main

# 2. Verifica que todo esté commiteado
git status

# 3. Publica la primera versión
pnpm publish

# 4. Verifica que se publicó
pnpm view create-minimalize-template
```

✅ ¡Listo! Ya deberías poder usar:

```bash
pnpx create-minimalize-template mi-proyecto
```

---

### 5. Configurar Branch Protection (Recomendado)

Para evitar publicar código roto:

1. Ve a tu repo → Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Activar:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Seleccionar los checks de CI (después del primer push)
5. Save changes

---

## 🔄 Flujo de Trabajo Diario

### Hacer cambios al template

```bash
# 1. Editar archivos
vim template/src/pages/Home.tsx

# 2. Probar localmente
node cli.js test-local
cd test-local
pnpm install && pnpm dev

# 3. Si funciona, commitear
cd ..
rm -rf test-local
git add template/
git commit -m "feat: improve Home page styling"
```

### Publicar nueva versión

```bash
# 1. Actualizar CHANGELOG.md
vim CHANGELOG.md

# 2. Commit changelog
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.1.0"

# 3. Hacer release (elige uno)
pnpm release:patch     # Bug fixes: 1.0.4 → 1.0.5
pnpm release:minor     # New features: 1.0.4 → 1.1.0
pnpm release:major     # Breaking changes: 1.0.4 → 2.0.0

# 4. Push (incluyendo tags)
git push origin main --tags
```

GitHub Actions automáticamente:

- ✅ Ejecutará tests
- ✅ Creará un release en GitHub
- ✅ Publicará al registro npm (si configuraste NPM_TOKEN)

---

## 🧪 Comandos de Testing

```bash
# Test rápido - crea y elimina proyecto
pnpm test

# Test manual completo
node cli.js test-manual
cd test-manual
pnpm install
pnpm dev         # Verificar que corre
pnpm build       # Verificar que compila
pnpm lint        # Verificar linting
cd ..
rm -rf test-manual

# Probar CLI como se usaría desde npm
pnpm link --global
create-minimalize-template test-linked
pnpm unlink --global create-minimalize-template
```

---

## 📊 Monitorear tu Package

### Ver estadísticas de npm

- **Downloads**: https://npm-stat.com/charts.html?package=create-minimalize-template
- **Package page**: https://www.npmjs.com/package/create-minimalize-template
- **Bundlephobia**: https://bundlephobia.com/package/create-minimalize-template

### GitHub Insights

- **Traffic**: `https://github.com/TU_USUARIO/minimalize-template-cli/graphs/traffic`
- **Stars**: `https://github.com/TU_USUARIO/minimalize-template-cli/stargazers`

---

## 🔧 Mantenimiento

### Actualizar dependencias del template

```bash
cd template

# Ver outdated
pnpm outdated

# Actualizar (seguros)
pnpm update

# Actualizar majors (cuidado)
pnpm install react@latest react-dom@latest

# IMPORTANTE: Probar después
pnpm build

cd ..
node cli.js test-deps
cd test-deps && pnpm install && pnpm build
```

### Responder a issues

Cuando alguien reporte un issue:

1. **Reproducir**: Intentar recrear el problema
2. **Fix**: Hacer cambios necesarios
3. **Test**: Probar que el fix funciona
4. **Release**: Publicar nueva versión (patch/minor según aplique)
5. **Close issue**: Con mensaje mencionando la versión fixed

---

## 🆘 Troubleshooting Común

### "pnpm publish" falla con 403

**Problema**: No tienes permisos o no estás logueado

**Solución**:

```bash
pnpm whoami  # Verificar login
pnpm login   # Re-login si es necesario
```

### GitHub Actions falla en publish

**Problema**: NPM_TOKEN no configurado o inválido

**Solución**:

1. Generar nuevo token en npmjs.com
2. Actualizar secret en GitHub
3. Re-run el workflow

### Template genera proyectos que no compilan

**Problema**: Dependencias incompatibles o código con errores

**Solución**:

```bash
cd template
pnpm install
pnpm build           # Ver el error exacto
# Fix el error
cd ..
pnpm release:patch   # Publicar fix
```

### Git tag ya existe

**Problema**: Intentaste release con una versión que ya existe

**Solución**:

```bash
# Ver tags existentes
git tag

# Eliminar tag local
git tag -d v1.1.0

# Eliminar tag remoto (si se pusheó)
git push origin :refs/tags/v1.1.0

# Ahora puedes volver a hacer release
```

---

## 📚 Recursos Adicionales

### Documentación del proyecto

- [README.md](./README.md) - Documentación principal
- [VERSIONING.md](./VERSIONING.md) - Guía completa de versionado
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Referencia rápida
- [CHANGELOG.md](./CHANGELOG.md) - Historial de cambios

### Links útiles

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [pnpm Documentation](https://pnpm.io/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 🎉 ¡Todo Listo!

Ahora tienes:

✅ CLI completamente funcional  
✅ Documentación completa  
✅ Sistema de versionado  
✅ CI/CD automatizado  
✅ Testing configurado

**Siguiente paso**: Actualiza la información personal y ¡publica tu primera versión! 🚀

---

**¿Necesitas ayuda?** Revisa los otros documentos en este repositorio o abre un issue.
