# Spec: Configuración legal y auditoría de consentimiento (backoffice)

Backend: `TekoApp-Backend/openspec/specs/data-and-media-consent.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/data-and-media-consent.md`.
Feature 11 del backlog 2026-08-22 — extiende, en el backoffice, el mismo marco legal del backlog
2026-08-08 ítem 4.

## Objetivo

Darle a staff (perfil legal/compliance) el CRUD del catálogo versionado de documentos legales por
país y de las políticas de retención de datos, más un panel de auditoría de consentimiento —
"admins ven todo" para poder responder a un reclamo o disputa legal, mismo criterio ya aplicado a
calificaciones (backlog 2026-08-08 ítem 3).

## Alcance

**Incluye**: CRUD de `LegalDocumentVersions` (documento, país, versión, URL del contenido, fecha de
publicación), CRUD de `DataRetentionPolicies` (país, tipo de contenido, días de retención,
permite/no permite baja por el usuario, `requiresLegalHold`), panel de auditoría de `UserConsents`
y de `ContentConsentGrants`.

**No incluye**: el editor del contenido legal en sí — el `contentUrl` apunta a un documento externo
que sube/gestiona quien redacte el texto real; esta pantalla solo versiona la referencia.

## Pantallas / flujos

- `src/features/legal-document-versions/` + `src/app/admin/legal/document-versions/page.tsx` —
  CRUD estándar, form con select de tipo de documento, select opcional de país, input de versión
  (validar formato semver simple en `schemas.ts`), campo de URL del documento, date picker de
  publicación.
- `src/features/data-retention-policies/` + `src/app/admin/legal/retention-policies/page.tsx` —
  CRUD análogo: país, tipo de contenido (reusa el mismo enum que `ai-disclosures`), días de
  retención (vacío = indefinido), toggles `allowsUserDeletion`/`requiresLegalHold`.
- `src/features/consent-audit/` + `src/app/admin/legal/consent-audit/page.tsx` — dos tabs:
  - "Aceptaciones de términos" (`UserConsents`): filtrable por usuario, tipo de documento, país,
    rango de fecha — muestra fecha/IP/hash, solo lectura.
  - "Consentimiento de contenido" (`ContentConsentGrants`): filtrable por tipo de contenido,
    alcance de uso, estado (vigente/revocado) — mismo patrón de enlace a entidad que
    `ai-content-disclosure-admin.md`.

## Permisos

`LEGAL_CONFIG_MANAGE` (CRUD) y `LEGAL_CONSENT_AUDIT_VIEW` (solo lectura) — separados a propósito
(ver `openspec/decisions.md`).

## Fuera de alcance de esta spec

Redacción/validación del contenido legal real.

## Riesgos / límites explícitos

Mismo límite que el spec de backend: el contenido legal real no se redacta ni se valida acá — esta
pantalla solo gestiona el versionado técnico y la auditoría de aceptación. El panel de auditoría
expone IP y user-agent de usuarios — mismo cuidado de manejo de datos sensibles que
`professional-documents.md` (nunca loguear estos datos fuera de la request de auditoría en sí).
