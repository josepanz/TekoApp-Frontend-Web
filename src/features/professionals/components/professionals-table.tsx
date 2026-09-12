'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import {
  useExportProfessionalsMutation,
  useProfessionalsQuery,
} from '../hooks';
import type { Professional } from '../api';
import { SuspendProfessionalDialog } from './suspend-professional-dialog';
import { VerifyProfessionalDialog } from './verify-professional-dialog';

const STATUS_VARIANT: Record<
  Professional['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
};

const VERIFICATION_VARIANT: Record<
  Professional['verificationStatus'],
  'default' | 'secondary' | 'destructive'
> = {
  VERIFIED: 'default',
  REJECTED: 'destructive',
  UNVERIFIED: 'secondary',
};

const PAGE_SIZE = 10;

export function ProfessionalsTable() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useProfessionalsQuery({
    page,
    pageSize: PAGE_SIZE,
  });
  const exportMutation = useExportProfessionalsMutation();

  // El export pega contra `PROFESSIONALS.VERIFY`/`ADMIN.ALL` en el backend (mismo permiso que
  // verificar/suspender) — la tabla en sí no está gateada (no todo staff que la ve puede
  // exportar), así que el botón se oculta solo si falta el permiso, sin tocar el resto de la
  // tabla.
  const { data: scope } = useSessionScopeQuery();
  const canExport = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.PROFESSIONALS.VERIFY, PERMISSIONS.ADMIN.ALL],
  );

  const statusLabel: Record<Professional['status'], string> = {
    PENDING: t('status.PENDING'),
    APPROVED: t('status.APPROVED'),
    REJECTED: t('status.REJECTED'),
    SUSPENDED: t('status.SUSPENDED'),
  };

  const columns: ColumnDef<Professional, unknown>[] = [
    {
      id: 'name',
      header: t('table.name'),
      cell: ({ row }) =>
        `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      id: 'category',
      header: t('table.category'),
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>
          {statusLabel[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: 'verificationStatus',
      header: t('table.verification'),
      cell: ({ row }) => (
        <Badge variant={VERIFICATION_VARIANT[row.original.verificationStatus]}>
          {row.original.verificationStatus}
        </Badge>
      ),
    },
    {
      id: 'rating',
      header: t('table.rating'),
      cell: ({ row }) =>
        `${Number(row.original.averageRating || 0).toFixed(1)} ⭐`,
    },
    {
      accessorKey: 'isAvailable',
      header: t('table.available'),
      cell: ({ row }) => (
        <Badge variant={row.original.isAvailable ? 'default' : 'secondary'}>
          {row.original.isAvailable ? t('table.yes') : t('table.no')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={`/admin/professionals/${row.original.referenceId}`}>
                {tCommon('actions.view')}
              </Link>
            }
          />
          {row.original.verificationStatus !== 'VERIFIED' && (
            <VerifyProfessionalDialog professional={row.original} />
          )}
          {row.original.status !== 'SUSPENDED' && (
            <SuspendProfessionalDialog professional={row.original} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {canExport && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate({})}
          >
            <Download />
            {exportMutation.isPending
              ? tCommon('states.generating')
              : tCommon('actions.export')}
          </Button>
        </div>
      )}

      {isPending && <Skeleton className="h-64" />}

      {!isPending && isError && (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      )}

      {!isPending && !isError && (
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
