'use client';

import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useNotificationsStream,
  useUnreadCountQuery,
} from '../hooks';

/**
 * Campanita de notificaciones en tiempo real — se actualiza vía SSE mientras está montada
 * (ver useNotificationsStream) y muestra las últimas notificaciones del usuario autenticado.
 * Solo cubre "app abierta ahora mismo"; Web Push (ver PushSubscriptionToggle en /perfil) cubre
 * la entrega con la pestaña cerrada.
 */
export function NotificationBell() {
  const t = useTranslations('layout.notificationBell');
  useNotificationsStream(true);

  const unreadCountQuery = useUnreadCountQuery();
  const notificationsQuery = useNotificationsQuery({ limit: 5 });
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();

  const unreadCount = unreadCountQuery.data?.count ?? 0;
  const notifications = notificationsQuery.data ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={t('trigger')}
          >
            <Bell aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>{t('title')}</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="text-primary text-xs font-normal hover:underline"
                onClick={() => markAllAsReadMutation.mutate()}
              >
                {t('markAllRead')}
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">
            {t('empty')}
          </p>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-0.5 whitespace-normal"
              onClick={() => {
                if (notification.status !== 'read') {
                  markAsReadMutation.mutate(notification.id);
                }
              }}
            >
              <span className="text-sm font-medium">{notification.title}</span>
              <span className="text-muted-foreground text-xs">
                {notification.message}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
