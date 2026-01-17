# ADR y decisiones

RQ-ADR-001
- Descripcion: Regla de combinacion de filtros (AND entre familias, OR dentro de familia).
- Version: v2
- Dependencias: RQ-FILTER-013
- Fundamento: Define comportamiento esperado para filtros avanzados.
- Criterios de aceptacion:
  - Existe ADR que explica la regla y tradeoffs.
- Checklist:
  - [x] Escribir ADR en docs/adr/.

RQ-ADR-002
- Descripcion: Definir alcance de filtros avanzados opcionales (generacion, stats, species flags).
- Version: backlog
- Dependencias: RQ-FILTER-014
- Fundamento: Evitar expansion sin criterios.
- Criterios de aceptacion:
  - ADR con alcance y endpoints.
- Checklist:
  - [ ] Crear ADR.

RQ-ADR-003
- Descripcion: Decisiones de render modes por ruta.
- Version: v1
- Dependencias: RQ-ROUTE-003
- Fundamento: Documenta la razon de SSR/SSG/CSR.
- Criterios de aceptacion:
  - ADR con la decision de render.
- Checklist:
  - [x] Documentar en docs/adr/.

RQ-ADR-004
- Descripcion: Concurrencia de requests de detalle (limite 8).
- Version: v1
- Dependencias: RQ-DATA-006
- Fundamento: Performance y estabilidad.
- Criterios de aceptacion:
  - ADR con limite y rationale.
- Checklist:
  - [x] Documentar decision.
