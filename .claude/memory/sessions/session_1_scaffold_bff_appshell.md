# Sesión 1 — 2026-07-20/21 — Scaffold inicial, capa BFF/auth, AppShell

## Qué se hizo

**Fase 1 (andamiaje):** Next.js 16 + Tailwind 4 + shadcn/ui (Base UI), design tokens propios
(Style Dictionary), `.claude/` completo (CLAUDE.md, rules, agents, memory, docs), CI/CD (GitHub
Actions + semantic-release + husky/commitlint, mismo patrón que el backend), Dockerfile +
manifiestos K8s para develop/qa/master, README real.

**Cambios complementarios en TekoApp-Backend:** `FRONTEND_URL`/`WEB_CLIENT_SECRET` agregados a
`.env`/`.env.example`/`ci/*/0_env.example`; `prisma/seed.ts` (estaba completamente vacío) ahora
siembra el `ApiClientCredential` del cliente "tekoapp-web".

**Fase 2 (BFF/auth/AppShell):** proxy reverso genérico autenticado (`api/backend/[...path]`),
login con cifrado RSA-OAEP-SHA256 (mismo algoritmo que `CryptoHelper.encrypt()` del backend),
logout, ticket de realtime para el handshake de socket.io, `proxy.ts` (Next 16 renombró
`middleware.ts`), `core/config` (env schema zod con validación lazy), `core/auth` (permisos
espejados del enum del backend, decodificación de sesión desde el JWT), `core/api-client` con
tipos generados por `pnpm generate:api-types` contra un backend local real. AppShell completo:
Sidebar colapsable con 11 items de navegación, Topbar con toggle de tema y menú de usuario,
providers de TanStack Query y next-themes (dark-first).

**Infraestructura local resuelta (con intervención directa en el sistema del usuario, con su
autorización explícita en cada paso):**

- Intento de instalar Memurai (Redis para Windows) vía winget → falló por un error de Windows
  Installer (SFXCA temp dir, error 5) no relacionado a esta sesión — se abandonó ese camino.
- Docker CLI (ya instalado por el usuario vía winget) no tenía motor detrás — se evaluó instalar
  Docker Engine completo en WSL2 vs. Redis nativo en WSL2; el usuario eligió la opción más liviana.
- Se instaló Debian en WSL2 (`wsl --install -d Debian`) y `redis-server` nativo (apt, systemd) —
  ~4MB de memoria en reposo.
- Se descubrió que WSL2 apaga su VM cuando queda idle (sin proceso `wsl.exe` activo), tirando
  abajo Redis con ella. `vmIdleTimeout=-1` en `.wslconfig` no tuvo efecto observable. Fix real:
  un proceso `wsl.exe -d Debian -- sleep infinity` corriendo en background mantiene la VM viva.
  Intento de automatizarlo con una tarea programada de Windows (`Register-ScheduledTask`) falló
  por "Acceso denegado" — mismo tipo de restricción de permisos que bloqueó el instalador de
  Memurai. Queda documentado en `context.md` cómo retomarlo manualmente tras un reinicio.
- Se generó un par de llaves RSA reales para desarrollo local (`openssl genrsa`) y se cargaron en
  `.env` del backend y `.env.local` del frontend — antes eran placeholders truncados
  (`MIIEogIBAAKCAQEA...`) que nunca hubieran funcionado.
- Se descubrió y corrigió un bug real: `REDIS_HOST=localhost` fallaba porque Node resolvía
  `localhost` a `::1` (IPv6) primero y WSL2 solo reenvía IPv4 — se cambió a `127.0.0.1` explícito
  en el `.env` del backend.

## Decisiones tomadas

- Base UI (no Radix) es el primitivo real detrás de shadcn/ui actualmente — se descubrió que usa
  la prop `render` en vez de `asChild` para composición; documentado en `rules/design-system.md`
  porque no es obvio y se repetirá en cada componente nuevo con trigger/slot.
- El env schema de `core/config/env.ts` valida de forma **lazy** (no al importar el módulo) porque
  Next.js ejecuta los módulos de las rutas durante "collect page data" en el build, sin env vars
  reales disponibles todavía — validar eager rompía `pnpm build` siempre.
- `server-only`/`client-only` necesitan alias a un módulo vacío en `vitest.config.ts` — chequean
  la condición de resolución "react-server" que solo entiende el bundler de Next, no Vitest.
- Refresh token NO tiene ruta BFF dedicada — el proxy genérico ya lo resuelve (Basic Auth +
  reenvío de cookies), no hace falta un route handler aparte.

## Archivos modificados

Ver `documentation/context.md` para el estado completo — demasiados archivos para listar
individualmente en esta sesión de scaffold (fases 1 y 2 completas). Puntos de entrada clave:
`.claude/documentation/architecture.md` (razonamiento profundo), `src/core/api-client/backend-proxy.ts`,
`src/core/auth/rsa-encrypt.ts` (+ su test), `src/app/(dashboard)/layout.tsx`.

En `TekoApp-Backend`: `.env`, `.env.example`, `ci/*/0_env.example`, `prisma/seed.ts`.

## Fase 3 (misma sesión, continuación): slice Login → Overview → Users

**Qué se hizo:** `features/auth` (LoginForm real: react-hook-form + zod +
`@hookform/resolvers/standard-schema` — no `zodResolver`, ver nota abajo), `features/analytics`
(StatCards + `Overview`), `features/users` (tabla paginada sobre `components/layout/data-table.tsx`,
diseñado para reusarse en toda la Fase 4). 18 tests unitarios (Vitest+RTL+MSW) y 5 e2e (Playwright)
contra un **fake-backend** propio (`e2e/fake-backend/server.mjs`) — no el backend real.

**Bugs reales encontrados y corregidos (no obvios, documentados en `rules/design-system.md`):**

- `@hookform/resolvers/zod`'s `zodResolver` no tipa bien contra `zod@4.4.3` instalado (choque de
  versión interna del paquete) — se usó `@hookform/resolvers/standard-schema` en su lugar (zod v4
  implementa Standard Schema nativamente), sin ningún downgrade de dependencias.
- Base UI compone con la prop `render`, no `asChild` (a diferencia de Radix) — rompía el tipado
  en `SidebarMenuButton`/`DropdownMenuTrigger`.
- **`DropdownMenuLabel` (vía `Menu.GroupLabel` de Base UI) exige un `<DropdownMenuGroup>`
  ancestro** — sin él, tira "Base UI error #31" que tumba TODA la página en producción (no solo
  el menú). Encontrado recién en e2e (Vitest/jsdom no lo detectó porque el popup ni abre en jsdom
  sin polyfills de `ResizeObserver`/`scrollIntoView`/`hasPointerCapture`, ya agregados a
  `src/test/setup.ts`).
- `next start` NO funciona con `output: 'standalone'` (Next tira warning explícito) — se cambió
  `pnpm start` para correr `.next/standalone/server.js` directo, con `postbuild` copiando
  `public/`+`.next/static` al lado (`scripts/prepare-standalone.mjs`). Necesario también para que
  el e2e corriera contra un build real y no `next dev` (`next dev` reproducía otro bug: React
  hidrata después de que Playwright ya interactuó con el HTML, causando un submit nativo del
  `<form>` como GET con query string en vez del handler de React).
- Playwright: `webServer.url` solo acepta 2xx/3xx/400-403 como "listo" — un 404 (lo que devuelve
  el fake-backend en `/`) lo deja esperando el timeout completo. Se usó `port` en vez de `url`
  para ese webServer. También: Playwright resuelve `localhost` a `::1` antes que a `127.0.0.1` en
  este entorno (mismo bug que Redis/backend en Fase 2) — todo el config usa `127.0.0.1` explícito.

## Próximos pasos

- [ ] Fase 4: resto de dominios (professionals, services, payments, promotions, ratings,
      roles-permission, categories, notifications, locations con mapa + realtime)
- [ ] Pedir al equipo de backend que siembre document types/access levels (bloquea crear un
      usuario de prueba real vía onboarding — ver `architecture.md`)
- [ ] Recordar: Redis en WSL2 se volvió a caer durante esta sesión (matar procesos node por PID
      probablemente mató también el `sleep infinity` que lo mantenía vivo) — correr
      `wsl -d Debian -- sleep infinity &` antes de levantar el backend real

## Estado al cerrar

Fases 1, 2 y 3 completas y verificadas: `lint`/`check:types`/`format`/`test` (18 unitarios) y
`test:e2e` (5 Playwright, contra fake-backend) todos en verde, `build` produce un standalone
funcional. Login real, Overview y Users funcionando de punta a punta con datos tipados desde
OpenAPI. Falta la Fase 4 en adelante — resto de dominios de negocio.
