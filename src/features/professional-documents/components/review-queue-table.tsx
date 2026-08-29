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
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import type {
  AdminProfessionalDocument,
  DocumentCategory,
  DocumentReviewStatus,
} from '../api';
import { useAdminProfessionalDocumentsQueueQuery } from '../hooks';
import { DocumentReviewDialog } from './document-review-dialog';

const PAGE_SIZE = 10;
const ALL = 'all';

const STATUS_OPTIONS: DocumentReviewStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
];
const CATEGORY_OPTIONS: DocumentCategory[] = [
  'BACKGROUND_CHECK',
  'QUALIFICATION',
  'PORTFOLIO',
];

const STATUS_VARIANT: Record<
  DocumentReviewStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  EXPIRED: 'outline',
};

export function ReviewQueueTable() {
  const t = useTranslations('professionalDocuments');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<DocumentReviewStatus | undefined>(
    'PENDING',
  );
  const [category, setCategory] = useState<DocumentCategory | undefined>(
    undefined,
  );
  const [reviewing, setReviewing] = useState<AdminProfessionalDocument | null>(
    null,
  );
  const { data, isPending, isError } = useAdminProfessionalDocumentsQueueQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
    category,
  });

  const columns: ColumnDef<AdminProfessionalDocument, unknown>[] = [
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) =>
        `${row.original.professional.firstName} ${row.original.professional.lastName}`,
    },
    {
      id: 'documentType',
      header: t('table.documentType'),
      cell: ({ row }) => row.original.professionalDocumentType.name,
    },
    {
      id: 'category',
      header: t('table.category'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {t(
            `categoryOptions.${row.original.professionalDocumentType.category}`,
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>
          {t(`statusOptions.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('table.uploadedAt'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReviewing(row.original)}
        >
          {t('table.reviewButton')}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Select
          value={status ?? ALL}
          onValueChange={(value) => {
            setStatus(
              value === ALL ? undefined : (value as DocumentReviewStatus),
            );
            setPage(1);
          }}
        >
          <SelectTrigger aria-label={t('filter.statusLabel')} className="w-48">
            <SelectValue placeholder={t('filter.statusLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('filter.all')}</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`statusOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category ?? ALL}
          onValueChange={(value) => {
            setCategory(
              value === ALL ? undefined : (value as DocumentCategory),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.categoryLabel')}
            className="w-48"
          >
            <SelectValue placeholder={t('filter.categoryLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('filter.all')}</SelectItem>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`categoryOptions.${option}`)}
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

      <DocumentReviewDialog
        document={reviewing}
        onOpenChange={(open) => {
          if (!open) setReviewing(null);
        }}
      />
    </div>
  );
}
