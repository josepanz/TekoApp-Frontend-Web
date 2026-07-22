'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { RateProfessionalDialog } from '@/features/rate-professional/components/rate-professional-dialog';
import { useMyClientServicesQuery } from '../hooks';
import type { Service } from '../api';
import { CancelServiceDialog } from './cancel-service-dialog';

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

const CANCELLABLE = new Set<Service['status']>(['PENDING', 'ACCEPTED']);

export function MyClientServicesTable() {
  const { data, isPending, isError } = useMyClientServicesQuery({});

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: 'Servicio' },
    {
      id: 'professional',
      header: 'Profesional',
      cell: ({ row }) =>
        row.original.professional
          ? `${row.original.professional.user.firstName} ${row.original.professional.user.lastName}`
          : 'Sin asignar',
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
        if (CANCELLABLE.has(service.status)) {
          return <CancelServiceDialog serviceId={service.id} />;
        }
        if (service.status === 'COMPLETED' && service.professional) {
          return (
            <RateProfessionalDialog
              serviceRequestId={service.id}
              professionalUserReferenceId={
                service.professional.user.referenceId
              }
              professionalName={`${service.professional.user.firstName} ${service.professional.user.lastName}`}
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
      emptyMessage="Todavía no solicitaste ningún servicio"
    />
  );
}
