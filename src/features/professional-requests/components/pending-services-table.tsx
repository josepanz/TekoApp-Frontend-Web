'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import { useAcceptServiceMutation, usePendingServicesQuery } from '../hooks';
import type { Service } from '../api';

const PAGE_SIZE = 10;

export function PendingServicesTable() {
  const [page, setPage] = useState(1);
  const { data: professional } = useMyProfessionalProfileQuery();
  const { data, isPending, isError } = usePendingServicesQuery({
    categoryId: professional?.categoryId,
    page,
    pageSize: PAGE_SIZE,
  });
  const acceptMutation = useAcceptServiceMutation();

  const columns: ColumnDef<Service, unknown>[] = [
    { accessorKey: 'title', header: 'Servicio' },
    {
      id: 'client',
      header: 'Cliente',
      cell: ({ row }) =>
        `${row.original.users.firstName} ${row.original.users.lastName}`,
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
      id: 'urgent',
      header: 'Urgente',
      cell: ({ row }) =>
        row.original.isUrgent ? (
          <Badge variant="destructive">Urgente</Badge>
        ) : (
          '—'
        ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          disabled={acceptMutation.isPending}
          onClick={() => acceptMutation.mutate(row.original.id)}
        >
          Aceptar
        </Button>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudieron cargar las solicitudes pendientes. Intentá recargar la
        página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage="No hay solicitudes pendientes en tu categoría"
      pagination={{
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
