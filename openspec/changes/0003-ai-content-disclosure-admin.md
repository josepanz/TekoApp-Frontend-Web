# Fase 0003 — Auditoría de disclosure de contenido con IA (backoffice)

## Antes de empezar

Leer `openspec/specs/ai-content-disclosure-admin.md` completo. Confirmar que
`TekoApp-Backend/openspec/changes/0005-ai-content-disclosure.md` ya expone
`GET /admin/ai-disclosures` (listado agregado) antes de arrancar — no asumido por defecto.

## Objetivo

Implementar el panel de auditoría de solo lectura de `openspec/specs/ai-content-disclosure-admin.md`.

## Tareas

- [x] `pnpm generate:api-types` una vez el backend exponga el endpoint de listado.
- [x] `src/features/ai-disclosures/` + `src/app/admin/ai-disclosures/page.tsx` — tabla paginada,
      filtros por `entityType`/`source`.
- [x] Resolución de enlaces a la entidad marcada, con fallback para tipos sin ruta de admin
      correspondiente todavía.
- [x] Permiso `AI_DISCLOSURE_AUDIT_VIEW` en `core/auth/permissions.ts`.
- [x] Tests (Vitest + Testing Library) + MSW handler correspondiente.
- [x] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Checkpoint de salida

- [x] Un disclosure auto-declarado desde mobile aparece en el listado de staff con el enlace
      correcto a la entidad marcada — verificado con el DTO real generado desde el backend
      (`AiDisclosureResponseDTO`), resolución de enlace `/admin/services/:id` /
      `/admin/professionals/:referenceId`.
