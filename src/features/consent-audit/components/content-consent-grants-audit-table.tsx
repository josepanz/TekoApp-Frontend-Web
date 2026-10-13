'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { UserCombobox } from '@/features/users/components/user-combobox';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { useContentConsentGrantsAuditQuery } from '../hooks';
import type {
  ContentConsentGrantAudit,
  ContentConsentType,
  ContentConsentUsageScope,
} from '../api';

const CONTENT_TYPE_OPTIONS: ContentConsentType[] = [
  'SERVICE_DESCRIPTION',
  'BUDGET_OPTION',
  'PROGRESS_NOTE',
  'PROFESSIONAL_DESCRIPTION',
  'IMAGE',
  'OTHER',
];

const USAGE_SCOPE_OPTIONS: ContentConsentUsageScope[] = [
  'APP_INTERNAL_ONLY',
  'PUBLIC_PROFILE_DISPLAY',
  'MARKETING',
];

const ALL_OPTION = 'ALL';
const PAGE_SIZE = 10;

export function ContentConsentGrantsAuditTable() {
  const t = useTranslations('consentAudit.contentConsents');
  const tTypes = useTranslations('dataRetentionPolicies');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [contentType, setContentType] = useState<
    ContentConsentType | undefined
  >(undefined);
  const [usageScope, setUsageScope] = useState<
    ContentConsentUsageScope | undefined
  >(undefined);
  const [revoked, setRevoked] = useState<boolean | undefined>(undefined);
  const [uploaderReferenceId, setUploaderReferenceId] = useState<
    string | undefined
  >(undefined);
  const { data, isPending, isError, isFetching, refetch } =
    useContentConsentGrantsAuditQuery({
      page,
      pageSize: PAGE_SIZE,
      contentType,
      usageScope,
      revoked,
      uploaderReferenceId,
    });

  const columns: ColumnDef<ContentConsentGrantAudit, unknown>[] = [
    {
      id: 'uploader',
      header: t('table.uploader'),
      cell: ({ row }) =>
        `${row.original.uploader.firstName} ${row.original.uploader.lastName}`,
    },
    {
      id: 'contentType',
      header: t('table.contentType'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {tTypes(`contentTypeOptions.${row.original.contentType}`)}
        </Badge>
      ),
    },
    {
      id: 'usageScope',
      header: t('table.usageScope'),
      cell: ({ row }) => t(`usageScopeOptions.${row.original.usageScope}`),
    },
    {
      accessorKey: 'grantedAt',
      header: t('table.grantedAt'),
      cell: ({ row }) => formatDate(row.original.grantedAt, locale),
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) =>
        row.original.revokedAt ? (
          <Badge variant="destructive">{t('table.revoked')}</Badge>
        ) : (
          <Badge>{t('table.active')}</Badge>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={contentType ?? ALL_OPTION}
          onValueChange={(value) => {
            setContentType(
              value === ALL_OPTION ? undefined : (value as ContentConsentType),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.contentTypeLabel')}
            className="w-56"
          >
            <SelectValue placeholder={t('filter.contentTypeLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {tTypes(`contentTypeOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={revoked === undefined ? ALL_OPTION : String(revoked)}
          onValueChange={(value) => {
            setRevoked(value === ALL_OPTION ? undefined : value === 'true');
            setPage(1);
          }}
        >
          <SelectTrigger aria-label={t('filter.statusLabel')} className="w-48">
            <SelectValue placeholder={t('filter.statusLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            <SelectItem value="false">{t('table.active')}</SelectItem>
            <SelectItem value="true">{t('table.revoked')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={usageScope ?? ALL_OPTION}
          onValueChange={(value) => {
            setUsageScope(
              value === ALL_OPTION
                ? undefined
                : (value as ContentConsentUsageScope),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.usageScopeLabel')}
            className="w-56"
          >
            <SelectValue placeholder={t('filter.usageScopeLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {USAGE_SCOPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`usageScopeOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-2">
          <Label htmlFor="uploaderReferenceIdFilter">
            {t('filter.uploaderLabel')}
          </Label>
          <UserCombobox
            id="uploaderReferenceIdFilter"
            className="w-72"
            placeholder={t('filter.searchUserPlaceholder')}
            emptyText={t('filter.noUsers')}
            clearLabel={t('filter.clearFilter')}
            onChange={(referenceId) => {
              setUploaderReferenceId(referenceId);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable
        isLoading={isPending}
        isFetching={isFetching}
        isError={isError}
        errorMessage={t('table.loadError')}
        onRetry={() => void refetch()}
        isFiltered={
          contentType !== undefined ||
          usageScope !== undefined ||
          revoked !== undefined ||
          uploaderReferenceId !== undefined
        }
        columns={columns}
        data={data?.data ?? []}
        emptyMessage={t('table.empty')}
        pagination={
          data
            ? {
                page: data.pagination.page,
                totalPages: data.pagination.totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </div>
  );
}
