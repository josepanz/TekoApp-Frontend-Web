'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { BulkActionsBar } from '@/components/layout/bulk-actions-bar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import { ApiError } from '@/core/api-client/errors';
import { runBulkAction, type BulkActionFailure } from '@/lib/run-bulk-action';
import { suspendProfessional, verifyProfessional } from '../api';
import {
  useExportProfessionalsMutation,
  useProfessionalsQuery,
} from '../hooks';
import {
  suspendProfessionalSchema,
  type SuspendProfessionalFormValues,
} from '../schemas';
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

const PAGE_SIZE = 10;

// Etiqueta legible del profesional para el detalle de fallo parcial de una acción masiva — nunca
// un id crudo, mismo criterio que G-06 del WORKPLAN de hardening.
function describeFailures(
  failed: BulkActionFailure<Professional>[],
  unexpectedErrorMessage: string,
): string {
  return failed
    .map((f) => {
      const label = `${f.item.user.firstName} ${f.item.user.lastName}`;
      const reason =
        f.error instanceof ApiError ? f.error.message : unexpectedErrorMessage;
      return `${label} (${reason})`;
    })
    .join(', ');
}

export function ProfessionalsTable() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useProfessionalsQuery({
    page,
    pageSize: PAGE_SIZE,
  });
  const exportMutation = useExportProfessionalsMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkVerifyOpen, setBulkVerifyOpen] = useState(false);
  const [bulkSuspendOpen, setBulkSuspendOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const {
    register: registerBulkSuspend,
    handleSubmit: handleBulkSuspendSubmit,
    reset: resetBulkSuspend,
    formState: { errors: bulkSuspendErrors },
  } = useForm<SuspendProfessionalFormValues>({
    resolver: standardSchemaResolver(suspendProfessionalSchema),
    defaultValues: { reason: '' },
  });

  function getSelectedItems(): Professional[] {
    if (!data) return [];
    return data.data.filter((item) => selectedIds.includes(String(item.id)));
  }

  function finishBulkAction() {
    setIsBulkProcessing(false);
    setBulkVerifyOpen(false);
    setBulkSuspendOpen(false);
    resetBulkSuspend();
    setSelectedIds([]);
    void queryClient.invalidateQueries({ queryKey: ['professionals'] });
  }

  async function handleBulkVerify() {
    const selected = getSelectedItems();
    setIsBulkProcessing(true);
    const { succeeded, failed } = await runBulkAction(selected, (item) =>
      verifyProfessional(item.id, { isVerified: true }).then(() => undefined),
    );
    finishBulkAction();

    if (failed.length === 0) {
      toast.success(t('bulk.verifySuccessAll', { count: succeeded.length }));
    } else if (succeeded.length === 0) {
      toast.error(t('bulk.verifyFailedAll', { count: failed.length }));
    } else {
      toast.warning(
        t('bulk.verifyPartialResult', {
          succeeded: succeeded.length,
          total: selected.length,
          failed: failed.length,
          names: describeFailures(failed, tCommon('unexpectedError')),
        }),
      );
    }
  }

  function handleBulkSuspend(values: SuspendProfessionalFormValues) {
    void (async () => {
      const selected = getSelectedItems();
      setIsBulkProcessing(true);
      const { succeeded, failed } = await runBulkAction(selected, (item) =>
        suspendProfessional(item.id, { reason: values.reason }).then(
          () => undefined,
        ),
      );
      finishBulkAction();

      if (failed.length === 0) {
        toast.success(t('bulk.suspendSuccessAll', { count: succeeded.length }));
      } else if (succeeded.length === 0) {
        toast.error(t('bulk.suspendFailedAll', { count: failed.length }));
      } else {
        toast.warning(
          t('bulk.suspendPartialResult', {
            succeeded: succeeded.length,
            total: selected.length,
            failed: failed.length,
            names: describeFailures(failed, tCommon('unexpectedError')),
          }),
        );
      }
    })();
  }

  // El export pega contra `PROFESSIONALS.VERIFY`/`ADMIN.ALL` en el backend (mismo permiso que
  // verificar/suspender) — la tabla en sí no está gateada (no todo staff que la ve puede
  // exportar), así que el botón se oculta solo si falta el permiso, sin tocar el resto de la
  // tabla.
  const { data: scope } = useSessionScopeQuery();
  const canExport = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.PROFESSIONALS.VERIFY, PERMISSIONS.ADMIN.ALL],
  );

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

  return (
    <div className="flex flex-col gap-4">
      {canExport && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate({})}
          >
            <Download />
            {exportMutation.isPending
              ? tCommon('states.generating')
              : tCommon('actions.export')}
          </Button>
        </div>
      )}

      {isPending && <Skeleton className="h-64" />}

      {!isPending && isError && (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      )}

      {!isPending && !isError && (
        <>
          <BulkActionsBar
            selectedCount={selectedIds.length}
            onCancel={() => setSelectedIds([])}
          >
            <Button size="sm" onClick={() => setBulkVerifyOpen(true)}>
              {t('bulk.verifyButton', { count: selectedIds.length })}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkSuspendOpen(true)}
            >
              {t('bulk.suspendButton', { count: selectedIds.length })}
            </Button>
          </BulkActionsBar>

          <DataTable
            columns={columns}
            data={data.data}
            emptyMessage={t('table.empty')}
            pagination={{
              page: data.pagination.page,
              totalPages: data.pagination.totalPages,
              onPageChange: setPage,
            }}
            selection={{
              selectedIds,
              onSelectionChange: setSelectedIds,
              getRowId: (row) => String(row.id),
            }}
          />
        </>
      )}

      <AlertDialog open={bulkVerifyOpen} onOpenChange={setBulkVerifyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bulk.verifyConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bulk.verifyConfirmDescription', {
                count: selectedIds.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBulkProcessing}
              onClick={() => {
                void handleBulkVerify();
              }}
            >
              {isBulkProcessing
                ? tCommon('states.saving')
                : tCommon('actions.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={bulkSuspendOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkSuspendOpen(false);
            resetBulkSuspend();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bulk.suspendConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('bulk.suspendConfirmDescription', {
                count: selectedIds.length,
              })}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) =>
              void handleBulkSuspendSubmit(handleBulkSuspend)(event)
            }
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="bulkSuspendReason">
                {t('bulk.suspendReasonLabel')}
              </Label>
              <Textarea
                id="bulkSuspendReason"
                aria-invalid={!!bulkSuspendErrors.reason}
                {...registerBulkSuspend('reason')}
              />
              {bulkSuspendErrors.reason && (
                <p className="text-destructive text-sm">
                  {bulkSuspendErrors.reason.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBulkSuspendOpen(false);
                  resetBulkSuspend();
                }}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isBulkProcessing}
              >
                {isBulkProcessing
                  ? tCommon('states.saving')
                  : t('bulk.confirmSuspendButton')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
