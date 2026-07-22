'use client';

import { Radio } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/features/analytics/components/stat-card';
import { useOnlineProfessionalsCountQuery } from '../hooks';

export function OnlineProfessionalsStat() {
  const { data, isPending, isError } = useOnlineProfessionalsCountQuery();

  if (isPending) {
    return <Skeleton className="h-28 w-full max-w-xs" />;
  }

  return (
    <StatCard
      title="Profesionales en línea"
      value={isError ? '—' : String(data.count)}
      icon={Radio}
    />
  );
}
