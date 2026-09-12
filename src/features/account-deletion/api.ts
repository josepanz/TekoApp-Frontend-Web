import { apiFetch } from '@/core/api-client/client';
import { ApiError } from '@/core/api-client/errors';
import type { components } from '@/core/api-client/types.generated';

export type DeletionRequestResponse =
  components['schemas']['DeletionRequestResponseDTO'];
export type DeletionCancelResponse =
  components['schemas']['DeletionCancelResponseDTO'];

export type DeletionBlockerType =
  'ACTIVE_SERVICE' | 'PENDING_PAYMENT' | 'UNSIGNED_CONTRACT' | 'OPEN_DISPUTE';

export interface DeletionBlocker {
  type: DeletionBlockerType;
  count: number;
}

// POST /auth/me/deletion-request (bajo /v1, que agrega resolveBackendPath). Valida bloqueantes
// server-side; si hay alguno, el backend responde 409 con errorCode DELETION_BLOCKED y el detalle
// en `details.blockers` — ver `extractDeletionBlockers` más abajo.
export function requestAccountDeletion(): Promise<DeletionRequestResponse> {
  return apiFetch<DeletionRequestResponse>('auth/me/deletion-request', {
    method: 'POST',
  });
}

// POST /auth/me/deletion-request/cancel — solo válido si hay una solicitud PENDING_DELETION
// activa (400 DELETION_NOT_REQUESTED si no).
export function cancelAccountDeletion(): Promise<DeletionCancelResponse> {
  return apiFetch<DeletionCancelResponse>('auth/me/deletion-request/cancel', {
    method: 'POST',
  });
}

// El backend real envuelve TODO error en `{ success: false, error: { message, errorCode,
// details, ... } }` (`HttpExceptionFilter` en TekoApp-Backend) — pero `parseErrorResponse` de
// `core/api-client/client.ts` solo busca `message` en el nivel superior del body (corrige eso es
// una tarea aparte, toca código compartido por todas las features; acá alcanza con leer
// `error.body` directamente, que sí llega intacto sin parsear). Se acepta también la forma
// "plana" (`{errorCode, details}` sin el wrapper `error`) para no atarse a un solo shape exacto.
export function extractDeletionBlockers(
  error: unknown,
): DeletionBlocker[] | null {
  if (!(error instanceof ApiError) || error.status !== 409) {
    return null;
  }
  const body = error.body;
  if (!body || typeof body !== 'object') {
    return null;
  }
  const container =
    'error' in body && typeof (body as { error?: unknown }).error === 'object'
      ? (body as { error: Record<string, unknown> }).error
      : (body as Record<string, unknown>);

  if (container.errorCode !== 'DELETION_BLOCKED') {
    return null;
  }
  const details = container.details as { blockers?: unknown } | undefined;
  return Array.isArray(details?.blockers)
    ? (details.blockers as DeletionBlocker[])
    : null;
}
