import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ProfessionalDocumentType =
  components['schemas']['ProfessionalDocumentTypeResponseDTO'];
export type ProfessionalDocumentTypesListResponse =
  components['schemas']['ProfessionalDocumentTypesListResponseDTO'];
export type CreateProfessionalDocumentTypeDto =
  components['schemas']['CreateProfessionalDocumentTypeRequestDTO'];
export type UpdateProfessionalDocumentTypeDto =
  components['schemas']['UpdateProfessionalDocumentTypeRequestDTO'];

// GET /professional-document-types (ProfessionalDocumentTypesController_list) — catálogo
// completo, NO paginado (es un catálogo acotado — decenas de filas, no un log de auditoría — ver
// TekoApp-Backend/openspec/decisions.md, Fase 0001). Sin filtros desde el panel admin: se trae
// todo y se deja que la tabla filtre client-side si hiciera falta.
export function getProfessionalDocumentTypes(): Promise<
  ProfessionalDocumentType[]
> {
  return apiFetch<ProfessionalDocumentTypesListResponse>(
    'professional-document-types',
  ).then((response) => response.data);
}

export function createProfessionalDocumentType(
  dto: CreateProfessionalDocumentTypeDto,
): Promise<ProfessionalDocumentType> {
  return apiFetch<ProfessionalDocumentType>(
    'admin/professional-document-types',
    {
      method: 'POST',
      body: JSON.stringify(dto),
    },
  );
}

export function updateProfessionalDocumentType(
  referenceId: string,
  dto: UpdateProfessionalDocumentTypeDto,
): Promise<ProfessionalDocumentType> {
  return apiFetch<ProfessionalDocumentType>(
    `admin/professional-document-types/${referenceId}`,
    { method: 'PATCH', body: JSON.stringify(dto) },
  );
}
