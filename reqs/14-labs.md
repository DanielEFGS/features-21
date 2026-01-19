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
- Descripcion: Formato estandar para cada lab: objetivo, conceptos, prerequisitos, implementacion minima, do/dont, checklist, pruebas, referencias y ejercicio practico adaptado.
- Version: v1
- Dependencias: RQ-DOC-002
- Fundamento: Consistencia educativa.
- Criterios de aceptacion:
  - Todos los labs siguen el formato.
- Checklist:
  - [ ] Crear plantilla de lab.
  - [ ] Incluir seccion de prerequisitos por lab.
  - [ ] Incluir pasos de implementacion minima por lab.
  - [ ] Incluir explicacion simplificada (no copia literal de docs).
  - [ ] Incluir ejercicio practico guiado.
  - [ ] Incluir checklist de A11y cuando aplique.
  - [ ] Incluir verificacion de SSR/hydration cuando aplique.
  - [ ] Incluir seccion de pruebas (unitarias o smoke).
  - [ ] Incluir links a docs oficiales como referencia.

RQ-LAB-003
- Descripcion: Labs base propuestos (signals, httpResource, rxjs-interop, routing, di, forms, animations, style-guide, tailwind).
- Version: v1
- Dependencias: RQ-LAB-001
- Fundamento: Cobertura de features modernas.
- Criterios de aceptacion:
  - Labs base implementados.
- Checklist:
  - [x] /labs/signals
  - [ ] /labs/httpresource
  - [ ] /labs/rxjs-interop
  - [ ] /labs/routing
  - [ ] /labs/di
  - [ ] /labs/forms
  - [ ] /labs/animations
  - [ ] /labs/style-guide
  - [ ] /labs/tailwind

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
- Descripcion: Labs adicionales (pwa, testing, performance, custom-build).
- Version: v1
- Dependencias: RQ-LAB-001
- Fundamento: Ampliar cobertura.
- Criterios de aceptacion:
  - Labs adicionales creados.
- Checklist:
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

RQ-LAB-009
- Descripcion: Indice de labs con estado, version y dificultad.
- Version: v1
- Dependencias: RQ-LAB-001, RQ-DOC-005
- Fundamento: Facilita navegacion y trazabilidad.
- Criterios de aceptacion:
  - /labs muestra lista de labs con metadata basica.
- Checklist:
  - [ ] Mostrar estado (planned/in-progress/done).
  - [ ] Mostrar version (v1/v2).
  - [ ] Mostrar dificultad (basico/intermedio/avanzado).
  - [ ] Incluir tiempo estimado.

RQ-LAB-010
- Descripcion: Cada lab tiene demo minima y se ejecuta en CSR.
- Version: v1
- Dependencias: RQ-ROUTE-003, RQ-SSR-002
- Fundamento: Aislar experimentos y evitar afectar SSR.
- Criterios de aceptacion:
  - Los labs renderizan solo en cliente.
  - Cada lab incluye una demo funcional minima.
- Checklist:
  - [ ] Configurar RenderMode CSR en rutas de labs.
  - [ ] Crear demo minima por lab (UI + estado base).

RQ-LAB-011
- Descripcion: Registro de resultados y aprendizajes por lab.
- Version: v1
- Dependencias: RQ-DOC-005
- Fundamento: Estandarizar aprendizaje y medicion.
- Criterios de aceptacion:
  - Cada lab documenta hallazgos y metricas basicas.
- Checklist:
  - [ ] Registrar hallazgos clave.
  - [ ] Registrar metricas (LCP/CLS o equivalentes cuando aplique).
