# ADR-002 Concurrencia de requests de detalle

Estado: accepted
Fecha: 2026-01-15

## Contexto
En listado por tipo, la API devuelve solo nombres y necesitamos traer detalles para cada card. Disparar todas las requests en paralelo puede saturar red y servidor, empeorar SSR y aumentar fallos intermitentes.

## Decision
Limitar la concurrencia de requests de detalle a 8 por defecto, con configuracion editable para labs.

## Consecuencias
- Mejor estabilidad en redes reales.
- SSR mas predecible y con menor carga concurrente.
- Posible mayor tiempo total en redes muy rapidas, a cambio de menor error rate.

## Alternativas consideradas
- Sin limite: maximiza velocidad en condiciones ideales, pero aumenta errores y costo.
- Limite muy bajo (2-4): mas estable, pero penaliza UX en cliente.

## Notas de implementacion
- Usar una request queue o RxJS mergeMap con concurrency=8.
- Asegurar dedupe de requests en vuelo y cache in-memory.
