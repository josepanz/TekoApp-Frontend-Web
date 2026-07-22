'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { formatCurrency } from '@/lib/formatters';
import { useServicesQuery } from '../hooks';
import type { Service, ServiceStatus } from '../api';

const STATUS_VARIANT: Record<
  ServiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  ACCEPTED: 'outline',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const STATUS_FILTER_OPTIONS: ServiceStatus[] = [
  'PENDING',
  'ACCEPTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

const ALL_STATUSES = 'ALL';

// El DTO generado no expone un único campo "monto": según el ciclo de vida del servicio puede
// venir como finalAmount (ya facturado), totalAmount (estimado con horas/tarifa), fixedPrice
// (tarifa cerrada) o hourlyRate (por hora). Se muestra el más específico disponible.
function getDisplayAmount(service: Service): number | undefined {
  return (
    service.finalAmount ??
    service.totalAmount ??
    service.fixedPrice ??
    service.hourlyRate
  );
}

function getProfessionalLabel(service: Service): string {
  return service.professionalId
    ? `Profesional #${service.professionalId}`
    : 'Sin asignar';
}

const columns: ColumnDef<Service, unknown>[] = [
  {
    id: 'service',
    header: 'Servicio',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.title}</span>
        {row.original.category && (
          <span className="text-muted-foreground text-xs">
            {row.original.category.name}
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'client',
    header: 'Cliente',
    cell: ({ row }) =>
      `${row.original.users.firstName} ${row.original.users.lastName}`,
  },
  {
    id: 'professional',
    header: 'Profesional',
    cell: ({ row }) => getProfessionalLabel(row.original),
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
      const amount = getDisplayAmount(row.original);
      return amount !== undefined ? formatCurrency(amount) : '—';
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('es-PY'),
  },
];

const PAGE_SIZE = 10;

export function ServicesTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ServiceStatus | undefined>(undefined);
  const { data, isPending, isError } = useServicesQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
  });

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={status ?? ALL_STATUSES}
        onValueChange={(value) => {
          setStatus(
            value === ALL_STATUSES ? undefined : (value as ServiceStatus),
          );
          setPage(1);
        }}
      >
        <SelectTrigger aria-label="Filtrar por estado" className="w-56">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>Todos los estados</SelectItem>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {STATUS_LABEL[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <p className="text-muted-foreground">
          No se pudo cargar la lista de servicios. Intentá recargar la página.
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          emptyMessage="No hay servicios para mostrar"
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            onPageChange: setPage,
          }}
        />
      )}
    </div>
  );
}
