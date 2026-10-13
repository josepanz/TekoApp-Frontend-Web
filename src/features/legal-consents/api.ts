import { apiFetch } from '@/core/api-client/client';
import { ApiError } from '@/core/api-client/errors';
import type { components } from '@/core/api-client/types.generated';

export type PendingConsentVersion =
  components['schemas']['LegalDocumentVersionResponseDTO'];
export type ConsentDocumentType = PendingConsentVersion['documentType'];

// GET /legal/consents/pending — versiones vigentes de documentos legales que el usuario aún no
// aceptó.
export function getPendingConsents(): Promise<PendingConsentVersion[]> {
  return apiFetch<PendingConsentVersion[]>('legal/consents/pending');
}

// POST /legal/consents/:versionReferenceId/accept — registra la aceptación (IP y user-agent los
// toma el backend de la request).
export function acceptConsent(versionReferenceId: string): Promise<unknown> {
  return apiFetch<unknown>(`legal/consents/${versionReferenceId}/accept`, {
    method: 'POST',
  });
}

/**
 * `403 CONSENT_REQUIRED` de `@RequiresActiveConsent` (subida de documentos o fotos): el usuario
 * debe aceptar el documento legal vigente antes de reintentar. Distinto de cualquier otro 403.
 */
export function isConsentRequiredError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 403 &&
    error.errorCode === 'CONSENT_REQUIRED'
  );
}
