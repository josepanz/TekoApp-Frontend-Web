import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/core/config/env';
import { resolveBackendPath } from '@/core/api-client/backend-paths';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  deriveSessionId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';

// Logout: revoca el refresh token en el backend (`POST /auth/logout`: Basic Auth + cookie
// `refreshToken`, sin body, 204 idempotente) y limpia las cookies de Web. La limpieza local ocurre
// SIEMPRE, aunque el backend falle o este caido: el usuario nunca debe quedar "pegado" en sesion.
export async function POST(request: NextRequest): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const sessionId = deriveSessionId(request.cookies.get('accessToken')?.value);

  const refreshToken = request.cookies.get('refreshToken')?.value;
  let backendStatus: number | undefined;
  try {
    const basicAuth = Buffer.from(
      `${env.BACKEND_CLIENT_ID}:${env.BACKEND_CLIENT_SECRET}`,
    ).toString('base64');
    const headers: Record<string, string> = {
      Authorization: `Basic ${basicAuth}`,
    };
    // Solo se reenvia la cookie del refresh (no el accessToken ni otras cookies del browser).
    if (refreshToken) {
      headers.Cookie = `refreshToken=${encodeURIComponent(refreshToken)}`;
    }
    const backendResponse = await fetch(
      `${env.BACKEND_API_URL}/${resolveBackendPath('auth/logout')}`,
      { method: 'POST', headers },
    );
    backendStatus = backendResponse.status;
  } catch (error) {
    logger.error(
      'Fallo el logout en el backend; se limpian las cookies igual',
      {
        requestId,
        sessionId,
        err: error,
      },
    );
  }

  if (backendStatus !== undefined && backendStatus >= 400) {
    logger.warn('El backend rechazo el logout; se limpian las cookies igual', {
      requestId,
      sessionId,
      status: backendStatus,
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
  response.headers.set(REQUEST_ID_HEADER, requestId);

  logger.info('Logout', { requestId, sessionId, backendStatus });

  return response;
}
