import { ProfessionalApplicationForm } from '@/features/professional-application/components/professional-application-form';
import { getTranslations } from 'next-intl/server';

export default async function ApplyAsProfessionalPage() {
  const t = await getTranslations('pages.client.applyAsProfessional');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <ProfessionalApplicationForm />
    </div>
  );
}
