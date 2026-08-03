import { Button } from '@/components/ui/button';
import { PromotionFormDialog } from '@/features/promotions/components/promotion-form-dialog';
import { PromotionsTable } from '@/features/promotions/components/promotions-table';
import { getTranslations } from 'next-intl/server';

export default async function PromotionsPage() {
  const t = await getTranslations('pages.admin.promotions');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <PromotionFormDialog trigger={<Button>{t('newButton')}</Button>} />
      </div>
      <PromotionsTable />
    </div>
  );
}
