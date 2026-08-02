'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import { formatCurrency } from '@/lib/formatters';
import { useAcceptServiceMutation, usePendingServicesQuery } from '../hooks';
import type { Service } from '../api';

const PAGE_SIZE = 10;

export function PendingServicesTable() {
  const t = useTranslations('professionalRequests.table');
  const [page, setPage] = useState(1);
  const { data: professional } = useMyProfessionalProfileQuery();
  const { data, isPending, isError } = usePendingServicesQuery({
    categoryId: professional?.categoryId,
    page,
    pageSize: PAGE_SIZE,
  });
  const acceptMutation = useAcceptServiceMutation();

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: t('service') },
    {
      id: 'client',
      header: t('client'),
      cell: ({ row }) =>
        `${row.original.users.firstName} ${row.original.users.lastName}`,
    },
    {
      id: 'amount',
      header: t('amount'),
      cell: ({ row }) => {
        const amount =
          row.original.finalAmount ??
          row.original.totalAmount ??
          row.original.fixedPrice ??
          row.original.hourlyRate;
        return amount ? formatCurrency(Number(amount)) : '—';
      },
    },
    {
      id: 'urgent',
      header: t('urgent'),
      cell: ({ row }) =>
        row.original.isUrgent ? (
          <Badge variant="destructive">{t('urgent')}</Badge>
        ) : (
          '—'
        ),
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <Button
          size="sm"
          disabled={acceptMutation.isPending}
          onClick={() => acceptMutation.mutate(row.original.id)}
        >
          {t('accept')}
        </Button>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage={t('empty')}
      pagination={{
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
