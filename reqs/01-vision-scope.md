# Vision y alcance

RQ-VISION-001
- Descripcion: La app es una Pokedex educativa para explicar, desarrollar, ejemplificar y validar features de Angular v21.
- Version: v1
- Dependencias: none
- Fundamento: Define el objetivo principal del producto y el enfoque educativo.
- Criterios de aceptacion:
  - Existe documentacion que declara el objetivo educativo y el foco en features modernas.
  - El contenido y la arquitectura priorizan buenas practicas y rendimiento.
- Checklist:
  - [ ] Incluir descripcion del objetivo educativo en README y docs.
  - [ ] Mantener ejemplo de features modernas en labs y app real.

RQ-VISION-002
- Descripcion: Separar la app real (pokedex) de labs por rutas para aprendizaje y medicion.
- Version: v1
- Dependencias: RQ-ROUTE-001, RQ-LAB-001
- Fundamento: Evita contaminar el flujo real con experimentos y facilita metricas.
- Criterios de aceptacion:
  - Rutas de la app real y labs estan separadas y documentadas.
  - Los labs no afectan SSR de la app real.
- Checklist:
  - [x] Definir rutas /pokedex y /labs.
  - [ ] Documentar objetivo y limites de labs.

RQ-VISION-003
- Descripcion: UI minimalista, clara y accesible (A11y/ARIA).
- Version: v1
- Dependencias: RQ-UI-001, RQ-UI-006
- Fundamento: Facilita el aprendizaje y garantiza accesibilidad.
- Criterios de aceptacion:
  - UI cumple checklist A11y minimo y usa patrones ARIA donde aplique.
- Checklist:
  - [ ] Aplicar checklist A11y.
  - [ ] Usar patrones ARIA en componentes interactivos clave.

RQ-VISION-004
- Descripcion: Usar PokEAPI v2 como fuente de datos para listado, detalle y filtros.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: API publica con datos reales y limite de filtros server-side.
- Criterios de aceptacion:
  - Integracion a https://pokeapi.co/api/v2/ para endpoints definidos.
  - Limitaciones de filtros server-side documentadas.
- Checklist:
  - [ ] Documentar endpoints usados.
  - [ ] Manejar filtros avanzados en cliente cuando aplique.
