# Coding standards

RQ-STD-001
- Descripcion: Standalone por defecto, sin NgModules.
- Version: v1
- Dependencias: none
- Fundamento: Modern Angular.
- Criterios de aceptacion:
  - No se usan NgModules en la app.
- Checklist:
  - [ ] Verificar componentes standalone.

RQ-STD-002
- Descripcion: OnPush por defecto.
- Version: v1
- Dependencias: RQ-SSR-005
- Fundamento: Performance y predictibilidad.
- Criterios de aceptacion:
  - Componentes de app real usan OnPush.
- Checklist:
  - [ ] Configurar changeDetection OnPush.

RQ-STD-003
- Descripcion: inject() preferido y input()/output() preferidos.
- Version: v1
- Dependencias: none
- Fundamento: API moderna.
- Criterios de aceptacion:
  - Se usa inject(), input(), output() donde aplica.
- Checklist:
  - [ ] Evitar constructor injection cuando no sea necesario.

RQ-STD-004
- Descripcion: Evitar HostBinding/HostListener, usar host: {}.
- Version: v1
- Dependencias: none
- Fundamento: Consistencia.
- Criterios de aceptacion:
  - No se usa HostBinding/HostListener.
- Checklist:
  - [ ] Usar host: {} en decorador.

RQ-STD-005
- Descripcion: No usar ngClass/ngStyle, usar bindings nativos.
- Version: v1
- Dependencias: none
- Fundamento: Templates simples.
- Criterios de aceptacion:
  - No hay ngClass/ngStyle en app real.
- Checklist:
  - [ ] Reemplazar con [class.*] y [style.*].

RQ-STD-006
- Descripcion: Control flow moderno (@if/@for/@switch).
- Version: v1
- Dependencias: none
- Fundamento: Angular moderno.
- Criterios de aceptacion:
  - Templates usan nuevo control flow.
- Checklist:
  - [ ] Migrar templates a @if/@for/@switch.

RQ-STD-007
- Descripcion: Signals: usar set/update, evitar mutate.
- Version: v1
- Dependencias: none
- Fundamento: Estado predecible.
- Criterios de aceptacion:
  - No se muta estado directamente.
- Checklist:
  - [ ] Revisar mutaciones de signals.

RQ-STD-008
- Descripcion: Templates simples; logica en store/servicios.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: Separacion de responsabilidades.
- Criterios de aceptacion:
  - Templates con logica minima.
- Checklist:
  - [ ] Extraer logica a store/servicios.
