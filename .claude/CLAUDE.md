@../AGENTS.md

# tekoapp-frontend-web

## Dominio

Portal web de administración/gestión de TekoApp: marketplace de servicios profesionales
(conecta usuarios que solicitan servicios con profesionales que los ofrecen). Consume la API de
`TekoApp-Backend` (NestJS) para gestionar usuarios, profesionales, servicios, pagos, promociones,
calificaciones, roles/permisos, categorías, ubicaciones en tiempo real y notificaciones.

Next.js 16 (App Router) actúa como **BFF (Backend-for-Frontend)**: el browser nunca le habla
directo a la API de NestJS. Todo pasa por `src/app/api/*` (Route Handlers), que ocultan la URL
real del backend, el secret de Basic Auth de cliente y el cifrado RSA del password.

## Estructura clave

- `src/app/` — SOLO routing/HTTP (paralelo a `api/*` del backend). Sin lógica de negocio acá.
  - `src/app/api/backend/[...path]/route.ts` — proxy reverso genérico autenticado hacia el backend
  - `src/app/api/auth/{login,refresh,logout}/route.ts` — rutas de auth dedicadas (cifrado RSA, cookies)
  - `src/app/api/realtime/ticket/route.ts` — emite el access token para el handshake de socket.io
- `src/features/<dominio>/` — lógica + UI por dominio (paralelo a `modules/*` del backend): `api.ts`,
  `hooks.ts`, `schemas.ts` (zod), `components/`
- `src/components/ui/` — primitivos shadcn/ui (Base UI) — código copiado al repo, no una dependencia opaca
- `src/components/layout/` — AppShell, Sidebar, Topbar, DataTable
- `src/design-system/tokens/` — `tokens.json` (fuente de verdad de marca) → `pnpm tokens:build` genera `theme.generated.css`
- `src/core/api-client/` — tipos generados de OpenAPI (`pnpm generate:api-types`) + fetch wrapper fino
- `src/core/auth/` — helpers de sesión server-only + constantes `PERMISSIONS` (espejo del enum del backend)
- `src/core/stores/` — Zustand (estado de UI, no de servidor)
- `src/lib/` — utilidades puras sin dependencias de framework
- `src/proxy.ts` — protección de rutas del dashboard (Next 16 renombró `middleware.ts` → `proxy.ts`)

**Regla de oro**: ningún componente cliente llama la URL del backend directo — siempre a través
de `core/api-client` (que a su vez pega a `/api/backend/*`, nunca a `BACKEND_API_URL`).

## Cliente que este proyecto es

| Repo                      | Rol                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `TekoApp-Backend`         | API NestJS que este portal consume vía el proxy BFF                                                 |
| `TekoApp-Frontend-Mobile` | App Flutter — compartirá `design-system/tokens/tokens.json` (formato W3C) cuando arranque esa etapa |

## Auth (ver `documentation/architecture.md` para el detalle completo)

- Login: el browser manda `{email, password}` en texto plano a `/api/auth/login` (mismo origen);
  el server de Next.js cifra el password con RSA-OAEP (clave pública del backend) y agrega el
  header Basic Auth de cliente antes de llamar al backend real.
- El proxy genérico (`/api/backend/[...path]`) reenvía cookies del browser al backend Y las
  traduce a header `Authorization: Bearer` (el backend protege rutas leyendo Bearer, no cookie).
- Nunca leer/escribir `accessToken`/`refreshToken` desde código cliente — son httpOnly.
- Permisos: `req.user.permissions`/`.roles` son arrays planos de strings en el JWT del backend —
  usar las constantes de `core/auth/permissions.ts` (espejo de `PERMISSIONS` enum del backend) en
  vez de strings sueltos.

## Design system

- Nunca hardcodear colores/espaciado — siempre clases Tailwind que resuelven a variables de
  `design-system/tokens/theme.generated.css` (`bg-primary`, `text-muted-foreground`, etc.) o,
  para un shade específico de la escala de marca, `var(--teko-primary-500)`.
  Ver `rules/design-system.md`.
- Todo componente nuevo en `components/ui/` o `components/layout/` lleva su story de Storybook.

## Reglas críticas

- DTOs/tipos vienen de `pnpm generate:api-types` (OpenAPI del backend) — nunca escribir tipos a
  mano que ya existen ahí.
- Formularios: siempre `react-hook-form` + `zod` (nunca estado manual de inputs para forms reales).
- Server state: siempre TanStack Query (nunca `useEffect` + `fetch` manual para datos del servidor).
- Todo componente/hook nuevo lleva test (Vitest + Testing Library); flujos críticos (login, un CRUD
  representativo) llevan Playwright.
- `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings antes de cerrar cualquier tarea.
- @./rules/typescript.md
- @./rules/test.md
- @./rules/design-system.md
- @./rules/infra.md
- @./rules/auth.md

## Agentes

- @./agents/code-reviewer.md
- @./agents/testing-agent.md
- @./agents/tdd-refactor.md
- @./agents/design-system-agent.md

## graphify

Este proyecto tiene un grafo de conocimiento en `graphify-out/` (god nodes, comunidades,
relaciones cross-file), generado 2026-07-21 sobre `src/`, `.claude/`, `ci/`, etc.

- Para preguntas sobre el código, primero correr `graphify query "<pregunta>"` cuando
  `graphify-out/graph.json` exista. Usar `graphify path "<A>" "<B>"` para relaciones y
  `graphify explain "<concepto>"` para conceptos puntuales — devuelven un subgrafo acotado, mucho
  más chico que `GRAPH_REPORT.md` o un grep crudo.
- Leer `graphify-out/GRAPH_REPORT.md` completo solo para revisión de arquitectura amplia, o cuando
  query/path/explain no alcancen.
- Después de modificar código, correr `graphify update .` para mantener el grafo al día (solo AST,
  sin costo de API).
