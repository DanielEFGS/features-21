# Performance

Guía breve de rendimiento para la Pokédex educativa.

## Budgets sugeridos
- LCP < 2.5s (desktop) / < 3.5s (mobile emulada).
- CLS < 0.1 con tamaños reservados en imágenes.
- TTI < 4s en dev server (referencia) y mejor en build prod.

## Render y carga
- Rutas `/pokedex`/`detail` en SSR + hydration; labs/docs en CSR.
- Usa lazy loading en feature routes y módulos de datos pesados.
- Aplica deferrable views para contenido no crítico (ej.: secciones colapsables).

## Datos y red
- Limita concurrencia a 8 para detalles; dedupe/caching in-memory.
- Evita cachear respuestas de la API en el SW (solo app shell).
- Usa `httpResource` o señales + abortController para peticiones cancelables.

## Imágenes
- Estrategia: sprite primero, fallback a artwork si falta.
- Usa `NgOptimizedImage` en estáticos; define ancho/alto para evitar layout shift.
- Evita bases64 inline; mantén rutas accesibles y con alt significativo.

## UI y estilos
- `ChangeDetectionStrategy.OnPush` en todas las vistas.
- Control de flujo `@if/@for`, sin `ngClass`/`ngStyle` (usa bindings directos).
- Tailwind para utilidades; factoriza cadenas largas en helpers compartidos.

## Medición y pruebas
- Perfil rápido: Lighthouse o Web Vitals en dev prod-like.
- Smoke SSR para detectar mismatches de hydration.
- Observa warning de reflows en devtools (Performance/Rendering).
