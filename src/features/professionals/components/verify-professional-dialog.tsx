'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useVerifyProfessionalMutation } from '../hooks';
import {
  verifyProfessionalSchema,
  type VerifyProfessionalFormValues,
} from '../schemas';
import type { Professional } from '../api';

interface VerifyProfessionalDialogProps {
  professional: Professional;
}

export function VerifyProfessionalDialog({
  professional,
}: VerifyProfessionalDialogProps) {
  const t = useTranslations('professionals.verify');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const verifyMutation = useVerifyProfessionalMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyProfessionalFormValues>({
    resolver: standardSchemaResolver(verifyProfessionalSchema),
    defaultValues: { isVerified: true, notes: '' },
  });

  function onSubmit(values: VerifyProfessionalFormValues) {
    verifyMutation.mutate(
      {
        id: professional.id,
        dto: {
          isVerified: values.isVerified,
          notes: values.notes || undefined,
        },
      },
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
      <DialogTrigger render={<Button size="sm">{t('trigger')}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Controller
            control={control}
            name="isVerified"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="isVerified"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isVerified" className="font-normal">
                  {t('verifiedLabel')}
                </Label>
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              aria-invalid={!!errors.notes}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-destructive text-sm">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending
                ? tCommon('states.saving')
                : tCommon('actions.confirm')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
