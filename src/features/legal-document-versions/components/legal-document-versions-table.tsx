'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import type { LegalDocumentVersion } from '../api';
import { useLegalDocumentVersionsQuery } from '../hooks';
import { LegalDocumentVersionFormDialog } from './legal-document-version-form-dialog';

export function LegalDocumentVersionsTable() {
  const t = useTranslations('legalDocumentVersions');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const { data, isPending, isError } = useLegalDocumentVersionsQuery();
  const [editingVersion, setEditingVersion] =
    useState<LegalDocumentVersion | null>(null);

  const columns: ColumnDef<LegalDocumentVersion, unknown>[] = [
    {
      accessorKey: 'documentType',
      header: t('table.documentType'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(`documentTypeOptions.${row.original.documentType}`)}
        </Badge>
      ),
    },
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
    { accessorKey: 'version', header: t('table.version') },
    {
      accessorKey: 'contentUrl',
      header: t('table.contentUrl'),
      cell: ({ row }) => (
        <a
          href={row.original.contentUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary inline-flex items-center gap-1 underline underline-offset-2"
        >
          <ExternalLinkIcon className="size-3.5" />
          {t('table.viewLink')}
        </a>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: t('table.publishedAt'),
      cell: ({ row }) => formatDate(row.original.publishedAt, locale),
    },
    {
      id: 'isActive',
      header: t('table.active'),
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge>{tCommon('states.yes')}</Badge>
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
          onClick={() => setEditingVersion(row.original)}
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

      <LegalDocumentVersionFormDialog
        open={!!editingVersion}
        onOpenChange={(open) => {
          if (!open) setEditingVersion(null);
        }}
        version={editingVersion ?? undefined}
      />
    </>
  );
}
