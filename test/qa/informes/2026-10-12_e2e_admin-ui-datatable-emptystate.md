# Informe de ejecución — e2e Playwright (fake-backend)

| Campo          | Valor                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha y hora   | 2026-10-12 20:38                                                                                                                                                                         |
| Repo           | TekoApp-Frontend-Web                                                                                                                                                                     |
| Rama           | feat/admin-ui-datatable-emptystate                                                                                                                                                       |
| Commit         | 177ba23 (árbol con cambios sin commitear)                                                                                                                                                |
| Entorno        | local: fake-backend (`e2e/fake-backend/server.mjs`, puerto 4000) + build de producción de Next en 127.0.0.1:3001, Chromium (Version 1.61.1), Node v22.16.0, win32. No es el backend real |
| Comando exacto | `pnpm qa:e2e` → `pnpm exec playwright test --reporter=html,json`                                                                                                                         |
| Ejecutor       | agente Claude Code (claude-sonnet-5-5)                                                                                                                                                   |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
| ------- | -------- | -------- | ----- | ----- | -------- |
| 14      | 0        | 0        | 0     | 14    | 1.9 min  |

Cobertura: No aplica en e2e.

Exit code del runner: 0.

## 2. Resultados por spec y caso

| Spec                                           | CP-            | Caso                                                                                                        | Estado | Duración | Reintentos |
| ---------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- | ------ | -------- | ---------- |
| `e2e/admin-categories.spec.ts`                 | CP-WEB-E2E-005 | Admin — Categorías › crea una categoría nueva y la ve en la tabla                                           | PASÓ   | 7.0 s    | 0          |
| `e2e/admin-categories.spec.ts`                 | CP-WEB-E2E-006 | Admin — Categorías › oculta una categoría y luego la elimina                                                | PASÓ   | 1.5 s    | 0          |
| `e2e/client-solicitar.spec.ts`                 | CP-WEB-E2E-007 | Cliente — Solicitar servicio › solicita un servicio y lo ve reflejado en Mis servicios                      | PASÓ   | 5.3 s    | 0          |
| `e2e/login.spec.ts`                            | CP-WEB-E2E-001 | Login › redirige a /login si no hay sesión                                                                  | PASÓ   | 0.4 s    | 0          |
| `e2e/login.spec.ts`                            | CP-WEB-E2E-002 | Login › inicia sesión, entra al panel de administración y ve el Resumen con datos reales del backend (fake) | PASÓ   | 0.8 s    | 0          |
| `e2e/login.spec.ts`                            | CP-WEB-E2E-003 | Login › muestra un error si las credenciales son inválidas                                                  | PASÓ   | 0.4 s    | 0          |
| `e2e/login.spec.ts`                            | CP-WEB-E2E-004 | Login › navega a Usuarios dentro del panel de administración y ve la tabla paginada, luego cierra sesión    | PASÓ   | 1.2 s    | 0          |
| `e2e/payments.spec.ts`                         | CP-WEB-E2E-008 | Pagos › reembolsa un pago desde el panel de administración                                                  | PASÓ   | 2.4 s    | 0          |
| `e2e/payments.spec.ts`                         | CP-WEB-E2E-009 | Pagos › cancela un pago propio desde Mis pagos                                                              | PASÓ   | 1.4 s    | 0          |
| `e2e/payments.spec.ts`                         | CP-WEB-E2E-010 | Pagos › deja una propina desde el detalle de un pago propio                                                 | PASÓ   | 2.0 s    | 0          |
| `e2e/professional-verification-funnel.spec.ts` | CP-WEB-E2E-011 | Postulación → verificación de profesional › postula, queda pendiente y el staff la verifica                 | PASÓ   | 4.1 s    | 0          |
| `e2e/review-queues.spec.ts`                    | CP-WEB-E2E-012 | Colas de revisión › aprueba un documento pendiente en la cola de revisión                                   | PASÓ   | 1.2 s    | 0          |
| `e2e/review-queues.spec.ts`                    | CP-WEB-E2E-013 | Colas de revisión › rechaza una foto de portafolio pendiente con un motivo                                  | PASÓ   | 1.4 s    | 0          |
| `e2e/smoke.spec.ts`                            | CP-WEB-E2E-014 | la homepage carga y muestra la marca TekoApp                                                                | PASÓ   | 0.3 s    | 0          |

## 3. Defectos encontrados

Ninguno. Los 14 casos pasaron sin reintentos.

## 4. Desvíos y observaciones

- Sin flakies, timeouts ni omitidos (1 worker, 0 reintentos).
- Entorno: fake-backend, no backend real. El log del servidor muestra 404 del fake-backend en `v1/notifications`, `v1/notifications/unread/count`, `v1/notifications/stream` y `v1/ratings/me/stats` (endpoints no simulados); no afectan a los casos pero indican que notificaciones/ratings no están cubiertos por e2e (pendiente W1).
- CP-WEB-E2E-014 (smoke): sin sesión `/` redirige a `/login` y valida la marca ahí; no prueba una homepage pública.
- Duración dominada por `pnpm build` previo al arranque del webServer.

## 5. Evidencia

- Reporte HTML de Playwright: `test/qa/informes/artefactos/playwright-report/index.html` (abrir con `pnpm exec playwright show-report test/qa/informes/artefactos/playwright-report`; ignorado por git).
- JSON crudo: `test/qa/informes/artefactos/e2e.json` (ignorado por git).
- Trazas/capturas de fallos: `test-results/` (ignorado por git).

## 6. Veredicto

**APROBADO CON OBSERVACIONES.** 14/14 pasaron; las observaciones son brechas de alcance del fake-backend (notificaciones, ratings), no defectos. Es evidencia contra el fake-backend, no contra el backend real.
