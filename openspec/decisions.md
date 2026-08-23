# Decisiones de arquitectura — web (features 2026-08-22)

Formato: decisión → motivo → estado, mismo criterio que
`TekoApp-Frontend-Mobile/openspec/decisions.md`.

## Por qué existe este archivo

Nace el 2026-08-23 junto con el resto de `openspec/` en este repo, para documentar las decisiones
de diseño de las superficies de backoffice de las 6 features grandes pedidas por José el
2026-08-22. El backlog original completo vive en
`TekoApp-Frontend-Mobile/openspec/decisions.md`, sección "Backlog — features grandes pedidas
2026-08-22" — este archivo no lo copia, lo referencia.

## Solo 4 de las 6 features tienen spec de Web dedicada

**Motivo**: `work-progress-log` (bitácora de trabajo) y, según se confirme con José,
`service-contracts` (contratos) no tienen todavía un caso de uso de staff lo bastante distinto de
"ver el detalle de un servicio ya existente" como para justificar una pantalla nueva completa —
extender `src/app/admin/services` con una pestaña es más barato y consistente que una spec/feature
nueva. Ver `TekoApp-Backend/openspec/specs/work-progress-log.md` para el detalle de esta decisión
de alcance, marcada ahí como pendiente de confirmación explícita de José.

**Estado**: decidido como default razonable, no bloqueante — si José pide una superficie de staff
dedicada para bitácora o contratos, se agrega una spec nueva a esta carpeta en ese momento
(`0005-*`/`0006-*`, siguiente número disponible).

## Permisos nuevos, no genéricos

**Motivo**: cada spec de esta carpeta agrega permisos específicos (`DOCUMENT_TYPES_MANAGE`,
`PROFESSIONAL_DOCUMENTS_REVIEW`, `MATERIAL_CATALOG_MANAGE`, `AI_DISCLOSURE_AUDIT_VIEW`,
`LEGAL_CONFIG_MANAGE`, `LEGAL_CONSENT_AUDIT_VIEW`) en vez de reusar un permiso genérico de
"admin" — varias de estas operaciones (revisar antecedentes, auditar consentimiento) son
candidatas a delegarse a un rol de compliance/legal separado del rol de operación general de la
plataforma, y un permiso específico permite esa separación sin refactor futuro.

**Estado**: decidido para el diseño, no implementado — depende de que
`TekoApp-Backend/openspec/specs/` termine de definir el enum `PERMISSIONS` real antes de
replicarlo acá.

## Qué NO se decidió todavía (pendiente explícito)

- Si el panel de auditoría de consentimiento (`data-and-media-consent-admin.md`) necesita un rol
  "compliance" dedicado, separado de "admin de plataforma" — pendiente de confirmación de José
  antes de asignar los permisos nuevos a un rol existente por defecto.
