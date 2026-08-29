'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyRatingStatsQuery } from '../hooks';

export function MyRatingStatsCard() {
  const t = useTranslations('myRatings');
  const { data: stats, isPending, isError } = useMyRatingStatsQuery();

  if (isPending) {
    return <Skeleton className="h-32" />;
  }

  if (isError || !stats) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('givenLabel')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <span className="font-heading text-3xl font-semibold">
            {stats.givenRatings}
          </span>
          <span className="text-muted-foreground text-sm">
            {t('averageGivenLabel')}: {stats.averageGivenRating.toFixed(1)}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('receivedLabel')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <span className="font-heading text-3xl font-semibold">
            {stats.receivedRatings}
          </span>
          <span className="text-muted-foreground text-sm">
            {t('averageReceivedLabel')}:{' '}
            {stats.averageReceivedRating.toFixed(1)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
