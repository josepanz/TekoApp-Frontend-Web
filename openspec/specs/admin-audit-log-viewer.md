# Spec: Visor de auditoría (backoffice)

Hallazgo origen: `I-01` del WORKPLAN de `platform-hardening-2026-09` (§6, workflow 4 —
sostenibilidad). Una de 4 features independientes de ese hallazgo — ver también
`admin-bulk-actions.md`, `admin-data-export.md`, `admin-global-search.md`. No agrupar la
implementación de estas 4 specs en una sola tarea.

## Objetivo

Darle a staff una pantalla para ver el rastro de auditoría (quién cambió qué, cuándo y con qué
valores) de cualquier entidad de negocio, en vez de que esa información solo exista en la base y
nadie del staff pueda consultarla.

## Contexto verificado

`TekoApp-Backend/prisma/schema.prisma` define `model AuditLogs` (`@@map("audit_logs")`) con
triggers genéricos de base de datos que ya escriben ahí en cada INSERT/UPDATE/DELETE de las tablas
de negocio que califican (ver comentario de `Language` en el schema como ejemplo de qué "califica").
Columnas: `tableName`, `recordId`, `operationType`, `oldData`/`newData` (JSON), `changedAt`,
`changedBy`, más `reason`/`ipAddress`/`userAgent` opcionales.

**Bloqueante verificado**: no existe ningún controller en `TekoApp-Backend/src/api` que exponga
`AuditLogs` por HTTP. Esta spec **no se puede implementar solo en Web** — es BFF puro, nunca toca
la base directo (regla no negociable #4 de este repo). Antes de tocar código de Web hace falta:

1. Un endpoint nuevo en el backend, ej. `GET /admin/audit-logs`, paginado, con filtros por
   `tableName`, `recordId`, `changedBy` y rango de `changedAt`.
2. Un permiso nuevo (ver más abajo) que ese endpoint gatee.
3. Regenerar `src/core/api-client/types.generated.ts` (`pnpm generate:api-types`) una vez el
   backend lo publique — nunca escribir esos tipos a mano (convención #6).

## Alcance

**Incluye** (una vez exista el endpoint):

- `src/features/audit-log/` (`api.ts`, `hooks.ts`, `components/audit-log-table.tsx`) +
  `src/app/admin/audit-log/page.tsx`.
- Tabla paginada server-side (patrón `DataTable`, igual que `contracts-table.tsx` de F-01):
  columnas tabla afectada, id de registro, tipo de operación (badge), quién, cuándo.
- Filtro por tabla afectada (select) y por rango de fechas.
- Un diálogo de detalle por fila que muestra el diff entre `oldData`/`newData` — formateado como
  JSON legible (`<pre>`), no una librería de diff visual nueva: no se justifica la complejidad
  para el volumen de uso esperado (staff técnico, uso ocasional).

**No incluye**:

- Ninguna acción sobre el registro auditado (revertir un cambio, etc.) — es de solo lectura.
- Auditoría de acciones fuera de lo que el trigger de base ya captura (ej. lecturas, exports).

## Pantallas / flujos

- Ítem de nav nuevo (`layout.nav.admin.auditLog` en `es.json`/`en.json`, **las dos**) apuntando a
  `/admin/audit-log`.
- `page.tsx` con el shell estándar (`h1` + descripción + tabla) — no desviarse del patrón (ver
  regla "no refactorices las `page.tsx`" en el WORKPLAN de hardening).

## Permisos

**A definir con el equipo de backend** — no existe hoy. Sugerido, siguiendo el patrón de
`CONTRACTS.AUDIT_VIEW`/`PAYMENTS.AUDIT_VIEW` ya usado en este repo (`src/core/auth/permissions.ts`):
`SYSTEM.AUDIT_VIEW` → `system.audit:read`. Aplicar el mismo gate client-side que `C-02` del
WORKPLAN de hardening (`useSessionScopeQuery` + `hasAnyPermission` + `PERMISSIONS.ADMIN.ALL`) una
vez exista la constante.

## Fuera de alcance de esta spec

El endpoint del backend en sí (queda para el WORKPLAN de `TekoApp-Backend`), y cualquier UI de
auditoría específica de un dominio que ya tenga su propia sección (ej. `service-progress-section.tsx`,
la auditoría de consentimiento en `/admin/legal/consent-audit`) — esas ya existen y no se
reemplazan por esta pantalla genérica.

## Riesgos / límites explícitos

- `oldData`/`newData` pueden contener datos sensibles (ej. si una tabla de negocio guarda PII) —
  este permiso debe ser tan restrictivo como `ADMIN.ALL` hasta que se defina lo contrario; no
  asignarlo por default a ningún rol nuevo sin decisión explícita.
- El volumen de `audit_logs` puede ser alto en producción — el endpoint del backend **debe**
  paginar server-side; Web nunca debe pedir "todos los registros" para filtrar client-side.
