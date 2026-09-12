'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/layout/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppLocale } from '@/i18n/use-app-locale';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import { formatDate } from '@/lib/formatters';
import type { AuditLogEntry } from '../api';
import { useAuditLogsQuery } from '../hooks';
import { AuditLogDetailDialog } from './audit-log-detail-dialog';

const PAGE_SIZE = 10;

// Match exacto por operación de la base (INSERT/UPDATE/DELETE) — no es un enum tipado en el
// Swagger (`operationType: string`), así que el variant por default cubre cualquier valor nuevo
// sin romper si el trigger genérico agrega uno.
const OPERATION_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive'
> = {
  INSERT: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
};

interface AuditLogFilters {
  tableName: string;
  recordId: string;
  changedBy: string;
  startDate: string;
  endDate: string;
}

const EMPTY_FILTERS: AuditLogFilters = {
  tableName: '',
  recordId: '',
  changedBy: '',
  startDate: '',
  endDate: '',
};

// Gate client-side por permiso (`system.audit:read`/`admin:all`) — mismo patrón que
// `contracts-table.tsx`/`service-progress-section.tsx`: no pedimos el listado si el permiso no
// está asignado. `oldData`/`newData` pueden traer PII, así que este permiso es tan restrictivo
// como ADMIN.ALL hasta que se decida lo contrario (ver admin-audit-log-viewer.md).
export function AuditLogTable() {
  const { data: scope } = useSessionScopeQuery();
  const canView = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.SYSTEM.AUDIT_VIEW, PERMISSIONS.ADMIN.ALL],
  );

  if (!canView) {
    return null;
  }

  return <AuditLogTableContent />;
}

function AuditLogTableContent() {
  const t = useTranslations('auditLog');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>(EMPTY_FILTERS);

  const { data, isPending, isError } = useAuditLogsQuery({
    page,
    pageSize: PAGE_SIZE,
    tableName: filters.tableName || undefined,
    recordId: filters.recordId || undefined,
    changedBy: filters.changedBy || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  function updateFilter(key: keyof AuditLogFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  const columns: ColumnDef<AuditLogEntry, unknown>[] = [
    {
      accessorKey: 'tableName',
      header: t('table.tableName'),
    },
    {
      accessorKey: 'recordId',
      header: t('table.recordId'),
    },
    {
      accessorKey: 'operationType',
      header: t('table.operation'),
      cell: ({ row }) => (
        <Badge
          variant={OPERATION_VARIANT[row.original.operationType] ?? 'secondary'}
        >
          {row.original.operationType}
        </Badge>
      ),
    },
    {
      accessorKey: 'changedBy',
      header: t('table.changedBy'),
    },
    {
      accessorKey: 'changedAt',
      header: t('table.changedAt'),
      cell: ({ row }) => formatDate(row.original.changedAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => <AuditLogDetailDialog entry={row.original} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audit-log-table-filter">
            {t('filter.tableName')}
          </Label>
          <Input
            id="audit-log-table-filter"
            value={filters.tableName}
            onChange={(event) => updateFilter('tableName', event.target.value)}
            placeholder={t('filter.tableNamePlaceholder')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audit-log-record-filter">
            {t('filter.recordId')}
          </Label>
          <Input
            id="audit-log-record-filter"
            value={filters.recordId}
            onChange={(event) => updateFilter('recordId', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audit-log-changedby-filter">
            {t('filter.changedBy')}
          </Label>
          <Input
            id="audit-log-changedby-filter"
            value={filters.changedBy}
            onChange={(event) => updateFilter('changedBy', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audit-log-start-date-filter">
            {t('filter.startDate')}
          </Label>
          <Input
            id="audit-log-start-date-filter"
            type="date"
            value={filters.startDate}
            onChange={(event) => updateFilter('startDate', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audit-log-end-date-filter">
            {t('filter.endDate')}
          </Label>
          <Input
            id="audit-log-end-date-filter"
            type="date"
            value={filters.endDate}
            onChange={(event) => updateFilter('endDate', event.target.value)}
          />
        </div>
      </div>

      {isPending ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          emptyMessage={t('table.empty')}
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            onPageChange: setPage,
          }}
        />
      )}
    </div>
  );
}
