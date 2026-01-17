# Rutas y render modes

RQ-ROUTE-001
- Descripcion: Rutas del dominio pokedex: /pokedex y /pokedex/:nameOrId.
- Version: v1
- Dependencias: none
- Fundamento: Soporta listado y detalle como nucleo del dominio.
- Criterios de aceptacion:
  - /pokedex carga listado con filtros, orden y paginacion.
  - /pokedex/:nameOrId carga detalle.
- Checklist:
  - [x] Definir rutas en app.routes.ts.
  - [x] Definir paginas para listado y detalle.

RQ-ROUTE-002
- Descripcion: Ruta /labs y /labs/<feature>.
- Version: v1
- Dependencias: RQ-LAB-001
- Fundamento: Labs deben estar aislados de la app real.
- Criterios de aceptacion:
  - Existe indice /labs y rutas individuales por feature.
- Checklist:
  - [x] Crear indice /labs.
  - [x] Crear rutas /labs/<feature>.

RQ-ROUTE-003
- Descripcion: RenderMode por ruta (decidido).
- Version: v1
- Dependencias: RQ-SSR-001
- Fundamento: Optimiza rendimiento y controla SSR/CSR segun objetivo.
- Criterios de aceptacion:
  - / usa SSG.
  - /pokedex y /pokedex/:nameOrId usan SSR.
  - /labs/** usa CSR.
- Checklist:
  - [x] Configurar render modes por ruta.
  - [x] Documentar decisiones en docs/adr.

RQ-ROUTE-004
- Descripcion: URL es fuente shareable del estado de filtros y paginacion.
- Version: v1
- Dependencias: RQ-FILTER-001, RQ-PDX-001
- Fundamento: Deep-linking y SSR consistente.
- Criterios de aceptacion:
  - Query params reflejan estado actual.
  - SSR pre-renderiza en base a params.
- Checklist:
  - [x] Definir schema de query params.
  - [x] Sincronizar store <-> URL.
