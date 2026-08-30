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

- **El deploy de Vercel sigue sin conectarse al backend**: probado contra
  `https://teko-app-frontend-8u3s1qzi2-teko-app.vercel.app/login?from=%2Fregister` — José reporta
  que `/register` no abre y que la app no conecta al backend en general. Intenté un chequeo e2e
  automatizado (`WebFetch`) y esa URL específica redirige a `vercel.com/sso-api` (Vercel
  Deployment Protection/SSO) — no se pudo verificar el contenido real de la página desde acá.
  **Hipótesis más probable, sin confirmar**: el proyecto de Vercel no tiene cargadas las env vars
  server-only que este repo necesita en runtime (`BACKEND_API_URL`, `BACKEND_CLIENT_ID`,
  `BACKEND_CLIENT_SECRET`, `BACKEND_JWT_PUBLIC_KEY`, ver `.env.example`) — son variables de
  entorno del proyecto de Vercel, **no** los GitHub Actions secrets que ya están cargados (esos
  solo cubren el pipeline de CI/K3s, no el build/runtime que corre Vercel). Falta: (1) confirmar
  si esa URL es la de producción o un preview de PR viejo, (2) revisar en el dashboard de Vercel
  (Project Settings → Environment Variables) que las 4 variables de arriba estén cargadas para el
  ambiente correspondiente, (3) recién ahí volver a probar `/register` con sesión real.
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
