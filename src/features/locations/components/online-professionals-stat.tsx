'use client';

import { Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/features/analytics/components/stat-card';
import { useOnlineProfessionalsCountQuery } from '../hooks';

export function OnlineProfessionalsStat() {
  const t = useTranslations('locations');
  const { data, isPending, isError } = useOnlineProfessionalsCountQuery();

  if (isPending) {
    return <Skeleton className="h-28 w-full max-w-xs" />;
  }

  return (
    <StatCard
      title={t('onlineStat.title')}
      value={isError ? '—' : String(data.count)}
      icon={Radio}
    />
  );
}
