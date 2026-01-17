# Labs

RQ-LAB-001
- Descripcion: Rutas de labs por feature Angular.
- Version: v1
- Dependencias: RQ-ROUTE-002
- Fundamento: Ensenan features aisladas.
- Criterios de aceptacion:
  - Cada lab tiene ruta /labs/<feature>.
- Checklist:
  - [x] Crear estructura de labs.

RQ-LAB-002
- Descripcion: Formato estandar para cada lab: objetivo, conceptos, implementacion minima, do/dont, checklist y links.
- Version: v1
- Dependencias: RQ-DOC-002
- Fundamento: Consistencia educativa.
- Criterios de aceptacion:
  - Todos los labs siguen el formato.
- Checklist:
  - [ ] Crear plantilla de lab.

RQ-LAB-003
- Descripcion: Labs base propuestos (signals, httpResource, rxjs-interop, routing, di).
- Version: v1
- Dependencias: RQ-LAB-001
- Fundamento: Cobertura de features modernas.
- Criterios de aceptacion:
  - Labs base implementados.
- Checklist:
  - [ ] /labs/signals
  - [ ] /labs/httpresource
  - [ ] /labs/rxjs-interop
  - [ ] /labs/routing
  - [ ] /labs/di

RQ-LAB-004
- Descripcion: Labs SSR/hydration (ssr-hybrid, hydration).
- Version: v1
- Dependencias: RQ-SSR-001
- Fundamento: Explicar rendering moderno.
- Criterios de aceptacion:
  - Labs de SSR/hydration disponibles.
- Checklist:
  - [ ] /labs/ssr-hybrid
  - [ ] /labs/hydration

RQ-LAB-005
- Descripcion: Labs UI/a11y (a11y-aria, cdk).
- Version: v1
- Dependencias: RQ-UI-004, RQ-UI-005
- Fundamento: Accesibilidad y CDK.
- Criterios de aceptacion:
  - Labs de a11y y CDK disponibles.
- Checklist:
  - [ ] /labs/a11y-aria
  - [ ] /labs/cdk

RQ-LAB-006
- Descripcion: Labs adicionales (forms-signal-forms, animations, pwa, testing, performance, custom-build).
- Version: v1
- Dependencias: RQ-LAB-001
- Fundamento: Ampliar cobertura.
- Criterios de aceptacion:
  - Labs adicionales creados.
- Checklist:
  - [ ] /labs/forms-signal-forms
  - [ ] /labs/animations
  - [ ] /labs/pwa
  - [ ] /labs/testing
  - [ ] /labs/performance
  - [ ] /labs/custom-build

RQ-LAB-007
- Descripcion: Lab incremental hydration (v2).
- Version: v2
- Dependencias: RQ-SSR-003
- Fundamento: Feature avanzada.
- Criterios de aceptacion:
  - Lab incremental hydration disponible.
- Checklist:
  - [ ] /labs/incremental-hydration

RQ-LAB-008
- Descripcion: Lab zoneless.
- Version: v1
- Dependencias: RQ-SSR-005
- Fundamento: Change detection moderno.
- Criterios de aceptacion:
  - Lab zoneless disponible.
- Checklist:
  - [ ] /labs/zoneless
