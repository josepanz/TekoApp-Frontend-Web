# Sesión 4 — 2026-08-27/29 — Cierre completo del roadmap (bitácora, documentos, legal, presupuestos, branding, propinas, ratings, mis pagos)

## Qué se hizo

Cierre de todo el roadmap que quedó pendiente al final de la sesión 3, más un segundo roadmap
completo de 5 features grandes pedidas después. Detalle completo en `openspec/decisions.md` — acá
solo el resumen ejecutivo.

- **Bitácora de trabajo**: `ServiceProgressSection` embebida en el detalle de servicio (no
  pantalla propia).
- **Documentos y antecedentes profesionales**: `professional-documents/`, `professional-document-types/`,
  2 pantallas admin nuevas, `Tabs` (shadcn) reusado por segunda vez.
- **Auditoría legal**: `legal-document-versions/`, `consent-audit/`, `data-retention-policies/`,
  3 pantallas admin nuevas bajo `/admin/legal/`.
- **Catálogo de materiales**: `material-catalog/`, integrado con el form de categorías
  (`maxBudgetOptionsPerRequest`).
- **Branding centralizado**: `brand.ts`, `tokens.json` extendido, `BRANDING.md` (runbook de
  rebrand para los 2 repos frontend).
- **KPIs de calificaciones**: tarjetas propias (`my-ratings/`) y del profesional
  (`professional-ratings/`) en sus respectivos homes.
- **Propinas + "mis pagos"**: id/referenceId estandarizado en pagos/ratings/servicios,
  `(client)/mis-pagos` nuevo (lista + detalle + dejar propina) — gap real encontrado a mitad de
  sesión: el modo cliente nunca tuvo NINGUNA pantalla de pagos propios, ni de lectura.
- **Marco legal/tributario**: 2 tipos de documento nuevos en el dropdown de
  `legal-document-versions` (`SERVICE_CONTRACT_TERMS` — gap pre-existente desde Fase 0004 de
  contratos, nunca reflejado acá — y `USER_CONTENT_LIABILITY_DISCLAIMER`, nuevo).

## Errores encontrados y su solución

- **Gap real de alcance**: el cierre inicial de "propinas" asumió que Web no necesitaba UI de
  creación porque el módulo de pagos es 100% admin — José preguntó por qué, si Web sí tiene modo
  cliente, y la respuesta real era que ese modo cliente nunca tuvo pantalla de pagos en absoluto
  (ni de lectura) — se construyó `(client)/mis-pagos` desde cero, más grande que "propinas" sola.
- **`watch()` de react-hook-form** dispara el warning `react-hooks/incompatible-library` de React
  Compiler (este repo exige 0 warnings) — resuelto manejando el estado de selección visual con
  `useState` normal en `TipDialog`, separado del form.
- **`SERVICE_CONTRACT_TERMS` nunca se reflejó en el dropdown de tipo de documento** pese a existir
  en el backend desde la Fase de contratos — corregido junto con el tipo nuevo de disclaimer.

## Estado al cierre

- Web: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 69 archivos/215 tests en
  verde, `pnpm build` limpio.
- Los 9 puntos del roadmap de la sesión 3 y los 5 puntos del roadmap de backlog post-Fase 0004
  están **cerrados por completo**.
- `PENDING.md` nuevo en la raíz — consolida todos los pendientes reales en un solo lugar.
- PR #13 (`feature/consent-ai-disclosure-and-account-recovery-spec` → `develop`) actualizado con
  todos los commits de este roadmap — la nota "no mergear todavía" ya no aplica.

## Pendiente para la próxima sesión

Ver `PENDING.md` en la raíz del repo para el detalle completo y actualizado.
