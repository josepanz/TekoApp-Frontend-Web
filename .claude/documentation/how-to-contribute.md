# Cómo contribuir a TekoApp-Web — guía paso a paso

> Para alguien que sabe programar y TypeScript, pero nunca tocó HTML/CSS/React/Next.js.
> `architecture.md` explica el **por qué** de las decisiones grandes; este documento explica el
> **cómo** del día a día: dónde escribir código para una tarea concreta.

## 0. Los 3 conceptos que hay que tener claros antes de tocar nada

### Server Component vs Client Component (el equivalente a "corre en tu API" vs "corre en el navegador")

Pensalo en términos de backend: un **Server Component** es código que corre en tu servidor Next.js
(nunca llega al navegador, ni siquiera como JS) — puede leer cookies, llamar `getSession()`, hacer
`await` directo a una función async, todo antes de mandar HTML ya armado. Un **Client Component**
es código que SÍ se manda al navegador y corre ahí — es el único lugar donde podés usar
`useState`, `onClick`, `useEffect`, hooks en general.

- Todo archivo es Server Component **por default**. Se vuelve Client Component solo si tiene
  `'use client'` como primera línea.
- Regla práctica: si el componente necesita interactividad (un formulario, un botón con estado, un
  modal) → Client Component. Si solo muestra datos y arma el layout → Server Component.
- Un Server Component puede _renderizar_ un Client Component adentro (así se hace casi todo acá:
  `page.tsx` en Server, el formulario específico en Client). Un Client Component **no puede**
  importar y usar un Server Component adentro de sí mismo.

### SSR vs CSR — cómo se comunican en este proyecto

- **SSR (Server-Side Rendering)**: pasa en Server Components. Ejemplo real:
  `src/app/admin/layout.tsx` llama `await getSession()` (lee la cookie, le pregunta al backend
  `GET /auth/scope`) ANTES de mandar HTML — el navegador recibe la página ya con el nombre/avatar
  del usuario adentro, sin loading spinner.
- **CSR (Client-Side Rendering)**: pasa en Client Components, vía TanStack Query. Ejemplo real:
  `useUsersQuery()` en `features/users/hooks.ts` — el componente se monta, dispara un `fetch` desde
  el navegador a `/api/backend/users`, muestra un `Skeleton` mientras tanto.
- **La regla para elegir**: dato que hace falta para renderizar la página inicial (nombre de
  usuario en el header, layout completo) → SSR en el Server Component del layout/page. Dato que
  cambia por interacción del usuario (una tabla paginada, un formulario que se abre en un modal)
  → CSR con TanStack Query en un hook.
- Nunca se comunican "directo" un Server y un Client Component — el puente es: el Server Component
  pasa datos como **props** hacia abajo (una sola vez, al renderizar), y el Client Component pide
  sus propios datos frescos vía TanStack Query si los necesita actualizar sin recargar la página.

### El BFF: el navegador nunca habla con el backend real

Ningún componente (Server o Client) llama nunca a la URL real de `TekoApp-Backend`. Todo pasa por
`/api/backend/*` (un proxy que vive en `src/app/api/backend/[...path]/route.ts`, ver
`architecture.md` para el detalle completo). En la práctica, para vos como quien escribe código
esto significa: **siempre** llamás `apiFetch('recurso')` (importado de `@/core/api-client/client`)
desde un `api.ts` de feature, nunca `fetch('http://...')` directo.

---

## 1. Ajustar una feature que ya existe

Ejemplo: "en la tabla de usuarios del admin, agregar una columna de teléfono".

1. **Encontrá el feature folder**: `src/features/<dominio>/` (en este caso `src/features/users/`).
   Cada dominio tiene esta forma fija:
   ```
   src/features/users/
   ├── api.ts          # funciones que llaman al backend (apiFetch)
   ├── hooks.ts         # hooks de TanStack Query que usan esas funciones
   ├── schemas.ts        # validación zod para formularios (si el feature tiene forms)
   └── components/
       ├── users-table.tsx
       └── user-detail-dialog.tsx
   ```
2. **¿El dato ya viene del backend?** Mirá el tipo en `api.ts` (ej. `User` en
   `features/users/api.ts`) — son tipos generados automáticamente desde el Swagger del backend
   (`pnpm generate:api-types`, nunca los escribas a mano). Si el campo que necesitás ya está en el
   tipo, saltá directo al paso 3. Si no está, el cambio es en el BACKEND primero (agregar el campo
   al DTO de respuesta), después corré `pnpm generate:api-types` acá para traerlo.
3. **Editá el componente**: en `components/users-table.tsx`, la tabla se arma con un array
   `columns` (TanStack Table). Agregás un objeto más al array:
   ```tsx
   {
     accessorKey: 'phoneNumber',
     header: 'Teléfono',
     cell: ({ row }) => row.original.phoneNumber ?? '—',
   },
   ```
4. **Corré el test** del componente que tocaste (`users-table.test.tsx`) y ajustalo si hace falta
   — el proyecto exige que todo componente tenga su `.test.tsx` al lado (ver `rules/test.md`).
5. **Verificá**: `pnpm lint`, `pnpm check:types`, `pnpm test` — los 3 en 0 errores antes de dar la
   tarea por terminada.

Mismo patrón para: agregar un botón, cambiar un texto (che ver el paso de i18n más abajo, los
textos NUNCA se hardcodean), agregar una validación a un formulario existente (tocás
`schemas.ts`, el form ya está conectado vía `react-hook-form` + `zodResolver`).

## 2. Crear una feature nueva de cero

### Si es un CRUD tabla simple (listado + crear/editar + eliminar)

**No armes la estructura a mano.** Usá el generador:

```bash
pnpm generate:feature promotion --paginated
```

Esto crea automáticamente `api.ts`, `hooks.ts`, `schemas.ts`, la tabla, el diálogo de
crear/editar, el botón, y la página en `src/app/admin/promotions/page.tsx` — con campos de
ejemplo (`name`/`description`) que después ajustás a los campos reales del DTO. Ver
`.claude/rules/typescript.md` sección "Generador de scaffolding" para las opciones completas.

### Si es algo distinto de un CRUD tabla (ej. lo que se armó en esta sesión: "mi perfil")

1. Creá la carpeta `src/features/<nombre>/` a mano, con la misma forma de siempre (`api.ts`,
   `hooks.ts`, `schemas.ts` si hay formulario, `components/`).
2. `api.ts` primero: definí los tipos importando de `types.generated.ts`
   (`components['schemas']['AlgoDTO']`) y las funciones que llaman `apiFetch`/`uploadFile`.
3. `hooks.ts`: envolvé cada función de `api.ts` en `useQuery` (leer) o `useMutation` (escribir),
   con `toast.success`/`toast.error` en las mutations — es el patrón de TODOS los hooks del
   proyecto, copiá cualquiera existente como plantilla (ej. `features/my-profile/hooks.ts`).
4. `components/`: un componente por archivo, `'use client'` arriba si usa hooks/estado.
5. La página en `src/app/<ruta>/page.tsx`: Server Component que resuelve lo específico de Next
   (¿necesita sesión? `await getSession()`) e importa el componente del feature — la lógica NUNCA
   vive en `page.tsx`.
6. Agregá los textos visibles al namespace correspondiente en `messages/es.json` Y
   `messages/en.json` (ver sección de i18n abajo) antes de usarlos con `useTranslations`.
7. Test para cada componente nuevo (MSW handlers en `src/test/msw/handlers/<dominio>.ts`, nunca
   handlers inline duplicados por archivo de test).

## 3. Textos e idiomas (i18n)

Nunca escribas un string visible directo en el JSX. Siempre:

```tsx
const t = useTranslations('miNamespace'); // Client Component
// o
const t = await getTranslations('miNamespace'); // Server Component

<p>{t('miClave')}</p>;
```

Y agregás `"miClave": "Mi texto"` en **ambos** `messages/es.json` y `messages/en.json` (mismo
namespace, misma clave). Si el namespace no existe todavía, creá uno nuevo con el nombre del
feature. Ver `src/i18n/config.ts` para cómo se negocia el idioma (cookie > `Accept-Language` >
español por default) — no hay URLs tipo `/en/...`, es el mismo patrón en todas las rutas.

## 4. Diseño — nunca un color/tamaño "a mano"

- Colores: siempre clases Tailwind que resuelven a los tokens (`bg-primary`,
  `text-muted-foreground`) — nunca `#hex` ni `style={{color:...}}`. Ver `rules/design-system.md`
  para la paleta completa y la regla 80/20 (primary domina, accent es minoritario).
- ¿Ya existe el componente que necesitás? Antes de escribir uno nuevo, `pnpm dlx shadcn@latest add
<nombre>` — capaz shadcn ya lo resuelve. Los primitivos en `components/ui/` son código propio
  (no una dependencia opaca), se pueden editar libremente.
- Todo componente nuevo en `components/ui/`/`components/layout/` lleva su story de Storybook
  (`pnpm storybook` para ver el catálogo completo de lo que ya existe).
- Base UI (la librería de accesibilidad debajo de shadcn acá) compone con la prop `render`, no
  `asChild` como Radix — ver `rules/design-system.md` si un componente tira un error de tipos raro
  al intentar `asChild`.

## 5. Dónde vive cada tipo de documentación

| Pregunta                                                   | Dónde mirar                                             |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| "¿Por qué se decidió X arquitectura?"                      | `.claude/documentation/architecture.md`                 |
| "¿Cómo hago Y en el día a día?"                            | Este archivo                                            |
| "¿Cuál es la regla exacta para Z?" (colores, tests, tipos) | `.claude/rules/*.md`                                    |
| "¿Qué decisión de marca se tomó y quién la definió?"       | `brand/` (assets + manual de marca)                     |
| "¿Qué endpoints expone el backend y qué forma tienen?"     | `src/core/api-client/types.generated.ts` (nunca a mano) |

## 6. Checklist antes de dar una tarea por terminada

```
[ ] pnpm lint       → 0 errores, 0 warnings
[ ] pnpm check:types → 0 errores
[ ] pnpm test        → todo en verde (componente nuevo con su .test.tsx)
[ ] pnpm build       → compila (corre el build de producción real, no solo dev)
[ ] Textos nuevos en messages/es.json Y messages/en.json
[ ] Story de Storybook si es un componente de components/ui|layout
[ ] Probado visualmente en claro Y oscuro si tocaste UI
```
