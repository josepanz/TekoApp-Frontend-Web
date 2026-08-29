'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentConsentGrantsAuditTable } from './content-consent-grants-audit-table';
import { UserConsentsAuditTable } from './user-consents-audit-table';

export function ConsentAuditTabs() {
  const t = useTranslations('consentAudit.tabs');

  return (
    <Tabs defaultValue="user-consents">
      <TabsList>
        <TabsTrigger value="user-consents">{t('userConsents')}</TabsTrigger>
        <TabsTrigger value="content-consents">
          {t('contentConsents')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="user-consents">
        <UserConsentsAuditTable />
      </TabsContent>
      <TabsContent value="content-consents">
        <ContentConsentGrantsAuditTable />
      </TabsContent>
    </Tabs>
  );
}
