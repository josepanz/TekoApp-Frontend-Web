# Accesibilidad (a11y)

Estándar de accesibilidad de TekoApp. Objetivo: **WCAG 2.1 nivel AA**. Base UI ya resuelve foco,
roles ARIA y navegación por teclado en los primitivos (ver `rules/design-system.md`) — este archivo
documenta lo que NO resuelve solo el primitivo y hay que verificar a mano en cada componente/pantalla.

Voz de la copy: **"vos"** (igual que el resto del producto — "no tenés servicios asignados todavía").

## Contraste de color

- Texto normal (< 18.66px / < 24px si no es bold): **≥ 4.5:1** contra su fondo.
- Texto grande (≥ 24px, o ≥ 18.66px bold) y componentes de UI / bordes / íconos que transmiten
  información: **≥ 3:1**.
- Los tokens ya están pensados para esto: no bajes `muted-foreground` por debajo de su valor de
  token, y no pongas texto sobre `accent` (teal de marca, rebrand 2026-08-02) o `primary` (verde de
  marca) sin usar su `-foreground` correspondiente.
- Los slots semánticos de estado (`success`/`warning`/`info`/`destructive`) se usan como **texto de
  color sobre fondo tenue** (`bg-success/10 text-success`, patrón de `Badge`/`Alert`), no como fondo
  sólido con texto encima. `warning` (dorado de marca) se bajó de lightness (valor crudo del hex
  #FFC107 es 0.844 → se usa 0.64) justamente para que sirva de texto sobre fondo claro — no lo
  vuelvas a aclarar. Si agregás un slot semántico nuevo, mantené su lightness en la banda ~0.58–0.64
  para que funcione de texto en ambos temas.
- Verificá en **claro Y oscuro** — un color que pasa en uno puede fallar en el otro.

## Foco de teclado visible

- Todo elemento interactivo muestra un anillo de foco visible. El estándar de este repo es:
  `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` (ver `button.tsx`,
  `input.tsx`, `badge.tsx`). `--ring` deriva de `primary`, así que el foco es verde de marca
  (rebrand 2026-08-02 — antes índigo).
- No uses `outline-none` / `focus:outline-hidden` sin reponer un `focus-visible:ring-*` equivalente
  — quitar el foco sin reemplazo es una regresión de accesibilidad, no un detalle de estilo.
- El orden de tabulación sigue el orden del DOM: no lo rompas con `tabindex` positivos.

## Controles solo-ícono

- Todo botón/control que solo tiene un ícono (sin texto visible) lleva `aria-label` descriptivo en
  "vos"/imperativo claro. Ej: el trigger de `UserMenu` expone `aria-label="Menú de usuario"`.
- El ícono en sí es decorativo: los `lucide-react` van sin rol; el nombre accesible viene del
  `aria-label` del control que lo contiene, no del SVG.

## Targets táctiles

- En mobile, todo target interactivo mide **≥ 44×44px** de área clickeable (aunque el ícono se vea
  más chico). Usá padding o el pseudo-elemento `after:absolute after:-inset-*` (patrón ya presente en
  `sidebar.tsx`) para agrandar el área sin agrandar el glifo.
- Tamaños de `Button` `xs`/`sm`/`icon-xs` son válidos en desktop denso; en superficies mobile
  preferí `default`/`lg` o ampliá el área táctil.

## El estado no depende solo del color

- Nunca comuniques estado únicamente con color. Un badge de estado lleva **texto** (y/o ícono),
  no solo un punto de color: "Activo" verde, no un círculo verde a secas.
- `success`/`warning`/`info`/`destructive` acompañan siempre un label o ícono legible — pensá en
  daltonismo y en pantallas monocromas.

## Movimiento y animación

- Hoy la app solo usa transiciones de Tailwind (`transition-colors`, `transition-transform`) y
  `tw-animate-css` para enter/exit de popups — no hay `@keyframes` custom ni animación por JS.
- Si agregás una animación custom (loop, parallax, auto-play, algo que se mueva sin interacción del
  usuario), envolvela en `motion-reduce:` (Tailwind) o `@media (prefers-reduced-motion: reduce)` para
  cortarla/atenuarla. No agregues movimiento no esencial que ignore esa preferencia.

## Labels de formularios

- Todo input lleva un `<Label>` (`components/ui/label.tsx`) asociado por `htmlFor`/`id`, o un
  `aria-label` si no hay label visible. Nunca un input "pelado" sin nombre accesible.
- Formularios reales van con `react-hook-form` + `zod`: el mensaje de error se asocia al campo
  (`aria-invalid` + texto de error referenciado), no solo un borde rojo. `aria-invalid` ya está
  cableado en `Input`/`Button` a los estilos `destructive`.
- Agrupá radios/checkboxes relacionados bajo un `fieldset`/`legend` o `role="group"` con nombre.

## Checklist pre-cierre (correr antes de dar por terminado un componente/pantalla)

1. ¿Se ve y funciona bien en **claro Y oscuro**? (no es opcional — los tokens dan los dos).
2. ¿Recorriste toda la pantalla **solo con teclado** (Tab/Shift+Tab/Enter/Esc) y el foco es visible
   en cada parada?
3. ¿Cada control solo-ícono tiene `aria-label` en "vos"?
4. ¿Contraste AA en textos y en UI (≥4.5:1 / ≥3:1), incluidos los slots semánticos?
5. ¿Ningún estado se comunica **solo** por color (hay texto/ícono)?
6. ¿Los inputs tienen label asociado y los errores están asociados al campo?
7. ¿Targets táctiles ≥44px en mobile?
8. ¿Alguna animación custom respeta `prefers-reduced-motion`? (si no agregaste ninguna, N/A).
