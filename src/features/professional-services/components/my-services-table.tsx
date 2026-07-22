'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { RateClientDialog } from '@/features/professional-ratings/components/rate-client-dialog';
import {
  useCompleteServiceMutation,
  useMyServicesQuery,
  useStartServiceMutation,
} from '../hooks';
import type { Service } from '../api';

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

const STATUS_LABEL: Record<Service['status'], string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export function MyServicesTable() {
  const { data, isPending, isError } = useMyServicesQuery({});
  const startMutation = useStartServiceMutation();
  const completeMutation = useCompleteServiceMutation();

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: 'Servicio' },
    {
      id: 'client',
      header: 'Cliente',
      cell: ({ row }) =>
        `${row.original.users.firstName} ${row.original.users.lastName}`,
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
      id: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount =
          row.original.finalAmount ??
          row.original.totalAmount ??
          row.original.fixedPrice ??
          row.original.hourlyRate;
        return amount ? `Gs. ${Number(amount).toLocaleString('es-PY')}` : '—';
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const service = row.original;
        if (service.status === 'ACCEPTED') {
          return (
            <Button
              size="sm"
              disabled={startMutation.isPending}
              onClick={() => startMutation.mutate(service.id)}
            >
              Iniciar
            </Button>
          );
        }
        if (service.status === 'IN_PROGRESS') {
          return (
            <Button
              size="sm"
              disabled={completeMutation.isPending}
              onClick={() => completeMutation.mutate(service.id)}
            >
              Completar
            </Button>
          );
        }
        if (service.status === 'COMPLETED') {
          return (
            <RateClientDialog
              serviceId={service.id}
              clientReferenceId={service.users.referenceId}
              clientName={`${service.users.firstName} ${service.users.lastName}`}
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
    return (
      <p className="text-muted-foreground">
        No se pudieron cargar tus servicios. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No tenés servicios asignados todavía"
    />
  );
}
