# Decisiones de arquitectura — web (features 2026-08-22)

Formato: decisión → motivo → estado, mismo criterio que
`TekoApp-Frontend-Mobile/openspec/decisions.md`.

## Por qué existe este archivo

Nace el 2026-08-23 junto con el resto de `openspec/` en este repo, para documentar las decisiones
de diseño de las superficies de backoffice de las 6 features grandes pedidas por José el
2026-08-22. El backlog original completo vive en
`TekoApp-Frontend-Mobile/openspec/decisions.md`, sección "Backlog — features grandes pedidas
2026-08-22" — este archivo no lo copia, lo referencia.

## Solo 4 de las 6 features tienen spec de Web dedicada

**Motivo**: `work-progress-log` (bitácora de trabajo) y, según se confirme con José,
`service-contracts` (contratos) no tienen todavía un caso de uso de staff lo bastante distinto de
"ver el detalle de un servicio ya existente" como para justificar una pantalla nueva completa —
extender `src/app/admin/services` con una pestaña es más barato y consistente que una spec/feature
nueva. Ver `TekoApp-Backend/openspec/specs/work-progress-log.md` para el detalle de esta decisión
de alcance, marcada ahí como pendiente de confirmación explícita de José.

**Estado**: decidido como default razonable, no bloqueante — si José pide una superficie de staff
dedicada para bitácora o contratos, se agrega una spec nueva a esta carpeta en ese momento
(`0005-*`/`0006-*`, siguiente número disponible).

## Permisos nuevos, no genéricos

**Motivo**: cada spec de esta carpeta agrega permisos específicos (`DOCUMENT_TYPES_MANAGE`,
`PROFESSIONAL_DOCUMENTS_REVIEW`, `MATERIAL_CATALOG_MANAGE`, `AI_DISCLOSURE_AUDIT_VIEW`,
`LEGAL_CONFIG_MANAGE`, `LEGAL_CONSENT_AUDIT_VIEW`) en vez de reusar un permiso genérico de
"admin" — varias de estas operaciones (revisar antecedentes, auditar consentimiento) son
candidatas a delegarse a un rol de compliance/legal separado del rol de operación general de la
plataforma, y un permiso específico permite esa separación sin refactor futuro.

**Estado**: decidido para el diseño, no implementado — depende de que
`TekoApp-Backend/openspec/specs/` termine de definir el enum `PERMISSIONS` real antes de
replicarlo acá.

## Qué NO se decidió todavía (pendiente explícito)

- Si el panel de auditoría de consentimiento (`data-and-media-consent-admin.md`) necesita un rol
  "compliance" dedicado, separado de "admin de plataforma" — pendiente de confirmación de José
  antes de asignar los permisos nuevos a un rol existente por defecto.

## Rediseño visual — gradiente de marca (implementado 2026-08-25)

Roadmap punto 3 (rediseño visual, después de la fundación de consentimiento `0004`/backend
`0006`). Fuera del backlog de features 2026-08-22 — es un pedido de diseño separado.

**`BrandGradientBackground`** (`src/components/layout/`) — gradiente diagonal
navy→teal→verde inspirado en el banner de `brand/manual-de-marca.png` (única referencia real de
gradiente de marca; el logo y el banner plano no tienen gradiente). Usa `--teko-neutral-900` →
`--teko-accent-700` → `--teko-primary-600` (shades 700/600, no los 500 crudos de `tokens.json`)
para que texto blanco encima pase contraste AA en toda la superficie — mismo criterio que
`--primary` usa 600 en vez de 500 (ver `tokens.json`, `primary.600`: "L .52 da ~5:1 con texto
blanco"). Aplicado en:

- `/login` — fondo de página completa; el formulario (`LoginForm`, sin `Card` propio) se envolvió
  en un contenedor `bg-card` nuevo en `page.tsx`, ya que sus inputs asumen fondo claro.
- `/error` (root error boundary) — fondo de página completa.
- `(client)/page.tsx` (home de cliente) — hero acotado (rounded + padding) en vez de fondo
  completo, para no competir con el sidebar/topbar del layout autenticado.

**`/pro` (home profesional) — candidato descartado tras inspección**: `pro/page.tsx` resultó ser
solo un `redirect('/pro/solicitudes')`, sin ningún UI propio — no hay nada que gradientar ahí. La
pantalla real que ve el usuario es `/pro/solicitudes`, fuera del alcance confirmado originalmente
(no se tocó sin confirmación explícita).

**Estado**: implementado, `pnpm lint`/`check:types`/test en verde (150/150).

## Fase 0003 — Auditoría de disclosure de contenido con IA (implementado 2026-08-25)

Panel de solo lectura `src/app/admin/ai-disclosures/page.tsx` + `src/features/ai-disclosures/`,
mismo patrón que `features/services` (tabla paginada + 2 filtros `Select`, sin formulario de
creación/edición — el disclosure lo crea el usuario dueño del contenido o, a futuro, una feature de
IA de plataforma, nunca un admin a mano).

**`pnpm generate:api-types` requirió levantar el backend local** (`pnpm run start:dev` en
background) porque el script pega contra `GET /swagger-json` real, no un mock — confirmado que
`AiDisclosureResponseDTO`/`DeclareAiDisclosureRequestDTO`/`AiDisclosuresAdminListResponseDTO` ya
estaban expuestos por la Fase 0005 del backend (mismo día).

**Resolución de enlace a la entidad — solo 2 `entityType` con ruta real hoy**, igual criterio que
la Fase 0005 del backend y la 0011 de mobile: `SERVICE_DESCRIPTION` → `/admin/services/:id`
(`Services.id` YA ES el UUID, no `referenceId` — ver `TekoApp-Backend/.claude/rules/database-conventions.md`)
y `PROFESSIONAL_DESCRIPTION` → `/admin/professionals/:referenceId`. `BUDGET_OPTION`/`PROGRESS_NOTE`/
`IMAGE`/`OTHER` caen al fallback "Ver detalle no disponible" (spec explícita) hasta que exista un
admin para ese tipo de contenido.

**`PERMISSIONS.LEGAL`/`AI_DISCLOSURE` agregados a `core/auth/permissions.ts`** — `LEGAL` ya
existía en el backend desde la Fase 0006 pero nunca se había espejado acá (gap encontrado al agregar
`AI_DISCLOSURE`, corregido de una vez ya que el archivo mismo documenta "actualizar acá a mano" como
regla). Ninguna pantalla usa `PERMISSIONS.LEGAL.*` todavía (Fase 0004 del roadmap, pendiente).

**Sin gate de permiso a nivel de página/nav** — mismo criterio que `roles-permission` (el otro
dominio con permiso fino real del backend): el ítem de nav se muestra a todo staff igual que el
resto, y la autorización real la aplica el backend (`403` si falta `AI_DISCLOSURE.AUDIT_VIEW`); no
existe hoy en este repo un patrón de ocultar ítems de nav por permiso.

**Tests — 2 ajustes de estrategia de query encontrados en la marcha**: `getAllByRole('link', {name})`
no resolvía sobre el `<Link>` de Next envuelto en `Button render={...}` en este entorno de test (sin
precedente previo que probara ese link puntual por rol) — se cambió a
`container.querySelector('a[href="..."]')`. La verificación de filtro por `entityType` chocaba con
"multiple elements" porque el trigger del `Select` ya muestra el label de la opción elegida además
de la fila de la tabla — se acotó la aserción con `within(screen.getByRole('table'))`.

**Estado**: implementado, `pnpm lint`/`check:types`/test en verde (155/155, incluye 5 tests
nuevos).
