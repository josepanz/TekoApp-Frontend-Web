# Fase 0002 — Catálogo de materiales/calidades para presupuestos (backoffice)

## Antes de empezar

Leer `openspec/specs/material-catalog.md` completo, y
`TekoApp-Backend/openspec/specs/multi-option-quotes.md` para el contrato real.

## Objetivo

Implementar el CRUD de `openspec/specs/material-catalog.md`.

## Tareas

- [x] `pnpm generate:api-types` — corrido contra el backend real corriendo local (2026-08-28).
- [x] `src/features/material-catalog/` — escrito a mano (no con
      `pnpm generate:feature --paginated`, mismo motivo que professional-document-types en
      sesiones previas: campos reales distintos al esqueleto genérico) con
      `MaterialCatalogTable` (paginada, filtros categoría/calidad) + diálogo crear/editar +
      botón "Nuevo". Sin filtro de país en la UI (input plano de id interno en el form, igual
      criterio que `legalDocumentVersions`/`dataRetentionPolicies`: no hay picker de país en el
      repo). **Sin acción de eliminar** — el backend no expone DELETE a propósito (ver
      `TekoApp-Backend/openspec/decisions.md`, Fase 0003): se desactiva con el switch de la tabla.
- [x] Filtros por categoría/calidad en la tabla (paginado server-side vía el mismo
      `GET /material-catalog` que consume el profesional).
- [x] Campo `maxBudgetOptionsPerRequest` agregado al form de `Category` existente —
      **brecha real encontrada**: el backend nunca exponía este campo en
      `CreateCategoryDto`/`UpdateCategoryDto`/`CategoryDetailResponseDTO` (solo existía en el
      modelo Prisma) — se agregó en Backend antes de poder consumirlo desde acá.
- [x] Permiso `MATERIAL_CATALOG.MANAGE` en `core/auth/permissions.ts`.
- [x] Tests (Vitest + Testing Library) + MSW handlers en
      `src/test/msw/handlers/material-catalog.ts` — 4 tests nuevos.
- [x] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings (65 archivos, 197 tests).
      De paso: se subió el `testTimeout` global de Vitest (5s → 10s, `vitest.config.ts`) — 2 tests
      preexistentes no relacionados empezaron a fallar intermitentemente por contención de CPU al
      crecer la suite en esta misma sesión (confirmado verdes en aislamiento), no por un bug real.

## Checkpoint de salida

- [ ] Un material creado en el catálogo aparece disponible para elegir en el flujo de armado de
      presupuesto de mobile — pendiente de Mobile (Fase 0009 de ese repo, todavía no implementada
      al momento de cerrar esta tarea de Web).
- [ ] Cambiar `maxBudgetOptionsPerRequest` de una categoría se refleja en la validación real del
      backend al intentar superar el límite desde mobile — mismo pendiente que arriba, más el
      checkpoint de negocio real de los 3 repos corriendo juntos, a cargo de José.
