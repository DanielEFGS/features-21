# Pokedex detalle (v1)

RQ-PDX-010
- Descripcion: Detalle muestra nombre, id, imagenes, tipos, habilidades y stats base.
- Version: v1
- Dependencias: RQ-DATA-004, RQ-UI-001
- Fundamento: Vista completa del pokemon.
- Criterios de aceptacion:
  - Secciones de datos presentes y legibles.
  - Usa estrategia de imagenes definida.
- Checklist:
  - [x] Renderizar header con nombre e id.
  - [x] Renderizar tipos, habilidades y stats.
  - [x] Integrar imagen sprite y fallback.

RQ-PDX-011
- Descripcion: Secciones colapsables para mostrar control flow/performance.
- Version: v1
- Dependencias: RQ-UI-004
- Fundamento: Permite explicar control flow moderno y optimizacion.
- Criterios de aceptacion:
  - Secciones expanden/colapsan con accesibilidad.
- Checklist:
  - [ ] Implementar disclosure accesible.
  - [ ] Documentar uso de @if/@for.

RQ-PDX-012
- Descripcion: Deep-link directo a un pokemon.
- Version: v1
- Dependencias: RQ-ROUTE-001
- Fundamento: Navegacion directa por URL.
- Criterios de aceptacion:
  - /pokedex/:nameOrId funciona con id o nombre.
- Checklist:
  - [x] Resolver parametros por id o nombre.

RQ-PDX-013
- Descripcion: SSR entrega HTML inicial con contenido principal y sin mismatches notorios.
- Version: v1
- Dependencias: RQ-SSR-001, RQ-SSR-003
- Fundamento: UX rapida y consistente.
- Criterios de aceptacion:
  - SSR renderiza contenido principal.
  - Hydration sin errores visibles.
- Checklist:
  - [ ] Prefetch de detalle en SSR.
  - [ ] Evitar acceso a window/document en SSR.
