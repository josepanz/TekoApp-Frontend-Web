'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useCategoriesQuery } from '@/features/categories/hooks';
import type { MaterialCatalogItem, MaterialQualityTier } from '../api';
import {
  useMaterialCatalogQuery,
  useUpdateMaterialCatalogItemMutation,
} from '../hooks';
import { MaterialCatalogItemFormDialog } from './material-catalog-item-form-dialog';

const QUALITY_TIER_OPTIONS: MaterialQualityTier[] = [
  'BASIC',
  'STANDARD',
  'PREMIUM',
];

const ALL_OPTION = 'ALL';
const PAGE_SIZE = 10;

export function MaterialCatalogTable() {
  const t = useTranslations('materialCatalog');
  const tCommon = useTranslations('common');
  const { data: categories } = useCategoriesQuery();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [qualityTier, setQualityTier] = useState<
    MaterialQualityTier | undefined
  >(undefined);
  const { data, isPending, isError } = useMaterialCatalogQuery({
    page,
    pageSize: PAGE_SIZE,
    categoryId,
    qualityTier,
  });
  const updateMutation = useUpdateMaterialCatalogItemMutation();
  const [editingItem, setEditingItem] = useState<MaterialCatalogItem | null>(
    null,
  );

  const categoryName = new Map(
    categories?.map((category) => [category.id, category.name]),
  );

  const columns: ColumnDef<MaterialCatalogItem, unknown>[] = [
    { accessorKey: 'name', header: t('table.name') },
    {
      id: 'category',
      header: t('table.category'),
      cell: ({ row }) =>
        categoryName.get(row.original.categoryId) ?? row.original.categoryId,
    },
    {
      accessorKey: 'qualityTier',
      header: t('table.qualityTier'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`qualityTierOptions.${row.original.qualityTier}`)}
        </Badge>
      ),
    },
    { accessorKey: 'unit', header: t('table.unit') },
    {
      accessorKey: 'defaultPrice',
      header: t('table.defaultPrice'),
      cell: ({ row }) => row.original.defaultPrice.toLocaleString('es-PY'),
    },
    {
      id: 'isActive',
      header: t('table.active'),
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          disabled={updateMutation.isPending}
          onCheckedChange={(checked) =>
            updateMutation.mutate({
              referenceId: row.original.referenceId,
              dto: { isActive: checked },
            })
          }
          aria-label={
            row.original.isActive
              ? t('table.deactivate', { name: row.original.name })
              : t('table.activate', { name: row.original.name })
          }
        />
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingItem(row.original)}
        >
          {tCommon('actions.edit')}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={categoryId ? String(categoryId) : ALL_OPTION}
          onValueChange={(value) => {
            setCategoryId(value === ALL_OPTION ? undefined : Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.categoryLabel')}
            className="w-56"
          >
            <SelectValue placeholder={t('filter.categoryLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={qualityTier ?? ALL_OPTION}
          onValueChange={(value) => {
            setQualityTier(
              value === ALL_OPTION ? undefined : (value as MaterialQualityTier),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.qualityTierLabel')}
            className="w-56"
          >
            <SelectValue placeholder={t('filter.qualityTierLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {QUALITY_TIER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`qualityTierOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          emptyMessage={t('table.empty')}
          pagination={{
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            onPageChange: setPage,
          }}
        />
      )}

      <MaterialCatalogItemFormDialog
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
        item={editingItem ?? undefined}
      />
    </div>
  );
}
