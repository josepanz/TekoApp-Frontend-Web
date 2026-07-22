import { Overview } from '@/features/analytics/components/overview';

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Resumen
        </h1>
        <p className="text-muted-foreground">
          Métricas globales de la plataforma en tiempo real.
        </p>
      </div>
      <Overview />
    </div>
  );
}
