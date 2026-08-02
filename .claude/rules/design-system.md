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

La identidad de TekoApp es el **índigo/violeta (`primary`)**, no el coral. El coral (`accent`) es
condimento, no plato principal. Regla de dominancia en cualquier pantalla:

- **`primary` domina (~80% del color de marca visible)**: nav/ítem activo, botones primarios de
  acción, focus rings (`--ring` deriva de `primary`), links, headings destacados, estados
  seleccionados. Cuando dudes de qué color de marca usar, es `primary`.
- **`accent` es minoritario (~20%, un único punto de énfasis por vista)**: el CTA más importante de
  la pantalla, un badge de "nuevo"/"destacado", el gradiente de acento del topbar. Si en una vista
  ya hay un elemento coral tirando del ojo, el siguiente candidato a coral pasa a `primary` o a un
  slot neutro/semántico.

- ❌ Header coral + botón coral + card resaltada coral en la misma vista (dos focos de coral
  compitiendo → se pierde la jerarquía y el coral deja de leerse como "esto es lo importante").
- ✅ Toda la estructura en índigo/neutros, y **un** acento coral en el CTA principal.

Nunca uses `primary` y `accent` en proporción pareja en la misma pantalla: si los dos gritan, no
grita ninguno. Para estados (éxito/alerta/error/info) usá los slots semánticos
(`success`/`warning`/`info`/`destructive`), no `accent` — el coral no significa "atención", significa
"marca".

> Nota de sistema: el slot `--accent` de shadcn está cableado al coral de marca, así que los estados
> `hover`/`focus` de los primitivos de menú (`DropdownMenu`, `Select`) resaltan en coral por defecto.
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

- `font-sans` (Geist) para texto de cuerpo, `font-heading` (Sora) para títulos/headings — ver
  `src/app/layout.tsx` para la carga real de las fuentes (Next `next/font`, no CSS `@font-face`
  manual). Si cambiás las fuentes en `tokens.json`, actualizá `layout.tsx` a mano — no hay
  automatización todavía para esa parte específica.

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
