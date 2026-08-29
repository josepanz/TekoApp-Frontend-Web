'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HandCoins } from 'lucide-react';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useMyPaymentsQuery } from '../hooks';
import type { Payment, PaymentStatus } from '../api';
import { CancelPaymentDialog } from './cancel-payment-dialog';

const STATUS_VARIANT: Record<
  PaymentStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  PROCESSING: 'secondary',
  PAID: 'default',
  COMPLETED: 'default',
  REFUNDED: 'secondary',
  PARTIAL_REFUNDED: 'secondary',
  FAILED: 'destructive',
  CANCELLED: 'destructive',
};

// Un cliente solo puede cancelar mientras el pago no se procesó (mismo criterio de
// `PaymentApiService.cancelPayment` del backend) — nunca reembolsar el propio pago, esa acción es
// exclusiva de staff (`/admin/payments`).
const CANCELLABLE_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING'];

export function MyPaymentsTable() {
  const t = useTranslations('myPayments');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const { data, isPending, isError } = useMyPaymentsQuery();

  const columns: ColumnDef<Payment, unknown>[] = [
    {
      accessorKey: 'transactionId',
      header: t('table.reference'),
    },
    {
      id: 'amount',
      header: t('table.amount'),
      cell: ({ row }) => {
        const { tip } = row.original;
        return (
          <div className="flex items-center gap-1.5">
            {formatCurrency(
              row.original.totalAmount,
              row.original.currencyCode,
            )}
            {tip && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span>
                      <HandCoins
                        className="text-muted-foreground size-4"
                        role="img"
                        aria-label={`${t('table.tip')}: ${formatCurrency(tip.amount, tip.currencyCode)}`}
                      />
                    </span>
                  }
                />
                <TooltipContent>
                  {t('table.tip')}:{' '}
                  {formatCurrency(tip.amount, tip.currencyCode)}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
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
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link href={`/mis-pagos/${payment.referenceId}`}>
                  {tCommon('actions.view')}
                </Link>
              }
            />
            {CANCELLABLE_STATUSES.includes(payment.status) && (
              <CancelPaymentDialog paymentId={payment.referenceId} />
            )}
          </div>
        );
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
