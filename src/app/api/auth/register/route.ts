import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '@/core/config/env';
import { encryptPassword } from '@/core/auth/rsa-encrypt';
import { resolveBackendPath } from '@/core/api-client/backend-paths';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';

// Ruta dedicada (no pasa por el proxy genérico) por el mismo motivo que /api/auth/login: cifra
// password/confirmPassword con RSA antes de reenviar a POST /onboarding — a diferencia del login,
// el backend acá NO espera un nonce (ver OnboardingApiService.onboarding, desencripta cada campo
// suelto con CryptoHelper.decrypt(valor, 'sha256'), sin envelope {password,nonce}).
const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(1),
  acceptTerms: z.literal(true),
});

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const respond = (response: Response): Response => {
    response.headers.set(REQUEST_ID_HEADER, requestId);
    return response;
  };

  const parsed = registerSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    logger.warn('Registro rechazado: payload inválido', { requestId });
    return respond(
      NextResponse.json(
        { message: 'Datos de registro inválidos' },
        { status: 400 },
      ),
    );
  }
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    acceptTerms,
  } = parsed.data;

  logger.info('Intento de registro', { requestId, email });

  const basicAuth = Buffer.from(
    `${env.BACKEND_CLIENT_ID}:${env.BACKEND_CLIENT_SECRET}`,
  ).toString('base64');

  let backendResponse: Response;
  try {
    backendResponse = await fetch(
      `${env.BACKEND_API_URL}/${resolveBackendPath('onboarding')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          password: encryptPassword(password),
          confirmPassword: encryptPassword(confirmPassword),
          acceptTerms,
        }),
      },
    );
  } catch (error) {
    logger.error('Fallo de conexión con el backend durante el registro', {
      requestId,
      email,
      err: error,
    });
    return respond(
      NextResponse.json(
        { message: 'Servicio de registro no disponible. Intentá de nuevo.' },
        { status: 502 },
      ),
    );
  }

  if (backendResponse.ok) {
    logger.info('Registro exitoso', {
      requestId,
      email,
      status: backendResponse.status,
    });
  } else {
    logger.warn('Registro fallido', {
      requestId,
      email,
      status: backendResponse.status,
    });
  }

  const responseBody = await backendResponse.text();
  return respond(
    new Response(responseBody, {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}
