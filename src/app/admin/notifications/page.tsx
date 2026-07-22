import { NewNotificationDialog } from '@/features/notifications/components/new-notification-dialog';
import { NotificationsTable } from '@/features/notifications/components/notifications-table';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Notificaciones
          </h1>
          <p className="text-muted-foreground">
            Log de notificaciones del sistema y envío de notificaciones
            manuales.
          </p>
        </div>
        <NewNotificationDialog />
      </div>
      <NotificationsTable />
    </div>
  );
}
