'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryLabel } from '@/features/categories/components/category-label';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import {
  useActiveCategoriesQuery,
  useApplyAsProfessionalMutation,
} from '../hooks';
import {
  professionalApplicationSchema,
  type ProfessionalApplicationFormValues,
} from '../schemas';

// Convierte un input numérico vacío a `undefined` en vez del `NaN` que da `valueAsNumber` —
// necesario para campos opcionales (`z.number().optional()` solo trata `undefined` como "no
// provisto", `NaN` sigue siendo inválido para `.positive()`/`.min()`).
function toOptionalNumber(value: string): number | undefined {
  return value === '' ? undefined : Number(value);
}

export function ProfessionalApplicationForm() {
  const t = useTranslations('professionalApplication.form');
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const { isPending: profilePending, isSuccess: hasProfile } =
    useMyProfessionalProfileQuery();
  const { data: categories, isPending: categoriesPending } =
    useActiveCategoriesQuery();
  const applyMutation = useApplyAsProfessionalMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalApplicationFormValues>({
    resolver: standardSchemaResolver(professionalApplicationSchema),
  });

  useEffect(() => {
    if (hasProfile) {
      router.replace('/pro');
    }
  }, [hasProfile, router]);

  if (profilePending || categoriesPending) {
    return <Skeleton className="h-96 max-w-xl" />;
  }

  // Ya tiene perfil profesional — el `useEffect` de arriba ya está redirigiendo a /pro.
  if (hasProfile) {
    return null;
  }

  if (submitted) {
    return (
      <div className="border-border bg-card max-w-xl rounded-lg border p-6">
        <h2 className="font-heading text-lg font-semibold">
          {t('successTitle')}
        </h2>
        <p className="text-muted-foreground mt-2">{t('successDescription')}</p>
        <Button className="mt-4" onClick={() => router.push('/pro')}>
          {t('successCta')}
        </Button>
      </div>
    );
  }

  function onSubmit(values: ProfessionalApplicationFormValues) {
    applyMutation.mutate(
      {
        categoryId: values.categoryId,
        description: values.description,
        hourlyRate: values.hourlyRate,
        fixedRate: values.fixedRate,
        yearsOfExperience: values.yearsOfExperience,
        skills: values.skills
          ? values.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="flex max-w-xl flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">{t('category')}</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger id="categoryId" aria-label={t('category')}>
                <SelectValue placeholder={t('categoryPlaceholder')}>
                  {(value: string | null) => {
                    const selected = categories?.find(
                      (category) => String(category.id) === value,
                    );
                    return selected ? (
                      <CategoryLabel
                        name={selected.name}
                        icon={selected.icon}
                        color={selected.color}
                      />
                    ) : (
                      t('categoryPlaceholder')
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    <CategoryLabel
                      name={category.name}
                      icon={category.icon}
                      color={category.color}
                    />
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t('description')}</Label>
        <Textarea
          id="description"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-destructive text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="hourlyRate">{t('hourlyRate')}</Label>
          <Input
            id="hourlyRate"
            type="number"
            aria-invalid={!!errors.hourlyRate}
            {...register('hourlyRate', { valueAsNumber: true })}
          />
          {errors.hourlyRate && (
            <p className="text-destructive text-sm">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="fixedRate">{t('fixedRate')}</Label>
          <Input
            id="fixedRate"
            type="number"
            {...register('fixedRate', { setValueAs: toOptionalNumber })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="yearsOfExperience">{t('yearsOfExperience')}</Label>
        <Input
          id="yearsOfExperience"
          type="number"
          {...register('yearsOfExperience', { setValueAs: toOptionalNumber })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="skills">{t('skills')}</Label>
        <Input id="skills" {...register('skills')} />
      </div>

      <Button type="submit" disabled={applyMutation.isPending}>
        {applyMutation.isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
