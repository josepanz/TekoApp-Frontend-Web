import {
  apiFetch,
  extractErrorInfo,
  isBackendEnvelope,
} from '@/core/api-client/client';
import { resolvePostLoginPath } from '@/core/auth/landing';
import { ApiError } from '@/core/api-client/errors';
import type { LoginFormValues, RegisterFormValues } from './schemas';

export const INVALID_CREDENTIALS_MESSAGE = 'Email o contraseña incorrectos.';
export const REQUIRED_NEW_PASSWORD_MESSAGE =
  'Tu cuenta necesita crear una contraseña. Usá la opción de recuperar contraseña o contactá a soporte.';

interface LoginResult {
  login: boolean;
  accessToken?: string;
  requiredNewPassword?: boolean;
}

interface RegisterResult {
  referenceId: string;
  email: string;
  status: string;
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
    // 401 -> mensaje generico (el backend responde igual para email inexistente y password
    // incorrecta; no se filtra cual de las dos fallo).
    if (response.status === 401) {
      throw new ApiError(
        401,
        INVALID_CREDENTIALS_MESSAGE,
        body,
        'INVALID_CREDENTIALS',
      );
    }
    // `/api/auth/login` reenvía el body del backend real tal cual en los errores que vienen de
    // ahí (envelope `{success:false,error:{...}}`) — mismo bug que tenía `parseErrorResponse` de
    // `client.ts`, reusa la misma corrección en vez de duplicarla otra vez acá.
    const { message, errorCode, details, fieldErrors, retryAfter } =
      extractErrorInfo(body, 'No se pudo iniciar sesión');
    throw new ApiError(
      response.status,
      message,
      body,
      errorCode,
      details,
      fieldErrors,
      retryAfter,
    );
  }

  const result = (
    isBackendEnvelope<LoginResult>(body) ? body.data : body
  ) as LoginResult;

  // El backend responde 200 con `login:false` cuando NO abrió sesión (no hay cookies): jamás
  // tratarlo como exito. Mocks "pelados" sin el campo `login` se consideran exito (compat).
  if (result.login === false) {
    if (result.requiredNewPassword) {
      // Usuario legacy sin credencial. Web todavia no tiene pantalla de "crear contraseña"
      // (el endpoint `auth/create-password` existe en el backend) -> se informa como error.
      throw new ApiError(
        200,
        REQUIRED_NEW_PASSWORD_MESSAGE,
        body,
        'REQUIRED_NEW_PASSWORD',
      );
    }
    throw new ApiError(200, 'No se pudo iniciar sesión', body, 'LOGIN_FAILED');
  }

  return result;
}

// Destino tras el login: `from` si existe; si no, segun rol (staff/compliance/profesional/cliente).
// Los permisos salen de `GET /auth/scope` y el perfil profesional de `GET /professionals/me` (404 si
// no es profesional). Cualquier falla degrada a `/` (home del cliente), nunca bloquea el login.
export async function getPostLoginPath(from?: string | null): Promise<string> {
  const [scope, professional] = await Promise.allSettled([
    apiFetch<{ permissions: { name: string }[] }>('auth/scope'),
    apiFetch<unknown>('professionals/me'),
  ]);
  return resolvePostLoginPath({
    from,
    permissions:
      scope.status === 'fulfilled'
        ? scope.value.permissions.map((p) => p.name)
        : [],
    isProfessional: professional.status === 'fulfilled' && !!professional.value,
  });
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

// Pega a /api/auth/register (ruta dedicada, no al proxy genérico /api/backend/*) — mismo motivo
// que login: cifra password/confirmPassword con RSA antes de reenviar al backend (POST /onboarding).
export async function register(
  values: RegisterFormValues,
): Promise<RegisterResult> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const { message, errorCode, details, fieldErrors, retryAfter } =
      extractErrorInfo(body, 'No se pudo crear la cuenta');
    throw new ApiError(
      response.status,
      message,
      body,
      errorCode,
      details,
      fieldErrors,
      retryAfter,
    );
  }

  return (
    isBackendEnvelope<RegisterResult>(body) ? body.data : body
  ) as RegisterResult;
}
