# Spec: Acciones masivas en tablas admin (backoffice)

Hallazgo origen: `I-01` del WORKPLAN de `platform-hardening-2026-09` (§6, workflow 4 —
sostenibilidad). Una de 4 features independientes de ese hallazgo — ver también
`admin-audit-log-viewer.md`, `admin-data-export.md`, `admin-global-search.md`. No agrupar la
implementación de estas 4 specs en una sola tarea.

## Objetivo

Dejar de operar fila por fila en las tablas admin que ya tienen una acción de un solo ítem
(eliminar, verificar, revisar) cuando el staff necesita aplicarla a varias filas a la vez.

## Contexto verificado

Hoy `DataTable` (`src/components/layout/data-table.tsx`) no tiene selección de filas — es un
wrapper de TanStack Table sin `enableRowSelection`. Las acciones existentes que son candidatas
reales a "masivas" (verificadas contra el código, no supuestas):

- `categories-table.tsx`: eliminar categoría (`useDeleteCategoryMutation`, un id por llamada).
- `ratings-table.tsx`: eliminar calificación (`useDeleteRatingMutation`, un id por llamada).
- `professional-portfolio` (cola de revisión): aprobar/rechazar foto
  (`useReviewPortfolioItemMutation`).
- `professionals`: verificar/suspender profesional (`useVerifyProfessionalMutation`,
  `useSuspendProfessionalMutation`).

**Ninguno de estos tiene un endpoint de backend que acepte una lista de ids.** Todos son
`POST/PATCH/DELETE /recurso/:id`, uno por ítem.

## Alcance

**Incluye**:

1. Extender `DataTable` con una columna de selección opcional (`enableSelection?: boolean` +
   `onSelectionChange`), usando `enableRowSelection` de TanStack Table — no un componente nuevo
   desde cero, reusar el primitivo existente.
2. Una barra de acciones masivas (`components/layout/bulk-actions-bar.tsx`) que aparece cuando hay
   ≥1 fila seleccionada: cuenta de seleccionados + botones de acción + botón "cancelar selección".
3. Ejecución **secuencial o con `Promise.allSettled`** contra el endpoint de un solo ítem que ya
   existe — nunca inventar un endpoint de bulk en el backend como parte de esta spec (no hay
   ninguno hoy; ver "Fuera de alcance").
4. Resultado parcial visible: si de 10 seleccionados fallan 2, mostrarlo explícitamente (toast con
   "8 de 10 completados, 2 fallaron" + detalle de cuáles), nunca un éxito/error binario que oculte
   fallos parciales.
5. Empezar por **una sola tabla** como piloto — sugerido `categories-table.tsx` (acción más simple:
   eliminar) — y extender a las demás en tareas separadas una vez validado el patrón.

**No incluye**:

- Undo de una acción masiva ya aplicada.
- Acciones masivas sobre pagos (reembolso/cancelación) — mueven plata real, tienen su propia
  disciplina de confirmación (ver `refund-payment-dialog.tsx`) y no califican para este patrón
  genérico sin una revisión de riesgo aparte.

## Pantallas / flujos

- Checkbox en el header de `DataTable` (seleccionar todo lo visible en la página actual, **no**
  todas las páginas — server-side pagination no trae todos los ids al cliente) + checkbox por fila.
- `BulkActionsBar` fijo arriba de la tabla cuando hay selección, con `aria-live="polite"` para que
  un lector de pantalla anuncie el conteo.
- Confirmación (`AlertDialog`, patrón ya usado en `categories-table.tsx`) antes de ejecutar,
  mostrando la cantidad de ítems afectados en el texto.

## Permisos

Ninguno nuevo — la acción masiva usa el mismo permiso que ya gatea la acción individual en el
backend (ej. borrar categorías ya requiere lo que requiere hoy `DELETE /categories/:id`). Si el
backend rechaza un ítem puntual por permiso, ese ítem cuenta como "fallado" en el resultado
parcial, no aborta el resto.

## Fuera de alcance de esta spec

Un endpoint de bulk real en el backend (`POST /categories/bulk-delete` o similar) — si el volumen
de uso lo justifica más adelante, es una spec de backend aparte que esta implementación cliente
podría migrar a consumir sin cambiar la UI (misma `BulkActionsBar`, cambia solo `hooks.ts`).

## Riesgos / límites explícitos

- Sin endpoint de bulk, N ítems seleccionados son N requests HTTP — poner un límite razonable de
  selección por página (la paginación de `DataTable` ya acota esto de forma natural) y no agregar
  un "seleccionar todas las 3000 filas" hasta que exista un endpoint real que lo soporte.
- Ejecutar mutaciones en paralelo sin límite de concurrencia puede saturar el backend si alguien
  selecciona una página grande — usar un límite de concurrencia razonable (ej. 5 en vuelo) en vez
  de `Promise.allSettled` sobre todo el array de una vez.
