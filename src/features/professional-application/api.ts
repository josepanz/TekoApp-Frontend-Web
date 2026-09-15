import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Category = components['schemas']['CategoryDetailResponseDTO'];
export type CreateProfessionalRequest =
  components['schemas']['CreateProfessionalRequestDTO'];
export type Professional =
  components['schemas']['ProfessionalDetailResponseDTO'];

// `GET /categories` (no `/all`) — a diferencia de `features/categories` (admin), acá se necesita
// solo el catálogo público (activo + visible), mismo criterio que `features/request-service`.
export function getActiveCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('categories');
}

export function applyAsProfessional(
  dto: CreateProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>('professionals', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
