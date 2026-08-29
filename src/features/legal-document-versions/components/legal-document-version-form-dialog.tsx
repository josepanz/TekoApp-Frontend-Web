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
import type {
  CreateLegalDocumentVersionDto,
  LegalDocumentVersion,
} from '../api';
import {
  useCreateLegalDocumentVersionMutation,
  useUpdateLegalDocumentVersionMutation,
} from '../hooks';
import {
  legalDocumentVersionFormSchema,
  type LegalDocumentVersionFormValues,
} from '../schemas';

const DOCUMENT_TYPE_OPTIONS = [
  'TERMS_OF_SERVICE',
  'PRIVACY_POLICY',
  'DATA_PROCESSING_CONSENT',
  'IMAGE_USAGE_CONSENT',
  'SERVICE_CONTRACT_TERMS',
  'USER_CONTENT_LIABILITY_DISCLAIMER',
] as const;

interface LegalDocumentVersionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version?: LegalDocumentVersion;
}

function toDateInputValue(iso?: string): string {
  return iso ? iso.slice(0, 10) : '';
}

function buildDefaultValues(
  version?: LegalDocumentVersion,
): LegalDocumentVersionFormValues {
  return {
    documentType: version?.documentType ?? 'TERMS_OF_SERVICE',
    countryId: version?.countryId ?? undefined,
    version: version?.version ?? '',
    contentUrl: version?.contentUrl ?? '',
    publishedAt: toDateInputValue(version?.publishedAt),
    isActive: version?.isActive ?? true,
  };
}

function buildPayload(
  values: LegalDocumentVersionFormValues,
): CreateLegalDocumentVersionDto {
  return {
    documentType: values.documentType,
    countryId: values.countryId,
    version: values.version,
    contentUrl: values.contentUrl,
    publishedAt: new Date(`${values.publishedAt}T00:00:00.000Z`).toISOString(),
    isActive: values.isActive,
  };
}

export function LegalDocumentVersionFormDialog({
  open,
  onOpenChange,
  version,
}: LegalDocumentVersionFormDialogProps) {
  const t = useTranslations('legalDocumentVersions.form');
  const tCommon = useTranslations('common');
  const isEditing = !!version;
  const createMutation = useCreateLegalDocumentVersionMutation();
  const updateMutation = useUpdateLegalDocumentVersionMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(legalDocumentVersionFormSchema),
    defaultValues: buildDefaultValues(version),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(version));
    }
  }, [open, version, reset]);

  function onSubmit(values: LegalDocumentVersionFormValues) {
    const payload = buildPayload(values);
    if (version) {
      updateMutation.mutate(
        { referenceId: version.referenceId, dto: payload },
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="documentType">{t('documentType')}</Label>
            <Controller
              control={control}
              name="documentType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isEditing}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`documentTypeOptions.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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
              <Label htmlFor="version">{t('version')}</Label>
              <Input
                id="version"
                placeholder="1.0.0"
                aria-invalid={!!errors.version}
                {...register('version')}
              />
              {errors.version && (
                <p className="text-destructive text-sm">
                  {errors.version.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contentUrl">{t('contentUrl')}</Label>
            <Input
              id="contentUrl"
              placeholder="https://tekoapp.com.py/legal/tos-1.0.0"
              aria-invalid={!!errors.contentUrl}
              {...register('contentUrl')}
            />
            {errors.contentUrl && (
              <p className="text-destructive text-sm">
                {errors.contentUrl.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="publishedAt">{t('publishedAt')}</Label>
            <Input
              id="publishedAt"
              type="date"
              aria-invalid={!!errors.publishedAt}
              {...register('publishedAt')}
            />
            {errors.publishedAt && (
              <p className="text-destructive text-sm">
                {errors.publishedAt.message}
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
