'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRateClientMutation } from '../hooks';
import { rateClientSchema, type RateClientFormValues } from '../schemas';

interface RateClientDialogProps {
  serviceId: string;
  clientReferenceId: string;
  clientName: string;
}

export function RateClientDialog({
  serviceId,
  clientReferenceId,
  clientName,
}: RateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useRateClientMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateClientFormValues>({
    resolver: standardSchemaResolver(rateClientSchema),
    defaultValues: { rating: 5 },
  });

  function onSubmit(values: RateClientFormValues) {
    mutation.mutate(
      {
        clientId: clientReferenceId,
        serviceRequestId: serviceId,
        rating: values.rating,
        comment: values.comment,
        isAnonymous: false,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Calificar cliente</Button>} />
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>Calificar a {clientName}</DialogTitle>
            <DialogDescription>
              Calificá tu experiencia trabajando con este cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rating">Calificación (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              aria-invalid={!!errors.rating}
              {...register('rating', { valueAsNumber: true })}
            />
            {errors.rating && (
              <p className="text-destructive text-sm">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">Comentario (opcional)</Label>
            <Textarea id="comment" {...register('comment')} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enviando...' : 'Enviar calificación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
