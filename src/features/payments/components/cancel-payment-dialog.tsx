'use client';

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
            Cancelar
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar este pago?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cancelará el pago de forma permanente. No se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelando...' : 'Sí, cancelar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
