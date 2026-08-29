'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { RateProfessionalDialog } from '@/features/rate-professional/components/rate-professional-dialog';
import { formatCurrency } from '@/lib/formatters';
import { useMyClientServicesQuery } from '../hooks';
import type { Service } from '../api';
import { CancelServiceDialog } from './cancel-service-dialog';

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

const CANCELLABLE = new Set<Service['status']>(['PENDING', 'ACCEPTED']);

export function MyClientServicesTable() {
  const t = useTranslations('myServices');
  const { data, isPending, isError } = useMyClientServicesQuery({});

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: t('table.service') },
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) =>
        row.original.professional
          ? `${row.original.professional.user.firstName} ${row.original.professional.user.lastName}`
          : t('table.unassigned'),
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
        if (CANCELLABLE.has(service.status)) {
          return <CancelServiceDialog serviceId={service.referenceId} />;
        }
        if (service.status === 'COMPLETED' && service.professional) {
          return (
            <RateProfessionalDialog
              serviceRequestId={service.referenceId}
              professionalUserReferenceId={
                service.professional.user.referenceId
              }
              professionalName={`${service.professional.user.firstName} ${service.professional.user.lastName}`}
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
