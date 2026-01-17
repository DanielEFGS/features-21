# Error handling, resiliencia y seguridad

RQ-ERR-001
- Descripcion: ErrorHandler global custom con log y fallback UI.
- Version: v1
- Dependencias: none
- Fundamento: Manejo centralizado de errores.
- Criterios de aceptacion:
  - ErrorHandler captura errores no manejados.
  - Fallback UI visible.
- Checklist:
  - [ ] Implementar ErrorHandler.
  - [ ] Integrar logging basico.

RQ-ERR-002
- Descripcion: Pagina de error con retry y link a home.
- Version: v1
- Dependencias: RQ-ERR-001
- Fundamento: Recuperabilidad.
- Criterios de aceptacion:
  - UI de error permite reintentar.
- Checklist:
  - [ ] Crear pagina de error.
  - [ ] Agregar accion de retry.

RQ-ERR-003
- Descripcion: Interceptor HTTP funcional con normalizacion y tagging.
- Version: v1
- Dependencias: RQ-DATA-001
- Fundamento: Controla errores por endpoint.
- Criterios de aceptacion:
  - Errores normalizados.
  - Tags por endpoint.
- Checklist:
  - [ ] Implementar interceptor.

RQ-ERR-004
- Descripcion: Retry/backoff solo donde sea seguro.
- Version: v1
- Dependencias: RQ-ERR-003
- Fundamento: Evita efectos secundarios.
- Criterios de aceptacion:
  - Solo aplica retry en endpoints idempotentes.
- Checklist:
  - [ ] Definir politicas de retry.

RQ-SEC-001
- Descripcion: Evitar XSS (no usar innerHTML sin sanitizar).
- Version: v1
- Dependencias: none
- Fundamento: Seguridad basica.
- Criterios de aceptacion:
  - No se usa innerHTML sin sanitizar.
- Checklist:
  - [ ] Revisar templates y bindings.

RQ-SEC-002
- Descripcion: No exponer secretos en frontend.
- Version: v1
- Dependencias: none
- Fundamento: Seguridad basica.
- Criterios de aceptacion:
  - No hay claves en repo.
- Checklist:
  - [ ] Auditar variables y config.

RQ-SEC-003
- Descripcion: Documentar CSP y headers recomendados.
- Version: v1
- Dependencias: RQ-DOC-004
- Fundamento: Buenas practicas de seguridad.
- Criterios de aceptacion:
  - Docs con CSP/headers sugeridos.
- Checklist:
  - [ ] Agregar seccion en docs.
