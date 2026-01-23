# ADR-003 Regla de combinacion de filtros

Estado: accepted
Fecha: 2026-01-15

## Contexto
En v2 se combinan filtros de distintas familias (tipo, habilidad, etc.). Necesitamos una regla consistente, predecible y facil de explicar en el objetivo educativo.

## Decision
- OR dentro de la misma familia (ej: tipos multiple seleccion).
- AND entre familias (ej: tipo(s) AND habilidad).

## Consecuencias
- Comportamiento claro y alineado con filtros comunes en catalogos.
- Facil de documentar y testear.
- Permite extender con nuevas familias sin ambiguedad.

## Alternativas consideradas
- OR global: devuelve demasiados resultados y reduce precision.
- AND global: vuelve la UI estricta y puede vaciar resultados rapidamente.

## Notas de implementacion
- Representar listas en query params (types=a,b,c).
- Aplicar interseccion entre familias y union dentro de familia.
