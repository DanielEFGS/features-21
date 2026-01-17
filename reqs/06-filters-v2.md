# Filtros v2 (expansion)

RQ-FILTER-010
- Descripcion: Query params v2 para tipos multi-select: types=a,b,c.
- Version: v2
- Dependencias: RQ-ROUTE-004
- Fundamento: Representa seleccion multiple en URL.
- Criterios de aceptacion:
  - types es una lista separada por comas.
  - Permite deep-linking.
- Checklist:
  - [ ] Definir parse/serialize de types.

RQ-FILTER-011
- Descripcion: Tipos multi-select con logica OR.
- Version: v2
- Dependencias: RQ-DATA-010
- Fundamento: Requisito de negocio v2.
- Criterios de aceptacion:
  - Un pokemon califica si coincide con al menos un tipo seleccionado.
- Checklist:
  - [ ] Implementar UI multi-select accesible.
  - [ ] Implementar union de conjuntos por tipo.

RQ-FILTER-012
- Descripcion: Filtro por habilidad.
- Version: v2
- Dependencias: RQ-DATA-011
- Fundamento: Filtros avanzados para el catalogo.
- Criterios de aceptacion:
  - Permite filtrar por habilidad.
- Checklist:
  - [ ] Definir UI y query param.
  - [ ] Resolver dataset por habilidad.

RQ-FILTER-013
- Descripcion: Regla de combinacion de filtros entre familias (AND) y dentro de familia (OR).
- Version: v2
- Dependencias: RQ-ADR-001
- Fundamento: Evita ambiguedad al combinar filtros.
- Criterios de aceptacion:
  - Existe ADR con la regla definida.
  - La implementacion sigue la regla.
- Checklist:
  - [ ] Documentar ADR.
  - [ ] Implementar combinacion correcta.

RQ-FILTER-014
- Descripcion: Filtros opcionales: generacion, stats, species flags (por definir).
- Version: backlog
- Dependencias: RQ-ADR-002
- Fundamento: Extensibilidad del catalogo.
- Criterios de aceptacion:
  - Se definen reglas y endpoints por filtro.
- Checklist:
  - [ ] Definir alcance y endpoints.
  - [ ] Crear ADR si aplica.
