# Testing

RQ-TEST-001
- Descripcion: Unit tests con Vitest.
- Version: v1
- Dependencias: RQ-TOOL-002
- Fundamento: Setup moderno y rapido.
- Criterios de aceptacion:
  - Vitest configurado.
  - Tests unitarios corren local.
- Checklist:
  - [ ] Configurar Vitest.
  - [ ] Documentar comando de tests.

RQ-TEST-002
- Descripcion: Cobertura de data layer (cliente + mappers) con mocks.
- Version: v1
- Dependencias: RQ-DATA-001, RQ-DATA-002
- Fundamento: Validar acceso a datos.
- Criterios de aceptacion:
  - Tests de mappers y cliente.
- Checklist:
  - [x] Mock de HTTP.
  - [ ] Tests de mappers.

RQ-TEST-003
- Descripcion: Cobertura de store (signals).
- Version: v1
- Dependencias: RQ-PDX-001
- Fundamento: Estado confiable.
- Criterios de aceptacion:
  - Tests de store.
- Checklist:
  - [ ] Tests de estado y selectors.

RQ-TEST-004
- Descripcion: Componentes criticos (render + interaccion).
- Version: v1
- Dependencias: RQ-UI-006
- Fundamento: Comportamiento y accesibilidad.
- Criterios de aceptacion:
  - Tests de render e interaccion.
- Checklist:
  - [x] Tests de listado.
  - [x] Tests de detalle.

RQ-TEST-010
- Descripcion: E2E con Playwright (v2).
- Version: v2
- Dependencias: RQ-TOOL-003
- Fundamento: Validar flujos end-to-end.
- Criterios de aceptacion:
  - Playwright configurado.
  - Flujos principales pasan.
- Checklist:
  - [ ] SSR/hydration smoke.
  - [ ] Filtro tipo.
  - [ ] Detalle.
