# Documentacion

RQ-DOC-001
- Descripcion: README con como correr, scripts y overview.
- Version: v1
- Dependencias: RQ-SSR-004
- Fundamento: Onboarding claro.
- Criterios de aceptacion:
  - README describe setup y comandos.
- Checklist:
  - [ ] Incluir scripts dev y prod-like SSR.

RQ-DOC-002
- Descripcion: Docs obligatorias: architecture, labs, ssr-hydration, zoneless, performance.
- Version: v1
- Dependencias: RQ-LAB-002
- Fundamento: Documentacion educativa.
- Criterios de aceptacion:
  - Docs existen y estan enlazadas.
- Checklist:
  - [ ] docs/architecture.md
  - [ ] docs/labs/<feature>.md
  - [ ] docs/ssr-hydration.md
  - [ ] docs/zoneless.md
  - [ ] docs/performance.md

RQ-DOC-003
- Descripcion: ADR-lite para decisiones importantes.
- Version: v1
- Dependencias: RQ-ADR-001
- Fundamento: Registrar decisiones y tradeoffs.
- Criterios de aceptacion:
  - docs/adr/ contiene decisiones clave.
- Checklist:
  - [ ] Crear plantilla ADR.

RQ-DOC-004
- Descripcion: Documentar PWA, seguridad y headers.
- Version: v1
- Dependencias: RQ-PWA-003, RQ-SEC-003
- Fundamento: Completar informacion operativa.
- Criterios de aceptacion:
  - Secciones PWA y seguridad disponibles.
- Checklist:
  - [ ] Agregar secciones en docs relevantes.

RQ-DOC-005
- Descripcion: agenda.md con objetivo de iteracion, checklist y Definition of Done por lab.
- Version: v1
- Dependencias: RQ-LAB-002
- Fundamento: Rutina de trabajo y trazabilidad.
- Criterios de aceptacion:
  - agenda.md presente y actualizado.
- Checklist:
  - [ ] Definir DoD por lab.
  - [ ] Registrar metricas.

RQ-DOC-006
- Descripcion: Documentar setup de AI/MCP (AGENTS.md o ai.md).
- Version: v1
- Dependencias: none
- Fundamento: Contexto para asistentes.
- Criterios de aceptacion:
  - Archivo guia presente.
- Checklist:
  - [x] Crear o actualizar AGENTS.md.
