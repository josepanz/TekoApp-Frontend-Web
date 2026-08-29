# Fase 0004 — Configuración legal y auditoría de consentimiento (backoffice)

## Antes de empezar

Leer `openspec/specs/data-and-media-consent-admin.md` completo, y
`TekoApp-Backend/openspec/specs/data-and-media-consent.md` para el contrato real.

## Objetivo

Implementar las 3 pantallas de `openspec/specs/data-and-media-consent-admin.md`.

## Tareas

- [x] `pnpm generate:api-types` — corrido contra el backend real corriendo local (2026-08-27),
      luego de extender Backend Fase 0006 (ver más abajo).
- [x] CRUD de `legal-document-versions` (`src/features/legal-document-versions/`) — tabla +
      diálogo crear/editar, `documentType`/`countryId` no editables al editar (evita "mover" una
      versión de país sin querer).
- [x] `data-retention-policies` (`src/features/data-retention-policies/`) — NO es un CRUD
      estándar: el backend solo tiene `GET` (listar) + `PATCH` (upsert por país+tipo de
      contenido, sin endpoint de creación separado — ver decisions.md de Backend). La UI usa el
      mismo diálogo de upsert tanto para "Nueva política" como para "Editar", con `countryId`/
      `contentType` bloqueados al editar (son la clave compuesta — cambiarlos crearía una fila
      nueva en vez de actualizar la existente).
- [x] Panel de auditoría de consentimiento (`src/features/consent-audit/`) — 2 tabs con `Tabs`
      (segundo uso del primitivo en el repo, ver Fase 0001), ambos de solo lectura, paginados
      server-side: "Aceptaciones de términos" (`UserConsents`, filtro por tipo de documento) y
      "Consentimiento de contenido" (`ContentConsentGrants`, filtro por tipo de contenido y
      estado vigente/revocado).
- [x] Permisos `LEGAL.CONFIG_MANAGE`/`LEGAL.CONSENT_AUDIT_VIEW` — YA estaban en
      `core/auth/permissions.ts` desde la Fase 0006 (backend los anticipó), no fue necesario tocar
      el archivo.
- [x] Tests (Vitest + Testing Library) + MSW handlers para las 3 features — 13 tests nuevos
      (`legal-document-versions-table.test.tsx`: 4, `retention-policies-table.test.tsx`: 4,
      `user-consents-audit-table.test.tsx`: 2, `content-consent-grants-audit-table.test.tsx`: 3).
- [x] Confirmado con José: los permisos van tanto al rol `admin` existente como a un rol
      `compliance` nuevo — **tarea de datos/seed pendiente, no de código** (mismo tratamiento que
      `service-progress.audit:read` en la Fase 0002).
- [x] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings (63 archivos, 189 tests).

## Brecha real encontrada al verificar contra el backend (antes de tocar Web)

El backend original de esta fase (Backend 0006) NO alcanzaba para las 3 pantallas de esta spec —
ver `TekoApp-Backend/openspec/changes/0006-data-and-media-consent.md`, sección "Extensión
2026-08-27", para el detalle completo. Resumen desde el lado de Web:

- `GET /admin/legal/consents` no tenía filtros — se le agregaron `documentType`/`countryId`/
  `userReferenceId` antes de construir la tabla (Web solo consume `documentType` hoy, ver
  "Pendiente" abajo).
- No existía ningún endpoint para auditar `ContentConsentGrants` (la 2da pestaña) — se agregó
  `GET /admin/legal/content-consents` en Backend antes de poder construir esa pestaña.
- `UserConsentResponseDTO` no tenía IP/user-agent/hash/usuario tipados en Swagger (funcionaba en
  runtime, pero `generate:api-types` no los traía) — Backend agregó `UserConsentAuditResponseDTO`.

## Pendientes cerrados (2026-08-27, misma tarde, a pedido de José)

- Filtros de `countryId`/`userReferenceId` (UserConsents) y `usageScope`/`uploaderReferenceId`
  (ContentConsentGrants) — agregados como inputs planos (número/texto, commit en blur o Enter, sin
  debounce porque no hay esa utilidad en el repo) en vez de un picker dedicado: no existe
  `src/features/countries/` ni un patrón de búsqueda de usuarios en este repo, así que construir un
  picker nuevo solo para este filtro hubiese sido sobre-ingeniería para el alcance pedido.
- Test dedicado para `consent-audit-tabs.tsx` — 2 tests (tab por defecto + cambio de pestaña).
- 4 tests nuevos de filtros (2 por tabla) verificando que los query params viajan correctos.
- Fix de un flaky pre-existente no relacionado (`request-service-form.test.tsx`, timeout de 5s
  insuficiente bajo carga de la suite completa con más archivos — se subió a 10s, sin tocar el
  componente).
- `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (64 archivos, 193 tests).

## Pendiente explícito real (no resoluble como código)

- Checkpoint de negocio con los 3 repos corriendo juntos (ver "Checkpoint de salida" abajo) —
  requiere cuentas reales, la app Mobile real y juicio humano sobre datos reales; no es algo que se
  pueda simular con curl/HTTP sin credenciales de un usuario/profesional real, y hacerlo con datos
  inventados no sería una verificación de negocio genuina. Queda a cargo de José.

## Checkpoint de salida

- [ ] Un país nuevo se puede dar de alta con su propia versión de política de privacidad y
      política de retención sin tocar código — cubierto por tests unitarios/MSW, sin verificación
      manual contra datos reales de un país nuevo end-to-end.
- [ ] El panel de auditoría muestra una aceptación real hecha desde mobile, con IP y timestamp
      correctos — no verificado con los 3 repos corriendo juntos (mismo pendiente que la Fase
      0001), responsabilidad de José al cerrar este punto del roadmap.
