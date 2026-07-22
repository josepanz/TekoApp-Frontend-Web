'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useDeleteRatingMutation, useRatingsQuery } from '../hooks';
import type { Rating } from '../api';

const TYPE_LABEL: Record<Rating['type'], string> = {
  CLIENT_TO_PROFESSIONAL: 'Cliente → Profesional',
  PROFESSIONAL_TO_CLIENT: 'Profesional → Cliente',
};

const TYPE_VARIANT: Record<Rating['type'], 'default' | 'secondary'> = {
  CLIENT_TO_PROFESSIONAL: 'default',
  PROFESSIONAL_TO_CLIENT: 'secondary',
};

function RatingActionsCell({ rating }: { rating: Rating }) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteRatingMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar calificación</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La calificación se eliminará
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(rating.id, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteMutation.isPending
              ? 'Eliminando...'
              : 'Confirmar eliminación'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const columns: ColumnDef<Rating, unknown>[] = [
  {
    id: 'userId',
    header: 'Usuario',
    cell: ({ row }) => `#${row.original.userId}`,
  },
  {
    id: 'professionalId',
    header: 'Profesional',
    cell: ({ row }) => `#${row.original.professionalId}`,
  },
  {
    accessorKey: 'rating',
    header: 'Calificación',
    cell: ({ row }) => row.original.rating.toFixed(1),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <Badge variant={TYPE_VARIANT[row.original.type]}>
        {TYPE_LABEL[row.original.type]}
      </Badge>
    ),
  },
  {
    id: 'isReported',
    header: 'Reportada',
    cell: ({ row }) =>
      row.original.isReported ? (
        <Badge variant="destructive">Reportada</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: 'review',
    header: 'Comentario',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-xs text-sm">
        {row.original.review ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('es-PY'),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <RatingActionsCell rating={row.original} />,
  },
];

export function RatingsTable() {
  const { data, isPending, isError } = useRatingsQuery();

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de calificaciones. Intentá recargar la
        página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      emptyMessage="No hay calificaciones para mostrar"
    />
  );
}
