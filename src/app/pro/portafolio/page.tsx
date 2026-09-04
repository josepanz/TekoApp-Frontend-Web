import { MyPortfolioManager } from '@/features/professional-portfolio/components/my-portfolio-manager';
import { getTranslations } from 'next-intl/server';

export default async function PortafolioPage() {
  const t = await getTranslations('pages.pro.portfolio');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <MyPortfolioManager />
    </div>
  );
}
