# Fase 0001 — Verificación de documentos y antecedentes del profesional (backoffice)

## Antes de empezar

Leer `openspec/specs/professional-documents.md` completo, y
`TekoApp-Backend/openspec/specs/professional-documents.md` para el contrato real de endpoints.

## Objetivo

Implementar las 2 pantallas de `openspec/specs/professional-documents.md`.

## Tareas

- [ ] `pnpm generate:api-types` una vez el backend exponga los endpoints (Backend Fase 0001).
- [ ] `pnpm generate:feature document-type document-types --paginated`, adaptar campos reales
      (país, categoría, `isRequired`/`requiresStaffReview`/`isVisibleToClient`, `validityDays`).
- [ ] `src/features/professional-documents/` — tabla de cola, filtros, `DocumentReviewDialog`.
- [ ] Pestaña "Documentos" en el detalle de profesional existente (`src/app/admin/professionals`).
- [ ] Permisos `DOCUMENT_TYPES_MANAGE`/`PROFESSIONAL_DOCUMENTS_REVIEW` en
      `core/auth/permissions.ts`, aplicados al sidebar/rutas.
- [ ] Tests (Vitest + Testing Library) para tabla, form de catálogo, diálogo de revisión — MSW
      handlers en `src/test/msw/handlers/document-types.ts` y `professional-documents.ts`.
- [ ] Story de Storybook si se agrega algún primitivo nuevo (no debería hacer falta si se reusa
      `DataTable`/`Dialog`).
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Checkpoint de salida

- [ ] Un documento subido desde mobile aparece en la cola de revisión, se aprueba/rechaza, y el
      cambio se refleja en mobile sin necesitar redeploy.
- [ ] El catálogo de tipos de documento es editable end-to-end (crear/editar/desactivar un tipo).
