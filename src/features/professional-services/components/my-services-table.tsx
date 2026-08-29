'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { RateClientDialog } from '@/features/professional-ratings/components/rate-client-dialog';
import { formatCurrency } from '@/lib/formatters';
import {
  useCompleteServiceMutation,
  useMyServicesQuery,
  useStartServiceMutation,
} from '../hooks';
import type { Service } from '../api';

const STATUS_VARIANT: Record<
  Service['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  ACCEPTED: 'secondary',
  IN_PROGRESS: 'default',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export function MyServicesTable() {
  const t = useTranslations('professionalServices');
  const { data, isPending, isError } = useMyServicesQuery({});
  const startMutation = useStartServiceMutation();
  const completeMutation = useCompleteServiceMutation();

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: t('table.service') },
    {
      id: 'client',
      header: t('table.client'),
      cell: ({ row }) =>
        `${row.original.users.firstName} ${row.original.users.lastName}`,
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
      id: 'amount',
      header: t('table.amount'),
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
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => {
        const service = row.original;
        if (service.status === 'ACCEPTED') {
          return (
            <Button
              size="sm"
              disabled={startMutation.isPending}
              onClick={() => startMutation.mutate(service.referenceId)}
            >
              {t('table.start')}
            </Button>
          );
        }
        if (service.status === 'IN_PROGRESS') {
          return (
            <Button
              size="sm"
              disabled={completeMutation.isPending}
              onClick={() => completeMutation.mutate(service.referenceId)}
            >
              {t('table.complete')}
            </Button>
          );
        }
        if (service.status === 'COMPLETED') {
          return (
            <RateClientDialog
              serviceId={service.referenceId}
              clientReferenceId={service.users.referenceId}
              clientName={`${service.users.firstName} ${service.users.lastName}`}
            />
          );
        }
        return null;
      },
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  return (
    <DataTable columns={columns} data={data} emptyMessage={t('table.empty')} />
  );
}
