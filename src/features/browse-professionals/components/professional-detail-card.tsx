'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfessionalDetailQuery } from '../hooks';

export function ProfessionalDetailCard({
  referenceId,
}: {
  referenceId: string;
}) {
  const {
    data: professional,
    isPending,
    isError,
  } = useProfessionalDetailQuery(referenceId);

  if (isPending) {
    return <Skeleton className="h-64 max-w-xl" />;
  }

  if (isError || !professional) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar el perfil de este profesional.
      </p>
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>
          {professional.user.firstName} {professional.user.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{professional.category.name}</Badge>
          <Badge variant="secondary">
            ⭐ {Number(professional.averageRating).toFixed(1)} (
            {professional.totalRatings} reseñas)
          </Badge>
        </div>
        <p className="text-muted-foreground">{professional.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            Tarifa por hora: Gs.{' '}
            {Number(professional.hourlyRate).toLocaleString('es-PY')}
          </span>
          <span>{professional.yearsOfExperience} años de experiencia</span>
        </div>
        {professional.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {professional.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
