'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
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
import type { PromotionFormInput, PromotionFormValues } from '../schemas';

// Las etiquetas visibles viven en el namespace `promotions.type` (compartidas con la tabla).
const TYPE_OPTIONS: PromotionFormValues['type'][] = [
  'PERCENTAGE',
  'FIXED_AMOUNT',
  'FREE_SERVICE',
];

type PromotionFormControl = Control<
  PromotionFormInput,
  unknown,
  PromotionFormValues
>;

interface SectionProps {
  register: UseFormRegister<PromotionFormInput>;
  errors: FieldErrors<PromotionFormInput>;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

function SwitchField({
  control,
  name,
  label,
}: {
  control: PromotionFormControl;
  name: 'isFirstTimeOnly' | 'isProfessionalOnly' | 'isClientOnly';
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={name} className="font-normal">
            {label}
          </Label>
        </div>
      )}
    />
  );
}

export function PromotionBasicsSection({ register, errors }: SectionProps) {
  const t = useTranslations('promotions');

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field id="code" label={t('form.code')} error={errors.code?.message}>
          <Input id="code" aria-invalid={!!errors.code} {...register('code')} />
        </Field>
        <Field id="name" label={t('form.name')} error={errors.name?.message}>
          <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t('form.description')}</Label>
        <Textarea id="description" {...register('description')} />
      </div>
    </>
  );
}

export function PromotionDiscountSection({
  register,
  control,
  errors,
}: SectionProps & { control: PromotionFormControl }) {
  const t = useTranslations('promotions');

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field id="type" label={t('form.type')} error={errors.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder={t('form.typePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`type.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field
        id="discountValue"
        label={t('form.discountValue')}
        error={errors.discountValue?.message}
      >
        <Input
          id="discountValue"
          type="number"
          step="any"
          aria-invalid={!!errors.discountValue}
          {...register('discountValue')}
        />
      </Field>
    </div>
  );
}

export function PromotionValiditySection({ register, errors }: SectionProps) {
  const t = useTranslations('promotions');

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field
        id="validFrom"
        label={t('form.validFrom')}
        error={errors.validFrom?.message}
      >
        <Input
          id="validFrom"
          type="date"
          aria-invalid={!!errors.validFrom}
          {...register('validFrom')}
        />
      </Field>

      <Field
        id="validUntil"
        label={t('form.validUntil')}
        error={errors.validUntil?.message}
      >
        <Input
          id="validUntil"
          type="date"
          aria-invalid={!!errors.validUntil}
          {...register('validUntil')}
        />
      </Field>
    </div>
  );
}

export function PromotionLimitsSection({ register, errors }: SectionProps) {
  const t = useTranslations('promotions');

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field
          id="minimumAmount"
          label={t('form.minimumAmount')}
          error={errors.minimumAmount?.message}
        >
          <Input
            id="minimumAmount"
            type="number"
            step="any"
            {...register('minimumAmount')}
          />
        </Field>

        <Field
          id="maximumDiscount"
          label={t('form.maximumDiscount')}
          error={errors.maximumDiscount?.message}
        >
          <Input
            id="maximumDiscount"
            type="number"
            step="any"
            {...register('maximumDiscount')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="maxUsage"
          label={t('form.maxUsage')}
          error={errors.maxUsage?.message}
        >
          <Input id="maxUsage" type="number" {...register('maxUsage')} />
        </Field>

        <Field
          id="maxUsagePerUser"
          label={t('form.maxUsagePerUser')}
          error={errors.maxUsagePerUser?.message}
        >
          <Input
            id="maxUsagePerUser"
            type="number"
            {...register('maxUsagePerUser')}
          />
        </Field>
      </div>
    </>
  );
}

export function PromotionAudienceSection({
  control,
}: {
  control: PromotionFormControl;
}) {
  const t = useTranslations('promotions');

  return (
    <div className="flex flex-col gap-3">
      <SwitchField
        control={control}
        name="isFirstTimeOnly"
        label={t('form.isFirstTimeOnly')}
      />
      <SwitchField
        control={control}
        name="isProfessionalOnly"
        label={t('form.isProfessionalOnly')}
      />
      <SwitchField
        control={control}
        name="isClientOnly"
        label={t('form.isClientOnly')}
      />
    </div>
  );
}
