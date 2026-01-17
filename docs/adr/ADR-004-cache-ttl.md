# ADR-004 Politica de cache TTL

Estado: accepted
Fecha: 2026-01-15

## Contexto
La app requiere cache in-memory para mejorar performance, pero necesita una politica de expiracion para evitar datos obsoletos y crecimiento indefinido de memoria.

## Decision
Aplicar TTL diferenciado por tipo de recurso:
- Catalogos estables (types, abilities): TTL largo (24h).
- Detalle de pokemon: TTL medio (1h).
- Listas por tipo o filtro: TTL corto (10-15 min).

## Consecuencias
- Reduce llamadas repetidas sin arriesgar datos demasiado desactualizados.
- Mantiene memoria acotada.
- Facil de explicar y ajustar en labs.

## Alternativas consideradas
- Sin TTL: riesgo de datos obsoletos y memoria creciente.
- TTL unico corto: mejora frescura pero reduce beneficio de cache.

## Notas de implementacion
- Guardar timestamp por entrada y validar expiracion al leer.
- Permitir override de TTL en labs para experimentar.
