'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/core/api-client/errors';
import { useCategoriesQuery } from '@/features/categories/hooks';
import type {
  CreateProfessionalDocumentTypeDto,
  ProfessionalDocumentType,
} from '../api';
import {
  useCreateProfessionalDocumentTypeMutation,
  useUpdateProfessionalDocumentTypeMutation,
} from '../hooks';
import {
  professionalDocumentTypeFormSchema,
  type ProfessionalDocumentTypeFormValues,
} from '../schemas';

const CATEGORY_OPTIONS = [
  'BACKGROUND_CHECK',
  'QUALIFICATION',
  'PORTFOLIO',
] as const;

interface ProfessionalDocumentTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType?: ProfessionalDocumentType;
}

function buildDefaultValues(
  documentType?: ProfessionalDocumentType,
): ProfessionalDocumentTypeFormValues {
  return {
    code: documentType?.code ?? '',
    name: documentType?.name ?? '',
    description: documentType?.description ?? '',
    category: documentType?.category ?? 'QUALIFICATION',
    professionalCategoryId: documentType?.professionalCategoryId ?? undefined,
    isRequired: documentType?.isRequired ?? false,
    validityDays: documentType?.validityDays ?? undefined,
    requiresStaffReview: documentType?.requiresStaffReview ?? true,
    isVisibleToClient: documentType?.isVisibleToClient ?? false,
    sortOrder: documentType?.sortOrder ?? 0,
  };
}

// `countryId` no se expone como input a propósito: hoy siempre viaja `undefined` (catálogo
// global) — no existe todavía un campo de país por usuario en el backend (ver
// TekoApp-Backend/openspec/decisions.md, misma limitación que legal-consents), así que un select
// de país acá no tendría ningún efecto real.
function buildPayload(
  values: ProfessionalDocumentTypeFormValues,
): CreateProfessionalDocumentTypeDto {
  return {
    code: values.code,
    name: values.name,
    description: values.description || undefined,
    category: values.category,
    professionalCategoryId: values.professionalCategoryId,
    isRequired: values.isRequired,
    validityDays: values.validityDays,
    requiresStaffReview: values.requiresStaffReview,
    isVisibleToClient: values.isVisibleToClient,
    sortOrder: values.sortOrder,
  };
}

export function ProfessionalDocumentTypeFormDialog({
  open,
  onOpenChange,
  documentType,
}: ProfessionalDocumentTypeFormDialogProps) {
  const t = useTranslations('professionalDocumentTypes.form');
  const tCommon = useTranslations('common');
  const isEditing = !!documentType;
  const createMutation = useCreateProfessionalDocumentTypeMutation();
  const updateMutation = useUpdateProfessionalDocumentTypeMutation();
  const mutation = isEditing ? updateMutation : createMutation;
  const { data: categories } = useCategoriesQuery();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(professionalDocumentTypeFormSchema),
    defaultValues: buildDefaultValues(documentType),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(documentType));
    }
  }, [open, documentType, reset]);

  function onSubmit(values: ProfessionalDocumentTypeFormValues) {
    const payload = buildPayload(values);
    if (documentType) {
      updateMutation.mutate(
        { referenceId: documentType.referenceId, dto: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Ocurrió un error inesperado. Intentá de nuevo.'
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t('editTitle') : t('createTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? t('editDescription') : t('createDescription')}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="code">{t('code')}</Label>
              <Input
                id="code"
                placeholder="BG_CHECK_CRIMINAL_PY"
                aria-invalid={!!errors.code}
                {...register('code')}
              />
              {errors.code && (
                <p className="text-destructive text-sm">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="category">{t('category')}</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`categoryOptions.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="professionalCategoryId">
              {t('professionalCategoryId')}
            </Label>
            <Controller
              control={control}
              name="professionalCategoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : 'all'}
                  onValueChange={(value) =>
                    field.onChange(value === 'all' ? undefined : Number(value))
                  }
                >
                  <SelectTrigger id="professionalCategoryId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('anyCategory')}</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="validityDays">{t('validityDays')}</Label>
              <Input
                id="validityDays"
                type="number"
                min={1}
                placeholder={t('validityDaysPlaceholder')}
                aria-invalid={!!errors.validityDays}
                {...register('validityDays', { valueAsNumber: true })}
              />
              {errors.validityDays && (
                <p className="text-destructive text-sm">
                  {errors.validityDays.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="sortOrder">{t('sortOrder')}</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                aria-invalid={!!errors.sortOrder}
                {...register('sortOrder', { valueAsNumber: true })}
              />
            </div>
          </div>

          <Controller
            control={control}
            name="isRequired"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="isRequired"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isRequired" className="font-normal">
                  {t('isRequiredLabel')}
                </Label>
              </div>
            )}
          />

          <Controller
            control={control}
            name="requiresStaffReview"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="requiresStaffReview"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="requiresStaffReview" className="font-normal">
                  {t('requiresStaffReviewLabel')}
                </Label>
              </div>
            )}
          />

          <Controller
            control={control}
            name="isVisibleToClient"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="isVisibleToClient"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isVisibleToClient" className="font-normal">
                  {t('isVisibleToClientLabel')}
                </Label>
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {tCommon('actions.cancel')}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? tCommon('states.saving')
                : isEditing
                  ? tCommon('actions.saveChanges')
                  : t('submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
