'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { useDeleteRatingMutation, useRatingsQuery } from '../hooks';
import type { Rating } from '../api';

const TYPE_VARIANT: Record<Rating['type'], 'default' | 'secondary'> = {
  CLIENT_TO_PROFESSIONAL: 'default',
  PROFESSIONAL_TO_CLIENT: 'secondary',
};

function RatingActionsCell({ rating }: { rating: Rating }) {
  const t = useTranslations('ratings.delete');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteRatingMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        {tCommon('actions.delete')}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(rating.id, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteMutation.isPending
              ? tCommon('states.deleting')
              : t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RatingsTable() {
  const t = useTranslations('ratings');
  const locale = useAppLocale();
  const { data, isPending, isError } = useRatingsQuery();

  const columns: ColumnDef<Rating, unknown>[] = [
    {
      id: 'userId',
      header: t('table.user'),
      cell: ({ row }) => `#${row.original.userId}`,
    },
    {
      id: 'professionalId',
      header: t('table.professional'),
      cell: ({ row }) => `#${row.original.professionalId}`,
    },
    {
      accessorKey: 'rating',
      header: t('table.rating'),
      cell: ({ row }) => row.original.rating.toFixed(1),
    },
    {
      accessorKey: 'type',
      header: t('table.type'),
      cell: ({ row }) => (
        <Badge variant={TYPE_VARIANT[row.original.type]}>
          {t(`type.${row.original.type}`)}
        </Badge>
      ),
    },
    {
      id: 'isReported',
      header: t('table.reported'),
      cell: ({ row }) =>
        row.original.isReported ? (
          <Badge variant="destructive">{t('table.reportedBadge')}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: 'review',
      header: t('table.review'),
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-xs text-sm">
          {row.original.review ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => <RatingActionsCell rating={row.original} />,
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
    />
  );
}
