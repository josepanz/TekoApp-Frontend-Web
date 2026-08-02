import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  deriveSessionId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';

// El access token vive en cookie httpOnly — el browser no lo puede leer para el handshake de
// socket.io contra LocationsGateway (que espera el JWT en handshake.auth.token). Esta ruta
// devuelve el valor vigente SOLO para usarlo en memoria al abrir el socket, nunca persistirlo.
// Ver documentation/architecture.md → "Realtime — el ticket de socket".
export function GET(request: NextRequest): Response {
  const requestId = resolveRequestId(request.headers);
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    logger.warn('Ticket de realtime solicitado sin sesión', { requestId });
    const response = NextResponse.json(
      { message: 'No autenticado' },
      { status: 401 },
    );
    response.headers.set(REQUEST_ID_HEADER, requestId);
    return response;
  }

  // Se emite el token pero JAMÁS se loguea su valor — solo el sessionId derivado (hash).
  logger.info('Ticket de realtime emitido', {
    requestId,
    sessionId: deriveSessionId(accessToken),
  });
  const response = NextResponse.json({ token: accessToken });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}
