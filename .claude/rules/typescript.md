# TypeScript / React rules

## Next.js 16 — APIs que cambiaron respecto a versiones anteriores

Ver `@../../AGENTS.md`. Puntos que rompen asunciones típicas de Next 14/15:

- `middleware.ts` → **`proxy.ts`**, función `middleware()` → `proxy()`. `skipMiddlewareUrlNormalize`
  → `skipProxyUrlNormalize`. El archivo `middleware.ts` sigue existiendo pero solo para runtime
  `edge` — este proyecto usa `proxy.ts` (runtime Node, que es lo que necesitamos para leer cookies
  httpOnly y hacer fetch al backend).
- `cookies()`, `headers()`, `params`, `searchParams` son **siempre async** — no existe fallback
  síncrono. Siempre `await cookies()` / `await params`.
- No usar `serverRuntimeConfig`/`publicRuntimeConfig` (`next/config`) — están removidos. Usar env
  vars planas o `NEXT_PUBLIC_*`.
- `next/image`: `images.domains` está deprecado, usar `remotePatterns`.

## Estructura de carpetas obligatoria (`src/features/<dominio>/`)

```
src/features/<dominio>/
├── api.ts          # llamadas fetch a /api/backend/<dominio>/... vía core/api-client
├── hooks.ts         # hooks de TanStack Query (useXxxQuery, useXxxMutation)
├── schemas.ts        # zod schemas (request/response, reutilizados en react-hook-form)
├── types.ts          # solo tipos que NO vienen del OpenAPI generado (estado local de UI, etc.)
└── components/
    ├── XxxList.tsx
    ├── XxxForm.tsx
    └── XxxTable.tsx
```

- `src/app/<ruta>/page.tsx` importa componentes de `features/<dominio>/components` — el `page.tsx`
  solo maneja lo específico de Next (metadata, layout de la ruta, leer `searchParams`).
- Nunca poner lógica de negocio ni llamadas a `fetch` directamente en `app/`.

### Generador de scaffolding (`pnpm generate:feature`)

Para una feature nueva de tipo "tabla" (CRUD admin: listado + crear/editar + eliminar) no armes la
estructura a mano — usá el generador, que replica el patrón de `src/features/categories`:

```
pnpm generate:feature <nombre-kebab-singular> [plural-kebab] [--paginated] [--force]
```

- Ejemplo: `pnpm generate:feature promotion` (listado plano) o `pnpm generate:feature promotion --paginated`
  (listado server-side paginado, patrón de `features/users`).
- Deriva el plural con una heurística simple (`s` / `es` / `ies`); si falla, pasá el plural como 2º
  argumento (`pnpm generate:feature category-tax category-taxes`).
- Crea `api.ts`, `hooks.ts`, `schemas.ts`, `components/<plural>-table.tsx`,
  `components/<singular>-form-dialog.tsx`, `components/new-<singular>-button.tsx` y
  `src/app/admin/<plural>/page.tsx`. Aborta si algo ya existe (salvo `--force`).
- La salida es un **esqueleto editable** (campos de ejemplo `name`/`description`), no un archivo
  re-generable: ajustá los campos a los DTOs reales tras correr `pnpm generate:api-types`, y agregá
  los `.test.tsx` que exige `rules/test.md`. Script: `scripts/generate-feature.mjs`.

## Componentes

- Un componente por archivo, nombre de archivo = nombre del componente (`UserTable.tsx` exporta `UserTable`).
- `"use client"` solo cuando el componente realmente necesita interactividad/hooks de estado —
  todo lo demás es Server Component por default (Next 16 así lo exige).
- Props tipadas con `interface XxxProps` explícito — nunca `any`, nunca inferir props desde el uso.
- Nunca lógica de negocio en componentes de `components/ui/` (son primitivos shadcn puros) — esa
  lógica vive en `features/<dominio>/`.

## Datos y tipos

- Tipos de request/response del backend: SIEMPRE los generados por `pnpm generate:api-types`
  (`src/core/api-client/types.generated.ts`) — nunca copiar/adivinar la forma de un DTO a mano.
- Si un endpoint no está bien anotado en el Swagger del backend (pasa con algunos, ver
  `documentation/architecture.md`), documentar la discrepancia en un comentario corto en el
  `api.ts` correspondiente en vez de silenciarla con `as any`.
- Formularios: `zod` schema en `schemas.ts` + `useForm({ resolver: zodResolver(schema) })` —
  nunca `useState` por campo para un form real.
- Server state (cualquier dato que venga del backend): siempre a través de un hook de TanStack
  Query en `hooks.ts` — nunca `useEffect` + `fetch` manual.
- Estado de UI puro (sidebar colapsado, tema, filtros de tabla no persistidos): Zustand en
  `core/stores/`. No usar Zustand para datos que deberían ser cache de servidor (eso es TanStack Query).

## Imports

- Alias `@/*` → `src/*`. Nunca imports relativos que suban más de un nivel (`../../..`) — si hace
  falta, la estructura de carpetas está mal y hay que moverla.
- No barrel exports (`index.ts` re-exportando todo un directorio) en `features/` — importar el
  archivo específico. Sí se permite un `index.ts` en `components/ui/` si el registro de shadcn lo genera así.

## Lecciones de integración con el backend real (no solo mocks)

- **El backend envuelve toda respuesta exitosa** en `{success, data, message, timestamp, path}`
  (`TransformInterceptor` global) — `core/api-client/client.ts#apiFetch` ya lo desenvuelve
  (`isBackendEnvelope`, exportado, reusalo en cualquier fetch nuevo que no pase por `apiFetch`).
  Los mocks de MSW/fake-backend devuelven el DTO pelado a propósito — no envolver ahí.
- **El JWT real NO lleva `permissions`/`roles`/`id`** (a diferencia del token del fake-backend) —
  es delgado a propósito, el backend los recalcula fresco por request. Nunca decodificar el JWT
  client-side para permisos: usar `getSession()` (server) o `useSessionScopeQuery()` (client),
  ambos pegan a `GET /auth/scope`.
- **RSC**: nunca pasar un array de objetos con un componente/ícono como valor de campo (`icon:
LucideIcon`) como prop desde un Server Component a un Client Component — rompe en runtime
  ("Functions cannot be passed directly to Client Components"), invisible para `tsc`/Vitest, solo
  lo detecta un browser real. Pasar un string (`variant`) y resolver items/íconos DENTRO del
  Client Component (ver `AppSidebar`).
- Antes de dar una fase por cerrada, probar contra el backend real (no solo MSW/fake-backend) al
  menos una vez por dominio nuevo — varios bugs de esta lista fueron invisibles en ambos mocks.
- **El backend envuelve toda respuesta de ERROR** en `{success:false, error:{code, message,
error, errorCode?, details?, timestamp, path}}` (`HttpExceptionFilter` global) — `message`
  nunca está en la raíz del body. `parseErrorResponse` en `client.ts` asumió lo contrario durante
  un tiempo y el bug fue invisible porque los mocks de MSW/`e2e/fake-backend` devuelven el DTO
  pelado (`{message}`) a propósito: la app entera mostraba el fallback genérico `Error {status}
en {path}` para cualquier error real del backend, en todas las features, y ningún test ni mock
  lo detectó. Fix: `extractErrorInfo()` en `client.ts` soporta las dos formas (envelope real y DTO
  pelado) y expone `errorCode`/`details` tipados en `ApiError` — reusalo ahí, no dupliques el
  parseo en un fetch nuevo que maneje errores a mano (mismo motivo que la tarea C-04).
- **Un tipo `string` en parámetro anula la protección del codegen** — si un helper o
  comparación espera una value de un union generado (`Professional['verificationStatus']`) pero
  recibe un parámetro tipado como `string` ancho, TypeScript no advierte y la protección se
  pierde completamente. Ese es exactamente el drift que `pnpm generate:api-types` existe para
  prevenir. Ejemplo real: el frontend comparaba `verificationStatus` contra literales en
  minúscula cuando el backend siempre envió MAYÚSCULAS, las comparaciones nunca matchearon, y
  nadie lo vio hasta correr `generate:api-types` real — el tipo `string` permitió que la variable
  tipada genéricamente llegara a un helper que la esperaba narrow sin que `tsc` protestara.
  Regla: si la función espera un tipo de unión concreto, hazlo exhaustivo (p.ej. con `as const`
  - `Record<typeof literal, ...>`), nunca genérico.
- **El prefijo `/v1` se inyecta en un único punto**: `resolveBackendPath()` en
  `src/core/api-client/backend-paths.ts`. Todas las rutas que salen hacia el backend real pasan
  por ahí (backend-proxy, login/route, register/route, session.ts). Cambios de versionado se
  hace aquí, no esparcido en múltiples archivos. **Excepción**: `/tekoapp-backend/api/healthcheck`
  es `VERSION_NEUTRAL` en el backend (K8s/Render probes) así que NO lleva `/v1` — si algún día
  hay un caller de ese endpoint, deberá saltear `resolveBackendPath` o se agregará lógica de
  excepción.

## Permisos

- Nunca comparar `user.permissions.includes('algo')` con un string literal — usar las constantes
  de `src/core/auth/permissions.ts` (espejo 1:1 del enum `PERMISSIONS` del backend,
  `src/common/enum/permissions.enum.ts` en `TekoApp-Backend`). Si el backend agrega un permiso
  nuevo, actualizar acá también (no hay codegen automático para esto, a diferencia de los DTOs).

- SIEMPRE dejar `pnpm lint`, `pnpm check:types` y `pnpm test` en 0 errores/warnings antes de cerrar
  una tarea — mismo estándar que `TekoApp-Backend`.
