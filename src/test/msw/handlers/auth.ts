import { http, HttpResponse } from 'msw';

export const authHandlers = [
  // Default sin permisos especiales — cualquier test que necesite un usuario staff con un
  // permiso puntual (ej. `admin:all`, `service-progress.audit:read`) lo pisa con `server.use(...)`.
  // Sin esto, cualquier componente que llame `useSessionScopeQuery()` (ej. `ModeSwitcher`,
  // `ServiceProgressSection`) rompe cualquier test que no lo mockee explícitamente, porque
  // `onUnhandledRequest: 'error'` (ver src/test/setup.ts) hace fallar el test ante un request sin
  // handler.
  http.get('/api/backend/auth/scope', () => {
    return HttpResponse.json({ permissions: [], roles: [] });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'fail@tekoapp.com.py') {
      return HttpResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ login: true, accessToken: 'fake-access-token' });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string };

    if (body.email === 'ya-existe@tekoapp.com.py') {
      return HttpResponse.json(
        { message: 'El email ya está registrado' },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      {
        referenceId: 'fake-reference-id',
        email: body.email,
        status: 'PENDING_VERIFICATION',
      },
      { status: 201 },
    );
  }),
];
