import { NewNotificationDialog } from '@/features/notifications/components/new-notification-dialog';
import { NotificationsTable } from '@/features/notifications/components/notifications-table';
import { getTranslations } from 'next-intl/server';

export default async function NotificationsPage() {
  const t = await getTranslations('pages.admin.notifications');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <NewNotificationDialog />
      </div>
      <NotificationsTable />
    </div>
  );
}
