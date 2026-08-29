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
import { ApiError } from '@/core/api-client/errors';
import { useCategoriesQuery } from '@/features/categories/hooks';
import type { CreateMaterialCatalogItemDto, MaterialCatalogItem } from '../api';
import {
  useCreateMaterialCatalogItemMutation,
  useUpdateMaterialCatalogItemMutation,
} from '../hooks';
import {
  materialCatalogItemFormSchema,
  type MaterialCatalogItemFormValues,
} from '../schemas';

const QUALITY_TIER_OPTIONS = ['BASIC', 'STANDARD', 'PREMIUM'] as const;

interface MaterialCatalogItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MaterialCatalogItem;
}

function buildDefaultValues(
  item?: MaterialCatalogItem,
): MaterialCatalogItemFormValues {
  return {
    categoryId: item?.categoryId ?? 0,
    countryId: item?.countryId ?? undefined,
    name: item?.name ?? '',
    unit: item?.unit ?? '',
    qualityTier: item?.qualityTier ?? 'STANDARD',
    defaultPrice: item?.defaultPrice ?? 0,
    isActive: item?.isActive ?? true,
  };
}

function buildPayload(
  values: MaterialCatalogItemFormValues,
): CreateMaterialCatalogItemDto {
  return {
    categoryId: values.categoryId,
    countryId: values.countryId,
    name: values.name,
    unit: values.unit,
    qualityTier: values.qualityTier,
    defaultPrice: values.defaultPrice,
    isActive: values.isActive,
  };
}

export function MaterialCatalogItemFormDialog({
  open,
  onOpenChange,
  item,
}: MaterialCatalogItemFormDialogProps) {
  const t = useTranslations('materialCatalog.form');
  const tCatalog = useTranslations('materialCatalog');
  const tCommon = useTranslations('common');
  const isEditing = !!item;
  const createMutation = useCreateMaterialCatalogItemMutation();
  const updateMutation = useUpdateMaterialCatalogItemMutation();
  const mutation = isEditing ? updateMutation : createMutation;
  const { data: categories } = useCategoriesQuery();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(materialCatalogItemFormSchema),
    defaultValues: buildDefaultValues(item),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(item));
    }
  }, [open, item, reset]);

  function onSubmit(values: MaterialCatalogItemFormValues) {
    const payload = buildPayload(values);
    if (item) {
      updateMutation.mutate(
        { referenceId: item.referenceId, dto: payload },
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
            <DialogDescription>{t('suggestedPriceNotice')}</DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="categoryId">{t('category')}</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder={t('categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-destructive text-sm">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="qualityTier">{t('qualityTier')}</Label>
              <Controller
                control={control}
                name="qualityTier"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="qualityTier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITY_TIER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {tCatalog(`qualityTierOptions.${option}`)}
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
              placeholder="Cerámica esmaltada 30x30"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="unit">{t('unit')}</Label>
              <Input
                id="unit"
                placeholder="m2"
                aria-invalid={!!errors.unit}
                {...register('unit')}
              />
              {errors.unit && (
                <p className="text-destructive text-sm">
                  {errors.unit.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="countryId">{t('countryId')}</Label>
              <Input
                id="countryId"
                type="number"
                min={1}
                placeholder={t('countryIdPlaceholder')}
                {...register('countryId', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="defaultPrice">{t('defaultPrice')}</Label>
            <Input
              id="defaultPrice"
              type="number"
              min={0}
              step="0.01"
              aria-invalid={!!errors.defaultPrice}
              {...register('defaultPrice', { valueAsNumber: true })}
            />
            {errors.defaultPrice && (
              <p className="text-destructive text-sm">
                {errors.defaultPrice.message}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isActive" className="font-normal">
                  {t('isActiveLabel')}
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
