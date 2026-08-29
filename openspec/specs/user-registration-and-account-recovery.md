# Spec: Registro de usuarios y recuperación de cuenta (Web)

Backend: `TekoApp-Backend/openspec/specs/user-registration-and-account-emails.md` (leer primero —
ahí está el contrato completo de endpoints, DTOs, y el riesgo explícito de `GET /auth/user-verify`
requiriendo sesión activa).

## Objetivo

Hoy `src/app/(auth)/` solo tiene `login/` — no existe ninguna forma de que un usuario nuevo se
registre, verifique su email, o recupere su contraseña desde el portal web. El backend ya expone
todo lo necesario (`POST /onboarding`, `PUT /auth/forgot-password`, `GET /auth/user-verify`, etc.)
— esta spec agrega las pantallas y rutas BFF que faltan, siguiendo el mismo patrón ya usado por
`login` (cifrado RSA-OAEP server-side antes de pegarle al backend real).

## Alcance

**Incluye**: página de registro, página de "olvidé mi contraseña" (pide email), página de
confirmación de reseteo (nueva contraseña + token del link del email), página de confirmación de
verificación de email (consume el link del email de bienvenida), enlaces cruzados desde `login`
("¿No tenés cuenta?" / "¿Olvidaste tu contraseña?").

**No incluye**: ningún cambio al contrato del backend (spec de backend documenta lo ya existente,
sin cambios salvo lo que ahí se liste); no incluye onboarding de profesional (ya existe, fuera de
alcance — esto es solo alta de `Users`).

## Rutas nuevas (BFF — mismo patrón que `src/app/api/auth/login/route.ts`)

Todas viven en `src/app/api/auth/*`, nunca llaman al backend directo desde el browser — mismo
principio que el resto del repo (`core/api-client` → `/api/backend/*`, o una ruta BFF dedicada
cuando hace falta cifrado RSA-OAEP pre-login, como ya hace `login`).

| Ruta BFF                                 | Backend real                           | Qué hace                                                                                                                |
| ---------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `POST /api/auth/register`                | `POST /onboarding`                     | Cifra `password`/`confirmPassword` con RSA-OAEP (clave pública del backend, mismo helper que `login`) antes de reenviar |
| `POST /api/auth/forgot-password/request` | `POST /auth/email/send-password-reset` | Dispara el email — Basic Auth de cliente agregado server-side                                                           |
| `POST /api/auth/forgot-password/confirm` | `PUT /auth/forgot-password`            | Cifra la nueva contraseña con RSA-OAEP antes de reenviar `{token, encryptedNewPassword, encryptedConfirmPassword}`      |
| `POST /api/auth/verify-email`            | `GET /auth/user-verify`                | Ver riesgo explícito abajo — este endpoint exige `Bearer` (sesión activa), no un token de query suelto                  |

## Páginas nuevas (`src/app/(auth)/`)

- `register/page.tsx` — form (nombre, apellido, email, teléfono, password, confirmar password,
  checkbox `acceptTerms`) vía `react-hook-form` + `zod`. `acceptTerms` es el mismo campo que ya
  exige `POST /onboarding` — no un checkbox decorativo. Tras éxito: mensaje "revisá tu correo para
  verificar tu cuenta", sin auto-login (a confirmar contra el hallazgo del backend sobre sesión).
- `forgot-password/page.tsx` — pide email, llama `forgot-password/request`, mensaje genérico
  ("si el email existe, te llegó un correo") — nunca confirmar/negar si el email existe
  (enumeración de usuarios).
- `reset-password/page.tsx` — **ruta exacta que el email de recuperación ya asume**
  (`/auth/reset-password?token=...&email=...`, ver spec de backend) — lee `token`/`email` de la
  URL, form de nueva contraseña + confirmar, llama `forgot-password/confirm`.
- `verify-email/confirm/page.tsx` — **ruta exacta que el email de verificación ya asume**
  (`/auth/verify-email/confirm?email=...&token=...`) — ver riesgo explícito abajo antes de
  implementar, el diseño de esta pantalla depende de si hace falta sesión activa o no.
- `login/page.tsx` (existente) — agregar 2 links: "¿No tenés cuenta? Registrate" →
  `/auth/register`, "¿Olvidaste tu contraseña?" → `/auth/forgot-password`.

## Riesgo explícito a resolver ANTES de implementar `verify-email/confirm`

El backend (`GET /auth/user-verify`) usa `JwtAuthGuard` — exige sesión activa. Si el registro NO
deja al usuario logueado, esta pantalla no puede funcionar como un link de email típico (clickeado
en cualquier momento, desde cualquier dispositivo/browser, sin sesión). Antes de implementar esta
pantalla: confirmar con el equipo de backend (o el checkpoint de `TekoApp-Backend`
`openspec/changes/0007-*.md`) si esto ya se resolvió ahí — si no, esta pantalla debe manejar el
caso "sin sesión" mostrando "iniciá sesión primero y volvé a intentar", nunca fallar en silencio.

## Fuera de alcance de esta spec

Preferencias de notificación por email (backlog futuro), onboarding de profesional (ya existe).

## Riesgos / límites explícitos

- Mismo cifrado RSA-OAEP que `login` — reusar el helper server-side existente, no reimplementar.
- Enumeración de usuarios: `forgot-password/request` y `register` nunca deben revelar si un email
  ya existe en la respuesta (mensaje genérico en ambos casos).
