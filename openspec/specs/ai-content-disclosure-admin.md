# Spec: Auditoría de disclosure de contenido con IA (backoffice)

Backend: `TekoApp-Backend/openspec/specs/ai-content-disclosure.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/ai-content-disclosure.md`.
Feature 10 del backlog 2026-08-22.

## Objetivo

Darle a staff visibilidad de qué contenido de la plataforma está marcado como asistido por IA
(declarado por usuarios, o generado por la plataforma el día que exista esa feature), sin
construir todavía ningún panel de "activar/desactivar generación de IA" real — no hay ninguna
feature de IA generativa implementada hoy.

## Alcance

**Incluye**: listado de `AiContentDisclosures` filtrable por tipo de entidad y origen
(`PLATFORM_AI`/`USER_DECLARED_AI`), vista de detalle que enlaza a la entidad marcada.

**No incluye**: ningún control para activar una feature de IA generativa de plataforma — cuando esa
feature exista, esta pantalla se extiende, no se reconstruye.

## Pantallas / flujos

- `src/features/ai-disclosures/` + `src/app/admin/ai-disclosures/page.tsx` — listado de solo
  lectura (`DataTable` paginado, consume `GET /admin/ai-disclosures`), sin formulario de
  creación/edición desde el backoffice (el disclosure lo crea el usuario o la plataforma, no un
  admin a mano).
- Columna con enlace directo a la entidad (`entityType` + `entityReferenceId`) resuelto a la ruta
  de admin correspondiente cuando exista (ej. `entityType: BUDGET_OPTION` → link al detalle del
  servicio en `src/app/admin/services`), con fallback a "ver detalle no disponible" para tipos de
  entidad sin ruta de admin.

## Permisos

`AI_DISCLOSURE_AUDIT_VIEW` — de solo lectura.

## Fuera de alcance de esta spec

Cualquier integración real con un proveedor de IA generativa.

## Riesgos / límites explícitos

Esta spec depende de que el backend exponga un endpoint de listado agregado
(`GET /admin/ai-disclosures`, definido en `TekoApp-Backend/openspec/specs/ai-content-disclosure.md`)
— no solo el lookup puntual por entidad.
