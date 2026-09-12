'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BulkActionsBar } from '@/components/layout/bulk-actions-bar';
import { DataTable } from '@/components/layout/data-table';
import { useAppLocale } from '@/i18n/use-app-locale';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import { ApiError } from '@/core/api-client/errors';
import { formatDate } from '@/lib/formatters';
import { runBulkAction } from '@/lib/run-bulk-action';
import { deleteRating } from '../api';
import {
  RATINGS_QUERY_KEY,
  useDeleteRatingMutation,
  useRatingsQuery,
} from '../hooks';
import type { Rating } from '../api';

const TYPE_VARIANT: Record<Rating['type'], 'default' | 'secondary'> = {
  CLIENT_TO_PROFESSIONAL: 'default',
  PROFESSIONAL_TO_CLIENT: 'secondary',
};

function RatingActionsCell({ rating }: { rating: Rating }) {
  const t = useTranslations('ratings.delete');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteRatingMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        {tCommon('actions.delete')}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(rating.referenceId, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteMutation.isPending
              ? tCommon('states.deleting')
              : t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Gate client-side por permiso (`ratings.audit:read`/`admin:all`) — mismo patrón que
// `service-progress-section.tsx`: no pedimos el listado si el permiso no está asignado.
export function RatingsTable() {
  const { data: scope } = useSessionScopeQuery();
  const canView = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.RATINGS.AUDIT_VIEW, PERMISSIONS.ADMIN.ALL],
  );

  if (!canView) {
    return null;
  }

  return <RatingsTableContent />;
}

function RatingsTableContent() {
  const t = useTranslations('ratings');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useRatingsQuery();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  async function handleBulkDelete() {
    if (!data) return;
    const selected = data.filter((rating) =>
      selectedIds.includes(rating.referenceId),
    );
    setIsBulkDeleting(true);
    const { succeeded, failed } = await runBulkAction(selected, (rating) =>
      deleteRating(rating.referenceId),
    );
    setIsBulkDeleting(false);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    void queryClient.invalidateQueries({ queryKey: RATINGS_QUERY_KEY });

    if (failed.length === 0) {
      toast.success(t('bulkDelete.successAll', { count: succeeded.length }));
    } else if (succeeded.length === 0) {
      toast.error(t('bulkDelete.failedAll', { count: failed.length }));
    } else {
      toast.warning(
        t('bulkDelete.partialResult', {
          succeeded: succeeded.length,
          total: selected.length,
          failed: failed.length,
          names: failed
            .map(
              (f) =>
                `#${f.item.id} (${
                  f.error instanceof ApiError
                    ? f.error.message
                    : tCommon('unexpectedError')
                })`,
            )
            .join(', '),
        }),
      );
    }
  }

  const columns: ColumnDef<Rating, unknown>[] = [
    {
      id: 'userId',
      header: t('table.user'),
      // El backend manda `userId: null` cuando la calificación es anónima y quien consulta no
      // es el autor — nunca pasa para admin/staff hoy, pero el tipo es nullable y un id vacío
      // (`#null`) causó un crash real en Mobile (tarea B-01 de su WORKPLAN). No resolvemos el
      // nombre acá: el DTO no lo trae, y armar un lookup por fila sería un N+1 — eso requiere un
      // cambio de DTO en el backend, no de esta tabla.
      cell: ({ row }) =>
        row.original.userId === null
          ? t('table.anonymous')
          : `#${row.original.userId}`,
    },
    {
      id: 'professionalId',
      header: t('table.professional'),
      cell: ({ row }) =>
        row.original.professionalId === null
          ? t('table.anonymous')
          : `#${row.original.professionalId}`,
    },
    {
      accessorKey: 'rating',
      header: t('table.rating'),
      cell: ({ row }) => row.original.rating.toFixed(1),
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
      id: 'isReported',
      header: t('table.reported'),
      cell: ({ row }) =>
        row.original.isReported ? (
          <Badge variant="destructive">{t('table.reportedBadge')}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: 'review',
      header: t('table.review'),
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-xs text-sm">
          {row.original.review ?? '—'}
        </span>
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
      cell: ({ row }) => <RatingActionsCell rating={row.original} />,
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
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
      >
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          {t('bulkDelete.cta', { count: selectedIds.length })}
        </Button>
      </BulkActionsBar>

      <DataTable
        columns={columns}
        data={data}
        emptyMessage={t('table.empty')}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
          getRowId: (row) => row.referenceId,
        }}
      />

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bulkDelete.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bulkDelete.confirmDescription', {
                count: selectedIds.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={() => {
                void handleBulkDelete();
              }}
            >
              {isBulkDeleting
                ? tCommon('states.deleting')
                : tCommon('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
