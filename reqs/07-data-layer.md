# Data layer y PokEAPI

RQ-DATA-001
- Descripcion: Cliente typed PokeApiClient con metodos por endpoint.
- Version: v1
- Dependencias: none
- Fundamento: Acceso a datos consistente y tipado.
- Criterios de aceptacion:
  - Metodos typed para pokemon, type, ability, etc.
  - Normaliza errores.
- Checklist:
  - [x] Definir DTOs y modelos de dominio.
  - [x] Implementar cliente con metodos typed.

RQ-DATA-002
- Descripcion: Mapper DTO -> domain y adapters.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: Separa API externa del modelo interno.
- Criterios de aceptacion:
  - Mappers cubren endpoints usados.
- Checklist:
  - [x] Crear mappers por entidad.

RQ-DATA-003
- Descripcion: Paginacion basada en limit/offset y resolucion de listado.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: Controla volumen y performance.
- Criterios de aceptacion:
  - /pokemon?offset&limit soportado.
- Checklist:
  - [x] Implementar fetch de listado base.

RQ-DATA-004
- Descripcion: Detalle por nameOrId con cache y dedupe.
- Version: v1
- Dependencias: RQ-DATA-006
- Fundamento: Evita requests repetidos.
- Criterios de aceptacion:
  - Si el detalle esta en cache o en vuelo, no se repite.
- Checklist:
  - [x] Implementar cache in-memory por nameOrId.
  - [x] Implementar dedupe de requests en vuelo.

RQ-DATA-005
- Descripcion: Cache para catalogos (tipos) y lista por tipo.
- Version: v1
- Dependencias: RQ-DATA-006
- Fundamento: Reduce latencia y calls.
- Criterios de aceptacion:
  - Tipos se cachean en memoria.
  - Lista de pokemon por tipo se cachea.
- Checklist:
  - [x] Cache de tipos.
  - [x] Cache de lista por tipo.

RQ-DATA-006
- Descripcion: Concurrencia limitada para detalles en listado.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: Estabilidad, SSR controlado.
- Criterios de aceptacion:
  - Limite default 8, configurable.
  - Procesa en lotes.
- Checklist:
  - [x] Implementar queue o mergeMap con concurrencia 8.
  - [x] Exponer configuracion.

RQ-DATA-007
- Descripcion: Dedupe de requests en vuelo.
- Version: v1
- Dependencias: RQ-DATA-006
- Fundamento: Evita trabajo duplicado.
- Criterios de aceptacion:
  - Mismo request no se ejecuta en paralelo.
- Checklist:
  - [x] Reusar promesas/observables en vuelo.

RQ-DATA-008
- Descripcion: Caching in-memory por recursos clave.
- Version: v1
- Dependencias: RQ-DATA-004, RQ-DATA-005
- Fundamento: Performance y experiencia consistente.
- Criterios de aceptacion:
  - Estrategia de cache documentada.
- Checklist:
  - [x] Documentar politica de cache.
  - Notas:
    - Pokemon detail: cache in-memory por nameOrId (TTL 1h), dedupe en vuelo.
    - Types: cache in-memory (TTL 24h), dedupe en vuelo.
    - Pokemon list by type: cache in-memory (TTL 15m), dedupe en vuelo.
    - Evitar cache persistente en v1 (no SW para API).

RQ-DATA-009
- Descripcion: SSR state transfer y reuso de data en cliente.
- Version: v1
- Dependencias: RQ-SSR-002
- Fundamento: Evita refetch inmediato tras hydration.
- Criterios de aceptacion:
  - Data prefetched en SSR se reutiliza.
- Checklist:
  - [x] Implementar transferencia de estado.
  - [x] Evitar acceso a window/document en SSR.

RQ-DATA-010
- Descripcion: Dataset para tipos multi-select OR.
- Version: v2
- Dependencias: RQ-FILTER-011
- Fundamento: Requisito v2 de combinacion.
- Criterios de aceptacion:
  - Se unen listas por tipo y se dedupe.
- Checklist:
  - [ ] Implementar union de listas.
  - [ ] Aplicar dedupe.

RQ-DATA-011
- Descripcion: Dataset para filtro por habilidad.
- Version: v2
- Dependencias: RQ-FILTER-012
- Fundamento: Filtro avanzado.
- Criterios de aceptacion:
  - Endpoint de habilidad resuelto y mapeado.
- Checklist:
  - [ ] Implementar fetch por habilidad.
  - [ ] Integrar con combinacion de filtros.
