'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { useProfessionalDetailQuery } from '../hooks';

export function ProfessionalDetailCard({
  referenceId,
}: {
  referenceId: string;
}) {
  const t = useTranslations('browseProfessionals');
  const {
    data: professional,
    isPending,
    isError,
  } = useProfessionalDetailQuery(referenceId);

  if (isPending) {
    return <Skeleton className="h-64 max-w-xl" />;
  }

  if (isError || !professional) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
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
            {t('detail.rating', {
              rating: Number(professional.averageRating).toFixed(1),
              count: professional.totalRatings,
            })}
          </Badge>
        </div>
        <p className="text-muted-foreground">{professional.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            {t('detail.hourlyRate', {
              rate: formatCurrency(Number(professional.hourlyRate)),
            })}
          </span>
          <span>
            {t('detail.experience', {
              years: professional.yearsOfExperience,
            })}
          </span>
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
