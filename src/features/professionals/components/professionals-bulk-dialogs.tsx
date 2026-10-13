'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useQueryClient } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
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
import { ApiError } from '@/core/api-client/errors';
import { runBulkAction, type BulkActionFailure } from '@/lib/run-bulk-action';
import { suspendProfessional, verifyProfessional } from '../api';
import type { Professional } from '../api';
import {
  suspendProfessionalSchema,
  type SuspendProfessionalFormValues,
} from '../schemas';

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

interface ProfessionalsBulkDialogsProps {
  // Filas seleccionadas de la página actual sobre las que se ejecuta la acción masiva.
  getSelectedItems: () => Professional[];
  selectedCount: number;
  verifyOpen: boolean;
  onVerifyOpenChange: (open: boolean) => void;
  suspendOpen: boolean;
  onSuspendOpenChange: (open: boolean) => void;
  // Se llama al terminar una acción masiva (limpiar la selección en el caller).
  onFinished: () => void;
}

export function ProfessionalsBulkDialogs({
  getSelectedItems,
  selectedCount,
  verifyOpen,
  onVerifyOpenChange,
  suspendOpen,
  onSuspendOpenChange,
  onFinished,
}: ProfessionalsBulkDialogsProps) {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
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

  function finishBulkAction() {
    setIsBulkProcessing(false);
    onVerifyOpenChange(false);
    onSuspendOpenChange(false);
    resetBulkSuspend();
    onFinished();
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

  return (
    <>
      <AlertDialog open={verifyOpen} onOpenChange={onVerifyOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bulk.verifyConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bulk.verifyConfirmDescription', {
                count: selectedCount,
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
        open={suspendOpen}
        onOpenChange={(open) => {
          if (!open) {
            onSuspendOpenChange(false);
            resetBulkSuspend();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bulk.suspendConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('bulk.suspendConfirmDescription', {
                count: selectedCount,
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
                  onSuspendOpenChange(false);
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
    </>
  );
}
