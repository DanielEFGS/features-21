# SSR, SSG, hydration, zoneless

RQ-SSR-001
- Descripcion: SSR habilitado desde v1.
- Version: v1
- Dependencias: none
- Fundamento: Render inicial rapido y SEO.
- Criterios de aceptacion:
  - Proyecto configurado con SSR.
  - Build SSR funciona.
- Checklist:
  - [ ] Configurar SSR (ng new --ssr o ng add @angular/ssr).
  - [ ] Documentar scripts de build/run.

RQ-SSR-002
- Descripcion: RenderMode por ruta (SSG/SSR/CSR).
- Version: v1
- Dependencias: RQ-ROUTE-003
- Fundamento: Ajusta estrategia segun objetivo.
- Criterios de aceptacion:
  - / SSG, /pokedex SSR, /labs CSR.
- Checklist:
  - [x] Configurar render modes por ruta.

RQ-SSR-003
- Descripcion: Hydration activado y documentado.
- Version: v1
- Dependencias: RQ-SSR-001
- Fundamento: Reutiliza HTML y evita rerender completo.
- Criterios de aceptacion:
  - Hydration activo.
  - Documentacion de pitfalls.
- Checklist:
  - [x] Activar hydration.
  - [ ] Documentar SSR con y sin hydration.

RQ-SSR-004
- Descripcion: Local dev 100% funcional con SSR.
- Version: v1
- Dependencias: RQ-SSR-001
- Fundamento: Facilita desarrollo local.
- Criterios de aceptacion:
  - Se puede instalar deps y correr dev.
  - Existe comando prod-like SSR (opcional).
- Checklist:
  - [ ] Documentar comandos en README.

RQ-SSR-005
- Descripcion: Zoneless como objetivo (al menos en lab).
- Version: v1
- Dependencias: RQ-LAB-009
- Fundamento: Performance y educacion en change detection.
- Criterios de aceptacion:
  - Existe lab con provideZonelessChangeDetection().
  - Documentacion de pitfalls.
- Checklist:
  - [ ] Crear lab zoneless.
  - [ ] Documentar estrategias con signals y async pipe.
