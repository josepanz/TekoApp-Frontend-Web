# CP-LOC — Mapa admin de ubicaciones (contrato nuevo)

Módulo de geolocalización del admin (`src/features/locations`). El backend entrega ubicación aproximada (±300 m) y solo de profesionales en línea; el frontend se alineó en 716df29.

Formato según `C:\workspace\QA-DOC-STANDARD.md` §2. Los pasos son reproducibles a mano; la columna "Automatizado en" apunta al test real (archivo + nombre del `it`/`test`).

### CP-WEB-LOC-001 — Muestra un mensaje si falta la API key de Google Maps

| Campo              | Contenido                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-LOC-001                                                                                                       |
| Título             | Muestra un mensaje si falta la API key de Google Maps                                                                |
| Tipo / Nivel       | unitaria / componente                                                                                                |
| Prioridad          | P2                                                                                                                   |
| Trazabilidad       | commit 716df29 (alinear mapa al contrato nuevo con posición aproximada)                                              |
| Precondiciones     | Vitest + jsdom; `@vis.gl/react-google-maps` mockeado; `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""` (`vi.stubEnv`).           |
| Pasos              | 1. Renderizar `<LocationsMap professionals center />` sin API key.                                                   |
| Datos de prueba    | Centro -25.2637, -57.5759 (Asunción).                                                                                |
| Resultado esperado | Texto "Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"; no se renderiza el mapa.                                   |
| Automatizado en    | `src/features/locations/components/locations-map.test.tsx` — `muestra un mensaje si falta la API key de Google Maps` |

### CP-WEB-LOC-002 — Renderiza un marcador solo para los profesionales con coordenadas conocidas

| Campo              | Contenido                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ID                 | CP-WEB-LOC-002                                                                                                                             |
| Título             | Renderiza un marcador solo para los profesionales con coordenadas conocidas                                                                |
| Tipo / Nivel       | unitaria / componente                                                                                                                      |
| Prioridad          | P1                                                                                                                                         |
| Trazabilidad       | commit 716df29; contrato `NearbyProfessional` con `latitude`/`longitude` aproximadas                                                       |
| Precondiciones     | Igual que CP-WEB-LOC-001, con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="fake-key"`; 2 profesionales (1 con coords, 1 "Sin posicion").              |
| Pasos              | 1. Renderizar el mapa con ambos profesionales.<br>2. Contar los `marker`.                                                                  |
| Datos de prueba    | Profesional 1: -25.2637/-57.5759; profesional 2 sin posición.                                                                              |
| Resultado esperado | Exactamente 1 marcador.                                                                                                                    |
| Automatizado en    | `src/features/locations/components/locations-map.test.tsx` — `renderiza un marcador solo para los profesionales con coordenadas conocidas` |

### CP-WEB-LOC-003 — toMarkers mapea coordenadas aproximadas y descarta las inválidas

| Campo              | Contenido                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-LOC-003                                                                                                                                  |
| Título             | toMarkers mapea coordenadas aproximadas y descarta las inválidas                                                                                |
| Tipo / Nivel       | unitaria                                                                                                                                        |
| Prioridad          | P1                                                                                                                                              |
| Trazabilidad       | commit 716df29                                                                                                                                  |
| Precondiciones     | Función pura `toMarkers` exportada de `locations-map.tsx`.                                                                                      |
| Pasos              | 1. Llamar `toMarkers` con: el profesional válido, uno con `longitude: "x"` y uno con coordenadas string numéricas.<br>2. Leer ids y posiciones. |
| Datos de prueba    | id 3 → lat "-25.3", lng "x" (inválida); id 4 → "-25.3"/"-57.6".                                                                                 |
| Resultado esperado | Ids resultantes [1, 4]; posiciones {-25.2637,-57.5759} y {-25.3,-57.6} (strings parseados a número; id 3 descartado).                           |
| Automatizado en    | `src/features/locations/components/locations-map.test.tsx` — `mapea latitude/longitude (aproximadas) a posiciones y descarta las invalidas`     |

### CP-WEB-LOC-004 — Informa al admin que la ubicación mostrada es aproximada

| Campo              | Contenido                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-LOC-004                                                                                                                                                                                                      |
| Título             | Informa al admin que la ubicación mostrada es aproximada                                                                                                                                                            |
| Tipo / Nivel       | funcional (manual) — SIN test automatizado                                                                                                                                                                          |
| Prioridad          | P2                                                                                                                                                                                                                  |
| Trazabilidad       | commit 716df29; clave i18n `locations.map.approximateNotice` ("Ubicación aproximada (±300 m) · solo profesionales en línea")                                                                                        |
| Precondiciones     | App levantada con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` válida y backend con profesionales en línea; sesión admin.                                                                                                      |
| Pasos              | 1. Ir a la pantalla del explorador de ubicaciones del admin.<br>2. Buscar cerca de un punto.<br>3. Leer el texto bajo/sobre el mapa.                                                                                |
| Datos de prueba    | Centro Asunción, radio por defecto.                                                                                                                                                                                 |
| Resultado esperado | Se ve el aviso "Ubicación aproximada (±300 m) · solo profesionales en línea" (en es) o su equivalente en en.                                                                                                        |
| Automatizado en    | Pendiente: no hay test que verifique el aviso (`git grep approximateNotice -- "*.test.tsx"` sin resultados). Candidato a un `it` en `locations-explorer.test.tsx`. Se registra como observación en el informe unit. |

### CP-WEB-LOC-005 — El formulario de búsqueda cercana envía los valores y respeta los estados

| Campo              | Contenido                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-LOC-005                                                                                                                                                                                                                                                                                                                                                             |
| Título             | El formulario de búsqueda cercana envía los valores y respeta los estados                                                                                                                                                                                                                                                                                                  |
| Tipo / Nivel       | unitaria / componente                                                                                                                                                                                                                                                                                                                                                      |
| Prioridad          | P2                                                                                                                                                                                                                                                                                                                                                                         |
| Trazabilidad       | commit 716df29 (se eliminó el filtro `onlineOnly` del formulario y del schema)                                                                                                                                                                                                                                                                                             |
| Precondiciones     | Vitest + jsdom + user-event.                                                                                                                                                                                                                                                                                                                                               |
| Pasos              | 1. Click en "Buscar" con los valores por defecto.<br>2. Marcar "Solo disponibles" y buscar.<br>3. Renderizar con `isPending` verdadero.                                                                                                                                                                                                                                    |
| Datos de prueba    | Valores por defecto del formulario.                                                                                                                                                                                                                                                                                                                                        |
| Resultado esperado | El submit entrega los valores por defecto (sin `onlineOnly`); "Solo disponibles" viaja en el envío; el botón queda deshabilitado en pending.                                                                                                                                                                                                                               |
| Automatizado en    | `src/features/locations/components/nearby-search-form.test.tsx` — `envía los valores por defecto al hacer click en Buscar`<br>`src/features/locations/components/nearby-search-form.test.tsx` — `marca "Solo disponibles" y lo incluye en el envío`<br>`src/features/locations/components/nearby-search-form.test.tsx` — `deshabilita el botón mientras isPending es true` |
