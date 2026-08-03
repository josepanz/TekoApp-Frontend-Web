// Service Worker de Web Push (VAPID). Vive en la raíz de `public/` a propósito — el scope por
// defecto de un Service Worker es el directorio donde se sirve el archivo, y necesitamos que
// cubra toda la app (no solo /perfil, donde se activa la suscripción).
// Ver .claude/documentation (referencia) y TekoApp-Backend/.claude/documentation/notifications-push-architecture.md.

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'TekoApp', body: event.data.text() };
  }

  const title = payload.title || 'TekoApp';
  const options = {
    body: payload.body,
    icon: '/brand/logo.png',
    badge: '/brand/logo.png',
    data: payload.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Al hacer click enfoca (o abre) la app. No hay todavía una pantalla de detalle por notificación
// en TekoApp-Web — cuando exista, resolver acá el deep link usando `event.notification.data.referenceId`
// (mismo contrato que documenta TekoApp-Frontend-Mobile/openspec/specs/notifications-push.md).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsList) => {
        for (const client of clientsList) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
