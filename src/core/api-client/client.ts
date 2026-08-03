import { ApiError } from './errors';

// El backend real envuelve TODA respuesta exitosa en `{ success, data, message, timestamp, path }`
// vía un `TransformInterceptor` global (ver TekoApp-Backend `core/interceptors/transform.interceptor.ts`,
// registrado en `core/config/middleware.config.ts`) — nunca devuelve el DTO "pelado". Los mocks de
// MSW/fake-backend usados en tests SÍ devuelven el DTO sin envolver, así que el unwrap acá es
// defensivo: solo desenvuelve si el body calza con la forma del envelope, dejando pasar sin
// cambios cualquier respuesta ya "pelada" (para no romper los mocks existentes).
interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

export function isBackendEnvelope<T>(
  body: unknown,
): body is BackendEnvelope<T> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    typeof (body as { success: unknown }).success === 'boolean' &&
    'data' in body
  );
}

/**
 * Cliente de datos usado por `features/*\/api.ts` en Client Components (hooks de TanStack Query).
 * SIEMPRE pega a `/api/backend/*` (el proxy BFF) — nunca a la URL real del backend, que ni
 * siquiera está disponible en este contexto (solo vive en env vars server-only).
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : `Error ${response.status} en ${path}`;
    throw new ApiError(response.status, message, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json();
  return (isBackendEnvelope<T>(body) ? body.data : body) as T;
}

/**
 * Sube un archivo vía `multipart/form-data` (avatar, documentos, etc.). NUNCA reusar `apiFetch`
 * para esto — fuerza `Content-Type: application/json`, que rompe el multipart. Acá se deja que
 * el browser calcule el `Content-Type` (con el boundary) automáticamente al pasar un `FormData`.
 */
export async function uploadFile<T>(
  path: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`/api/backend/${path}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String((body as { message: unknown }).message)
        : `Error ${response.status} en ${path}`;
    throw new ApiError(response.status, message, body);
  }

  const body: unknown = await response.json();
  return (isBackendEnvelope<T>(body) ? body.data : body) as T;
}
