'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { formatCurrency, formatDate } from '@/lib/formatters';
import { usePaymentsQuery } from '../hooks';
import type { Payment, PaymentStatus } from '../api';
import { CancelPaymentDialog } from './cancel-payment-dialog';
import { RefundPaymentDialog } from './refund-payment-dialog';

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

const STATUS_OPTIONS = Object.keys(STATUS_VARIANT) as PaymentStatus[];

// Un pago solo se puede reembolsar si ya fue efectivamente cobrado, y solo se puede cancelar si
// todavía no se procesó — evita mostrar acciones que el backend rechazaría (403/400).
const REFUNDABLE_STATUSES: PaymentStatus[] = ['PAID', 'COMPLETED'];
const CANCELLABLE_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING'];

const STATUS_FILTER_ALL = 'ALL';
type StatusFilterValue = PaymentStatus | typeof STATUS_FILTER_ALL;

export function PaymentsTable() {
  const t = useTranslations('payments');
  const locale = useAppLocale();
  const [statusFilter, setStatusFilter] =
    useState<StatusFilterValue>(STATUS_FILTER_ALL);

  const { data, isPending, isError } = usePaymentsQuery({
    status: statusFilter === STATUS_FILTER_ALL ? undefined : statusFilter,
  });

  const columns: ColumnDef<Payment, unknown>[] = [
    {
      accessorKey: 'transactionId',
      header: t('table.reference'),
    },
    {
      id: 'amount',
      header: t('table.amount'),
      // Se respeta el `currencyCode` que manda el backend por pago (default PYG en
      // `formatCurrency`): hoy todos los pagos son en guaraníes, pero forzar PYG sobre un monto
      // en otra moneda mostraría un importe incorrecto, no solo otro símbolo.
      cell: ({ row }) =>
        formatCurrency(row.original.totalAmount, row.original.currencyCode),
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
      id: 'user',
      header: t('table.user'),
      cell: ({ row }) => `#${row.original.userId}`,
    },
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) => `#${row.original.professionalId}`,
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
        if (REFUNDABLE_STATUSES.includes(payment.status)) {
          return (
            <RefundPaymentDialog
              paymentId={payment.id}
              amount={payment.totalAmount}
            />
          );
        }
        if (CANCELLABLE_STATUSES.includes(payment.status)) {
          return <CancelPaymentDialog paymentId={payment.id} />;
        }
        return <span className="text-muted-foreground">—</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={statusFilter}
        onValueChange={(value: StatusFilterValue | null) =>
          setStatusFilter(value ?? STATUS_FILTER_ALL)
        }
      >
        <SelectTrigger className="w-56" aria-label={t('filter.label')}>
          <SelectValue placeholder={t('filter.label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={STATUS_FILTER_ALL}>{t('filter.all')}</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {t(`status.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && <Skeleton className="h-64" />}

      {isError && (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      )}

      {!isPending && !isError && (
        <DataTable
          columns={columns}
          data={data}
          emptyMessage={t('table.empty')}
        />
      )}
    </div>
  );
}
