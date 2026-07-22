'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useProfessionalsQuery } from '../hooks';
import type { Professional } from '../api';
import { SuspendProfessionalDialog } from './suspend-professional-dialog';
import { VerifyProfessionalDialog } from './verify-professional-dialog';

const STATUS_VARIANT: Record<
  Professional['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
};

const STATUS_LABEL: Record<Professional['status'], string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  SUSPENDED: 'Suspendido',
};

// `verificationStatus` es un string libre en el backend (no un enum tipado en el Swagger) —
// se mapea de forma defensiva en vez de asumir un Record exhaustivo.
function getVerificationVariant(
  verificationStatus: string,
): 'default' | 'secondary' | 'destructive' {
  if (verificationStatus === 'verified') return 'default';
  if (verificationStatus === 'rejected') return 'destructive';
  return 'secondary';
}

const columns: ColumnDef<Professional, unknown>[] = [
  {
    id: 'name',
    header: 'Nombre',
    cell: ({ row }) =>
      `${row.original.user.firstName} ${row.original.user.lastName}`,
  },
  {
    id: 'category',
    header: 'Categoría',
    cell: ({ row }) => row.original.category.name,
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
    accessorKey: 'verificationStatus',
    header: 'Verificación',
    cell: ({ row }) => (
      <Badge variant={getVerificationVariant(row.original.verificationStatus)}>
        {row.original.verificationStatus}
      </Badge>
    ),
  },
  {
    id: 'rating',
    header: 'Calificación',
    cell: ({ row }) =>
      `${Number(row.original.averageRating || 0).toFixed(1)} ⭐`,
  },
  {
    accessorKey: 'isAvailable',
    header: 'Disponible',
    cell: ({ row }) => (
      <Badge variant={row.original.isAvailable ? 'default' : 'secondary'}>
        {row.original.isAvailable ? 'Sí' : 'No'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.verificationStatus !== 'verified' && (
          <VerifyProfessionalDialog professional={row.original} />
        )}
        {row.original.status !== 'SUSPENDED' && (
          <SuspendProfessionalDialog professional={row.original} />
        )}
      </div>
    ),
  },
];

const PAGE_SIZE = 10;

export function ProfessionalsTable() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useProfessionalsQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de profesionales. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage="No hay profesionales para mostrar"
      pagination={{
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
