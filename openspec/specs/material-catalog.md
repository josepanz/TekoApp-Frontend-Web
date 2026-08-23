# Spec: Catálogo de materiales/calidades para presupuestos (backoffice)

Backend: `TekoApp-Backend/openspec/specs/multi-option-quotes.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/multi-option-quotes.md`.
Feature 8 del backlog 2026-08-22.

## Objetivo

Darle a staff el CRUD del catálogo `MaterialCatalog` (materiales/calidades por categoría de
servicio y país) que los profesionales usan en mobile para armar presupuestos multi-opción, y la
configuración de cuántas opciones puede armar un profesional por categoría.

## Alcance

**Incluye**: CRUD de `MaterialCatalog` (nombre, unidad, `qualityTier`, precio de referencia, scope
país/categoría), edición de `Category.maxBudgetOptionsPerRequest`.

**No incluye**: vista de los presupuestos concretos que arman los profesionales — eso vive en el
detalle de servicio/propuesta ya existente en `src/app/admin/services`.

## Pantallas / flujos

- `src/features/material-catalog/` + `src/app/admin/material-catalog/page.tsx` — generado con
  `pnpm generate:feature material-catalog-item material-catalog --paginated`, adaptado: form con
  select de categoría, select opcional de país (vacío = catálogo genérico), select de
  `qualityTier` (`BASIC`/`STANDARD`/`PREMIUM`), input numérico de precio de referencia.
- Filtro por categoría y país en la tabla — `DataTable` paginado server-side, nunca cargar todo el
  catálogo client-side.
- Extender el form de edición de `Category` existente con el campo
  `maxBudgetOptionsPerRequest` (input numérico, default 3) — no crear una pantalla nueva solo para
  este campo.

## Permisos

`MATERIAL_CATALOG_MANAGE` (ver `openspec/decisions.md` — permiso específico, no genérico).

## Fuera de alcance de esta spec

Los presupuestos concretos de un profesional/servicio.

## Riesgos / límites explícitos

El precio de referencia (`defaultPrice`) es solo un valor sugerido para el profesional al armar su
presupuesto — no es un precio regulado ni fijo; el copy de la UI debe decir "precio sugerido", no
"precio oficial".
