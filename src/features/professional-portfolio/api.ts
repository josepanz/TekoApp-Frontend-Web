import { apiFetch, uploadFile } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type PortfolioItem = components['schemas']['PortfolioItemResponseDTO'];
export type PortfolioItemsListResponse =
  components['schemas']['PortfolioItemsListResponseDTO'];
export type AdminPortfolioItem =
  components['schemas']['AdminPortfolioItemResponseDTO'];
export type AdminPortfolioItemsListResponse =
  components['schemas']['AdminPortfolioItemsListResponseDTO'];
export type UpdatePortfolioItemDto =
  components['schemas']['UpdatePortfolioItemRequestDTO'];
export type ReviewPortfolioItemDto =
  components['schemas']['ReviewPortfolioItemRequestDTO'];
export type PortfolioReviewStatus = PortfolioItem['status'];

export function getMyPortfolio(): Promise<PortfolioItemsListResponse> {
  return apiFetch<PortfolioItemsListResponse>('professionals/me/portfolio');
}

// POST /professionals/me/portfolio — multipart (campo `file` + `caption` opcional). Gateado por
// consentimiento de imagen del lado backend (`IMAGE_USAGE_CONSENT`) — un 403 CONSENT_REQUIRED se
// propaga como cualquier otro ApiError, sin manejo especial acá.
export function uploadPortfolioItem(
  file: File,
  caption?: string,
): Promise<PortfolioItem> {
  return uploadFile<PortfolioItem>('professionals/me/portfolio', file, {
    fields: caption ? { caption } : undefined,
  });
}

export function updatePortfolioItem(
  referenceId: string,
  dto: UpdatePortfolioItemDto,
): Promise<PortfolioItem> {
  return apiFetch<PortfolioItem>(`professionals/me/portfolio/${referenceId}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export function deletePortfolioItem(referenceId: string): Promise<void> {
  return apiFetch<void>(`professionals/me/portfolio/${referenceId}`, {
    method: 'DELETE',
  });
}

// GET /professionals/:referenceId/portfolio/public — solo APPROVED + isVisible:true, lo que ve
// un cliente navegando el perfil de un profesional.
export function getPublicPortfolio(
  professionalReferenceId: string,
): Promise<PortfolioItemsListResponse> {
  return apiFetch<PortfolioItemsListResponse>(
    `professionals/${professionalReferenceId}/portfolio/public`,
  );
}

export interface GetAdminPortfolioQueueParams {
  page: number;
  pageSize: number;
  status?: PortfolioReviewStatus;
}

export function getAdminPortfolioQueue({
  page,
  pageSize,
  status,
}: GetAdminPortfolioQueueParams): Promise<AdminPortfolioItemsListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status) query.set('status', status);
  return apiFetch<AdminPortfolioItemsListResponse>(
    `admin/professional-portfolio?${query.toString()}`,
  );
}

export function reviewPortfolioItem(
  referenceId: string,
  dto: ReviewPortfolioItemDto,
): Promise<PortfolioItem> {
  return apiFetch<PortfolioItem>(
    `admin/professional-portfolio/${referenceId}/review`,
    { method: 'PATCH', body: JSON.stringify(dto) },
  );
}

// GET /uploads/presigned-url?key= — mismo endpoint genérico ya usado por professional-documents/
// service-progress, `fileKey` acá son fotos públicas (no sensibles) pero igual se resuelve fresco.
export function getPresignedUrl(key: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(
    `uploads/presigned-url?key=${encodeURIComponent(key)}`,
  );
}
