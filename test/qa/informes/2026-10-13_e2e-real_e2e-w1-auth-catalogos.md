# Informe de ejecución — e2e Playwright contra el backend real

| Campo          | Valor                                                                                                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha y hora   | 2026-10-13 02:06                                                                                                                                                                                                                                                                             |
| Repo           | TekoApp-Frontend-Web                                                                                                                                                                                                                                                                         |
| Rama           | test/e2e-w1-auth-catalogos                                                                                                                                                                                                                                                                   |
| Commit         | 1d62658                                                                                                                                                                                                                                                                                      |
| Entorno        | local: backend REAL de e2e (TekoApp-Backend `pnpm e2e:up/e2e:seed/e2e:serve`, http://localhost:3100) + build standalone de Next en 127.0.0.1:3002 (`scripts/e2e-real/serve.mjs`), Chromium (Version 1.61.1), Node v22.16.0, win32. Claves RSA y secret leídos en el arranque, no commiteados |
| Comando exacto | `pnpm qa:e2e-real` → `pnpm exec playwright test -c playwright.real.config.ts --reporter=html,json`                                                                                                                                                                                           |
| Ejecutor       | Claude Sonnet 5.5 (agente)                                                                                                                                                                                                                                                                   |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
| ------- | -------- | -------- | ----- | ----- | -------- |
| 19      | 0        | 0        | 0     | 19    | 2.1 min  |

Cobertura: No aplica en e2e.

Exit code del runner: 0.

## 2. Resultados por spec y caso

| Spec                            | CP-             | Caso                                                                                                                                         | Estado | Duración | Reintentos |
| ------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ---------- |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-101 | M1 Auth › CP-WEB-AUTH-101 login OK de admin aterriza en /admin y la home del modo cliente sigue accesible                                    | PASÓ   | 13.3 s   | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-102 | M1 Auth › CP-WEB-AUTH-102 login OK de cliente llega a la home del modo cliente                                                               | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-103 | M1 Auth › CP-WEB-AUTH-103 login OK de profesional aterriza en /pro                                                                           | PASÓ   | 5.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-126 | M1 Auth › CP-WEB-AUTH-126 el from (returnTo) tiene prioridad sobre el aterrizaje por rol                                                     | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-127 | M1 Auth › CP-WEB-AUTH-127 compliance aterriza en su primera seccion permitida (Legal)                                                        | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-104 | M1 Auth › CP-WEB-AUTH-104 email inexistente muestra error generico y sigue en /login (regresion bug login:false)                             | PASÓ   | 0.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-105 | M1 Auth › CP-WEB-AUTH-105 password incorrecta muestra el mismo error y sigue en /login                                                       | PASÓ   | 0.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-106 | M1 Auth › CP-WEB-AUTH-106 registro de un usuario nuevo con email unico                                                                       | PASÓ   | 1.9 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-107 | M1 Auth › CP-WEB-AUTH-107 logout limpia las cookies, revoca el refresh en el backend y /admin vuelve a /login                                | PASÓ   | 1.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-108 | M1 Auth › CP-WEB-AUTH-108 cliente_a en /admin ve la pantalla de sin acceso (no crash)                                                        | PASÓ   | 1.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-109 | M1 Auth › CP-WEB-AUTH-109 compliance ve las paginas legales                                                                                  | PASÓ   | 15.0 s   | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-129 | M1 Auth › CP-WEB-AUTH-129 compliance ve solo Legal en el sidebar y /admin lo redirige a su primera seccion                                   | PASÓ   | 1.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-A11Y-010 | M1 Auth › CP-WEB-A11Y-010 /admin/legal/consent-audit sin violaciones axe serious/critical en claro y oscuro                                  | PASÓ   | 10.3 s   | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-110 | M1 Auth › CP-WEB-AUTH-110 compliance no accede a las paginas de admin ajenas                                                                 | PASÓ   | 5.3 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-111 | M1 Auth › CP-WEB-AUTH-111 la sesion sobrevive a un reload y el JWT no es visible desde JS                                                    | PASÓ   | 1.0 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-101  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-101 admin crea, edita, oculta y borra una categoria y el cliente lo ve reflejado          | PASÓ   | 10.8 s   | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-102  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-102 un 400 del backend (nombre > 100 caracteres) se muestra como error del campo Nombre   | PASÓ   | 1.8 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-103  | M2 Tabla admin de categorias con muchos registros › CP-WEB-CAT-103 la tabla admin de categorias pagina (no renderiza todo de una vez)        | PASÓ   | 6.4 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-A11Y-009 | M2 Tabla admin de categorias con muchos registros › CP-WEB-A11Y-009 /admin/categories sin violaciones axe serious/critical en claro y oscuro | PASÓ   | 10.7 s   | 0          |

### Escaneo a11y (axe, reglas serious/critical) por página visitada

| Página                            | Violaciones (reglas) | Detalle (regla / impacto, nodos) |
| --------------------------------- | -------------------- | -------------------------------- |
| `/`                               | 0                    | —                                |
| `/admin`                          | 0                    | —                                |
| `/admin/categories`               | 0                    | —                                |
| `/admin/legal/consent-audit`      | 0                    | —                                |
| `/admin/legal/document-versions`  | 0                    | —                                |
| `/admin/legal/retention-policies` | 0                    | —                                |
| `/login`                          | 0                    | —                                |
| `/pro/solicitudes`                | 0                    | —                                |
| `/register`                       | 0                    | —                                |

## 3. Defectos encontrados

| ID          | Severidad             | Caso                  | Estado                                                                                                                        |
| ----------- | --------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| DEF-WEB-001 | Alta                  | CP-WEB-AUTH-109       | **Corregido** (3d32892): gate por sección del backoffice; compliance entra a `/admin/legal/*`.                                |
| DEF-WEB-002 | Media                 | CP-WEB-CAT-103        | **Corregido** (931b6e6): tabla de categorías con paginación server-side (contrato DEF-BE-012).                                |
| DEF-WEB-003 | Media (a11y, serious) | CP-WEB-A11Y-001 / 009 | **Corregido** (801ac26): tokens `success-text` y `destructive-text`; `/admin/categories` con 0 violaciones en claro y oscuro. |

Hallazgo nuevo durante la corrección, corregido en el mismo ciclo (801ac26): `/admin/legal/consent-audit` (que compliance ahora sí carga) tenía `color-contrast` serious en los tabs inactivos (4.45:1 en oscuro, también en claro con `text-foreground/60`). Se ajustó el token `muted-foreground` oscuro (`neutral.350`) y el trigger de Tabs. Además, el picker de usuario de las auditorías (`GET /users`, exige `user:read`) mandaba a compliance a "sin acceso" por el 403; ahora degrada a lista vacía (3d32892).

Observación de backend (no es defecto de Web): compliance no tiene `user:read`, así que no puede buscar usuarios en el filtro de las auditorías (el filtro queda sin resultados). Decisión de producto/backend pendiente.

## 4. Desvíos y observaciones

- **Corridas e2e real**: 3 consecutivas sobre el código final, estables: 19 pasaron / 0 fallaron / 0 flaky en 2.1 min (esta, con `pnpm build` y `qa:e2e-real`), 1.7 min y 1.6 min (las otras dos, con `E2E_REAL_SKIP_BUILD=1`). Sin `test.fail()` restantes. `retries: 0`.
- Esta corrida es la última de la tanda, hecha después de corregir DEF-WEB-001/002/003 y de cambiar el aterrizaje por rol (ítem 4). El informe anterior del mismo día (14 casos con 2 `test.fail()`) fue reemplazado.
- Entorno: backend `pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve` (TekoApp-Backend, rama `test/e2e-w1-auth-catalogos`, HEAD 0448c5b, sin modificar). Tipos regenerados con `BACKEND_API_URL=http://localhost:3100/tekoapp-backend/api pnpm generate:api-types` (el Swagger del backend todavía declara el array plano en `GET /categories/all`; el tipo paginado se arma en `features/categories/api.ts`).
- Aterrizaje por rol (nuevo): sin `from`, admin va a `/admin`, compliance a su primera sección permitida, profesional a `/pro` (que redirige a `/pro/solicitudes`) y cliente a `/`. El `from` (que agrega `proxy.ts`) tiene prioridad (CP-WEB-AUTH-126). Los e2e con fake-backend y reales que asumían `/` se actualizaron.
- Tema: el default de la app es oscuro aunque el SO sea claro (`defaultTheme="dark"`), por lo que `emulateMedia` no alcanza; los casos de a11y fijan el tema con `setTheme` (localStorage `theme`) y verifican la clase de `<html>`.
- Pendiente (fuera de alcance): otros usos de `text-destructive` sobre fondo claro plano (mensajes de error) rondan 4.1:1; solo se corrigieron las variantes con tinte (Button y Badge destructive) que axe marcó. Los avisos `moderate` de axe (landmarks/region) no se evalúan (solo serious/critical).
- Desvío: `requiredNewPassword` sigue sin pantalla de "crear contraseña" (CP-WEB-AUTH-002); el 429 no se ejerce en e2e real (rate limit relajado), queda en unitarias.
- Se limpió todo: el serve del backend se detuvo y se corrió `pnpm e2e:down` (0 procesos y 0 contenedores vivos).

## 5. Evidencia

- Reporte HTML de Playwright: `test/qa/informes/artefactos/playwright-report-real/index.html` (abrir con `pnpm exec playwright show-report test/qa/informes/artefactos/playwright-report-real`; ignorado por git).
- JSON crudo: `test/qa/informes/artefactos/e2e-real.json` (ignorado por git).
- Trazas/capturas de fallos: `test-results/` (ignorado por git).

## 6. Veredicto

**APROBADO.** Criterio: 19/19 casos pasan en 3/3 corridas estables, sin `test.fail()`, sin flakies; axe con 0 violaciones serious/critical en todas las páginas escaneadas (incluidas `/admin/categories` y `/admin/legal/consent-audit` en claro y oscuro). DEF-WEB-001, 002 y 003 corregidos (ver sección 3).
