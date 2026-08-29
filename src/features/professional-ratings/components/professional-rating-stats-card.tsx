'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import { useMyProfessionalRatingStatsQuery } from '../hooks';

const STARS = ['5', '4', '3', '2', '1'] as const;

export function ProfessionalRatingStatsCard() {
  const t = useTranslations('professionalRatings.stats');
  const { data: professional } = useMyProfessionalProfileQuery();
  const {
    data: stats,
    isPending,
    isError,
  } = useMyProfessionalRatingStatsQuery(professional?.id);

  if (isPending) {
    return <Skeleton className="h-48" />;
  }

  if (isError || !stats) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  if (stats.totalRatings === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground pt-6">
          {t('empty')}
        </CardContent>
      </Card>
    );
  }

  const criteriaEntries = Object.entries(stats.averageCriteria ?? {});

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('averageLabel')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <span className="font-heading text-3xl font-semibold">
            {stats.averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-sm">
            {t('totalLabel', { count: stats.totalRatings })}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('distributionLabel')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {STARS.map((star) => {
            const count = stats.ratingDistribution?.[star] ?? 0;
            const percent =
              stats.totalRatings === 0 ? 0 : (count / stats.totalRatings) * 100;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-6 shrink-0">{star}★</span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-6 shrink-0 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {criteriaEntries.length > 0 && (
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>{t('criteriaLabel')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {criteriaEntries.map(([criterion, average]) => (
              <div
                key={criterion}
                className="flex items-center justify-between text-sm"
              >
                <span className="capitalize">{criterion}</span>
                <span className="font-medium">{average.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
