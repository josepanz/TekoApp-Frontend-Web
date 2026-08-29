# Fase 0005 — Registro de usuarios y recuperación de cuenta

Spec de diseño, NO implementada todavía. Contrato completo:
`openspec/specs/user-registration-and-account-recovery.md`. Depende de
`TekoApp-Backend/openspec/changes/0007-user-registration-and-account-emails.md` solo para el
riesgo de `GET /auth/user-verify` (el resto del backend ya existe y funciona hoy).

## Antes de empezar

Leer `openspec/specs/user-registration-and-account-recovery.md` completo, en particular la sección
"Riesgo explícito a resolver ANTES de implementar `verify-email/confirm`" — no implementar esa
pantalla puntual hasta confirmar el comportamiento real de `GET /auth/user-verify`.

## Objetivo

Implementar las páginas y rutas BFF de `openspec/specs/user-registration-and-account-recovery.md`.

## Tareas

- [ ] `src/app/api/auth/register/route.ts` — cifrado RSA-OAEP + `POST /onboarding`.
- [ ] `src/app/api/auth/forgot-password/request/route.ts` + `.../confirm/route.ts`.
- [ ] `src/app/api/auth/verify-email/route.ts` — confirmar primero el riesgo de sesión.
- [ ] `src/app/(auth)/register/page.tsx` — `react-hook-form` + `zod`, checkbox `acceptTerms` real.
- [ ] `src/app/(auth)/forgot-password/page.tsx`.
- [ ] `src/app/(auth)/reset-password/page.tsx` (lee `token`/`email` de query).
- [ ] `src/app/(auth)/verify-email/confirm/page.tsx` (lee `token`/`email` de query).
- [ ] Links cruzados en `login/page.tsx`.
- [ ] Tests (Vitest + Testing Library) por página + MSW handlers; Playwright para el flujo de
      registro completo (mismo criterio que login, ya cubierto en e2e).
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Checkpoint de salida

- [ ] Un usuario nuevo se registra, recibe el email de verificación (backend), y puede confirmar
      su cuenta desde el link del email.
- [ ] Un usuario que olvidó su contraseña la recupera de punta a punta (pedir → recibir email →
      confirmar nueva contraseña → loguearse con la nueva).
- [ ] Ningún mensaje de error revela si un email existe o no en la plataforma.
