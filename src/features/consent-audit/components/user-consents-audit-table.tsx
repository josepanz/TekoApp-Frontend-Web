'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
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
  const { data, isPending, isError } = useUserConsentsAuditQuery({
    page,
    pageSize: PAGE_SIZE,
    documentType,
    countryId,
    userReferenceId,
  });

  function commitCountryId(value: string) {
    const parsed = Number(value);
    setCountryId(value.trim() && Number.isInteger(parsed) ? parsed : undefined);
    setPage(1);
  }

  function commitUserReferenceId(value: string) {
    setUserReferenceId(value.trim() || undefined);
    setPage(1);
  }

  function handleCommitOnEnter(
    event: KeyboardEvent<HTMLInputElement>,
    commit: (value: string) => void,
  ) {
    if (event.key === 'Enter') {
      commit(event.currentTarget.value);
    }
  }

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
          <Label htmlFor="countryIdFilter">{t('filter.countryIdLabel')}</Label>
          <Input
            id="countryIdFilter"
            type="number"
            min={1}
            className="w-40"
            defaultValue={countryId ?? ''}
            onBlur={(event) => commitCountryId(event.currentTarget.value)}
            onKeyDown={(event) => handleCommitOnEnter(event, commitCountryId)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="userReferenceIdFilter">
            {t('filter.userReferenceIdLabel')}
          </Label>
          <Input
            id="userReferenceIdFilter"
            className="w-64"
            defaultValue={userReferenceId ?? ''}
            onBlur={(event) => commitUserReferenceId(event.currentTarget.value)}
            onKeyDown={(event) =>
              handleCommitOnEnter(event, commitUserReferenceId)
            }
          />
        </div>
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
    </div>
  );
}
