import { apiFetch } from '@/core/api-client/client';
import type { components, operations } from '@/core/api-client/types.generated';

export type AuditLogEntry = components['schemas']['AuditLogResponseDTO'];
export type AuditLogsListResponse =
  components['schemas']['AuditLogsListResponseDTO'];

// El Swagger no nombra un DTO para el query de este listado — los params viven inline en la
// operación (`AdminAuditLogController_list`). Se referencia `operations[...]` en vez de copiar
// los campos a mano para no perder sincronía si el backend agrega/quita un filtro. `tableName`,
// `recordId` y `changedBy` son match exacto (no búsqueda parcial) — así lo documenta el backend.
export type GetAuditLogsParams = NonNullable<
  operations['AdminAuditLogController_list']['parameters']['query']
>;

// GET /admin/audit-logs — gateado por SYSTEM.AUDIT_VIEW/ADMIN.ALL en el backend. Solo lectura:
// nunca hay acción sobre un registro auditado (ver admin-audit-log-viewer.md).
export function getAuditLogs(
  params: GetAuditLogsParams = {},
): Promise<AuditLogsListResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return apiFetch<AuditLogsListResponse>(
    `admin/audit-logs${queryString ? `?${queryString}` : ''}`,
  );
}
