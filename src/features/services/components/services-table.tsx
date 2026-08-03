'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useServicesQuery } from '../hooks';
import type { Service, ServiceStatus } from '../api';

const STATUS_VARIANT: Record<
  ServiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  ACCEPTED: 'outline',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const STATUS_FILTER_OPTIONS: ServiceStatus[] = [
  'PENDING',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

const ALL_STATUSES = 'ALL';

// El DTO generado no expone un único campo "monto": según el ciclo de vida del servicio puede
// venir como finalAmount (ya facturado), totalAmount (estimado con horas/tarifa), fixedPrice
// (tarifa cerrada) o hourlyRate (por hora). Se muestra el más específico disponible.
function getDisplayAmount(service: Service): number | undefined {
  return (
    service.finalAmount ??
    service.totalAmount ??
    service.fixedPrice ??
    service.hourlyRate
  );
}

const PAGE_SIZE = 10;

export function ServicesTable() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ServiceStatus | undefined>(undefined);
  const { data, isPending, isError } = useServicesQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
  });

  const statusLabel: Record<ServiceStatus, string> = {
    PENDING: t('status.PENDING'),
    ACCEPTED: t('status.ACCEPTED'),
    IN_PROGRESS: t('status.IN_PROGRESS'),
    COMPLETED: t('status.COMPLETED'),
    CANCELLED: t('status.CANCELLED'),
  };

  function getProfessionalLabel(service: Service): string {
    return service.professionalId
      ? t('table.professionalRef', { id: String(service.professionalId) })
      : t('table.unassigned');
  }

  const columns: ColumnDef<Service, unknown>[] = [
    {
      id: 'service',
      header: t('table.service'),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          {row.original.category && (
            <span className="text-muted-foreground text-xs">
              {row.original.category.name}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'client',
      header: t('table.client'),
      cell: ({ row }) =>
        `${row.original.users.firstName} ${row.original.users.lastName}`,
    },
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) => getProfessionalLabel(row.original),
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
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => {
        const amount = getDisplayAmount(row.original);
        return amount !== undefined ? formatCurrency(amount) : '—';
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link href={`/admin/services/${row.original.id}`}>
              {tCommon('actions.view')}
            </Link>
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={status ?? ALL_STATUSES}
        onValueChange={(value) => {
          setStatus(
            value === ALL_STATUSES ? undefined : (value as ServiceStatus),
          );
          setPage(1);
        }}
      >
        <SelectTrigger aria-label={t('filter.label')} className="w-56">
          <SelectValue placeholder={t('filter.label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>{t('filter.all')}</SelectItem>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {statusLabel[option]}
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
