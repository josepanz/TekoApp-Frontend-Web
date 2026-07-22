'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSuspendProfessionalMutation } from '../hooks';
import {
  suspendProfessionalSchema,
  type SuspendProfessionalFormValues,
} from '../schemas';
import type { Professional } from '../api';

interface SuspendProfessionalDialogProps {
  professional: Professional;
}

export function SuspendProfessionalDialog({
  professional,
}: SuspendProfessionalDialogProps) {
  const [open, setOpen] = useState(false);
  const suspendMutation = useSuspendProfessionalMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuspendProfessionalFormValues>({
    resolver: standardSchemaResolver(suspendProfessionalSchema),
    defaultValues: { reason: '' },
  });

  function onSubmit(values: SuspendProfessionalFormValues) {
    suspendMutation.mutate(
      { id: professional.id, dto: { reason: values.reason } },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="destructive">
            Suspender
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspender profesional</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              aria-invalid={!!errors.reason}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-destructive text-sm">
                {errors.reason.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={suspendMutation.isPending}
            >
              {suspendMutation.isPending
                ? 'Suspendiendo...'
                : 'Confirmar suspensión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
