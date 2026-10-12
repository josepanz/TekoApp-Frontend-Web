'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Professional } from '../api';
import { SuspendProfessionalDialog } from './suspend-professional-dialog';
import { VerifyProfessionalDialog } from './verify-professional-dialog';

const STATUS_VARIANT: Record<
  Professional['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
};

const VERIFICATION_VARIANT: Record<
  Professional['verificationStatus'],
  'default' | 'secondary' | 'destructive'
> = {
  VERIFIED: 'default',
  REJECTED: 'destructive',
  UNVERIFIED: 'secondary',
};

export function useProfessionalsColumns(): ColumnDef<Professional, unknown>[] {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');

  const statusLabel: Record<Professional['status'], string> = {
    PENDING: t('status.PENDING'),
    APPROVED: t('status.APPROVED'),
    REJECTED: t('status.REJECTED'),
    SUSPENDED: t('status.SUSPENDED'),
  };

  const columns: ColumnDef<Professional, unknown>[] = [
    {
      id: 'name',
      header: t('table.name'),
      cell: ({ row }) =>
        `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      id: 'category',
      header: t('table.category'),
      cell: ({ row }) => row.original.category.name,
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
      accessorKey: 'verificationStatus',
      header: t('table.verification'),
      cell: ({ row }) => (
        <Badge variant={VERIFICATION_VARIANT[row.original.verificationStatus]}>
          {row.original.verificationStatus}
        </Badge>
      ),
    },
    {
      id: 'rating',
      header: t('table.rating'),
      cell: ({ row }) =>
        `${Number(row.original.averageRating || 0).toFixed(1)} ⭐`,
    },
    {
      accessorKey: 'isAvailable',
      header: t('table.available'),
      cell: ({ row }) => (
        <Badge variant={row.original.isAvailable ? 'default' : 'secondary'}>
          {row.original.isAvailable ? t('table.yes') : t('table.no')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={`/admin/professionals/${row.original.referenceId}`}>
                {tCommon('actions.view')}
              </Link>
            }
          />
          {row.original.verificationStatus !== 'VERIFIED' && (
            <VerifyProfessionalDialog professional={row.original} />
          )}
          {row.original.status !== 'SUSPENDED' && (
            <SuspendProfessionalDialog professional={row.original} />
          )}
        </div>
      ),
    },
  ];

  return columns;
}
