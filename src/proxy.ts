import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/core/logging/logger';
import {
  resolveRequestId,
  REQUEST_ID_HEADER,
} from '@/core/logging/request-context';

// Next.js 16 renombró `middleware.ts` → `proxy.ts` (y la función `middleware()` → `proxy()`).
// Esto NO es el proxy BFF hacia el backend (eso vive en core/api-client/backend-proxy.ts) — acá
// solo se decide si vale la pena intentar renderizar una ruta protegida o mandar a /login. La
// verificación real de expiración/permisos del JWT la sigue haciendo el backend en cada request.
//
// Correlación: acá se resuelve el x-request-id y se propaga tanto a la request downstream (para
// que los Server Components lo puedan leer) como a la response. OJO: el `matcher` de abajo excluye
// `/api`, así que este middleware NO corre para los route handlers — cada uno bajo `app/api/**`
// resuelve su propio request-id con `resolveRequestId` (ver core/logging/request-context.ts).
const PUBLIC_PATHS = ['/login', '/register'];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const requestId = resolveRequestId(request.headers);
  const hasSession = Boolean(request.cookies.get('accessToken')?.value);
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const withRequestId = (response: NextResponse): NextResponse => {
    response.headers.set(REQUEST_ID_HEADER, requestId);
    return response;
  };

  if (!hasSession && !isPublicPath) {
    logger.info('Ruta protegida sin sesión: redirigiendo a /login', {
      requestId,
      path: pathname,
    });
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return withRequestId(NextResponse.redirect(loginUrl));
  }

  if (hasSession && isPublicPath) {
    return withRequestId(NextResponse.redirect(new URL('/', request.url)));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  return withRequestId(
    NextResponse.next({ request: { headers: requestHeaders } }),
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
