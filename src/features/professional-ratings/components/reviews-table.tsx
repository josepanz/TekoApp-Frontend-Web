'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { useMyReviewsQuery } from '../hooks';
import type { ReviewsListResponse } from '../api';

type Review = ReviewsListResponse['data'][number];

const PAGE_SIZE = 10;

export function ReviewsTable() {
  const t = useTranslations('professionalRatings.table');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const { data: professional } = useMyProfessionalProfileQuery();
  const { data, isPending, isError } = useMyReviewsQuery(professional?.id, {
    page,
    pageSize: PAGE_SIZE,
  });

  const columns: ColumnDef<Review, unknown>[] = [
    {
      id: 'user',
      header: t('client'),
      cell: ({ row }) =>
        row.original.isAnonymous
          ? t('anonymous')
          : `${row.original.user?.firstName ?? ''} ${row.original.user?.lastName ?? ''}`.trim() ||
            '—',
    },
    {
      accessorKey: 'rating',
      header: t('rating'),
      cell: ({ row }) => `${row.original.rating.toFixed(1)} ⭐`,
    },
    {
      accessorKey: 'review',
      header: t('comment'),
      cell: ({ row }) => row.original.review ?? '—',
    },
    {
      id: 'createdAt',
      header: t('date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError || !data) {
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
