'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { formatDate } from '@/lib/formatters';
import type { AdminPortfolioItem, PortfolioReviewStatus } from '../api';
import { useAdminPortfolioQueueQuery } from '../hooks';
import { PortfolioReviewDialog } from './portfolio-review-dialog';

const PAGE_SIZE = 10;
const ALL = 'all';

const STATUS_OPTIONS: PortfolioReviewStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
];

const STATUS_VARIANT: Record<
  PortfolioReviewStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
};

export function PortfolioReviewQueueTable() {
  const t = useTranslations('professionalPortfolio');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PortfolioReviewStatus | undefined>(
    'PENDING',
  );
  const [reviewing, setReviewing] = useState<AdminPortfolioItem | null>(null);
  const { data, isPending, isError } = useAdminPortfolioQueueQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
  });

  const columns: ColumnDef<AdminPortfolioItem, unknown>[] = [
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) =>
        `${row.original.professional.firstName} ${row.original.professional.lastName}`,
    },
    {
      id: 'caption',
      header: t('table.caption'),
      cell: ({ row }) => row.original.caption ?? '—',
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>
          {t(`statusOptions.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('table.uploadedAt'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReviewing(row.original)}
        >
          {t('table.reviewButton')}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={status ?? ALL}
        onValueChange={(value) => {
          setStatus(
            value === ALL ? undefined : (value as PortfolioReviewStatus),
          );
          setPage(1);
        }}
      >
        <SelectTrigger aria-label={t('filter.statusLabel')} className="w-48">
          <SelectValue placeholder={t('filter.statusLabel')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filter.all')}</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`statusOptions.${option}`)}
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

      <PortfolioReviewDialog
        item={reviewing}
        onOpenChange={(open) => {
          if (!open) setReviewing(null);
        }}
      />
    </div>
  );
}
