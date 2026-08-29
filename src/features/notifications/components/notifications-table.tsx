'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import {
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
} from '../hooks';
import type { Notification, NotificationType } from '../api';

const TYPE_VARIANT: Record<
  NotificationType,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  service_request: 'secondary',
  service_accepted: 'default',
  service_rejected: 'destructive',
  service_completed: 'default',
  payment_received: 'default',
  rating_received: 'secondary',
  promotion: 'outline',
  system: 'outline',
  document_expired: 'destructive',
};

const MESSAGE_TRUNCATE_LENGTH = 80;

function truncateMessage(message: string): string {
  return message.length > MESSAGE_TRUNCATE_LENGTH
    ? `${message.slice(0, MESSAGE_TRUNCATE_LENGTH)}…`
    : message;
}

const DEFAULT_LIMIT = 20;
const LIMIT_STEP = 20;

export function NotificationsTable() {
  const t = useTranslations('notifications');
  const locale = useAppLocale();
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, isPending, isError } = useNotificationsQuery({ limit });
  const markAsReadMutation = useMarkNotificationAsReadMutation();

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  const columns: ColumnDef<Notification, unknown>[] = [
    {
      accessorKey: 'title',
      header: t('table.title'),
    },
    {
      id: 'message',
      header: t('table.message'),
      cell: ({ row }) => (
        <span title={row.original.message}>
          {truncateMessage(row.original.message)}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: t('table.type'),
      cell: ({ row }) => (
        <Badge variant={TYPE_VARIANT[row.original.type]}>
          {t(`type.${row.original.type}`)}
        </Badge>
      ),
    },
    {
      id: 'read',
      header: t('table.read'),
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'read' ? 'secondary' : 'default'}
        >
          {row.original.status === 'read' ? t('table.yes') : t('table.no')}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.createdAt, locale),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) =>
        row.original.status !== 'read' ? (
          <Button
            size="sm"
            variant="outline"
            disabled={
              markAsReadMutation.isPending &&
              markAsReadMutation.variables === row.original.id
            }
            onClick={() => markAsReadMutation.mutate(row.original.id)}
          >
            {t('table.markAsRead')}
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data}
        emptyMessage={t('table.empty')}
      />

      {data.length >= limit && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setLimit((prev) => prev + LIMIT_STEP)}
          >
            {t('table.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}
