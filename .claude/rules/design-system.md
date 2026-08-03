# Design system rules

## Fuente de verdad

`src/design-system/tokens/tokens.json` (formato W3C Design Tokens) es la ÚNICA fuente de verdad
de marca — color, tipografía, radios. `pnpm tokens:build` (Style Dictionary) genera
`src/design-system/tokens/theme.generated.css`, que `globals.css` importa. **Nunca editar
`theme.generated.css` a mano** — se sobreescribe en el próximo build.

Cuando llegue la etapa de Flutter (`TekoApp-Frontend-Mobile`), este mismo `tokens.json` se
procesa con un formato adicional de Style Dictionary para generar un archivo Dart — no se
duplica la definición de marca, se agrega un output nuevo al mismo `build.mjs`.

## Regla de oro: nunca hardcodear

- ❌ `className="bg-[#6d28d9]"` / `style={{ color: '#f97316' }}`
- ✅ `className="bg-primary"` / `className="text-accent-foreground"` (resuelve a las variables
  semánticas de `theme.generated.css`, correctas en claro y oscuro automáticamente)
- Si necesitás un shade específico de la escala de marca que no tiene slot semántico en shadcn
  (ej. para un gráfico o un badge con más variantes), usar `var(--teko-primary-300)` — nunca el
  valor oklch/hex directo.

## Balance de marca: 80/20 primary sobre accent

**Rebrand 2026-08-02**: `primary` pasó de índigo/violeta a **verde TekoApp** (`#28A745`, manual de
marca) y `accent` pasó de coral a **teal TekoApp** (`#17BEBB`, manual de marca) — ver
`brand/` (raíz del repo) para el manual completo y los assets fuente. La escala `neutral`
(fondo dark mode, bordes, texto secundario) ahora ancla en el navy exacto de marca (`#0D1B2A`) y en
el gris claro de marca (`#F5F7FA`). La regla de dominancia 80/20 en sí NO cambió, solo qué colores
ocupan cada rol:

- **`primary` domina (~80% del color de marca visible)**: nav/ítem activo, botones primarios de
  acción, focus rings (`--ring` deriva de `primary`), links, headings destacados, estados
  seleccionados. Cuando dudes de qué color de marca usar, es `primary` (verde).
- **`accent` es minoritario (~20%, un único punto de énfasis por vista)**: el CTA más importante de
  la pantalla, un badge de "nuevo"/"destacado", el gradiente de acento del topbar. Si en una vista
  ya hay un elemento teal tirando del ojo, el siguiente candidato a teal pasa a `primary` o a un
  slot neutro/semántico.

- ❌ Header teal + botón teal + card resaltada teal en la misma vista (dos focos de teal
  compitiendo → se pierde la jerarquía y el teal deja de leerse como "esto es lo importante").
- ✅ Toda la estructura en verde/neutros, y **un** acento teal en el CTA principal.

Nunca uses `primary` y `accent` en proporción pareja en la misma pantalla: si los dos gritan, no
grita ninguno. Para estados (éxito/alerta/error/info) usá los slots semánticos
(`success`/`warning`/`info`/`destructive`), no `accent` — el teal no significa "atención", significa
"marca". Ojo particular acá: `success` YA es verde (mismo hue que `primary`, ~147°) — nunca uses
`primary` para comunicar "operación exitosa", usá siempre el slot `success` aunque el color se vea
casi idéntico, porque son conceptualmente distintos (marca vs. estado) y pueden divergir a futuro.

> Nota de sistema: el slot `--accent` de shadcn está cableado al teal de marca, así que los estados
> `hover`/`focus` de los primitivos de menú (`DropdownMenu`, `Select`) resaltan en teal por defecto.
> Es intencional y acotado a la interacción; no lo repliques además como color de fondo dominante de
> una sección entera.

## Dark mode

- Se implementa con `next-themes` (`class` strategy, ya cableado por Tailwind
  `@custom-variant dark`) — nunca lógica de tema custom con `useState`.
- Todo componente nuevo se prueba visualmente en AMBOS temas antes de darse por terminado — no es
  opcional, los tokens ya proveen los dos, no hay excusa para un componente que se ve mal en dark.
- El fondo dark-mode es navy oscuro (`--teko-neutral-900`), nunca negro puro — ya está resuelto en
  los tokens, no lo reintroduzcas con un color custom.

## Composición: `render`, no `asChild`

Base UI (a diferencia de Radix) compone con la prop **`render`**, no `asChild`:

```tsx
// ❌ Radix-style — no existe en Base UI, tira error de tipos
<DropdownMenuTrigger asChild>
  <Button>Abrir</Button>
</DropdownMenuTrigger>

// ✅ Base UI
<DropdownMenuTrigger render={<Button>Abrir</Button>} />
```

Aplica a cualquier primitivo con `render?: React.ReactElement | ...` en su tipo (Trigger de
Dropdown/Menu, `SidebarMenuButton`, etc. — ver `components/ui/sidebar.tsx` para un ejemplo ya
resuelto con `useRender`). Si TypeScript se queja de que `asChild`/`children` no existe en las
props de un primitivo, es señal de que hace falta `render` en su lugar.

### `Button` con `render={<Link>...}` exige `nativeButton={false}`

`components/ui/button.tsx` envuelve el `Button` de Base UI, que asume por default
`nativeButton: true` (renderiza un `<button>` nativo). Si se reemplaza el elemento vía `render`
con algo que NO es un `<button>` (típicamente un `<Link>` de Next, que renderiza `<a>`), Base UI
tira un warning de consola en runtime ("expected a native `<button>` because the `nativeButton`
prop is true") — no rompe la build ni los tests, pero degrada semántica de accesibilidad (rol/
teclado) si se ignora.

```tsx
// ❌ Tira warning de consola — Link renderiza <a>, no <button>
<Button render={<Link href="/ruta">Ver</Link>} />

// ✅
<Button nativeButton={false} render={<Link href="/ruta">Ver</Link>} />
```

`SidebarMenuButton` (construido sobre `useRender` directo, no sobre el `Button` de Base UI) no
tiene este problema — solo aplica al `Button` de `components/ui/button.tsx`.

## `DropdownMenuLabel` (y cualquier `GroupLabel`) exige un `Group` ancestro

`DropdownMenuLabel` está implementado sobre `Menu.GroupLabel` de Base UI, que requiere
`MenuGroupContext` — a diferencia de Radix, usarlo suelto tira **"Base UI error #31"** en
producción (minificado, sin mensaje legible salvo yendo a buscar el código a
`docs/src/error-codes.json` del repo `mui/base-ui`) y rompe TODO el árbol de React (no es un error
de un solo componente, tumba la página entera). Siempre envolver:

```tsx
// ❌ Tira Base UI error #31 en cuanto se abre el menú
<DropdownMenuContent>
  <DropdownMenuLabel>...</DropdownMenuLabel>
</DropdownMenuContent>

// ✅
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>...</DropdownMenuLabel>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

Mismo patrón aplica a cualquier primitivo Base UI con sufijo `GroupLabel`/`GroupContent` en otros
componentes (Select, Combobox, etc.) si se agregan más adelante — buscar su `*Group` wrapper
correspondiente antes de usarlo suelto.

## Componentes (shadcn/ui sobre Base UI)

- Los primitivos en `components/ui/` son código generado por el CLI de shadcn (`pnpm dlx shadcn@latest add <componente>`)
  sobre `@base-ui/react` (no Radix — shadcn migró a Base UI como base de accesibilidad) — se puede
  y se debe editar ese código libremente, no es una dependencia opaca de node_modules.
- Antes de escribir un componente nuevo desde cero, correr `pnpm dlx shadcn@latest add <nombre>`
  y ver si ya existe en el registro — no reinventar un `Dialog`/`Select`/`DataTable` que shadcn ya resuelve.
- Todo componente nuevo en `components/ui/` o `components/layout/` lleva una story de Storybook
  (`ComponentName.stories.tsx` al lado del componente) — es el catálogo que resuelve "cómo
  encuentro qué componentes ya existen" para alguien nuevo en el proyecto.

## Tipografía

- **Rebrand 2026-08-02**: el manual de marca define una única tipografía — **Poppins** (pesos
  Light/Regular/SemiBold/Bold) — sin una segunda familia separada para headings. `font-sans` y
  `font-heading` apuntan ambos a Poppins hoy (antes: Geist para cuerpo, Sora para headings),
  diferenciados solo por peso (`font-semibold`/`font-bold` en headings). `font-mono` se mantiene en
  Geist Mono (el manual no define monoespaciada; uso interno para código/IDs, nunca visible como
  tipografía de marca).
- Ver `src/app/layout.tsx` para la carga real de la fuente (Next `next/font/google`, no CSS
  `@font-face` manual). Si cambiás las fuentes en `tokens.json`, actualizá `layout.tsx` a mano — no
  hay automatización todavía para esa parte específica.

## Accesibilidad

- Base UI ya resuelve manejo de foco, ARIA roles y navegación por teclado en los primitivos — no
  se reimplementa. Sí verificar manualmente: contraste de color (los tokens ya están pensados para
  cumplir WCAG AA, no bajar el `muted-foreground` por debajo de eso), y que todo elemento
  interactivo tenga un label accesible (`aria-label` si no hay texto visible).

## Tablas de datos

- Usar el wrapper `components/layout/DataTable` (TanStack Table + primitivos shadcn) para
  cualquier listado con sorting/filtros/paginación/columnas configurables — no armar una tabla
  HTML a mano por dominio. Ver la implementación de referencia en `features/users/components/UserTable.tsx`
  una vez exista (primer dominio implementado).
