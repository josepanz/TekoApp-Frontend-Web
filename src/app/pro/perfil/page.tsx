import { ProfessionalProfileForm } from '@/features/professional-profile/components/professional-profile-form';
import { getTranslations } from 'next-intl/server';

export default async function PerfilPage() {
  const t = await getTranslations('pages.pro.profile');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <ProfessionalProfileForm />
    </div>
  );
}
