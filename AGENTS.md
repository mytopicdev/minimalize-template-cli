# AGENTS.md

Guia rapida para agentes de codigo en este repositorio.

## Alcance del repositorio

- Este proyecto tiene dos contextos:
- `root/`: CLI de scaffolding (`cli.js`) y gobernanza del repositorio.
- `template/`: app React + Vite + TypeScript que se copia al generar proyectos.

## Flujo recomendado

1. Detectar si el cambio afecta `root` o `template`.
2. Ejecutar solo comandos del contexto afectado.
3. Validar antes de cerrar: lint/type-check/build/test segun corresponda.
4. Si el pedido es de implementacion (add/fix/refactor/update) y hay cambios nuevos, crear commit con formato emoji.

## Comandos canonicos

### Root

- Instalar dependencias: `pnpm install`
- Probar CLI (smoke): `pnpm test`
- Validar mensaje de commit local: `pnpm commit:check`
- Activar hook de commit-msg: `pnpm commit:hooks`

### Template

Ejecutar desde `template/`:

- Desarrollo: `pnpm dev`
- Build: `pnpm build`
- Preview: `pnpm preview`
- Lint: `pnpm lint`
- Autofix lint: `pnpm lint:fix`
- Formato: `pnpm format`
- Chequeo de formato: `pnpm format:check`
- Tipos: `pnpm type-check`

## Arquitectura y limites

- Regla principal: arquitectura por feature/dominio con limites explicitos.
- Precedencia de decision:

1. ADRs aceptados
2. Convenciones de arquitectura
3. Defaults generales

- No cruzar limites de feature por imports internos.
- Hacer migraciones estructurales en lotes pequenos.

Referencias obligatorias para cambios estructurales:

- [Convenciones de arquitectura](docs/architecture/conventions.md)
- [Indice ADR](docs/architecture/decisions/README.md)
- [ADR arquitectura base](docs/architecture/decisions/2026-05-08-adopt-minimalize-architecture.md)

## Politica de commits para agentes

- Si el pedido del usuario es implementacion y quedan cambios nuevos en el working tree, el agente debe commitear.
- Formato requerido: `<emoji> <type>(<scope>): <short subject>`
- Tipos/emoji permitidos: ver guia de contribucion.
- No usar `--no-verify`.
- Incluir solo archivos relacionados al pedido.

Referencias:

- [Guia de contribucion](CONTRIBUTING.md)
- [ADR de commit policy](docs/architecture/decisions/2026-05-08-agent-emoji-commit-policy.md)
- [Instruccion operativa de commit](.github/instructions/commit.instructions.md)

## Documentacion de apoyo (enlazar, no duplicar)

- [README principal](README.md)
- [Resumen de proyecto](PROJECT_SUMMARY.md)
- [Setup guide](SETUP_GUIDE.md)
- [Quick reference](QUICK_REFERENCE.md)
- [Versioning](VERSIONING.md)

## Pitfalls frecuentes

- Ejecutar comandos del `template` desde root da resultados incorrectos; usar `cd template`.
- Al tocar `cli.js`, validar generando un proyecto temporal y ejecutando comandos basicos del proyecto generado.
- Evitar cambios estructurales grandes de una sola vez; preferir lotes pequenos verificables.
