# Zoneless

Resumen práctico para usar `provideZonelessChangeDetection()` en Angular 21.

## Cuándo activarlo
- Apps centradas en signals/async pipe con pocas dependencias a Zone.js.
- Rutas específicas que necesitan eliminar overhead de zonas (laboratorios, vistas críticas de rendimiento).
- Evítalo si dependes de librerías que asumen Zone.js (escucha de eventos globales, patching de timers).

## Pasos de migración
1) Activa `provideZonelessChangeDetection()` en bootstrap (o por ruta si es aplicable).
2) Reemplaza cualquier dependencia de `NgZone`/`zone.run` por signals/async pipe.
3) Asegura que los efectos secundarios se disparen con `effect()` o handlers explícitos, no por cambio imperativo de zona.
4) Maneja DOM/browsers APIs con guards (`typeof window !== 'undefined'`).

## Patrones recomendados
- Estado: `signal`, `computed`, `effect` (sin `mutate`).
- Plantillas: `@if/@for` + `async` pipe; evita lógica inline.
- Eventos externos: usa APIs explícitas (addEventListener/removeEventListener) y desuscribe en destroy.
- Animaciones: respeta `prefers-reduced-motion`; no dependas de microtasks de zona.

## Pitfalls comunes
- Librerías que esperan Zone.js (algunos wrappers de terceros); valida antes de activar.
- Timers o promesas que no disparan detección: usa signals o llama a `markDirty` solo si es imprescindible (evita abusar).
- Código SSR que accede a `document/window`: protege con guards.

## Testing
- Unit: sigue igual usando TestBed; evita mocks de Zone.js.
- SSR: smoke render para asegurar que no haya accesos a DOM sin guardas.
- Perf: compara perfiles antes/después (LCP/TTI) y confirma que la UX sigue respondiendo igual o mejor.
