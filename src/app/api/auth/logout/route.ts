import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  deriveSessionId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';

// El backend no tiene endpoint de logout — alcanza con limpiar las cookies desde nuestro propio
// dominio (el access token expira en 15 min de cualquier forma). Ver architecture.md.
export function POST(request: NextRequest): Response {
  const requestId = resolveRequestId(request.headers);
  const sessionId = deriveSessionId(request.cookies.get('accessToken')?.value);

  const response = NextResponse.json({ success: true });
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
  response.headers.set(REQUEST_ID_HEADER, requestId);

  logger.info('Logout', { requestId, sessionId });

  return response;
}
