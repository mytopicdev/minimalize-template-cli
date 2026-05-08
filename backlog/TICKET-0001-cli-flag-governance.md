# Ticket: Flag de gobernanza en CLI

## Que
Agregar un flag opcional al CLI para incluir una base de gobernanza en proyectos nuevos generados desde el template.

Propuesta de flag:
- `--with-governance`

## Por que
Hoy la gobernanza (arquitectura, ADRs, convenciones e instrucciones para agentes) existe solo en este repositorio del CLI.

Los proyectos creados con el template no heredan esa base por defecto, lo que genera:
- Inconsistencia entre proyectos.
- Mayor trabajo manual post-scaffold.
- Mayor riesgo de deriva en arquitectura y convenciones.

## Propuesta del cambio
Implementar la opcion 2: agregar flag al CLI.

Al usar `--with-governance`, el CLI debe copiar al proyecto generado un set minimo de archivos de gobernanza, por ejemplo:
- `docs/architecture/README.md`
- `docs/architecture/conventions.md`
- `docs/architecture/decisions/README.md`
- `docs/architecture/decisions/ADR-TEMPLATE.md`
- `.github/instructions/architecture.instructions.md`
- `.github/instructions/commit.instructions.md`

Criterios de aceptacion:
1. Sin flag: comportamiento actual sin cambios.
2. Con flag: se copian los archivos de gobernanza definidos.
3. El proyecto generado compila y mantiene scripts actuales sin romper.
4. README del template documenta el uso del flag.
