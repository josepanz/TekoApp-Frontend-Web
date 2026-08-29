import { getTranslations } from 'next-intl/server';
import { ConsentAuditTabs } from '@/features/consent-audit/components/consent-audit-tabs';

export default async function ConsentAuditPage() {
  const t = await getTranslations('pages.admin.consentAudit');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <ConsentAuditTabs />
    </div>
  );
}
