'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDateTime } from '@/lib/formatters';
import type { Professional, ProfessionalStatusHistoryItem } from '../api';
import { useProfessionalStatusHistoryQuery } from '../hooks';

const PAGE_SIZE = 10;

const STATUS_VARIANT: Record<
  Professional['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
};

// Historial de transiciones de estado (verificar/rechazar/suspender/reactivar), de la mas reciente a
// la mas antigua. Tabla sobria: fecha, quien lo hizo, el cambio (de -> a) y el motivo.
export function ProfessionalStatusHistory({
  professionalId,
}: {
  professionalId: number;
}) {
  const t = useTranslations('professionals');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const { data, isPending, isError, isFetching, refetch } =
    useProfessionalStatusHistoryQuery(professionalId, page, PAGE_SIZE);

  const columns: ColumnDef<ProfessionalStatusHistoryItem, unknown>[] = [
    {
      id: 'changedAt',
      header: t('history.date'),
      cell: ({ row }) => (
        <time dateTime={row.original.changedAt} className="whitespace-nowrap">
          {formatDateTime(row.original.changedAt, locale)}
        </time>
      ),
    },
    {
      id: 'actor',
      header: t('history.actor'),
      cell: ({ row }) => {
        const { name, email } = row.original.actor;
        if (!name && !email) {
          return (
            <span className="text-muted-foreground">{t('history.system')}</span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name ?? email}</span>
            {name && email && (
              <span className="text-muted-foreground text-xs">{email}</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'change',
      header: t('history.change'),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={STATUS_VARIANT[row.original.fromStatus]}>
            {t(`status.${row.original.fromStatus}`)}
          </Badge>
          <ArrowRight
            aria-label={t('history.to')}
            role="img"
            className="text-muted-foreground size-3.5"
          />
          <Badge variant={STATUS_VARIANT[row.original.toStatus]}>
            {t(`status.${row.original.toStatus}`)}
          </Badge>
        </div>
      ),
    },
    {
      id: 'reason',
      header: t('history.reason'),
      cell: ({ row }) =>
        row.original.reason ? (
          <span className="whitespace-normal">{row.original.reason}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <DataTable
      aria-label={t('history.title')}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={t('history.loadError')}
      onRetry={() => void refetch()}
      emptyState={{
        title: t('history.emptyTitle'),
        description: t('history.emptyDescription'),
      }}
      pagination={
        data
          ? {
              page: data.pagination.page,
              totalPages: data.pagination.totalPages,
              onPageChange: setPage,
            }
          : undefined
      }
      maxHeightClassName="max-h-[28rem]"
    />
  );
}
