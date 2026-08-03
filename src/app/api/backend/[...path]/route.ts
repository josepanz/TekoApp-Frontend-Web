import type { NextRequest } from 'next/server';
import { proxyToBackend } from '@/core/api-client/backend-proxy';

// Proxy reverso genérico — TODAS las llamadas de dominio (users, professionals, services,
// payments, etc.) pasan por acá. Ver core/api-client/backend-proxy.ts y
// documentation/architecture.md. El browser nunca conoce la URL real del backend.
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  return proxyToBackend(request, path.join('/'));
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
