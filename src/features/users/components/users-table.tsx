'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import { useUsersQuery } from '../hooks';
import type { User } from '../api';
import { UserDetailDialog } from './user-detail-dialog';

const STATUS_VARIANT: Record<
  User['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  PENDING_VERIFICATION: 'secondary',
  INACTIVE: 'secondary',
  BLOCKED: 'destructive',
  DELETED: 'destructive',
  REFUSED: 'destructive',
};

const PAGE_SIZE = 10;

export function UsersTable() {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(
    null,
  );
  const { data, isPending, isError } = useUsersQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  const statusLabel: Record<User['status'], string> = {
    ACTIVE: t('status.ACTIVE'),
    PENDING_VERIFICATION: t('status.PENDING_VERIFICATION'),
    INACTIVE: t('status.INACTIVE'),
    BLOCKED: t('status.BLOCKED'),
    DELETED: t('status.DELETED'),
    REFUSED: t('status.REFUSED'),
  };

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'email',
      header: t('table.email'),
    },
    {
      id: 'name',
      header: t('table.name'),
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'phoneNumber',
      header: t('table.phone'),
      cell: ({ row }) => row.original.phoneNumber ?? '—',
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>
          {statusLabel[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={`/admin/users/${row.original.referenceId}`}>
                {tCommon('actions.view')}
              </Link>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedReferenceId(row.original.referenceId)}
          >
            Ver detalle
          </Button>
        </div>
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
        data={data.data}
        emptyMessage={t('table.empty')}
        pagination={{
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          onPageChange: setPage,
        }}
      />
      <UserDetailDialog
        referenceId={selectedReferenceId}
        onOpenChange={(open) => !open && setSelectedReferenceId(null)}
      />
    </>
  );
}
