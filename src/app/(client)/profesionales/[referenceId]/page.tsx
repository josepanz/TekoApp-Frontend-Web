import { ProfessionalDetailCard } from '@/features/browse-professionals/components/professional-detail-card';
import { getTranslations } from 'next-intl/server';

export default async function ProfesionalDetailPage({
  params,
}: {
  params: Promise<{ referenceId: string }>;
}) {
  const { referenceId } = await params;
  const t = await getTranslations('pages.client.professionalDetail');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
      </div>
      <ProfessionalDetailCard referenceId={referenceId} />
    </div>
  );
}
