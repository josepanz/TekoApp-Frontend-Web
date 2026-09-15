# Spec: Export CSV/Excel desde tablas admin (backoffice)

Hallazgo origen: `I-01` del WORKPLAN de `platform-hardening-2026-09` (§6, workflow 4 —
sostenibilidad). Una de 4 features independientes de ese hallazgo — ver también
`admin-audit-log-viewer.md`, `admin-bulk-actions.md`, `admin-global-search.md`. No agrupar la
implementación de estas 4 specs en una sola tarea. Priorizar esta si el staff pide algo primero:
es la que un área de administración suele pedir primero (ver nota del WORKPLAN).

## Objetivo

Que staff pueda bajar un archivo CSV/Excel de una tabla admin (empezando por pagos y
profesionales, que son lo primero que pide un área de administración) en vez de copiar filas a
mano.

## Contexto verificado

`TekoApp-Backend/src/core/interceptors/file-download.interceptor.ts` ya existe: un
`FileDownloadInterceptor` genérico que soporta `xlsx`/`pdf`/`csv` vía un decorator
(`DOWNLOAD_FILE_KEY`) y devuelve un `StreamableFile` con los headers correctos
(`Content-Disposition: attachment`). **Nadie lo usa hoy** — `grep` sobre `src/api` no encuentra
ningún controller que lo invoque. La infraestructura de bajo nivel existe; el endpoint por entidad,
no.

**Bloqueante**: exportar pagos/profesionales necesita un endpoint nuevo por entidad en el backend
(ej. `GET /admin/payments/export?...&format=csv`) que arme el buffer y use el interceptor
existente — no es trabajo de Web. Igual que en `admin-audit-log-viewer.md`, esta spec no se puede
completar solo en este repo.

## Alcance

**Incluye** (una vez el backend publique el endpoint de una entidad):

1. Un botón "Exportar" en la tabla (`payments-table.tsx` primero, `professionals` tabla segundo),
   que dispara una descarga respetando los filtros activos de la tabla (ej. si hay un filtro de
   estado aplicado, el export trae solo esas filas — nunca "exportar todo" ignorando el filtro
   visible).
2. La descarga pasa por `apiFetch`/`uploadFile` del wrapper existente
   (`src/core/api-client/client.ts`), nunca un `fetch` crudo — mismo BFF, mismo manejo de sesión.
   Puede requerir una función nueva en `client.ts` si el wrapper actual no maneja bien una
   respuesta binaria (`blob()` en vez de `.json()`) — verificarlo antes de escribir la función de
   descarga.
3. Formato: **CSV primero** (más simple, sin dependencia nueva). Excel (`.xlsx`) queda para cuando
   el backend lo soporte — no generar el `.xlsx` client-side con una librería nueva si el backend
   ya tiene la infraestructura para hacerlo server-side.

**No incluye**:

- Exportar con columnas configurables por el usuario (elegir qué campos salen) — fijo por ahora,
  las mismas columnas que la tabla muestra.
- PDF — el interceptor lo soporta pero no hay pedido de negocio para eso todavía.

## Pantallas / flujos

- Botón "Exportar" (ícono `Download` de lucide-react) al lado del filtro existente de cada tabla.
- Estado de carga mientras se arma el archivo (puede tardar si el backend genera un CSV grande) —
  `disabled` + texto "Generando...", mismo patrón que los botones de mutación existentes
  (`isPending`).
- El navegador dispara la descarga nativa vía el header `Content-Disposition` que ya devuelve el
  interceptor — no hay que armar un blob URL a mano si `apiFetch` deja pasar la respuesta cruda.

## Permisos

Ninguno nuevo — el export respeta el mismo permiso de lectura que ya gatea ver la tabla
(`PAYMENTS.AUDIT_VIEW`/`PROFESSIONALS.VERIFY` según la tabla). El backend debe aplicar el mismo
`@Permissions(...)` al endpoint de export que al endpoint de listado — no un permiso más laxo.

## Fuera de alcance de esta spec

El endpoint del backend en sí y la decisión de qué columnas expone cada export (eso lo define
staff/negocio, no esta spec de UI).

## Riesgos / límites explícitos

- Los datos de pagos son sensibles (montos, ids de transacción) — el CSV exportado sale del
  navegador de un staff member; no hay control sobre qué hace esa persona con el archivo después.
  Es un riesgo aceptado del propio pedido de negocio, no algo que esta spec resuelva, pero vale
  dejarlo escrito: el permiso de export debe ser al menos tan restrictivo como el de ver la tabla.
- Si el backend arma el CSV completo en memoria antes de responder, un dataset grande puede ser
  lento o pesado — pedirle al backend que pagine o streamee si el volumen real lo justifica (fuera
  del control de esta spec de Web, pero vale anotarlo al coordinar el endpoint).
