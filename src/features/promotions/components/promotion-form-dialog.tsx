'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
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
import type { Promotion } from '../api';
import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from '../hooks';
import {
  promotionFormSchema,
  type PromotionFormInput,
  type PromotionFormValues,
} from '../schemas';
import {
  buildDefaultValues,
  toCreatePromotionRequest,
} from './promotion-form-mapping';
import {
  PromotionAudienceSection,
  PromotionBasicsSection,
  PromotionDiscountSection,
  PromotionLimitsSection,
  PromotionValiditySection,
} from './promotion-form-sections';

interface PromotionFormDialogProps {
  /** Promoción a editar. Si se omite, el diálogo funciona en modo creación. */
  promotion?: Promotion;
  /** Elemento que abre el diálogo (botón "Nueva promoción" o "Editar" según el modo). */
  trigger: React.ReactElement;
}

export function PromotionFormDialog({
  promotion,
  trigger,
}: PromotionFormDialogProps) {
  const t = useTranslations('promotions');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const isEditMode = !!promotion;
  const createMutation = useCreatePromotionMutation();
  const updateMutation = useUpdatePromotionMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromotionFormInput, unknown, PromotionFormValues>({
    resolver: standardSchemaResolver(promotionFormSchema),
    defaultValues: buildDefaultValues(promotion),
  });

  // El diálogo de edición se instancia una vez por fila y permanece montado — resetear los
  // valores cada vez que se abre asegura que reflejen la promoción actual (o el formulario en
  // blanco en modo creación).
  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(promotion));
    }
  }, [open, promotion, reset]);

  function onSubmit(values: PromotionFormValues) {
    const dto = toCreatePromotionRequest(values);

    if (isEditMode) {
      updateMutation.mutate(
        { id: promotion.id, dto },
        { onSuccess: () => setOpen(false) },
      );
      return;
    }

    createMutation.mutate(dto, {
      onSuccess: () => {
        setOpen(false);
        reset(buildDefaultValues());
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t('form.editTitle') : t('form.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <PromotionBasicsSection register={register} errors={errors} />
          <PromotionDiscountSection
            register={register}
            control={control}
            errors={errors}
          />
          <PromotionValiditySection register={register} errors={errors} />
          <PromotionLimitsSection register={register} errors={errors} />
          <PromotionAudienceSection control={control} />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? tCommon('states.saving')
                : isEditMode
                  ? tCommon('actions.saveChanges')
                  : t('form.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
