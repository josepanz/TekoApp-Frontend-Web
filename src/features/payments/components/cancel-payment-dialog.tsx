'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useCancelPaymentMutation } from '../hooks';

interface CancelPaymentDialogProps {
  paymentId: string;
}

// Cancelar es una acción destructiva/irreversible sin body (PaymentController_cancel no acepta
// requestBody) — solo confirmación, sin formulario.
export function CancelPaymentDialog({ paymentId }: CancelPaymentDialogProps) {
  const t = useTranslations('payments.cancel');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const cancelMutation = useCancelPaymentMutation();

  function handleConfirm() {
    cancelMutation.mutate(paymentId, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm">
            {tCommon('actions.cancel')}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon('actions.back')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? t('pending') : t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
