# Fase 0001 — Verificación de documentos y antecedentes del profesional (backoffice)

## Antes de empezar

Leer `openspec/specs/professional-documents.md` completo, y
`TekoApp-Backend/openspec/specs/professional-documents.md` para el contrato real de endpoints.

## Objetivo

Implementar las 2 pantallas de `openspec/specs/professional-documents.md`.

## Tareas

- [x] `pnpm generate:api-types` — corrido 3 veces en esta sesión (catálogo, luego
      `requiredDocumentsVerified`, luego la cola admin agregada en backend).
- [x] `src/features/professional-document-types/` — NO se usó `pnpm generate:feature --paginated`
      (el generador asume pagination server-side; el catálogo real no pagina, ver
      `TekoApp-Backend/openspec/decisions.md`) — escrito a mano siguiendo el patrón real de
      `features/categories/` (tabla + `ProfessionalDocumentTypeFormDialog` + botón "Nuevo").
- [x] `src/features/professional-documents/` — `ReviewQueueTable` (paginada, filtros
      status/category) + `DocumentReviewDialog` (aprobar/rechazar con motivo obligatorio).
- [x] Pestaña "Documentos" en el detalle de profesional existente
      (`ProfessionalDetailView`, ahora con `Tabs` — primitivo nuevo, no existía en el repo,
      agregado vía `pnpm dlx shadcn@latest add tabs`) — `ProfessionalDocumentsHistoryTab`.
- [x] Permisos `PROFESSIONAL_DOCUMENT_TYPES.MANAGE`/`PROFESSIONAL_DOCUMENTS.REVIEW` en
      `core/auth/permissions.ts` (nombres anidados, no los planos que decía la spec — mismo
      criterio que el resto de `PERMISSIONS`). Sin gate de nav/página por permiso — mismo criterio
      ya documentado para AI disclosure (backend 403 si falta el permiso).
- [x] Tests: `professional-document-types-table.test.tsx` (4), `review-queue-table.test.tsx` (4),
      `document-review-dialog.test.tsx` (5), `professional-documents-history-tab.test.tsx` (4) —
      MSW handlers en `professional-document-types.ts`/`professional-documents.ts`.
- [x] Story de Storybook para `tabs.tsx` (primitivo nuevo) — `tabs.stories.tsx` (`Default` + `Line`).
- [x] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings (59 archivos, 176 tests).

## Checkpoint de salida

- [ ] Un documento subido desde mobile aparece en la cola de revisión, se aprueba/rechaza, y el
      cambio se refleja en mobile sin necesitar redeploy — **no verificado end-to-end contra los 3
      repos corriendo de verdad**, solo con tests unitarios/MSW de cada repo por separado. Este
      checkpoint requiere los 3 repos corriendo con datos reales — queda a cargo de José, no es un
      cabo de código pendiente.
- [ ] El catálogo de tipos de documento es editable end-to-end — cubierto por tests, sin
      verificación manual contra el backend real corriendo (mismo criterio que arriba).
- Fase 0001 cerrada por completo del lado de código/tests (2026-08-27): los 2 tests que faltaban y
  la story de Storybook ya se agregaron. Solo queda el checkpoint manual de negocio de arriba.
