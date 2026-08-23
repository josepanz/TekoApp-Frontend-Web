# Fase 0004 — Configuración legal y auditoría de consentimiento (backoffice)

## Antes de empezar

Leer `openspec/specs/data-and-media-consent-admin.md` completo, y
`TekoApp-Backend/openspec/specs/data-and-media-consent.md` para el contrato real.

## Objetivo

Implementar las 3 pantallas de `openspec/specs/data-and-media-consent-admin.md`.

## Tareas

- [ ] `pnpm generate:api-types` una vez el backend exponga los endpoints (Backend Fase 0006).
- [ ] CRUD de `legal-document-versions` y `data-retention-policies`.
- [ ] Panel de auditoría de consentimiento (2 tabs, ambos de solo lectura, paginados
      server-side).
- [ ] Permisos `LEGAL_CONFIG_MANAGE`/`LEGAL_CONSENT_AUDIT_VIEW` en `core/auth/permissions.ts`.
- [ ] Tests (Vitest + Testing Library) + MSW handlers para las 3 features.
- [ ] Confirmar con José/legal si este panel necesita un rol dedicado ("compliance") antes de
      asignar los permisos nuevos a un rol existente por defecto (ver `openspec/decisions.md`).
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Checkpoint de salida

- [ ] Un país nuevo se puede dar de alta con su propia versión de política de privacidad y
      política de retención sin tocar código.
- [ ] El panel de auditoría muestra una aceptación real hecha desde mobile, con IP y timestamp
      correctos.
