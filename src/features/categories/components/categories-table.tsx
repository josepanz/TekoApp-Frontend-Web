'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BulkActionsBar } from '@/components/layout/bulk-actions-bar';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { runBulkAction } from '@/lib/run-bulk-action';
import { deleteCategory, type Category } from '../api';
import { CategoryIcon } from './category-label';
import {
  CATEGORIES_QUERY_KEY,
  useCategoriesQuery,
  useDeleteCategoryMutation,
  useToggleCategoryVisibilityMutation,
} from '../hooks';
import { CategoryFormDialog } from './category-form-dialog';

export function CategoriesTable() {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useCategoriesQuery();
  const toggleVisibilityMutation = useToggleCategoryVisibilityMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
          <CategoryIcon icon={row.original.icon} color={row.original.color} />
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
        <div className="flex items-center gap-2">
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
          <Badge variant={row.original.isVisible ? 'success' : 'secondary'}>
            {row.original.isVisible
              ? t('table.visibleBadge')
              : t('table.hiddenBadge')}
          </Badge>
        </div>
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
            nativeButton={false}
            render={
              <Link href={`/admin/categories/${row.original.id}`}>
                {tCommon('actions.view')}
              </Link>
            }
          />
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

  async function handleBulkDelete() {
    if (!data) return;
    const selected = data.filter((category) =>
      selectedIds.includes(String(category.id)),
    );
    setIsBulkDeleting(true);
    const { succeeded, failed } = await runBulkAction(selected, (category) =>
      deleteCategory(category.id),
    );
    setIsBulkDeleting(false);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });

    if (failed.length === 0) {
      toast.success(t('bulkDelete.successAll', { count: succeeded.length }));
    } else if (succeeded.length === 0) {
      toast.error(t('bulkDelete.failedAll', { count: failed.length }));
    } else {
      toast.warning(
        t('bulkDelete.partialResult', {
          succeeded: succeeded.length,
          total: selected.length,
          failed: failed.length,
          names: failed.map((f) => f.item.name).join(', '),
        }),
      );
    }
  }

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  return (
    <>
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
      >
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          {t('bulkDelete.cta', { count: selectedIds.length })}
        </Button>
      </BulkActionsBar>

      <DataTable
        columns={columns}
        data={data}
        emptyMessage={t('table.empty')}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
          getRowId: (row) => String(row.id),
        }}
      />

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bulkDelete.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bulkDelete.confirmDescription', {
                count: selectedIds.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={() => {
                void handleBulkDelete();
              }}
            >
              {isBulkDeleting
                ? tCommon('states.deleting')
                : tCommon('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
