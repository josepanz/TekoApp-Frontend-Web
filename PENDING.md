# Pendientes y decisiones abiertas — TekoApp-Frontend-Web

Consolidado 2026-08-29. Objetivo: un solo lugar para ver qué queda sin resolver, sin recorrer
`openspec/decisions.md` fase por fase. Actualizar esta lista al cerrar o abrir un pendiente nuevo.

## 1. Decisiones de negocio pendientes de confirmación

- **Rol `compliance`**: José confirmó que los permisos de auditoría legal (`LEGAL.CONFIG_MANAGE`,
  `LEGAL.CONSENT_AUDIT_VIEW`) van tanto a `admin` como a un rol `compliance` nuevo — la UI ya
  asume ese permiso vía `PERMISSIONS.LEGAL.*`, pero el rol en sí es una tarea de datos/seed
  pendiente en `TekoApp-Backend` (mismo criterio que `service-progress.audit:read`/
  `ratings.audit:read`/`payments.audit:read`, ver `PENDING.md` de ese repo).
- **Superficie de staff dedicada para bitácora/contratos**: `work-progress-log` se extendió como
  una `Card` más en `/admin/services/[id]` en vez de una pantalla propia, y `service-contracts` no
  tiene ninguna pantalla de staff todavía — decisión de alcance razonable tomada por default, no
  bloqueante. Si José pide una superficie dedicada, agregar spec nueva en `openspec/changes/`.

## 2. Deuda técnica / gaps conocidos, no corregidos a propósito

- **Filtros de país/usuario en auditoría de consentimiento** (`UserConsentsAuditTable`,
  `ContentConsentGrantsAuditTable`): el backend soporta filtrar por país/usuario/uploader, pero acá
  son inputs planos de id interno — no existe un componente de picker de país/usuario reusable en
  este repo. Documentado como pendiente, no resuelto con un picker ad-hoc de bajo valor.
- **Carpetas de ruta dinámica `[id]` sin renombrar a `[referenceId]`** (`/admin/payments/[id]`,
  etc.) — decisión deliberada al implementar id/referenceId: solo importaba que el VALOR que viaja
  en la URL sea el `referenceId` correcto, renombrar la carpeta es cosmético y se dejó pendiente.
- **Sin UI para `TaxConfig`** (IVA por país, `GET /tax/config` en el backend) — ningún repo tiene
  todavía un consumidor real de este endpoint. Igual que `PlatformCommissionConfig`/`TipConfig`
  antes de que `TipConfig` tuviera un consumidor real (Fase de propinas): no se construye pantalla
  sin un flujo de negocio real que la necesite.
- **`legalDocumentVersions` — 2 tipos de documento agregados sin CRUD/UI adicional más allá del
  dropdown**: `SERVICE_CONTRACT_TERMS` y `USER_CONTENT_LIABILITY_DISCLAIMER` ya aparecen como
  opción en el formulario de creación, pero nadie cargó todavía una versión real de ninguno de los
  dos (necesita el texto real de asesoría legal primero, ver `PENDING.md` de Backend).

## 3. Checkpoints de negocio con datos reales (responsabilidad de José, no de código)

Todos verificados con MSW/tests aislados, ninguno probado con los 3 repos corriendo juntos:

- Cola de revisión de documentos profesionales: subir desde Mobile → aprobar/rechazar en Web →
  confirmar que Mobile refleja el cambio.
- Auditoría de consentimiento: aceptar un consentimiento real desde Mobile y verlo reflejado acá.
- Presupuestos multi-opción: profesional arma un presupuesto real, cliente lo compara y elige.
- Historial/detalle de "mis pagos" en modo cliente (`(client)/mis-pagos`, extensión del roadmap
  post-Fase 0004) con datos reales, incluida la propina.
- Panel de KPIs de calificaciones propias/del profesional con datos reales de uso.

## 4. Bug pre-existente ya corregido — verificar que siga así

`core/auth/session.ts#getSession()` en algún momento colapsaba 401 y 5xx en el mismo `null` (bug
documentado en una auditoría anterior). **Al consolidar este archivo (2026-08-29) se confirmó que
ya está corregido**: distingue 401 (retorna `null`, sesión inválida) de cualquier otro código
(lanza `SessionUnavailableError`, nunca trata un backend caído como logout). Se deja esta nota acá
solo para que quede registrado que se verificó — no reabrir esta investigación sin evidencia nueva.

## 5. Roadmap futuro documentado, sin implementar

- **Reportes/exports con más libertad de diseño**: arquitectura decidida (backend responde un
  export job asíncrono + notificación push VAPID; Web genera el PDF client-side con
  `@react-pdf/renderer`) — ver `TekoApp-Backend/openspec/decisions.md`. Sin spec propia todavía.

## 6. Reportado por José 2026-08-30 — solo anotado, sin investigar/desarrollar todavía

- **`/register` no renderiza en el deploy de Vercel** (Web SÍ conecta al backend normalmente —
  José confirmó esto explícitamente 2026-08-30, descartar la hipótesis de env vars faltantes de
  una revisión anterior de esta nota). Probado contra
  `https://teko-app-frontend-8u3s1qzi2-teko-app.vercel.app/login?from=%2Fregister`. No pude
  verificar el contenido yo mismo vía `WebFetch` — esa URL de preview está detrás de Vercel
  Deployment Protection/SSO (redirige a `vercel.com/sso-api`), y esto es esperado/normal para un
  preview de Vercel, no el bug en sí — José sí pudo verlo logueado y confirmó que `/register`
  específicamente no renderiza. Sin causa raíz identificada todavía — a investigar la próxima
  sesión: candidatos a revisar primero son el route group `(auth)/register/page.tsx` (¿resuelve
  bien en el build de Vercel, que ignora el Dockerfile y usa el mismo build `standalone`?), algún
  error de build/runtime específico de esa ruta, o que la URL probada sea un preview desactualizado
  (de antes del merge del PR #17) — confirmar primero contra la URL de producción real.
- **La app Mobile sigue sin conectarse al backend** — José confirmó 2026-08-30 que esto sigue
  fallando pese al fix de CI de esta sesión (secrets `BASIC_AUTH_CLIENT_ID`/`SECRET` cableados en
  `build.yml`/`release.yml`, PR #72 ya mergeado a `develop`). Hipótesis a revisar primero la
  próxima sesión: (1) el APK que se está probando puede ser un build viejo, anterior al merge —
  confirmar que se instaló un APK generado DESPUÉS del merge de PR #72 (`gh release list --repo
josepanz/TekoApp-Frontend-Mobile`, ver si hay un release nuevo con esos secrets ya aplicados);
  (2) si el release SÍ es nuevo y sigue fallando, revisar si `BASIC_AUTH_CLIENT_ID`/`SECRET`
  llegaron con el valor correcto al build (secrets de GitHub no imprimen su valor en logs, así que
  un typo en el nombre del secret fallaría en silencio) y si la credencial `tekoapp-mobile` en la
  base de Supabase sigue activa. No investigado más a fondo todavía — solo queda anotado.
- **Íconos de categoría — falta consistencia fuera del módulo de Categorías**: José pidió que el
  ícono coloreado (`IconPicker`/`ColorPicker` agregados el 2026-08-29) se vea siempre que aparece
  el NOMBRE de una categoría, no solo en la columna dedicada de `/admin/categories`. Grep rápido
  (2026-08-30) de dónde se muestra `category.name`/`categoryName` sin el ícono al lado:
  `features/services/components/services-table.tsx`, `service-detail-view.tsx`,
  `features/request-service/components/request-service-form.tsx` (selector de categoría al pedir
  un servicio) son los candidatos reales. **Verificado 2026-08-30**: el backend YA expone
  `category.icon`/`category.color` en `ServiceDetailResponseDTO` (usado tanto por `GET
/services/:id` como por el listado, `ServicesListResponseDTO` reusa el mismo DTO por fila) — no
  hace falta ningún cambio de backend, es puramente un gap de render en estos componentes de Web.
  No implementado — solo queda anotado el alcance real para la próxima sesión.

## 7. PR abierto, en pausa deliberada

**PR #13** (`feature/consent-ai-disclosure-and-account-recovery-spec` → `develop`) — quedó abierto
a propósito desde 2026-08-26 hasta cerrar el resto del roadmap en curso. **Ese roadmap ya cerró por
completo el 2026-08-28/29** — este PR es candidato a mergear ahora, confirmarlo explícitamente
antes de hacerlo.
