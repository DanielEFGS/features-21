# PWA / Service Worker

RQ-PWA-001
- Descripcion: App instalable con cache de app shell.
- Version: v1
- Dependencias: none
- Fundamento: Experiencia tipo app y offline parcial.
- Criterios de aceptacion:
  - App es instalable.
  - App shell cacheado.
- Checklist:
  - [ ] Configurar service worker.
  - [ ] Verificar manifest.

RQ-PWA-002
- Descripcion: No cachear respuestas de PokEAPI en v1.
- Version: v1
- Dependencias: RQ-PWA-001
- Fundamento: Evita datos obsoletos en v1.
- Criterios de aceptacion:
  - Configuracion SW no cachea PokEAPI.
- Checklist:
  - [ ] Excluir endpoints de PokEAPI.
  - [ ] Documentar esta regla en la seccion PWA.

RQ-PWA-003
- Descripcion: Documentar update flow del SW.
- Version: v1
- Dependencias: RQ-DOC-004
- Fundamento: UX y mantenimiento.
- Criterios de aceptacion:
  - Docs describen update flow.
- Checklist:
  - [ ] Agregar seccion en docs.
