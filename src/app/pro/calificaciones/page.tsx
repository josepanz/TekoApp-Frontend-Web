import { ProfessionalRatingStatsCard } from '@/features/professional-ratings/components/professional-rating-stats-card';
import { ReviewsTable } from '@/features/professional-ratings/components/reviews-table';
import { getTranslations } from 'next-intl/server';

export default async function CalificacionesPage() {
  const t = await getTranslations('pages.pro.ratings');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <ProfessionalRatingStatsCard />
      <ReviewsTable />
    </div>
  );
}
