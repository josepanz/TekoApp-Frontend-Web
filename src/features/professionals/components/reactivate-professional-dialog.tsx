'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { applyApiFieldErrors } from '@/core/api-client/form-errors';
import { useReactivateProfessionalMutation } from '../hooks';
import {
  reactivateProfessionalSchema,
  type ReactivateProfessionalFormValues,
} from '../schemas';
import type { Professional } from '../api';

const REACTIVATE_FIELDS = ['reason'] as const;

interface ReactivateProfessionalDialogProps {
  professional: Professional;
}

// SUSPENDED -> APPROVED. El profesional vuelve sin disponibilidad ni conexion (isAvailable/isOnline en
// false): debe activarlas el mismo. El motivo es obligatorio y queda en el historial de estados.
export function ReactivateProfessionalDialog({
  professional,
}: ReactivateProfessionalDialogProps) {
  const t = useTranslations('professionals.reactivate');
  const [open, setOpen] = useState(false);
  const reactivateMutation = useReactivateProfessionalMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ReactivateProfessionalFormValues>({
    resolver: standardSchemaResolver(reactivateProfessionalSchema),
    defaultValues: { reason: '' },
  });

  function onSubmit(values: ReactivateProfessionalFormValues) {
    reactivateMutation.mutate(
      { id: professional.id, dto: { reason: values.reason } },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
        onError: (error) =>
          applyApiFieldErrors(error, setError, REACTIVATE_FIELDS),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            {t('trigger')}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="reactivate-reason">{t('reason')}</Label>
            <Textarea
              id="reactivate-reason"
              aria-invalid={!!errors.reason}
              aria-required
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-destructive text-sm">
                {errors.reason.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={reactivateMutation.isPending}>
              {reactivateMutation.isPending ? t('submitting') : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
