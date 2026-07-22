# TekoApp-Frontend-Web — Arquitectura profunda

> Este documento contiene el razonamiento detrás de decisiones no obvias. `context.md` se mantiene
> corto (< 150 líneas) a propósito — el detalle vive acá y se referencia desde ahí.

## Por qué Next.js (App Router) y no un SPA React puro

El backend (`TekoApp-Backend`) tiene un auth flow con tres fricciones que necesitan resolverse en
un servidor, nunca en el browser:

1. El password se cifra RSA-OAEP con la clave pública del backend antes de loguear.
2. El login requiere Basic Auth de **cliente** (clientId/secret compartido por toda la app web,
   no por usuario) — un secreto que no puede vivir en JS del browser.
3. Las rutas protegidas del backend leen `Authorization: Bearer <token>`, pero el propio backend
   setea el token como cookie httpOnly — el browser no puede leer esa cookie para reenviarla como
   header.

Un SPA no tiene dónde ejecutar código server-side propio para resolver estos tres puntos sin
exponer secretos. Next.js con Route Handlers sí — de ahí la decisión, confirmada además por
research (BFF pattern es el estándar 2026 para este escenario, ver fuentes en la sesión de
scaffold inicial).

## El proxy BFF genérico (`app/api/backend/[...path]/route.ts`)

En vez de escribir un route handler por cada endpoint del backend (decenas), hay **uno solo**,
dinámico, que:

1. Toma `request.method`, `request.body`, `request.nextUrl.search` y los reenvía a
   `${BACKEND_API_URL}/${path.join('/')}` (URL real, solo en env var server-only).
2. Reenvía el header `Cookie` del browser tal cual al backend — así `refresh-token` (que el
   backend lee de cookie) sigue funcionando sin lógica especial.
3. Además, lee el valor de la cookie `accessToken` de la request entrante y lo agrega como header
   `Authorization: Bearer <valor>` en la request saliente — esto puentea la inconsistencia
   Bearer-vs-Cookie del backend, invisible para el browser y sin tocar código del backend.
4. Lee los headers `Set-Cookie` de la respuesta del backend y los reenvía tal cual al browser.
5. Para los endpoints que requieren Basic Auth de cliente (login, onboarding, forgot-password,
   verificación — ver tabla abajo), inyecta el header `Authorization: Basic base64(clientId:secret)`
   leído de env vars server-only.

Endpoints del backend que requieren Basic Auth (mapeados por el agente Explore en la sesión de
scaffold inicial — confirmar contra el Swagger si el backend cambia esto):

| Endpoint                           | Método                       |
| ---------------------------------- | ---------------------------- |
| `/auth/login`                      | POST                         |
| `/auth/create-password`            | POST                         |
| `/auth/forgot-password`            | PUT                          |
| `/auth/refresh-token`              | POST (+ `jwt-refresh` guard) |
| `/auth/verification-status`        | GET                          |
| `/auth/email/send-verification`    | POST                         |
| `/auth/email/send-create-password` | POST                         |
| `/auth/email/send-password-reset`  | POST                         |
| `/onboarding`                      | POST                         |

## Login (`app/api/auth/login/route.ts`) — ruta dedicada, no parte del proxy genérico

El cifrado RSA es una operación con estado (necesita la clave pública) y solo aplica a este único
endpoint — se mantiene como ruta dedicada en vez de meter un `if` especial dentro del proxy
genérico:

1. El browser manda `{ email, password }` en texto plano, por HTTPS, a **nuestro propio dominio**.
2. El route handler cifra `password` con `crypto.publicEncrypt` (RSA-OAEP-SHA256) usando
   `BACKEND_JWT_PUBLIC_KEY`, arma el `LoginUserDTO` (`{ email, encryptedPassword }`).
3. Llama al backend con Basic Auth de cliente.
4. Reenvía los `Set-Cookie` de la respuesta (accessToken + refreshToken) al browser tal cual.

## Logout (`app/api/auth/logout/route.ts`)

El backend no expone un endpoint de logout. Esta ruta simplemente responde con
`Set-Cookie: accessToken=; Max-Age=0` (e ídem refreshToken) desde el dominio del frontend —
suficiente dado que el access token expira en 15 minutos de cualquier forma.

## Realtime — el "ticket" de socket (`app/api/realtime/ticket/route.ts`)

`LocationsGateway` del backend (namespace `/locations`) espera el JWT en
`handshake.auth.token` — pero el access token vive en una cookie httpOnly, invisible para el JS
del browser que abre el socket. Solución pragmática (no la más "pura" pero sí la más simple —
KISS):

- `GET /api/realtime/ticket`, autenticado por la cookie de sesión (server-side), devuelve el valor
  actual del access token en el body de la respuesta JSON.
- El cliente lo usa **una sola vez, en memoria**, para el handshake de `socket.io-client` — nunca
  se persiste (ni localStorage ni estado global de larga vida).
- Mejora futura, no implementada ahora por KISS: reemplazar esto por un proxy real de WebSocket a
  través de un servidor Node custom (Next.js App Router no soporta upgrade de WebSocket en Route
  Handlers) si el "ticket" resulta insuficiente en producción.

## Riesgos conocidos del backend (documentados, no arreglados desde acá)

Hallazgos del mapeo de API (agente Explore, sesión de scaffold inicial) que el equipo de backend
debería revisar en algún momento — **no se tocan desde este repo**:

- `analytics` y `tracking` (controllers) no tienen ningún guard — son públicos. Se consumen tal
  cual por ahora (el dashboard de overview los usa) pero es una señal a confirmar con backend.
- El `LocationsGateway` verifica el JWT del socket con una configuración de `JwtModule` que parece
  usar un secreto simétrico distinto del par RS256 usado por los access tokens REST — si el
  handshake de socket falla en la práctica, es la primera hipótesis a revisar (no un bug de este
  frontend).
- Versionado de rutas inconsistente en el backend: `auth`, `onboarding`, `roles-permission`,
  `users` (algunos endpoints), `uploads` usan `@Version('1')` (→ `/api/v1/...`); el resto no. El
  cliente de API (`core/api-client`) hardcodea esto por dominio — si el backend versiona algo
  nuevo, hay que actualizar el path base de ese dominio a mano. **Confirmado contra el Swagger
  real** (sesión sesión_13/scaffold — se generaron los tipos con `pnpm generate:api-types` contra
  un backend local corriendo).
- `prisma/seed.ts` del backend (antes de esta sesión, completamente vacío) solo siembra el
  `ApiClientCredential` del cliente "tekoapp-web" — **no siembra tablas de referencia** (tipos de
  documento, niveles de acceso, etc.). Se confirmó end-to-end: `POST /onboarding` a través del
  proxy BFF llega correctamente al backend (Basic Auth + cifrado RSA + routing todo funcionan),
  pero `UsersDBService.create()` falla con "Foreign key constraint violated" porque esas tablas de
  referencia están vacías. Crear un usuario de prueba real requiere que el equipo de backend
  siembre esos datos — está fuera del alcance de este repo.

## Permisos

El JWT del backend trae `permissions: string[]` y `roles: string[]` planos (no objetos anidados),
a diferencia de la respuesta más rica de `GET /auth/scope`. `core/auth/permissions.ts` espeja el
enum `PERMISSIONS` del backend (`src/common/enum/permissions.enum.ts` en `TekoApp-Backend`) — sin
codegen automático para esto todavía; si el backend agrega un permiso, hay que copiarlo a mano acá.
