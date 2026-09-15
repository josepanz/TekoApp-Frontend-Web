# Spec: Búsqueda global cross-entidad (backoffice)

Hallazgo origen: `I-01` del WORKPLAN de `platform-hardening-2026-09` (§6, workflow 4 —
sostenibilidad). Una de 4 features independientes de ese hallazgo — ver también
`admin-audit-log-viewer.md`, `admin-bulk-actions.md`, `admin-data-export.md`. No agrupar la
implementación de estas 4 specs en una sola tarea.

## Objetivo

Que staff pueda buscar "este usuario"/"este profesional"/"este servicio" desde un solo lugar, sin
tener que saber de antemano en qué tabla admin mirar y aplicar el filtro local de esa tabla.

## Contexto verificado

Cada tabla admin tiene su propio filtro local (`payments-table.tsx` filtra por estado,
`categories-table.tsx` no tiene búsqueda de texto, etc.) — no existe hoy ningún input de búsqueda
que cruce entidades. `grep` sobre `TekoApp-Backend/src` no encuentra ningún endpoint de búsqueda
global (`GlobalSearch`, `search-all` o similar) — **no existe en el backend**.

**Bloqueante**: un cross-entidad real (buscar "Juan Pérez" y que aparezca como usuario, como
profesional y en los servicios donde participó, en un solo resultado) necesita un endpoint de
backend que agregue sobre varias tablas — no es razonable armarlo desde Web pegándole a N
endpoints de listado en paralelo por cada letra tipeada.

## Alcance

**Opción recomendada — endpoint de backend agregado** (requiere backend):

1. `GET /admin/search?q=...` que devuelva resultados tipados por entidad (`{ type: 'user' | 'professional' | 'service', id, label, href }[]`) desde el backend, con su propio límite/relevancia.
2. Web solo consume ese endpoint desde un `Command`/`Combobox` en el header del admin
   (`src/components/layout/app-sidebar.tsx` o un nuevo `global-search.tsx` en el header), con
   debounce (300ms) sobre el input.
3. Selección de un resultado navega directo al detalle (`/admin/users/:referenceId`,
   `/admin/professionals/:referenceId`, etc.) — reusar las rutas que ya existen.

**Opción intermedia — sin backend nuevo, alcance reducido**: si el endpoint de backend no es
viable en el corto plazo, una versión más chica y honesta sobre sus límites:

- Un buscador que solo busca por **id/referenceId exacto** contra los endpoints de detalle que ya
  existen (`GET /users/reference/:id`, `GET /professionals/reference/:id`, etc.), probando cada uno
  en paralelo y mostrando el primero que responda 200. Sirve para "tengo este id, ¿qué es?", no
  para buscar por nombre — hay que comunicarlo así en la UI (placeholder "Buscar por ID exacto"),
  no vender más de lo que hace.
- **No** intentar simular una búsqueda por texto libre iterando `GET /users?search=...` +
  `GET /professionals?search=...` en paralelo por cada tecla: ninguno de esos endpoints tiene hoy
  un parámetro `search` (verificado — ver `admin-bulk-actions.md` para el mismo tipo de
  verificación sobre otros endpoints), y agregar ese parámetro a cada uno por separado, sin
  agregación real, deja una "búsqueda global" que en realidad son N búsquedas independientes mal
  disfrazadas de una — confuso para el staff que la use.

**No incluye**: búsqueda difusa/fuzzy, ranking de relevancia (eso es responsabilidad del backend
si se implementa la opción recomendada), historial de búsquedas.

## Pantallas / flujos

- Ícono de búsqueda en el header del layout admin (`AppSidebar`/topbar), atajo de teclado
  Ctrl/Cmd K para abrir (patrón `Command` de shadcn — verificar si `command.tsx` ya existe en
  `components/ui/` antes de asumirlo instalado).
- Resultados agrupados por tipo de entidad con un ícono distintivo por grupo.
- Estado vacío explícito ("Sin resultados para \"...\"") y estado de carga con `Skeleton`.

## Permisos

El endpoint de búsqueda global (si se implementa) debe respetar los mismos permisos por tipo de
resultado que ya aplican a cada listado — un staff sin `PAYMENTS.AUDIT_VIEW` no debería ver pagos
en los resultados aunque tenga acceso a `/admin`. Esto lo decide el backend al construir la
respuesta agregada; Web no debe intentar filtrar resultados sensibles client-side como único
control.

## Fuera de alcance de esta spec

El endpoint de backend en sí (decisión de qué entidades agrega, cómo pagina/limita resultados por
tipo).

## Riesgos / límites explícitos

- Sin el endpoint agregado, la "opción intermedia" es deliberadamente más limitada (solo id
  exacto) — no implementar una simulación de búsqueda de texto libre que parezca más capaz de lo
  que es; eso genera confianza falsa en una herramienta que un staff va a usar bajo presión (buscar
  a un usuario en medio de un reclamo, por ejemplo).
- Un `Cmd+K` global compite por el atajo con el navegador/OS en algunos casos — verificar que no
  choque con atajos ya reservados por Chrome/Edge antes de habilitarlo.
