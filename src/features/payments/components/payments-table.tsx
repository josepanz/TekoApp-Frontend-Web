'use client';

import type { ColumnDef } from '@tanstack/react-table';
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

const STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  PAID: 'Pagado',
  COMPLETED: 'Completado',
  REFUNDED: 'Reembolsado',
  PARTIAL_REFUNDED: 'Reembolso parcial',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
};

const STATUS_OPTIONS = Object.keys(STATUS_LABEL) as PaymentStatus[];

// Un pago solo se puede reembolsar si ya fue efectivamente cobrado, y solo se puede cancelar si
// todavía no se procesó — evita mostrar acciones que el backend rechazaría (403/400).
const REFUNDABLE_STATUSES: PaymentStatus[] = ['PAID', 'COMPLETED'];
const CANCELLABLE_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING'];

const STATUS_FILTER_ALL = 'ALL';
type StatusFilterValue = PaymentStatus | typeof STATUS_FILTER_ALL;

function formatAmount(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-PY');
}

const columns: ColumnDef<Payment, unknown>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Referencia',
  },
  {
    id: 'amount',
    header: 'Monto',
    cell: ({ row }) =>
      formatAmount(row.original.totalAmount, row.original.currencyCode),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status]}>
        {STATUS_LABEL[row.original.status]}
      </Badge>
    ),
  },
  {
    id: 'user',
    header: 'Usuario',
    cell: ({ row }) => `#${row.original.userId}`,
  },
  {
    id: 'professional',
    header: 'Profesional',
    cell: ({ row }) => `#${row.original.professionalId}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    header: 'Acciones',
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

export function PaymentsTable() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilterValue>(STATUS_FILTER_ALL);

  const { data, isPending, isError } = usePaymentsQuery({
    status: statusFilter === STATUS_FILTER_ALL ? undefined : statusFilter,
  });

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={statusFilter}
        onValueChange={(value: StatusFilterValue | null) =>
          setStatusFilter(value ?? STATUS_FILTER_ALL)
        }
      >
        <SelectTrigger className="w-56" aria-label="Filtrar por estado">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={STATUS_FILTER_ALL}>Todos los estados</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABEL[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && <Skeleton className="h-64" />}

      {isError && (
        <p className="text-muted-foreground">
          No se pudo cargar la lista de pagos. Intentá recargar la página.
        </p>
      )}

      {!isPending && !isError && (
        <DataTable
          columns={columns}
          data={data}
          emptyMessage="No hay pagos para mostrar"
        />
      )}
    </div>
  );
}
