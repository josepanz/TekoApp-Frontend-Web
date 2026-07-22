import { http, HttpResponse } from 'msw';

export const authHandlers = [
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
];
