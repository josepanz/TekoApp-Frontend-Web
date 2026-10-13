# CP-UI — DataTable y EmptyState

Módulo: componentes de UI compartidos (`src/components/data-table`, `src/components/ui/empty-state`). Alcance: rama `feat/admin-ui-datatable-emptystate`. Las pruebas de accesibilidad visual (Storybook a11y) se documentan en `PLAN-DE-PRUEBAS.md` §2.3 y no se ejecutan en este informe.

Formato según `C:\workspace\QA-DOC-STANDARD.md` §2. Los pasos son reproducibles a mano; la columna "Automatizado en" apunta al test real (archivo + nombre del `it`/`test`).

### CP-WEB-UI-001 — Muestra filas esqueleto y aria-busy mientras la tabla carga

| Campo              | Contenido                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-001                                                                                                                                                               |
| Título             | Muestra filas esqueleto y aria-busy mientras la tabla carga                                                                                                                 |
| Tipo / Nivel       | unitaria / componente                                                                                                                                                       |
| Prioridad          | P1                                                                                                                                                                          |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)                                                                               |
| Precondiciones     | Vitest + jsdom; `DataTable` con `columns` de prueba y `data=[]`.                                                                                                            |
| Pasos              | 1. Renderizar `<DataTable isLoading skeletonRows={3} />`.<br>2. Contar los nodos `[data-slot="data-table-skeleton-row"]`.<br>3. Leer el atributo `aria-busy` del `<table>`. |
| Datos de prueba    | `skeletonRows=3`, `data=[]`.                                                                                                                                                |
| Resultado esperado | 3 filas esqueleto; `aria-busy="true"` en el `table`.                                                                                                                        |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `muestra skeleton de filas y aria-busy mientras carga`                                                                    |

### CP-WEB-UI-002 — Marca aria-busy al refrescar sin perder los datos previos

| Campo              | Contenido                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-002                                                                                                        |
| Título             | Marca aria-busy al refrescar sin perder los datos previos                                                            |
| Tipo / Nivel       | unitaria / componente                                                                                                |
| Prioridad          | P2                                                                                                                   |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)                        |
| Precondiciones     | Vitest + jsdom; `DataTable` con filas cargadas.                                                                      |
| Pasos              | 1. Renderizar `<DataTable data={data} isFetching />`.<br>2. Verificar `aria-busy` y que la fila "Ana" sigue visible. |
| Datos de prueba    | Filas de prueba con "Ana".                                                                                           |
| Resultado esperado | `aria-busy="true"` y la fila "Ana" permanece en pantalla (no se reemplaza por esqueleto).                            |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `marca aria-busy al refrescar con datos previos`                   |

### CP-WEB-UI-003 — Muestra el estado vacío con el mensaje indicado

| Campo              | Contenido                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-003                                                                                              |
| Título             | Muestra el estado vacío con el mensaje indicado                                                            |
| Tipo / Nivel       | unitaria / componente                                                                                      |
| Prioridad          | P1                                                                                                         |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)              |
| Precondiciones     | Vitest + jsdom.                                                                                            |
| Pasos              | 1. Renderizar `<DataTable data={[]} emptyMessage="Nada acá" />`.<br>2. Buscar el texto y leer `aria-busy`. |
| Datos de prueba    | `emptyMessage="Nada acá"`.                                                                                 |
| Resultado esperado | Se ve "Nada acá"; `aria-busy="false"`.                                                                     |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `muestra el estado vacío con el mensaje indicado`        |

### CP-WEB-UI-004 — Muestra "Sin resultados" cuando hay filtros activos y no hay filas

| Campo              | Contenido                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-004                                                                                           |
| Título             | Muestra "Sin resultados" cuando hay filtros activos y no hay filas                                      |
| Tipo / Nivel       | unitaria / componente                                                                                   |
| Prioridad          | P1                                                                                                      |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)           |
| Precondiciones     | Vitest + jsdom.                                                                                         |
| Pasos              | 1. Renderizar `<DataTable data={[]} isFiltered />`.<br>2. Buscar el texto "Sin resultados".             |
| Datos de prueba    | `isFiltered=true`.                                                                                      |
| Resultado esperado | Se distingue el vacío por filtro ("Sin resultados") del vacío absoluto.                                 |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `muestra "sin resultados" cuando hay filtros activos` |

### CP-WEB-UI-005 — Muestra el error con botón Reintentar que invoca onRetry

| Campo              | Contenido                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-005                                                                                             |
| Título             | Muestra el error con botón Reintentar que invoca onRetry                                                  |
| Tipo / Nivel       | unitaria / componente                                                                                     |
| Prioridad          | P1                                                                                                        |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)             |
| Precondiciones     | Vitest + jsdom + user-event.                                                                              |
| Pasos              | 1. Renderizar `<DataTable data={[]} isError onRetry={fn} />`.<br>2. Hacer click en el botón "Reintentar". |
| Datos de prueba    | `onRetry` = `vi.fn()`.                                                                                    |
| Resultado esperado | Hay un elemento `role="alert"`; `onRetry` se llama exactamente 1 vez.                                     |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `muestra el error con botón de reintento`               |

### CP-WEB-UI-006 — Pagina con los botones anterior y siguiente

| Campo              | Contenido                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-006                                                                                              |
| Título             | Pagina con los botones anterior y siguiente                                                                |
| Tipo / Nivel       | unitaria / componente                                                                                      |
| Prioridad          | P1                                                                                                         |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)              |
| Precondiciones     | Vitest + jsdom; `pagination={{ page: 2, totalPages: 3, onPageChange }}`.                                   |
| Pasos              | 1. Click en "Página siguiente".<br>2. Click en "Página anterior".<br>3. Leer el indicador "Página 2 de 3". |
| Datos de prueba    | Página 2 de 3.                                                                                             |
| Resultado esperado | `onPageChange` recibe 3 y luego 1; el indicador muestra "Página 2 de 3" (la página la controla el caller). |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `pagina con los botones anterior/siguiente`              |

### CP-WEB-UI-007 — La búsqueda del toolbar notifica una sola vez tras el debounce

| Campo              | Contenido                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-007                                                                                                        |
| Título             | La búsqueda del toolbar notifica una sola vez tras el debounce                                                       |
| Tipo / Nivel       | unitaria / componente                                                                                                |
| Prioridad          | P2                                                                                                                   |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)                        |
| Precondiciones     | Vitest + jsdom; `DataTableToolbar` + `DataTableSearch debounceMs={50}`.                                              |
| Pasos              | 1. Escribir "ana" en el `searchbox`.<br>2. Esperar el debounce.                                                      |
| Datos de prueba    | Texto "ana", `debounceMs=50`.                                                                                        |
| Resultado esperado | `onSearchChange` no se llama con "a" (sin eco por tecla); se llama con "ana" y en total 1 vez.                       |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `renderiza el slot de toolbar y la búsqueda notifica con debounce` |

### CP-WEB-UI-008 — Solo las columnas ordenables exponen aria-sort y ciclan asc/desc

| Campo              | Contenido                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-008                                                                                                                                                  |
| Título             | Solo las columnas ordenables exponen aria-sort y ciclan asc/desc                                                                                               |
| Tipo / Nivel       | unitaria / componente · a11y                                                                                                                                   |
| Prioridad          | P2                                                                                                                                                             |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)                                                                  |
| Precondiciones     | Vitest + jsdom; `sorting` controlado y columnas con y sin `enableSorting`.                                                                                     |
| Pasos              | 1. Renderizar con la prop `sorting`.<br>2. Click repetido en el botón de orden de una columna ordenable.<br>3. Inspeccionar `aria-sort` de los `columnheader`. |
| Datos de prueba    | Columnas de prueba del propio test.                                                                                                                            |
| Resultado esperado | Las columnas con `enableSorting` alternan `ascending`/`descending`; las demás no tienen `aria-sort` ni botón.                                                  |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `solo las columnas con enableSorting exponen aria-sort y ciclan asc/desc`                                    |

### CP-WEB-UI-009 — Sin la prop sorting no hay botones de orden ni aria-sort

| Campo              | Contenido                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-009                                                                                             |
| Título             | Sin la prop sorting no hay botones de orden ni aria-sort                                                  |
| Tipo / Nivel       | unitaria / componente · a11y                                                                              |
| Prioridad          | P3                                                                                                        |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)             |
| Precondiciones     | Vitest + jsdom.                                                                                           |
| Pasos              | 1. Renderizar `DataTable` sin `sorting`.<br>2. Buscar botones de orden y `aria-sort`.                     |
| Datos de prueba    | —                                                                                                         |
| Resultado esperado | No existen botones de orden ni atributos `aria-sort`.                                                     |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `sin prop sorting no hay botones de orden ni aria-sort` |

### CP-WEB-UI-010 — Selecciona filas individuales y "seleccionar todo" mantiene coherencia

| Campo              | Contenido                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-010                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Título             | Selecciona filas individuales y "seleccionar todo" mantiene coherencia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Tipo / Nivel       | unitaria / componente                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Prioridad          | P2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`; movido de `layout/data-table.test.tsx` a `data-table/data-table.test.tsx` en d1c7bfd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Precondiciones     | Vitest + jsdom; prop `selection` controlada.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Pasos              | 1. Marcar una fila; marcar el checkbox del header; marcar dos filas en clicks sucesivos; desmarcar una fila.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Datos de prueba    | Filas de prueba del test.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Resultado esperado | Sin `selection` no hay columna de checkboxes; el estado del caller refleja la selección; desmarcar una fila desmarca "seleccionar todo".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `` no muestra columna de selección cuando no se pasa `selection` ``<br>`src/components/data-table/data-table.test.tsx` — `selecciona una fila individual y lo refleja en el estado del caller`<br>`src/components/data-table/data-table.test.tsx` — `el checkbox del header selecciona todas las filas visibles`<br>`src/components/data-table/data-table.test.tsx` — `selecciona dos filas individuales en clicks sucesivos usando la misma referencia`<br>`src/components/data-table/data-table.test.tsx` — `deseleccionar una fila desmarca el checkbox de "seleccionar todo"` |

### CP-WEB-UI-011 — Renderiza la columna de acciones de la fila

| Campo              | Contenido                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-011                                                                                  |
| Título             | Renderiza la columna de acciones de la fila                                                    |
| Tipo / Nivel       | unitaria / componente                                                                          |
| Prioridad          | P3                                                                                             |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commits d1c7bfd (DataTable) y c5083d0 (EmptyState)  |
| Precondiciones     | Vitest + jsdom.                                                                                |
| Pasos              | 1. Renderizar `DataTable` con una columna de acciones.<br>2. Verificar los controles por fila. |
| Datos de prueba    | —                                                                                              |
| Resultado esperado | Cada fila muestra sus acciones.                                                                |
| Automatizado en    | `src/components/data-table/data-table.test.tsx` — `renderiza la columna de acciones`           |

### CP-WEB-UI-012 — EmptyState muestra título y descripción sin CTA por defecto

| Campo              | Contenido                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-012                                                                                 |
| Título             | EmptyState muestra título y descripción sin CTA por defecto                                   |
| Tipo / Nivel       | unitaria / componente                                                                         |
| Prioridad          | P2                                                                                            |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commit c5083d0                                     |
| Precondiciones     | Vitest + jsdom.                                                                               |
| Pasos              | 1. Renderizar `<EmptyState title description />` sin `action`.                                |
| Datos de prueba    | Título y descripción de prueba.                                                               |
| Resultado esperado | Se ven título y descripción; no hay botón.                                                    |
| Automatizado en    | `src/components/ui/empty-state.test.tsx` — `muestra título y descripción sin CTA por defecto` |

### CP-WEB-UI-013 — EmptyState ejecuta la acción al pulsar el CTA

| Campo              | Contenido                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-013                                                                           |
| Título             | EmptyState ejecuta la acción al pulsar el CTA                                           |
| Tipo / Nivel       | unitaria / componente                                                                   |
| Prioridad          | P2                                                                                      |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commit c5083d0                               |
| Precondiciones     | Vitest + jsdom + user-event.                                                            |
| Pasos              | 1. Renderizar con `action` (label + `onClick`).<br>2. Click en el CTA.                  |
| Datos de prueba    | `onClick` = `vi.fn()`.                                                                  |
| Resultado esperado | El handler se invoca.                                                                   |
| Automatizado en    | `src/components/ui/empty-state.test.tsx` — `ejecuta la acción al hacer click en el CTA` |

### CP-WEB-UI-014 — La variante error se anuncia con role="alert" y permite reintentar

| Campo              | Contenido                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-014                                                                                                    |
| Título             | La variante error se anuncia con role="alert" y permite reintentar                                               |
| Tipo / Nivel       | unitaria / componente · a11y                                                                                     |
| Prioridad          | P1                                                                                                               |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commit c5083d0                                                        |
| Precondiciones     | Vitest + jsdom + user-event.                                                                                     |
| Pasos              | 1. Renderizar `EmptyState variant="error"` con acción de reintento.<br>2. Verificar el rol; click en reintentar. |
| Datos de prueba    | —                                                                                                                |
| Resultado esperado | `role="alert"` (lectores de pantalla lo anuncian); el reintento dispara el callback.                             |
| Automatizado en    | `src/components/ui/empty-state.test.tsx` — `la variante error se anuncia con role="alert" y permite reintentar`  |

### CP-WEB-UI-015 — Las variantes no-error usan role="status"

| Campo              | Contenido                                                                              |
| ------------------ | -------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-UI-015                                                                          |
| Título             | Las variantes no-error usan role="status"                                              |
| Tipo / Nivel       | unitaria / componente · a11y                                                           |
| Prioridad          | P2                                                                                     |
| Trazabilidad       | rama `feat/admin-ui-datatable-emptystate`, commit c5083d0                              |
| Precondiciones     | Vitest + jsdom.                                                                        |
| Pasos              | 1. Renderizar variantes vacío y sin-resultados.<br>2. Verificar el rol.                |
| Datos de prueba    | —                                                                                      |
| Resultado esperado | `role="status"` (anuncio cortés, no intrusivo).                                        |
| Automatizado en    | `src/components/ui/empty-state.test.tsx` — `las variantes no-error usan role="status"` |
