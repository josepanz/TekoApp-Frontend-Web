'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function ProfessionalProfileForm() {
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
    return (
      <p className="text-muted-foreground">
        No se pudo cargar tu perfil profesional.
      </p>
    );
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{professional.category.name}</Badge>
        <Badge variant="secondary">{professional.verificationStatus}</Badge>
        <AvailabilityToggle professional={professional} />
      </div>

      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="flex max-w-xl flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descripción</Label>
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
            <Label htmlFor="hourlyRate">Tarifa por hora</Label>
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
            <Label htmlFor="fixedRate">Tarifa fija (opcional)</Label>
            <Input
              id="fixedRate"
              type="number"
              {...register('fixedRate', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="yearsOfExperience">Años de experiencia</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            {...register('yearsOfExperience', { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
          <Input id="skills" {...register('skills')} />
        </div>

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  );
}
