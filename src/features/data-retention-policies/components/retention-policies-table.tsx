'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { RetentionPolicy } from '../api';
import { useRetentionPoliciesQuery } from '../hooks';
import { RetentionPolicyFormDialog } from './retention-policy-form-dialog';

export function RetentionPoliciesTable() {
  const t = useTranslations('dataRetentionPolicies');
  const tCommon = useTranslations('common');
  const { data, isPending, isError } = useRetentionPoliciesQuery();
  const [editingPolicy, setEditingPolicy] = useState<RetentionPolicy | null>(
    null,
  );
  const [creating, setCreating] = useState(false);

  const columns: ColumnDef<RetentionPolicy, unknown>[] = [
    {
      accessorKey: 'countryId',
      header: t('table.country'),
      cell: ({ row }) =>
        row.original.countryId ?? (
          <span className="text-muted-foreground">
            {t('table.international')}
          </span>
        ),
    },
    {
      accessorKey: 'contentType',
      header: t('table.contentType'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`contentTypeOptions.${row.original.contentType}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'retentionDays',
      header: t('table.retentionDays'),
      cell: ({ row }) =>
        row.original.retentionDays
          ? t('table.days', { days: row.original.retentionDays })
          : t('table.indefinite'),
    },
    {
      id: 'allowsUserDeletion',
      header: t('table.allowsUserDeletion'),
      cell: ({ row }) =>
        row.original.allowsUserDeletion ? (
          <Badge>{tCommon('states.yes')}</Badge>
        ) : (
          <span className="text-muted-foreground">{tCommon('states.no')}</span>
        ),
    },
    {
      id: 'requiresLegalHold',
      header: t('table.requiresLegalHold'),
      cell: ({ row }) =>
        row.original.requiresLegalHold ? (
          <Badge variant="destructive">{tCommon('states.yes')}</Badge>
        ) : (
          <span className="text-muted-foreground">{tCommon('states.no')}</span>
        ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingPolicy(row.original)}
        >
          {tCommon('actions.edit')}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <PlusIcon />
          {t('newButton')}
        </Button>
      </div>

      {isPending ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          emptyMessage={t('table.empty')}
        />
      )}

      <RetentionPolicyFormDialog
        open={!!editingPolicy}
        onOpenChange={(open) => {
          if (!open) setEditingPolicy(null);
        }}
        policy={editingPolicy ?? undefined}
      />
      <RetentionPolicyFormDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
