'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { AvailabilityToggle } from './availability-toggle';
import {
  useMyProfessionalProfileQuery,
  useUpdateMyProfessionalProfileMutation,
} from '../hooks';
import {
  professionalProfileFormSchema,
  type ProfessionalProfileFormValues,
} from '../schemas';
import type { Professional } from '../api';

// Cuenta cuántas de las "banderas" de completitud del perfil están presentes — un perfil
// incompleto convierte peor y hoy nada se lo dice al profesional (ver G-03 del WORKPLAN).
function getCompletionPercent(professional: Professional): number {
  const checks = [
    professional.description.trim().length > 0,
    professional.fixedRate !== undefined,
    professional.skills.length > 0,
    professional.certifications.length > 0,
  ];
  const complete = checks.filter(Boolean).length;
  return Math.round((complete / checks.length) * 100);
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ProfessionalProfileForm() {
  const t = useTranslations('professionalProfile.form');
  const tCommon = useTranslations('common');
  const {
    data: professional,
    isPending,
    isError,
  } = useMyProfessionalProfileQuery();
  const updateMutation = useUpdateMyProfessionalProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalProfileFormValues>({
    resolver: standardSchemaResolver(professionalProfileFormSchema),
    values: professional
      ? {
          description: professional.description,
          hourlyRate: professional.hourlyRate,
          fixedRate: professional.fixedRate ?? undefined,
          yearsOfExperience: professional.yearsOfExperience,
          skills: professional.skills.join(', '),
        }
      : undefined,
  });

  if (isPending) {
    return <Skeleton className="h-96" />;
  }

  if (isError || !professional) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  function onSubmit(values: ProfessionalProfileFormValues) {
    if (!professional) return;
    updateMutation.mutate({
      referenceId: professional.referenceId,
      dto: {
        description: values.description,
        hourlyRate: values.hourlyRate,
        fixedRate: values.fixedRate,
        yearsOfExperience: values.yearsOfExperience,
        skills: values.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    });
  }

  const completionPercent = getCompletionPercent(professional);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <Avatar size="lg">
            <AvatarFallback>
              {getInitials(
                professional.user.firstName,
                professional.user.lastName,
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-heading font-semibold">
                {professional.user.firstName} {professional.user.lastName}
              </span>
              <Badge>{professional.category.name}</Badge>
              <Badge variant="secondary">
                {professional.verificationStatus}
              </Badge>
              <AvailabilityToggle professional={professional} />
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Star className="fill-warning text-warning size-4" />
              {professional.averageRating.toFixed(1)} (
              {t('preview.ratingsCount', {
                count: professional.totalRatings,
              })}
              )
            </div>
          </div>

          <div className="flex w-full flex-col gap-1.5 sm:w-48">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{t('preview.completion')}</span>
              <span>{completionPercent}%</span>
            </div>
            <div
              className="bg-muted h-2 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-label={t('preview.completion')}
              aria-valuenow={completionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="flex max-w-xl flex-col gap-4"
        noValidate
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('sectionTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
                  {...register('fixedRate', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="yearsOfExperience">
                {t('yearsOfExperience')}
              </Label>
              <Input
                id="yearsOfExperience"
                type="number"
                {...register('yearsOfExperience', { valueAsNumber: true })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="skills">{t('skills')}</Label>
              <Input id="skills" {...register('skills')} />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={updateMutation.isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {updateMutation.isPending
            ? tCommon('states.saving')
            : tCommon('actions.saveChanges')}
        </Button>
      </form>
    </div>
  );
}
