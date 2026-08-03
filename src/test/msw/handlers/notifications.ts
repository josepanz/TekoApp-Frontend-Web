import { http, HttpResponse } from 'msw';
import type {
  CreateNotificationRequest,
  Notification,
} from '@/features/notifications/api';

export function buildNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: '6481fc923fbc4a3a6c23e801',
    userId: '6481fc923fbc4a3a6c23e802',
    title: 'Pago procesado',
    message: 'Tu pago ha sido procesado exitosamente.',
    type: 'payment_received',
    status: 'sent',
    channels: ['in_app'],
    createdAt: '2026-06-07T22:24:00.000Z',
    ...overrides,
  };
}

export const fakeNotifications: Notification[] = [
  buildNotification(),
  buildNotification({
    id: '6481fc923fbc4a3a6c23e803',
    title: 'Nueva solicitud de servicio',
    message: 'El cliente Juan Pérez ha solicitado un servicio de plomería.',
    type: 'service_request',
    status: 'read',
    channels: ['in_app', 'push'],
    readAt: '2026-06-07T22:30:00.000Z',
    createdAt: '2026-06-06T10:00:00.000Z',
  }),
  buildNotification({
    id: '6481fc923fbc4a3a6c23e804',
    title: 'Nueva calificación de un cliente',
    message:
      'Recibiste una nueva calificación de 5 estrellas por tu último servicio completado. ¡Felicitaciones por el excelente trabajo!',
    type: 'rating_received',
    status: 'pending',
    channels: ['in_app', 'email'],
    createdAt: '2026-06-08T09:15:00.000Z',
  }),
];

export const notificationsHandlers = [
  http.get('/api/backend/notifications', ({ request }) => {
    const limit = Number(
      new URL(request.url).searchParams.get('limit') ??
        fakeNotifications.length,
    );
    return HttpResponse.json(fakeNotifications.slice(0, limit));
  }),

  http.post('/api/backend/notifications', async ({ request }) => {
    const body = (await request.json()) as CreateNotificationRequest;
    return HttpResponse.json(
      buildNotification({
        id: '6481fc923fbc4a3a6c23e805',
        title: body.title,
        message: body.message,
        type: body.type,
        channels: body.channels,
        status: 'pending',
      }),
      { status: 201 },
    );
  }),

  http.put('/api/backend/notifications/:id/read', ({ params }) => {
    const notification = fakeNotifications.find(
      (item) => item.id === params.id,
    );
    return HttpResponse.json(
      buildNotification({
        ...notification,
        status: 'read',
        readAt: '2026-06-08T12:00:00.000Z',
      }),
    );
  }),

  http.get('/api/backend/notifications/unread/count', () => {
    return HttpResponse.json({ count: 2 });
  }),

  http.put(
    '/api/backend/notifications/read-all',
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get('/api/backend/notifications/push/vapid-public-key', () => {
    return HttpResponse.json({
      publicKey:
        'BOZRpAjqLURvFBkW-7jiWpzFRiOULwH-MZ-6zBNw5g5-pTKrDbSZHzCfetZ-qFXTqsWz6FosItuxzdwIN0TY6q4',
    });
  }),

  http.post('/api/backend/notifications/push-subscriptions', () => {
    return HttpResponse.json(
      {
        referenceId: 'push-sub-ref-1',
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        createdAt: '2026-08-02T00:00:00.000Z',
      },
      { status: 201 },
    );
  }),

  http.delete(
    '/api/backend/notifications/push-subscriptions/:referenceId',
    () => new HttpResponse(null, { status: 204 }),
  ),
];
