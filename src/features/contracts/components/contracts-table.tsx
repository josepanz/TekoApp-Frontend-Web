'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/layout/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppLocale } from '@/i18n/use-app-locale';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import { formatDate } from '@/lib/formatters';
import type { ContractAudit, ContractStatus } from '../api';
import { useAdminContractsQueueQuery } from '../hooks';

const PAGE_SIZE = 10;
const ALL = 'all';

const STATUS_OPTIONS: ContractStatus[] = [
  'DRAFT',
  'PENDING_CLIENT_SIGNATURE',
  'PENDING_PROFESSIONAL_SIGNATURE',
  'SIGNED',
  'CANCELLED',
];

const STATUS_VARIANT: Record<
  ContractStatus,
  'default' | 'secondary' | 'destructive'
> = {
  DRAFT: 'secondary',
  PENDING_CLIENT_SIGNATURE: 'secondary',
  PENDING_PROFESSIONAL_SIGNATURE: 'secondary',
  SIGNED: 'default',
  CANCELLED: 'destructive',
};

// Gate client-side por permiso (`contracts.audit:read`/`admin:all`) — mismo patrón que
// `service-progress-section.tsx`: no pedimos el listado si el permiso no está asignado.
export function ContractsTable() {
  const { data: scope } = useSessionScopeQuery();
  const canView = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.CONTRACTS.AUDIT_VIEW, PERMISSIONS.ADMIN.ALL],
  );

  if (!canView) {
    return null;
  }

  return <ContractsTableContent />;
}

function ContractsTableContent() {
  const t = useTranslations('contracts');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ContractStatus | undefined>(undefined);
  const { data, isPending, isError } = useAdminContractsQueueQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
  });

  const columns: ColumnDef<ContractAudit, unknown>[] = [
    {
      accessorKey: 'referenceId',
      header: t('table.reference'),
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>
          {t(`status.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      id: 'client',
      header: t('table.client'),
      cell: ({ row }) => `#${row.original.clientReferenceId}`,
    },
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) => `#${row.original.professionalReferenceId}`,
    },
    {
      id: 'service',
      header: t('table.service'),
      cell: ({ row }) => `#${row.original.serviceReferenceId}`,
    },
    {
      id: 'pdfAvailable',
      header: t('table.pdf'),
      cell: ({ row }) =>
        row.original.pdfAvailable ? (
          <Badge variant="secondary">{t('table.pdfAvailable')}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={status ?? ALL}
        onValueChange={(value) => {
          setStatus(value === ALL ? undefined : (value as ContractStatus));
          setPage(1);
        }}
      >
        <SelectTrigger aria-label={t('filter.statusLabel')} className="w-64">
          <SelectValue placeholder={t('filter.statusLabel')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filter.all')}</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`status.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
