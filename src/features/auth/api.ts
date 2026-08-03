import { isBackendEnvelope } from '@/core/api-client/client';
import { ApiError } from '@/core/api-client/errors';
import type { LoginFormValues } from './schemas';

interface LoginResult {
  login: boolean;
  accessToken?: string;
  requiredNewPassword?: boolean;
}

// Pega a /api/auth/login (ruta dedicada, no al proxy genérico /api/backend/*) — ver
// documentation/architecture.md, esta ruta cifra el password con RSA antes de reenviar al backend.
export async function login(values: LoginFormValues): Promise<LoginResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : 'No se pudo iniciar sesión';
    throw new ApiError(response.status, message, body);
  }

  return (
    isBackendEnvelope<LoginResult>(body) ? body.data : body
  ) as LoginResult;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
