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
import { useRateProfessionalMutation } from '../hooks';
import {
  rateProfessionalSchema,
  type RateProfessionalFormValues,
} from '../schemas';

interface RateProfessionalDialogProps {
  serviceRequestId: string;
  professionalUserReferenceId: string;
  professionalName: string;
}

// `professionalId` en `POST /ratings` espera el `referenceId` del USUARIO del profesional (no el
// referenceId de la fila `Professionals`) — así resuelve `RatingsService.create` vía
// `findProfessionalByUserRef`, ver TekoApp-Backend `ratings.service.ts`.
export function RateProfessionalDialog({
  serviceRequestId,
  professionalUserReferenceId,
  professionalName,
}: RateProfessionalDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useRateProfessionalMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateProfessionalFormValues>({
    resolver: standardSchemaResolver(rateProfessionalSchema),
    defaultValues: { rating: 5 },
  });

  function onSubmit(values: RateProfessionalFormValues) {
    mutation.mutate(
      {
        professionalId: professionalUserReferenceId,
        serviceRequestId,
        type: 'CLIENT_TO_PROFESSIONAL',
        rating: values.rating,
        comment: values.comment,
        isAnonymous: false,
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm">Calificar profesional</Button>}
      />
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>Calificar a {professionalName}</DialogTitle>
            <DialogDescription>
              Calificá tu experiencia con este profesional.
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
