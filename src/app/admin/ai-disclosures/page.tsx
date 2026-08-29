import { AiDisclosuresTable } from '@/features/ai-disclosures/components/ai-disclosures-table';
import { getTranslations } from 'next-intl/server';

export default async function AiDisclosuresPage() {
  const t = await getTranslations('pages.admin.aiDisclosures');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <AiDisclosuresTable />
    </div>
  );
}
