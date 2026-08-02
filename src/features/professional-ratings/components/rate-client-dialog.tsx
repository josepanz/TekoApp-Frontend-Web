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
  const t = useTranslations('professionalRatings.rateClient');
  const tCommon = useTranslations('common');
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
      <DialogTrigger render={<Button size="sm">{t('trigger')}</Button>} />
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>{t('title', { name: clientName })}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rating">{t('ratingLabel')}</Label>
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
            <Label htmlFor="comment">{t('commentLabel')}</Label>
            <Textarea id="comment" {...register('comment')} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {tCommon('actions.cancel')}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t('submitting') : t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
