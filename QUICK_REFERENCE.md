# ⚡ Guía Rápida de Referencia

## 🚀 Comandos Más Usados

### Para Usuarios del CLI

```bash
# Crear nuevo proyecto
pnpx create-minimalize-template mi-proyecto

# Comandos dentro del proyecto generado
cd mi-proyecto
pnpm install       # Instalar dependencias
pnpm dev           # Desarrollo local (http://localhost:5173)
pnpm build         # Build de producción
pnpm preview       # Preview del build
pnpm lint          # Linting con ESLint
```

---

### Para Mantenedores del CLI

```bash
# Testing local
node cli.js test-project                  # Crear proyecto de prueba
cd test-project && pnpm install && pnpm dev

# Releases
pnpm release:patch       # 1.0.4 → 1.0.5 (bug fixes)
pnpm release:minor       # 1.0.4 → 1.1.0 (nuevas features)
pnpm release:major       # 1.0.4 → 2.0.0 (breaking changes)

# Después del release
git push origin main --tags
```

---

## 📁 Estructura de Archivos Clave

```
minimalize-template-cli/
├── cli.js                    # ⚙️  CLI principal
├── package.json              # 📦 Config del CLI
├── template/                 # 📂 Template que se copia
│   ├── package.json          # 📦 Dependencies del proyecto generado
│   ├── vite.config.ts        # ⚡ Config de Vite
│   ├── tsconfig.json         # 🔷 Config de TypeScript
│   ├── eslint.config.js      # 🔍 Config de ESLint
│   └── src/
│       ├── main.tsx          # 🎯 Entry point
│       ├── App.tsx           # 📱 Componente principal
│       ├── router.tsx        # 🛣️  Router con Wouter
│       ├── pages/            # 📄 Páginas
│       └── stores/           # 🐻 Stores con Zustand
├── README.md                 # 📖 Documentación principal
├── CHANGELOG.md              # 📝 Historial de cambios
├── VERSIONING.md             # 🏷️  Guía de versionado
├── CONTRIBUTING.md           # 🤝 Guía de contribución
└── .github/workflows/        # 🤖 CI/CD
```

---

## 🎨 Stack del Template

### Core

- **React 19.1.0** - Framework UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 7.0.0** - Build tool

### Styling

- **Tailwind CSS 4.1.11** - Utility-first CSS

### Routing & State

- **Wouter 3.7.1** - Router minimalista (~1.3KB)
- **Zustand 5.0.6** - Gestión de estado simple

### Dev Tools

- **ESLint 9** - Linting
- **TypeScript ESLint 8** - TS linting rules

---

## 🔄 Workflow de Cambios

### 1. Cambiar el Template

```bash
# Editar archivos
vim template/src/pages/Home.tsx

# Probar
node cli.js test-local
cd test-local && pnpm install && pnpm dev

# Commit
git add template/
git commit -m "feat: improve Home page"
```

### 2. Actualizar Documentación

```bash
# Editar CHANGELOG.md
vim CHANGELOG.md

# Commit
git add CHANGELOG.md
git commit -m "chore: update changelog"
```

### 3. Release

```bash
# Elegir tipo de versión
pnpm release:minor

# Push
git push origin main --tags
```

---

## 🐛 Troubleshooting

### El CLI no encuentra el template

```bash
# Verificar que existe
ls -la template/package.json

# Si falta, hay un problema con el build/publish
```

### Proyecto generado no compila

```bash
# Verificar dependencias
cd template
pnpm install
pnpm build

# Si falla, hay un problema en el template
```

### Error al publicar a npm

```bash
# Verificar login
pnpm whoami

# Re-login si es necesario
pnpm login

# Verificar permisos
npm owner ls create-minimalize-template
```

---

## 📊 Tipos de Versión (Quick Reference)

| Versión   | Cuándo           | Ejemplos                                            |
| --------- | ---------------- | --------------------------------------------------- |
| **PATCH** | Bug fixes        | Corregir typos, fix bugs menores, docs              |
| **MINOR** | Nuevas features  | Agregar páginas, nuevos componentes, nuevas deps    |
| **MAJOR** | Breaking changes | React 18→19, cambio de estructura, remover features |

---

## 🔗 Links Útiles

- 📦 [NPM Package](https://www.npmjs.com/package/create-minimalize-template)
- 🐙 [GitHub Repo](https://github.com/yourusername/minimalize-template-cli)
- 🐛 [Issues](https://github.com/yourusername/minimalize-template-cli/issues)
- 💬 [Discussions](https://github.com/yourusername/minimalize-template-cli/discussions)

---

## 📚 Documentación Completa

- [README.md](./README.md) - Documentación principal y guía de uso
- [CHANGELOG.md](./CHANGELOG.md) - Historial completo de versiones
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía detallada de contribución
- [VERSIONING.md](./VERSIONING.md) - Guía completa de versionado
- [LICENSE](./LICENSE) - Licencia MIT

---

## 🎯 Atajos del Editor (Template Projects)

Los proyectos generados tienen path aliases configurados:

```typescript
// En vez de
import Component from '../../../components/Component'

// Usa
import Component from '@/components/Component'
```

Configurado en:

- `vite.config.ts` - Para Vite
- `tsconfig.json` - Para TypeScript
- `jsconfig.json` - Para JS (autocomplete en editors)

---

## 🔥 Tips

### Testing Rápido

```bash
# One-liner para test completo
node cli.js test && cd test && pnpm i && pnpm build && cd .. && rm -rf test
```

### Ver Versiones Disponibles

```bash
npm view create-minimalize-template versions
```

### Instalar Versión Específica

```bash
pnpx create-minimalize-template@1.0.3 mi-proyecto
```

### Limpiar Tests Antiguos

```bash
rm -rf test-project-*
```

---

## ⚠️ Recordatorios Importantes

1. ✅ Siempre probar el template antes de release
2. ✅ Actualizar CHANGELOG.md antes de release
3. ✅ Usar Conventional Commits
4. ✅ Pushear tags después de release
5. ✅ Verificar que GitHub Actions pase
6. ❌ NO hacer releases desde branches que no sean main
7. ❌ NO olvidar actualizar la versión en cli.js si tiene banner

---

**¿Necesitas más ayuda?** Lee la documentación completa o abre un issue. 🚀
