# Spec: Verificación de documentos y antecedentes del profesional (backoffice)

Backend: `TekoApp-Backend/openspec/specs/professional-documents.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/professional-documents.md`.
Feature 6 del backlog 2026-08-22 (`TekoApp-Frontend-Mobile/openspec/decisions.md`).

## Objetivo

Darle a staff dos superficies: (1) un catálogo de tipos de documento parametrizable por país y
categoría, y (2) una cola de revisión para aprobar/rechazar documentos cargados por profesionales
(antecedentes, títulos, certificados, portafolio).

## Alcance

**Incluye**: CRUD del catálogo `DocumentTypes` (país, categoría de servicio, obligatorio/opcional,
vigencia), cola de revisión con filtros (por país, categoría, estado, tipo), detalle de revisión
(ver el archivo vía URL presignada, aprobar/rechazar con motivo obligatorio), vista de historial
completo por profesional (incluye `REJECTED`/`EXPIRED`, no solo lo vigente).

**No incluye**: verificación automática contra un organismo oficial — la aprobación es siempre una
decisión manual de staff.

## Modelo de dominio consumido

`DocumentTypes`, `ProfessionalDocuments` — ver `TekoApp-Backend/openspec/specs/professional-documents.md`
para el detalle completo de campos.

## Pantallas / flujos

- `src/features/document-types/` + `src/app/admin/document-types/page.tsx` — generado con
  `pnpm generate:feature document-type document-types --paginated`, adaptado: form con select de
  país, select de categoría, toggles `isRequired`/`requiresStaffReview`/`isVisibleToClient`, input
  numérico `validityDays` (vacío = sin vencimiento).
- `src/features/professional-documents/` — vista de cola:
  - `PendingDocumentsTable` — listado paginado, filtros por categoría de documento
    (`BACKGROUND_CHECK`/`QUALIFICATION`/`PORTFOLIO`), país, estado.
  - `DocumentReviewDialog` — imagen/PDF vía URL presignada, datos del profesional, botones
    "Aprobar"/"Rechazar" (rechazar abre un textarea obligatorio, `react-hook-form` + `zod`).
  - `ProfessionalDocumentsHistoryTab` — pestaña nueva dentro del detalle de profesional ya
    existente (`src/app/admin/professionals`).

## Permisos

`DOCUMENT_TYPES_MANAGE` (catálogo) y `PROFESSIONAL_DOCUMENTS_REVIEW` (cola de revisión) — no
reusar un permiso genérico de "profesionales" (ver `openspec/decisions.md`).

## Fuera de alcance de esta spec

Cualquier lógica de verificación automática o de negocio — esta pantalla solo facilita la decisión
manual de staff.

## Riesgos / límites explícitos

El staff que revisa antecedentes ve contenido sensible — la URL presignada nunca debe loguearse ni
cachearse más allá de la sesión del diálogo abierto, mismo criterio que `avatarUrl` en
mobile/backend (nunca persistir una URL presignada).
