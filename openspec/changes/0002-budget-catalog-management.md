# Fase 0002 — Catálogo de materiales/calidades para presupuestos (backoffice)

## Antes de empezar

Leer `openspec/specs/material-catalog.md` completo, y
`TekoApp-Backend/openspec/specs/multi-option-quotes.md` para el contrato real.

## Objetivo

Implementar el CRUD de `openspec/specs/material-catalog.md`.

## Tareas

- [ ] `pnpm generate:api-types` una vez el backend exponga `/material-catalog` y
      `/admin/material-catalog`.
- [ ] `pnpm generate:feature material-catalog-item material-catalog --paginated`, adaptar campos
      reales (categoría, país opcional, `qualityTier`, precio de referencia).
- [ ] Filtros por categoría/país en la tabla (paginado server-side).
- [ ] Campo `maxBudgetOptionsPerRequest` agregado al form de `Category` existente.
- [ ] Permiso `MATERIAL_CATALOG_MANAGE` en `core/auth/permissions.ts`.
- [ ] Tests (Vitest + Testing Library) + MSW handlers en
      `src/test/msw/handlers/material-catalog.ts`.
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Checkpoint de salida

- [ ] Un material creado en el catálogo aparece disponible para elegir en el flujo de armado de
      presupuesto de mobile.
- [ ] Cambiar `maxBudgetOptionsPerRequest` de una categoría se refleja en la validación real del
      backend al intentar superar el límite desde mobile.
