import { getTranslations } from 'next-intl/server';
import { NewLegalDocumentVersionButton } from '@/features/legal-document-versions/components/new-legal-document-version-button';
import { LegalDocumentVersionsTable } from '@/features/legal-document-versions/components/legal-document-versions-table';

export default async function LegalDocumentVersionsPage() {
  const t = await getTranslations('pages.admin.legalDocumentVersions');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <NewLegalDocumentVersionButton />
      </div>
      <LegalDocumentVersionsTable />
    </div>
  );
}
