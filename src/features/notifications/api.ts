import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Notification = components['schemas']['NotificationResponseDTO'];
export type NotificationType = Notification['type'];
export type NotificationStatus = Notification['status'];
export type CreateNotificationRequest =
  components['schemas']['CreateNotificationRequestDTO'];
export type VapidPublicKeyResponse =
  components['schemas']['VapidPublicKeyResponseDTO'];
export type CreatePushSubscriptionRequest =
  components['schemas']['CreatePushSubscriptionRequestDTO'];
export type PushSubscriptionResponse =
  components['schemas']['PushSubscriptionResponseDTO'];

export interface GetNotificationsParams {
  limit?: number;
  offset?: number;
}

// GET /tekoapp-backend/api/notifications (NotificationsController_findAll) NO devuelve el
// wrapper { data, pagination } que usan el resto de los listados — la respuesta es un array
// plano NotificationResponseDTO[] y la paginación es por limit/offset (no page/pageSize), ver
// types.generated.ts. Se mantiene simple: sin merge de páginas en cliente, el consumidor puede
// pedir un límite mayor ("cargar más") y listo.
export function getNotifications(
  params: GetNotificationsParams = {},
): Promise<Notification[]> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }
  if (params.offset !== undefined) {
    query.set('offset', String(params.offset));
  }
  const queryString = query.toString();
  return apiFetch<Notification[]>(
    `notifications${queryString ? `?${queryString}` : ''}`,
  );
}

// POST /tekoapp-backend/api/notifications (NotificationsController_create) — CreateNotificationRequestDTO
// no tiene un campo userId (a diferencia de lo que podría asumirse): title, message, type,
// channels son los campos reales, más data/metadata opcionales de propósito general.
export function createNotification(
  dto: CreateNotificationRequest,
): Promise<Notification> {
  return apiFetch<Notification>('notifications', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// PUT /tekoapp-backend/api/notifications/{id}/read (NotificationsController_markAsRead) — el
// verbo real es PUT, no POST.
export function markNotificationAsRead(id: string): Promise<Notification> {
  return apiFetch<Notification>(`notifications/${id}/read`, {
    method: 'PUT',
  });
}

// GET /tekoapp-backend/api/notifications/unread/count
export function getUnreadCount(): Promise<{ count: number }> {
  return apiFetch<{ count: number }>('notifications/unread/count');
}

// PUT /tekoapp-backend/api/notifications/read-all — 204 sin body.
export function markAllNotificationsAsRead(): Promise<void> {
  return apiFetch<void>('notifications/read-all', { method: 'PUT' });
}

// GET /tekoapp-backend/api/notifications/push/vapid-public-key — clave pública VAPID, no es
// secreta (el Service Worker la necesita para pushManager.subscribe()).
export function getVapidPublicKey(): Promise<VapidPublicKeyResponse> {
  return apiFetch<VapidPublicKeyResponse>(
    'notifications/push/vapid-public-key',
  );
}

// POST /tekoapp-backend/api/notifications/push-subscriptions — registra (o actualiza) la
// suscripción Web Push del Service Worker del navegador actual.
export function subscribeToPush(
  dto: CreatePushSubscriptionRequest,
): Promise<PushSubscriptionResponse> {
  return apiFetch<PushSubscriptionResponse>(
    'notifications/push-subscriptions',
    {
      method: 'POST',
      body: JSON.stringify(dto),
    },
  );
}

// DELETE /tekoapp-backend/api/notifications/push-subscriptions/{referenceId}
export function unsubscribeFromPush(referenceId: string): Promise<void> {
  return apiFetch<void>(`notifications/push-subscriptions/${referenceId}`, {
    method: 'DELETE',
  });
}
