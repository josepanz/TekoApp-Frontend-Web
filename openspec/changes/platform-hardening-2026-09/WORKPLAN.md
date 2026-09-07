# WORKPLAN — Endurecimiento de plataforma, tajada Web (`platform-hardening-2026-09`)

> **Auditoría y especificación**: Opus 5 (2026-09-04), sobre la rama `audit/2026-09-04`,
> partiendo de `develop` en `f8ef477`.
> **Ejecución**: Sonnet, workflow por workflow, en el orden de este archivo.
>
> Este archivo es autocontenido: no hace falta leer la conversación que lo originó ni la
> auditoría transversal. Todo lo que el modelo ejecutor necesita (contexto, causa raíz,
> cambio, tests, criterios de aceptación, comandos de verificación y mensaje de commit) está
> acá.
>
> Auditoría transversal completa (contexto, no requerido para ejecutar):
> `TekoApp-Backend/openspec/specs/platform-audit-2026-09.md`.

---

## 0. Cómo usar este archivo

- **Un workflow = una sesión de trabajo.** No mezclar workflows en un mismo commit.
- Cada tarea tiene un ID (`C-01`, `G-02`, …). Al terminarla, marcá su casilla en la tabla del
  §8 y escribí en la misma línea el hash del commit.
- **Antes de cambiar código, ejecutá la "Verificación previa" de la tarea.** Los números de
  línea son del estado de la rama al 2026-09-04 y pueden correrse. Si la verificación previa NO
  reproduce el problema, **no toques nada**: anotalo en §8 como "no reproduce" y seguí.
- Los hallazgos marcados **[VERIFICADO A MANO]** los confirmé abriendo el archivo yo mismo.
- **Este repo tiene documentación que envejeció y genera falsos positivos.** `.claude/rules/auth.md`
  declara abierto un bug de `getSession()` que **ya está corregido**, y `.claude/rules/test.md`
  describe mal la cobertura e2e real. Corregir ambos es parte del plan (C-05, I-03). No confíes
  en las reglas sobre el estado del código sin verificar.

---

## 0.1 Protocolo de ejecución y checkpoints

### Dónde para

**Una tarea = un checkpoint.** Al terminar cada tarea:

1. Corré la Definition of Done completa del §1.2.
2. Commiteá con el mensaje indicado en la tarea (uno por tarea, nunca agrupados).
3. Marcá la casilla en la tabla del §8 con el hash.
4. **Pará y reportá.** No sigas con la siguiente por iniciativa propia.

**Excepción**: si una tarea "no reproduce", anotala en §8 y seguí sin esperar.

### Cómo se le pide (prompts para copiar y pegar)

**Una sola tarea:**

```
Leé openspec/changes/platform-hardening-2026-09/WORKPLAN.md, secciones §0.1, §1 y la de la
tarea <ID>. Ejecutá SOLO la tarea <ID>.

Reglas:
- Hacé primero la "Verificación previa obligatoria". Si el problema no reproduce, no toques
  código: anotalo en §8 y decímelo.
- No re-audites el proyecto ni busques otros bugs: el análisis ya está hecho en el archivo.
- No lances subagentes. La tarea ya tiene los archivos y las líneas: leé esos.
- No leas openspec/decisions.md ni types.generated.ts completos: grep a la sección puntual.
- Al terminar: DoD del §1.2, commit con el mensaje de la tarea, casilla marcada en §8, y pará.
```

**Varias tareas sueltas:**

```
Leé openspec/changes/platform-hardening-2026-09/WORKPLAN.md, secciones §0.1, §1 y las de las
tareas <ID>, <ID> y <ID>. Ejecutá esas tareas en ese orden, parando y reportando entre cada
una. Mismas reglas que arriba.
```

**Un workflow entero:**

```
Leé openspec/changes/platform-hardening-2026-09/WORKPLAN.md, secciones §0.1, §1 y el
WORKFLOW <N> completo. Ejecutá todas sus tareas en el orden en que aparecen, parando y
reportando después de cada una. Mismas reglas.
```

Los workflows: **1** = contrato y robustez del BFF (§3) · **2** = accesibilidad y dominio
faltante (§4) · **3** = peso visual (§5) · **4** = sostenibilidad (§6).

### Economía de tokens (importante)

- **Una sesión nueva por workflow.**
- **Sin subagentes.** El archivo ya trae archivo, línea, causa raíz y trampas.
- **`src/core/api-client/types.generated.ts` tiene ~13.000 líneas.** Nunca lo leas entero:
  es generado, y grepear el schema puntual alcanza siempre.
- **`openspec/decisions.md` supera las 700 líneas.** Grep a la sección puntual.
- El commit por tarea permite tirar el contexto y arrancar limpio.

---

## 1. Contexto del proyecto (lo mínimo indispensable)

`TekoApp-Frontend-Web` es el portal Next.js 16 (App Router) de TekoApp, un marketplace
paraguayo que conecta clientes que piden servicios del hogar/profesionales con los
profesionales que los prestan. **Sirve tres modos desde una sola app**: `admin` (staff),
`pro` (profesional) y `(client)` (cliente).

**Actúa como BFF**: el browser **nunca** llama al backend NestJS directo. Todo pasa por
`src/app/api/backend/[...path]/route.ts`, que oculta la URL real, el secreto Basic Auth de
cliente y el cifrado RSA del password.

Estructura: `src/app/` solo routing/HTTP · `src/features/<dominio>/` (`api.ts`, `hooks.ts`,
`schemas.ts`, `components/`) · `src/components/ui/` primitivos shadcn sobre Base UI ·
`src/core/api-client/` (tipos generados del OpenAPI + fetch wrapper) · `src/core/auth/`.

Estado al momento de esta auditoría: rama `audit/2026-09-04` sobre `develop` en `f8ef477`,
**81 archivos / 251 tests en verde**.

### 1.1 Convenciones NO negociables

1. **Los commits NUNCA llevan `Co-Authored-By`, ni referencia a Claude, a un modelo o a IA.**
   Autoría exclusiva de `josepanz`.
2. **Conventional Commits en español**, porque semantic-release lee los prefijos.
3. **Nunca commitear directo a `develop`/`qa`/`master`.** Todo va en `audit/2026-09-04`.
4. **Ningún componente cliente llama la URL del backend directo** — siempre vía
   `core/api-client` → `/api/backend/*`.
5. **Nunca leer/escribir `accessToken`/`refreshToken` desde código cliente** — son httpOnly.
6. **Los tipos de DTO salen de `pnpm generate:api-types`**, nunca escritos a mano.
7. **Formularios**: siempre `react-hook-form` + `zod`. **Server state**: siempre TanStack
   Query, nunca `useEffect` + `fetch`.
8. **Nunca hardcodear colores/espaciado** — clases Tailwind que resuelven a los tokens de
   `design-system/tokens/theme.generated.css`, o `var(--teko-*)` para un shade puntual.
9. **Base UI compone con `render`, no con `asChild`.** Y `Button` con `render={<Link>}` exige
   `nativeButton={false}`.
10. **`DropdownMenuLabel` (y cualquier `GroupLabel`) exige un `Group` ancestro** — sin él tira
    "Base UI error #31" y **tumba el árbol de React entero**, no solo ese componente.
11. **Permisos**: nunca comparar contra un string literal, usar las constantes de
    `src/core/auth/permissions.ts`.
12. Todo componente/hook nuevo lleva test. Nombres en español describiendo comportamiento, AAA.
13. Todo componente nuevo en `components/ui/` o `components/layout/` lleva story de Storybook.

### 1.2 Definition of Done global (aplica a TODA tarea)

```bash
cd C:\workspace\TekoApp-Frontend-Web
pnpm check:types   # 0 errores
pnpm lint          # 0 errores, 0 warnings
pnpm test -- --run # 81+ archivos / 251+ tests, TODOS en verde
```

> **Si `check:types` falla con `Cannot find module '../../src/app/.../page.js'`**, es caché
> viejo de Next, no un error real: `rm -rf .next` y volvé a correr. Pasa al cambiar de rama.

Para cualquier tarea que toque un componente visual, además: **verificalo en tema claro Y
oscuro**. No es opcional — los tokens proveen ambos y la regla del repo lo exige.

Si un test existente se rompe: **no lo ajustes para que pase.** Entendé por qué primero.

---

## 2. Inventario de hallazgos

| ID   | Sev     | Área     | Síntoma en una línea                                                |
| ---- | ------- | -------- | ------------------------------------------------------------------- |
| C-01 | CRÍTICO | permisos | 5 permisos del backend no tienen constante tipada acá               |
| C-02 | ALTO    | permisos | Puede haber pantallas visibles que dan 403 a todo el mundo          |
| C-03 | MEDIO   | BFF      | Backend caído y backend con error se ven igual desde el cliente     |
| C-04 | ESTILO  | BFF      | El parseo de error está duplicado textual en dos funciones          |
| C-05 | BAJO    | docs     | `rules/auth.md` reporta como abierto un bug ya corregido            |
| E-01 | CRÍTICO | a11y     | `/solicitar` no se puede completar solo con teclado                 |
| F-01 | CRÍTICO | dominio  | El staff no tiene ninguna UI para ver contratos                     |
| G-01 | ALTO    | visual   | La pantalla por donde entra el ingreso es un formulario plano       |
| G-02 | MEDIO   | visual   | El embudo de captación de profesionales, igual de plano             |
| G-03 | MEDIO   | visual   | El perfil del profesional no tiene jerarquía ni preview             |
| G-04 | MEDIO   | visual   | `admin/categories` es una tabla sin un solo acento de marca         |
| G-05 | BAJO    | visual   | El detalle de rol no tiene jerarquía visual                         |
| G-06 | MEDIO   | UX       | Varias tablas muestran ids crudos en vez de nombres                 |
| I-01 | MEDIO   | admin    | Sin visor de auditoría, acciones masivas, export ni búsqueda global |
| I-02 | MEDIO   | cuenta   | Falta la UI de borrado de cuenta (bloqueada por backend)            |
| I-03 | BAJO    | tests    | Faltan e2e de los flujos críticos, y el doc los describe mal        |

**Descartados explícitamente (auditados y NO son bugs — no los "arregles"):**

- **`getSession()` YA distingue 401 de 5xx correctamente** (`src/core/auth/session.ts`: 401 →
  `null`, resto y errores de red → `SessionUnavailableError`). Lo que está desactualizado es
  `.claude/rules/auth.md`. **No "arregles" `session.ts`** — está bien.
- **Los botones solo-ícono revisados SÍ tienen `aria-label`** (paginación de `data-table`,
  `notification-bell`, `my-portfolio-manager`). La regla se está cumpliendo donde se miró.
- **El estado nunca se comunica solo por color** en las tablas revisadas (`ratings-table`,
  `payments-table` emparejan `Badge` con texto traducido).
- **No hay animación custom en `src/`**, así que la ausencia de `prefers-reduced-motion` es
  correcta por ahora. Solo aplica cuando alguien agregue la primera.
- **El esqueleto repetido de las `page.tsx`** (`h1` + descripción + un componente) es
  deliberado: lo genera `pnpm generate:feature`. La vida visual va en el componente hijo, no en
  la página. **No refactorices las páginas.**
- Los comentarios de `features/{payments,promotions,ratings}/api.ts` sobre limitaciones del
  backend **siguen siendo exactos** — se verificaron contra los controllers reales. No los
  borres pensando que están viejos.

---

## 3. WORKFLOW 1 — Contrato de permisos y robustez del BFF

**Objetivo**: que ningún límite de autorización del backend sea invisible para el sistema de
tipos de Web, y que un backend caído se distinga de un backend que responde mal.

---

### C-01 · CRÍTICO · 5 permisos del backend sin constante tipada

**[VERIFICADO A MANO]** (ambos archivos abiertos y comparados)

**Archivos**: `src/core/auth/permissions.ts` (objeto `PERMISSIONS`), contra
`TekoApp-Backend/src/common/enum/permissions.enum.ts` (~62-79).

**Síntoma**: Web solo espeja 3 grupos de permisos de auditoría
(`LEGAL.CONSENT_AUDIT_VIEW`, `AI_DISCLOSURE.AUDIT_VIEW`, `SERVICE_PROGRESS.AUDIT_VIEW`).
Faltan **cinco** que sí existen en el backend:

| Constante faltante              | Valor en el backend                    |
| ------------------------------- | -------------------------------------- |
| `PROFESSIONAL_PORTFOLIO.REVIEW` | `professional-portfolio.review:manage` |
| `PROFESSIONALS.VERIFY`          | `professionals.verification:manage`    |
| `CONTRACTS.AUDIT_VIEW`          | `contracts.audit:read`                 |
| `RATINGS.AUDIT_VIEW`            | `ratings.audit:read`                   |
| `PAYMENTS.AUDIT_VIEW`           | `payments.audit:read`                  |

**Consecuencia concreta**: `src/features/payments/api.ts` menciona `payments.audit:read` **en
un comentario**, porque no hay constante que referenciar — exactamente lo que
`.claude/rules/typescript.md` prohíbe ("nunca comparar con un string literal").

**Verificación previa obligatoria**:

```bash
grep -n "PORTFOLIO\|VERIFY\|AUDIT_VIEW" src/core/auth/permissions.ts
grep -n "PROFESSIONAL_PORTFOLIO\|PROFESSIONALS:\|CONTRACTS:\|RATINGS:\|PAYMENTS:" -A 2 \
  ../TekoApp-Backend/src/common/enum/permissions.enum.ts
```

**Cambio**: agregar los 5 grupos a `PERMISSIONS` copiando **exactamente** el string del backend
(un typo acá es un permiso que nunca matchea y no lo detecta nada). Reemplazar el string literal
del comentario de `features/payments/api.ts` por la constante nueva.

**Tests**: si existe un test que compare el espejo de permisos, extendelo. Si no, uno nuevo que
verifique que cada constante nueva tiene el valor esperado.

**Commit**: `fix(auth): espejar los 5 permisos del backend que faltaban en las constantes`

---

### C-02 · ALTO · Puede haber pantallas visibles que dan 403 a todo el mundo

**Depende de C-01** (necesitás las constantes primero).

**Síntoma potencial**: `/admin/payments` y `/admin/ratings` se renderizan **sin ningún chequeo
de permiso del lado cliente**. Si `PAYMENTS.AUDIT_VIEW` o `RATINGS.AUDIT_VIEW` no están
asignados a ningún rol, son pantallas que existen en la navegación y fallan con 403 para todos.

**Precedente exacto**: ya pasó con `service-progress.audit:read`, que está documentado en
`openspec/decisions.md` como "todavía no asignado a ningún rol". Por eso
`service-progress-section.tsx` es hoy **el único** componente del repo que esconde UI por
permiso.

**Verificación previa: YA HECHA (2026-09-06, consultando la base real).** No hace falta repetirla,
pero si querés confirmar que nada cambió:

```sql
SELECT r.name AS rol, p.name AS permiso
FROM role_permissions rp
JOIN roles r ON r.id = rp.role_id
JOIN permissions p ON p.id = rp.permission_id
ORDER BY r.name, p.name;
```

**Resultado encontrado**:

- Existe **un solo rol**: `ADMIN`.
- El catálogo `permissions` tiene **una sola fila**: `admin:all` — asignada a `ADMIN`.
- Los 5 permisos de auditoría (`ratings.audit:read`, `payments.audit:read`, `contracts.audit:read`,
  `professional-portfolio.review:manage`, `professionals.verification:manage`) **no existen ni
  siquiera como filas** en el catálogo, así que mucho menos están asignados.

**Qué significa esto para la tarea — leelo antes de codear**:

- **Hoy nadie queda afuera**, porque el único rol que existe es `ADMIN` y el gate del repo chequea
  `hasAnyPermission([...], PERMISSIONS.ADMIN.ALL)`: un admin pasa cualquier compuerta. O sea que el
  síntoma "pantalla condenada a 403 para todo el mundo" **no se manifiesta todavía**.
- **Pero el gate igual hay que aplicarlo**, y no es trabajo especulativo: en cuanto exista un rol
  que no sea `ADMIN` (staff de soporte, auditor, etc.), esas pantallas van a fallar con 403 sin que
  nada lo anticipe. Aplicalo ahora, que es barato, en vez de esperar al incidente.
- **Hallazgo colateral, NO lo arregles acá**: que el catálogo de permisos tenga una sola fila es un
  problema del backend, no de Web — es la misma clase de gap que T-04 del WORKPLAN de
  `TekoApp-Backend` (catálogos sin sembrar). Anotalo y seguí; no toques el seed desde este repo.

**Cambio**: replicar el patrón de `service-progress-section.tsx` — leer el
scope con `useSessionScopeQuery()`, chequear con `hasAnyPermission([...])` contra la constante
y `PERMISSIONS.ADMIN.ALL`, y no renderizar si no hay permiso. Es un gate de UX (para no mostrar
una pantalla condenada a 403), **no** un control de seguridad: el backend sigue siendo la
autoridad.

**Commit**: `fix(admin): ocultar las pantallas cuyo permiso no esta asignado a ningun rol`

---

### C-03 · MEDIO · Backend caído y backend con error se ven igual

**[VERIFICADO A MANO]** (`backend-proxy.ts`: el `catch` re-lanza el error crudo)

**Archivos**: `src/core/api-client/backend-proxy.ts` (~57-74),
`src/app/api/backend/[...path]/route.ts`, `src/core/api-client/client.ts` (`apiFetch`).

**Síntoma**: cuando el backend no responde (caído, DNS, timeout), el `fetch` del proxy lanza,
el `catch` **re-lanza el error crudo**, y Next lo convierte en un 500 opaco sin cuerpo
estructurado. `apiFetch` intenta `response.json()`, cae al `.text()` y sintetiza un mensaje
genérico. El resultado: el usuario ve el mismo error indistinguible tanto si el backend está
caído como si respondió mal, y ningún caller puede reaccionar distinto.

Contrasta con la disciplina que el propio repo ya aplica en `getSession()`, que **sí** separa
"no hay sesión" de "no sabemos" (ver §2, descartados).

**Verificación previa obligatoria**: leé el `catch` de `proxyToBackend` y confirmá que termina
en `throw error;` sin construir una respuesta.

**Cambio**: en el `catch`, devolver una `Response` deliberada con status **502** y cuerpo JSON
estable (sugerido: `{ message: 'backend_unreachable' }`) en vez de re-lanzar. Así `apiFetch`
construye un `ApiError` con un mensaje parseable y estable, y un caller que quiera distinguir
"servicio no disponible" puede hacerlo.

**Trampa**: no te comas el error del log. Mantené el `logger.error` con el detalle real antes de
devolver el 502 — el usuario recibe algo genérico, el operador necesita el detalle.

**Tests**: con el `fetch` global mockeado para lanzar, `proxyToBackend` devuelve 502 con ese
cuerpo; el `logger.error` fue llamado.

**Commit**: `fix(bff): devolver 502 estructurado cuando el backend no responde`

---

### C-04 · ESTILO · El parseo de error está duplicado textual

**[VERIFICADO A MANO]** (el bloque aparece 2 veces en `client.ts`)

**Archivos**: `src/core/api-client/client.ts` — el mismo bloque try/parse/`ApiError` está en
`apiFetch` y en `uploadFile`.

**Cambio**: extraé `parseErrorResponse(response, path)` y usalo en las dos. Dos lugares para
mantener sincronizados es exactamente la clase de drift que esta auditoría fue a buscar.

**Hacelo junto con C-03**, que ya toca esta zona — no abras una sesión propia para esto.

**Commit**: `refactor(api-client): extraer el parseo de error compartido`

---

### C-05 · BAJO · `rules/auth.md` reporta un bug que ya está arreglado

**[VERIFICADO A MANO]** (`session.ts` maneja 401 y 5xx por separado, correctamente)

**Archivos**: `.claude/rules/auth.md`.

**Síntoma**: la regla afirma que `getSession()` "colapsa 401 y 5xx en el mismo `null`" y lo
marca como "fix pendiente (backlog)". **Eso ya no es cierto**: el código distingue 401 (→
`null`) de cualquier otro fallo (→ `SessionUnavailableError`), incluyendo errores de red.

**Por qué importa**: cada auditoría nueva vuelve a reportar este bug inexistente y se pierde
trabajo verificándolo. Esta auditoría lo re-verificó desde cero por culpa de ese doc.

**Cambio**: reescribir esa sección de `auth.md` para describir el comportamiento **actual**
como la regla a mantener (401 → `null`, 403 nunca dispara logout, 5xx/red → lanzar), sacando el
lenguaje de "bug confirmado hoy" y "fix pendiente".

**Regla general que conviene dejar escrita ahí**: al cerrar un ítem, actualizar la regla en el
mismo commit. Ya es la convención para `decisions.md`; extenderla a `rules/`.

**Commit**: `docs(reglas): actualizar auth.md, el bug de getSession ya esta corregido`

---

## 4. WORKFLOW 2 — Accesibilidad y dominio faltante

---

### E-01 · CRÍTICO · `/solicitar` no se puede completar solo con teclado

**[VERIFICADO A MANO]** (`location-picker-map.tsx`: solo `dragend` y `map.on('click')`; hay un
`role="application"` pero ningún handler de teclado)

**Archivos**: `src/features/request-service/components/location-picker-map.tsx` (~58-83),
`src/features/request-service/components/request-service-form.tsx` (el `Input` de dirección).

**Síntoma**: la única forma de fijar la latitud/longitud de un servicio es **arrastrar el
marcador** o **hacer click en el mapa**. Un usuario que navega solo con teclado no puede
completar `/solicitar` — que es el flujo por donde entra la demanda al marketplace. Fallo
WCAG 2.1.1 (Keyboard) sobre la pantalla que genera el ingreso.

**Causa raíz**: los dos únicos caminos para setear coordenadas son eventos de mouse de Leaflet:

```ts
marker.on('dragend', () => { ... })
map.on('click', (event: L.LeafletMouseEvent) => { ... })
```

El `role="application"` con `aria-label` presente **no aporta accesibilidad real**: promete un
widget operable que no lo es. Y el `Input` de dirección del formulario es texto libre que
**nunca se sincroniza** con el mapa, así que tampoco sirve de alternativa.

**Verificación previa obligatoria** — hacelo a mano, no por código: abrí `/solicitar`, poné el
mouse a un costado y **completá el formulario usando solo Tab / Shift+Tab / Enter / flechas**.
Confirmá que no hay forma de fijar la ubicación.

**Cambio** — elegí **una**, no las dos:

- **(A) Entrada manual de coordenadas, preferida por simplicidad**: dos `Input` numéricos
  (latitud/longitud) asociados con `Label`, que actualizan el mismo estado que el mapa y mueven
  el marcador. El mapa pasa a ser una ayuda visual opcional, no el único camino.
- **(B) Geocodificar la dirección escrita**: el `Input` de dirección que ya existe dispara una
  búsqueda (Nominatim u otro servicio) y mueve el marcador. Mejor UX, pero agrega una
  dependencia de red nueva, con su rate limit y su manejo de error — y eso es más superficie
  que la que esta tarea debería abrir.

Si elegís (A), no escondas los inputs detrás de un "modo avanzado": tienen que estar en el
orden natural de tabulación.

**Además**: sacá el `role="application"` del contenedor del mapa o hacelo honesto. Un
`role="application"` que no maneja teclado es peor que no tener rol, porque le dice al lector de
pantalla que se calle y deje operar al widget.

**Tests**: un test que complete el formulario y setee ubicación **sin ningún evento de mouse**
(`userEvent.tab()` + `userEvent.type()`), y verifique que el submit lleva las coordenadas.

**Criterios de aceptación**: `/solicitar` se completa de punta a punta solo con teclado,
verificado a mano además del test.

**Commit**: `fix(a11y): permitir fijar la ubicacion sin mouse en la solicitud de servicio`

---

### F-01 · CRÍTICO · El staff no tiene ninguna UI para ver contratos

**[VERIFICADO A MANO]** (el controller existe en el backend; en Web no hay ni feature ni ruta)

**Archivos a crear**: `src/features/contracts/` (`api.ts`, `hooks.ts`, `components/`),
`src/app/admin/contracts/page.tsx`, más nav e i18n.

**Síntoma**: el backend expone `@Controller('admin/contracts')` con un `@Get()` gateado por
`CONTRACTS.AUDIT_VIEW`
(`TekoApp-Backend/src/api/contracts/controllers/admin-contracts.controller.ts:13,18-19`), y en
Web **no existe `features/contracts/` ni `app/admin/contracts/`**. Todo el dominio de contratos
de servicio — que incluye firma legal de ambas partes y generación de PDF — es invisible para
el staff en el único cliente pensado para gestionarlo.

**Verificación previa obligatoria**:

```bash
ls src/features/ | grep -i contract     # esperado hoy: sin resultados
ls src/app/admin/ | grep -i contract    # esperado hoy: sin resultados
grep -n "@Controller\|@Get\|Permissions" ../TekoApp-Backend/src/api/contracts/controllers/admin-contracts.controller.ts
```

**Cambio** — seguí el patrón de `features/professional-portfolio/`, que es la cola de revisión
más reciente y usa exactamente esta forma:

1. `api.ts` con los tipos sacados de `types.generated.ts` (**no los escribas a mano**; grepeá
   el schema de contratos ahí) y la llamada vía `apiFetch`.
2. `hooks.ts` con el hook de TanStack Query (`keepPreviousData` si es paginado).
3. `components/contracts-table.tsx` con `DataTable`, columnas con `Badge` para el estado de la
   máquina de 5 pasos, y filtro por estado.
4. `src/app/admin/contracts/page.tsx` con el shell estándar (`h1` + descripción + tabla) y
   `getTranslations('pages.admin.contracts')`.
5. Ítem en `src/components/layout/nav-items.ts` + claves en `messages/es.json` y `en.json`
   (**las dos**, o `check:types` falla: `NavTitleKey` se tipa contra `es.json`).
6. Handlers MSW en `src/test/msw/handlers/contracts.ts` + tests de la tabla.

**Gate de permiso**: aplicá el mismo criterio que definas en C-02 para las otras pantallas de
auditoría — no dejes esta pantalla con un criterio distinto.

**Alcance**: **solo lectura**. Listar y filtrar contratos. Nada de acciones sobre el contrato
(firmar, anular) sin una spec propia: la máquina de estados vive en el backend y tiene
implicancias legales.

**Commit**: `feat(contracts): agregar la vista de contratos para staff en el panel admin`

---

## 5. WORKFLOW 3 — Peso visual

**Objetivo**: que las pantallas que más importan al negocio no se vean como un formulario
crudo. **Este workflow es el más subjetivo del archivo**: no hay tests que lo verifiquen, y el
criterio de aceptación es comparativo.

**La vara**: `src/features/analytics/components/overview.tsx` + `stat-card.tsx` (dashboard
admin) y el hero con `BrandGradientBackground` de `src/app/(client)/page.tsx`. Son las **dos
únicas** superficies del repo que aplican el 80/20 verde/teal con intención. Abrí las dos antes
de tocar nada: son la referencia, no una sugerencia.

**Reglas del design system que aplican a todo este workflow**:

- `primary` (verde `#28A745`) domina ~80% del color de marca: nav activo, botones primarios,
  focus rings, links. Ante la duda, es `primary`.
- `accent` (teal `#17BEBB`) es **un solo punto de énfasis por vista**. Si ya hay un elemento
  teal tirando del ojo, el siguiente candidato pasa a `primary` o a un neutro.
- Los estados (`success`/`warning`/`info`/`destructive`) van como **texto de color sobre fondo
  tenue** (`bg-success/10 text-success`), nunca fondo sólido con texto encima.
- **`success` ya es verde, casi idéntico a `primary`** — nunca uses `primary` para comunicar
  "salió bien". Son conceptos distintos aunque se vean iguales.
- **Verificá en claro Y oscuro.** No es opcional.

**No refactorices las `page.tsx`** — el esqueleto repetido es deliberado (ver §2, descartados).
Todo el trabajo va en el componente hijo.

---

### G-01 · ALTO · La pantalla por donde entra el ingreso es un formulario plano

**Archivos**: `src/features/request-service/components/request-service-form.tsx`.

**Es la pantalla más importante del producto**: es por donde un cliente pide un servicio, o sea
por donde entra la demanda y el ingreso. Hoy es un formulario apilado sin `Card`, sin indicador
de progreso, y con el CTA principal en el estilo por defecto del botón.

**Cambio sugerido** (no prescriptivo, usá criterio): agrupar los campos en secciones con `Card`
(qué necesitás / dónde / cuándo), un indicador de pasos si el formulario es largo, y el acento
teal reservado **solo** para el CTA de confirmar.

**Coordiná con E-01**: esa tarea agrega inputs de coordenadas a este mismo formulario. Hacé
E-01 **primero** y esta después, o vas a rehacer el layout dos veces.

**Commit**: `style(request-service): dar jerarquia visual al formulario de solicitud`

---

### G-02 · MEDIO · El embudo de captación de profesionales, igual de plano

**Archivos**: `src/features/professional-application/components/professional-application-form.tsx`.

Es el otro lado del marketplace: por acá entra la oferta. Mismo tratamiento nulo que G-01.
Aplicá el mismo criterio, con una diferencia: acá conviene explicar mejor **qué pasa después**
de postularse (el perfil queda `PENDING` hasta que staff lo revise) — el formulario ya muestra
un card de éxito, pero el camino previo no anticipa nada.

**Commit**: `style(professional-application): dar jerarquia visual al formulario de postulacion`

---

### G-03 · MEDIO · El perfil del profesional no tiene jerarquía ni preview

**Archivos**: `src/features/professional-profile/components/professional-profile-form.tsx`.

Es la página más visitada por un profesional. Hoy no tiene panel de avatar/preview, ni indicador
de completitud del perfil, ni agrupación de campos en cards.

Un indicador de completitud tiene valor de negocio real acá: un perfil incompleto convierte
peor, y hoy nada se lo dice al profesional.

**Commit**: `style(professional-profile): agrupar el perfil y mostrar completitud`

---

### G-04 · MEDIO · `admin/categories` no tiene un solo acento de marca

**Archivos**: `src/features/categories/components/categories-table.tsx`.

`DataTable` pelada, sin `Badge` ni color, ni siquiera para el booleano de visibilidad — que hoy
se muestra como un `Switch` sin texto de estado. Eso además roza la regla de "el estado nunca se
comunica solo por color/forma".

**Cambio mínimo de alto impacto**: `Badge` con texto para visible/oculto, e ícono + color de la
categoría (ambos ya existen en el modelo: `icon` y `color` son campos del DTO) mostrados en la
fila. La tabla tiene los datos para verse bien y no los usa.

**Commit**: `style(categories): mostrar icono, color y estado en la tabla de categorias`

---

### G-05 · BAJO · El detalle de rol no tiene jerarquía visual

**Archivos**: `src/app/admin/roles-permission/[id]/` → su componente de detalle.

Baja prioridad: lo usa solo staff técnico, con poca frecuencia. Hacelo solo si el workflow
avanza rápido.

**Commit**: `style(roles): dar jerarquia visual al detalle de rol`

---

### G-06 · MEDIO · Varias tablas muestran ids crudos en vez de nombres

**Archivos**: `src/features/ratings/components/ratings-table.tsx` (~75-83) y, muy probablemente,
`notifications-table` y la cola de `professional-portfolio` — **verificá cuáles antes de
tocar**.

**Síntoma**: la tabla de calificaciones muestra `#${row.original.userId}` en vez del nombre de
la persona. Una tabla de números internos es ilegible para el staff y además falla el espíritu
del nombre accesible para lectores de pantalla.

**Trampa importante**: el backend **devuelve `userId`/`professionalId` en `null`** cuando la
calificación es anónima y quien consulta no es el autor. Si resolvés el nombre, tenés que
manejar ese caso explícitamente con un texto tipo "Anónimo" — **no** con un id vacío ni un
guión. Esto no es teórico: el mismo campo causó un crash garantizado en Mobile (tarea B-01 del
WORKPLAN de `TekoApp-Frontend-Mobile`).

**Cambio**: resolver el nombre cuando el DTO lo traiga; si no lo trae, evaluar si el backend
puede incluirlo (es un cambio de DTO, no de UI) antes de armar un N+1 de consultas desde el
cliente. **No hagas una consulta por fila.**

**Commit**: `fix(admin): mostrar nombres en vez de ids internos en las tablas`

---

## 6. WORKFLOW 4 — Sostenibilidad

---

### I-01 · MEDIO · Faltan capacidades básicas de un portal admin a escala

Ninguna de estas existe hoy en `src/features/*`:

- **Visor de auditoría**: el backend tiene triggers de auditoría en toda tabla de negocio y
  nadie puede verlos desde el portal.
- **Acciones masivas**: todo se opera fila por fila.
- **Export CSV/Excel**: cero. Para pagos y profesionales es lo primero que pide un área de
  administración.
- **Búsqueda global cross-entidad**: cada tabla tiene su filtro local; no hay forma de buscar
  "este usuario" sin saber en qué pantalla mirar.

Cada una es una feature con su propia spec. **No las agrupes en una tarea.** Priorizá por lo
que el staff pida realmente: probablemente export primero.

---

### I-02 · MEDIO · Falta la UI de borrado de cuenta

Bloqueada por el backend (tarea I-01 del WORKPLAN de `TekoApp-Backend`): necesita el endpoint y
la definición de qué se borra vs. qué se anonimiza. Cuando exista, Web necesita la pantalla en
`(client)/perfil` con confirmación de dos pasos.

---

### I-03 · BAJO · Faltan e2e de los flujos críticos (y el doc los describe mal)

**Primero corregí el doc**: `.claude/rules/test.md` dice que Playwright cubre "login + users
CRUD". Lo real en `e2e/` es `login.spec.ts`, `admin-categories.spec.ts`,
`client-solicitar.spec.ts` y `smoke.spec.ts` — o sea, users CRUD **no** está cubierto y sí lo
están categorías y la solicitud de servicio. **Verificá el contenido de `e2e/` antes de
reescribir el doc**, puede haber cambiado.

Flujos críticos sin cobertura, por valor:

1. **Pagos**: reembolso, cancelación, propina. Mueve plata real y no tiene un solo e2e.
2. **Postulación → verificación de profesional**: todo el embudo de captación de oferta.
3. **Colas de revisión** de documentos y portafolio: deciden si un profesional puede operar.

**Commit** (para el doc): `docs(reglas): corregir la cobertura e2e descrita en test.md`

---

## 7. Nota sobre el estado de `develop`

Al momento de esta auditoría, la rama `audit/2026-09-04` sale de `develop` en `f8ef477`, que ya
incluye los 5 PRs de la fase de onboarding y portafolio profesional (mode-switcher,
auto-postulación, subida propia de documentos, CTA de reclutamiento y galería de portafolio).
Si algún archivo citado acá no existe, verificá primero que estás en la rama correcta.

---

## 8. Tabla de seguimiento

| ID   | Sev     | Estado | Commit  | Notas                                                                                                                                                                                                                                                   |
| ---- | ------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-01 | CRÍTICO | [x]    | 6b1a782 | Copiar los strings exactos del backend                                                                                                                                                                                                                  |
| C-02 | ALTO    | [x]    | 5a412e1 | Gate aplicado en `payments-table`, `payment-detail-view` y `ratings-table` (patrón de `service-progress-section.tsx`). Hoy nadie queda afuera (solo existe `ADMIN`/`admin:all`), pero el gate ya está listo para cuando exista un rol sin esos permisos |
| C-03 | MEDIO   | [x]    | 4c3dc8e | Hacer junto con C-04                                                                                                                                                                                                                                    |
| C-04 | ESTILO  | [x]    | e3da870 | Hacer junto con C-03                                                                                                                                                                                                                                    |
| C-05 | BAJO    | [x]    | 65af46b | Solo doc                                                                                                                                                                                                                                                |
| E-01 | CRÍTICO | [x]    | 2b02b19 | Opción (A): inputs numéricos de lat/lng en el orden natural de tabulación; el mapa pasa a ser ayuda visual (`aria-hidden`, sin `role="application"`)                                                                                                    |
| F-01 | CRÍTICO | [x]    | 1bed260 | Solo lectura, sin acciones sobre el contrato. Gate por `CONTRACTS.AUDIT_VIEW`/`admin:all`, mismo patrón que C-02                                                                                                                                        |
| G-01 | ALTO    | [x]    | b2b8cb8 | Secciones con Card (qué necesitás/dónde/cuándo), CTA en `accent`. Verificado claro y oscuro con screenshot real (fake-backend + build de e2e)                                                                                                           |
| G-02 | MEDIO   | [x]    | 490883b | Card + CTA `accent` + aviso de "queda PENDING" en el propio formulario (antes solo en el card de éxito). Verificado claro y oscuro con screenshot real                                                                                                  |
| G-03 | MEDIO   | [ ]    |         |                                                                                                                                                                                                                                                         |
| G-04 | MEDIO   | [ ]    |         |                                                                                                                                                                                                                                                         |
| G-05 | BAJO    | [ ]    |         | Opcional                                                                                                                                                                                                                                                |
| G-06 | MEDIO   | [ ]    |         | Ojo con los ids null de calificaciones anónimas                                                                                                                                                                                                         |
| I-01 | MEDIO   | [ ]    |         | 4 features, una spec cada una                                                                                                                                                                                                                           |
| I-02 | MEDIO   | [ ]    |         | Bloqueada por backend                                                                                                                                                                                                                                   |
| I-03 | BAJO    | [ ]    |         | Corregir el doc primero                                                                                                                                                                                                                                 |
