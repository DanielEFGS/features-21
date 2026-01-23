# Architecture

Visión rápida de la estructura, límites y convenciones de la Pokédex educativa en Angular 21.

## Estructura por features
- `src/app/core`: providers globales, interceptores, configuración.
- `src/app/shared`: UI primitivas, pipes, directivas, utilidades.
- `src/app/data`: cliente HTTP tipado (PokéAPI), mappers DTO→dominio, caching/concurrencia.
- `src/app/features/<feature>`: páginas, componentes y estado por feature (pokedex, labs, docs).
- Tests junto al código (`*.spec.ts`), nombres kebab-case sin sufijo `component` en archivos.

## Render modes y rutas
- `/` → SSG/Prerender.
- `/pokedex`, `/pokedex/:id` → SSR + hydration.
- `/labs/**` y `/docs` → CSR (aislar experimentos y permitir fetch de markdowns).
- Evita `window/document` en rutas SSR; usa guards/`isPlatformBrowser`.

## Estado y vistas
- Standalone y `ChangeDetectionStrategy.OnPush` por defecto.
- Estado local con `signal`; derivaciones con `computed`; efectos solo para efectos secundarios.
- Control de flujo moderno `@if/@for/@switch`; sin `ngClass`/`ngStyle` (usar `class`/`style` bindings).

## Capa de datos
- Cliente tipado por endpoint; mappers DTO→dominio.
- Concurrencia limitada (8) para detalles; dedupe/cache in-memory.
- Prefetch en SSR + transferencia de estado para evitar refetch al hidratar.

## A11y/UX
- Angular Aria/CDK para foco y patrones accesibles.
- `NgOptimizedImage` en estáticos; contraste y foco visibles.
- Tailwind para utilidades; usa clases reutilizables en shared cuando crezcan las cadenas.

## Labs y docs
- Labs en CSR con demos aisladas, status (done/in-progress/planned) y ejercicios.
- Docs servidos desde `/public/docs` para previsualización en la app; ADRs documentan decisiones clave.
