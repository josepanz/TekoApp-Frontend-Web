import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '@/core/config/env';
import { encryptPassword } from '@/core/auth/rsa-encrypt';
import { resolveBackendPath } from '@/core/api-client/backend-paths';

// Ruta dedicada (no pasa por el proxy genérico) porque necesita cifrar el password con RSA
// antes de reenviar al backend — ver documentation/architecture.md. El browser manda
// {email, password} en texto plano a NUESTRO dominio (HTTPS); acá se cifra recién.
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest): Promise<Response> {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Email o contraseña inválidos' },
      { status: 400 },
    );
  }
  const { email, password, rememberMe } = parsed.data;

  const basicAuth = Buffer.from(
    `${env.BACKEND_CLIENT_ID}:${env.BACKEND_CLIENT_SECRET}`,
  ).toString('base64');

  const backendResponse = await fetch(
    `${env.BACKEND_API_URL}/${resolveBackendPath('auth/login')}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        email,
        encryptedPassword: encryptPassword(password),
        rememberMe,
      }),
    },
  );

  const responseBody = await backendResponse.text();
  const response = new Response(responseBody, {
    status: backendResponse.status,
    headers: { 'Content-Type': 'application/json' },
  });

  for (const setCookie of backendResponse.headers.getSetCookie()) {
    response.headers.append('set-cookie', setCookie);
  }

  return response;
}
