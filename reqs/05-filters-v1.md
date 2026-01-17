# Filtros v1

RQ-FILTER-001
- Descripcion: Schema de query params v1: q, type, sort, dir, page, pageSize.
- Version: v1
- Dependencias: RQ-ROUTE-004
- Fundamento: Estado shareable y SSR.
- Criterios de aceptacion:
  - URL siempre refleja estado actual.
  - Valores invalidos se normalizan.
- Checklist:
  - [x] Definir contrato de params.
  - [x] Normalizar valores en store.

RQ-FILTER-002
- Descripcion: Filtro por tipo single-select con UI accesible.
- Version: v1
- Dependencias: RQ-UI-006, RQ-DATA-005
- Fundamento: Requisito de negocio v1.
- Criterios de aceptacion:
  - Se puede seleccionar un solo tipo.
  - Teclado funciona end-to-end.
- Checklist:
  - [x] Implementar select custom con Preline HSSelect.
  - [x] Cargar tipos desde API con cache.

RQ-FILTER-003
- Descripcion: Estrategia de datos para filtro por tipo.
- Version: v1
- Dependencias: RQ-DATA-005, RQ-DATA-006
- Fundamento: PokEAPI no soporta filtros combinados server-side.
- Criterios de aceptacion:
  - Sin tipo: usa /pokemon?offset&limit.
  - Con tipo: usa /type/{typeName} y resuelve detalles de la pagina visible.
- Checklist:
  - [x] Implementar fetch de tipo.
  - [x] Resolver detalles con concurrencia limitada.

RQ-FILTER-004
- Descripcion: Orden y busqueda operan sobre conjunto filtrado.
- Version: v1
- Dependencias: RQ-PDX-004, RQ-PDX-005
- Fundamento: Coherencia de la UI.
- Criterios de aceptacion:
  - Al filtrar, ordenar y buscar no cambian el conjunto base.
- Checklist:
  - [x] Aplicar orden/busqueda sobre items filtrados.
