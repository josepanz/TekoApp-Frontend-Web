'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/core/api-client/errors';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { runBulkAction, type BulkActionFailure } from '@/lib/run-bulk-action';
import { reviewPortfolioItem } from '../api';
import type { AdminPortfolioItem, PortfolioReviewStatus } from '../api';
import { useAdminPortfolioQueueQuery } from '../hooks';
import {
  rejectPortfolioItemSchema,
  type RejectPortfolioItemFormValues,
} from '../schemas';
import { PortfolioReviewDialog } from './portfolio-review-dialog';

const PAGE_SIZE = 10;
const ALL = 'all';

const STATUS_OPTIONS: PortfolioReviewStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
];

const STATUS_VARIANT: Record<
  PortfolioReviewStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
};

// Etiqueta del profesional para el detalle de fallo parcial de una acción masiva — nunca un id
// crudo, mismo criterio que G-06 del WORKPLAN de hardening.
function describeFailures(
  failed: BulkActionFailure<AdminPortfolioItem>[],
  unexpectedErrorMessage: string,
): string {
  return failed
    .map((f) => {
      const label = `${f.item.professional.firstName} ${f.item.professional.lastName}`;
      const reason =
        f.error instanceof ApiError ? f.error.message : unexpectedErrorMessage;
      return `${label} (${reason})`;
    })
    .join(', ');
}

export function PortfolioReviewQueueTable() {
  const t = useTranslations('professionalPortfolio');
  const tCommon = useTranslations('common');
  const locale = useAppLocale();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PortfolioReviewStatus | undefined>(
    'PENDING',
  );
  const [reviewing, setReviewing] = useState<AdminPortfolioItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkApproveOpen, setBulkApproveOpen] = useState(false);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const { data, isPending, isError } = useAdminPortfolioQueueQuery({
    page,
    pageSize: PAGE_SIZE,
    status,
  });

  const {
    register: registerBulkReject,
    handleSubmit: handleBulkRejectSubmit,
    reset: resetBulkReject,
    formState: { errors: bulkRejectErrors },
  } = useForm<RejectPortfolioItemFormValues>({
    resolver: standardSchemaResolver(rejectPortfolioItemSchema),
    defaultValues: { rejectionReason: '' },
  });

  function getSelectedItems(): AdminPortfolioItem[] {
    if (!data) return [];
    return data.data.filter((item) => selectedIds.includes(item.referenceId));
  }

  function finishBulkAction() {
    setIsBulkProcessing(false);
    setBulkApproveOpen(false);
    setBulkRejectOpen(false);
    resetBulkReject();
    setSelectedIds([]);
    void queryClient.invalidateQueries({
      queryKey: ['professional-portfolio'],
    });
  }

  async function handleBulkApprove() {
    const selected = getSelectedItems();
    setIsBulkProcessing(true);
    const { succeeded, failed } = await runBulkAction(selected, (item) =>
      reviewPortfolioItem(item.referenceId, { status: 'APPROVED' }).then(
        () => undefined,
      ),
    );
    finishBulkAction();

    if (failed.length === 0) {
      toast.success(t('bulk.approveSuccessAll', { count: succeeded.length }));
    } else if (succeeded.length === 0) {
      toast.error(t('bulk.approveFailedAll', { count: failed.length }));
    } else {
      toast.warning(
        t('bulk.approvePartialResult', {
          succeeded: succeeded.length,
          total: selected.length,
          failed: failed.length,
          names: describeFailures(failed, tCommon('unexpectedError')),
        }),
      );
    }
  }

  function handleBulkReject(values: RejectPortfolioItemFormValues) {
    void (async () => {
      const selected = getSelectedItems();
      setIsBulkProcessing(true);
      const { succeeded, failed } = await runBulkAction(selected, (item) =>
        reviewPortfolioItem(item.referenceId, {
          status: 'REJECTED',
          rejectionReason: values.rejectionReason,
        }).then(() => undefined),
      );
      finishBulkAction();

      if (failed.length === 0) {
        toast.success(t('bulk.rejectSuccessAll', { count: succeeded.length }));
      } else if (succeeded.length === 0) {
        toast.error(t('bulk.rejectFailedAll', { count: failed.length }));
      } else {
        toast.warning(
          t('bulk.rejectPartialResult', {
            succeeded: succeeded.length,
            total: selected.length,
            failed: failed.length,
            names: describeFailures(failed, tCommon('unexpectedError')),
          }),
        );
      }
    })();
  }

  const columns: ColumnDef<AdminPortfolioItem, unknown>[] = [
    {
      id: 'professional',
      header: t('table.professional'),
      cell: ({ row }) =>
        `${row.original.professional.firstName} ${row.original.professional.lastName}`,
    },
    {
      id: 'caption',
      header: t('table.caption'),
      cell: ({ row }) => row.original.caption ?? '—',
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
      <Select
        value={status ?? ALL}
        onValueChange={(value) => {
          setStatus(
            value === ALL ? undefined : (value as PortfolioReviewStatus),
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

      {isPending ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <p className="text-muted-foreground">{t('table.loadError')}</p>
      ) : (
        <>
          <BulkActionsBar
            selectedCount={selectedIds.length}
            onCancel={() => setSelectedIds([])}
          >
            <Button size="sm" onClick={() => setBulkApproveOpen(true)}>
              {t('bulk.approveButton', { count: selectedIds.length })}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkRejectOpen(true)}
            >
              {t('bulk.rejectButton', { count: selectedIds.length })}
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
              getRowId: (row) => row.referenceId,
            }}
          />
        </>
      )}

      <PortfolioReviewDialog
        item={reviewing}
        onOpenChange={(open) => {
          if (!open) setReviewing(null);
        }}
      />

      <AlertDialog open={bulkApproveOpen} onOpenChange={setBulkApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bulk.approveConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bulk.approveConfirmDescription', {
                count: selectedIds.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBulkProcessing}
              onClick={() => {
                void handleBulkApprove();
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
        open={bulkRejectOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkRejectOpen(false);
            resetBulkReject();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bulk.rejectConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('bulk.rejectConfirmDescription', {
                count: selectedIds.length,
              })}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) =>
              void handleBulkRejectSubmit(handleBulkReject)(event)
            }
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="bulkRejectionReason">
                {t('bulk.rejectionReasonLabel')}
              </Label>
              <Textarea
                id="bulkRejectionReason"
                aria-invalid={!!bulkRejectErrors.rejectionReason}
                {...registerBulkReject('rejectionReason')}
              />
              {bulkRejectErrors.rejectionReason && (
                <p className="text-destructive text-sm">
                  {bulkRejectErrors.rejectionReason.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBulkRejectOpen(false);
                  resetBulkReject();
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
                  : t('bulk.confirmRejectButton')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
