# CP-AUTH — Autenticación, sesión y matriz de errores (M1)

Oleada W1. Incluye el login (401, `login:false`), el logout contra `POST /auth/logout`, el mapeo de errores 400/429/403 y los e2e contra el backend real. Formato según `C:\workspace\QA-DOC-STANDARD.md` §2.

### CP-WEB-AUTH-001 — Un 401 del login muestra un mensaje genérico y rechaza

| Campo              | Contenido                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-001                                                                                                |
| Título             | Un 401 del login muestra un mensaje genérico y rechaza                                                         |
| Tipo / Nivel       | unitaria                                                                                                       |
| Prioridad          | P0                                                                                                             |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; bug conocido login                                    |
| Precondiciones     | Vitest + jsdom + MSW; sin backend.                                                                             |
| Pasos              | 1. Responder 401 `INVALID_CREDENTIALS` a `/api/auth/login`.<br>2. Llamar `login()`.                            |
| Datos de prueba    | email/password cualquiera                                                                                      |
| Resultado esperado | `login()` rechaza con `ApiError` 401 y mensaje "Email o contraseña incorrectos." (sin el detalle del backend). |
| Automatizado en    | `src/features/auth/api.test.ts` — `CP-WEB-AUTH-001 ...`                                                        |

### CP-WEB-AUTH-002 — 200 con login:false + requiredNewPassword no es éxito

| Campo              | Contenido                                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-002                                                                                                                                                                                                  |
| Título             | 200 con login:false + requiredNewPassword no es éxito                                                                                                                                                            |
| Tipo / Nivel       | unitaria                                                                                                                                                                                                         |
| Prioridad          | P0                                                                                                                                                                                                               |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; bug conocido: Web redirigía como éxito                                                                                                                  |
| Precondiciones     | Vitest + jsdom + MSW; sin backend.                                                                                                                                                                               |
| Pasos              | 1. Responder 200 `{login:false, requiredNewPassword:true}`.<br>2. Llamar `login()`.                                                                                                                              |
| Datos de prueba    | usuario legacy sin credencial                                                                                                                                                                                    |
| Resultado esperado | Rechaza con `ApiError` `REQUIRED_NEW_PASSWORD` y mensaje de crear contraseña. Web no tiene pantalla de crear contraseña (el endpoint `auth/create-password` existe en el backend): queda como error informativo. |
| Automatizado en    | `src/features/auth/api.test.ts` — `CP-WEB-AUTH-002 ...`                                                                                                                                                          |

### CP-WEB-AUTH-003 — Cualquier otro login:false es error

| Campo              | Contenido                                                 |
| ------------------ | --------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-003                                           |
| Título             | Cualquier otro login:false es error                       |
| Tipo / Nivel       | unitaria                                                  |
| Prioridad          | P0                                                        |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1   |
| Precondiciones     | Vitest + jsdom + MSW; sin backend.                        |
| Pasos              | 1. Responder 200 `{login:false}`.<br>2. Llamar `login()`. |
| Datos de prueba    | —                                                         |
| Resultado esperado | Rechaza con `ApiError` `LOGIN_FAILED`.                    |
| Automatizado en    | `src/features/auth/api.test.ts` — `CP-WEB-AUTH-003 ...`   |

### CP-WEB-AUTH-004 — 200 con login:true resuelve

| Campo              | Contenido                                                |
| ------------------ | -------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-004                                          |
| Título             | 200 con login:true resuelve                              |
| Tipo / Nivel       | unitaria                                                 |
| Prioridad          | P0                                                       |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1  |
| Precondiciones     | Vitest + jsdom + MSW; sin backend.                       |
| Pasos              | 1. Responder 200 `{login:true}`.<br>2. Llamar `login()`. |
| Datos de prueba    | —                                                        |
| Resultado esperado | Resuelve con el resultado.                               |
| Automatizado en    | `src/features/auth/api.test.ts` — `CP-WEB-AUTH-004 ...`  |

### CP-WEB-AUTH-005 — El formulario no redirige ante login:false

| Campo              | Contenido                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-005                                                                                             |
| Título             | El formulario no redirige ante login:false                                                                  |
| Tipo / Nivel       | unitaria (componente)                                                                                       |
| Prioridad          | P0                                                                                                          |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; regresión del bug login:false                      |
| Precondiciones     | Vitest + jsdom + MSW; sin backend.                                                                          |
| Pasos              | 1. Renderizar `<LoginForm/>`.<br>2. Completar y enviar con el BFF respondiendo `login:false`.               |
| Datos de prueba    | legacy@tekoapp.com.py                                                                                       |
| Resultado esperado | Se muestra el error y `router.push` no se llama.                                                            |
| Automatizado en    | `src/features/auth/components/login-form.test.tsx` — `no redirige y muestra error ante 200 con login:false` |

### CP-WEB-AUTH-006 — El logout del BFF llama a POST auth/logout con Basic Auth y la cookie refreshToken

| Campo              | Contenido                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-006                                                                                                                                         |
| Título             | El logout del BFF llama a POST auth/logout con Basic Auth y la cookie refreshToken                                                                      |
| Tipo / Nivel       | unitaria                                                                                                                                                |
| Prioridad          | P0                                                                                                                                                      |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; contrato `POST /auth/logout`                                                                   |
| Precondiciones     | `fetch` y `env` mockeados.                                                                                                                              |
| Pasos              | 1. Invocar `POST` de la ruta con cookies `accessToken`, `refreshToken` y otra.                                                                          |
| Datos de prueba    | refreshToken=rt-123                                                                                                                                     |
| Resultado esperado | Una llamada a `<backend>/v1/auth/logout` con `Authorization: Basic ...` y `Cookie: refreshToken=rt-123` solamente; responde 200 y limpia ambas cookies. |
| Automatizado en    | `src/app/api/auth/logout/route.test.ts` — `CP-WEB-AUTH-006 ...`                                                                                         |

### CP-WEB-AUTH-007 — El logout limpia las cookies aunque el backend responda 500

| Campo              | Contenido                                                       |
| ------------------ | --------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-007                                                 |
| Título             | El logout limpia las cookies aunque el backend responda 500     |
| Tipo / Nivel       | unitaria                                                        |
| Prioridad          | P0                                                              |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1         |
| Precondiciones     | `fetch` mockeado a 500.                                         |
| Pasos              | 1. Invocar `POST` de la ruta.                                   |
| Datos de prueba    | —                                                               |
| Resultado esperado | 200 y cookies `accessToken`/`refreshToken` limpiadas.           |
| Automatizado en    | `src/app/api/auth/logout/route.test.ts` — `CP-WEB-AUTH-007 ...` |

### CP-WEB-AUTH-008 — El logout limpia las cookies aunque el backend esté caído

| Campo              | Contenido                                                       |
| ------------------ | --------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-008                                                 |
| Título             | El logout limpia las cookies aunque el backend esté caído       |
| Tipo / Nivel       | unitaria                                                        |
| Prioridad          | P0                                                              |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1         |
| Precondiciones     | `fetch` mockeado a rechazar.                                    |
| Pasos              | 1. Invocar `POST` de la ruta sin cookies.                       |
| Datos de prueba    | —                                                               |
| Resultado esperado | 200 y cookies limpiadas.                                        |
| Automatizado en    | `src/app/api/auth/logout/route.test.ts` — `CP-WEB-AUTH-008 ...` |

### CP-WEB-AUTH-009 — extractErrorInfo extrae errors[] del 400 y retryAfter del 429

| Campo              | Contenido                                                                         |
| ------------------ | --------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-009                                                                   |
| Título             | extractErrorInfo extrae errors[] del 400 y retryAfter del 429                     |
| Tipo / Nivel       | unitaria                                                                          |
| Prioridad          | P1                                                                                |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; contrato de errores W1   |
| Precondiciones     | Funciones puras.                                                                  |
| Pasos              | 1. Parsear un envelope 400 con `error.errors[]` y uno 429 con `error.retryAfter`. |
| Datos de prueba    | `{field,value,constraints}`                                                       |
| Resultado esperado | `fieldErrors` con el primer mensaje por campo; `retryAfter` numérico.             |
| Automatizado en    | `src/core/api-client/form-errors.test.ts` — `CP-WEB-AUTH-009 ...`                 |

### CP-WEB-AUTH-010 — applyApiFieldErrors aplica solo los campos conocidos del formulario

| Campo              | Contenido                                                                     |
| ------------------ | ----------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-010                                                               |
| Título             | applyApiFieldErrors aplica solo los campos conocidos del formulario           |
| Tipo / Nivel       | unitaria                                                                      |
| Prioridad          | P1                                                                            |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1                       |
| Precondiciones     | `setError` simulado.                                                          |
| Pasos              | 1. Invocar el helper con un `ApiError` 400 con un campo conocido y uno ajeno. |
| Datos de prueba    | email conocido; campoAjeno                                                    |
| Resultado esperado | Devuelve true y llama `setError` solo para `email` (type `server`).           |
| Automatizado en    | `src/core/api-client/form-errors.test.ts` — `CP-WEB-AUTH-010 ...`             |

### CP-WEB-AUTH-011 — applyApiFieldErrors ignora errores que no son 400

| Campo              | Contenido                                                         |
| ------------------ | ----------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-011                                                   |
| Título             | applyApiFieldErrors ignora errores que no son 400                 |
| Tipo / Nivel       | unitaria                                                          |
| Prioridad          | P1                                                                |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1           |
| Precondiciones     | —                                                                 |
| Pasos              | 1. Invocar con `Error` genérico y con `ApiError` 500.             |
| Datos de prueba    | —                                                                 |
| Resultado esperado | Devuelve false; `setError` no se llama.                           |
| Automatizado en    | `src/core/api-client/form-errors.test.ts` — `CP-WEB-AUTH-011 ...` |

### CP-WEB-AUTH-012 — Un 429 muestra un toast con el retryAfter

| Campo              | Contenido                                                             |
| ------------------ | --------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-012                                                       |
| Título             | Un 429 muestra un toast con el retryAfter                             |
| Tipo / Nivel       | unitaria                                                              |
| Prioridad          | P1                                                                    |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1               |
| Precondiciones     | `sonner` mockeado.                                                    |
| Pasos              | 1. Renderizar un query que falla con `ApiError` 429, `retryAfter=42`. |
| Datos de prueba    | retryAfter=42                                                         |
| Resultado esperado | `toast.error` con el texto que incluye 42 segundos.                   |
| Automatizado en    | `src/core/providers/query-provider.test.tsx` — `CP-WEB-AUTH-012 ...`  |

### CP-WEB-AUTH-013 — Un 403 de un query llega al error boundary; un 500 no

| Campo              | Contenido                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-013                                                                                          |
| Título             | Un 403 de un query llega al error boundary; un 500 no                                                    |
| Tipo / Nivel       | unitaria                                                                                                 |
| Prioridad          | P1                                                                                                       |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; matriz de error transversal (403 como pantalla) |
| Precondiciones     | Boundary de prueba.                                                                                      |
| Pasos              | 1. Renderizar un query que falla con 403.<br>2. Renderizar otro que falla con 500.                       |
| Datos de prueba    | —                                                                                                        |
| Resultado esperado | El 403 se propaga al boundary (en la app, `app/error.tsx` muestra "sin acceso"); el 500 no se propaga.   |
| Automatizado en    | `src/core/providers/query-provider.test.tsx` — `CP-WEB-AUTH-013 ...`                                     |

### CP-WEB-AUTH-101 — Login OK de admin aterriza en /admin

| Campo              | Contenido                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-101                                                                                                                                                                 |
| Título             | Login OK de admin aterriza en /admin                                                                                                                                            |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                              |
| Prioridad          | P0                                                                                                                                                                              |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; aterrizaje por rol (ítem 4, 7d5326f)                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`.                                    |
| Pasos              | 1. Abrir `/login`.<br>2. Ingresar como admin.<br>3. Ir a `/` (home del modo cliente) y volver con "Ir al panel de administración".                                              |
| Datos de prueba    | admin@tekoapp.com.py / Tekoapp123!                                                                                                                                              |
| Resultado esperado | Tras el login la URL es `/admin` (sin pantalla de sin acceso); `/` sigue accesible y el link lleva de vuelta a `/admin`. Axe sin violaciones serious/critical en ambas páginas. |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-101 ...`                                                                                                                              |

### CP-WEB-AUTH-102 — Login OK de cliente llega a la home del modo cliente

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-102                                                                                                                              |
| Título             | Login OK de cliente llega a la home del modo cliente                                                                                         |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1                                                                                      |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Ingresar como cliente_a.                                                                                                                  |
| Datos de prueba    | cliente_a@e2e.tekoapp.local                                                                                                                  |
| Resultado esperado | Home con el link "Solicitar" y sin el link al panel de administración.                                                                       |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-102 ...`                                                                                           |

### CP-WEB-AUTH-103 — Login OK de profesional aterriza en /pro

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-103                                                                                                                              |
| Título             | Login OK de profesional aterriza en /pro                                                                                                     |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; aterrizaje por rol (ítem 4, 7d5326f)                                                |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Ingresar como pro_aprobado.                                                                                                               |
| Datos de prueba    | pro_aprobado@e2e.tekoapp.local                                                                                                               |
| Resultado esperado | El login lleva a `/pro`, que redirige a `/pro/solicitudes` (URL final).                                                                      |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-103 ...`                                                                                           |

### CP-WEB-AUTH-104 — Email inexistente: error genérico y sigue en /login

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-104                                                                                                                              |
| Título             | Email inexistente: error genérico y sigue en /login                                                                                          |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; regresión del bug login:false                                                       |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Ingresar un email que no existe con cualquier password.                                                                                   |
| Datos de prueba    | no-existe@e2e.tekoapp.local                                                                                                                  |
| Resultado esperado | Se ve "Email o contraseña incorrectos." y la URL sigue en `/login`.                                                                          |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-104 ...`                                                                                           |

### CP-WEB-AUTH-105 — Password incorrecta: mismo error, sin cookie de sesión

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-105                                                                                                                              |
| Título             | Password incorrecta: mismo error, sin cookie de sesión                                                                                       |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1                                                                                      |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Ingresar cliente_a con password incorrecta.                                                                                               |
| Datos de prueba    | Incorrecta-1!                                                                                                                                |
| Resultado esperado | Mismo mensaje; URL `/login`; no existe la cookie `accessToken`.                                                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-105 ...`                                                                                           |

### CP-WEB-AUTH-106 — Registro de un usuario nuevo con email único

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-106                                                                                                                              |
| Título             | Registro de un usuario nuevo con email único                                                                                                 |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P1                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1                                                                                      |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Abrir `/register`.<br>2. Completar el formulario con un email único por corrida y aceptar términos.<br>3. Enviar.                         |
| Datos de prueba    | `web.e2e.<ts>.<rand>@e2e.tekoapp.local`                                                                                                      |
| Resultado esperado | Redirige a `/login?registered=1`.                                                                                                            |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-106 ...`                                                                                           |

### CP-WEB-AUTH-107 — Logout limpia cookies, revoca el refresh y /admin vuelve a /login

| Campo              | Contenido                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-107                                                                                                                                                                           |
| Título             | Logout limpia cookies, revoca el refresh y /admin vuelve a /login                                                                                                                         |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                                        |
| Prioridad          | P0                                                                                                                                                                                        |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; contrato `POST /auth/logout`                                                                                                     |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`.                                              |
| Pasos              | 1. Login admin; guardar el valor de `refreshToken`.<br>2. Menú de usuario > Cerrar sesión.<br>3. Ir a `/admin`.<br>4. Llamar `POST /auth/refresh-token` del backend con el refresh viejo. |
| Datos de prueba    | admin                                                                                                                                                                                     |
| Resultado esperado | Las cookies `accessToken`/`refreshToken` desaparecen; `/admin` redirige a `/login?from=%2Fadmin`; el refresh viejo da 401 en el backend.                                                  |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-107 ...`                                                                                                                                        |

### CP-WEB-AUTH-108 — cliente_a en /admin ve la pantalla de sin acceso (no crash)

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-108                                                                                                                              |
| Título             | cliente_a en /admin ve la pantalla de sin acceso (no crash)                                                                                  |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; matriz de error: 403 renderizado                                                    |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Login cliente_a.<br>2. Ir a `/admin`.                                                                                                     |
| Datos de prueba    | cliente_a                                                                                                                                    |
| Resultado esperado | Se muestra el heading "No tenés acceso a esta sección" (`data-testid=access-denied`).                                                        |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-108 ...`                                                                                           |

### CP-WEB-AUTH-109 — Compliance ve las páginas legales (DEF-WEB-001: Corregido, 3d32892)

| Campo              | Contenido                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-109                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Título             | Compliance ve las páginas legales (DEF-WEB-001: Corregido, 3d32892)                                                                                                                                                                                                                                                                                                                                                                 |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Prioridad          | P1                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; DEF-WEB-001 → **Corregido** (3d32892)                                                                                                                                                                                                                                                                                                                                      |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`.                                                                                                                                                                                                                                                                                        |
| Pasos              | 1. Login compliance.<br>2. Visitar `/admin/legal/consent-audit`, `/document-versions`, `/retention-policies`.                                                                                                                                                                                                                                                                                                                       |
| Datos de prueba    | compliance@e2e.tekoapp.local (permisos `legal.config:manage`, `legal.consent-audit:read`)                                                                                                                                                                                                                                                                                                                                           |
| Resultado esperado | Las páginas cargan con su heading y sin pantalla de sin acceso. Corrección: el layout de `/admin` deja entrar a cualquier staff (`isStaffUser` = al menos un permiso de `STAFF_PERMISSIONS`) y cada sección exige el suyo (`AdminSectionGate`); el picker de usuario de las auditorías degrada sin `user:read` (un 403 de `GET /users` ya no manda la página a "sin acceso"). Antes marcado `test.fail()`; ahora es un test normal. |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-109 ...`                                                                                                                                                                                                                                                                                                                                                                                  |

### CP-WEB-AUTH-110 — Compliance no accede a páginas de admin ajenas

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-110                                                                                                                              |
| Título             | Compliance no accede a páginas de admin ajenas                                                                                               |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P1                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1                                                                                      |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Login compliance.<br>2. Ir a `/admin/users`.                                                                                              |
| Datos de prueba    | compliance                                                                                                                                   |
| Resultado esperado | Pantalla de sin acceso dentro del shell (compliance entra al backoffice pero no a Usuarios: gate por sección).                               |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-110 ...`                                                                                           |

### CP-WEB-AUTH-111 — La sesión sobrevive a un reload y el JWT no es visible desde JS

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-111                                                                                                                              |
| Título             | La sesión sobrevive a un reload y el JWT no es visible desde JS                                                                              |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P0                                                                                                                                           |
| Trazabilidad       | plan maestro `TEKOAPP-E2E-MASTER-PLAN.md` M1; oleada W1; plan maestro M1 (JWT nunca visible en JS)                                           |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Login cliente_a.<br>2. Recargar.<br>3. Leer `document.cookie`.                                                                            |
| Datos de prueba    | cliente_a                                                                                                                                    |
| Resultado esperado | Sigue en `/` con la home; `document.cookie` no contiene `accessToken` ni `refreshToken` (httpOnly).                                          |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-111 ...`                                                                                           |

### CP-WEB-AUTH-112..115 — Gate por sección del backoffice (AdminSectionGate)

| Campo              | Contenido                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-112..115                                                                                                                                                             |
| Título             | Gate por sección del backoffice (AdminSectionGate)                                                                                                                               |
| Tipo / Nivel       | unitaria                                                                                                                                                                         |
| Prioridad          | P0                                                                                                                                                                               |
| Trazabilidad       | DEF-WEB-001 → Corregido (3d32892)                                                                                                                                                |
| Precondiciones     | `getSession` y `next/navigation` mockeados.                                                                                                                                      |
| Pasos              | 1. Renderizar el gate con la sesión indicada y una sección.                                                                                                                      |
| Datos de prueba    | permisos de compliance (`legal.config:manage`, `legal.consent-audit:read`) y `admin:all`                                                                                         |
| Resultado esperado | 112: compliance entra a consentAudit; 113: sin acceso en users; 114: `/admin` redirige a `/admin/legal/document-versions`; 115: admin:all ve el dashboard sin redirect.          |
| Automatizado en    | `src/components/layout/admin-section-gate.test.tsx`; `src/core/auth/permissions.test.ts`; `src/components/layout/app-sidebar.test.tsx` (sidebar filtrado: compliance solo Legal) |

### CP-WEB-AUTH-116..120 — Aterrizaje por rol: resolvePostLoginPath

| Campo              | Contenido                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-116..120                                                                                                                                             |
| Título             | Aterrizaje por rol: resolvePostLoginPath                                                                                                                         |
| Tipo / Nivel       | unitaria                                                                                                                                                         |
| Prioridad          | P1                                                                                                                                                               |
| Trazabilidad       | Ítem 4, aterrizaje por rol (7d5326f)                                                                                                                             |
| Precondiciones     | Funciones puras.                                                                                                                                                 |
| Pasos              | 1. Llamar `resolvePostLoginPath` con permisos, `isProfessional` y `from`.                                                                                        |
| Datos de prueba    | admin:all, compliance, profesional, cliente; `from` válido e inseguro                                                                                            |
| Resultado esperado | admin → `/admin`; compliance → primera sección permitida; profesional → `/pro`; cliente → `/`; `from` interno tiene prioridad; `from` externo o `//x` se ignora. |
| Automatizado en    | `src/core/auth/landing.test.ts`                                                                                                                                  |

### CP-WEB-AUTH-121..125 — Login: redirección por rol y prioridad del from

| Campo              | Contenido                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-121..125                                                                                      |
| Título             | Login: redirección por rol y prioridad del from                                                           |
| Tipo / Nivel       | unitaria                                                                                                  |
| Prioridad          | P1                                                                                                        |
| Trazabilidad       | Ítem 4 (7d5326f)                                                                                          |
| Precondiciones     | MSW sirve `auth/scope` y `professionals/me`.                                                              |
| Pasos              | 1. Enviar el formulario de login con cada perfil.                                                         |
| Datos de prueba    | admin, compliance, profesional, cliente y `?from=%2Fadmin%2Fusers`                                        |
| Resultado esperado | `router.push` a `/admin`, `/admin/legal/document-versions`, `/pro`, `/` y `/admin/users` respectivamente. |
| Automatizado en    | `src/features/auth/components/login-form.test.tsx` — `aterrizaje por rol`                                 |

### CP-WEB-AUTH-126 — El from (returnTo) tiene prioridad sobre el aterrizaje por rol

| Campo              | Contenido                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-126                                                                                            |
| Título             | El from (returnTo) tiene prioridad sobre el aterrizaje por rol                                             |
| Tipo / Nivel       | e2e (backend real)                                                                                         |
| Prioridad          | P1                                                                                                         |
| Trazabilidad       | Ítem 4 (7d5326f); `proxy.ts` agrega `?from=`                                                               |
| Precondiciones     | Backend real arriba (ver CP-WEB-AUTH-101).                                                                 |
| Pasos              | 1. Sin sesión abrir `/admin/users` (redirige a `/login?from=%2Fadmin%2Fusers`).<br>2. Ingresar como admin. |
| Datos de prueba    | admin                                                                                                      |
| Resultado esperado | La URL final es `/admin/users` (no `/admin`).                                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-126 ...`                                                         |

### CP-WEB-AUTH-127 — Compliance aterriza en su primera sección permitida (Legal)

| Campo              | Contenido                                                              |
| ------------------ | ---------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-127                                                        |
| Título             | Compliance aterriza en su primera sección permitida (Legal)            |
| Tipo / Nivel       | e2e (backend real)                                                     |
| Prioridad          | P1                                                                     |
| Trazabilidad       | Ítem 4 (7d5326f)                                                       |
| Precondiciones     | Backend real arriba.                                                   |
| Pasos              | 1. Ingresar como compliance.                                           |
| Datos de prueba    | compliance                                                             |
| Resultado esperado | La URL es `/admin/legal/document-versions` sin pantalla de sin acceso. |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-127 ...`                     |

### CP-WEB-AUTH-128 — El picker de usuario no propaga el 403 de GET /users

| Campo              | Contenido                                                          |
| ------------------ | ------------------------------------------------------------------ |
| ID                 | CP-WEB-AUTH-128                                                    |
| Título             | El picker de usuario no propaga el 403 de GET /users               |
| Tipo / Nivel       | unitaria                                                           |
| Prioridad          | P1                                                                 |
| Trazabilidad       | DEF-WEB-001 (3d32892); compliance no tiene `user:read`             |
| Precondiciones     | MSW responde 403; QueryClient con el `throwOnError` de la app.     |
| Pasos              | 1. Renderizar `UserCombobox`.                                      |
| Datos de prueba    | —                                                                  |
| Resultado esperado | El combobox sigue visible (no se monta el boundary de sin acceso). |
| Automatizado en    | `src/features/users/components/user-combobox.test.tsx`             |

### CP-WEB-AUTH-129 — Compliance ve solo Legal en el sidebar y /admin lo redirige a su primera sección

| Campo              | Contenido                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-AUTH-129                                                                                                                                                        |
| Título             | Compliance ve solo Legal en el sidebar y /admin lo redirige a su primera sección                                                                                       |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                     |
| Prioridad          | P1                                                                                                                                                                     |
| Trazabilidad       | DEF-WEB-001 → Corregido (3d32892)                                                                                                                                      |
| Precondiciones     | Backend real arriba.                                                                                                                                                   |
| Pasos              | 1. Ingresar como compliance.<br>2. Ir a `/admin`.<br>3. Revisar el sidebar.                                                                                            |
| Datos de prueba    | compliance                                                                                                                                                             |
| Resultado esperado | `/admin` redirige a `/admin/legal/document-versions`; el sidebar muestra Documentos legales y Auditoría de consentimiento y no Usuarios, Resumen, Pagos ni Categorías. |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-AUTH-129 ...`                                                                                                                     |

## Estado de defectos

| Defecto            | Estado              |
| ------------------ | ------------------- |
| DEF-WEB-001 (alta) | Corregido (3d32892) |
