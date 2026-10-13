# Informe de ejecución — e2e Playwright contra el backend real

| Campo          | Valor                                                                                                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha y hora   | 2026-10-13 01:02                                                                                                                                                                                                                                                                             |
| Repo           | TekoApp-Frontend-Web                                                                                                                                                                                                                                                                         |
| Rama           | test/e2e-w1-auth-catalogos                                                                                                                                                                                                                                                                   |
| Commit         | 851350a (árbol con cambios sin commitear)                                                                                                                                                                                                                                                    |
| Entorno        | local: backend REAL de e2e (TekoApp-Backend `pnpm e2e:up/e2e:seed/e2e:serve`, http://localhost:3100) + build standalone de Next en 127.0.0.1:3002 (`scripts/e2e-real/serve.mjs`), Chromium (Version 1.61.1), Node v22.16.0, win32. Claves RSA y secret leídos en el arranque, no commiteados |
| Comando exacto | `pnpm qa:e2e-real` → `pnpm exec playwright test -c playwright.real.config.ts --reporter=html,json`                                                                                                                                                                                           |
| Ejecutor       | Claude Sonnet 5.5 (agente)                                                                                                                                                                                                                                                                   |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
| ------- | -------- | -------- | ----- | ----- | -------- |
| 12      | 0        | 0        | 0     | 14    | 1.2 min  |

Cobertura: No aplica en e2e.

Casos con defecto conocido (`test.fail()`, fallo esperado, no cuentan como fallo del run): 2.

Exit code del runner: 0.

## 2. Resultados por spec y caso

| Spec                            | CP-             | Caso                                                                                                                                              | Estado                   | Duración | Reintentos |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------- | ---------- |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-101 | M1 Auth › CP-WEB-AUTH-101 login OK de admin llega a la home y al panel /admin                                                                     | PASÓ                     | 7.4 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-102 | M1 Auth › CP-WEB-AUTH-102 login OK de cliente llega a la home del modo cliente                                                                    | PASÓ                     | 0.8 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-103 | M1 Auth › CP-WEB-AUTH-103 login OK de profesional entra al modo /pro                                                                              | PASÓ                     | 5.8 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-104 | M1 Auth › CP-WEB-AUTH-104 email inexistente muestra error generico y sigue en /login (regresion bug login:false)                                  | PASÓ                     | 0.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-105 | M1 Auth › CP-WEB-AUTH-105 password incorrecta muestra el mismo error y sigue en /login                                                            | PASÓ                     | 0.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-106 | M1 Auth › CP-WEB-AUTH-106 registro de un usuario nuevo con email unico                                                                            | PASÓ                     | 1.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-107 | M1 Auth › CP-WEB-AUTH-107 logout limpia las cookies, revoca el refresh en el backend y /admin vuelve a /login                                     | PASÓ                     | 1.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-108 | M1 Auth › CP-WEB-AUTH-108 cliente_a en /admin ve la pantalla de sin acceso (no crash)                                                             | PASÓ                     | 1.6 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-109 | M1 Auth › CP-WEB-AUTH-109 DEF-WEB-001 compliance ve las paginas legales                                                                           | DEFECTO (fallo esperado) | 12.1 s   | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-110 | M1 Auth › CP-WEB-AUTH-110 compliance no accede a las paginas de admin ajenas                                                                      | PASÓ                     | 1.8 s    | 0          |
| `e2e/real/m1-auth.spec.ts`      | CP-WEB-AUTH-111 | M1 Auth › CP-WEB-AUTH-111 la sesion sobrevive a un reload y el JWT no es visible desde JS                                                         | PASÓ                     | 1.4 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-101  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-101 admin crea, edita, oculta y borra una categoria y el cliente lo ve reflejado               | PASÓ                     | 13.1 s   | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-102  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-102 un 400 del backend (nombre > 100 caracteres) se muestra como error del campo Nombre        | PASÓ                     | 1.9 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts` | CP-WEB-CAT-103  | M2 Tabla admin de categorias con muchos registros › CP-WEB-CAT-103 DEF-WEB-002 la tabla admin de categorias pagina (no renderiza todo de una vez) | DEFECTO (fallo esperado) | 10.1 s   | 0          |

### Escaneo a11y (axe, reglas serious/critical) por página visitada

| Página                       | Violaciones (reglas) | Detalle (regla / impacto, nodos) |
| ---------------------------- | -------------------- | -------------------------------- |
| `/`                          | 0                    | —                                |
| `/admin`                     | 0                    | —                                |
| `/admin/categories`          | 1                    | color-contrast / serious x22     |
| `/admin/legal/consent-audit` | 0                    | —                                |
| `/login`                     | 0                    | —                                |
| `/pro/solicitudes`           | 0                    | —                                |
| `/register`                  | 0                    | —                                |

## 3. Defectos encontrados

| ID          | Severidad             | Caso            | Repro                                                                                                                                                                                                                                                                                                                                                                                          | Estado                                                       |
| ----------- | --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| DEF-WEB-001 | Alta                  | CP-WEB-AUTH-109 | Login como `compliance@e2e.tekoapp.local` (permisos solo `legal.config:manage` y `legal.consent-audit:read`) y abrir `/admin/legal/consent-audit`: se ve "No tenés acceso a esta sección". Causa: `isStaffUser` (`src/core/auth/permissions.ts`) exige `admin:all` o `dashboard:read` y el layout de `/admin` bloquea todo `/admin/*`; el rol COMPLIANCE nunca puede usar sus páginas legales. | Abierto (no corregido por regla de la oleada; `test.fail()`) |
| DEF-WEB-002 | Media                 | CP-WEB-CAT-103  | Con 25+ categorías, `/admin/categories` renderiza todas las filas sin paginación. `GET /categories/all` ignora `page`/`pageSize` (verificado: `page=2&pageSize=20` devuelve las 32) y `CategoriesTable` no pasa `pagination` al `DataTable`. Lista sin cota en el DOM.                                                                                                                         | Abierto (`test.fail()`)                                      |
| DEF-WEB-003 | Media (a11y, serious) | CP-WEB-A11Y-001 | axe `color-contrast` en `/admin/categories`: el `Badge` de visibilidad ("Visible", `td:nth-child(5)`) no alcanza el contraste mínimo; 22 nodos con 25+ categorías (2 con la tabla chica).                                                                                                                                                                                                      | Abierto (no falla el run)                                    |

Observaciones de backend (no son defectos de Web, para el repo del Backend): `POST /categories` acepta `name: ""` (201); `GET /categories/all` ignora `page`/`pageSize` y devuelve todo.

## 4. Desvíos y observaciones

- **3 corridas e2e real consecutivas, estables**: corrida 1 (con `pnpm build`) 14 pasaron / 0 fallaron en 1.5 min; corrida 2, 14/0 en 55.4 s; corrida 3, 14/0 en 1.2 min. "14 pasaron" incluye 2 casos con defecto conocido (`test.fail()`, fallo esperado). Sin flakies ni reintentos (`retries: 0`).
- Entorno: backend `pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve` (rama `test/e2e-w1-auth-catalogos`, no modificada). `scripts/e2e-real/serve.mjs` lee `WEB_CLIENT_SECRET` de `.env.e2e` y la clave pública de `GET /auth/public-key` en cada arranque (las claves RSA no están en `.env.e2e`, se generan por proceso del backend); nada se escribe a disco ni se commitea.
- Desvío: el login de Web siempre aterriza en `/`; no hay redirect por rol. Admin y profesional llegan a `/admin` y `/pro` por los links de la home (CP-WEB-AUTH-101/103). No se cambió el comportamiento de producto.
- Desvío: `requiredNewPassword` → Web no tiene pantalla de "crear contraseña" (el endpoint `auth/create-password` existe pero no hay flujo): se muestra como error informativo (CP-WEB-AUTH-002).
- Desvío: el admin sin permisos ahora ve la pantalla de "sin acceso" en vez del redirect silencioso a `/` (layout `/admin`); un 403 de un query del cliente llega a `app/error.tsx`, que muestra la misma pantalla.
- Desvío de alcance: "la tabla admin pagina contra el backend real" no es verificable tal cual: el backend no pagina categorías y la tabla no tiene paginación (DEF-WEB-002).
- Desvío: el 429 (toast con `retryAfter`) no se ejerce en e2e real (el rate limit de e2e está relajado ×1000); queda cubierto con unitarias (CP-WEB-AUTH-009/012).
- Se tocó `playwright.config.ts` solo para excluir `**/real/**` del `testIgnore` (si no, el CI con fake-backend recogería los specs reales) y el texto del 401 en `e2e/login.spec.ts` (ahora genérico). El fake-backend no se tocó.
- Técnico: las cookies del backend son `Secure; SameSite=Strict`; Chromium las acepta en `http://127.0.0.1`, pero el jar de `APIRequestContext` no las reenvía, por eso `newBffContext` arma el header `Cookie` a mano. La app mantiene conexiones abiertas, así que `networkidle` es best-effort (timeout 4 s) antes del escaneo axe.
- Incidente en el entorno e2e (no en el repo): durante la exploración un script de sondeo borró la categoría semilla "Plomería" del stack descartable; se restauró con `pnpm e2e:seed` (idempotente) antes de las corridas. Las categorías de prueba (`E2E-<runId>*`) se borran en el propio spec.

## 5. Evidencia

- Reporte HTML de Playwright: `test/qa/informes/artefactos/playwright-report-real/index.html` (abrir con `pnpm exec playwright show-report test/qa/informes/artefactos/playwright-report-real`; ignorado por git).
- JSON crudo: `test/qa/informes/artefactos/e2e-real.json` (ignorado por git).
- Trazas/capturas de fallos: `test-results/` (ignorado por git).

## 6. Veredicto

**APROBADO CON OBSERVACIONES.** Criterio: 14/14 casos conforme a lo esperado en 3/3 corridas estables (12 pasan; 2 son defectos conocidos documentados con `test.fail()`), sin flakies. Quedan abiertos DEF-WEB-001 (alta), DEF-WEB-002 y DEF-WEB-003 (media) para triage; ninguno bloquea W2 pero DEF-WEB-001 debe resolverse antes de dar por cerrado el rol compliance.
