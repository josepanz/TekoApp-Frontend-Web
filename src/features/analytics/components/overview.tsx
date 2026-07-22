'use client';

import { CreditCard, Star, UserCog, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import { useDashboardStatsQuery } from '../hooks';
import { StatCard } from './stat-card';

export function Overview() {
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
    return (
      <p className="text-muted-foreground">
        No se pudieron cargar las métricas del panel. Intentá recargar la
        página.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Usuarios totales"
        value={formatNumber(data.users.total)}
        trend={`${formatPercent(data.users.growth)} este período`}
        trendDirection={data.users.growth >= 0 ? 'up' : 'down'}
        icon={Users}
      />
      <StatCard
        title="Profesionales verificados"
        value={formatNumber(data.professionals.verified)}
        trend={`${formatNumber(data.professionals.total)} en total`}
        icon={UserCog}
      />
      <StatCard
        title="Facturación del período"
        value={formatCurrency(data.revenue.period)}
        trend={`${formatCurrency(data.revenue.total)} acumulado`}
        icon={CreditCard}
      />
      <StatCard
        title="Calificación promedio"
        value={data.ratings.average.toFixed(1)}
        trend={`${formatNumber(data.ratings.total)} calificaciones`}
        icon={Star}
      />
    </div>
  );
}
