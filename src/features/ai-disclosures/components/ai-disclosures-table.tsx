'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useAiDisclosuresQuery } from '../hooks';
import type {
  AiDisclosure,
  AiDisclosureEntityType,
  AiDisclosureSource,
} from '../api';

const ENTITY_TYPE_FILTER_OPTIONS: AiDisclosureEntityType[] = [
  'SERVICE_DESCRIPTION',
  'BUDGET_OPTION',
  'PROGRESS_NOTE',
  'PROFESSIONAL_DESCRIPTION',
  'IMAGE',
  'OTHER',
];

const SOURCE_FILTER_OPTIONS: AiDisclosureSource[] = [
  'PLATFORM_AI',
  'USER_DECLARED_AI',
];

const SOURCE_VARIANT: Record<AiDisclosureSource, 'default' | 'secondary'> = {
  PLATFORM_AI: 'secondary',
  USER_DECLARED_AI: 'default',
};

const ALL_OPTION = 'ALL';

// Ruta de admin correspondiente a cada entityType, cuando existe — ver
// TekoApp-Frontend-Web/openspec/specs/ai-content-disclosure-admin.md ("enlace directo a la
// entidad... con fallback a 'ver detalle no disponible' para tipos sin ruta de admin"). Solo 2
// tipos tienen contenido declarable real hoy (ver decisions.md de Backend/Mobile, Fase 0005/0011),
// así que son los únicos con ruta resuelta — agregar un caso acá cuando el admin correspondiente
// exista para un tipo nuevo.
function resolveEntityHref(
  entityType: AiDisclosureEntityType,
  entityReferenceId: string,
): string | undefined {
  switch (entityType) {
    case 'SERVICE_DESCRIPTION':
      return `/admin/services/${entityReferenceId}`;
    case 'PROFESSIONAL_DESCRIPTION':
      return `/admin/professionals/${entityReferenceId}`;
    default:
      return undefined;
  }
}

const PAGE_SIZE = 10;

export function AiDisclosuresTable() {
  const t = useTranslations('aiDisclosures');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState<
    AiDisclosureEntityType | undefined
  >(undefined);
  const [source, setSource] = useState<AiDisclosureSource | undefined>(
    undefined,
  );
  const { data, isPending, isError } = useAiDisclosuresQuery({
    page,
    pageSize: PAGE_SIZE,
    entityType,
    source,
  });

  const entityTypeLabel: Record<AiDisclosureEntityType, string> = {
    SERVICE_DESCRIPTION: t('entityType.SERVICE_DESCRIPTION'),
    BUDGET_OPTION: t('entityType.BUDGET_OPTION'),
    PROGRESS_NOTE: t('entityType.PROGRESS_NOTE'),
    PROFESSIONAL_DESCRIPTION: t('entityType.PROFESSIONAL_DESCRIPTION'),
    IMAGE: t('entityType.IMAGE'),
    OTHER: t('entityType.OTHER'),
  };

  const sourceLabel: Record<AiDisclosureSource, string> = {
    PLATFORM_AI: t('source.PLATFORM_AI'),
    USER_DECLARED_AI: t('source.USER_DECLARED_AI'),
  };

  const columns: ColumnDef<AiDisclosure, unknown>[] = [
    {
      accessorKey: 'entityType',
      header: t('table.entityType'),
      cell: ({ row }) => entityTypeLabel[row.original.entityType],
    },
    {
      accessorKey: 'source',
      header: t('table.source'),
      cell: ({ row }) => (
        <Badge variant={SOURCE_VARIANT[row.original.source]}>
          {sourceLabel[row.original.source]}
        </Badge>
      ),
    },
    {
      accessorKey: 'note',
      header: t('table.note'),
      cell: ({ row }) => row.original.note ?? '—',
    },
    {
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => {
        const href = resolveEntityHref(
          row.original.entityType,
          row.original.entityReferenceId,
        );
        return href ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={href}>{tCommon('actions.view')}</Link>}
          />
        ) : (
          <span className="text-muted-foreground text-sm">
            {t('table.detailUnavailable')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={entityType ?? ALL_OPTION}
          onValueChange={(value) => {
            setEntityType(
              value === ALL_OPTION
                ? undefined
                : (value as AiDisclosureEntityType),
            );
            setPage(1);
          }}
        >
          <SelectTrigger
            aria-label={t('filter.entityTypeLabel')}
            className="w-56"
          >
            <SelectValue placeholder={t('filter.entityTypeLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {ENTITY_TYPE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {entityTypeLabel[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={source ?? ALL_OPTION}
          onValueChange={(value) => {
            setSource(
              value === ALL_OPTION ? undefined : (value as AiDisclosureSource),
            );
            setPage(1);
          }}
        >
          <SelectTrigger aria-label={t('filter.sourceLabel')} className="w-56">
            <SelectValue placeholder={t('filter.sourceLabel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION}>{t('filter.all')}</SelectItem>
            {SOURCE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {sourceLabel[option]}
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
    </div>
  );
}
