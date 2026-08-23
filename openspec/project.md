# Contexto del proyecto (web)

Ver `.claude/CLAUDE.md` (dominio, estructura `src/app`/`src/features`/`src/core`, BFF, auth,
design system) y `.claude/rules/*.md` — este archivo no los repite, solo ancla qué asume esta
carpeta `openspec/`:

- Next.js 16 App Router como BFF — ningún componente cliente llama la URL del backend directo,
  siempre vía `core/api-client` → `/api/backend/*`.
- Estructura obligatoria por dominio: `src/features/<dominio>/` (`api.ts`, `hooks.ts`,
  `schemas.ts`, `components/`) + `src/app/admin/<dominio>/page.tsx` — usar
  `pnpm generate:feature` como punto de partida para cualquier feature CRUD nueva.
- Tipos de request/response del backend: siempre `pnpm generate:api-types` — nunca copiar la forma
  de un DTO a mano.
- Formularios: `react-hook-form` + `zod`. Server state: TanStack Query. Tablas: `DataTable`
  compartido.
- Permisos: constantes de `src/core/auth/permissions.ts` (espejo del enum del backend) — nunca
  strings sueltos.

## Qué documenta esta carpeta

Las superficies de backoffice/staff de las 6 features grandes pedidas por José el 2026-08-22 (ver
`TekoApp-Frontend-Mobile/openspec/decisions.md` para el pedido original completo). No documenta
retroactivamente las pantallas de admin ya implementadas antes de esta fecha
(`users`/`professionals`/`services`/`payments`/`promotions`/`ratings`/`roles-permission`/
`categories`/`locations`/`notifications`).
