import { RatingsTable } from '@/features/ratings/components/ratings-table';
import { getTranslations } from 'next-intl/server';

export default async function RatingsPage() {
  const t = await getTranslations('pages.admin.ratings');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <RatingsTable />
    </div>
  );
}
