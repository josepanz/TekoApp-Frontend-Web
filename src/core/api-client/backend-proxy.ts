import 'server-only';
import type { NextRequest } from 'next/server';
import { env } from '@/core/config/env';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  deriveSessionId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';
import { resolveBackendPath, requiresBasicAuth } from './backend-paths';

/**
 * Proxy reverso genérico y autenticado hacia TekoApp-Backend. Ver
 * documentation/architecture.md → "El proxy BFF genérico" para el razonamiento completo.
 *
 * Puentea, invisible para el browser:
 * - Bearer vs Cookie: el backend protege rutas leyendo `Authorization: Bearer`, pero él mismo
 *   setea el access token como cookie httpOnly — acá se copia el valor de la cookie al header.
 * - Basic Auth de cliente: inyectado solo en los paths que lo requieren (BASIC_AUTH_PATHS).
 * - Cookies del browser (incluida `refreshToken`) se reenvían tal cual en el header `Cookie`.
 * - Los `Set-Cookie` de la respuesta del backend se reenvían tal cual al browser.
 */
export async function proxyToBackend(
  request: NextRequest,
  path: string,
): Promise<Response> {
  const start = Date.now();
  const requestId = resolveRequestId(request.headers);
  const sessionId = deriveSessionId(request.cookies.get('accessToken')?.value);
  const backendPath = resolveBackendPath(path);
  const targetUrl = `${env.BACKEND_API_URL}/${backendPath}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);

  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) headers.set('cookie', cookieHeader);

  const accessToken = request.cookies.get('accessToken')?.value;
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);

  if (requiresBasicAuth(path)) {
    const basic = Buffer.from(
      `${env.BACKEND_CLIENT_ID}:${env.BACKEND_CLIENT_SECRET}`,
    ).toString('base64');
    headers.set('authorization', `Basic ${basic}`);
  }

  const isBodylessMethod =
    request.method === 'GET' || request.method === 'HEAD';

  let backendResponse: Response;
  try {
    backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: isBodylessMethod ? undefined : request.body,
      // @ts-expect-error -- 'duplex' es requerido por fetch cuando el body es un stream, todavía no está en el tipo de RequestInit de TS
      duplex: isBodylessMethod ? undefined : 'half',
      redirect: 'manual',
    });
  } catch (error) {
    logger.error('Fallo de conexión con el backend en el proxy', {
      requestId,
      sessionId,
      method: request.method,
      path: backendPath,
      durationMs: Date.now() - start,
      err: error,
    });
    throw error;
  }

  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  const response = new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });

  for (const setCookie of backendResponse.headers.getSetCookie()) {
    response.headers.append('set-cookie', setCookie);
  }

  response.headers.set(REQUEST_ID_HEADER, requestId);

  logger.info('Proxy al backend', {
    requestId,
    sessionId,
    method: request.method,
    path: backendPath,
    status: backendResponse.status,
    durationMs: Date.now() - start,
  });

  return response;
}
