import { http, HttpResponse } from 'msw';
import type { AuditLogEntry } from '@/features/audit-log/api';

// El Swagger no tipa la forma real de `oldData`/`newData` (son JSON arbitrario según la tabla
// auditada) — el generador los deja como `Record<string, never>`, así que el mock necesita este
// cast para poder simular valores reales sin mentirle a `AuditLogEntry` en el resto del archivo.
type AuditDiffValue = AuditLogEntry['oldData'];

export function buildAuditLogEntry(
  overrides: Partial<AuditLogEntry> = {},
): AuditLogEntry {
  return {
    id: '1',
    tableName: 'professionals',
    recordId: '42',
    operationType: 'UPDATE',
    oldData: { isAvailable: false } as unknown as AuditDiffValue,
    newData: { isAvailable: true } as unknown as AuditDiffValue,
    changedAt: '2026-09-01T10:00:00.000Z',
    changedBy: 'staff-uuid-1',
    ...overrides,
  };
}

export const auditLogHandlers = [
  http.get('/api/backend/admin/audit-logs', () => {
    return HttpResponse.json({
      data: [buildAuditLogEntry()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),
];
