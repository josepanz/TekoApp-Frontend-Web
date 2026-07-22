import { NextResponse } from 'next/server';

// El backend no tiene endpoint de logout — alcanza con limpiar las cookies desde nuestro propio
// dominio (el access token expira en 15 min de cualquier forma). Ver architecture.md.
export function POST(): Response {
  const response = NextResponse.json({ success: true });
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
  return response;
}
