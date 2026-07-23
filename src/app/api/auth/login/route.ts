import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '@/core/config/env';
import { encryptPassword } from '@/core/auth/rsa-encrypt';
import { resolveBackendPath } from '@/core/api-client/backend-paths';
import { isBackendEnvelope } from '@/core/api-client/client';

// Ruta dedicada (no pasa por el proxy genérico) porque necesita cifrar el password con RSA
// antes de reenviar al backend — ver documentation/architecture.md. El browser manda
// {email, password} en texto plano a NUESTRO dominio (HTTPS); acá se cifra recién.
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

// Pide al backend un nonce anti-replay de uso único (TTL corto) y lo devuelve. Se manda
// DENTRO del payload cifrado (ver más abajo) — el backend lo consume atómicamente antes de
// validar la contraseña, así que un request de login capturado no puede reenviarse tal cual.
async function fetchLoginNonce(basicAuth: string): Promise<string> {
  const response = await fetch(
    `${env.BACKEND_API_URL}/${resolveBackendPath('auth/nonce')}`,
    {
      method: 'POST',
      headers: { Authorization: `Basic ${basicAuth}` },
    },
  );

  if (!response.ok) {
    throw new Error(
      `No se pudo obtener el nonce de login (${response.status})`,
    );
  }

  const body: unknown = await response.json();
  const { nonce } = isBackendEnvelope<{ nonce: string }>(body)
    ? body.data
    : (body as { nonce: string });

  return nonce;
}

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

  let nonce: string;
  try {
    nonce = await fetchLoginNonce(basicAuth);
  } catch {
    return NextResponse.json(
      { message: 'Servicio de autenticación no disponible. Intentá de nuevo.' },
      { status: 502 },
    );
  }

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
        encryptedPassword: encryptPassword(JSON.stringify({ password, nonce })),
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
