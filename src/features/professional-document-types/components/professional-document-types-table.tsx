'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import type {
  ProfessionalDocumentType,
  UpdateProfessionalDocumentTypeDto,
} from '../api';
import {
  useProfessionalDocumentTypesQuery,
  useUpdateProfessionalDocumentTypeMutation,
} from '../hooks';
import { ProfessionalDocumentTypeFormDialog } from './professional-document-type-form-dialog';

export function ProfessionalDocumentTypesTable() {
  const t = useTranslations('professionalDocumentTypes');
  const tCommon = useTranslations('common');
  const { data, isPending, isError } = useProfessionalDocumentTypesQuery();
  const updateMutation = useUpdateProfessionalDocumentTypeMutation();
  const [editingType, setEditingType] =
    useState<ProfessionalDocumentType | null>(null);

  const columns: ColumnDef<ProfessionalDocumentType, unknown>[] = [
    { accessorKey: 'name', header: t('table.name') },
    {
      accessorKey: 'code',
      header: t('table.code'),
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: t('table.category'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`categoryOptions.${row.original.category}`)}
        </Badge>
      ),
    },
    {
      id: 'isRequired',
      header: t('table.required'),
      cell: ({ row }) =>
        row.original.isRequired ? (
          <Badge>{tCommon('states.yes')}</Badge>
        ) : (
          <span className="text-muted-foreground">{tCommon('states.no')}</span>
        ),
    },
    {
      id: 'validityDays',
      header: t('table.validity'),
      cell: ({ row }) =>
        row.original.validityDays
          ? t('table.validityDays', { days: row.original.validityDays })
          : t('table.noExpiration'),
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
              // El tipo generado marca isRequired/requiresStaffReview/isVisibleToClient/sortOrder
              // como NO opcionales en UpdateProfessionalDocumentTypeRequestDTO pese a que el
              // backend los valida con @IsOptional() real (PartialType de las de Create) — quirk
              // de generación de Swagger, no del comportamiento real. Cast documentado en vez de
              // mandar los 4 campos completos solo para pisar 1.
              dto: { isActive: checked } as UpdateProfessionalDocumentTypeDto,
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
          onClick={() => setEditingType(row.original)}
        >
          {tCommon('actions.edit')}
        </Button>
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

      <ProfessionalDocumentTypeFormDialog
        open={!!editingType}
        onOpenChange={(open) => {
          if (!open) setEditingType(null);
        }}
        documentType={editingType ?? undefined}
      />
    </>
  );
}
