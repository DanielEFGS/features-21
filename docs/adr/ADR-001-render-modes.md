# ADR-001 Render modes por ruta

Estado: accepted
Fecha: 2026-01-15

## Contexto
La app tiene dos objetivos principales: una Pokedex funcional y una seccion de labs educativos. Necesitamos balancear rendimiento, SEO y simplicidad de operacion, evitando que los labs afecten la estabilidad de SSR.

## Decision
- / (Home) usa SSG (prerender).
- /pokedex y /pokedex/:nameOrId usan SSR.
- /labs/** usa CSR.

## Consecuencias
- Home carga rapido y con bajo costo de servidor.
- Pokedex entrega HTML inicial consistente para SEO y UX, y habilita hydration.
- Labs no impactan SSR y pueden experimentar libremente sin riesgo para rutas criticas.

## Alternativas consideradas
- SSR en todas las rutas: mayor costo y riesgo de errores por labs.
- CSR en /pokedex: menor SEO y peor percepcion de carga inicial.

## Notas de implementacion
- Definir render mode por ruta en configuracion de Angular SSR.
- Documentar la decision en docs/ssr-hydration.md.
