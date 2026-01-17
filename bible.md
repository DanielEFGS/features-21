# Pokédex Angular 21 – Documento de Requerimientos (Base Educativa)

**Estado:** En refinamiento iterativo (living document)  
**Objetivo:** usar esta app como base para **explicar, desarrollar, ejemplificar y validar** features actuales de **Angular v21**, enfocándonos en **uso correcto**, rendimiento y arquitectura.

---

## 1) Visión general

### 1.1 Propósito
Construir una app educativa tipo **Pokédex** (catálogo) que permita:
- Demostrar features “core” y modernos de Angular v21 (signals, httpResource, signal forms, zoneless, hydration, SSR/SSG, etc.).
- Mantener UI **minimalista, clara y accesible** (A11y/ARIA).
- Separar “app real” vs “labs” por rutas para aprendizaje, medición y documentación.

### 1.2 API
- **API pública:** PokéAPI v2 (`https://pokeapi.co/api/v2/`)
- Se usará para listado, detalle y filtros.

> Nota: PokéAPI no provee “filtros combinados” server-side tipo SQL. En filtros avanzados se compone en cliente (uniones/intersecciones) y se resuelve detalle por lotes. Esto es útil para enseñar caching, batching, dedupe y performance.

---

## 2) Decisiones confirmadas (lo definido hasta ahora)

### 2.1 Roadmap
- **v1 (MVP):**
  - Listado + detalle
  - Filtros básicos: **tipo single-select** (un tipo)
  - Ordenamiento por **id / name** con **asc/desc**
  - **SSR desde v1**
  - RenderMode por ruta (SSR/SSG/CSR) definido (ver 7.1)
  - UI: **Tailwind + Angular CDK + Angular Aria** desde v1
  - PWA: **instalable + cache app shell** (sin cachear respuestas de PokéAPI en v1)
  - **Concurrencia de requests de detalle** (cuando se resuelven múltiples Pokémon): **8 en paralelo** (configurable; ver 6.2)
  - Estrategia de imágenes: **sprite primero**, fallback a artwork (ver 8.5)
  - Rutas Labs por feature Angular

- **v2 (expansión):**
  - Tipos **multi-select** con lógica **OR**
  - Filtros avanzados: habilidad (y opcional generación / stats)
  - Labs avanzados (incremental hydration, etc.)
  - E2E + perf report

### 2.2 Regla de negocio de filtros
- **v1:** tipo = single-select
- **v2:** tipos = multi-select con **OR**  
  (un Pokémon califica si coincide con **al menos uno** de los tipos seleccionados)

---

## 3) Alcance funcional – Dominio “Pokédex”

### 3.1 Rutas del dominio (App real)
- `/pokedex` → listado + filtros + orden + paginación
- `/pokedex/:nameOrId` → detalle

### 3.2 Listado (v1)
**Funcionalidades:**
- Grilla (cards) o lista minimalista con:
  - Nombre
  - Imagen (sprite/artwork)
  - Tipos (chips)
- Paginación (limit/offset)
- Estados: loading (skeleton), empty, error (recoverable)
- Búsqueda por nombre (texto) sobre el set actual
- Orden:
  - `sort`: `id | name`
  - `dir`: `asc | desc`

**Criterios de aceptación:**
- Cambiar orden/búsqueda no rompe SSR/hydration.
- Cambiar filtro resetea paginación a página 1.
- El estado se refleja en URL (query params) para deep-linking.

### 3.3 Filtro por tipo (v1: single-select)
**UI:**
- Single select accesible (combobox/listbox con Angular Aria + utilidades CDK de foco cuando aplique).
- Tipos se cargan desde API y se cachean.

**Data strategy (v1):**
- Sin tipo: origen = `/pokemon?offset&limit`
- Con tipo: origen = `/type/{typeName}` → lista de Pokémon  
  Luego: resolver detalle solo de la “página visible” (`/pokemon/{name}` en paralelo, con límite de concurrencia; ver 6.2).

**Criterios de aceptación:**
- Con tipo activo, lista contiene solo Pokémon del tipo.
- Orden y búsqueda operan sobre el conjunto filtrado.

### 3.4 Detalle (v1)
**Contenido:**
- Header: nombre + id
- Imágenes: sprite y/o artwork (ver 8.5)
- Tipos, habilidades, stats base
- Secciones colapsables (para mostrar control flow/performance)

**Criterios de aceptación:**
- Permite deep-link directo a un Pokémon.
- SSR entrega HTML inicial con contenido principal.
- Hydration sin mismatches perceptibles.

### 3.5 Filtros avanzados (v2)
- Tipos multi-select OR
- Habilidad (v2)
- (Opcional) generación / stats / species flags

**Reglas por definir cuando se combinen filtros distintos:**
- ¿Tipo OR con habilidad AND? (recomendación: AND entre “familias” de filtros, OR dentro de la misma familia)  
  → documentar ADR.

---

## 4) Navegación, URL y estado

### 4.1 Query params (shareable state)
**v1:**
`/pokedex?q=pika&type=electric&sort=name&dir=asc&page=1&pageSize=24`

**v2:**
`/pokedex?q=pika&types=electric,steel&sort=id&dir=desc&page=1&pageSize=24`

**Reglas:**
- URL es la fuente “shareable” del estado.
- Store sincroniza URL ↔ state.
- SSR puede pre-renderizar usando esos params.

### 4.2 Rutas “Labs”
- `/labs` → índice de labs y guía
- `/labs/<feature>` → lab individual (una feature a la vez)

---

## 5) Arquitectura (alto nivel)

### 5.1 Principios
- Standalone por defecto (sin NgModules)
- Componentes pequeños, una responsabilidad
- Estado UI local: **signals**
- Acceso a datos: capa `data/` con cliente typed, mappers y caching
- Templates simples (lógica en store/servicios)
- Performance-first: OnPush, zoneless (lab + objetivo), SSR/hydration

### 5.2 Estructura de carpetas (propuesta)

### 5.2.1 Patron de componentes (style guide)
- Cada componente vive en su propia carpeta con el mismo nombre (kebab-case).
- Archivos del componente comparten nombre base: <nombre>.ts, <nombre>.html, <nombre>.css.
- No usar sufijo "component" en el nombre de archivo.
- Tests viven junto al componente: <nombre>.spec.ts.```
src/
  app/
    core/                 # providers globales, interceptors, error handling, config
    shared/               # UI primitives, pipes, directives, utilidades
    data/
      poke-api/           # cliente HTTP, DTOs, mappers
      caching/            # cache, dedupe, request queue
    features/
      pokedex/
        pages/
        components/
        state/            # store (signals)
        services/         # orquestación (facade)
        routes.ts
      labs/
        pages/
        labs/             # un lab por feature
        routes.ts
    app.routes.ts
    app.config.ts
    app.config.server.ts
```

### 5.3 Patrones sugeridos (educativos)
- Store/Facade por feature (signals)
- Repository/DataSource en `data/`
- Adapter/Mapper DTO → domain model
- ADR-lite en `docs/adr/` para decisiones importantes

---


## 5.4 Reglas de desarrollo (proceso y estandarizacion)
- Arquitectura por feature: separar core/shared/data/features, evitar carpetas por tipo.
- Standalone por defecto; OnPush por defecto en app real.
- Estado UI local con signals; templates simples; logica en stores/servicios.
- Control flow moderno (@if/@for/@switch); evitar ngClass/ngStyle.
- Data layer typed con DTOs + mappers; cache/dedupe; concurrencia limitada y configurable.
- SSR desde v1; hydration activa; evitar window/document en rutas SSR.
- RenderMode por ruta; labs aislados en CSR.
- A11y obligatorio: teclado end-to-end, focus visible, labels, landmarks, contraste.
- Error handling: ErrorHandler global + interceptor funcional; retry solo en endpoints idempotentes.
- Testing: unit tests para data/store/componentes criticos; comandos documentados.
- Docs: README, arquitectura, labs, SSR/hydration, zoneless, performance, ADRs.
- PWA: app shell cache; no cachear PokEAPI en v1; documentar update flow.
## 6) Capa de datos (PokéAPI) – estrategia

### 6.1 Cliente typed
`PokeApiClient`:
- Métodos typed por endpoint (pokemon, type, ability, etc.)
- Mappers DTO → Domain
- Normalización de errores
- Caching de catálogos (tipos) y recursos

### 6.2 ¿Qué significa “concurrencia” aquí? (y por qué importa)
Cuando filtras por tipo (o en v2 por varios filtros), la API te devuelve **una lista de nombres** y para mostrar cards bonitas necesitas el **detalle** de cada Pokémon (`/pokemon/{name}`).

Si en una página muestras, por ejemplo, 24 cards, podrías disparar **24 requests** de detalle.

**Concurrencia** = cuántas requests de detalle permites **en paralelo** al mismo tiempo.

- Si disparas 24 en paralelo: puede ser más rápido en redes buenas, pero también:
  - saturas el navegador (y la red)
  - te expones a errores intermitentes (timeouts)
  - complicas el SSR (más trabajo simultáneo)
- Si limitas (por ejemplo a 8): haces “lotes”:
  - 8 requests en paralelo
  - cuando termina una, entra otra
  - resultado: más estable y predecible (y es un buen lab de performance)

**Decisión confirmada (v1):** límite de concurrencia por defecto **8**, configurable (para experimentar en labs).

> Implementación recomendada (a nivel de idea): una “request queue” en `data/caching/` o usar RxJS (`mergeMap` con `concurrent=8`) en un servicio que arma los detalles del listado.

### 6.3 Caching, dedupe y batching
- Cache in-memory por:
  - detalle Pokémon por `nameOrId`
  - lista de tipos
  - lista de Pokémon por tipo (v1) / por tipos (v2)
- Concurrencia:
  - resolver detalle en paralelo con límite **8** (default)
- Dedupe:
  - si un request está en vuelo o en cache, no repetirlo

### 6.4 SSR + transferencia de estado
- Prefetch de listado/detalle inicial durante SSR
- Reusar data en el cliente (evitar refetch inmediato)
- Prohibido depender de `window/document` en paths SSR

---

## 7) SSR / SSG / Hydration / Zoneless (definición v1)

### 7.1 RenderMode por ruta (decisión confirmada)
- `/` (Home) → **SSG / Prerender**
- `/pokedex` → **SSR / Server**
- `/pokedex/:nameOrId` → **SSR / Server**
- `/labs/**` → **CSR / Client** (por simplicidad y para que los labs experimentales no afecten SSR)

> Si más adelante agregamos `/docs`, puede ser SSG o SSR según conveniencia.

### 7.2 SSR desde v1
- El proyecto se crea/activa con SSR:
  - `ng new --ssr` o `ng add @angular/ssr`
- README incluirá scripts exactos para:
  - dev server local
  - build + run SSR “prod-like” (opcional)

### 7.3 Local dev (requerimiento)
- Debe poder correrse 100% local:
  - instalar dependencias
  - comando dev
  - comando “prod-like SSR” (opcional)

### 7.4 Hydration
- Activar hydration y documentar:
  - SSR con hydration vs sin hydration
  - errores típicos de mismatch y cómo evitarlos

### 7.5 Zoneless
- Objetivo: tener modo zoneless (como mínimo en lab) usando `provideZonelessChangeDetection()`
- Documentar:
  - cuándo conviene
  - pitfalls con libs externas/eventos
  - estrategias: señales, async pipe, callbacks controlados

---

## 8) UI/UX, estilos y accesibilidad

### 8.1 UI minimalista
- Header con navegación: Home / Pokédex / Labs / Docs
- Layout centrado (max width), spacing consistente
- Skeletons en listado/detalle

### 8.2 Tailwind
- Tailwind como base
- Convención:
  - “primitives” en `shared/ui`
  - componentes de página en `features/*/pages`
  - evitar templates con “mega-strings” de clases: factorizar

### 8.3 Angular CDK + Angular Aria (desde v1)
- CDK: overlays, focus management, a11y helpers (cuando aplique)
- Angular Aria:
  - combobox/listbox accesible para filtro tipo (v1)
  - patterns para tabs/disclosure en detalle
- Requisito: teclado end-to-end (sin mouse)

### 8.4 Checklist A11y mínimo (v1)
- navegación por teclado
- focus visible
- labels accesibles
- landmarks correctos
- contraste y estados “disabled” claros

### 8.5 Estrategia de imágenes (decisión confirmada)
- **Prioridad 1:** sprite (`sprites.front_default` o similar)
- **Fallback:** artwork oficial (si el sprite falta)
- Requisitos:
  - placeholder/skeleton mientras carga
  - alt text significativo (nombre del Pokémon)
  - evitar layout shift (tamaño reservado)

---

## 9) Error handling, resiliencia y seguridad (educativo)

### 9.1 Errores globales
- ErrorHandler custom (log + fallback UI)
- Página de error con retry y link a home

### 9.2 Errores HTTP
- Interceptor funcional:
  - normalización
  - tagging por endpoint
  - retry/backoff solo donde sea seguro

### 9.3 Seguridad
- Evitar XSS: nada de `innerHTML` “a pelo”
- No exponer secretos en frontend
- Documentar CSP y headers recomendados (aunque no se aplique en local)

---

## 10) Testing

### 10.1 Unit tests (v1)
- Runner: Vitest (setup moderno)
- Cobertura:
  - data layer (cliente + mappers) con mocks
  - store (signals)
  - componentes críticos (render + interacción)

### 10.2 E2E (v2)
- Playwright (recomendado)
- Flujos:
  - SSR/hydration smoke
  - filtro tipo
  - detalle

---

## 11) PWA / Service Worker (v1)
- Objetivo v1: instalable + cache app shell
- No cachear respuestas de PokéAPI (v1)
- Documentar update flow del SW

---

## 12) Tooling / build / CI

### 12.1 Build system
- CLI moderno (Vite dev server / builder integrado)

### 12.2 Quality gates
- ESLint + Prettier
- Reglas:
  - evitar any (preferir unknown)
  - no `ngClass`/`ngStyle` (usar bindings nativos)
  - usar `@if/@for/@switch`
  - OnPush por defecto en app real

### 12.3 CI (propuesto)
- lint
- unit tests
- build
- (v2 opcional) Lighthouse CI

---

## 13) Labs (rutas por feature Angular)

> Formato estándar de cada lab:
> - Objetivo
> - Conceptos
> - Implementación mínima
> - “Do / Don’t”
> - Checklist + métricas
> - Links a docs oficiales

### 13.1 Índice de labs (propuesto)
- `/labs/signals` (signal/computed/effect, patterns de store)
- `/labs/httpresource` (httpResource + estados + caching)
- `/labs/rxjs-interop` (toSignal, toObservable, cancelación)
- `/labs/routing` (lazy loading, guards, resolvers, providers por ruta)
- `/labs/di` (inject, tokens, scopes, providers por ruta)
- `/labs/ssr-hybrid` (RenderMode, server routes)
- `/labs/hydration` (hydration, state transfer, pitfalls)
- `/labs/incremental-hydration` (v2)
- `/labs/zoneless` (provideZonelessChangeDetection + pitfalls)
- `/labs/forms-signal-forms` (Signal Forms + validaciones)
- `/labs/animations` (microinteracciones)
- `/labs/a11y-aria` (Angular Aria + checklist)
- `/labs/cdk` (overlay, focus, a11y utilities)
- `/labs/pwa` (app shell, update flow, estrategia)
- `/labs/custom-build` (custom pipeline y tradeoffs)
- `/labs/testing` (vitest patterns, SSR testing, mocking httpResource)
- `/labs/performance` (OnPush, defer views, imágenes, budgets)

---

## 14) Documentación (modo educativo)

### 14.1 Documentos obligatorios
- README.md (cómo correr, scripts, overview)
- docs/architecture.md
- docs/labs/<feature>.md
- docs/ssr-hydration.md
- docs/zoneless.md
- docs/performance.md
- docs/adr/* (decisiones)

### 14.2 agenda.md (MCP + rutina)
- Objetivo de iteración
- Checklist de labs/features
- Métricas a registrar
- Definition of Done por lab

### 14.3 AI / MCP
- Documentar setup Angular CLI MCP (si se usa)
- Archivo guía para asistentes: AGENTS.md o ai.md

---

## 15) Coding standards (reglas del repo)
- Standalone (sin NgModules)
- OnPush por defecto
- inject() preferido
- input()/output() preferidos
- evitar HostBinding/HostListener (usar `host: {}` en el decorator)
- no ngClass/ngStyle
- control flow moderno (@if/@for/@switch)
- signals: set/update (evitar mutate)
- templates simples; lógica en store/servicios

---

## 16) Entregables

### 16.1 Entregable v1 (MVP)
- SSR habilitado, corre local
- `/pokedex` y `/pokedex/:id`
- filtro tipo single
- orden id/name asc/desc
- Tailwind + CDK + Aria mínimo
- PWA instalable (app shell)
- labs base (mínimos viables)

### 16.2 Entregable v2
- tipos multi-select (OR)
- filtro habilidad
- labs avanzados (incremental hydration, a11y avanzada con Angular Aria)
- E2E + perf report

---

## 17) Backlog / próximos temas a definir (para máximo provecho)

2) Política de cache (TTL por resource: detalle vs catálogos).  
3) Métricas educativas: budgets (LCP/CLS/TTI) y dónde registrarlas.  
4) Animaciones: ¿route transitions sí/no?  
5) Plantilla exacta de labs (estructura fija).  
6) i18n: ¿UI/Docs solo español o bilingüe?

---

## 18) Referencias útiles
- Angular SSR / hybrid rendering: https://angular.dev/guide/ssr
- Hydration: https://angular.dev/guide/hydration
- Zoneless: https://angular.dev/guide/zoneless
- httpResource: https://angular.dev/api/common/http/httpResource
- Angular Aria: https://angular.dev/guide/aria/overview
- Angular CLI ng serve: https://angular.dev/cli/serve
- PokéAPI docs: https://pokeapi.co/docs/v2

