import { apiFetch, uploadFile } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ProfessionalDocument =
  components['schemas']['ProfessionalDocumentResponseDTO'];
export type MyDocumentStatus =
  components['schemas']['MyDocumentStatusResponseDTO'];
export type MyDocumentsListResponse =
  components['schemas']['MyDocumentsListResponseDTO'];
export type AdminProfessionalDocument =
  components['schemas']['AdminProfessionalDocumentResponseDTO'];
export type AdminProfessionalDocumentsListResponse =
  components['schemas']['AdminProfessionalDocumentsListResponseDTO'];
export type ProfessionalDocumentsListResponse =
  components['schemas']['ProfessionalDocumentsListResponseDTO'];
export type ReviewProfessionalDocumentDto =
  components['schemas']['ReviewProfessionalDocumentRequestDTO'];
export type DocumentReviewStatus = ProfessionalDocument['status'];
export type DocumentCategory =
  components['schemas']['ProfessionalDocumentTypeResponseDTO']['category'];

export interface GetAdminProfessionalDocumentsParams {
  page: number;
  pageSize: number;
  status?: DocumentReviewStatus;
  category?: DocumentCategory;
}

// GET /admin/professional-documents (AdminProfessionalDocumentsController_queue) — cola de
// revisión GLOBAL (todos los profesionales), paginada. No estaba en la spec original de esta
// fase — se agregó del lado backend porque sin esto no hay forma real de armar una cola (ver
// TekoApp-Backend/openspec/decisions.md, Fase 0001).
export function getAdminProfessionalDocumentsQueue({
  page,
  pageSize,
  status,
  category,
}: GetAdminProfessionalDocumentsParams): Promise<AdminProfessionalDocumentsListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status) query.set('status', status);
  if (category) query.set('category', category);
  return apiFetch<AdminProfessionalDocumentsListResponse>(
    `admin/professional-documents?${query.toString()}`,
  );
}

// GET /admin/professionals/:referenceId/documents — historial completo (todos los estados) de UN
// profesional puntual. Usado en la pestaña de historial del detalle de profesional.
export function getAdminProfessionalDocumentsByProfessional(
  professionalReferenceId: string,
): Promise<ProfessionalDocumentsListResponse> {
  return apiFetch<ProfessionalDocumentsListResponse>(
    `admin/professionals/${professionalReferenceId}/documents`,
  );
}

export function reviewProfessionalDocument(
  referenceId: string,
  dto: ReviewProfessionalDocumentDto,
): Promise<ProfessionalDocument> {
  return apiFetch<ProfessionalDocument>(
    `admin/professional-documents/${referenceId}/review`,
    { method: 'PATCH', body: JSON.stringify(dto) },
  );
}

// GET /uploads/presigned-url?key= — `fileKey` es una key de S3, nunca cachear la URL resuelta más
// allá de la sesión del diálogo abierto (contenido sensible — antecedentes, títulos).
export function getPresignedUrl(key: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(
    `uploads/presigned-url?key=${encodeURIComponent(key)}`,
  );
}

// GET /professionals/me/documents — cada tipo de documento aplicable a MI categoría, con mi
// documento más recientemente cargado si existe (el backend ya hace el cruce, no hace falta pedir
// el catálogo completo por separado).
export function getMyDocuments(): Promise<MyDocumentStatus[]> {
  return apiFetch<MyDocumentsListResponse>('professionals/me/documents').then(
    (response) => response.data,
  );
}

export function uploadMyDocument(
  file: File,
  professionalDocumentTypeReferenceId: string,
): Promise<ProfessionalDocument> {
  return uploadFile<ProfessionalDocument>('professionals/me/documents', file, {
    fields: { professionalDocumentTypeReferenceId },
  });
}
