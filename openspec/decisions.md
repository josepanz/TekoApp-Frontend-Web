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

## Bitácora de trabajo — sección de staff en el detalle de servicio: implementado 2026-08-27

Pedido puntual de José: cerrar el pendiente de "pestaña staff" que había quedado abierto al cerrar
el punto 5 del roadmap (bitácora de trabajo, `TekoApp-Backend/openspec/specs/work-progress-log.md`)
antes de seguir con el punto 6. `src/features/service-progress/` (`api.ts`/`hooks.ts`/
`components/service-progress-section.tsx`), embebido en `ServiceDetailView`
(`src/app/admin/services/[id]`) — no se armó como pestaña separada (no hay ningún patrón de Tabs en
este repo todavía), se agregó como una `Card` más debajo del detalle, más simple y consistente con
cómo ya está armada esa pantalla.

**Gate client-side por permiso, a diferencia del criterio de la Fase 0003 (AI disclosure admin)**:
esa fase documentó explícitamente "sin gate de permiso a nivel de página/nav, la autorización real
la aplica el backend" — acá se hizo lo opuesto a propósito: el permiso
`service-progress.audit:read` todavía NO está asignado a ningún rol (confirmado en
`TekoApp-Backend/openspec/decisions.md`), así que sin ocultar la sección client-side, **todo** staff
vería una sección que siempre falla con 403 hoy — no es el mismo caso que AI disclosure, donde el
link de nav al menos funciona para los roles que sí tienen el permiso. Revisar este gate si en algún
momento se generaliza un patrón de "ocultar por permiso" real en el repo (hoy es la única
excepción).

**Endpoint de datos**: `GET /services/:id/progress` — mismo endpoint que ya consumen cliente/
profesional en mobile, el backend ya autoriza también a staff con `service-progress.audit:read`/
`admin:all` (ver spec). Sin endpoint `/admin/...` dedicado.

**Gap encontrado y resuelto igual que en mobile**: `entry.images` son keys de S3, no URLs — se
agregó `getPresignedUrl(key)` (`GET /uploads/presigned-url`, ya existía en el backend, sin
consumidor en Web hasta ahora) + `usePresignedUrlQuery`. Se usa un `<img>` plano (con
`eslint-disable-next-line @next/next/no-img-element` documentado) en vez de `next/image` — ningún
componente de este repo usa `next/image` todavía, aunque `next.config.ts` ya tiene el wildcard de
S3 en `remotePatterns` (reservado para cuando se adopte).

**Nuevo handler MSW base**: `GET /api/backend/auth/scope` no tenía ningún handler default (ni
siquiera para `ModeSwitcher`, que también usa `useSessionScopeQuery()` y no tenía test) — con
`onUnhandledRequest: 'error'` (`src/test/setup.ts`), cualquier test que renderizara un componente
con ese hook rompía. Se agregó un handler default sin permisos en `authHandlers` (siempre activo),
que cada test pisa con `server.use(...)` cuando necesita un permiso puntual.

**Estado**: implementado, `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (55/55 archivos,
159/159 tests, incluye 4 tests nuevos).

## Fase 0001 — Documentos y antecedentes del profesional (backoffice): implementado 2026-08-27

`src/features/professional-document-types/` (catálogo) + `src/features/professional-documents/`
(cola de revisión + pestaña de historial). Ver `openspec/changes/0001-professional-documents-verification.md`
para el detalle completo de decisiones tomadas al implementar.

**Resumen de lo no trivial**:

- Catálogo escrito a mano (no con el generador `--paginated`) porque el backend real no pagina
  ese endpoint — ver `TekoApp-Backend/openspec/decisions.md`, Fase 0001.
- `Tabs` (shadcn) es un primitivo nuevo en este repo — agregado para la pestaña de historial en
  `ProfessionalDetailView`, primer uso real de Tabs acá.
- El backend no tenía una cola global de revisión (solo por profesional puntual) — se coordinó con
  backend para agregar `GET /admin/professional-documents` antes de construir la tabla, en vez de
  simular una cola client-side sobre un endpoint que no la soporta.
- `Professional.requiredDocumentsVerified` (campo nuevo del backend, separado de
  `verificationStatus` por la colisión real encontrada ese mismo día) ahora se muestra como badge
  propio en `ProfessionalDetailView`, distinto del badge de `verificationStatus` ya existente.

**Cierre de pendientes (2026-08-27, misma tarde)**: se agregaron `document-review-dialog.test.tsx`
(5 tests) y `professional-documents-history-tab.test.tsx` (4 tests), más `tabs.stories.tsx`
(`Default`/`Line`) para el primitivo nuevo. Único bug encontrado al escribir el test del diálogo:
el link "Ver archivo" se queria buscar con `getByRole('link', ...)` pero `Button` con
`nativeButton={false}` + `render={<a>}` expone `role="button"` (comportamiento de Base UI, no un
bug de producción) — corregido en el test, no en el componente.

**Pendiente explícito, no de código (responsabilidad de José)**:

- Checkpoint de negocio real: subir un documento desde Mobile, verlo en la cola de Web, aprobarlo,
  confirmar que Mobile lo refleja — no probado con los 3 repos corriendo juntos, solo con tests
  unitarios/MSW aislados por repo. Requiere los 3 repos levantados con datos reales.

**Estado**: implementado y verificado — `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (59
archivos, 176 tests, incluye 9 tests nuevos sobre el corte anterior).

## Fase 0004 — Configuración legal y auditoría de consentimiento: implementado 2026-08-27

`src/features/legal-document-versions/`, `src/features/data-retention-policies/`,
`src/features/consent-audit/`. Ver `openspec/changes/0004-consent-and-data-protection-admin.md`
para el detalle completo de la brecha de backend encontrada y corregida antes de implementar
(Backend 0006 no alcanzaba para las 3 pantallas — le faltaban filtros en la auditoría de
`UserConsents`, el endpoint entero de auditoría de `ContentConsentGrants`, y campos sensibles sin
tipar en el DTO de respuesta).

**Resumen de lo no trivial**:

- `data-retention-policies` NO es un CRUD estándar (el backend solo tiene upsert global, sin
  endpoint de creación separado) — un mismo diálogo sirve para crear y editar, bloqueando
  `countryId`/`contentType` en modo edición para no "mover" una política a otra clave por error.
- `Tabs` (shadcn) usado por segunda vez en el repo (primera vez: `ProfessionalDetailView`, Fase 0001) — confirma que ya es un patrón establecido, no un experimento aislado.
- Rol "compliance": José confirmó que los permisos van tanto a `admin` como a un rol `compliance`
  nuevo — tarea de datos/seed pendiente, no de código (mismo criterio que
  `service-progress.audit:read`).
- Simplificación deliberada: los filtros de país/usuario (UserConsents) y alcance de uso/uploader
  (ContentConsentGrants) que el backend soporta no se expusieron en la UI por no existir un
  componente de país/usuario reusable en este repo — documentado como pendiente, no resuelto con
  un picker ad-hoc de bajo valor.

**Estado**: implementado y verificado — `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (63
archivos, 189 tests, incluye 13 tests nuevos). Pendiente de José (no de código): checkpoint real
de negocio con los 3 repos corriendo juntos.

**Cierre de pendientes (2026-08-27, misma tarde, a pedido de José)**: se agregaron los filtros de
país/usuario (`UserConsentsAuditTable`) y alcance de uso/uploader (`ContentConsentGrantsAuditTable`)
como inputs planos (sin picker dedicado — no existe esa infraestructura en el repo), más el test de
`consent-audit-tabs.tsx` y 4 tests de filtros. De paso se corrigió un flaky pre-existente y no
relacionado en `request-service-form.test.tsx` (timeout de 5s insuficiente bajo la carga de la
suite completa, subido a 10s). Único pendiente real que queda: el checkpoint de negocio con los 3
repos corriendo juntos — requiere cuentas y la app Mobile real, no es simulable con HTTP/curl sin
credenciales reales, queda a cargo de José.

**Estado**: `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (64 archivos, 193 tests).

## Fase 0002 — Catálogo de materiales/calidades: implementado 2026-08-28

`src/features/material-catalog/`. Ver `openspec/changes/0002-budget-catalog-management.md` para
el detalle completo.

**Brecha real encontrada y corregida en Backend antes de implementar**: `Category.
maxBudgetOptionsPerRequest` existía en el modelo Prisma pero nunca se expuso en
`CreateCategoryDto`/`UpdateCategoryDto`/`CategoryDetailResponseDTO` — se agregó en Backend, y acá
se extendió `CategoryFormDialog` (Fase de categorías original) con el campo nuevo.

**Otras decisiones**: sin acción de eliminar en la tabla (el backend no expone DELETE a propósito,
ver decisions.md de Backend, Fase 0003) — se desactiva con el switch ya existente en el patrón de
`isActive`. Sin picker de país (input plano de id interno, mismo criterio que Fase 0004).

**Mejora de infraestructura de testing**: `testTimeout` global de Vitest subido de 5s a 10s
(`vitest.config.ts`) — la suite creció a 65 archivos/197 tests en esta sesión y empezaron a
aparecer timeouts intermitentes bajo contención de CPU en tests de interacción con varios pasos
async (confirmados verdes en aislamiento, no bugs reales). Más simple y duradero que parchear cada
test nuevo que lo pise.

**Estado**: implementado y verificado — `pnpm lint`/`pnpm check:types`/`pnpm test` en verde (65
archivos, 197 tests, incluye 4 tests nuevos). Pendiente (no de código): Mobile todavía no consume
este catálogo (Fase 0009 de ese repo, siguiente paso de esta misma sesión).

## id/referenceId estandarizado — implementado 2026-08-28 (backlog post-Fase 0004, ítem 1)

Ver `TekoApp-Backend/openspec/changes/0008-id-referenceid-standardization.md` para el cambio de
contrato del backend. Alcance real en este repo (verificado contra código, no coincide 100% con lo
documentado originalmente): solo 3 dominios tienen pantalla propia acá — **Services, Payments,
Rating** (`PaymentMethod` no tiene pantalla admin propia; `ServiceRequests` reusa el tipo `Service`
en este repo). Antes, `id` (string) YA ERA el `referenceId` (UUID) porque el backend lo
sobreescribía — ahora expone `id` (number, PK interna, solo orden) y `referenceId` (string, UUID)
por separado. Breaking sin shim, coordinado con el fix del backend en la misma sesión.

- `src/core/api-client/types.generated.ts` — `ServiceDetailResponseDTO`/`PaymentDetailResponseDTO`/
  `RatingDetailResponseDTO` editados a mano (marcados `EDITADO A MANO` con nota de qué comando de
  regeneración los reemplaza) ya que no había forma de correr `pnpm generate:api-types` contra un
  backend real en esta sesión.
- Toda navegación/lookup que usaba `.id` de estos 3 tipos migró a `.referenceId`:
  `payments-table.tsx`, `payment-detail-view.tsx`, `ratings-table.tsx`, `my-client-services-table.tsx`,
  `my-services-table.tsx` (profesional), `pending-services-table.tsx`.
- **Decisión de alcance**: las carpetas de ruta dinámica (`admin/payments/[id]`,
  `admin/services/[id]`) NO se renombraron a `[referenceId]` (a diferencia de
  `admin/users/[referenceId]`/`admin/professionals/[referenceId]`) — el nombre del segmento de ruta
  es solo una convención de Next.js, no cambia qué valor viaja en la URL. Se corrigió lo que
  importa de verdad: el VALOR que arma cada `Link`/mutación ahora es `referenceId` (antes se armaba
  con `.id`, que con el contrato viejo daba lo mismo porque `id` era el UUID — con el contrato
  nuevo hubiera roto la navegación silenciosamente, ver el bug de abajo). Renombrar las carpetas es
  cosmético y se dejó fuera para no ampliar el diff sin necesidad real.
- **Bug real encontrado durante la migración, no anticipado en el alcance inicial**: `payments-table.tsx`
  armaba el link de detalle con `` `/admin/payments/${payment.id}` `` — con el contrato viejo
  funcionaba (coincidía con el UUID), pero quedaba roto con el contrato nuevo. Ningún test lo
  detectó porque `Link href` acepta cualquier string interpolado sin chequeo de tipos — se encontró
  leyendo el archivo al migrar los otros usos de `.id` en el mismo componente, no por un error de
  `tsc`. Corregido a `.referenceId`.
- Fixtures de MSW (`src/test/msw/handlers/{services,payments,ratings,client-mode,professional-mode}.ts`)
  actualizados para exponer `id` (number) + `referenceId` (string) por separado, y los handlers que
  resolvían por `:id` ahora comparan contra `referenceId`.
- Migración ejecutada en dos pasadas: un primer intento con un agente en paralelo se cortó a mitad
  de camino por límite de sesión, dejando el tipo generado ya editado pero ningún call site
  migrado — se completó a mano verificando cada error real de `pnpm check:types`/`pnpm test`, no
  repitiendo el barrido de call sites desde cero.

**Verificado**: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 65 archivos/197
tests en verde (1 aserción de test actualizada en `ratings-table.test.tsx` para comparar contra
`referenceId` en vez de `id`).

## Branding centralizado — implementado 2026-08-28 (backlog post-Fase 0004, ítem 5)

Ver `BRANDING.md` (raíz del repo) para el detalle completo, incluida la tabla de qué está
centralizado vs. qué requiere edición manual en cada repo (Mobile en particular: 6 archivos de
identificadores nativos que NO se pueden centralizar en runtime — `applicationId`/bundle ID son la
identidad de la app en las stores, cambiarlos tras publicar equivale a publicar una app nueva).

- `tokens.json` extendido con un bloque nuevo `content` (`appName`, `logoPath`, `bannerPath`) —
  deliberadamente NO pasa por `pnpm tokens:build` (Style Dictionary genera CSS, no tiene sentido
  forzar texto/rutas por ese pipeline) — se consume directo vía `src/design-system/tokens/brand.ts`
  (`BRAND_NAME`/`BRAND_LOGO_PATH`/`BRAND_BANNER_PATH`), que importa el JSON.
- Verificado que agregar el bloque `content` no rompe `pnpm tokens:build` — corrido con y sin el
  bloque, `theme.generated.css` sale byte-idéntico en ambos casos (el formatter custom
  `css/teko-theme` solo procesa `path[0]` en `radius`/`theme`/`color`, ignora cualquier otro). El
  warning de "token collisions" que tira Style Dictionary es preexistente (confirmado corriendo el
  build contra el `tokens.json` de antes de este cambio), no lo causó este ítem.
- `layout.tsx` (metadata title/description), `perfil/page.tsx` (metadata title), `app-sidebar.tsx`
  (label de marca de los 3 modos) y `login/page.tsx` (título de la pantalla) migrados de
  `'TekoApp'` hardcodeado a `BRAND_NAME`.
- `messages/{es,en}.json`: las 4 claves que repetían "TekoApp"/"TekoApp Pro" idéntico en ambos
  idiomas (`layout.brand.{admin,pro,client}`, `auth.login.pageTitle`) pasaron a plantillas con
  placeholder `{brand}`, interpoladas con `BRAND_NAME` en cada call site — el nombre de marca deja
  de vivir duplicado en 2 catálogos de traducción.
- **Fuera de alcance, documentado como tal**: los binarios (`public/brand/{logo,banner}.png`,
  `src/app/favicon.ico`) siguen necesitando reemplazo manual — ningún mecanismo de config evita
  eso. Comentarios de código/nombre de `package.json` que dicen "TekoApp" no se tocaron (cosmético,
  sin impacto funcional).

**Verificado**: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 65 archivos/197
tests en verde (sin cambios de aserciones — el texto renderizado final es idéntico, solo cambió de
dónde sale).

## Ratings — anonimato real + KPIs — implementado 2026-08-28 (backlog post-Fase 0004, ítem 3)

Ver `TekoApp-Backend/openspec/changes/0009-ratings-anonymity-and-kpis.md` para el fix completo del
backend. **Hallazgo real más importante de este ítem**: `GET /professionals/:id/reviews` — que
`ReviewsTable` (`/pro/calificaciones`, ya existente) consume desde antes — hacía un cast crudo de
Prisma en el backend que filtraba la fila COMPLETA de `Users` (email, teléfono, etc.) a cualquier
usuario logueado, ignorando `isAnonymous` por completo. `ReviewsTable` YA tenía la lógica correcta
del lado cliente (`row.original.isAnonymous ? t('anonymous') : ...`) — el bug estaba enteramente
en que el backend nunca respetaba ese flag en la respuesta real, así que el chequeo del frontend
no protegía nada. Cero cambios necesarios en `ReviewsTable` — el fix fue 100% backend.

- `src/features/professional-ratings/api.ts`/`hooks.ts` — `getMyProfessionalRatingStats`/
  `useMyProfessionalRatingStatsQuery`, reusa `useMyProfessionalProfileQuery` (ya existente) para
  el `professionalId`.
- `ProfessionalRatingStatsCard` (nuevo) — agregado en `/pro/calificaciones/page.tsx`, arriba de
  `ReviewsTable`. Distribución por estrellas con barras simples (`div` + `width%`) — no se agregó
  el componente `Progress` de shadcn para esto, no había otro uso en el repo que justificara
  instalarlo.
- `src/features/my-ratings/` (feature nueva, cliente) — `getMyRatingStats`/`useMyRatingStatsQuery`
  (`GET /ratings/me/stats`, resuelve el userId desde el token) + `MyRatingStatsCard`, agregada en
  `(client)/page.tsx` (home del cliente). Separada de `src/features/ratings/` a propósito — ese
  feature existente es el admin (`GET /ratings` sin filtros, usado en `/admin/ratings`), no tiene
  relación con "mis propias estadísticas".
- i18n: namespace `myRatings` nuevo + `professionalRatings.stats` nuevo, en `es.json`/`en.json`.

**Verificado**: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 67 archivos/201
tests en verde (2 archivos nuevos, 4 tests nuevos).

## Propinas — implementado 2026-08-28 (backlog post-Fase 0004, ítem 2), solo lectura

Ver `TekoApp-Backend/openspec/changes/0010-tips.md` para el diseño completo del backend. **Decisión
de alcance real, no anticipada al planificar el roadmap**: Web no tiene ninguna pantalla donde un
cliente pague o vea sus propios pagos — el módulo `payments` de este repo es 100% admin/staff
(`/admin/payments`, con acciones de reembolsar/cancelar que solo tienen sentido para staff). Un
botón "Dejar propina" ahí sería incorrecto: el staff nunca es el cliente que pagó, y el backend
rechazaría la creación con 403 (`payment.userId !== userId`). Por eso el alcance real en Web quedó
en **solo lectura**:

- `src/core/api-client/types.generated.ts` — `TipResponseDTO` nuevo (editado a mano, no existe
  todavía en el Swagger real) + campo `tip?` agregado a `PaymentDetailResponseDTO`.
- `src/features/payments/api.ts` — export `Tip` type, sin ninguna función de mutación (se
  implementaron `getTipConfig`/`createTip` + un `TipDialog` completo primero, y se revirtieron al
  notar que no había ninguna página real donde montarlos — ver decisions.md de Mobile para la UI
  de creación real).
- `payment-detail-view.tsx` — línea de monto de propina en la grilla de detalle, si existe.
- `payments-table.tsx` — ícono `HandCoins` con tooltip (accesible vía `role="img"` +
  `aria-label`, no `title`, para que sea encontrable con `getByRole` en tests) junto al monto,
  si el pago tiene propina.

**Verificado**: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 67 archivos/203
tests en verde (2 tests nuevos).

### Extensión (2026-08-28, mismo día): pantalla de "mis pagos" en modo cliente — la propina SÍ tiene dónde vivir

José cuestionó el cierre de arriba: "¿pero si está el modo cliente en Web también ahí no aplica?".
La respuesta real no era sobre propinas — Web tiene `(client)/` (home, mis-servicios, solicitar,
profesionales) pero **nunca tuvo ninguna pantalla de pagos propios ahí, ni siquiera de lectura**
(confirmado con grep: cero referencias a `payments/api.ts` fuera de `admin/`, y el nav de
cliente/pro no tiene ni un link roto a "pagos" — la sección directamente no estaba contemplada).
Ese gap es más grande que "propinas": afecta a TODOS los pagos, no solo a los que tienen tip. Se
decidió cerrarlo ahora en vez de dejarlo como nota — ver extensión equivalente en
`TekoApp-Backend/openspec/decisions.md` (Fase 0010) para el fix de autorización que esto obligó a
hacer primero (`GET /payments/:id` no verificaba dueño, `GET /payments` aceptaba cualquier
`userId` por query sin permiso).

Nuevo en Web:

- `(client)/mis-pagos/page.tsx` + `(client)/mis-pagos/[id]/page.tsx` — mismo patrón de
  `(client)/mis-servicios`. Nav item nuevo en `client-nav-items.ts` (`CreditCard`, después de
  "Profesionales").
- `src/features/payments/components/my-payments-table.tsx` — tabla acotada a `GET /payments/me`
  (nunca `GET /payments` con filtro, que ahora requiere `payments.audit:read`/`admin:all`), sin
  columnas de usuario/profesional (ruido admin), con acción "Cancelar" (el cliente SÍ puede
  cancelar su propio pago pendiente — `cancelPayment` ya validaba `userId` desde el día uno) pero
  **nunca** "Reembolsar" (acción exclusiva de staff, sin ownership check en el backend).
- `my-payment-detail-view.tsx` — variante de solo-lectura de `payment-detail-view.tsx` sin
  `#userId`/`#professionalId` (ruido admin) ni reembolso, con el botón "Dejar propina" que faltaba.
- El `TipDialog`/`getTipConfig`/`createTip` que se habían revertido en el cierre original se
  reimplementaron desde cero (no había nada para recuperar, el revert no había pasado por commit)
  — `TipConfigResponseDTO` restaurado a mano en `types.generated.ts`. UI idéntica en alcance a la
  de Mobile: solo `PERCENTAGE` (chips) y `FREE` (monto libre), `FIXED` sigue sin UI en ningún repo.
- Corrección de lint real: `watch()` de `react-hook-form` dispara el warning
  `react-hooks/incompatible-library` de React Compiler (este repo exige 0 warnings) — el estado de
  qué botón/campo está seleccionado en `TipDialog` se maneja con `useState` normal, separado del
  form (que solo gestiona validación + submit vía `setValue`), en vez de derivarlo de `watch()`.

Verificado: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 69 archivos/215 tests
en verde (2 archivos nuevos, 12 tests nuevos).

## Marco legal/tributario multi-país — implementado 2026-08-28 (backlog post-Fase 0004, ítem 4, cierre del roadmap 2)

Ver `TekoApp-Backend/openspec/changes/0011-tax-config-and-content-liability-disclaimer.md` para el
diseño del backend. Del lado de Web solo hizo falta un cambio acotado: `legalDocumentVersions`
(`/admin/legal/document-versions`) nunca tuvo en su dropdown de tipo de documento los dos valores
que el backend sí soporta — `SERVICE_CONTRACT_TERMS` (gap pre-existente desde la Fase 0004 de
contratos, nunca reflejado acá) y `USER_CONTENT_LIABILITY_DISCLAIMER` (nuevo). Se agregaron ambos
juntos en `types.generated.ts` (marcado "EDITADO A MANO"), `schemas.ts` (`z.enum`),
`legal-document-version-form-dialog.tsx` (`DOCUMENT_TYPE_OPTIONS`) y las 4 claves de i18n
(`documentTypeOptions` a nivel raíz y dentro de `form`, en `es`/`en`) — staff ya puede cargar una
versión real de cualquiera de los dos documentos en cuanto legal provea el texto.

**Nada de UI para `TaxConfig`** (el nuevo modelo de IVA por país) — el backend expone
`GET /tax/config` pero deliberadamente no hay ningún consumidor todavía en ningún repo, mismo
criterio que `PlatformCommissionConfig`/`TipConfig` (antes de que `TipConfig` tuviera un consumidor
real en la Fase de propinas): no se construye una pantalla sin un flujo de negocio real que la
necesite. Cuando exista una tasa real definida por asesoría fiscal, agregar el hook/pantalla es
trabajo aislado sobre ese endpoint ya listo.

Verificado: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 69 archivos/215 tests
en verde (sin tests nuevos — cambio puramente aditivo sobre un enum ya cubierto por los tests
existentes del formulario/tabla).

## Galería de portafolio de trabajos — implementado 2026-09-02 (Fase 5 de onboarding-and-portfolio)

Ver `TekoApp-Backend/openspec/specs/professional-onboarding-and-portfolio.md`, Fase 4 (modelo
`ProfessionalPortfolioItems`, revisión de staff) — este repo no tenía spec propia todavía para el
tramo de onboarding (Fases 1-3 viven en PRs separados sin mergear); esta fase cierra el vertical
completo del lado Web: autogestión del profesional + cola de revisión de staff + vista pública.
Tipos generados (`pnpm generate:api-types`) contra el backend de esa fase corriendo local en su
propia branch, mismo criterio que cualquier feature nueva de backend todavía no mergeada a develop.

- `src/features/professional-portfolio/` nuevo, espejo de `professional-documents/`:
  `api.ts`/`hooks.ts`/`schemas.ts` + `MyPortfolioManager` (grid propio: subir/editar
  caption/visibilidad/borrar), `PublicPortfolioGallery` (solo lectura, embebida en
  `ProfessionalDetailCard` del lado cliente), `PortfolioReviewQueueTable` +
  `PortfolioReviewDialog` (cola de staff, mismo patrón que `ReviewQueueTable`/
  `DocumentReviewDialog` de `professional-documents`).
- `core/api-client/client.ts#uploadFile` extendido con `options?: {fieldName?, fields?}` (antes
  solo aceptaba `fieldName`) para poder mandar `caption` en el mismo multipart que el archivo —
  sin callers previos, cambio de firma seguro (mismo hallazgo ya hecho una vez en la Fase 2 de Web
  de esta misma spec, en una branch distinta sin mergear todavía; se repite acá porque esta branch
  partió de `develop`, que no tiene esa extensión).
- Rutas nuevas: `/pro/portafolio` (nav `layout.nav.pro.portfolio`) y `/admin/professional-portfolio`
  (nav `layout.nav.admin.professionalPortfolio`).
- Sin `history`/cola por profesional para portafolio (a diferencia de documentos) — el backend no
  expone ese endpoint para portafolio, solo la cola global paginada por estado.

Verificado: `pnpm check:types` 0 errores, `pnpm lint` 0 warnings, `pnpm test` 76 archivos/237 tests
en verde (7 archivos nuevos).
