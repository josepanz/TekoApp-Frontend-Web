import { Overview } from '@/features/analytics/components/overview';
import { getTranslations } from 'next-intl/server';

export default async function DashboardOverviewPage() {
  const t = await getTranslations('pages.admin.dashboard');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <Overview />
    </div>
  );
}
