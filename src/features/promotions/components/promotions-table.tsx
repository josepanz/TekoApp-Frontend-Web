'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import type { Promotion } from '../api';
import { useDeletePromotionMutation, usePromotionsQuery } from '../hooks';
import { PromotionFormDialog } from './promotion-form-dialog';

const STATUS_VARIANT: Record<
  Promotion['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  EXPIRED: 'destructive',
  DEPLETED: 'destructive',
};

const STATUS_LABEL: Record<Promotion['status'], string> = {
  ACTIVE: 'Activa',
  INACTIVE: 'Inactiva',
  EXPIRED: 'Expirada',
  DEPLETED: 'Agotada',
};

const TYPE_LABEL: Record<Promotion['type'], string> = {
  PERCENTAGE: 'Porcentaje',
  FIXED_AMOUNT: 'Monto fijo',
  FREE_SERVICE: 'Servicio gratis',
};

function formatDiscount(promotion: Promotion): string {
  if (promotion.type === 'PERCENTAGE') {
    return `${promotion.discountPercentage ?? 0}%`;
  }
  if (promotion.type === 'FIXED_AMOUNT') {
    return `₲ ${(promotion.discountAmount ?? 0).toLocaleString('es-PY')}`;
  }
  return '—';
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-PY');
}

function PromotionRowActions({ promotion }: { promotion: Promotion }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeletePromotionMutation();

  return (
    <div className="flex justify-end gap-2">
      <PromotionFormDialog
        promotion={promotion}
        trigger={
          <Button variant="outline" size="sm">
            Editar
          </Button>
        }
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="outline" size="sm">
              Eliminar
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar esta promoción?</AlertDialogTitle>
            <AlertDialogDescription>
              La promoción &quot;{promotion.name}&quot; se marcará como inactiva
              y dejará de aplicarse a nuevos servicios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate(promotion.id, {
                  onSuccess: () => setConfirmOpen(false),
                })
              }
            >
              {deleteMutation.isPending ? 'Desactivando...' : 'Desactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const columns: ColumnDef<Promotion, unknown>[] = [
  {
    accessorKey: 'code',
    header: 'Código',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    id: 'discount',
    header: 'Descuento',
    cell: ({ row }) =>
      `${TYPE_LABEL[row.original.type]} · ${formatDiscount(row.original)}`,
  },
  {
    id: 'validity',
    header: 'Vigencia',
    cell: ({ row }) =>
      `${formatDate(row.original.validFrom)} – ${formatDate(row.original.validUntil)}`,
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
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <PromotionRowActions promotion={row.original} />,
  },
];

export function PromotionsTable() {
  const { data, isPending, isError } = usePromotionsQuery();

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de promociones. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No hay promociones para mostrar"
    />
  );
}
