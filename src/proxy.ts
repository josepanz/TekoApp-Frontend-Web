import { NextResponse, type NextRequest } from 'next/server';

// Next.js 16 renombró `middleware.ts` → `proxy.ts` (y la función `middleware()` → `proxy()`).
// Esto NO es el proxy BFF hacia el backend (eso vive en core/api-client/backend-proxy.ts) — acá
// solo se decide si vale la pena intentar renderizar una ruta protegida o mandar a /login. La
// verificación real de expiración/permisos del JWT la sigue haciendo el backend en cada request.
const PUBLIC_PATHS = ['/login'];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get('accessToken')?.value);
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!hasSession && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
