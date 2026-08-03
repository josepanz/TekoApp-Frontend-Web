import { MyClientServicesTable } from '@/features/my-services/components/my-client-services-table';
import { getTranslations } from 'next-intl/server';

export default async function MisServiciosPage() {
  const t = await getTranslations('pages.client.myServices');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <MyClientServicesTable />
    </div>
  );
}
