'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
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
      header: t('table.name'),
    },
    {
      accessorKey: 'slug',
      header: t('table.slug'),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.slug}</span>
      ),
    },
    {
      id: 'iconColor',
      header: t('table.iconColor'),
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
      header: t('table.visible'),
      cell: ({ row }) => (
        <Switch
          checked={row.original.isVisible}
          disabled={toggleVisibilityMutation.isPending}
          onCheckedChange={() =>
            toggleVisibilityMutation.mutate(row.original.id)
          }
          aria-label={
            row.original.isVisible
              ? t('table.hide', { name: row.original.name })
              : t('table.show', { name: row.original.name })
          }
        />
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingCategory(row.original)}
          >
            {tCommon('actions.edit')}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingCategory(row.original)}
          >
            {tCommon('actions.delete')}
          </Button>
        </div>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        emptyMessage={t('table.empty')}
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
            <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete.description', { name: deletingCategory?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
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
              {deleteMutation.isPending
                ? tCommon('states.deleting')
                : tCommon('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
