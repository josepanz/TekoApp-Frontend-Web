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
import type { RetentionPolicy, UpsertRetentionPolicyDto } from '../api';
import { useUpsertRetentionPolicyMutation } from '../hooks';
import {
  retentionPolicyFormSchema,
  type RetentionPolicyFormValues,
} from '../schemas';

const CONTENT_TYPE_OPTIONS = [
  'SERVICE_DESCRIPTION',
  'BUDGET_OPTION',
  'PROGRESS_NOTE',
  'PROFESSIONAL_DESCRIPTION',
  'IMAGE',
  'OTHER',
] as const;

interface RetentionPolicyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: RetentionPolicy;
}

function buildDefaultValues(
  policy?: RetentionPolicy,
): RetentionPolicyFormValues {
  return {
    countryId: policy?.countryId ?? undefined,
    contentType: policy?.contentType ?? 'IMAGE',
    retentionDays: policy?.retentionDays ?? undefined,
    allowsUserDeletion: policy?.allowsUserDeletion ?? true,
    requiresLegalHold: policy?.requiresLegalHold ?? false,
  };
}

function buildPayload(
  values: RetentionPolicyFormValues,
): UpsertRetentionPolicyDto {
  return {
    countryId: values.countryId,
    contentType: values.contentType,
    retentionDays: values.retentionDays,
    allowsUserDeletion: values.allowsUserDeletion,
    requiresLegalHold: values.requiresLegalHold,
  };
}

export function RetentionPolicyFormDialog({
  open,
  onOpenChange,
  policy,
}: RetentionPolicyFormDialogProps) {
  const t = useTranslations('dataRetentionPolicies.form');
  const tCommon = useTranslations('common');
  const isEditing = !!policy;
  const mutation = useUpsertRetentionPolicyMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(retentionPolicyFormSchema),
    defaultValues: buildDefaultValues(policy),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(policy));
    }
  }, [open, policy, reset]);

  function onSubmit(values: RetentionPolicyFormValues) {
    mutation.mutate(buildPayload(values), {
      onSuccess: () => onOpenChange(false),
    });
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
              <Label htmlFor="countryId">{t('countryId')}</Label>
              <Input
                id="countryId"
                type="number"
                min={1}
                placeholder={t('countryIdPlaceholder')}
                disabled={isEditing}
                aria-invalid={!!errors.countryId}
                {...register('countryId', { valueAsNumber: true })}
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="contentType">{t('contentType')}</Label>
              <Controller
                control={control}
                name="contentType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEditing}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`contentTypeOptions.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="retentionDays">{t('retentionDays')}</Label>
            <Input
              id="retentionDays"
              type="number"
              min={1}
              placeholder={t('retentionDaysPlaceholder')}
              aria-invalid={!!errors.retentionDays}
              {...register('retentionDays', { valueAsNumber: true })}
            />
          </div>

          <Controller
            control={control}
            name="allowsUserDeletion"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="allowsUserDeletion"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="allowsUserDeletion" className="font-normal">
                  {t('allowsUserDeletionLabel')}
                </Label>
              </div>
            )}
          />

          <Controller
            control={control}
            name="requiresLegalHold"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="requiresLegalHold"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="requiresLegalHold" className="font-normal">
                  {t('requiresLegalHoldLabel')}
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
                : tCommon('actions.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
