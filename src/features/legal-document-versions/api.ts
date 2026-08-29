import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type LegalDocumentVersion =
  components['schemas']['LegalDocumentVersionResponseDTO'];
export type LegalDocumentType = LegalDocumentVersion['documentType'];
export type CreateLegalDocumentVersionDto =
  components['schemas']['CreateLegalDocumentVersionRequestDTO'];
export type UpdateLegalDocumentVersionDto =
  components['schemas']['UpdateLegalDocumentVersionRequestDTO'];

// GET /admin/legal/document-versions — catálogo NO paginado (mismo criterio que
// professional-document-types: decenas de versiones, no un log de auditoría).
export function getLegalDocumentVersions(): Promise<LegalDocumentVersion[]> {
  return apiFetch<LegalDocumentVersion[]>('admin/legal/document-versions');
}

export function createLegalDocumentVersion(
  dto: CreateLegalDocumentVersionDto,
): Promise<LegalDocumentVersion> {
  return apiFetch<LegalDocumentVersion>('admin/legal/document-versions', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updateLegalDocumentVersion(
  referenceId: string,
  dto: UpdateLegalDocumentVersionDto,
): Promise<LegalDocumentVersion> {
  return apiFetch<LegalDocumentVersion>(
    `admin/legal/document-versions/${referenceId}`,
    { method: 'PATCH', body: JSON.stringify(dto) },
  );
}
