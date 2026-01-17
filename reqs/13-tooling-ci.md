# Tooling / build / CI

RQ-TOOL-001
- Descripcion: Build system moderno (CLI + dev server integrado).
- Version: v1
- Dependencias: none
- Fundamento: Compatibilidad con Angular v21.
- Criterios de aceptacion:
  - Proyecto usa tooling moderno de Angular.
- Checklist:
  - [ ] Confirmar builder y scripts.

RQ-TOOL-002
- Descripcion: Quality gates con ESLint + Prettier.
- Version: v1
- Dependencias: RQ-STD-001
- Fundamento: Consistencia y calidad.
- Criterios de aceptacion:
  - Lint y format disponibles.
- Checklist:
  - [ ] Configurar ESLint.
  - [ ] Configurar Prettier.

RQ-TOOL-003
- Descripcion: CI con lint, unit tests y build (v2 Lighthouse opcional).
- Version: v1
- Dependencias: RQ-TEST-001
- Fundamento: Calidad continua.
- Criterios de aceptacion:
  - Pipeline ejecuta lint/test/build.
- Checklist:
  - [ ] Definir pipeline CI.
  - [ ] (v2) Lighthouse CI opcional.
