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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import type { Category } from '../api';
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
  useToggleCategoryVisibilityMutation,
} from '../hooks';
import { CategoryFormDialog } from './category-form-dialog';

export function CategoriesTable() {
  const { data, isPending, isError } = useCategoriesQuery();
  const toggleVisibilityMutation = useToggleCategoryVisibilityMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const columns: ColumnDef<Category, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.slug}</span>
      ),
    },
    {
      id: 'iconColor',
      header: 'Ícono / Color',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.color && (
            <span
              className="size-4 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: row.original.color }}
              aria-hidden="true"
            />
          )}
          <span className="text-muted-foreground">
            {row.original.icon ?? '—'}
          </span>
        </div>
      ),
    },
    {
      id: 'isVisible',
      header: 'Visible',
      cell: ({ row }) => (
        <Switch
          checked={row.original.isVisible}
          disabled={toggleVisibilityMutation.isPending}
          onCheckedChange={() =>
            toggleVisibilityMutation.mutate(row.original.id)
          }
          aria-label={
            row.original.isVisible
              ? `Ocultar ${row.original.name}`
              : `Mostrar ${row.original.name}`
          }
        />
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingCategory(row.original)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingCategory(row.original)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de categorías. Intentá recargar la página.
      </p>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        emptyMessage="No hay categorías para mostrar"
      />

      <CategoryFormDialog
        open={!!editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory ?? undefined}
      />

      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la categoría &quot;
              {deletingCategory?.name}&quot;. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deletingCategory) return;
                deleteMutation.mutate(deletingCategory.id, {
                  onSuccess: () => setDeletingCategory(null),
                });
              }}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
