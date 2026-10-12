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
import { CountryCombobox } from '@/features/countries/components/country-combobox';
import { UserCombobox } from '@/features/users/components/user-combobox';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { useUserConsentsAuditQuery } from '../hooks';
import type { ConsentDocumentType, UserConsentAudit } from '../api';

const DOCUMENT_TYPE_OPTIONS: ConsentDocumentType[] = [
  'TERMS_OF_SERVICE',
  'PRIVACY_POLICY',
  'DATA_PROCESSING_CONSENT',
  'IMAGE_USAGE_CONSENT',
];

const ALL_OPTION = 'ALL';
const PAGE_SIZE = 10;

export function UserConsentsAuditTable() {
  const t = useTranslations('consentAudit.userConsents');
  const tTypes = useTranslations('legalDocumentVersions');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [documentType, setDocumentType] = useState<
    ConsentDocumentType | undefined
  >(undefined);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [userReferenceId, setUserReferenceId] = useState<string | undefined>(
    undefined,
  );
  const { data, isPending, isError, isFetching, refetch } =
    useUserConsentsAuditQuery({
      page,
      pageSize: PAGE_SIZE,
      documentType,
      countryId,
      userReferenceId,
    });

  const columns: ColumnDef<UserConsentAudit, unknown>[] = [
    {
      id: 'user',
      header: t('table.user'),
      cell: ({ row }) =>
        `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      id: 'documentType',
      header: t('table.documentType'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {tTypes(
            `documentTypeOptions.${row.original.legalDocumentVersion.documentType}`,
          )}
        </Badge>
      ),
    },
    {
      id: 'version',
      header: t('table.version'),
      cell: ({ row }) => row.original.legalDocumentVersion.version,
    },
    {
      accessorKey: 'acceptedAt',
      header: t('table.acceptedAt'),
      cell: ({ row }) => formatDate(row.original.acceptedAt, locale),
    },
    {
      id: 'ipAddress',
      header: t('table.ipAddress'),
      cell: ({ row }) => row.original.ipAddress ?? '—',
    },
    {
      id: 'acceptanceHash',
      header: t('table.acceptanceHash'),
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.original.acceptanceHash.slice(0, 12)}…
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Select
          value={documentType ?? ALL_OPTION}
          onValueChange={(value) => {
            setDocumentType(
              value === ALL_OPTION ? undefined : (value as ConsentDocumentType),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.documentTypeLabel')}
            className="w-64"
          >
            <SelectValue placeholder={t('filter.documentTypeLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {tTypes(`documentTypeOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-2">
          <Label htmlFor="countryIdFilter">{t('filter.countryLabel')}</Label>
          <CountryCombobox
            id="countryIdFilter"
            className="w-64"
            placeholder={t('filter.searchCountryPlaceholder')}
            emptyText={t('filter.noCountries')}
            clearLabel={t('filter.clearFilter')}
            onChange={(id) => {
              setCountryId(id);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="userReferenceIdFilter">{t('filter.userLabel')}</Label>
          <UserCombobox
            id="userReferenceIdFilter"
            className="w-72"
            placeholder={t('filter.searchUserPlaceholder')}
            emptyText={t('filter.noUsers')}
            clearLabel={t('filter.clearFilter')}
            onChange={(referenceId) => {
              setUserReferenceId(referenceId);
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
          documentType !== undefined ||
          countryId !== undefined ||
          userReferenceId !== undefined
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
