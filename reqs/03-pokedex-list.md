# Pokedex listado (v1)

RQ-PDX-001
- Descripcion: Listado con cards o lista minimalista que muestre nombre, imagen y tipos.
- Version: v1
- Dependencias: RQ-DATA-002, RQ-UI-001
- Fundamento: Elementos basicos para explorar el catalogo.
- Criterios de aceptacion:
  - Cada item muestra nombre, imagen y chips de tipo.
  - Se respeta la estrategia de imagenes.
- Checklist:
  - [x] Definir card/lista en shared/ui o feature.
  - [x] Renderizar chips de tipo.
  - [x] Aplicar placeholders de imagen.

RQ-PDX-002
- Descripcion: Paginacion basada en limit/offset.
- Version: v1
- Dependencias: RQ-FILTER-001, RQ-DATA-003
- Fundamento: Controla volumen de requests y mejora UX.
- Criterios de aceptacion:
  - Cambiar pagina actualiza listado.
  - Cambio de filtros resetea a pagina 1.
- Checklist:
  - [x] Implementar componente de paginacion.
  - [x] Sincronizar paginacion con URL.

RQ-PDX-003
- Descripcion: Estados de listado: loading (skeleton), empty, error recoverable.
- Version: v1
- Dependencias: RQ-ERR-002, RQ-UI-002
- Fundamento: UX clara ante latencia o fallos.
- Criterios de aceptacion:
  - Se muestra skeleton en carga.
  - Se muestra empty state cuando no hay resultados.
  - Errores permiten retry.
- Checklist:
  - [x] Agregar estados visuales.
  - [x] Implementar retry desde UI.

RQ-PDX-004
- Descripcion: Busqueda por nombre sobre el set actual.
- Version: v1
- Dependencias: RQ-FILTER-001
- Fundamento: Permite encontrar items en el conjunto filtrado.
- Criterios de aceptacion:
  - El filtro de texto aplica sobre el conjunto actual.
  - Se refleja en query param q.
- Checklist:
  - [x] Agregar input de busqueda.
  - [x] Sincronizar q en URL.

RQ-PDX-005
- Descripcion: Ordenamiento por id o name con asc/desc.
- Version: v1
- Dependencias: RQ-FILTER-001
- Fundamento: Permite explorar por distintos criterios.
- Criterios de aceptacion:
  - sort=id|name y dir=asc|desc en URL.
  - Orden no rompe SSR/hydration.
- Checklist:
  - [x] Agregar control de orden.
  - [x] Aplicar orden sobre conjunto filtrado.

RQ-PDX-006
- Descripcion: El estado se refleja en URL para deep-linking.
- Version: v1
- Dependencias: RQ-ROUTE-004
- Fundamento: Permite compartir resultados y SSR consistente.
- Criterios de aceptacion:
  - URL siempre representa estado del listado.
- Checklist:
  - [x] Persistir estado en query params.
