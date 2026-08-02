'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useProfessionalsQuery } from '../hooks';
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

// `verificationStatus` es un string libre en el backend (no un enum tipado en el Swagger) —
// se mapea de forma defensiva en vez de asumir un Record exhaustivo.
function getVerificationVariant(
  verificationStatus: string,
): 'default' | 'secondary' | 'destructive' {
  if (verificationStatus === 'verified') return 'default';
  if (verificationStatus === 'rejected') return 'destructive';
  return 'secondary';
}

const PAGE_SIZE = 10;

export function ProfessionalsTable() {
  const t = useTranslations('professionals');
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useProfessionalsQuery({
    page,
    pageSize: PAGE_SIZE,
  });

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
        <Badge
          variant={getVerificationVariant(row.original.verificationStatus)}
        >
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
          {row.original.verificationStatus !== 'verified' && (
            <VerifyProfessionalDialog professional={row.original} />
          )}
          {row.original.status !== 'SUSPENDED' && (
            <SuspendProfessionalDialog professional={row.original} />
          )}
        </div>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  return (
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
  );
}
