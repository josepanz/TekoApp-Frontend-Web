import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createNotification,
  getNotifications,
  getUnreadCount,
  getVapidPublicKey,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToPush,
  unsubscribeFromPush,
  type CreateNotificationRequest,
  type CreatePushSubscriptionRequest,
  type GetNotificationsParams,
} from './api';

export function useNotificationsQuery(params: GetNotificationsParams = {}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  });
}

export function useCreateNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNotificationRequest) => createNotification(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificación creada correctamente.');
    },
    onError: () => {
      toast.error('No se pudo crear la notificación. Intentá de nuevo.');
    },
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificación marcada como leída.');
    },
    onError: () => {
      toast.error(
        'No se pudo marcar la notificación como leída. Intentá de nuevo.',
      );
    },
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => getUnreadCount(),
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('No se pudieron marcar las notificaciones como leídas.');
    },
  });
}

export function useVapidPublicKeyQuery() {
  return useQuery({
    queryKey: ['notifications', 'vapid-public-key'],
    queryFn: () => getVapidPublicKey(),
    // La clave pública no cambia salvo rotación manual del par VAPID — no tiene sentido
    // refetchear en cada foco de ventana como el resto de las queries.
    staleTime: Infinity,
  });
}

export function useSubscribePushMutation() {
  return useMutation({
    mutationFn: (dto: CreatePushSubscriptionRequest) => subscribeToPush(dto),
  });
}

export function useUnsubscribePushMutation() {
  return useMutation({
    mutationFn: (referenceId: string) => unsubscribeFromPush(referenceId),
  });
}

/**
 * Consume el stream SSE de notificaciones en tiempo real mientras el componente está montado —
 * solo cubre "app abierta ahora mismo" (ver notifications-push-architecture.md en el backend);
 * Web Push es el canal para cuando la pestaña está cerrada. Al recibir un evento, invalida las
 * queries de notificaciones para que TanStack Query refetchee (no se confía en el payload del
 * evento como fuente de verdad, evita desincronizar el cache con el resto de la UI).
 */
export function useNotificationsStream(enabled: boolean): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      !enabled ||
      typeof window === 'undefined' ||
      !('EventSource' in window)
    ) {
      return;
    }

    const eventSource = new EventSource('/api/backend/notifications/stream');

    const handleNotification = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    eventSource.addEventListener('notification', handleNotification);

    return () => {
      eventSource.removeEventListener('notification', handleNotification);
      eventSource.close();
    };
  }, [enabled, queryClient]);
}
