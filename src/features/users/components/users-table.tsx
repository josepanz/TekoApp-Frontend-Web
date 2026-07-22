'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useUsersQuery } from '../hooks';
import type { User } from '../api';

const STATUS_VARIANT: Record<
  User['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  PENDING_VERIFICATION: 'secondary',
  INACTIVE: 'secondary',
  BLOCKED: 'destructive',
  DELETED: 'destructive',
  REFUSED: 'destructive',
};

const STATUS_LABEL: Record<User['status'], string> = {
  ACTIVE: 'Activo',
  PENDING_VERIFICATION: 'Verificación pendiente',
  INACTIVE: 'Inactivo',
  BLOCKED: 'Bloqueado',
  DELETED: 'Eliminado',
  REFUSED: 'Rechazado',
};

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'name',
    header: 'Nombre',
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Teléfono',
    cell: ({ row }) => row.original.phoneNumber ?? '—',
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
];

const PAGE_SIZE = 10;

export function UsersTable() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useUsersQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de usuarios. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage="No hay usuarios para mostrar"
      pagination={{
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
