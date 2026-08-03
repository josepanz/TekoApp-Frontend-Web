'use client';

import { CreditCard, Star, UserCog, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import { useDashboardStatsQuery } from '../hooks';
import { StatCard } from './stat-card';

export function Overview() {
  const t = useTranslations('analytics');
  const locale = useAppLocale();
  const { data, isPending, isError } = useDashboardStatsQuery();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('stats.totalUsers')}
        value={formatNumber(data.users.total, locale)}
        trend={t('trends.thisPeriod', {
          value: formatPercent(data.users.growth),
        })}
        trendDirection={data.users.growth >= 0 ? 'up' : 'down'}
        icon={Users}
      />
      <StatCard
        title={t('stats.verifiedProfessionals')}
        value={formatNumber(data.professionals.verified, locale)}
        trend={t('trends.totalCount', {
          value: formatNumber(data.professionals.total, locale),
        })}
        icon={UserCog}
      />
      <StatCard
        title={t('stats.periodRevenue')}
        value={formatCurrency(data.revenue.period)}
        trend={t('trends.accumulated', {
          value: formatCurrency(data.revenue.total),
        })}
        icon={CreditCard}
      />
      <StatCard
        title={t('stats.averageRating')}
        value={data.ratings.average.toFixed(1)}
        trend={t('trends.ratingsCount', {
          value: formatNumber(data.ratings.total, locale),
        })}
        icon={Star}
      />
    </div>
  );
}
