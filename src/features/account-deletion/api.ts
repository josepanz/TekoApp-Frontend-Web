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

// `errorCode`/`details` ahora vienen tipados en `ApiError` (ver `core/api-client/client.ts`,
// `extractErrorInfo` los saca del envelope real del backend `{success:false,error:{...}}`) — ya
// no hace falta cavar en `error.body` a mano acá.
export function extractDeletionBlockers(
  error: unknown,
): DeletionBlocker[] | null {
  if (!(error instanceof ApiError) || error.status !== 409) {
    return null;
  }
  if (error.errorCode !== 'DELETION_BLOCKED') {
    return null;
  }
  const details = error.details as { blockers?: unknown } | undefined;
  return Array.isArray(details?.blockers)
    ? (details.blockers as DeletionBlocker[])
    : null;
}
