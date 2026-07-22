'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import { useMyReviewsQuery } from '../hooks';
import type { ReviewsListResponse } from '../api';

type Review = ReviewsListResponse['data'][number];

const PAGE_SIZE = 10;

const columns: ColumnDef<Review, unknown>[] = [
  {
    id: 'user',
    header: 'Cliente',
    cell: ({ row }) =>
      row.original.isAnonymous
        ? 'Anónimo'
        : `${row.original.user?.firstName ?? ''} ${row.original.user?.lastName ?? ''}`.trim() ||
          '—',
  },
  {
    accessorKey: 'rating',
    header: 'Calificación',
    cell: ({ row }) => `${row.original.rating.toFixed(1)} ⭐`,
  },
  {
    accessorKey: 'review',
    header: 'Comentario',
    cell: ({ row }) => row.original.review ?? '—',
  },
  {
    id: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('es-PY'),
  },
];

export function ReviewsTable() {
  const [page, setPage] = useState(1);
  const { data: professional } = useMyProfessionalProfileQuery();
  const { data, isPending, isError } = useMyReviewsQuery(professional?.id, {
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError || !data) {
    return (
      <p className="text-muted-foreground">
        No se pudieron cargar tus calificaciones. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage="Todavía no tenés calificaciones"
      pagination={{
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        onPageChange: setPage,
      }}
    />
  );
}
