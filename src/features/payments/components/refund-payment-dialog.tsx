'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRefundPaymentMutation } from '../hooks';
import { refundPaymentSchema, type RefundPaymentFormValues } from '../schemas';

const REASON_LABEL: Record<RefundPaymentFormValues['reason'], string> = {
  customer_request: 'Solicitud del cliente',
  duplicate_payment: 'Pago duplicado',
  fraud: 'Fraude',
  service_not_provided: 'Servicio no prestado',
  poor_service_quality: 'Calidad de servicio deficiente',
  technical_issue: 'Problema técnico',
  other: 'Otro',
};

const REASON_OPTIONS = Object.keys(REASON_LABEL) as Array<
  keyof typeof REASON_LABEL
>;

interface RefundPaymentDialogProps {
  paymentId: string;
  amount: number;
}

// Reembolsar es una acción destructiva/irreversible que además exige un motivo obligatorio
// (RefundPaymentDto.reason) — usamos AlertDialog (no Dialog) con un form simple adentro en vez de
// un formulario de página completa.
export function RefundPaymentDialog({
  paymentId,
  amount,
}: RefundPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const refundMutation = useRefundPaymentMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefundPaymentFormValues>({
    resolver: standardSchemaResolver(refundPaymentSchema),
    defaultValues: { amount, reason: 'customer_request', description: '' },
  });

  function onSubmit(values: RefundPaymentFormValues) {
    refundMutation.mutate(
      { id: paymentId, dto: values },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm">
            Reembolsar
          </Button>
        }
      />
      <AlertDialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Reembolsar pago</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reembolsará el pago al usuario. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="refund-amount">Monto a reembolsar</Label>
              <Input
                id="refund-amount"
                type="number"
                step="1"
                aria-invalid={!!errors.amount}
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-destructive text-sm">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="refund-reason">Motivo</Label>
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="refund-reason" className="w-full">
                      <SelectValue placeholder="Seleccioná un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {REASON_OPTIONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {REASON_LABEL[reason]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.reason && (
                <p className="text-destructive text-sm">
                  {errors.reason.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="refund-description">Descripción (opcional)</Label>
              <Textarea id="refund-description" {...register('description')} />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={refundMutation.isPending}
            >
              {refundMutation.isPending
                ? 'Reembolsando...'
                : 'Confirmar reembolso'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
