'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Promotion } from '../api';
import { useDeletePromotionMutation, usePromotionsQuery } from '../hooks';
import { PromotionFormDialog } from './promotion-form-dialog';

const STATUS_VARIANT: Record<
  Promotion['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  EXPIRED: 'destructive',
  DEPLETED: 'destructive',
};

function formatDiscount(promotion: Promotion): string {
  if (promotion.type === 'PERCENTAGE') {
    return `${promotion.discountPercentage ?? 0}%`;
  }
  if (promotion.type === 'FIXED_AMOUNT') {
    return formatCurrency(promotion.discountAmount ?? 0);
  }
  return '—';
}

function PromotionRowActions({ promotion }: { promotion: Promotion }) {
  const t = useTranslations('promotions');
  const tCommon = useTranslations('common');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeletePromotionMutation();

  return (
    <div className="flex justify-end gap-2">
      <PromotionFormDialog
        promotion={promotion}
        trigger={
          <Button variant="outline" size="sm">
            {tCommon('actions.edit')}
          </Button>
        }
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="outline" size="sm">
              {tCommon('actions.delete')}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deactivate.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deactivate.description', { name: promotion.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate(promotion.id, {
                  onSuccess: () => setConfirmOpen(false),
                })
              }
            >
              {deleteMutation.isPending
                ? t('deactivate.pending')
                : t('deactivate.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PromotionsTable() {
  const t = useTranslations('promotions');
  const locale = useAppLocale();
  const { data, isPending, isError } = usePromotionsQuery();

  const columns: ColumnDef<Promotion, unknown>[] = [
    {
      accessorKey: 'code',
      header: t('table.code'),
    },
    {
      accessorKey: 'name',
      header: t('table.name'),
    },
    {
      id: 'discount',
      header: t('table.discount'),
      cell: ({ row }) =>
        `${t(`type.${row.original.type}`)} · ${formatDiscount(row.original)}`,
    },
    {
      id: 'validity',
      header: t('table.validity'),
      cell: ({ row }) =>
        `${formatDate(row.original.validFrom, locale)} – ${formatDate(row.original.validUntil, locale)}`,
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
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => <PromotionRowActions promotion={row.original} />,
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
