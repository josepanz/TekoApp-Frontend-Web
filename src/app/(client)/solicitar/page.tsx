import { RequestServiceForm } from '@/features/request-service/components/request-service-form';
import { getTranslations } from 'next-intl/server';

export default async function SolicitarPage() {
  const t = await getTranslations('pages.client.request');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <RequestServiceForm />
    </div>
  );
}
