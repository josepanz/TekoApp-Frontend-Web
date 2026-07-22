import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Notification = components['schemas']['NotificationResponseDTO'];
export type NotificationType = Notification['type'];
export type NotificationStatus = Notification['status'];
export type CreateNotificationRequest =
  components['schemas']['CreateNotificationRequestDTO'];

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
